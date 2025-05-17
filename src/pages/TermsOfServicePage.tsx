import React from 'react';
import Layout from '../components/layout/Layout';
import { Sparkles, Gift, Rocket, Heart } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-neutral">
          <p className="text-lg mb-6">Last updated: March 12, 2025</p>
          
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold">Welcome to NextStepTracker!</h2>
            </div>
            <p>
              We're thrilled you're here! This document might look intimidating, but don't worry - we're just here to make sure everyone has a great experience.
            </p>
          </section>
          
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="w-6 h-6 text-success-600" />
              <h2 className="text-2xl font-semibold">Using the Service</h2>
            </div>
            <p>
              You're welcome to use NextStepTracker to track your job applications. It's completely free and you can share it with anyone you like!
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Feel free to tell your friends about us</li>
              <li>Share it with your colleagues</li>
              <li>Use it as much as you want</li>
              <li>It's all local data, so no worries about sharing</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-6 h-6 text-accent-600" />
              <h2 className="text-2xl font-semibold">Job Market Wishes</h2>
            </div>
            <p>
              We're here to help you navigate the job market. Here's what we wish for you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>May your applications be successful</li>
              <li>May you find opportunities that align with your passions</li>
              <li>May your interviews go smoothly</li>
              <li>May you land your dream job</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-pink-500" />
              <h2 className="text-2xl font-semibold">A Few Friendly Reminders</h2>
            </div>
            <p>
              Just a few quick things to keep in mind:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be kind to others</li>
              <li>Don't use the service for anything illegal</li>
              <li>Remember, your data stays on your computer</li>
              <li>We're here to help if you need anything</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p>
              We might update these terms from time to time. If we do, we'll let you know.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              Have questions? Need help? Just want to say hi? Drop us a line at{' '}
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