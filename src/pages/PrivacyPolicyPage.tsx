import React from 'react';
import Layout from '../components/layout/Layout';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral">
          <p className="text-lg mb-6">Last updated: March 12, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              NextStepTracker ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our job application tracking service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email)</li>
              <li>Job application details</li>
              <li>Usage data and analytics</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Storage and Security</h2>
            <p>
              We use industry-standard security measures to protect your data. Your information is stored securely on our servers and is only accessible to authorized personnel.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p>
              We use cookies to enhance your experience on our website. You can choose to disable cookies through your browser settings, but this may affect the functionality of our service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p>
              We use trusted third-party services for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment processing (Stripe)</li>
              <li>Analytics</li>
              <li>Email communications</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
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

export default PrivacyPolicyPage;