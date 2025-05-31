from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from groq import Groq
import os

app = FastAPI()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.post("/api/ai-chatbot")
async def ai_chatbot(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    chat_history = data.get("chatHistory", [])

    messages = chat_history + [{"role": "user", "content": user_message}]

    def event_stream():
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=messages,
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=True,
            stop=None,
        )
        for chunk in completion:
            content = chunk.choices[0].delta.content or ""
            yield content

    return StreamingResponse(event_stream(), media_type="text/plain")