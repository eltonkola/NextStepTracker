import React from 'react';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, requireAuth = false }) => {
  const { user, status } = useAuth();
  
  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="py-6 bg-neutral-800 text-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm">
                © {new Date().getFullYear()} NextStepTracker. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-sm hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-sm hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;