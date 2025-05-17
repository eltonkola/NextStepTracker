import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Moon, Sun, Download, Upload, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApplications } from '../context/ApplicationContext';
import { JobApplication } from '../types';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [importError, setImportError] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();
  const { applications } = useApplications();

  useEffect(() => {
    console.log('Applications count:', applications?.length);
  }, [applications]);

  const validateApplicationsData = (data: any): data is JobApplication[] => {
    if (!Array.isArray(data)) {
      return false;
    }

    for (const app of data) {
      if (typeof app !== 'object' || app === null) {
        return false;
      }

      // Check required fields
      if (!app.id || !app.company || !app.position || !app.currentStatus) {
        return false;
      }

      // Check steps format
      if (!Array.isArray(app.steps)) {
        return false;
      }

      // Check dates format
      if (!app.createdAt || !app.updatedAt) {
        return false;
      }
    }

    return true;
  };

  const exportData = () => {
    const apps = localStorage.getItem('applications');
    if (apps) {
      const blob = new Blob([apps], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'next-step-tracker-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImportError('');
  };

  const importData = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (!validateApplicationsData(data)) {
          setImportError('Invalid data format. Please ensure the file contains valid application records.');
          return;
        }

        localStorage.setItem('applications', JSON.stringify(data));
        window.location.reload();
      } catch (error) {
        setImportError('Invalid JSON file. Please ensure the file is a valid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const deleteAllData = () => {
    if (window.confirm(`Are you sure you want to delete ALL ${applications?.length || 0} application records? This action cannot be undone.`)) {
      localStorage.removeItem('applications');
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Theme Switcher */}
          <div className="rounded-lg p-6 shadow bg-white dark:bg-neutral-800">
            <h2 className="text-xl font-semibold mb-4">Theme</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Choose between light and dark themes to customize your experience.
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
              >
                {isDarkMode ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              <span className="text-neutral-600 dark:text-neutral-300">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
          </div>

          {/* Data Export */}
          <div className="rounded-lg p-6 shadow bg-white dark:bg-neutral-800">
            <h2 className="text-xl font-semibold mb-4">Data Export</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Download your application data as a JSON file for backup or transfer.
            </p>
            <button
              onClick={exportData}
              className="btn btn-primary w-full"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </button>
          </div>

          {/* Data Import */}
          <div className="rounded-lg p-6 shadow bg-white dark:bg-neutral-800">
            <h2 className="text-xl font-semibold mb-4">Data Import</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Import application data from a JSON file.
            </p>
            {importError && (
              <p className="text-red-600 dark:text-red-400 mb-4">
                {importError}
              </p>
            )}
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="w-full"
              />
              <button
                onClick={importData}
                className="btn btn-secondary w-full"
                disabled={importError !== ''}
              >
                <Upload className="w-5 h-5 mr-2" />
                Import Data
              </button>
            </div>
          </div>

          {/* Data Deletion */}
          <div className="rounded-lg p-6 shadow bg-white dark:bg-neutral-800">
            <h2 className="text-xl font-semibold mb-4">Delete All Data</h2>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {applications?.length > 0 
                ? `Permanently delete ${applications?.length} application records. This action cannot be undone.`
                : 'No application records to delete.'}
            </p>
            <button
              onClick={deleteAllData}
              disabled={applications?.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full justify-center ${
                applications?.length > 0 
                  ? 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-5 h-5" />
              Delete All Records
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
