import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <Navbar 
        isSidebarCollapsed={isSidebarCollapsed} 
        onToggleSidebar={toggleSidebar} 
      />
      <main className="flex-grow flex">
        {isAuthenticated && (
          <Sidebar isCollapsed={isSidebarCollapsed} />
        )}
        <div className={`flex-grow transition-all duration-300 ${
          isAuthenticated 
            ? isSidebarCollapsed 
              ? 'ml-0 md:ml-20' 
              : 'ml-0 md:ml-64'
            : ''
        }`}>
          <div className="page-container">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;