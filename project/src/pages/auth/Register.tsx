import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const Register: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const password = watch('password', '');
  
  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!data.agreeTerms) {
      setError('You must agree to the terms and privacy policy');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await registerUser(data.name, data.email, data.password);
      if (success) {
        navigate('/assessment');
      } else {
        setError('Registration failed. Please try again.');
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
          <h1 className="text-2xl font-bold text-neutral-900">Create Your Account</h1>
          <p className="text-neutral-600 mt-2">Begin your mental wellness journey today</p>
        </div>
        
        {error && (
          <div className="bg-error-50 text-error-600 p-3 rounded-md mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className={`input ${errors.name ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="Your name"
              {...register('name', { 
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
            )}
          </div>
          
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
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`input pr-10 ${errors.password ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="••••••••"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Password must include uppercase, lowercase, number and special character'
                  }
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
            )}
            
            {password && (
              <div className="mt-2 space-y-1">
                <PasswordStrengthItem 
                  isValid={password.length >= 8}
                  text="At least 8 characters"
                />
                <PasswordStrengthItem 
                  isValid={/[A-Z]/.test(password)}
                  text="At least one uppercase letter"
                />
                <PasswordStrengthItem 
                  isValid={/[a-z]/.test(password)}
                  text="At least one lowercase letter"
                />
                <PasswordStrengthItem 
                  isValid={/\d/.test(password)}
                  text="At least one number"
                />
                <PasswordStrengthItem 
                  isValid={/[@$!%*?&]/.test(password)}
                  text="At least one special character"
                />
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className={`input ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="••••••••"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  {...register('agreeTerms', { required: true })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-neutral-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </Link>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-error-600">You must agree to the terms</p>
                )}
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Creating account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

interface PasswordStrengthItemProps {
  isValid: boolean;
  text: string;
}

const PasswordStrengthItem: React.FC<PasswordStrengthItemProps> = ({ isValid, text }) => {
  return (
    <div className="flex items-center">
      <span className={`flex-shrink-0 ${isValid ? 'text-success-500' : 'text-neutral-400'}`}>
        {isValid ? (
          <Check className="h-4 w-4" />
        ) : (
          <div className="h-4 w-4 border border-neutral-300 rounded-full" />
        )}
      </span>
      <span className={`ml-2 text-xs ${isValid ? 'text-success-600' : 'text-neutral-500'}`}>
        {text}
      </span>
    </div>
  );
};

export default Register;