import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Activity, Dumbbell, Cog as Yoga, Heart, Clock, AlertTriangle, ChevronDown, ChevronUp, Info, Check } from 'lucide-react';

interface AssessmentFormData {
  energyLevel: number;
  stressLevel: number;
  physicalDiscomfort: string;
  timeAvailable: '15' | '30' | '45' | '60';
  fitnessGoals: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

interface Exercise {
  id: string;
  name: string;
  type: 'exercise' | 'yoga';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  repetitions?: string;
  sets?: number;
  description: string;
  instructions: string[];
  benefits: string[];
  precautions: string[];
  modifications: string[];
  image: string;
  targetAreas: string[];
}

const WellnessAdvisor: React.FC = () => {
  const [showAssessment, setShowAssessment] = useState(true);
  const [recommendations, setRecommendations] = useState<Exercise[]>([]);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  
  const { register, handleSubmit, watch } = useForm<AssessmentFormData>({
    defaultValues: {
      energyLevel: 5,
      stressLevel: 5,
      timeAvailable: '30',
      fitnessGoals: [],
      experienceLevel: 'beginner'
    }
  });

  const energyLevel = watch('energyLevel');
  const stressLevel = watch('stressLevel');
  
  // Exercise database
  const exercises: Exercise[] = [
    {
      id: 'cat-cow',
      name: 'Cat-Cow Stretch',
      type: 'yoga',
      difficulty: 'beginner',
      duration: 5,
      description: 'A gentle flow between two poses that helps improve spine flexibility and reduces stress.',
      instructions: [
        'Start on your hands and knees in a tabletop position',
        'Inhale: Drop your belly, lift your chest and tailbone (Cow)',
        'Exhale: Round your spine, tuck your chin (Cat)',
        'Flow between positions with your breath'
      ],
      benefits: [
        'Improves spine flexibility',
        'Reduces stress and anxiety',
        'Calms the mind',
        'Strengthens core muscles'
      ],
      precautions: [
        'Avoid if you have severe back pain',
        'Keep movements gentle and controlled',
        'Stop if you feel any pain'
      ],
      modifications: [
        'Can be done seated in a chair',
        'Reduce range of motion if needed'
      ],
      image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      targetAreas: ['spine', 'core', 'stress relief']
    },
    {
      id: 'mountain-pose',
      name: 'Mountain Pose',
      type: 'yoga',
      difficulty: 'beginner',
      duration: 3,
      description: 'A foundational standing pose that improves posture and body awareness.',
      instructions: [
        'Stand with feet hip-width apart',
        'Ground through all four corners of your feet',
        'Engage your core and lengthen your spine',
        'Relax your shoulders and breathe deeply'
      ],
      benefits: [
        'Improves posture',
        'Increases body awareness',
        'Reduces anxiety',
        'Strengthens legs and core'
      ],
      precautions: [
        'Avoid locking your knees',
        'Keep breathing steady',
        'Maintain natural spine curves'
      ],
      modifications: [
        'Can be done seated',
        'Use wall for support if needed'
      ],
      image: 'https://images.pexels.com/photos/5726698/pexels-photo-5726698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      targetAreas: ['posture', 'balance', 'mindfulness']
    },
    {
      id: 'walking',
      name: 'Mindful Walking',
      type: 'exercise',
      difficulty: 'beginner',
      duration: 15,
      description: 'A low-impact cardio exercise that combines physical activity with mindfulness.',
      instructions: [
        'Start with a comfortable pace',
        'Focus on your breathing',
        'Notice the sensation of each step',
        'Observe your surroundings mindfully'
      ],
      benefits: [
        'Improves cardiovascular health',
        'Reduces stress and anxiety',
        'Enhances mindfulness',
        'Boosts mood'
      ],
      precautions: [
        'Stay hydrated',
        'Wear appropriate footwear',
        'Be aware of your surroundings'
      ],
      modifications: [
        'Can be done indoors',
        'Adjust pace as needed',
        'Use support if necessary'
      ],
      image: 'https://images.pexels.com/photos/4149273/pexels-photo-4149273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      targetAreas: ['cardio', 'mindfulness', 'stress relief']
    },
    {
      id: 'body-scan',
      name: 'Progressive Body Scan',
      type: 'exercise',
      difficulty: 'beginner',
      duration: 10,
      description: 'A mindfulness exercise that involves systematically focusing attention on different parts of your body.',
      instructions: [
        'Lie down in a comfortable position',
        'Close your eyes and focus on your breath',
        'Gradually scan from toes to head',
        'Notice and release tension in each area'
      ],
      benefits: [
        'Reduces physical tension',
        'Improves body awareness',
        'Promotes relaxation',
        'Helps with stress management'
      ],
      precautions: [
        'Find a quiet, comfortable space',
        'Avoid falling asleep',
        'Keep breathing steady'
      ],
      modifications: [
        'Can be done seated',
        'Shorten duration if needed',
        'Focus on specific areas of tension'
      ],
      image: 'https://images.pexels.com/photos/3759658/pexels-photo-3759658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      targetAreas: ['relaxation', 'mindfulness', 'stress relief']
    }
  ];
  
  const getRecommendations = (data: AssessmentFormData): Exercise[] => {
    let recommended: Exercise[] = [];
    
    // High stress, low energy
    if (data.stressLevel > 7 && data.energyLevel < 4) {
      recommended = exercises.filter(e => 
        e.type === 'yoga' || 
        e.targetAreas.includes('relaxation')
      );
    }
    // High energy, low stress
    else if (data.energyLevel > 7 && data.stressLevel < 4) {
      recommended = exercises.filter(e => 
        e.type === 'exercise' || 
        e.targetAreas.includes('cardio')
      );
    }
    // Balanced or other cases
    else {
      recommended = exercises.filter(e => 
        e.difficulty === data.experienceLevel ||
        e.targetAreas.includes('mindfulness')
      );
    }
    
    // Filter by available time
    recommended = recommended.filter(e => 
      e.duration <= parseInt(data.timeAvailable)
    );
    
    // Sort by relevance to goals
    recommended.sort((a, b) => {
      const aRelevance = a.targetAreas.filter(t => 
        data.fitnessGoals.includes(t)
      ).length;
      const bRelevance = b.targetAreas.filter(t => 
        data.fitnessGoals.includes(t)
      ).length;
      return bRelevance - aRelevance;
    });
    
    return recommended.slice(0, 3); // Return top 3 recommendations
  };
  
  const onSubmit = (data: AssessmentFormData) => {
    const recommended = getRecommendations(data);
    setRecommendations(recommended);
    setShowAssessment(false);
  };
  
  const toggleExercise = (id: string) => {
    setExpandedExercise(expandedExercise === id ? null : id);
  };
  
  return (
    <div className="slide-up">
      <h1 className="page-title">Wellness Advisor</h1>
      
      {showAssessment ? (
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Current State Assessment
            </h2>
            <p className="text-neutral-600">
              Let's evaluate your current condition to provide personalized exercise recommendations.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="form-label flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Energy Level ({energyLevel}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                {...register('energyLevel', { valueAsNumber: true })}
              />
              <div className="flex justify-between mt-1 text-xs text-neutral-500">
                <span>Very Low</span>
                <span>Moderate</span>
                <span>Very High</span>
              </div>
            </div>
            
            <div>
              <label className="form-label flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Stress Level ({stressLevel}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                {...register('stressLevel', { valueAsNumber: true })}
              />
              <div className="flex justify-between mt-1 text-xs text-neutral-500">
                <span>Very Low</span>
                <span>Moderate</span>
                <span>Very High</span>
              </div>
            </div>
            
            <div>
              <label className="form-label flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Physical Discomfort
              </label>
              <textarea
                className="input"
                placeholder="Describe any physical discomfort or pain you're experiencing..."
                {...register('physicalDiscomfort')}
              ></textarea>
            </div>
            
            <div>
              <label className="form-label flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Time Available
              </label>
              <select className="input" {...register('timeAvailable')}>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Experience Level</label>
              <select className="input" {...register('experienceLevel')}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Fitness Goals</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="stress relief"
                    className="form-checkbox h-4 w-4 text-primary-600"
                    {...register('fitnessGoals')}
                  />
                  <span className="ml-2 text-neutral-700">Stress Relief</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="flexibility"
                    className="form-checkbox h-4 w-4 text-primary-600"
                    {...register('fitnessGoals')}
                  />
                  <span className="ml-2 text-neutral-700">Improve Flexibility</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="strength"
                    className="form-checkbox h-4 w-4 text-primary-600"
                    {...register('fitnessGoals')}
                  />
                  <span className="ml-2 text-neutral-700">Build Strength</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="mindfulness"
                    className="form-checkbox h-4 w-4 text-primary-600"
                    {...register('fitnessGoals')}
                  />
                  <span className="ml-2 text-neutral-700">Practice Mindfulness</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Get Recommendations
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Personalized Recommendations
            </h2>
            <button
              className="btn btn-outline"
              onClick={() => setShowAssessment(true)}
            >
              New Assessment
            </button>
          </div>
          
          <div className="space-y-6">
            {recommendations.map(exercise => (
              <div key={exercise.id} className="card overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center">
                      <span className={`p-1.5 rounded-md mr-2 bg-white/90 ${
                        exercise.type === 'yoga' ? 'text-accent-600' : 'text-primary-600'
                      }`}>
                        {exercise.type === 'yoga' ? <Yoga className="h-5 w-5" /> : <Dumbbell className="h-5 w-5" />}
                      </span>
                      <span className="text-white font-medium capitalize">{exercise.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900">{exercise.name}</h3>
                      <p className="text-neutral-600 mt-1">{exercise.description}</p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-neutral-500 mr-1" />
                      <span className="text-sm text-neutral-500">{exercise.duration} min</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exercise.targetAreas.map(area => (
                      <span
                        key={area}
                        className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    className="w-full text-left"
                    onClick={() => toggleExercise(exercise.id)}
                  >
                    <div className="flex items-center justify-between text-primary-600 hover:text-primary-700">
                      <span className="font-medium">View Details</span>
                      {expandedExercise === exercise.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  
                  {expandedExercise === exercise.id && (
                    <div className="mt-4 space-y-6 animate-[slideDown_0.2s_ease-out]">
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-2">Instructions</h4>
                        <ol className="list-decimal list-inside space-y-2 text-neutral-600">
                          {exercise.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-2">Benefits</h4>
                        <ul className="space-y-2">
                          {exercise.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-success-50 p-1 rounded-full mr-2 mt-0.5">
                                <Check className="h-3 w-3 text-success-500" />
                              </span>
                              <span className="text-neutral-600">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-2">Safety Guidelines</h4>
                        <div className="bg-warning-50 border border-warning-100 rounded-lg p-4">
                          <ul className="space-y-2">
                            {exercise.precautions.map((precaution, index) => (
                              <li key={index} className="flex items-start">
                                <AlertTriangle className="h-4 w-4 text-warning-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-warning-700">{precaution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-2">Modifications</h4>
                        <ul className="space-y-2">
                          {exercise.modifications.map((modification, index) => (
                            <li key={index} className="flex items-start">
                              <Info className="h-4 w-4 text-neutral-500 mr-2 mt-0.5" />
                              <span className="text-neutral-600">{modification}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessAdvisor;