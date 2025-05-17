import React from 'react';
import Layout from '../components/layout/Layout';
import { ShieldCheck, Lock, HardDrive } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral">
          <p className="text-lg mb-6">Last updated: March 12, 2025</p>
          
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold">Your Data is Super Safe</h2>
            </div>
            <p>
              At NextStepTracker, we take your privacy seriously. But guess what? You don't have to worry because we don't collect any of your data! 🎉
            </p>
            <p>
              Everything you enter stays right there on your computer. It's like having a secret diary, but for job applications.
            </p>
          </section>
          
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-success-600" />
              <h2 className="text-2xl font-semibold">What We Don't Do</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Don't collect your data</li>
              <li>Don't send your data to servers</li>
              <li>Don't share your data with anyone</li>
              <li>Don't sell your data (because we don't have it!)</li>
              <li>Don't even know what you're tracking</li>
            </ul>
            <p>
              Your job applications are as private as your thoughts. We promise!
            </p>
          </section>
          
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="w-6 h-6 text-accent-600" />
              <h2 className="text-2xl font-semibold">Where Your Data Lives</h2>
            </div>
            <p>
              Your data lives in your browser's local storage. That means:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>It stays on your computer</li>
              <li>It's only accessible to you</li>
              <li>It's deleted when you clear your browser data</li>
              <li>It's as private as your favorite cookie recipe</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p>
              We don't use cookies because we don't need to track anything. Your data stays right where you put it!
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p>
              Since we don't collect any data, you don't need to worry about:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accessing your personal data (it's all yours!)</li>
              <li>Correcting inaccurate data (just delete and re-enter)</li>
              <li>Requesting deletion (just clear your browser data)</li>
            </ul>
            <p>
              But hey, that's a good thing! Your data is 100% under your control.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, or if you just want to chat about job applications, feel free to reach out to us at{' '}
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