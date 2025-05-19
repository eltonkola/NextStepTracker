import React from 'react';
import { format, parseISO } from 'date-fns';
import { JobApplication } from '../../types';
import StatusBadge from './StatusBadge';
import { 
  Building, 
  MapPin, 
  Calendar, 
  DollarSign,
  Star,
  StarOff,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useApplications } from '../../context/ApplicationContext';
import { Link, useNavigate } from 'react-router-dom';

interface ApplicationItemProps {
  application: JobApplication;
}

const ApplicationItem: React.FC<ApplicationItemProps> = ({ application }) => {
  const navigate = useNavigate();
  const { toggleFavorite, deleteApplication } = useApplications();
  const [showActions, setShowActions] = React.useState(false);
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'screening':
        return 'border-primary-200 bg-primary-50';
      case 'progress':
        return 'border-secondary-200 bg-secondary-50';
      case 'offer':
        return 'border-success-200 bg-success-50';
      case 'rejected':
        return 'border-error-200 bg-error-50';
      default:
        return 'border-neutral-200 bg-white';
    }
  };

  const handleApplicationClick = () => {
    navigate(`/applications/${application.id}`);
  };

  return (
    <div className="relative group">
      <div 
        className={`bg-white dark:bg-neutral-800 rounded-lg border-2 border-solid border-gray-600 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer p-4 ${getStatusColor(application.currentStatus)}`}
        onClick={handleApplicationClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{application.company}</h3>
                <div className="flex items-center text-neutral-600 text-sm">
                  <Building size={14} className="mr-1" />
                  <span>{application.position}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(application.id);
                  }}
                  className={`p-1.5 rounded-full ${
                    application.favorite 
                      ? 'text-yellow-500 hover:bg-yellow-50' 
                      : 'text-neutral-400 hover:bg-neutral-100'
                  }`}
                  aria-label={application.favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {application.favorite ? <Star size={16} /> : <StarOff size={16} />}
                </button>
                <button 
                  className="p-1 rounded-full bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                >
                  <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2 text-sm text-neutral-600">
                {application.location && (
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{application.location}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>Applied {formatDate(application.dateApplied)}</span>
                </div>
                
                {application.salary && (
                  <div className="flex items-center">
                    <DollarSign size={14} className="mr-1" />
                    <span>{application.salary}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <StatusBadge status={application.currentStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showActions && (
        <div 
          className="absolute right-0 top-2 mt-2 w-48 origin-top-right bg-white dark:bg-neutral-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="py-1">
            <Link 
              to={`/applications/${application.id}`}
              className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={16} className="mr-3" />
              View Details
            </Link>
            <Link 
              to={`/applications/${application.id}/edit`}
              className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit size={16} className="mr-3" />
              Edit
            </Link>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                deleteApplication(application.id);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50"
            >
              <Trash2 size={16} className="mr-3" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationItem;