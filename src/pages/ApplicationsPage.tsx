import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import ApplicationBoard from '../components/applications/ApplicationBoard';
import ApplicationForm from '../components/applications/ApplicationForm';
import { useApplications } from '../context/ApplicationContext';

const ApplicationsPage: React.FC = () => {
  const { applications } = useApplications();
  const [isAddingApplication, setIsAddingApplication] = useState(false);
  
  return (
    <Layout requireAuth>
      <div className="space-y-6">
        {isAddingApplication ? (
          <ApplicationForm 
            onSubmit={() => setIsAddingApplication(false)}
            onCancel={() => setIsAddingApplication(false)}
          />
        ) : (
          <ApplicationBoard 
            applications={applications}
            onAddApplication={() => setIsAddingApplication(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default ApplicationsPage;