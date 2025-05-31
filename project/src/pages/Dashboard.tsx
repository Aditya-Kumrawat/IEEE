import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Line,
  Bar, 
  Radar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useUserData, AssessmentResult, MoodLog } from '../context/UserDataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  LineChart, 
  BookOpen, 
  ArrowUpRight,
  Activity,
  Award,
  Smile,
  Heart
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    assessments, 
    moodLogs, 
    journalEntries, 
    getLatestAssessment, 
    getMoodTrend
  } = useUserData();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  const latestAssessment = getLatestAssessment();
  const recentMoods = getMoodTrend(timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365);
  
  // Format mood data for chart
  const moodChartData = {
    labels: recentMoods.map(log => {
      const date = new Date(log.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Mood',
        data: recentMoods.map(log => log.value),
        fill: 'start',
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        borderColor: 'rgba(74, 144, 226, 1)',
        tension: 0.4,
      },
    ],
  };
  
  const moodChartOptions = {
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };
  
  // Format assessment data for radar chart
  const radarChartData = latestAssessment ? {
    labels: ['Anxiety', 'Depression', 'Stress', 'Sleep', 'Social'],
    datasets: [
      {
        label: 'Your Scores',
        data: [
          10 - latestAssessment.anxiety,
          10 - latestAssessment.depression,
          10 - latestAssessment.stress,
          latestAssessment.sleep,
          latestAssessment.social,
        ],
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        borderColor: 'rgba(74, 144, 226, 1)',
        pointBackgroundColor: 'rgba(74, 144, 226, 1)',
      },
    ],
  } : { labels: [], datasets: [] };
  
  const radarChartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
    maintainAspectRatio: false,
  };
  
  // Format assessment history for bar chart
  const assessmentHistoryData = {
    labels: assessments.slice(0, 5).reverse().map(a => {
      const date = new Date(a.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Overall Wellbeing',
        data: assessments.slice(0, 5).reverse().map(a => a.overall),
        backgroundColor: 'rgba(80, 200, 120, 0.8)',
      },
    ],
  };
  
  const assessmentHistoryOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
    maintainAspectRatio: false,
  };
  
  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedLogs = [...moodLogs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date);
      logDate.setHours(0, 0, 0, 0);
      
      const diffTime = Math.abs(currentDate.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = new Date(logDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const streak = calculateStreak();
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success-600';
    if (score >= 5) return 'text-warning-500';
    return 'text-error-600';
  };
  
  const getScoreText = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Moderate';
    return 'Needs Attention';
  };
  
  const getRecommendations = (assessment: AssessmentResult) => {
    const recommendations = [];
    
    if (assessment.anxiety > 6) {
      recommendations.push({
        title: 'Anxiety Management',
        description: 'Practice daily mindfulness meditation to reduce anxiety symptoms',
        icon: <Activity className="h-5 w-5 text-primary-600" />
      });
    }
    
    if (assessment.depression > 6) {
      recommendations.push({
        title: 'Mood Enhancement',
        description: 'Engage in regular physical activity to boost mood and energy levels',
        icon: <Heart className="h-5 w-5 text-primary-600" />
      });
    }
    
    if (assessment.sleep < 5) {
      recommendations.push({
        title: 'Sleep Improvement',
        description: 'Establish a consistent sleep schedule and bedtime routine',
        icon: <Calendar className="h-5 w-5 text-primary-600" />
      });
    }
    
    if (assessment.social < 5) {
      recommendations.push({
        title: 'Social Connection',
        description: 'Schedule regular social activities with friends or family',
        icon: <Smile className="h-5 w-5 text-primary-600" />
      });
    }
    
    // Add a general recommendation if specific areas are fine
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Maintain Wellbeing',
        description: 'Continue your current practices and consider adding new wellness activities',
        icon: <Award className="h-5 w-5 text-primary-600" />
      });
    }
    
    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  };
  
  return (
    <div className="page-container slide-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Your Wellness Dashboard</h1>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'week' 
                ? 'bg-primary-100 text-primary-800' 
                : 'text-neutral-500 hover:bg-neutral-100'
            }`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'month' 
                ? 'bg-primary-100 text-primary-800' 
                : 'text-neutral-500 hover:bg-neutral-100'
            }`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'year' 
                ? 'bg-primary-100 text-primary-800' 
                : 'text-neutral-500 hover:bg-neutral-100'
            }`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Welcome and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Welcome back, {user?.name}
              </h2>
              <p className="text-neutral-600">
                {latestAssessment 
                  ? `Your overall wellbeing score is ${latestAssessment.overall}/10`
                  : 'Complete your first assessment to see your wellbeing score'}
              </p>
            </div>
            {!latestAssessment && (
              <Link to="/assessment" className="btn btn-primary text-sm">
                Take Assessment
              </Link>
            )}
          </div>
          
          {latestAssessment && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <p className="text-xs text-primary-700 font-medium uppercase">Anxiety</p>
                <p className={`text-xl font-bold ${getScoreColor(10 - latestAssessment.anxiety)}`}>
                  {10 - latestAssessment.anxiety}/10
                </p>
                <p className="text-xs text-primary-600">
                  {getScoreText(10 - latestAssessment.anxiety)}
                </p>
              </div>
              
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <p className="text-xs text-primary-700 font-medium uppercase">Depression</p>
                <p className={`text-xl font-bold ${getScoreColor(10 - latestAssessment.depression)}`}>
                  {10 - latestAssessment.depression}/10
                </p>
                <p className="text-xs text-primary-600">
                  {getScoreText(10 - latestAssessment.depression)}
                </p>
              </div>
              
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <p className="text-xs text-primary-700 font-medium uppercase">Stress</p>
                <p className={`text-xl font-bold ${getScoreColor(10 - latestAssessment.stress)}`}>
                  {10 - latestAssessment.stress}/10
                </p>
                <p className="text-xs text-primary-600">
                  {getScoreText(10 - latestAssessment.stress)}
                </p>
              </div>
              
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <p className="text-xs text-primary-700 font-medium uppercase">Sleep</p>
                <p className={`text-xl font-bold ${getScoreColor(latestAssessment.sleep)}`}>
                  {latestAssessment.sleep}/10
                </p>
                <p className="text-xs text-primary-600">
                  {getScoreText(latestAssessment.sleep)}
                </p>
              </div>
              
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <p className="text-xs text-primary-700 font-medium uppercase">Social</p>
                <p className={`text-xl font-bold ${getScoreColor(latestAssessment.social)}`}>
                  {latestAssessment.social}/10
                </p>
                <p className="text-xs text-primary-600">
                  {getScoreText(latestAssessment.social)}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Your Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Streak</p>
                  <p className="text-sm text-neutral-500">Consecutive days</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary-600">{streak}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                  <LineChart className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Assessments</p>
                  <p className="text-sm text-neutral-500">Total completed</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary-600">{assessments.length}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Journal Entries</p>
                  <p className="text-sm text-neutral-500">Total written</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary-600">{journalEntries.length}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Mood Tracking</h2>
            <Link to="/journal" className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
              Log Mood
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="h-64">
            <Line data={moodChartData} options={moodChartOptions} />
          </div>
        </div>
        
        {latestAssessment && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Wellness Profile</h2>
              <Link to="/assessment" className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                New Assessment
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="h-64">
              <Radar data={radarChartData} options={radarChartOptions} />
            </div>
          </div>
        )}
      </div>
      
      {/* Assessment History & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {assessments.length > 1 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Assessment History</h2>
            <div className="h-64">
              <Bar data={assessmentHistoryData} options={assessmentHistoryOptions} />
            </div>
          </div>
        )}
        
        {latestAssessment && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Personalized Recommendations</h2>
            <div className="space-y-4">
              {getRecommendations(latestAssessment).map((rec, index) => (
                <div key={index} className="flex border-l-4 border-primary-500 pl-4 py-2">
                  <div className="mr-3 mt-0.5">
                    {rec.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">{rec.title}</h3>
                    <p className="text-sm text-neutral-600">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link to="/resources" className="text-primary-600 hover:text-primary-700 text-sm inline-flex items-center">
                View All Resources
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Recent Journal Entries */}
      {journalEntries.length > 0 && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Journal Entries</h2>
            <Link to="/journal" className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {journalEntries.slice(0, 3).map(entry => (
              <div key={entry.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-neutral-900">{entry.title}</h3>
                  <div className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                    Mood: {entry.mood}/10
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{entry.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.tags.map(tag => (
                    <span key={tag} className="bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 text-xs text-neutral-500">
                  {new Date(entry.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;