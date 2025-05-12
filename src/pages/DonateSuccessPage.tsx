import React from 'react';
import Layout from '../components/layout/Layout';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DonateSuccessPage: React.FC = () => {
  return (
    <Layout requireAuth>
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-success-100 p-3">
            <CheckCircle className="h-12 w-12 text-success-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Thank You for Your Support!</h1>
        
        <p className="text-neutral-600 mb-8">
          Your donation helps us continue to improve NextStepTracker and build new features.
          We truly appreciate your generosity!
        </p>
        
        <Link to="/dashboard" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    </Layout>
  );
};

export default DonateSuccessPage;