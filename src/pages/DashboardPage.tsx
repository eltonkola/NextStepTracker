import React, { useMemo } from 'react';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/dashboard/StatsCard';
import StatusChart from '../components/dashboard/StatusChart';
import ProgressTimeline from '../components/dashboard/ProgressTimeline';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { Link } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';
import { PlusCircle, Briefcase, Calendar, Target, Sparkles, Clipboard, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ApplicationStatus } from '../types';

const DashboardPage: React.FC = () => {
  const { applications } = useApplications();
  
  // Calculate statistics
  const stats = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      applied: 0,
      screening: 0,
      progress: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0
    };
    
    applications.forEach(app => counts[app.currentStatus]++);
    
    const total = applications.length;
    const active = total - counts.rejected;
    
    // Calculate rates
    const acceptanceRate = total > 0 ? (counts.offer / total * 100).toFixed(1) : '0';
    const progressRate = total > 0 ? ((counts.screening + counts.progress + counts.offer) / total * 100).toFixed(1) : '0';
    
    // Recent activity
    const today = new Date();
    const last7Days = applications.filter(app => 
      differenceInDays(today, new Date(app.dateApplied)) <= 7
    ).length;
    const last30Days = applications.filter(app => 
      differenceInDays(today, new Date(app.dateApplied)) <= 30
    ).length;
    
    // Average time to response
    const avgResponseTime = applications
      .filter(app => app.currentStatus !== 'applied')
      .reduce((acc, app) => {
        const steps = app.steps.filter(step => step.status !== 'applied');
        if (steps.length > 0) {
          const firstResponse = new Date(steps[0].date);
          const appliedDate = new Date(app.dateApplied);
          return acc + differenceInDays(firstResponse, appliedDate);
        }
        return acc;
      }, 0) / applications.length;
    
    return {
      total,
      active,
      acceptanceRate,
      progressRate,
      last7Days,
      last30Days,
      avgResponseTime: isNaN(avgResponseTime) ? 0 : Math.round(avgResponseTime),
      counts
    };
  }, [applications]);

  // Get recent applications
  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
      .slice(0, 5);
  }, [applications]);

  // Get favorite applications
  const favoriteApplications = useMemo(() => {
    return applications.filter(app => app.favorite).slice(0, 3);
  }, [applications]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-neutral-600">
              Overview of your job application journey
            </p>
          </div>
          
          <Link to="/applications" className="btn btn-primary">
            <PlusCircle size={16} className="mr-2" />
            Add Application
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Applications"
            value={stats.total}
            icon={<Briefcase size={20} />}
            subtitle="All applications"
            color="primary"
          />
          <StatsCard
            title="Active Applications"
            value={stats.active}
            icon={<Clipboard size={20} />}
            subtitle="Currently in progress"
            color="secondary"
          />
          <StatsCard
            title="Response Rate"
            value={`${stats.progressRate}%`}
            icon={<Target size={20} />}
            subtitle="Got first response"
            color="success"
          />
          <StatsCard
            title="Acceptance Rate"
            value={`${stats.acceptanceRate}%`}
            icon={<Sparkles size={20} />}
            subtitle="Overall success"
            color="success"
          />
        </div>

        {/* Progress Timeline & Status Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Application Timeline</h2>
            <ProgressTimeline applications={applications} />
            <div className="mt-4 text-sm text-neutral-500">
              Average response time: {stats.avgResponseTime} days
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Status Breakdown</h2>
            <StatusChart applications={applications} />
          </div>
        </div>

        {/* Recent Activity & Favorites */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <ActivityFeed applications={recentApplications} />
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Favorite Applications</h2>
            <div className="space-y-4">
              {favoriteApplications.map(app => (
                <div
                  key={app.id}
                  className="flex items-start p-3 hover:bg-neutral-50 rounded-md -mx-3 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {app.position} at {app.company}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`
                        inline-block w-2 h-2 rounded-full 
                        ${getStatusColor(app.currentStatus)}
                      `} />
                      <span className="text-sm text-neutral-500">
                        {format(new Date(app.dateApplied), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Insights */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Application Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-neutral-400" />
                  <span className="text-sm text-neutral-500">Last 7 Days</span>
                </div>
                <TrendingUp size={16} className="text-success-500" />
              </div>
              <p className="text-2xl font-semibold">{stats.last7Days}</p>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-neutral-400" />
                  <span className="text-sm text-neutral-500">Last 30 Days</span>
                </div>
                <TrendingDown size={16} className="text-red-500" />
              </div>
              <p className="text-2xl font-semibold">{stats.last30Days}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'applied': return 'bg-neutral-400';
    case 'screening': return 'bg-primary-500';
    case 'progress': return 'bg-secondary-500';
    case 'offer': return 'bg-success-500';
    case 'rejected': return 'bg-red-500';
    case 'withdrawn': return 'bg-red-400';
    default: return 'bg-neutral-400';
  }
};

export default DashboardPage;