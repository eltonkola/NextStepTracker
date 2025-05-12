import React from 'react';
import Layout from '../components/layout/Layout';
import DonateCardList from '../components/donate/DonateCard';
import { Heart } from 'lucide-react';

const DonatePage: React.FC = () => {
  return (
    <Layout requireAuth>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-accent-100 text-accent-600 mb-4">
            <Heart size={24} />
          </div>
          <h1 className="text-3xl font-bold mb-3">Support NextStepTracker</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            If you've found NextStepTracker helpful in your job search, consider supporting its continued development with a small donation.
          </p>
        </div>
        
        <div className="mb-12">
          <DonateCardList />
        </div>
        
        <div className="rounded-lg border border-neutral-200 p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Why Support Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-primary-600 text-lg font-medium">Always Free</div>
              <p className="text-neutral-600">
                NextStepTracker is and always will be free to use. Your donations help us keep it that way.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="text-primary-600 text-lg font-medium">New Features</div>
              <p className="text-neutral-600">
                Your support helps us build new features that make job tracking even easier.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="text-primary-600 text-lg font-medium">No Ads</div>
              <p className="text-neutral-600">
                We don't want to clutter the interface with ads. Donations help us keep the experience clean.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonatePage;