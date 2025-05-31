import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <Heart className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-lg font-bold text-primary-800">MindfulMend</span>
            </Link>
            <p className="mt-2 text-sm text-neutral-600">
              Supporting your mental wellbeing with compassion and evidence-based tools.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/assessment" className="text-sm text-neutral-600 hover:text-primary-600">
                  Assessment
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-neutral-600 hover:text-primary-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/journal" className="text-sm text-neutral-600 hover:text-primary-600">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-neutral-600 hover:text-primary-600">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/help" className="text-sm text-neutral-600 hover:text-primary-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/crisis" className="text-sm text-neutral-600 hover:text-primary-600">
                  Crisis Support
                </Link>
              </li>
              <li>
                <a href="mailto:support@mindfulmend.com" className="text-sm text-neutral-600 hover:text-primary-600">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-neutral-600 hover:text-primary-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-neutral-600 hover:text-primary-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm text-neutral-600 hover:text-primary-600">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-neutral-200 pt-8">
          <p className="text-sm text-neutral-500 text-center">
            &copy; {new Date().getFullYear()} MindfulMend. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400 text-center mt-2">
            This platform is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider with any questions 
            you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;