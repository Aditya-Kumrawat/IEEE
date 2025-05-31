import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  BookOpen, 
  ClipboardCheck, 
  Shield, 
  Star, 
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="slide-up">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-100 to-accent-50 rounded-2xl overflow-hidden">
        <div className="py-12 px-6 md:px-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
              Your Journey to Better Mental Health Starts Here
            </h1>
            <p className="text-lg md:text-xl text-primary-700 mb-8">
              Evidence-based assessments, personalized recommendations, and supportive tools 
              to help you understand and improve your mental wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard\" className="btn btn-primary text-center">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary text-center">
                    Get Started
                  </Link>
                  <Link to="/assessment" className="btn btn-outline text-center">
                    Take Assessment
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">How MindfulMend Helps</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Our comprehensive platform provides the tools you need to assess, track, and improve your mental wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card p-6">
            <ClipboardCheck className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Scientifically Validated Assessment
            </h3>
            <p className="text-neutral-600">
              Complete our comprehensive mental health assessment based on clinical standards to understand your current state.
            </p>
          </div>

          <div className="card p-6">
            <BarChart3 className="h-10 w-10 text-secondary-600 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Personalized Analytics
            </h3>
            <p className="text-neutral-600">
              Track your progress over time with interactive visualizations and gain insights into your mental health journey.
            </p>
          </div>

          <div className="card p-6">
            <BookOpen className="h-10 w-10 text-accent-600 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Mood Tracking & Journaling
            </h3>
            <p className="text-neutral-600">
              Record your daily mood and thoughts with our easy-to-use journal, complete with sentiment analysis.
            </p>
          </div>

          <div className="card p-6">
            <Star className="h-10 w-10 text-warning-500 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Personalized Recommendations
            </h3>
            <p className="text-neutral-600">
              Receive tailored suggestions for professional help, self-care activities, and resources based on your assessment.
            </p>
          </div>

          <div className="card p-6">
            <Users className="h-10 w-10 text-secondary-600 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Supportive Community
            </h3>
            <p className="text-neutral-600">
              Connect with peers and mental health professionals in our moderated forums for support and guidance.
            </p>
          </div>

          <div className="card p-6">
            <Shield className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Privacy & Security
            </h3>
            <p className="text-neutral-600">
              Your data is protected with end-to-end encryption and strict privacy controls. We prioritize your confidentiality.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-secondary-50 rounded-2xl p-8 md:p-12 mb-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
            Start Your Mental Wellness Journey Today
          </h2>
          <p className="text-lg text-secondary-700 mb-8">
            Join thousands of users who have taken the first step toward better mental health.
            Our platform is designed with your wellbeing in mind.
          </p>
          {isAuthenticated ? (
            <Link to="/assessment" className="btn btn-primary px-8 py-3 text-center">
              Take Assessment
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary px-8 py-3 text-center">
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Testimonials - could be added in a future iteration */}
    </div>
  );
};

export default Home;