import React from 'react';
import Layout from '../components/layout/Layout';

const TermsOfServicePage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-neutral">
          <p className="text-lg mb-6">Last updated: March 12, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using NextStepTracker, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              NextStepTracker is a job application tracking service that allows users to manage and monitor their job search process.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any portion of the service</li>
              <li>Interfere with or disrupt the service</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by NextStepTracker and are protected by international copyright, trademark, and other intellectual property rights laws.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All donations are final and non-refundable</li>
              <li>We use Stripe to process payments securely</li>
              <li>You agree to provide current, complete, and accurate payment information</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these terms at any time. We will provide notice of any changes by posting the new terms on the site.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:eltonkola+NextStepTracker@gmail.com" className="text-primary-600 hover:text-primary-700">
                eltonkola+NextStepTracker@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfServicePage;