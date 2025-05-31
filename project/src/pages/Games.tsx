import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wind, Heart, Award, Info, X } from 'lucide-react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: () => boolean;
  unlocked: boolean;
}

const Games: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTimer, setPhaseTimer] = useState(4);
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-breath',
      title: 'First Breath',
      description: 'Complete your first breathing cycle',
      icon: <Wind className="h-6 w-6 text-primary-600" />,
      condition: () => score >= 1,
      unlocked: false
    },
    {
      id: 'mindful-master',
      title: 'Mindful Master',
      description: 'Complete 5 breathing cycles',
      icon: <Heart className="h-6 w-6 text-primary-600" />,
      condition: () => score >= 5,
      unlocked: false
    },
    {
      id: 'zen-zone',
      title: 'Zen Zone',
      description: 'Stay focused for 10 breathing cycles',
      icon: <Award className="h-6 w-6 text-primary-600" />,
      condition: () => score >= 10,
      unlocked: false
    }
  ]);

  const createBubble = useCallback(() => {
    const newBubble: Bubble = {
      id: Date.now(),
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 100,
      scale: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.2
    };
    setBubbles(prev => [...prev, newBubble]);
  }, []);

  const removeBubble = useCallback((id: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setShowInstructions(false);
    setBreathingPhase('inhale');
    setPhaseTimer(4);
    setScore(0);
  };

  const checkAchievements = useCallback(() => {
    setAchievements(prev => 
      prev.map(achievement => ({
        ...achievement,
        unlocked: achievement.condition()
      }))
    );
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPhaseTimer(prev => {
        if (prev <= 0) {
          switch (breathingPhase) {
            case 'inhale':
              setBreathingPhase('hold');
              return 7;
            case 'hold':
              setBreathingPhase('exhale');
              return 8;
            case 'exhale':
              setBreathingPhase('inhale');
              setScore(prev => prev + 1);
              checkAchievements();
              return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, breathingPhase, checkAchievements]);

  useEffect(() => {
    if (!isPlaying) return;

    const bubbleInterval = setInterval(createBubble, 2000);
    return () => clearInterval(bubbleInterval);
  }, [isPlaying, createBubble]);

  useEffect(() => {
    const unlockedAchievement = achievements.find(a => a.condition() && !a.unlocked);
    if (unlockedAchievement) {
      checkAchievements();
      // Show achievement notification here
    }
  }, [score, achievements, checkAchievements]);

  return (
    <div className="slide-up min-h-screen bg-gradient-to-b from-primary-50 to-accent-50 relative overflow-hidden">
      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-neutral-900">Breathing Bubbles</h2>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-neutral-600">
                  Welcome to Breathing Bubbles, a mindful breathing exercise that helps reduce stress
                  and promote relaxation.
                </p>
                <div className="space-y-2">
                  <h3 className="font-medium text-neutral-800">How to Play:</h3>
                  <ul className="list-disc list-inside text-neutral-600 space-y-1">
                    <li>Follow the breathing guide on screen</li>
                    <li>Inhale as the circle expands (4 seconds)</li>
                    <li>Hold your breath (7 seconds)</li>
                    <li>Exhale slowly (8 seconds)</li>
                  </ul>
                </div>
                <p className="text-neutral-600">
                  This is based on the 4-7-8 breathing technique, known to help reduce anxiety and
                  improve sleep quality.
                </p>
                <button
                  onClick={startGame}
                  className="w-full btn btn-primary"
                >
                  Start Breathing Exercise
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game UI */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Breathing Bubbles</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAchievements(true)}
              className="btn btn-outline"
            >
              <Award className="h-5 w-5 mr-2" />
              Achievements
            </button>
            <button
              onClick={() => setShowInstructions(true)}
              className="btn btn-outline"
            >
              <Info className="h-5 w-5 mr-2" />
              Instructions
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Floating Bubbles */}
          <AnimatePresence>
            {bubbles.map(bubble => (
              <motion.div
                key={bubble.id}
                initial={{ y: bubble.y, x: bubble.x, scale: bubble.scale, opacity: bubble.opacity }}
                animate={{
                  y: -100,
                  transition: { duration: 8, ease: "linear" }
                }}
                exit={{ opacity: 0 }}
                onAnimationComplete={() => removeBubble(bubble.id)}
                className="absolute w-16 h-16 rounded-full bg-primary-200"
              />
            ))}
          </AnimatePresence>

          {/* Breathing Circle */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: breathingPhase === 'inhale' ? 1.5 : 
                         breathingPhase === 'hold' ? 1.5 : 1,
                  opacity: breathingPhase === 'exhale' ? 0.5 : 1
                }}
                transition={{ duration: breathingPhase === 'inhale' ? 4 : 
                                     breathingPhase === 'hold' ? 7 : 8 }}
                className="w-48 h-48 bg-primary-100 rounded-full flex items-center justify-center"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-700 mb-2">
                    {breathingPhase === 'inhale' ? 'Inhale' :
                     breathingPhase === 'hold' ? 'Hold' : 'Exhale'}
                  </p>
                  <p className="text-xl text-primary-600">{phaseTimer}s</p>
                </div>
              </motion.div>
            </div>
          )}

          {/* Score and Progress */}
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-4">
            <p className="text-lg font-medium text-neutral-900">
              Breathing Cycles: {score}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex justify-center">
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="btn btn-primary px-8"
            >
              Start Exercise
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(false)}
              className="btn btn-outline px-8"
            >
              End Exercise
            </button>
          )}
        </div>
      </div>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">Achievements</h2>
                <button
                  onClick={() => setShowAchievements(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-neutral-200 bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`${
                        achievement.unlocked ? 'text-primary-600' : 'text-neutral-400'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="ml-3">
                        <h3 className={`font-medium ${
                          achievement.unlocked ? 'text-primary-900' : 'text-neutral-500'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${
                          achievement.unlocked ? 'text-primary-600' : 'text-neutral-400'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Games;