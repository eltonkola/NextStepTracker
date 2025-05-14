import React, { createContext, useContext, useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus, ApplicationStep } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface ApplicationContextType {
  applications: JobApplication[];
  addApplication: (application: Omit<JobApplication, 'id' | 'steps'>) => Promise<void>;
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

  // Load applications from Supabase when user changes
  useEffect(() => {
    if (user) {
      loadApplications();
    } else {
      setApplications([]);
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      // Fetch applications with their steps
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

      // Transform the data to match our JobApplication type
      const transformedApps: JobApplication[] = apps.map(app => ({
        id: app.id,
        company: app.company,
        position: app.position,
        salary: app.salary || '',
        location: app.location || '',
        dateApplied: app.date_applied,
        notes: app.notes || '',
        favorite: app.favorite || false,
        steps: app.application_steps.map((step: any) => ({
          id: step.id,
          date: step.date,
          status: step.status as ApplicationStatus,
          contactPerson: step.contact_person || '',
          notes: step.notes || ''
        })),
        currentStatus: app.application_steps[0]?.status || 'applied'
      }));

      setApplications(transformedApps);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const ensureProfileExists = async () => {
    if (!user) return false;

    // Check if profile exists
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (fetchError || !profile) {
      // Profile doesn't exist, create it
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          name: user.email?.split('@')[0] || 'User' // Default name from email
        });

      if (createError) {
        console.error('Error creating profile:', createError);
        return false;
      }
    }

    return true;
  };

  const addApplication = async (applicationData: Omit<JobApplication, 'id' | 'steps'>) => {
    try {
      // Ensure profile exists before adding application
      const profileExists = await ensureProfileExists();
      if (!profileExists) {
        throw new Error('Could not create or verify user profile');
      }

      // Insert the application
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

      // Insert the initial step
      const { error: stepError } = await supabase
        .from('application_steps')
        .insert([{
          application_id: newApp.id,
          date: applicationData.dateApplied,
          status: 'applied',
          notes: applicationData.notes || 'Initial application submitted'
        }]);

      if (stepError) throw stepError;

      // Reload applications to get the latest data
      await loadApplications();
    } catch (error) {
      console.error('Error adding application:', error);
      throw error; // Re-throw to handle in the UI
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
      const { error } = await supabase
        .from('application_steps')
        .insert([{
          application_id: applicationId,
          date: stepData.date,
          status: stepData.status,
          contact_person: stepData.contactPerson,
          notes: stepData.notes
        }]);

      if (error) throw error;

      await loadApplications();
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