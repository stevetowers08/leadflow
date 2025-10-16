/**
 * DEPRECATED: Jobs Page (v1) - Legacy Implementation
 * 
 * ⚠️  WARNING: This page uses the old table system and should NOT be used.
 * 
 * Please use JobsV2.tsx instead, which implements the unified design system:
 * - UnifiedTable component
 * - Consistent styling and behavior
 * - Better performance and maintainability
 * 
 * This file will be removed in a future update.
 * 
 * Legacy Features (DO NOT USE):
 * - Custom HTML table structure
 * - Inconsistent styling
 * - Old pagination system
 */

import { DropdownSelect } from '@/components/ui/dropdown-select';
// Removed EnhancedTable imports - using regular HTML table for pagination
import { SearchIconButton, SearchModal } from '@/components/ui/search-modal';
import { useAuth } from '@/contexts/AuthContext';
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
import { Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';
import { getClearbitLogo } from '@/services/logoService';
import { getJobStatusFromPipeline } from '@/utils/jobStatus';
import { getStatusDisplayText } from '@/utils/statusUtils';
import {
  Bot,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Star,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import '../styles/table-system.css';

type Job = Tables<'jobs'> & {
  companies?: {
    name?: string;
    industry?: string;
    head_office?: string;
    company_size?: string;
    website?: string;
    lead_score?: string;
    priority?: string;
    automation_active?: boolean;
    confidence_level?: string;
    linkedin_url?: string;
    score_reason?: string;
    is_favourite?: boolean;
    pipeline_stage?: string;
  };
  total_leads?: number;
  new_leads?: number;
  automation_started_leads?: number;
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('posted_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [users, setUsers] = useState<
    { id: string; full_name: string; role: string }[]
  >([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const { toast } = useToast();
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();

  const [activeTab, setActiveTab] = useState('all');

  // Tab options for Jobs page
  const tabOptions = [
    {
      id: 'all',
      label: 'All Jobs',
      icon: Briefcase,
      count: jobs.length,
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: Clock,
      count: jobs.filter(job => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return job.created_at && new Date(job.created_at) >= oneDayAgo;
      }).length,
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: DollarSign,
      count: jobs.filter(job => job.title?.toLowerCase().includes('sales'))
        .length,
    },
    {
      id: 'new',
      label: 'New',
      icon: Bot,
      count: jobs.filter(
        job =>
          job.new_leads &&
          job.new_leads > 0 &&
          job.automation_started_leads === 0
      ).length,
    },
  ];

  // Calculate job status based on company's pipeline stage
  const getJobStatusFromCompany = (job: Job): string => {
    return getJobStatusFromPipeline(job.companies?.pipeline_stage);
  };

  // Sort options
  const sortOptions = [
    { label: 'Posted Date', value: 'posted_date' },
    { label: 'Job Title', value: 'title' },
    { label: 'Company', value: 'companies.name' },
    { label: 'Location', value: 'location' },
    { label: 'Salary', value: 'salary_range' },
  ];

  // Status options (based on automation_active and other job states)
  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Automated', value: 'automated' },
    { label: 'Not Automated', value: 'not_automated' },
    { label: 'Expired', value: 'expired' },
  ];

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        let query = supabase.from('jobs').select(`
            *,
            companies!left(
              name,
              industry,
              head_office,
              company_size,
              website,
              lead_score,
              priority,
              automation_active,
              confidence_level,
              linkedin_url,
              score_reason,
              is_favourite,
              pipeline_stage,
              people(count)
            )
          `);

        // Apply filters
        if (statusFilter !== 'all') {
          switch (statusFilter) {
            case 'active':
              query = query.eq('automation_active', false);
              break;
            case 'automated':
              query = query.eq('automation_active', true);
              break;
            case 'not_automated':
              query = query.eq('automation_active', false);
              break;
            case 'expired':
              query = query.lt(
                'valid_through',
                new Date().toISOString().split('T')[0]
              );
              break;
          }
        }

        // Apply search
        if (searchTerm) {
          query = query.or(
            `title.ilike.%${searchTerm}%,companies.name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`
          );
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        const { data, error } = await query;

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch jobs',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [statusFilter, searchTerm, sortBy, sortOrder, toast]);

  // Calculate stats for stats cards - REMOVED
  // const jobsStats = useMemo(() => {
  //   let activeJobs = 0;
  //   let automatedJobs = 0;
  //   let pendingJobs = 0;
  //   let endingSoonJobs = 0;

  //   jobs.forEach(job => {
  //     // Count active jobs (any job that's not closed)
  //     if (
  //       job.companies?.pipeline_stage !== 'closed_lost' &&
  //       job.companies?.pipeline_stage !== 'closed_won'
  //     ) {
  //       activeJobs++;
  //     }

  //     // Count automated jobs
  //     if (job.companies?.automation_active) {
  //       automatedJobs++;
  //     }

  //     // Count pending jobs (new leads, automated, replied)
  //     if (
  //       ['new_lead', 'automated', 'replied'].includes(
  //         job.companies?.pipeline_stage || ''
  //       )
  //     ) {
  //       pendingJobs++;
  //     }

  //     // Count ending soon jobs (negotiation stage)
  //     if (job.companies?.pipeline_stage === 'negotiation') {
  //       endingSoonJobs++;
  //     }
  //   });

  //   return {
  //     totalJobs: jobs.length,
  //     activeJobs,
  //     automatedJobs,
  //     pendingJobs,
  //     endingSoonJobs,
  //   };
  // }, [jobs]);

  // Stats for Jobs page - REMOVED
  // const stats: StatItemProps[] = [
  //   {
  //     icon: Briefcase,
  //     value: jobsStats.activeJobs,
  //     label: 'active jobs',
  //   },
  //   {
  //     icon: Zap,
  //     value: jobsStats.automatedJobs,
  //     label: 'automated',
  //   },
  //   {
  //     icon: Target,
  //     value: jobsStats.pendingJobs,
  //     label: 'pending',
  //   },
  //   {
  //     icon: CheckCircle,
  //     value: jobsStats.endingSoonJobs,
  //     label: 'ending soon',
  //   },
  // ];

  // Filtered jobs based on active tab and other filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Tab filter
      if (activeTab !== 'all') {
        switch (activeTab) {
          case 'recent': {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            if (!job.created_at || new Date(job.created_at) < oneDayAgo) {
              return false;
            }
            break;
          }
          case 'sales': {
            if (!job.title?.toLowerCase().includes('sales')) {
              return false;
            }
            break;
          }
          case 'new': {
            if (
              !(
                job.new_leads &&
                job.new_leads > 0 &&
                job.automation_started_leads === 0
              )
            ) {
              return false;
            }
            break;
          }
        }
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          job.title?.toLowerCase().includes(searchLower) ||
          job.companies?.name?.toLowerCase().includes(searchLower) ||
          job.location?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Favorites filter (based on company's favorite status)
      if (showFavoritesOnly && !job.companies?.is_favourite) {
        return false;
      }

      return true;
    });
  }, [jobs, activeTab, searchTerm, showFavoritesOnly]);

  // Reset current page when filtered jobs change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredJobs.length]);

  // Company Logo Component
  const CompanyLogo = ({ job }: { job: Job }) => {
    const logoUrl = getClearbitLogo(job.companies?.name || '');

    return (
      <div className='h-8 w-8 rounded-lg bg-muted flex items-center justify-center'>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${job.companies?.name} logo`}
            className='h-full w-full object-contain rounded-lg'
            onError={e => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <Building2
          className={cn(
            'h-1/2 w-1/2 text-muted-foreground',
            logoUrl && 'hidden'
          )}
        />
      </div>
    );
  };

  const tableData = useMemo(
    () =>
      filteredJobs.map(job => ({
        id: job.id,
        title: job.title,
        employment_type: job.employment_type,
        company: job.companies?.name || '-',
        industry: job.companies?.industry || '-',
        location: job.location || '-',
        function: job.function || '-',
        priority: job.priority || 'medium',
        ai_score: job.lead_score_job || job.companies?.lead_score || '-',
        leads: job.total_leads || 0,
        posted_date: job.posted_date || null,
        expires: job.valid_through || '-',
        status: getJobStatusFromCompany(job),
        is_favorite: job.companies?.is_favourite,
      })),
    [filteredJobs]
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <Page title='Jobs' hideHeader>
      <div className='flex flex-col overflow-hidden h-[600px]'>
        {/* Modern Tab Navigation */}
        <div className='border-b border-gray-300 mb-4 flex-shrink-0'>
          <nav className='flex space-x-6'>
            {tabOptions.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setStatusFilter(tab.id);
                  }}
                  className={cn(
                    'relative flex items-center gap-2 py-3 px-1 text-sm font-medium transition-colors duration-200',
                    'border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300',
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500'
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full',
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search, Filter and Sort Controls - Full Width */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 w-full flex-shrink-0'>
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
            {/* Status Filter */}
            <DropdownSelect
              options={statusOptions}
              value={statusFilter}
              onValueChange={value => setStatusFilter(value)}
              placeholder='All Statuses'
              className='min-w-28 sm:min-w-32 bg-white h-8 !py-1 text-sm border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50'
            />

            {/* Assignment Filter */}
            <DropdownSelect
              options={[
                { label: 'All Users', value: 'all' },
                ...users.map(userItem => ({
                  label:
                    userItem.id === user?.id
                      ? `${userItem.full_name} (me)`
                      : userItem.full_name,
                  value: userItem.id,
                })),
              ]}
              value={selectedUser}
              onValueChange={value => setSelectedUser(value)}
              placeholder='Filter by user'
              className='min-w-32 sm:min-w-40 bg-white h-8 !py-1 text-sm border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50'
            />

            {/* Favorites Icon Button */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                'h-8 w-8 rounded-md border flex items-center justify-center transition-colors',
                showFavoritesOnly
                  ? 'bg-primary-50 text-primary-700 border-primary-200'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              )}
              title={
                showFavoritesOnly ? 'Show all jobs' : 'Show favorites only'
              }
            >
              <Star
                className={cn('h-4 w-4', showFavoritesOnly && 'fill-current')}
              />
            </button>
          </div>

          <div className='flex items-center gap-3'>
            {/* Sort Dropdown */}
            <DropdownSelect
              options={sortOptions}
              value={sortBy}
              onValueChange={value => setSortBy(value)}
              placeholder='Sort by'
              className='min-w-32 bg-white h-8 !py-1 text-sm border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50'
            />

            {/* Search Button */}
            <SearchIconButton
              onClick={() => setIsSearchModalOpen(true)}
              className='h-8 w-8'
            />
          </div>
        </div>

        {/* Data Table - Full Width */}
        <div className='bg-white rounded-lg border border-gray-300 w-full overflow-x-auto overflow-y-auto flex-1 min-h-0 max-h-[500px]'>
          <table className='table-system w-full'>
            <thead>
              <tr className='transition-colors data-[state=selected]:bg-muted hover:bg-muted/50 border-b border-gray-300 bg-gray-50/50'>
                <th
                  className=''
                  scope='col'
                  style={{ width: '120px', minWidth: '120px' }}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <span>Status</span>
                  </div>
                </th>
                <th
                  className=''
                  scope='col'
                  style={{ width: '450px', minWidth: '450px' }}
                >
                  <div className='flex items-center gap-2 justify-start'>
                    <span>Job Title</span>
                  </div>
                </th>
                <th
                  className=''
                  scope='col'
                  style={{ width: '300px', minWidth: '300px' }}
                >
                  <div className='flex items-center gap-2 justify-start'>
                    <span>Company</span>
                  </div>
                </th>
                <th
                  className=''
                  scope='col'
                  style={{ width: '200px', minWidth: '200px' }}
                >
                  <div className='flex items-center gap-2 justify-start'>
                    <span>Industry</span>
                  </div>
                </th>
                <th
                  className=''
                  scope='col'
                  style={{ width: '150px', minWidth: '150px' }}
                >
                  <div className='flex items-center gap-2 justify-start'>
                    <span>Location</span>
                  </div>
                </th>
                <th
                  className=''
                  scope='col'
                  style={{ width: '180px', minWidth: '180px' }}
                >
                  <div className='flex items-center gap-2 justify-start'>
                    <span>Function</span>
                  </div>
                </th>
                <th
                  className=''
                  scope='col'
                  style={{ width: '120px', minWidth: '120px' }}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <span>Priority</span>
                  </div>
                </th>
                <th
                  className='h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center'
                  scope='col'
                  style={{ width: '100px', minWidth: '100px' }}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <span>AI Score</span>
                  </div>
                </th>
                <th
                  className='h-12 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center'
                  scope='col'
                  style={{ width: '100px', minWidth: '100px' }}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <span>Leads</span>
                  </div>
                </th>
                <th
                  className=''
                  scope='col'
                  style={{ width: '120px', minWidth: '120px' }}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <span>Posted</span>
                  </div>
                </th>
                <th
                  className=''
                  scope='col'
                  style={{ width: '120px', minWidth: '120px' }}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <span>Expires</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.map((job, index) => (
                <tr
                  key={job.id}
                  className='data-[state=selected]:bg-muted border-b border-gray-100 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-200 transition-colors duration-200 group cursor-pointer relative min-h-[48px]'
                  role='row'
                  tabIndex={0}
                  aria-label={`Row ${index + 1}`}
                  onClick={() => openPopup('job', job.id, job.title)}
                >
                  {/* Status */}
                  <td
                    data-cell-type='status'
                    style={{ width: '120px', minWidth: '120px' }}
                  >
                    <div>
                      <span>
                        {getStatusDisplayText(getJobStatusFromCompany(job))}
                      </span>
                    </div>
                  </td>

                  {/* Job Title */}
                  <td style={{ width: '450px', minWidth: '450px' }}>
                    <div>
                      <div className='leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
                        {job.title || '-'}
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td
                    className=''
                    style={{ width: '300px', minWidth: '300px' }}
                  >
                    <div className='min-w-0 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors duration-150'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'>
                          {job.companies?.website ? (
                            <img
                              src={getClearbitLogo(job.companies.name || '')}
                              alt={job.companies.name}
                              className='w-8 h-8 rounded-lg object-cover'
                              onError={e => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove(
                                  'hidden'
                                );
                              }}
                            />
                          ) : null}
                          <div className='w-8 h-8 rounded-lg bg-blue-600 text-white items-center justify-center text-xs font-semibold hidden'>
                            {job.companies?.name
                              ? job.companies.name.charAt(0).toUpperCase()
                              : '?'}
                          </div>
                        </div>
                        <div className='flex flex-col min-w-0 flex-1'>
                          <div className='leading-tight hover:text-blue-600 transition-colors duration-150 whitespace-nowrap overflow-hidden text-ellipsis'>
                            {job.companies?.name || '-'}
                          </div>
                        </div>
                        <div>
                          <button className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation hover:scale-[1.02] active:scale-98 h-8 w-8 p-0 hover:bg-transparent text-gray-500 hover:text-yellow-500 action-bar-icon'>
                            <Star className='h-3 w-3' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Industry */}
                  <td
                    className=''
                    style={{ width: '200px', minWidth: '200px' }}
                  >
                    <div className='min-w-0'>
                      <div className='text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
                        {job.companies?.industry || '-'}
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td
                    className=''
                    style={{ width: '150px', minWidth: '150px' }}
                  >
                    <div className='min-w-0'>
                      <div className='text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
                        {job.location || '-'}
                      </div>
                    </div>
                  </td>

                  {/* Function */}
                  <td
                    className=''
                    style={{ width: '180px', minWidth: '180px' }}
                  >
                    <div className='min-w-0'>
                      <div className='text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
                        {job.function || '-'}
                      </div>
                    </div>
                  </td>

                  {/* Priority */}
                  <td
                    data-cell-type='priority'
                    style={{ width: '120px', minWidth: '120px' }}
                  >
                    <div>
                      <span>{job.priority || 'Medium'}</span>
                    </div>
                  </td>

                  {/* AI Score */}
                  <td
                    data-cell-type='ai-score'
                    style={{ width: '100px', minWidth: '100px' }}
                  >
                    <div>
                      <span>
                        {job.lead_score_job || job.companies?.lead_score || '-'}
                      </span>
                    </div>
                  </td>

                  {/* Leads */}
                  <td
                    className=''
                    style={{ width: '100px', minWidth: '100px' }}
                  >
                    <div className='flex items-center justify-center'>
                      <span className='inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 border border-gray-300'>
                        {job.total_leads || 0}
                      </span>
                    </div>
                  </td>

                  {/* Posted */}
                  <td
                    className=''
                    style={{ width: '120px', minWidth: '120px' }}
                  >
                    <span className='text-sm text-gray-500'>
                      {job.posted_date
                        ? new Date(job.posted_date).toLocaleDateString()
                        : '-'}
                    </span>
                  </td>

                  {/* Expires */}
                  <td
                    className=''
                    style={{ width: '120px', minWidth: '120px' }}
                  >
                    <span className='text-sm text-gray-500'>
                      {job.valid_through
                        ? new Date(job.valid_through).toLocaleDateString()
                        : '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between mt-4 flex-shrink-0'>
          <div className='flex items-center gap-4'>
            <div className='text-sm text-gray-500'>
              Showing {startIndex + 1} to{' '}
              {Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length}{' '}
              results
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500'>Rows per page:</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing page size
                }}
                className='px-2 py-1 text-sm border border-gray-300 rounded hover:border-gray-400'
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className='px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronLeft className='h-4 w-4' />
            </button>
            <span className='px-3 py-1 text-sm'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className='px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
        </div>

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          placeholder='Search jobs...'
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={value => {
            setSearchTerm(value);
            setIsSearchModalOpen(false);
          }}
        />
      </div>
    </Page>
  );
};

export default Jobs;
