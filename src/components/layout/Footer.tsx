import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center items-center text-neutral-500 dark:text-neutral-400 text-sm">
          <span>Made with</span>
          <Heart className="w-4 h-4 mx-1 text-pink-500" />
          <span>by Elton, using AI</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
