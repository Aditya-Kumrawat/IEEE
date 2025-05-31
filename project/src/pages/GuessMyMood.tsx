import React from 'react';
import { Smile } from 'lucide-react';

const GuessMyMood: React.FC = () => {
  return (
    <div className="page-container slide-up flex justify-center items-center min-h-[70vh]">
      <div className="card p-8 w-full max-w-xl mx-auto flex flex-col items-center">
        <Smile className="h-16 w-16 text-primary-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-center">Guess My Mood</h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-center mb-4">
          This feature is coming soon! Here, you'll be able to play a fun game where the app tries to guess your mood based on your input.
        </p>
      </div>
    </div>
  );
};

export default GuessMyMood; 