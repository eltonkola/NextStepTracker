import React from 'react';
import { JobApplication, ApplicationStatus } from '../../types';
import { format } from 'date-fns';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface ActivityFeedProps {
  applications: JobApplication[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ applications }) => {
  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied': return <Clock size={16} className="text-neutral-400" />;
      case 'screening': return <TrendingUp size={16} className="text-primary-500" />;
      case 'progress': return <TrendingUp size={16} className="text-secondary-500" />;
      case 'offer': return <TrendingUp size={16} className="text-success-500" />;
      case 'rejected': return <TrendingDown size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {applications.map((app, index) => (
        <div
          key={app.id}
          className="flex items-start p-3 hover:bg-neutral-50 rounded-md -mx-3 transition-colors"
        >
          <div className="flex-shrink-0">
            {getStatusIcon(app.currentStatus)}
          </div>
          <div className="flex-1 min-w-0 ml-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {app.position} at {app.company}
                </p>
                <p className="mt-1 text-sm text-neutral-500 truncate">
                  {app.location || 'Location not specified'}
                </p>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                  {app.currentStatus}
                </span>
              </div>
            </div>
            <div className="mt-2 text-sm text-neutral-500">
              <span className="mr-2">{format(new Date(app.dateApplied), 'MMM d')}</span>
              <span>•</span>
              <span className="ml-2">{app.salary ? `Salary: ${app.salary}` : 'Salary not specified'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
