import { PaginationControls } from '@/components/ui/pagination-controls';
import { SearchModal } from '@/components/ui/search-modal';
import { TabNavigation } from '@/components/ui/tab-navigation';
import { ColumnConfig, UnifiedTable } from '@/components/ui/unified-table';
import { useAuth } from '@/contexts/AuthContext';
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
import { FilterControls, Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { getClearbitLogo } from '@/services/logoService';
import { Job, UserProfile } from '@/types/database';
import { getJobStatusFromPipeline } from '@/utils/jobStatus';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { format } from 'date-fns';
import { Building2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Jobs: React.FC = () => {
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();
  const { toast } = useToast();

  // State management
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and search state
  const [activeTab, setActiveTab] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Debounced search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Calculate job status based on company's pipeline stage - memoized
  const getJobStatusFromCompany = useCallback((job: Job): string => {
    return getJobStatusFromPipeline(job.companies?.pipeline_stage);
  }, []);

  // Tab options - memoized to prevent re-renders
  const tabOptions = useMemo(
    () => [
      { id: 'all', label: 'All Jobs', count: 0, icon: null },
      { id: 'active', label: 'Active', count: 0, icon: null },
      { id: 'pending', label: 'Pending', count: 0, icon: null },
      { id: 'expired', label: 'Expired', count: 0, icon: null },
    ],
    []
  );

  // Filter options - memoized to prevent re-renders
  const statusOptions = useMemo(
    () => [
    { label: 'All Statuses', value: 'all' },
    { label: 'Active', value: 'active' },
      { label: 'Pending', value: 'pending' },
    { label: 'Expired', value: 'expired' },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { label: 'Newest First', value: 'created_at' },
      { label: 'Oldest First', value: 'created_at_asc' },
      { label: 'Job Title A-Z', value: 'title' },
      { label: 'Job Title Z-A', value: 'title_desc' },
      { label: 'Company A-Z', value: 'company' },
      { label: 'Company Z-A', value: 'company_desc' },
    ],
    []
  );

  // Fetch data with parallel requests for better performance
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parallel data fetching for better performance
        const [jobsResult, usersResult] = await Promise.all([
          supabase
            .from('jobs')
            .select(
              `
              *,
              companies!left (
                id,
              name,
                website,
              industry,
              lead_score,
                pipeline_stage
              )
            `
            )
            .order('created_at', { ascending: false }),
          supabase
            .from('user_profiles')
            .select('id, full_name')
            .order('full_name'),
        ]);

        if (jobsResult.error) throw jobsResult.error;
        if (usersResult.error) throw usersResult.error;

        setJobs((jobsResult.data as Job[]) || []);
        setUsers((usersResult.data as unknown as UserProfile[]) || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        toast({
          title: 'Error',
          description: 'Failed to load jobs data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => {
        const status = getJobStatusFromCompany(job);
        return status === statusFilter;
      });
    }

    // User filter
    if (selectedUser !== 'all') {
      filtered = filtered.filter(job => job.assigned_to === selectedUser);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(job => job.is_favorite);
    }

    // Search filter using debounced term
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.title?.toLowerCase().includes(term) ||
          job.companies?.name?.toLowerCase().includes(term) ||
          job.location?.toLowerCase().includes(term) ||
          job.function?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_at':
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case 'created_at_asc':
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'title_desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'company':
          return (a.companies?.name || '').localeCompare(
            b.companies?.name || ''
          );
        case 'company_desc':
          return (b.companies?.name || '').localeCompare(
            a.companies?.name || ''
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    jobs,
    statusFilter,
    selectedUser,
    showFavoritesOnly,
    debouncedSearchTerm,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Update tab counts - memoized to prevent re-renders
  const tabCounts = useMemo(() => {
    const counts = {
      all: jobs.length,
      active: jobs.filter(job => getJobStatusFromCompany(job) === 'active')
        .length,
      pending: jobs.filter(job => getJobStatusFromCompany(job) === 'pending')
        .length,
      expired: jobs.filter(job => getJobStatusFromCompany(job) === 'expired')
        .length,
    };

    return tabOptions.map(tab => ({
      ...tab,
      count: counts[tab.id as keyof typeof counts] || 0,
    }));
  }, [jobs, tabOptions]);

  // Column configuration
  const columns: ColumnConfig<Job>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      cellType: 'status',
      align: 'center',
      getStatusValue: job => getJobStatusFromCompany(job),
      render: (_, job) => {
        const status = getJobStatusFromCompany(job);
        const displayText = getStatusDisplayText(status);
        return <span className='text-xs font-medium'>{displayText}</span>;
      },
    },
    {
      key: 'company',
      label: 'Company',
      width: '300px',
      cellType: 'regular',
      render: (_, job) => (
        <div className='min-w-0 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors duration-150'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'>
              {job.companies?.website ? (
                <img
                  src={getClearbitLogo(job.companies.name || '')}
                  alt={job.companies.name}
                  className='w-6 h-6 rounded-lg object-cover'
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove(
                      'hidden'
                    );
                  }}
                />
              ) : null}
              <Building2 className='h-3 w-3 text-gray-400' />
            </div>
            <div className='text-sm font-medium text-gray-900'>
              {job.companies?.name || '-'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Job Title',
      width: '450px',
      cellType: 'regular',
      render: value => (
        <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
          {(value as string) || '-'}
        </div>
      ),
    },
    {
      key: 'industry',
      label: 'Industry',
      width: '200px',
      cellType: 'regular',
      render: (_, job) => (
        <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
          {job.companies?.industry || '-'}
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      width: '150px',
      cellType: 'regular',
      render: value => (
        <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
          {(value as string) || '-'}
        </div>
      ),
    },
    {
      key: 'function',
      label: 'Function',
      width: '180px',
      cellType: 'regular',
      render: value => (
        <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
          {(value as string) || '-'}
        </div>
      ),
    },
    {
      key: 'ai_score',
      label: 'AI Score',
      width: '100px',
      cellType: 'ai-score',
      align: 'center',
      render: (_, job) => {
        const score = job.lead_score_job || job.companies?.lead_score;
        return <span>{score ?? '-'}</span>;
      },
    },
    {
      key: 'leads',
      label: 'Leads',
      width: '100px',
      cellType: 'lead-score',
      align: 'center',
      render: value => <span>{(value as number) || 0}</span>,
    },
    {
      key: 'posted',
      label: 'Posted',
      width: '120px',
      cellType: 'regular',
      render: (_, job) => (
        <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
          {job.created_at
            ? format(new Date(job.created_at), 'MMM d, yyyy')
            : '-'}
        </div>
      ),
    },
    {
      key: 'expires',
      label: 'Expires',
      width: '120px',
      cellType: 'regular',
      render: (_, job) => (
        <span>
          {job.valid_through
            ? format(new Date(job.valid_through), 'MMM d, yyyy')
            : '-'}
        </span>
      ),
    },
  ];

  // Handle row click - memoized for performance
  const handleRowClick = useCallback(
    (job: Job) => {
      openPopup('job', job.id, job.title);
    },
    [openPopup]
  );

  // Handle search - memoized for performance
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle tab change - memoized for performance
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setStatusFilter(tabId);
    setCurrentPage(1); // Reset to first page when changing tabs
  }, []);

  // Handle favorites toggle - memoized for performance
  const handleFavoritesToggle = useCallback(() => {
    setShowFavoritesOnly(prev => !prev);
  }, []);

  // Handle search modal toggle - memoized for performance
  const handleSearchModalToggle = useCallback(() => {
    setIsSearchModalOpen(prev => !prev);
  }, []);

  if (error) {
    return (
      <Page title='Jobs' hideHeader>
        <div className='flex items-center justify-center h-32 text-red-500'>
          Error: {error}
      </div>
      </Page>
    );
  }

  return (
    <Page title='Jobs' hideHeader>
      <div
        className='flex flex-col overflow-hidden'
        style={{ height: 'calc(100vh - 120px)' }}
      >
        {/* Modern Tab Navigation */}
        <TabNavigation
          tabs={tabCounts}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Search, Filter and Sort Controls */}
        <FilterControls
          statusOptions={statusOptions}
          userOptions={[
                { label: 'All Users', value: 'all' },
                ...users.map(userItem => ({
                  label:
                    userItem.id === user?.id
                      ? `${userItem.full_name} (me)`
                      : userItem.full_name,
                  value: userItem.id,
                })),
              ]}
          sortOptions={sortOptions}
          statusFilter={statusFilter}
          selectedUser={selectedUser}
          sortBy={sortBy}
          showFavoritesOnly={showFavoritesOnly}
          onStatusChange={setStatusFilter}
          onUserChange={setSelectedUser}
          onSortChange={setSortBy}
          onFavoritesToggle={handleFavoritesToggle}
          onSearchClick={handleSearchModalToggle}
        />

        {/* Unified Table */}
        <div className='flex-1 min-h-0'>
          <UnifiedTable
            data={paginatedJobs}
            columns={columns}
            pagination={false} // We handle pagination externally
            stickyHeaders={true}
            maxHeight='100%'
            onRowClick={handleRowClick}
            loading={loading}
            emptyMessage='No jobs found'
          />
        </div>

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredJobs.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={size => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={handleSearchModalToggle}
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
        />
      </div>
    </Page>
  );
};

export default Jobs;
