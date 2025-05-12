export type UserStatus = 'unauthenticated' | 'authenticated';

export interface User {
  id: string;
  email: string;
  name: string;
}

export type ApplicationStatus = 'applied' | 'screening' | 'progress' | 'offer' | 'rejected';

export interface ApplicationStep {
  id: string;
  date: string;
  contactPerson: string;
  notes: string;
  status: ApplicationStatus;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  salary: string;
  location: string;
  dateApplied: string;
  currentStatus: ApplicationStatus;
  steps: ApplicationStep[];
  notes: string;
  favorite: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}