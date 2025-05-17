import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, Settings, Home, FileText, Heart } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/applications') return 'applications';
    if (path === '/settings') return 'settings';
    if (path === '/donate') return 'donate';
    return '';
  };

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">NextStepTracker</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-base font-medium ${
                getCurrentPage() === 'dashboard' 
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <Home className="w-4 h-4 inline-block mr-1" />
              Dashboard
            </Link>
            <Link
              to="/applications"
              className={`px-3 py-2 rounded-md text-base font-medium ${
                getCurrentPage() === 'applications' 
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-1" />
              Applications
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-md text-base font-medium ${
                getCurrentPage() === 'settings' 
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <Settings className="w-4 h-4 inline-block mr-1" />
              Settings
            </Link>
            <Link
              to="/donate"
              className={`px-3 py-2 rounded-md text-base font-medium ${
                getCurrentPage() === 'donate' 
                  ? 'bg-accent-50 dark:bg-accent-900 text-accent-700 dark:text-accent-200'
                  : 'text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900'
              }`}
            >
              <Heart className="w-4 h-4 inline-block mr-1" />
              Donate
            </Link>
          </nav>
          
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                getCurrentPage() === 'dashboard' 
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-4 h-4 inline-block mr-1" />
              Dashboard
            </Link>
            <Link
              to="/applications"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                getCurrentPage() === 'applications' 
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="w-4 h-4 inline-block mr-1" />
              Applications
            </Link>
            <Link
              to="/settings"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                getCurrentPage() === 'settings' 
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="w-4 h-4 inline-block mr-1" />
              Settings
            </Link>
            <Link
              to="/donate"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                getCurrentPage() === 'donate' 
                  ? 'bg-accent-50 dark:bg-accent-900 text-accent-700 dark:text-accent-200'
                  : 'text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="w-4 h-4 inline-block mr-1" />
              Donate
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;