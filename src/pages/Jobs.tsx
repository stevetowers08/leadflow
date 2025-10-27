import { JobQualificationTableDropdown } from '@/components/jobs/JobQualificationTableDropdown';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { SearchModal } from '@/components/ui/search-modal';
import { TabNavigation } from '@/components/ui/tab-navigation';
import { ColumnConfig, UnifiedTable } from '@/components/ui/unified-table';
import { useAuth } from '@/contexts/AuthContext';
import { FilterControls, Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { useClientId } from '@/hooks/useClientId';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { getClearbitLogo } from '@/services/logoService';
import { Job } from '@/types/database';
import { convertNumericScoreToStatus } from '@/utils/colorScheme';
import { useNavigate } from 'react-router-dom';
// Removed deprecated jobStatus import - using statusUtils instead
import { JobDetailsSlideOut } from '@/components/slide-out/JobDetailsSlideOut';
import { formatLocation } from '@/utils/locationDisplay';
import { format } from 'date-fns';
import { Building2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Job filtering function (comprehensive version)
function applyJobFilters(
  job: Record<string, unknown>,
  config: Record<string, unknown>
): boolean {
  // Location filtering
  if (
    config.primary_location &&
    !checkLocationMatch(
      job.location,
      config.primary_location,
      config.search_radius || 25
    )
  ) {
    return false;
  }

  // Job title filtering (included)
  if (config.target_job_titles && config.target_job_titles.length > 0) {
    const titleMatch = config.target_job_titles.some((title: string) =>
      job.title.toLowerCase().includes(title.toLowerCase())
    );
    if (!titleMatch) return false;
  }

  // Job title filtering (excluded)
  if (config.excluded_job_titles && config.excluded_job_titles.length > 0) {
    const excludedMatch = config.excluded_job_titles.some((title: string) =>
      job.title.toLowerCase().includes(title.toLowerCase())
    );
    if (excludedMatch) return false;
  }

  // Seniority level filtering (supports both seniority_levels and experience_levels)
  if (
    (config.seniority_levels && config.seniority_levels.length > 0) ||
    (config.experience_levels && config.experience_levels.length > 0)
  ) {
    const levels = config.seniority_levels || config.experience_levels;
    if (!job.seniority_level || !levels.includes(job.seniority_level)) {
      return false;
    }
  }

  // Work arrangement filtering
  if (config.work_arrangements && config.work_arrangements.length > 0) {
    if (
      !job.employment_type ||
      !config.work_arrangements.includes(job.employment_type)
    ) {
      return false;
    }
  }

  // Job function filtering
  if (config.job_functions && config.job_functions.length > 0) {
    if (!job.function || !config.job_functions.includes(job.function)) {
      return false;
    }
  }

  // Company size filtering (use normalized_company_size)
  if (
    config.company_size_preferences &&
    config.company_size_preferences.length > 0
  ) {
    // Check normalized_company_size first, fall back to company_size if not available
    const companySize =
      job.companies?.normalized_company_size || job.companies?.company_size;
    if (
      !companySize ||
      !config.company_size_preferences.includes(companySize)
    ) {
      return false;
    }
  }

  // Industry filtering (included)
  if (config.included_industries && config.included_industries.length > 0) {
    if (
      !job.companies?.industry ||
      !config.included_industries.includes(job.companies.industry)
    ) {
      return false;
    }
  }

  // Industry filtering (excluded)
  if (config.excluded_industries && config.excluded_industries.length > 0) {
    if (
      job.companies?.industry &&
      config.excluded_industries.includes(job.companies.industry)
    ) {
      return false;
    }
  }

  // Company filtering (included)
  if (config.included_companies && config.included_companies.length > 0) {
    if (
      !job.companies?.name ||
      !config.included_companies.includes(job.companies.name)
    ) {
      return false;
    }
  }

  // Company filtering (excluded)
  if (config.excluded_companies && config.excluded_companies.length > 0) {
    if (
      job.companies?.name &&
      config.excluded_companies.includes(job.companies.name)
    ) {
      return false;
    }
  }

  // Keyword filtering (required)
  if (config.required_keywords && config.required_keywords.length > 0) {
    const keywordMatch = config.required_keywords.every((keyword: string) =>
      job.description?.toLowerCase().includes(keyword.toLowerCase())
    );
    if (!keywordMatch) return false;
  }

  // Keyword filtering (excluded)
  if (config.excluded_keywords && config.excluded_keywords.length > 0) {
    const excludedKeywordMatch = config.excluded_keywords.some(
      (keyword: string) =>
        job.description?.toLowerCase().includes(keyword.toLowerCase())
    );
    if (excludedKeywordMatch) return false;
  }

  // Time filtering (max days old)
  if (config.max_days_old) {
    const jobDate = new Date(job.created_at);
    const cutoffDate = new Date(
      Date.now() - config.max_days_old * 24 * 60 * 60 * 1000
    );
    if (jobDate < cutoffDate) return false;
  }

  return true;
}

function checkLocationMatch(
  jobLocation: string | null,
  targetLocation: string,
  radius: number
): boolean {
  if (!jobLocation) return false;

  const jobCity = jobLocation.toLowerCase().split(',')[0].trim();
  const targetCity = targetLocation.toLowerCase().split(',')[0].trim();

  return jobCity.includes(targetCity) || targetCity.includes(jobCity);
}

const Jobs: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: clientId, isLoading: clientIdLoading } = useClientId();

  // State management
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and search state
  const [activeTab, setActiveTab] = useState<string>('new'); // Default to 'new' jobs
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Slide-out state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Debounced search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Tab options - focused on qualification status
  const tabOptions = useMemo(
    () => [
      { id: 'new', label: 'New', count: 0, icon: null },
      { id: 'qualify', label: 'Qualified', count: 0, icon: null },
      { id: 'skip', label: 'Skip', count: 0, icon: null },
      { id: 'all', label: 'All', count: 0, icon: null },
    ],
    []
  );

  // Filter options - memoized to prevent re-renders
  const statusOptions = useMemo(
    () => [
      { label: 'All Statuses', value: 'all' },
      { label: 'New', value: 'new' },
      { label: 'Qualified', value: 'qualify' },
      { label: 'Skip', value: 'skip' },
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
      // Don't fetch if client ID is still loading
      if (clientIdLoading) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get ALL jobs (with or without client ID) - use limit for initial load
        const [jobsResult, filterConfigResult] = await Promise.all([
          supabase
            .from('jobs')
            .select(
              `
              *,
              companies!jobs_company_id_fkey (
                id,
                name,
                website,
                industry,
                lead_score,
                pipeline_stage,
                normalized_company_size,
                source
              ),
              client_jobs!left (
                status,
                priority_level,
                qualified_at,
                qualified_by,
                client_id
              )
            `
            )
            .order('created_at', { ascending: false })
            .limit(500),
          clientId
            ? supabase
                .schema('public')
                .from('job_filter_configs')
                .select('*')
                .eq('client_id', clientId)
                .eq('is_active', true)
                .maybeSingle()
            : Promise.resolve({ data: null, error: null }),
        ]);

        if (jobsResult.error) throw jobsResult.error;

        let allJobs: Job[] = (jobsResult.data as unknown as Job[]) || [];

        // Filter client_jobs to only show entries for the current client
        if (clientId) {
          allJobs = allJobs.map(job => ({
            ...job,
            client_jobs: Array.isArray(job.client_jobs)
              ? job.client_jobs.filter(cj => cj.client_id === clientId)
              : [],
          }));
        }

        // Apply client's job filter config if available
        if (filterConfigResult.data && !filterConfigResult.error) {
          const filterConfig = filterConfigResult.data;
          allJobs = allJobs.filter(job => applyJobFilters(job, filterConfig));
        }

        // Extract unique sources from jobs
        const uniqueSources = Array.from(
          new Set(
            allJobs
              .map(job => job.companies?.source)
              .filter((source): source is string => !!source)
          )
        ).sort();

        setJobs(allJobs);
        setSources(uniqueSources);
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
  }, [toast, refreshTrigger, clientId, clientIdLoading]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Qualification status filter (from tabs) - Use client-specific status
    if (activeTab !== 'all') {
      filtered = filtered.filter(job => {
        const qualStatus = job.client_jobs?.[0]?.status || 'new';
        return qualStatus === activeTab;
      });
    }

    // Status filter - Use client-specific status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => {
        const qualStatus = job.client_jobs?.[0]?.status || 'new';
        return qualStatus === statusFilter;
      });
    }

    // Source filter
    if (selectedSource !== 'all') {
      filtered = filtered.filter(
        job => job.companies?.source === selectedSource
      );
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
    activeTab,
    statusFilter,
    selectedSource,
    showFavoritesOnly,
    debouncedSearchTerm,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Update tab counts - memoized to prevent re-renders (use client-specific status)
  const tabCounts = useMemo(() => {
    const counts = {
      all: jobs.length,
      new: jobs.filter(
        job =>
          !job.client_jobs?.[0]?.status || job.client_jobs[0].status === 'new'
      ).length,
      qualify: jobs.filter(job => job.client_jobs?.[0]?.status === 'qualify')
        .length,
      skip: jobs.filter(job => job.client_jobs?.[0]?.status === 'skip').length,
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
      label: 'STATUS',
      width: '120px',
      minWidth: '120px',
      cellType: 'status',
      align: 'center',
      getStatusValue: job => job.client_jobs?.[0]?.status || 'new',
      render: (_, job) => {
        return (
          <JobQualificationTableDropdown
            job={job}
            onStatusChange={() => {
              // Use optimized single job refresh
              handleJobStatusUpdate(job.id);
            }}
          />
        );
      },
    },
    {
      key: 'company',
      label: 'Company',
      width: '300px',
      cellType: 'regular',
      render: (_, job) => (
        <div className='min-w-0 cursor-pointer hover:bg-muted rounded-md p-1 -m-1 transition-colors duration-150'>
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0'>
              {job.companies?.website ? (
                <img
                  src={getClearbitLogo(
                    job.companies.name || '',
                    job.companies.website
                  )}
                  alt={job.companies.name}
                  className='w-7 h-7 rounded-lg object-cover'
                  onError={e => {
                    // Silently handle logo loading errors
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <Building2 className='h-3 w-3 text-muted-foreground' />
            </div>
            <div className='text-sm font-medium text-foreground'>
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
      render: (_, job) => (
        <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
          {job.title || '-'}
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
      render: (_, job) => {
        const location = formatLocation({
          country: job.country,
          city: job.city,
          region: job.region,
          location: job.location,
        });
        return (
          <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
            {location}
          </div>
        );
      },
    },
    {
      key: 'function',
      label: 'Function',
      width: '180px',
      cellType: 'regular',
      render: (_, job) => (
        <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
          {job.function || '-'}
        </div>
      ),
    },
    {
      key: 'ai_score',
      label: 'AI Score',
      width: '100px',
      cellType: 'ai-score',
      align: 'center',
      getStatusValue: job => {
        const score = job.companies?.lead_score;
        return convertNumericScoreToStatus(score);
      },
      render: (_, job) => {
        const score = job.companies?.lead_score;
        return <span>{score ?? '-'}</span>;
      },
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

  // Handle row click - open slide-out panel
  const handleRowClick = useCallback((job: Job) => {
    setSelectedJobId(job.id);
    setIsSlideOutOpen(true);
  }, []);

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

  // Handle search toggle - memoized for performance
  const handleSearchToggle = useCallback(() => {
    setIsSearchActive(prev => !prev);
  }, []);

  // Handle search change - memoized for performance
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle search modal toggle - memoized for performance
  const handleSearchModalToggle = useCallback(() => {
    setIsSearchModalOpen(prev => !prev);
  }, []);

  // Handle qualification completion
  const handleQualificationComplete = useCallback(() => {
    // Trigger refresh by incrementing refreshTrigger
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Optimized refresh for single job update
  const handleJobStatusUpdate = useCallback(
    async (jobId: string) => {
      try {
        // Get the client ID first
        if (!clientId) {
          setRefreshTrigger(prev => prev + 1);
          return;
        }

        const { data, error } = await supabase
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
            pipeline_stage,
            normalized_company_size,
            source
          ),
          client_jobs!left (
            status,
            priority_level,
            qualified_at,
            qualified_by,
            client_id
          )
        `
          )
          .eq('id', jobId)
          .single();

        if (error) throw error;

        // Filter client_jobs to only show current client's data
        const updatedJob = data as unknown as Job;
        if (Array.isArray(updatedJob.client_jobs)) {
          updatedJob.client_jobs = updatedJob.client_jobs.filter(
            cj => cj.client_id === clientId
          );
        }

        // Update only the specific job in the state
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId
              ? { ...job, ...updatedJob, client_jobs: updatedJob.client_jobs }
              : job
          )
        );
      } catch (err) {
        console.error('Error refreshing single job:', err);
        // Fallback to full refresh if single job update fails
        setRefreshTrigger(prev => prev + 1);
      }
    },
    [clientId]
  );

  // Error state - show page with error message
  const showLoadingState = loading || clientIdLoading;

  if (error) {
    return (
      <Page title='Job Intelligence' hideHeader>
        <div className='flex items-center justify-center h-32 text-destructive'>
          Error: {error}
        </div>
      </Page>
    );
  }

  return (
    <Page title='Job Intelligence' hideHeader>
      <div className='flex-1 flex flex-col min-h-0 space-y-3'>
        {/* Page Header */}
        <div className='mb-2'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Job Intelligence
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Qualify jobs to get more company info and decision makers using AI
          </p>
        </div>

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
            { label: 'All Sources', value: 'all' },
            ...sources.map(source => ({
              label: source.charAt(0).toUpperCase() + source.slice(1),
              value: source,
            })),
          ]}
          sortOptions={sortOptions}
          statusFilter={statusFilter}
          selectedUser={selectedSource}
          sortBy={sortBy}
          showFavoritesOnly={showFavoritesOnly}
          searchTerm={searchTerm}
          isSearchActive={isSearchActive}
          onStatusChange={setStatusFilter}
          onUserChange={setSelectedSource}
          onSortChange={setSortBy}
          onFavoritesToggle={handleFavoritesToggle}
          onSearchChange={handleSearchChange}
          onSearchToggle={handleSearchToggle}
        />

        {/* Unified Table - Scrollable area */}
        <div className='flex-1 min-h-0'>
          <UnifiedTable
            data={paginatedJobs}
            columns={columns}
            pagination={false} // We handle pagination externally
            stickyHeaders={true}
            scrollable={true}
            onRowClick={handleRowClick}
            loading={showLoadingState}
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

        {/* Job Details Slide-Out */}
        <JobDetailsSlideOut
          jobId={selectedJobId}
          isOpen={isSlideOutOpen}
          onClose={() => {
            setIsSlideOutOpen(false);
            setSelectedJobId(null);
          }}
          onUpdate={handleQualificationComplete}
        />
      </div>
    </Page>
  );
};

export default Jobs;
