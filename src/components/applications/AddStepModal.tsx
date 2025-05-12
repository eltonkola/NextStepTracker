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
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    contactPerson: '',
    notes: '',
    status: initialStatus
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                <option value="screening">Screening</option>
                <option value="progress">In Progress</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
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