import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { JobApplication, ApplicationStatus } from '../../types';

interface StatusChartProps {
  applications: JobApplication[];
}

const StatusChart: React.FC<StatusChartProps> = ({ applications }) => {
  // Count applications by status
  const counts: Record<ApplicationStatus, number> = {
    applied: 0,
    screening: 0,
    progress: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0
  };
  
  applications.forEach(app => {
    counts[app.currentStatus]++;
  });

  // Calculate percentages
  const total = applications.length;
  const data = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));

  const statusColors = {
    applied: '#94a3b8', // neutral-500
    screening: '#3b82f6', // primary-500
    progress: '#64748b', // neutral-600
    offer: '#10b981', // success-500
    rejected: '#ef4444', // red-500
    withdrawn: '#f87171' // red-400
  };

  // Check if we have any applications, otherwise show a message
  if (applications.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
        <h3 className="text-lg font-medium mb-3">Application Status</h3>
        <div className="flex items-center justify-center h-64 text-neutral-500">
          No applications to display
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
      <h3 className="text-lg font-medium mb-6">Application Status</h3>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[entry.name.toLowerCase() as ApplicationStatus]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} applications`, '']}
              contentStyle={{ 
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusChart;