from fastapi import FastAPI, Request, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
from dotenv import load_dotenv
from deepface import DeepFace
import cv2
import numpy as np
import tempfile
import shutil

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Haar cascade once globally
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.post("/api/ai-chatbot")
async def ai_chatbot(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    chat_history = data.get("chatHistory", [])

    messages = chat_history + [{"role": "user", "content": user_message}]

    def event_stream():
        try:
            completion = client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=messages,
                temperature=1,
                max_completion_tokens=1024,
                top_p=1,
                stream=True,
                stop=None
            )
            for chunk in completion:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            yield f"Error: {str(e)}"

    return StreamingResponse(event_stream(), media_type="text/plain")

@app.post("/api/analyze-emotion")
async def analyze_emotion(image: UploadFile = File(...)):
    try:
        # Read the image file
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid image format"}
            )

        # Convert to grayscale for face detection
        gray_frame = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        rgb_frame = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Detect faces
        faces = face_cascade.detectMultiScale(
            gray_frame,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )

        if len(faces) == 0:
            return JSONResponse(
                status_code=400,
                content={"error": "No face detected in the image"}
            )

        # Get the first face
        x, y, w, h = faces[0]
        face_roi = rgb_frame[y:y+h, x:x+w]

        # Analyze emotion
        result = DeepFace.analyze(
            face_roi,
            actions=['emotion'],
            enforce_detection=False
        )

        # Get the dominant emotion and its confidence
        emotions = result[0]['emotion']
        dominant_emotion = max(emotions.items(), key=lambda x: x[1])
        
        return JSONResponse({
            "emotion": dominant_emotion[0],
            "confidence": dominant_emotion[1] / 100  # Convert to 0-1 scale
        })

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        ) 