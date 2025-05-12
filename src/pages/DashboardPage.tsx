import React, { useMemo } from 'react';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/dashboard/StatsCard';
import StatusChart from '../components/dashboard/StatusChart';
import { Link } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';
import { PlusCircle, Briefcase, Calendar, Target, Sparkles, Clipboard } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ApplicationStatus } from '../types';

const DashboardPage: React.FC = () => {
  const { applications } = useApplications();
  
  const stats = useMemo(() => {
    // Count applications by status
    const counts: Record<ApplicationStatus, number> = {
      applied: 0,
      screening: 0,
      progress: 0,
      offer: 0,
      rejected: 0
    };
    
    applications.forEach(app => {
      counts[app.currentStatus]++;
    });
    
    // Calculate total and active applications
    const total = applications.length;
    const active = total - counts.rejected;
    
    // Calculate acceptance rate
    const acceptanceRate = total > 0 ? (counts.offer / total * 100).toFixed(1) : '0';
    
    // Applications in the last 30 days
    const today = new Date();
    const last30Days = applications.filter(app => {
      const appDate = new Date(app.dateApplied);
      return differenceInDays(today, appDate) <= 30;
    }).length;
    
    // Calculate progress rate (applications that moved beyond 'applied' status)
    const progressRate = total > 0 
      ? ((counts.screening + counts.progress + counts.offer) / total * 100).toFixed(1)
      : '0';
    
    return {
      total,
      active,
      acceptanceRate,
      last30Days,
      progressRate,
      counts
    };
  }, [applications]);
  
  // Get most recent applications
  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
      .slice(0, 5);
  }, [applications]);
  
  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-neutral-600">
              Your job application overview
            </p>
          </div>
          
          <Link to="/applications" className="btn btn-primary">
            <PlusCircle size={16} className="mr-2" />
            Add Application
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Applications"
            value={stats.total}
            icon={<Briefcase size={20} />}
            subtitle="All time"
            color="primary"
          />
          <StatsCard
            title="Active Applications"
            value={stats.active}
            icon={<Clipboard size={20} />}
            subtitle="In progress"
            color="secondary"
          />
          <StatsCard
            title="Response Rate"
            value={`${stats.progressRate}%`}
            icon={<Target size={20} />}
            subtitle="Got first response"
            color="warning"
          />
          <StatsCard
            title="Offer Rate"
            value={`${stats.acceptanceRate}%`}
            icon={<Sparkles size={20} />}
            subtitle="Received offers"
            color="success"
          />
        </div>
        
        {/* Charts and Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StatusChart applications={applications} />
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Recent Applications</h3>
              <Link to="/applications" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            
            {recentApplications.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <p>No applications yet</p>
                <Link to="/applications" className="btn btn-primary mt-4">
                  Add Your First Application
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map(app => (
                  <Link 
                    key={app.id}
                    to={`/applications/${app.id}`}
                    className="flex items-start p-3 hover:bg-neutral-50 rounded-md -mx-3 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {app.position} at {app.company}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`
                          inline-block w-2 h-2 rounded-full 
                          ${app.currentStatus === 'applied' ? 'bg-neutral-500' :
                            app.currentStatus === 'screening' ? 'bg-primary-500' :
                            app.currentStatus === 'progress' ? 'bg-secondary-500' :
                            app.currentStatus === 'offer' ? 'bg-success-500' :
                            'bg-error-500'}
                        `}></span>
                        <p className="text-xs text-neutral-500 capitalize">
                          {app.currentStatus}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex flex-col items-end text-sm">
                      <time className="text-xs text-neutral-500">
                        {format(new Date(app.dateApplied), 'MMM d, yyyy')}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;