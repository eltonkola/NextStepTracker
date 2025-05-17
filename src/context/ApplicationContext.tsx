import React, { createContext, useContext, useState, useEffect } from 'react';
import { JobApplication, ApplicationStep } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ApplicationContextType {
  applications: JobApplication[];
  addApplication: (application: Omit<JobApplication, 'id' | 'steps' | 'currentStatus'>) => void;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  addApplicationStep: (id: string, step: Omit<ApplicationStep, 'id'>) => void;
  updateApplicationStep: (id: string, stepId: string, updates: Partial<ApplicationStep>) => void;
  deleteApplicationStep: (id: string, stepId: string) => void;
  toggleFavorite: (id: string) => void;
}

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export { ApplicationContext };

export const ApplicationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    const savedApps = localStorage.getItem('applications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }
  }, []);

  const saveToLocalStorage = (apps: JobApplication[]) => {
    localStorage.setItem('applications', JSON.stringify(apps));
  };

  const addApplication = (application: Omit<JobApplication, 'id' | 'steps' | 'currentStatus'>) => {
    const newApp: JobApplication = {
      ...application,
      id: uuidv4(),
      steps: [],
      currentStatus: 'applied',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setApplications((prev) => {
      const updated = [...prev, newApp];
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const updateApplication = (id: string, updates: Partial<JobApplication>) => {
    setApplications((prev) => {
      const updated = prev.map((app) =>
        app.id === id ? { ...app, ...updates, updatedAt: new Date().toISOString() } : app
      );
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => {
      const updated = prev.filter((app) => app.id !== id);
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const addApplicationStep = (id: string, step: Omit<ApplicationStep, 'id'>) => {
    setApplications((prev) => {
      const updated = prev.map((app) =>
        app.id === id
          ? {
              ...app,
              steps: [...app.steps, { ...step, id: uuidv4(), createdAt: new Date().toISOString() }],
              currentStatus: step.status,
              updatedAt: new Date().toISOString()
            }
          : app
      );
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const updateApplicationStep = (id: string, stepId: string, updates: Partial<ApplicationStep>) => {
    setApplications((prev) => {
      const updated = prev.map((app) =>
        app.id === id
          ? {
              ...app,
              steps: app.steps.map((step) =>
                step.id === stepId
                  ? { ...step, ...updates, updatedAt: new Date().toISOString() }
                  : step
              ),
              currentStatus: updates.status || app.currentStatus,
              updatedAt: new Date().toISOString()
            }
          : app
      );
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const deleteApplicationStep = (id: string, stepId: string) => {
    setApplications((prev) => {
      const updated = prev.map((app) =>
        app.id === id
          ? {
              ...app,
              steps: app.steps.filter((step) => step.id !== stepId),
              updatedAt: new Date().toISOString()
            }
          : app
      );
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const toggleFavorite = (id: string) => {
    setApplications((prev) => {
      const updated = prev.map((app) =>
        app.id === id ? { ...app, favorite: !app.favorite } : app
      );
      saveToLocalStorage(updated);
      return updated;
    });
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
        addApplicationStep,
        updateApplicationStep,
        deleteApplicationStep,
        toggleFavorite
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationContextProvider');
  }
  return context;
};