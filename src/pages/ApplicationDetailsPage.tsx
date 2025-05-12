import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useApplications } from '../context/ApplicationContext';
import StatusBadge from '../components/applications/StatusBadge';
import { format, parseISO } from 'date-fns';
import {
  ArrowLeft,
  Building,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Plus,
  Trash2,
  Star,
  StarOff,
  Edit
} from 'lucide-react';
import AddStepModal from '../components/applications/AddStepModal';
import { ApplicationStep } from '../types';

const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, deleteApplication, addApplicationStep, toggleFavorite, deleteApplicationStep } = useApplications();
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  
  const application = useMemo(() => {
    if (!id) return null;
    return applications.find(app => app.id === id) || null;
  }, [id, applications]);
  
  if (!application) {
    return (
      <Layout requireAuth>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Application Not Found</h2>
          <p className="mb-6">The application you're looking for doesn't exist or has been deleted.</p>
          <Link to="/applications" className="btn btn-primary">
            Back to Applications
          </Link>
        </div>
      </Layout>
    );
  }
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteApplication(application.id);
      navigate('/applications');
    }
  };
  
  const handleAddStep = (stepData: Omit<ApplicationStep, 'id'>) => {
    addApplicationStep(application.id, stepData);
    setShowAddStepModal(false);
  };
  
  const handleDeleteStep = (stepId: string) => {
    if (window.confirm('Are you sure you want to delete this step?')) {
      deleteApplicationStep(application.id, stepId);
    }
  };
  
  // Sort steps by date (newest first)
  const sortedSteps = [...application.steps].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/applications')}
              className="p-2 rounded-full hover:bg-neutral-100"
              aria-label="Back to applications"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Application Details</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavorite(application.id)}
              className={`p-2 rounded-full ${
                application.favorite 
                  ? 'text-yellow-500 hover:bg-yellow-50' 
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              aria-label={application.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {application.favorite ? <Star size={20} /> : <StarOff size={20} />}
            </button>
            <Link
              to={`/applications/${application.id}/edit`}
              className="btn btn-outline"
            >
              <Edit size={16} className="mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-outline text-error-600 hover:bg-error-50"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Overview</h2>
                <StatusBadge status={application.currentStatus} size="md" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{application.position}</h3>
                  <div className="flex items-center text-neutral-600 mt-1">
                    <Building size={16} className="mr-2" />
                    <span>{application.company}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-200 space-y-3">
                  <div className="flex items-start">
                    <Calendar size={16} className="mr-2 mt-0.5 text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500">Date Applied</p>
                      <p className="font-medium">{formatDate(application.dateApplied)}</p>
                    </div>
                  </div>
                  
                  {application.location && (
                    <div className="flex items-start">
                      <MapPin size={16} className="mr-2 mt-0.5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-500">Location</p>
                        <p className="font-medium">{application.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {application.salary && (
                    <div className="flex items-start">
                      <DollarSign size={16} className="mr-2 mt-0.5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-500">Salary</p>
                        <p className="font-medium">{application.salary}</p>
                      </div>
                    </div>
                  )}
                  
                  {application.notes && (
                    <div className="flex items-start pt-2">
                      <FileText size={16} className="mr-2 mt-0.5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-500">Notes</p>
                        <p className="whitespace-pre-line">{application.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Application History */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Application History</h2>
                <button
                  onClick={() => setShowAddStepModal(true)}
                  className="btn btn-primary"
                >
                  <Plus size={16} className="mr-2" />
                  Add Step
                </button>
              </div>
              
              {/* Timeline */}
              <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-0 before:h-full before:w-0.5 before:bg-neutral-200">
                {sortedSteps.map((step, index) => (
                  <div key={step.id} className="relative pb-6">
                    <div className="absolute -left-6 mt-1.5 h-6 w-6 rounded-full border-2 border-white bg-white shadow-[0_0_0_2px] shadow-neutral-200" />
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <StatusBadge status={step.status} size="sm" />
                        <time className="block text-xs text-neutral-500 mt-1">
                          {formatDate(step.date)}
                        </time>
                      </div>
                      
                      {/* Don't allow deleting the first/initial step */}
                      {index !== sortedSteps.length - 1 && (
                        <button
                          onClick={() => handleDeleteStep(step.id)}
                          className="p-1 text-neutral-400 hover:text-error-500"
                          aria-label="Delete step"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      {step.contactPerson && (
                        <p className="text-sm font-medium">
                          Contact: {step.contactPerson}
                        </p>
                      )}
                      
                      <p className="mt-1 text-neutral-700 whitespace-pre-line">
                        {step.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Step Modal */}
      {showAddStepModal && (
        <AddStepModal
          onSubmit={handleAddStep}
          onCancel={() => setShowAddStepModal(false)}
          initialStatus={application.currentStatus}
        />
      )}
    </Layout>
  );
};

export default ApplicationDetailsPage;