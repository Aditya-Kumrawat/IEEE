import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Settings, 
  Save,
  Download,
  Trash2,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  assessmentReminders: boolean;
  journalReminders: boolean;
  resourceUpdates: boolean;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { assessments, journalEntries } = useUserData();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'data'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    assessmentReminders: true,
    journalReminders: true,
    resourceUpdates: false
  });
  
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });
  
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch: watchPassword, formState: { errors: passwordErrors } } = useForm<PasswordFormData>();
  
  const newPassword = watchPassword('newPassword', '');
  
  const onProfileSubmit = (data: ProfileFormData) => {
    // In a real app, this would update the user profile
    console.log('Profile updated:', data);
    setIsEditing(false);
  };
  
  const onPasswordSubmit = (data: PasswordFormData) => {
    // In a real app, this would change the password
    console.log('Password changed:', data);
  };
  
  const toggleNotificationSetting = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const exportData = () => {
    // In a real app, this would prepare and download user data
    const userData = {
      profile: {
        name: user?.name,
        email: user?.email
      },
      assessments,
      journalEntries
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'your-mental-health-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const deleteAccount = () => {
    // In a real app, this would delete the account after confirmation
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deleted');
      logout();
    }
  };
  
  return (
    <div className="slide-up max-w-4xl mx-auto">
      <h1 className="page-title">Your Profile</h1>
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex overflow-x-auto">
          <button
            className={`py-4 px-6 font-medium text-sm flex items-center ${
              activeTab === 'profile'
                ? 'text-primary-700 border-b-2 border-primary-500'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm flex items-center ${
              activeTab === 'security'
                ? 'text-primary-700 border-b-2 border-primary-500'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <Lock className="h-4 w-4 mr-2" />
            Security
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm flex items-center ${
              activeTab === 'notifications'
                ? 'text-primary-700 border-b-2 border-primary-500'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm flex items-center ${
              activeTab === 'data'
                ? 'text-primary-700 border-b-2 border-primary-500'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('data')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Data & Privacy
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="card p-6">
        {activeTab === 'profile' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Personal Information</h2>
              {!isEditing && (
                <button
                  type="button"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <div className="space-y-6">
                <div className="form-group">
                  <label htmlFor="name" className="form-label flex items-center">
                    <User className="h-4 w-4 mr-2 text-neutral-500" />
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`input ${profileErrors.name ? 'border-error-500 focus:ring-error-500' : ''} ${!isEditing ? 'bg-neutral-50' : ''}`}
                    disabled={!isEditing}
                    {...registerProfile('name', { required: 'Name is required' })}
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-error-600">{profileErrors.name.message}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-neutral-500" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`input ${profileErrors.email ? 'border-error-500 focus:ring-error-500' : ''} ${!isEditing ? 'bg-neutral-50' : ''}`}
                    disabled={!isEditing}
                    {...registerProfile('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-error-600">{profileErrors.email.message}</p>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="btn btn-outline mr-2"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </form>
            
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Account Statistics</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <p className="text-primary-800 font-medium">Member Since</p>
                  </div>
                  <p className="text-2xl font-bold text-primary-700 mt-2">
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <p className="text-primary-800 font-medium">Assessments</p>
                  </div>
                  <p className="text-2xl font-bold text-primary-700 mt-2">
                    {assessments.length}
                  </p>
                </div>
                
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <p className="text-primary-800 font-medium">Journal Entries</p>
                  </div>
                  <p className="text-2xl font-bold text-primary-700 mt-2">
                    {journalEntries.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Change Password</h2>
              <p className="text-neutral-600 mt-1">
                Ensure your account remains secure by using a strong password that you don't use elsewhere.
              </p>
            </div>
            
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <div className="space-y-6">
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      className={`input pr-10 ${passwordErrors.currentPassword ? 'border-error-500 focus:ring-error-500' : ''}`}
                      {...registerPassword('currentPassword', { required: 'Current password is required' })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-error-600">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      className={`input pr-10 ${passwordErrors.newPassword ? 'border-error-500 focus:ring-error-500' : ''}`}
                      {...registerPassword('newPassword', { 
                        required: 'New password is required',
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
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-error-600">{passwordErrors.newPassword.message}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`input pr-10 ${passwordErrors.confirmPassword ? 'border-error-500 focus:ring-error-500' : ''}`}
                      {...registerPassword('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => value === newPassword || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-error-600">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Account Sessions</h2>
                <p className="text-neutral-600 mt-1">
                  Manage your active sessions and sign out from other devices.
                </p>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-neutral-900">Current Session</p>
                    <p className="text-neutral-600 text-sm">
                      {navigator.userAgent.includes('Windows') ? 'Windows' : 
                       navigator.userAgent.includes('Mac') ? 'macOS' : 
                       navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad') ? 'iOS' :
                       navigator.userAgent.includes('Android') ? 'Android' : 'Unknown'} - 
                      {navigator.userAgent.includes('Chrome') ? ' Chrome' :
                       navigator.userAgent.includes('Firefox') ? ' Firefox' :
                       navigator.userAgent.includes('Safari') ? ' Safari' :
                       navigator.userAgent.includes('Edge') ? ' Edge' : ' Unknown Browser'}
                    </p>
                    <p className="text-neutral-500 text-xs mt-1">Active now</p>
                  </div>
                  <button
                    type="button"
                    className="text-error-600 hover:text-error-700 text-sm font-medium"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                onClick={logout}
              >
                Sign out from all devices
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Notification Settings</h2>
              <p className="text-neutral-600 mt-1">
                Manage how and when you receive notifications from our platform.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Email Notifications</p>
                  <p className="text-neutral-600 text-sm">
                    Receive important updates and information via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notificationSettings.emailNotifications}
                    onChange={() => toggleNotificationSetting('emailNotifications')}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Assessment Reminders</p>
                  <p className="text-neutral-600 text-sm">
                    Get notifications when it's time for your regular assessment
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notificationSettings.assessmentReminders}
                    onChange={() => toggleNotificationSetting('assessmentReminders')}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Journal Reminders</p>
                  <p className="text-neutral-600 text-sm">
                    Daily reminders to log your mood and journal entries
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notificationSettings.journalReminders}
                    onChange={() => toggleNotificationSetting('journalReminders')}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Resource Updates</p>
                  <p className="text-neutral-600 text-sm">
                    Notifications about new resources and content
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notificationSettings.resourceUpdates}
                    onChange={() => toggleNotificationSetting('resourceUpdates')}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'data' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Data & Privacy</h2>
              <p className="text-neutral-600 mt-1">
                Manage your personal data and privacy settings.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="border border-neutral-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Export Your Data</h3>
                <p className="text-neutral-600 mb-4">
                  Download a copy of your personal data, including assessments, journal entries, and account information.
                </p>
                <button
                  type="button"
                  className="btn btn-outline flex items-center"
                  onClick={exportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Your Data
                </button>
              </div>
              
              <div className="border border-neutral-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Data Privacy</h3>
                <p className="text-neutral-600 mb-4">
                  We take your privacy seriously. Your data is encrypted and stored securely.
                </p>
                <a 
                  href="/privacy" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Privacy Policy
                </a>
              </div>
              
              <div className="border border-error-100 bg-error-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-error-700 mb-2">Delete Account</h3>
                <p className="text-error-600 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  type="button"
                  className="btn bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 flex items-center"
                  onClick={deleteAccount}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;