import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock functions for auth operations
const mockLogin = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation
  if (email && password) {
    // Mock successful login
    return {
      id: 'user-1',
      name: 'Test User',
      email
    };
  }
  
  return null;
};

const mockRegister = async (name: string, email: string, password: string): Promise<User | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation
  if (name && email && password) {
    // Mock successful registration
    return {
      id: 'user-2',
      name,
      email
    };
  }
  
  return null;
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const loggedInUser = await mockLogin(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUser = await mockRegister(name, email, password);
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  // Password reset function
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};