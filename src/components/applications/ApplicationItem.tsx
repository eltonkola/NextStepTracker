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
import { Link } from 'react-router-dom';

interface ApplicationItemProps {
  application: JobApplication;
}

const ApplicationItem: React.FC<ApplicationItemProps> = ({ application }) => {
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
  
  return (
    <Link 
      to={`/applications/${application.id}`}
      className={`block card hover:shadow-md transition-all p-4 status-transition ${getStatusColor(application.currentStatus)}`}
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
              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowActions(!showActions);
                  }}
                  className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100"
                  aria-label="Application actions"
                >
                  <MoreVertical size={16} />
                </button>
                
                {showActions && (
                  <div 
                    className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-neutral-200"
                    onBlur={() => setShowActions(false)}
                  >
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
                        e.preventDefault();
                        e.stopPropagation();
                        deleteApplication(application.id);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                    >
                      <Trash2 size={16} className="mr-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ApplicationItem;