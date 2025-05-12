import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Briefcase as BriefcaseBusiness } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6">
              <BriefcaseBusiness className="h-10 w-10 text-primary-600" />
              <span className="text-2xl font-bold text-neutral-800">NextStepTracker</span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-4">
              Track Your Career Journey
            </h1>
            
            <p className="text-lg text-neutral-600 mb-8">
              Organize your job applications in one place. Never miss a follow-up again.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                    <span className="text-sm font-medium">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">Track Every Application</h3>
                  <p className="mt-1 text-neutral-600">
                    Keep all your job applications organized and never lose track of your progress.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                    <span className="text-sm font-medium">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">Log Every Interview</h3>
                  <p className="mt-1 text-neutral-600">
                    Record interview details, notes, and outcomes for future reference.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                    <span className="text-sm font-medium">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-900">Visualize Your Progress</h3>
                  <p className="mt-1 text-neutral-600">
                    See data-driven insights about your job search with clear visualizations.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            {isLogin ? (
              <LoginForm 
                onToggleForm={() => setIsLogin(false)}
              />
            ) : (
              <RegisterForm 
                onToggleForm={() => setIsLogin(true)}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;