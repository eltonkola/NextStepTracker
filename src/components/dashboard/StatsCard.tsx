import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  subtitle,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-secondary-50 text-secondary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    error: 'bg-error-50 text-error-600',
    neutral: 'bg-neutral-100 text-neutral-600'
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-neutral-600 text-sm font-medium">{title}</h3>
        <div className={`rounded-full p-2 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-end gap-2">
        <p className="text-2xl font-semibold">{value}</p>
        {change && (
          <p className={`text-sm ${change.positive ? 'text-success-600' : 'text-error-600'}`}>
            {change.positive ? '+' : ''}{change.value}
          </p>
        )}
      </div>
      
      {subtitle && (
        <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default StatsCard;