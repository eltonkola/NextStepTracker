import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useApplications } from '../context/ApplicationContext';
import { format } from 'date-fns';

const ApplicationEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, updateApplication } = useApplications();
  const [loading, setLoading] = useState(false);
  
  const application = useMemo(() => {
    if (!id) return null;
    return applications.find(app => app.id === id) || null;
  }, [id, applications]);
  
  const [formData, setFormData] = useState(
    application 
      ? {
          company: application.company,
          position: application.position,
          salary: application.salary,
          location: application.location,
          dateApplied: application.dateApplied,
          notes: application.notes,
        }
      : {
          company: '',
          position: '',
          salary: '',
          location: '',
          dateApplied: format(new Date(), 'yyyy-MM-dd'),
          notes: '',
        }
  );
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Preserve the steps and currentStatus from the original application
      const updatedApplication = {
        ...application,
        ...formData
      };
      
      updateApplication(updatedApplication);
      navigate(`/applications/${application.id}`);
    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout requireAuth>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Application</h1>
          <Link
            to={`/applications/${application.id}`}
            className="btn btn-outline"
          >
            Cancel
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
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
            
            <div className="flex justify-end space-x-3 pt-4">
              <Link
                to={`/applications/${application.id}`}
                className="btn btn-outline"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationEditPage;