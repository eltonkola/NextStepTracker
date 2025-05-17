import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { CheckCircle, Star, BarChart as ChartBar, Clock, ListChecks, ArrowRight, Briefcase, Code, Gift, HardDrive, Users, ShieldCheck, Rocket } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Job Search, <span className="text-primary-600 dark:text-primary-400">Your Control</span>
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300">
                Track your applications with confidence. Your data stays local, and the community keeps it free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/dashboard"
                  className="btn btn-primary px-8 py-3 bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white dark:text-neutral-50"
                >
                  Get Started
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Briefcase className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-200">Application Tracker</h3>
                  </div>
                  <span className="badge badge-success bg-success-500 dark:bg-success-400 text-white dark:text-neutral-50">
                    Open Source
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-500 dark:text-success-400" />
                    <span className="text-neutral-900 dark:text-neutral-200">Track all your applications in one place</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-500 dark:text-success-400" />
                    <span className="text-neutral-900 dark:text-neutral-200">Log every interview and follow-up</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-500 dark:text-success-400" />
                    <span className="text-neutral-900 dark:text-neutral-200">Get insights about your job search progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose NextStepTracker
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <Code className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Open Source</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Check out the code on GitHub. Everything is transparent and community-driven.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <HardDrive className="h-8 w-8 text-accent-600 dark:text-accent-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Local Only</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Your data stays on your computer. We don't collect or track anything.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <Gift className="h-8 w-8 text-success-600 dark:text-success-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Forever</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                No subscriptions, no hidden costs, no ads. Just a free tool to help you.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <Users className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Built by developers, for job seekers. Join our community and help shape the future!
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <ShieldCheck className="h-8 w-8 text-green-500 dark:text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                We don't collect or share your data. Your privacy is our priority.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <Rocket className="h-8 w-8 text-purple-500 dark:text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Job Market Support</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                We're here to help you navigate the job market and find success.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;