import React, { useState } from 'react';
import { Smile, Camera, CheckCircle2 } from 'lucide-react';
import FacialRecognition from '../components/FacialRecognition';
import { useUserData } from '../context/UserDataContext';

const EMOTION_TO_MOOD: { [key: string]: number } = {
  'happy': 9,
  'joy': 10,
  'excited': 8,
  'neutral': 5,
  'sad': 2,
  'angry': 1,
  'fear': 3,
  'surprise': 7,
  'disgust': 2,
  'contempt': 2
};

const GuessMyMood: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const { addMoodLog } = useUserData();

  const handleEmotionDetected = (emotion: string, confidence: number) => {
    setDetectedEmotion(emotion);
    setConfidence(confidence);
    setIsProcessing(false);

    // Convert emotion to mood value and log it
    const moodValue = EMOTION_TO_MOOD[emotion.toLowerCase()] || 5;
    addMoodLog({
      value: moodValue,
      note: `Detected emotion: ${emotion} (confidence: ${Math.round(confidence * 100)}%)`
    });
  };

  const handleAnalyzeClick = () => {
    setIsProcessing(true);
  };

  return (
    <div className="page-container slide-up">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Smile className="h-16 w-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Guess My Mood</h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Let our AI analyze your facial expression to detect your current mood.
          </p>
        </div>

        <div className="card p-6 mb-6">
          <FacialRecognition
            onEmotionDetected={handleEmotionDetected}
            isProcessing={isProcessing}
          />
        </div>

        {detectedEmotion && (
          <div className="card p-6 bg-primary-50 dark:bg-primary-900/20">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary-500 mr-2" />
              <h2 className="text-xl font-semibold">Emotion Detected!</h2>
            </div>
            <div className="text-center">
              <p className="text-lg mb-2">
                We detected that you're feeling <span className="font-semibold">{detectedEmotion}</span>
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Confidence: {Math.round(confidence! * 100)}%
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p>Your mood has been automatically logged in your journal.</p>
          <p className="mt-2">
            Note: This feature uses your device's camera to analyze facial expressions.
            No images are stored or shared.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuessMyMood; 