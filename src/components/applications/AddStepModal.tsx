import React, { useState } from 'react';
import { format } from 'date-fns';
import { ApplicationStatus } from '../../types';

interface AddStepModalProps {
  onSubmit: (data: {
    date: string;
    contactPerson: string;
    notes: string;
    status: ApplicationStatus;
  }) => void;
  onCancel: () => void;
  initialStatus?: ApplicationStatus;
}

const AddStepModal: React.FC<AddStepModalProps> = ({ 
  onSubmit, 
  onCancel,
  initialStatus = 'screening'
}) => {
  // Define the status progression order
  const statusOptions = [
    { value: 'applied', label: 'Applied', color: 'neutral-400' },
    { value: 'screening', label: 'Screening', color: 'primary-500' },
    { value: 'interview', label: 'Interview', color: 'primary-400' },
    { value: 'assessment', label: 'Assessment', color: 'primary-300' },
    { value: 'final', label: 'Final Interview', color: 'primary-200' },
    { value: 'progress', label: 'In Progress', color: 'secondary-500' },
    { value: 'offer', label: 'Offer', color: 'success-500' },
    { value: 'accepted', label: 'Accepted', color: 'success-400' },
    { value: 'rejected', label: 'Rejected', color: 'error-500' },
    { value: 'withdrawn', label: 'Withdrawn', color: 'warning-500' },
    { value: 'archived', label: 'Archived', color: 'neutral-500' }
  ];

  // Define the status progression order
  const statusOrder: ApplicationStatus[] = [
    'applied',
    'screening',
    'interview',
    'assessment',
    'final',
    'progress',
    'offer',
    'accepted',
    'rejected',
    'withdrawn',
    'archived'
  ];

  // Get the next status in the progression
  const getNextStatus = (currentStatus: ApplicationStatus): ApplicationStatus => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex === -1) return 'screening'; // Fallback to screening if status not found
    
    // Terminal states (accepted, rejected, withdrawn, archived) don't have next statuses
    if (['accepted', 'rejected', 'withdrawn', 'archived'].includes(currentStatus)) {
      return currentStatus;
    }
    
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  };

  // Initialize form data with proper status handling
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    contactPerson: '',
    notes: '',
    status: getNextStatus(initialStatus || 'applied')
  });

  // Update status when initialStatus changes
  React.useEffect(() => {
    if (initialStatus) {
      setFormData(prev => ({
        ...prev,
        status: getNextStatus(initialStatus)
      }));
    }
  }, [initialStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  //  console.log('handleChange:', value);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data before submit:', formData);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto animate-fadeIn">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add Application Step</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="contactPerson" className="form-label">
                Contact Person
              </label>
              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                className="form-input"
                placeholder="e.g., John Smith, Hiring Manager"
                value={formData.contactPerson}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="form-textarea"
                placeholder="Add any additional notes about this application step..."
                value={formData.notes}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Add Step
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStepModal;