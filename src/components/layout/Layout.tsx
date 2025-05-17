import React from 'react';
import Header from './Header';
import { Navigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200">
      <Header />
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="py-6 bg-neutral-800 dark:bg-neutral-900 text-neutral-300 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm">
                {new Date().getFullYear()} NextStepTracker. All rights reserved.
                <br className="hidden md:inline" />
                Made with ❤️ by Elton Kola, using AI
              </p>
            </div>
            <div className="flex gap-4">
              <a href="/privacy" className="text-sm hover:text-neutral-200 dark:hover:text-neutral-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm hover:text-neutral-200 dark:hover:text-neutral-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;