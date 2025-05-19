import React from 'react';
import { JobApplication, ApplicationStatus } from '../../types';
import { differenceInDays } from 'date-fns';
import { Clock } from 'lucide-react';

interface ProgressTimelineProps {
  applications: JobApplication[];
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ applications }) => {
  // Calculate average time between status changes
  const calculateAverageTime = () => {
    const totalTime = applications
      .filter(app => app.steps.length > 0)
      .reduce((acc, app) => {
        const firstStep = app.steps[0];
        const appliedDate = new Date(app.dateApplied);
        const firstResponseDate = new Date(firstStep.date);
        const days = differenceInDays(firstResponseDate, appliedDate);
        return acc + (isNaN(days) ? 0 : days);
      }, 0);

    return applications.length > 0 
      ? Math.round(totalTime / applications.length)
      : 0;
  };

  // Get status progression
  const getStatusProgression = () => {
    const counts: Record<ApplicationStatus, number> = {
      applied: 0,
      screening: 0,
      progress: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0
    };

    applications.forEach(app => {
      const steps = app.steps.filter(step => step.status !== 'applied');
      if (steps.length > 0) {
        counts[steps[0].status as ApplicationStatus]++;
      }
    });

    return Object.entries(counts)
      .filter(([status, count]) => count > 0)
      .map(([status, count]) => ({
        status: status as ApplicationStatus,
        count,
        percentage: Math.round((count / applications.length) * 100)
      }));
  };

  const progression = getStatusProgression();
  const avgTime = calculateAverageTime();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-neutral-400" />
          <span className="text-sm text-neutral-500">Average Response Time</span>
        </div>
        <p className="text-2xl font-semibold">{avgTime} days</p>
      </div>

      <div className="space-y-2">
        {progression.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{
                backgroundColor: getStatusColor(item.status)
              }} />
              <span className="text-sm text-neutral-500">
                {item.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
                <div className="h-2 rounded-full" style={{
                  width: `${item.percentage}%`,
                  backgroundColor: getStatusColor(item.status)
                }} />
              </div>
              <span className="text-sm text-neutral-500">
                {item.count} apps
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'applied': return '#94a3b8';
    case 'screening': return '#3b82f6';
    case 'progress': return '#64748b';
    case 'offer': return '#10b981';
    case 'rejected': return '#ef4444';
    default: return '#94a3b8';
  }
};

export default ProgressTimeline;
