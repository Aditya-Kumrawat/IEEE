import React, { useRef, useEffect, useState } from 'react';
import { Camera, AlertTriangle, Loader2 } from 'lucide-react';

interface FacialRecognitionProps {
  onEmotionDetected: (emotion: string, confidence: number) => void;
  isProcessing: boolean;
}

const FacialRecognition: React.FC<FacialRecognitionProps> = ({ onEmotionDetected, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
          setError(null);
        }
      } catch (err) {
        setError('Unable to access camera. Please make sure you have granted camera permissions.');
        setIsCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', 0.95); // Higher quality
    });
  };

  const analyzeEmotion = async () => {
    if (isProcessing || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const imageBlob = await captureFrame();
      if (!imageBlob) {
        throw new Error('Failed to capture image');
      }

      const formData = new FormData();
      formData.append('image', imageBlob);

      const response = await fetch('/api/analyze-emotion', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze emotion');
      }

      const data = await response.json();
      onEmotionDetected(data.emotion, data.confidence);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze emotion. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
        {!isCameraActive ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-12 w-12 text-neutral-400" />
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-error-50 text-error-700 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={analyzeEmotion}
        disabled={!isCameraActive || isProcessing || isAnalyzing}
        className="mt-4 w-full btn btn-primary flex items-center justify-center"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Analyze Emotion'
        )}
      </button>
    </div>
  );
};

export default FacialRecognition; 