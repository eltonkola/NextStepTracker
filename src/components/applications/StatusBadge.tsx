import React from 'react';
import { ApplicationStatus } from '../../types';
import { 
  CheckCircle, 
  XCircle, 
  PhoneCall, 
  Clock, 
  Send 
} from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-2.5',
    lg: 'text-base py-1.5 px-3'
  };
  
  const getStatusConfig = () => {
    switch (status) {
      case 'applied':
        return {
          bg: 'bg-neutral-100',
          text: 'text-neutral-700',
          label: 'Applied',
          icon: <Send size={size === 'sm' ? 12 : 16} className="mr-1" />
        };
      case 'screening':
        return {
          bg: 'bg-primary-50',
          text: 'text-primary-700',
          label: 'Screening',
          icon: <PhoneCall size={size === 'sm' ? 12 : 16} className="mr-1" />
        };
      case 'progress':
        return {
          bg: 'bg-secondary-50',
          text: 'text-secondary-700',
          label: 'In Progress',
          icon: <Clock size={size === 'sm' ? 12 : 16} className="mr-1" />
        };
      case 'offer':
        return {
          bg: 'bg-success-50',
          text: 'text-success-700',
          label: 'Offer',
          icon: <CheckCircle size={size === 'sm' ? 12 : 16} className="mr-1" />
        };
      case 'rejected':
        return {
          bg: 'bg-error-50',
          text: 'text-error-700',
          label: 'Rejected',
          icon: <XCircle size={size === 'sm' ? 12 : 16} className="mr-1" />
        };
      default:
        return {
          bg: 'bg-neutral-100',
          text: 'text-neutral-700',
          label: 'Unknown',
          icon: null
        };
    }
  };
  
  const { bg, text, label, icon } = getStatusConfig();
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${bg} ${text} ${sizeClasses[size]}`}>
      {icon}
      {label}
    </span>
  );
};

export default StatusBadge;