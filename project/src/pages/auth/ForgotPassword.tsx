import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Check } from 'lucide-react';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await resetPassword(data.email);
      if (result) {
        setSuccess(true);
      } else {
        setError('Failed to send password reset link. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fade-in max-w-md mx-auto py-8">
      <div className="card p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Reset Your Password</h1>
          <p className="text-neutral-600 mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        {error && (
          <div className="bg-error-50 text-error-600 p-3 rounded-md mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {success ? (
          <div className="text-center">
            <div className="bg-success-50 text-success-600 p-4 rounded-md mb-6 inline-flex items-center">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-medium text-neutral-900 mb-2">Check Your Email</h2>
            <p className="text-neutral-600 mb-6">
              We've sent a password reset link to your email. Please check your inbox 
              and follow the instructions to reset your password.
            </p>
            <Link to="/login" className="btn btn-primary w-full">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`input ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="your@email.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Sending...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Remembered your password?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Back to login
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;