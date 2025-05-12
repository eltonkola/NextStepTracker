import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { CheckCircle, Star, BarChart as ChartBar, Clock, ListChecks, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Take Control of Your <span className="text-primary-600">Job Search</span>
              </h1>
              <p className="text-lg text-neutral-600">
                Track every application, interview, and offer in one place. Never miss a follow-up again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to={user ? "/dashboard" : "/login"}
                  className="btn btn-primary px-8 py-3"
                >
                  {user ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                {!user && (
                  <Link
                    to="/login"
                    className="btn btn-outline px-8 py-3"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Briefcase className="h-6 w-6 text-primary-600 mr-2" />
                    <h3 className="font-semibold text-lg">Application Tracker</h3>
                  </div>
                  <span className="badge badge-success">
                    New
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Frontend Developer</p>
                      <span className="text-xs text-neutral-500">2d ago</span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">Acme Inc.</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
                        Screening
                      </span>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">UX Designer</p>
                      <span className="text-xs text-neutral-500">5d ago</span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">TechCorp</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-secondary-50 px-2 py-1 text-xs font-medium text-secondary-700">
                        In Progress
                      </span>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Product Manager</p>
                      <span className="text-xs text-neutral-500">1w ago</span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">StartupXYZ</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-success-50 px-2 py-1 text-xs font-medium text-success-700">
                        Offer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Track Every Step of Your Job Search</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              From application to offer, NextStepTracker helps you stay organized and on top of your job search.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary-100 text-primary-600 mb-4">
                <ListChecks size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organize Applications</h3>
              <p className="text-neutral-600">
                Keep all your job applications in one place. Track company, position, salary, and more.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-neutral-600">
                Monitor each stage of the interview process. Never miss a follow-up or deadline.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-accent-100 text-accent-600 mb-4">
                <ChartBar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visualize Results</h3>
              <p className="text-neutral-600">
                See data-driven insights about your job search. Identify patterns and improve your approach.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Hear from people who have landed their dream jobs with NextStepTracker.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
              <div className="flex items-center text-yellow-500 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-neutral-700 mb-4">
                "NextStepTracker helped me stay organized during my job search. I could see all my applications at a glance and never missed a follow-up."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600">
                  JS
                </div>
                <div className="ml-3">
                  <p className="font-medium">Jamie Smith</p>
                  <p className="text-sm text-neutral-500">Software Engineer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
              <div className="flex items-center text-yellow-500 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-neutral-700 mb-4">
                "The visual board made it easy to see where I was in the process for each company. This tool was essential in landing my new role."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600">
                  AT
                </div>
                <div className="ml-3">
                  <p className="font-medium">Alex Taylor</p>
                  <p className="text-sm text-neutral-500">UX Designer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
              <div className="flex items-center text-yellow-500 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-neutral-700 mb-4">
                "I applied to over 50 jobs during my search, and NextStepTracker was the only way I could keep track of everything. Worth every penny!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600">
                  MJ
                </div>
                <div className="ml-3">
                  <p className="font-medium">Morgan Jones</p>
                  <p className="text-sm text-neutral-500">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-50 border-y border-primary-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Organize Your Job Search?</h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto mb-8">
            Sign up for free and take control of your career journey today.
          </p>
          <Link
            to={user ? "/dashboard" : "/login"}
            className="btn btn-primary px-8 py-3"
          >
            {user ? "Go to Dashboard" : "Get Started for Free"}
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;