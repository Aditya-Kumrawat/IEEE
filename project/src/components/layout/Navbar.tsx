import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Heart, Menu, X, User, LogOut, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavbarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarCollapsed, onToggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white dark:bg-neutral-900 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {isAuthenticated && (
              <button
                onClick={onToggleSidebar}
                className="mr-4 p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
            )}
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-primary-800 dark:text-primary-400">MindfulMend</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`text-base font-medium ${
                location.pathname === '/' 
                  ? 'text-primary-700 dark:text-primary-400 border-b-2 border-primary-500' 
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400'
              } transition-colors duration-200`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-base font-medium ${
                    location.pathname === '/dashboard' 
                      ? 'text-primary-700 dark:text-primary-400 border-b-2 border-primary-500' 
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400'
                  } transition-colors duration-200`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 ml-2"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-error-600 dark:hover:text-error-400 transition-colors duration-200 ml-2"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link 
                  to="/login" 
                  className="btn btn-outline"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-error-600 hover:bg-error-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;