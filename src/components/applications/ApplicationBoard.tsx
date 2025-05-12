import React, { useMemo, useState } from 'react';
import { JobApplication, ApplicationStatus } from '../../types';
import ApplicationItem from './ApplicationItem';
import { PlusCircle } from 'lucide-react';

interface ApplicationBoardProps {
  applications: JobApplication[];
  onAddApplication: () => void;
}

type StatusColumnConfig = {
  status: ApplicationStatus;
  title: string;
  icon: JSX.Element;
  emptyMessage: string;
};

const ApplicationBoard: React.FC<ApplicationBoardProps> = ({ applications, onAddApplication }) => {
  const statusColumns: StatusColumnConfig[] = [
    {
      status: 'applied',
      title: 'Applied',
      icon: <div className="w-3 h-3 rounded-full bg-neutral-400 mr-2"></div>,
      emptyMessage: 'No applications yet'
    },
    {
      status: 'screening',
      title: 'Screening',
      icon: <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>,
      emptyMessage: 'No applications in screening'
    },
    {
      status: 'progress',
      title: 'In Progress',
      icon: <div className="w-3 h-3 rounded-full bg-secondary-500 mr-2"></div>,
      emptyMessage: 'No applications in progress'
    },
    {
      status: 'offer',
      title: 'Offer',
      icon: <div className="w-3 h-3 rounded-full bg-success-500 mr-2"></div>,
      emptyMessage: 'No offers yet'
    },
    {
      status: 'rejected',
      title: 'Rejected',
      icon: <div className="w-3 h-3 rounded-full bg-error-500 mr-2"></div>,
      emptyMessage: 'No rejected applications'
    }
  ];
  
  const applicationsByStatus = useMemo(() => {
    const result: Record<ApplicationStatus, JobApplication[]> = {
      applied: [],
      screening: [],
      progress: [],
      offer: [],
      rejected: []
    };
    
    applications.forEach(app => {
      result[app.currentStatus].push(app);
    });
    
    // Sort each status group by the most recent step date
    Object.keys(result).forEach(status => {
      result[status as ApplicationStatus].sort((a, b) => {
        const aLatestStep = [...a.steps].sort((x, y) => 
          new Date(y.date).getTime() - new Date(x.date).getTime()
        )[0];
        
        const bLatestStep = [...b.steps].sort((x, y) => 
          new Date(y.date).getTime() - new Date(x.date).getTime()
        )[0];
        
        return new Date(bLatestStep.date).getTime() - new Date(aLatestStep.date).getTime();
      });
    });
    
    return result;
  }, [applications]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Application Board</h2>
        <button
          onClick={onAddApplication}
          className="btn btn-primary"
        >
          <PlusCircle size={16} className="mr-1" />
          Add Application
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {statusColumns.map(column => (
          <div key={column.status} className="flex flex-col h-full">
            <div className="flex items-center mb-3">
              {column.icon}
              <h3 className="font-medium">{column.title}</h3>
              <span className="ml-1.5 text-sm text-neutral-500">
                ({applicationsByStatus[column.status].length})
              </span>
            </div>
            
            <div className="flex-1 min-h-[200px]">
              {applicationsByStatus[column.status].length === 0 ? (
                <div className="h-32 border border-dashed border-neutral-300 rounded-md flex items-center justify-center text-neutral-500 text-sm p-4">
                  {column.emptyMessage}
                </div>
              ) : (
                <div className="space-y-3">
                  {applicationsByStatus[column.status].map(application => (
                    <ApplicationItem 
                      key={application.id} 
                      application={application} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationBoard;