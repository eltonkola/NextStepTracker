import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { JobApplication, ApplicationStatus, ApplicationStep } from '../types';
import { useAuth } from './AuthContext';

interface ApplicationContextType {
  applications: JobApplication[];
  addApplication: (application: Omit<JobApplication, 'id' | 'steps'>) => void;
  updateApplication: (application: JobApplication) => void;
  deleteApplication: (id: string) => void;
  addApplicationStep: (applicationId: string, step: Omit<ApplicationStep, 'id'>) => void;
  updateApplicationStep: (applicationId: string, step: ApplicationStep) => void;
  deleteApplicationStep: (applicationId: string, stepId: string) => void;
  toggleFavorite: (id: string) => void;
}

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const { user } = useAuth();

  // Load applications from localStorage when user changes
  useEffect(() => {
    if (user) {
      const userApps = localStorage.getItem(`applications-${user.id}`);
      if (userApps) {
        try {
          setApplications(JSON.parse(userApps));
        } catch (error) {
          console.error('Failed to parse stored applications:', error);
        }
      }
    } else {
      setApplications([]);
    }
  }, [user]);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`applications-${user.id}`, JSON.stringify(applications));
    }
  }, [applications, user]);

  const addApplication = (applicationData: Omit<JobApplication, 'id' | 'steps'>) => {
    const newApplication: JobApplication = {
      ...applicationData,
      id: uuidv4(),
      steps: [{
        id: uuidv4(),
        date: applicationData.dateApplied,
        contactPerson: '',
        notes: applicationData.notes || 'Initial application submitted',
        status: 'applied'
      }],
    };
    
    setApplications(prev => [newApplication, ...prev]);
  };

  const updateApplication = (updatedApplication: JobApplication) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === updatedApplication.id ? updatedApplication : app
      )
    );
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const addApplicationStep = (applicationId: string, stepData: Omit<ApplicationStep, 'id'>) => {
    const newStep: ApplicationStep = {
      ...stepData,
      id: uuidv4(),
    };
    
    setApplications(prev => 
      prev.map(app => {
        if (app.id === applicationId) {
          // Add the new step and update the current status
          return {
            ...app,
            steps: [...app.steps, newStep],
            currentStatus: stepData.status
          };
        }
        return app;
      })
    );
  };

  const updateApplicationStep = (applicationId: string, updatedStep: ApplicationStep) => {
    setApplications(prev => 
      prev.map(app => {
        if (app.id === applicationId) {
          // If this is the last step, also update the application's current status
          const updatedSteps = app.steps.map(step => 
            step.id === updatedStep.id ? updatedStep : step
          );
          
          // Sort steps by date (newest first) to determine current status
          const sortedSteps = [...updatedSteps].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          return {
            ...app,
            steps: updatedSteps,
            currentStatus: sortedSteps[0]?.status || app.currentStatus
          };
        }
        return app;
      })
    );
  };

  const deleteApplicationStep = (applicationId: string, stepId: string) => {
    setApplications(prev => 
      prev.map(app => {
        if (app.id === applicationId) {
          // Don't allow deleting if it's the only step
          if (app.steps.length <= 1) {
            return app;
          }
          
          const updatedSteps = app.steps.filter(step => step.id !== stepId);
          
          // Recalculate current status from the newest remaining step
          const sortedSteps = [...updatedSteps].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          return {
            ...app,
            steps: updatedSteps,
            currentStatus: sortedSteps[0]?.status || 'applied'
          };
        }
        return app;
      })
    );
  };

  const toggleFavorite = (id: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, favorite: !app.favorite } : app
      )
    );
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