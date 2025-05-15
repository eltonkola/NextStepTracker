import React, { createContext, useContext, useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus, ApplicationStep } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface ApplicationContextType {
  applications: JobApplication[];
  addApplication: (application: Omit<JobApplication, 'id' | 'steps' | 'currentStatus'>) => Promise<void>;
  updateApplication: (application: JobApplication) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  addApplicationStep: (applicationId: string, step: Omit<ApplicationStep, 'id'>) => Promise<void>;
  updateApplicationStep: (applicationId: string, step: ApplicationStep) => Promise<void>;
  deleteApplicationStep: (applicationId: string, stepId: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
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

  useEffect(() => {
    if (user) {
      loadApplications();
    } else {
      setApplications([]);
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      const { data: apps, error } = await supabase
        .from('applications')
        .select(`
          *,
          application_steps (*)
        `)
        .eq('profile_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const transformedApps: JobApplication[] = apps.map(app => {
        const sortedSteps = app.application_steps.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return {
          id: app.id,
          company: app.company,
          position: app.position,
          salary: app.salary || '',
          location: app.location || '',
          dateApplied: app.date_applied,
          notes: app.notes || '',
          favorite: app.favorite || false,
          steps: sortedSteps.map((step: any) => ({
            id: step.id,
            date: step.date,
            status: step.status as ApplicationStatus,
            contactPerson: step.contact_person || '',
            notes: step.notes || ''
          })),
          currentStatus: sortedSteps[0]?.status || 'applied'
        };
      });

      setApplications(transformedApps);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const ensureProfileExists = async () => {
    if (!user) return false;

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      return false;
    }

    if (!profile) {
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          name: user.email?.split('@')[0] || 'User'
        });

      if (createError) {
        console.error('Error creating profile:', createError);
        return false;
      }
    }

    return true;
  };

  const addApplication = async (applicationData: Omit<JobApplication, 'id' | 'steps' | 'currentStatus'>) => {
    try {
      const profileExists = await ensureProfileExists();
      if (!profileExists) {
        throw new Error('Could not create or verify user profile');
      }

      const { data: newApp, error: appError } = await supabase
        .from('applications')
        .insert([{
          profile_id: user!.id,
          company: applicationData.company,
          position: applicationData.position,
          salary: applicationData.salary,
          location: applicationData.location,
          date_applied: applicationData.dateApplied,
          notes: applicationData.notes,
          favorite: applicationData.favorite
        }])
        .select()
        .single();

      if (appError) throw appError;

      const { error: stepError } = await supabase
        .from('application_steps')
        .insert([{
          application_id: newApp.id,
          date: applicationData.dateApplied,
          status: 'applied',
          notes: 'Initial application submitted'
        }]);

      if (stepError) throw stepError;

      await loadApplications();
    } catch (error) {
      console.error('Error adding application:', error);
      throw error;
    }
  };

  const updateApplication = async (updatedApplication: JobApplication) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          company: updatedApplication.company,
          position: updatedApplication.position,
          salary: updatedApplication.salary,
          location: updatedApplication.location,
          date_applied: updatedApplication.dateApplied,
          notes: updatedApplication.notes,
          favorite: updatedApplication.favorite
        })
        .eq('id', updatedApplication.id);

      if (error) throw error;

      await loadApplications();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const addApplicationStep = async (applicationId: string, stepData: Omit<ApplicationStep, 'id'>) => {
    try {
      // First, insert the new step
      const { data: newStep, error: stepError } = await supabase
        .from('application_steps')
        .insert([{
          application_id: applicationId,
          date: stepData.date,
          status: stepData.status,
          contact_person: stepData.contactPerson,
          notes: stepData.notes
        }])
        .select()
        .single();

      if (stepError) throw stepError;

      // Update the applications state to reflect the new step
      setApplications(prevApps => 
        prevApps.map(app => {
          if (app.id === applicationId) {
            const newSteps = [
              {
                id: newStep.id,
                date: stepData.date,
                status: stepData.status,
                contactPerson: stepData.contactPerson,
                notes: stepData.notes
              },
              ...app.steps
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return {
              ...app,
              steps: newSteps,
              currentStatus: newSteps[0].status // Update the current status to match the latest step
            };
          }
          return app;
        })
      );
    } catch (error) {
      console.error('Error adding application step:', error);
    }
  };

  const updateApplicationStep = async (applicationId: string, updatedStep: ApplicationStep) => {
    try {
      const { error } = await supabase
        .from('application_steps')
        .update({
          date: updatedStep.date,
          status: updatedStep.status,
          contact_person: updatedStep.contactPerson,
          notes: updatedStep.notes
        })
        .eq('id', updatedStep.id)
        .eq('application_id', applicationId);

      if (error) throw error;

      await loadApplications();
    } catch (error) {
      console.error('Error updating application step:', error);
    }
  };

  const deleteApplicationStep = async (applicationId: string, stepId: string) => {
    try {
      const { error } = await supabase
        .from('application_steps')
        .delete()
        .eq('id', stepId)
        .eq('application_id', applicationId);

      if (error) throw error;

      await loadApplications();
    } catch (error) {
      console.error('Error deleting application step:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const application = applications.find(app => app.id === id);
      if (!application) return;

      const { error } = await supabase
        .from('applications')
        .update({ favorite: !application.favorite })
        .eq('id', id);

      if (error) throw error;

      await loadApplications();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
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