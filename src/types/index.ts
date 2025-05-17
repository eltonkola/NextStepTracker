export type ApplicationStatus = 'applied' | 'screening' | 'progress' | 'offer' | 'rejected' | 'withdrawn';

export interface ApplicationStep {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}