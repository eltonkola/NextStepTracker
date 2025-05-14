import React, { useState } from 'react';
import { useApplications } from '../../context/ApplicationContext';
import { format } from 'date-fns';

interface ApplicationFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit, onCancel }) => {
  const { addApplication } = useApplications();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    salary: '',
    location: '',
    dateApplied: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    favorite: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addApplication(formData);
      onSubmit();
    } catch (error) {
      console.error('Error adding application:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Application</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="form-label">
              Company *
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="form-input"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="position" className="form-label">
              Position *
            </label>
            <input
              id="position"
              name="position"
              type="text"
              className="form-input"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="salary" className="form-label">
              Salary (Annual)
            </label>
            <input
              id="salary"
              name="salary"
              type="text"
              className="form-input"
              placeholder="e.g., $80,000"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="form-input"
              placeholder="e.g., Remote, New York, etc."
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="dateApplied" className="form-label">
              Date Applied *
            </label>
            <input
              id="dateApplied"
              name="dateApplied"
              type="date"
              className="form-input"
              value={formData.dateApplied}
              onChange={handleChange}
              required
            />
          </div>
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
            placeholder="Add any additional notes or details about this application..."
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3">
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
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;