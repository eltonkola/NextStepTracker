import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-semibold text-neutral-800">NextStepTracker</span>
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop menu */}
              <nav className="hidden md:flex md:items-center md:space-x-4">
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/applications"
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Applications
                </Link>
                <Link
                  to="/donate"
                  className="px-3 py-2 rounded-md text-sm font-medium text-accent-600 hover:text-accent-700 hover:bg-accent-50"
                >
                  Donate
                </Link>
                <div className="relative ml-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-neutral-700">{user.name}</span>
                      <span className="text-xs text-neutral-500">{user.email}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-2 p-2 rounded-full text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                      aria-label="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              </nav>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="flex items-center">
              <Link
                to="/login"
                className="btn btn-primary"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && user && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-neutral-200">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/applications"
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Applications
            </Link>
            <Link
              to="/donate"
              className="block px-3 py-2 rounded-md text-base font-medium text-accent-600 hover:text-accent-700 hover:bg-accent-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Donate
            </Link>
            <div className="pt-4 pb-3 border-t border-neutral-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 rounded-full bg-neutral-200 p-1" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-neutral-800">{user.name}</div>
                  <div className="text-sm font-medium text-neutral-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;