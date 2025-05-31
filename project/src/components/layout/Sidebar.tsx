import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  ClipboardCheck, 
  BookOpen, 
  Heart, 
  UserCircle, 
  Settings, 
  HelpCircle, 
  LifeBuoy,
  Calendar,
  Gamepad2,
  MessageSquare,
  Dumbbell,
  Smile
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/dashboard'
    },
    {
      name: 'Assessment',
      icon: <ClipboardCheck className="h-5 w-5" />,
      path: '/assessment'
    },
    {
      name: 'Journal',
      icon: <BookOpen className="h-5 w-5" />,
      path: '/journal'
    },
    {
      name: 'Resources',
      icon: <Heart className="h-5 w-5" />,
      path: '/resources'
    },
    {
      name: 'Guess My Mood',
      icon: <Smile className="h-5 w-5" />,
      path: '/guess-my-mood'
    },
    {
      name: 'Chatbot',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/chatbot'
    },
    {
      name: 'Exercises',
      icon: <Dumbbell className="h-5 w-5" />,
      path: '/exercises'
    },
    {
      name: 'Wellness Advisor',
      icon: <Dumbbell className="h-5 w-5" />,
      path: '/wellness-advisor'
    },
    {
      name: 'Games',
      icon: <Gamepad2 className="h-5 w-5" />,
      path: '/games'
    },
    {
      name: 'Profile',
      icon: <UserCircle className="h-5 w-5" />,
      path: '/profile'
    }
  ];

  const supportItems = [
    {
      name: 'Help Center',
      icon: <HelpCircle className="h-5 w-5" />,
      path: '/help'
    },
    {
      name: 'Crisis Support',
      icon: <LifeBuoy className="h-5 w-5" />,
      path: '/crisis'
    }
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 h-[calc(100vh-64px)] fixed top-16 left-0 overflow-y-auto`}
    >
      <div className="p-4">
        <div className="mt-4 mb-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                location.pathname === item.path
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <span className={location.pathname === item.path ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400'}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </div>

        {!isCollapsed && (
          <>
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mb-4">
              <p className="px-4 mb-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Support
              </p>
              {supportItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center px-4 py-3 my-1 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  <span className="text-neutral-500 dark:text-neutral-400">{item.icon}</span>
                  <span className="ml-3 font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="px-4 py-2">
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <span className="ml-2 text-sm font-medium text-primary-800 dark:text-primary-300">Next Check-in</span>
                  </div>
                  <p className="mt-2 text-sm text-primary-700 dark:text-primary-400">Tomorrow, 9:00 AM</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;