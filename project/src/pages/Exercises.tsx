import React, { useState } from 'react';
import { 
  Dumbbell, 
  Timer, 
  Award, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Heart,
  Brain,
  Sparkles
} from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Physical' | 'Mental' | 'Breathing';
  points: number;
  completed: boolean;
}

const Exercises: React.FC = () => {
  const [exercises] = useState<Exercise[]>([
    {
      id: '1',
      title: 'Mindful Breathing',
      description: 'Practice deep breathing exercises to reduce stress and anxiety. Focus on your breath and let your thoughts pass by.',
      duration: '5 minutes',
      difficulty: 'Beginner',
      category: 'Breathing',
      points: 10,
      completed: false
    },
    {
      id: '2',
      title: 'Body Scan Meditation',
      description: 'Lie down and systematically focus your attention on different parts of your body, from toes to head.',
      duration: '10 minutes',
      difficulty: 'Beginner',
      category: 'Mental',
      points: 15,
      completed: false
    },
    {
      id: '3',
      title: 'Gentle Yoga Flow',
      description: 'A series of gentle yoga poses to improve flexibility and reduce tension.',
      duration: '15 minutes',
      difficulty: 'Intermediate',
      category: 'Physical',
      points: 20,
      completed: false
    },
    {
      id: '4',
      title: 'Gratitude Journaling',
      description: 'Write down three things you\'re grateful for today and reflect on why they matter to you.',
      duration: '10 minutes',
      difficulty: 'Beginner',
      category: 'Mental',
      points: 15,
      completed: false
    },
    {
      id: '5',
      title: 'Progressive Muscle Relaxation',
      description: 'Systematically tense and relax different muscle groups to reduce physical tension.',
      duration: '15 minutes',
      difficulty: 'Intermediate',
      category: 'Physical',
      points: 20,
      completed: false
    }
  ]);

  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const handleCompleteExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise && !exercise.completed) {
      exercise.completed = true;
      setTotalPoints(prev => prev + exercise.points);
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    if (selectedCategory !== 'All' && exercise.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'All' && exercise.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 dark:text-green-400';
      case 'Intermediate':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Advanced':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-neutral-600 dark:text-neutral-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Physical':
        return <Dumbbell className="h-5 w-5" />;
      case 'Mental':
        return <Brain className="h-5 w-5" />;
      case 'Breathing':
        return <Heart className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="page-container slide-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Wellness Exercises</h1>
        <div className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/40 px-4 py-2 rounded-lg">
          <Award className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <span className="font-medium text-primary-800 dark:text-primary-300">
            {totalPoints} MedP Points
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        >
          <option value="All">All Categories</option>
          <option value="Physical">Physical</option>
          <option value="Mental">Mental</option>
          <option value="Breathing">Breathing</option>
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        >
          <option value="All">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className={`card p-6 transition-all duration-200 ${
              exercise.completed
                ? 'bg-neutral-50 dark:bg-neutral-800/50'
                : 'hover:shadow-lg'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(exercise.category)}
                <span className={`text-sm font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">{exercise.points} MedP</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {exercise.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {exercise.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{exercise.duration}</span>
              </div>

              {exercise.completed ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <button
                  onClick={() => handleCompleteExercise(exercise.id)}
                  className="btn btn-primary text-sm"
                >
                  Start Exercise
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="mt-8 card p-6 bg-white dark:bg-neutral-900/80">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Your Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Points</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {totalPoints}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Completed</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {exercises.filter(ex => ex.completed).length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Timer className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Next Level</p>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {Math.max(0, 100 - totalPoints)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercises; 