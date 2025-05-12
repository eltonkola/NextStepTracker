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
    rejected: 0
  };
  
  applications.forEach(app => {
    counts[app.currentStatus]++;
  });
  
  const statusColors = {
    applied: '#64748b', // neutral
    screening: '#3b82f6', // primary
    progress: '#0ea5e9', // secondary
    offer: '#22c55e', // success
    rejected: '#ef4444', // error
  };
  
  const statusLabels = {
    applied: 'Applied',
    screening: 'Screening',
    progress: 'In Progress',
    offer: 'Offer',
    rejected: 'Rejected'
  };
  
  const data = Object.entries(counts)
    .map(([status, count]) => ({
      name: statusLabels[status as ApplicationStatus],
      value: count,
      color: statusColors[status as ApplicationStatus]
    }))
    .filter(item => item.value > 0);
  
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
      
      <div className="h-64">
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
                <Cell key={`cell-${index}`} fill={entry.color} />
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