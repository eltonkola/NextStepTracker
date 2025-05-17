import React, { useMemo, useState, useEffect } from 'react';
import { JobApplication, ApplicationStatus } from '../../types';
import ApplicationItem from './ApplicationItem';
import { PlusCircle, Filter, Search, Minus, Plus } from 'lucide-react';
import { Transition } from '@headlessui/react';

interface ApplicationBoardProps {
  applications: JobApplication[];
  onAddApplication: () => void;
}

interface StatusGroup {
  title: string;
  statuses: ApplicationStatus[];
  color: string;
}

interface Section {
  title: string;
  type: 'columns' | 'grid';
  statuses: ApplicationStatus[];
}

const ApplicationBoard: React.FC<ApplicationBoardProps> = ({ applications, onAddApplication }) => {
  // Define status groups
  const statusGroups: StatusGroup[] = [
    {
      title: 'Active',
      statuses: ['applied', 'screening', 'interview', 'assessment', 'final', 'progress'],
      color: 'primary'
    },
    {
      title: 'Offers',
      statuses: ['offer', 'accepted'],
      color: 'success'
    },
    {
      title: 'Closed',
      statuses: ['rejected', 'withdrawn', 'archived'],
      color: 'neutral'
    }
  ];

  // Status options with labels and colors
  const statusOptions = [
    { value: 'applied', label: 'Applied', color: 'neutral-400' },
    { value: 'screening', label: 'Screening', color: 'primary-500' },
    { value: 'interview', label: 'Interview', color: 'primary-400' },
    { value: 'assessment', label: 'Assessment', color: 'primary-300' },
    { value: 'final', label: 'Final Interview', color: 'primary-200' },
    { value: 'progress', label: 'In Progress', color: 'secondary-500' },
    { value: 'offer', label: 'Offer', color: 'success-500' },
    { value: 'accepted', label: 'Accepted', color: 'success-400' },
    { value: 'rejected', label: 'Rejected', color: 'error-500' },
    { value: 'withdrawn', label: 'Withdrawn', color: 'warning-500' },
    { value: 'archived', label: 'Archived', color: 'neutral-500' }
  ];

  // Initialize filters with all statuses
  const initialFilters: Record<ApplicationStatus, boolean> = {};
  statusOptions.forEach(option => {
    initialFilters[option.value] = option.value !== 'archived';
  });

  // State for filters
  const [filters, setFilters] = useState<Record<ApplicationStatus, boolean>>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  // Add search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<JobApplication[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Group applications by status for search results
  const groupedSearchResults = useMemo(() => {
    if (!searchResults.length) return {};
    
    const groups: Record<string, JobApplication[]> = {};
    
    searchResults.forEach(app => {
      const statusGroup = statusGroups.find(group => group.statuses.includes(app.currentStatus));
      const groupName = statusGroup?.title || 'Other';
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(app);
    });
    
    return groups;
  }, [searchResults]);

  // Filter applications based on search query
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const filteredApps = applications.filter(app => {
      const searchTerms = searchQuery.toLowerCase();
      return (
        app.company.toLowerCase().includes(searchTerms) ||
        app.position.toLowerCase().includes(searchTerms) ||
        app.currentStatus.toLowerCase().includes(searchTerms)
      );
    });

    setSearchResults(filteredApps);
  }, [searchQuery, applications]);

  // Calculate applications by status
  const applicationsByStatus: Record<ApplicationStatus, JobApplication[]> = {
    applied: [],
    screening: [],
    interview: [],
    assessment: [],
    final: [],
    progress: [],
    offer: [],
    accepted: [],
    rejected: [],
    withdrawn: [],
    archived: []
  };

  applications.forEach(app => {
    applicationsByStatus[app.currentStatus].push(app);
  });

  // Sort each status group by the most recent step date
  Object.keys(applicationsByStatus).forEach(status => {
    applicationsByStatus[status as ApplicationStatus].sort((a, b) => {
      const aLatestStep = a.steps && a.steps.length > 0 
        ? [...a.steps].sort((x, y) => 
            new Date(y.date).getTime() - new Date(x.date).getTime()
          )[0]
        : { date: a.dateApplied };
      
      const bLatestStep = b.steps && b.steps.length > 0 
        ? [...b.steps].sort((x, y) => 
            new Date(y.date).getTime() - new Date(x.date).getTime()
          )[0]
        : { date: b.dateApplied };
      
      return new Date(bLatestStep.date).getTime() - new Date(aLatestStep.date).getTime();
    });
  });

  // Define sections
  const sections: Section[] = [
    {
      title: 'Timeline',
      type: 'columns',
      statuses: ['screening', 'interview', 'assessment', 'final', 'progress', 'offer']
    },
    {
      title: 'Done',
      type: 'columns',
      statuses: ['accepted', 'withdrawn', 'archived']
    },
    {
      title: 'Potential Applications',
      type: 'grid',
      statuses: ['applied']
    },
    {
      title: 'Rejections',
      type: 'grid',
      statuses: ['rejected']
    }
  ];

  // Background colors for sections
  const sectionBackgrounds = {
    'Timeline': 'bg-primary-100',
    'Potential Applications': 'bg-purple-100',
    'Rejections': 'bg-red-100',
    'Done': 'bg-green-100'
  };

  // Get content background color (slightly lighter variant)
  const getContentBackground = (title: string): string => {
    switch (title) {
      case 'Timeline':
        return 'bg-primary-50';
      case 'Potential Applications':
        return 'bg-purple-50';
      case 'Rejections':
        return 'bg-red-50';
      case 'Done':
        return 'bg-green-50';
      default:
        return 'bg-neutral-50';
    }
  };

  // Add state for section expansion
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({
      ...acc,
      [section.title]: true
    }), {})
  );

  // Toggle section expansion
  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Get color for status
  const getStatusColor = (status: ApplicationStatus): string => {
    switch (status) {
      case 'applied':
        return 'purple-500';
      case 'screening':
        return 'primary-500';
      case 'interview':
        return 'primary-400';
      case 'assessment':
        return 'primary-300';
      case 'final':
        return 'primary-200';
      case 'progress':
        return 'purple-500';
      case 'offer':
        return 'success-500';
      case 'accepted':
        return 'success-500';
      case 'rejected':
        return 'error-500';
      case 'withdrawn':
        return 'neutral-500';
      case 'archived':
        return 'neutral-400';
      default:
        return 'neutral-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">Application Board</h2>
        </div>
        <div className="flex-1 min-w-0 px-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="input input-bordered w-full rounded-lg pr-12 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 focus:border-primary focus:ring-0 px-6 py-3.5"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full max-w-2xl mt-2 rounded-lg shadow-lg bg-white border border-neutral-200 max-h-96 overflow-auto">
                {Object.entries(groupedSearchResults).map(([status, apps]) => {
                  const statusGroup = statusGroups.find(group => group.title === status);
                  const groupColor = statusGroup ? getStatusGroupColor(statusGroup) : 'neutral-400';
                  
                  return (
                    <div key={status} className="border-b border-neutral-200">
                      <div 
                        className={`px-3 py-2 font-medium bg-${groupColor}-100 text-${groupColor}-600`}
                      >
                        {status}
                      </div>
                      {apps.map((app) => (
                        <div
                          key={app.id}
                          className="px-3 py-2 hover:bg-neutral-100 cursor-pointer border-l-4 border-transparent hover:border-${getStatusColor(app.currentStatus)}"
                          onClick={() => {
                            // You can add navigation logic here
                            console.log('Clicked on:', app);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{app.company}</div>
                              <div className="text-sm text-neutral-600">{app.position}</div>
                            </div>
                            <div 
                              className={`text-sm text-${getStatusColor(app.currentStatus)} font-medium`}
                            >
                              {app.currentStatus}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline text-sm"
          >
            <Filter size={16} className="mr-1" />
            Filters
          </button>
          <button
            onClick={onAddApplication}
            className="btn btn-primary text-sm"
          >
            <PlusCircle size={16} className="mr-1" />
            Add Application
          </button>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.title}>
          <div className={`rounded-lg overflow-hidden`}>
            <div 
              className={`flex items-center justify-between cursor-pointer ${sectionBackgrounds[section.title]} p-4`}
              onClick={() => toggleSection(section.title)}
            >
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <button className="btn btn-ghost btn-sm">
                {expandedSections[section.title] ? (
                  <Minus size={20} className="text-neutral-500" />
                ) : (
                  <Plus size={20} className="text-neutral-500" />
                )}
              </button>
            </div>

            <Transition
              show={expandedSections[section.title]}
              enter="transition-all duration-300"
              enterFrom="opacity-0 max-h-0"
              enterTo="opacity-100 max-h-full"
              leave="transition-all duration-300"
              leaveFrom="opacity-100 max-h-full"
              leaveTo="opacity-0 max-h-0"
            >
              <div className={`p-6 ${getContentBackground(section.title)}`}>
                {section.type === 'columns' ? (
                  <div className={`grid grid-cols-1 ${section.title === 'Done' ? 'md:grid-cols-3' : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'} gap-4`}>
                    {section.statuses.map(status => {
                      if (!filters[status]) return null;
                      
                      const applications = applicationsByStatus[status];
                      const statusOption = statusOptions.find(option => option.value === status);
                      
                      return (
                        <div key={status} className="flex flex-col h-full">
                          <div className="flex items-center mb-3">
                            <div className={`w-3 h-3 rounded-full bg-${getStatusColor(status)} mr-2`} />
                            <h4 className="font-medium">{statusOption?.label}</h4>
                            <span className="ml-1.5 text-sm text-neutral-500">
                              ({applications.length})
                            </span>
                          </div>
                          
                          <div className="flex-1 min-h-[200px]">
                            {applications.length === 0 ? (
                              <div className="h-44 border border-dashed border-neutral-300 rounded-md flex items-center justify-center text-neutral-500 text-sm p-4">
                                No applications in this status
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {applications.map(application => (
                                  <ApplicationItem 
                                    key={application.id} 
                                    application={application} 
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {applicationsByStatus.applied.length === 0 ? (
                      <div className="h-44 border border-dashed border-neutral-300 rounded-md flex items-center justify-center text-neutral-500 text-sm p-4">
                        No potential applications yet
                      </div>
                    ) : (
                      applicationsByStatus.applied.map(application => (
                        <ApplicationItem 
                          key={application.id} 
                          application={application} 
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </Transition>
          </div>
        </div>
      ))}

      {/* Filters Dropdown */}
      <Transition
        show={showFilters}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Filter Applications</h3>
                
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div key={section.title} className="space-y-2">
                      <h4 className="font-medium">{section.title}:</h4>
                      <div className="space-y-2">
                        {section.statuses.map((status) => {
                          const statusOption = statusOptions.find(option => option.value === status);
                          return (
                            <label
                              key={status}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={filters[status]}
                                onChange={(e) => {
                                  setFilters(prev => ({
                                    ...prev,
                                    [status]: e.target.checked
                                  }));
                                }}
                                className="form-checkbox"
                              />
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full bg-${getStatusColor(status)}`} />
                                <span className={`text-${getStatusColor(status)}`}>
                                  {statusOption?.label}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowFilters(false);
                      setFilters(initialFilters);
                    }}
                    className="btn btn-secondary"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default ApplicationBoard;