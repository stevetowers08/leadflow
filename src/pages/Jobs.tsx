'use client';

import { ClearbitLogoSync } from '@/components/ClearbitLogo';
import { JobQualificationTableDropdown } from '@/components/jobs/JobQualificationTableDropdown';
import { IndustryBadges } from '@/components/shared/IndustryBadge';
import { ScoreBadge } from '@/components/shared/ScoreBadge';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { SearchModal } from '@/components/ui/search-modal';
import { TabNavigation } from '@/components/ui/tab-navigation';
import { ColumnConfig, UnifiedTable } from '@/components/ui/unified-table';
import { useAuth } from '@/contexts/AuthContext';
import { shouldBypassAuth } from '@/config/auth';
import { Page } from '@/design-system/components';
import { CollapsibleFilterControls } from '@/components/shared/CollapsibleFilterControls';
import { useToast } from '@/hooks/use-toast';
import { useClientId } from '@/hooks/useClientId';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/database';
import { useRouter } from 'next/navigation';
// Removed deprecated jobStatus import - using statusUtils instead
import { JobDetailsSlideOut } from '@/components/slide-out/JobDetailsSlideOut';
// Temporarily avoid Tooltip to resolve Vite optimize dep error
import { serverAIService } from '@/services/serverAIService';
import { formatLocation } from '@/utils/locationDisplay';
import { format } from 'date-fns';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/utils/productionLogger';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

  const normalize = (loc: string) =>
    loc.toLowerCase().replace(/\s+/g, ' ').trim();

  const jobLoc = normalize(jobLocation);
  const targetLoc = normalize(targetLocation);

  if (jobLoc === targetLoc) return true;

  const jobCity = jobLoc.split(',')[0].trim();
  const targetCity = targetLoc.split(',')[0].trim();

  if (jobCity === targetCity) return true;

  if (radius > 0) {
    return jobCity.includes(targetCity) || targetCity.includes(jobCity);
  }

  return false;
}

// Client-side mount guard wrapper
const Jobs: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return <JobsContent />;
};

const JobsContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { data: clientId, isLoading: clientIdLoading } = useClientId();
  const queryClient = useQueryClient();

  // State management
  const [sources, setSources] = useState<string[]>([]);

  // Filter and search state
  const [activeTab, setActiveTab] = useState<string>('new'); // Default to 'new' jobs
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Filter persistence
  const FILTER_STORAGE_KEY = 'jobs-filters';

  // Slide-out state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Debounced search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load saved filters on mount
  useEffect(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (saved) {
      try {
        const filters = JSON.parse(saved);
        if (filters.activeTab) setActiveTab(filters.activeTab);
        if (filters.statusFilter) setStatusFilter(filters.statusFilter);
        if (filters.selectedSource) setSelectedSource(filters.selectedSource);
        if (filters.searchTerm) setSearchTerm(filters.searchTerm);
        if (filters.sortBy) setSortBy(filters.sortBy);
        if (filters.pageSize) setPageSize(filters.pageSize);
      } catch (e) {
        console.warn('Failed to load saved filters:', e);
      }
    }
  }, []);

  // Save filters on change
  useEffect(() => {
    const filters = {
      activeTab,
      statusFilter,
      selectedSource,
      searchTerm,
      sortBy,
      pageSize,
    };
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [activeTab, statusFilter, selectedSource, searchTerm, sortBy, pageSize]);

  // AI summary generation state per job
  const [generatingSummaryById, setGeneratingSummaryById] = useState<
    Record<string, boolean>
  >({});
  const [failedSummaryById, setFailedSummaryById] = useState<
    Record<string, boolean>
  >({});
  const processedSummaryIdsRef = useRef<Set<string>>(new Set());

  const triggerGenerateSummary = useCallback(
    async (job: Job) => {
      if (!job.id) return;

      // Use functional updates to avoid dependency on generatingSummaryById
      setGeneratingSummaryById(prev => {
        if (prev[job.id]) return prev;
        return { ...prev, [job.id]: true };
      });

      if (!job.description || job.summary) {
        setGeneratingSummaryById(prev => ({ ...prev, [job.id]: false }));
        return;
      }

      if (processedSummaryIdsRef.current.has(job.id)) {
        setGeneratingSummaryById(prev => ({ ...prev, [job.id]: false }));
        return;
      }

      try {
        const response = await serverAIService.generateJobSummary({
          id: job.id,
          title: job.title || '',
          company: job.companies?.name || 'Unknown Company',
          description: job.description || '',
          location: job.location || undefined,
          salary: job.salary || undefined,
          employment_type: job.employment_type || undefined,
          seniority_level: job.seniority_level || undefined,
        });

        if (response.success && response.data?.summary) {
          // Persist to Supabase
          await supabase
            .from('jobs')
            .update({
              summary: response.data.summary,
              updated_at: new Date().toISOString(),
            })
            .eq('id', job.id);

          // Update React Query cache
          queryClient.setQueryData<{ jobs: Job[]; sources: string[] }>(
            ['jobs-page', clientId, refreshTrigger],
            oldData => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                jobs: oldData.jobs.map(j =>
                  j.id === job.id
                    ? { ...j, summary: response.data!.summary }
                    : j
                ),
              };
            }
          );
          processedSummaryIdsRef.current.add(job.id);
          setFailedSummaryById(prev => ({ ...prev, [job.id]: false }));
        } else {
          setFailedSummaryById(prev => ({ ...prev, [job.id]: true }));
        }
      } catch (e) {
        setFailedSummaryById(prev => ({ ...prev, [job.id]: true }));
      } finally {
        setGeneratingSummaryById(prev => ({ ...prev, [job.id]: false }));
      }
    },
    [queryClient, clientId, refreshTrigger]
  );

  // (moved below after paginatedJobs definition)

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

  // Fetch data with React Query for caching and better loading states
  // Best practice: Only enable query when dependencies are ready
  const bypassAuth = shouldBypassAuth();
  // Query should be enabled when:
  // 1. Bypass auth is enabled, OR
  // 2. Auth has finished loading AND user exists
  // Note: We don't require clientId for jobs (jobs are shared across clients)
  const queryEnabled = bypassAuth || (!authLoading && !!user);
  const {
    data: jobsData,
    isLoading: jobsLoading,
    error: jobsError,
    refetch,
  } = useQuery({
    queryKey: ['jobs-page', clientId, refreshTrigger],
    queryFn: async () => {
      // Get ALL jobs (with or without client ID) - use limit for initial load
      const today = new Date().toISOString().split('T')[0];

      const [jobsResult, filterConfigResult] = await Promise.all([
        supabase
          .from('jobs')
          .select(
            `
              *,
              source,
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
          .or(`valid_through.is.null,valid_through.gte.${today}`)
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

      // Jobs query completed

      // Jobs are shared across all clients - filter client_jobs array for display only
      // but don't filter out jobs that don't have client_jobs entries
      if (clientId) {
        allJobs = allJobs.map(job => {
          const filteredClientJobs = Array.isArray(job.client_jobs)
            ? job.client_jobs.filter(cj => cj.client_id === clientId)
            : [];

          return {
            ...job,
            client_jobs: filteredClientJobs,
          };
        });
      }

      // Skip applying job filter configs for now (as per user request)
      // Job filter configs should be organization-wide but are disabled temporarily
      // if (filterConfigResult.data && !filterConfigResult.error) {
      //   const filterConfig = filterConfigResult.data;
      //   const jobsBeforeFilter = allJobs.length;
      //   allJobs = allJobs.filter(job => applyJobFilters(job, filterConfig));
      //   if (process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true') {
      //     console.log('Job filter applied:', {
      //       jobsBeforeFilter,
      //       jobsAfterFilter: allJobs.length,
      //       filterConfig: filterConfig,
      //     });
      //   }
      // }

      // Extract unique sources from jobs
      const uniqueSources = Array.from(
        new Set(
          allJobs
            .map(job => job.source)
            .filter((source): source is string => !!source)
        )
      ).sort();

      return { jobs: allJobs, sources: uniqueSources };
    },
    enabled: queryEnabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
  });

  // Extract jobs and sources from query result
  const jobs = jobsData?.jobs || [];
  const loading = jobsLoading;

  // Jobs data extracted
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Jobs data extraction:', {
      hasJobsData: !!jobsData,
      jobsLength: jobs.length,
      jobsDataType: Array.isArray(jobs) ? 'array' : typeof jobs,
      firstJobSample: jobs[0]
        ? {
            id: jobs[0].id,
            title: jobs[0].title,
            client_jobs: jobs[0].client_jobs,
            hasClientJobs: !!jobs[0].client_jobs?.length,
          }
        : null,
      jobsLoading,
      jobsError: jobsError?.message,
    });
  }
  const error = jobsError
    ? jobsError instanceof Error
      ? jobsError.message
      : 'Failed to fetch data'
    : null;

  // Update sources state when data changes
  useEffect(() => {
    if (jobsData?.sources) {
      setSources(jobsData.sources);
    }
  }, [jobsData?.sources]);

  // Show error toast if query fails
  useEffect(() => {
    if (jobsError) {
      toast({
        title: 'Error',
        description: 'Failed to load jobs data',
        variant: 'destructive',
      });
    }
  }, [jobsError, toast]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Qualification status filter (from tabs) - Use jobs.qualification_status directly
    // Jobs don't have client assignments, so use the job's qualification_status field
    // Note: Tab filter takes precedence over status filter to avoid conflicts
    if (activeTab !== 'all') {
      filtered = filtered.filter(job => {
        const qualStatus = job.qualification_status || 'new';
        return qualStatus === activeTab;
      });
    } else if (statusFilter !== 'all') {
      // Only apply status filter if tab is 'all'
      filtered = filtered.filter(job => {
        const qualStatus = job.qualification_status || 'new';
        return qualStatus === statusFilter;
      });
    }

    // Source filter
    if (selectedSource !== 'all') {
      filtered = filtered.filter(job => job.source === selectedSource);
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
    debouncedSearchTerm,
    sortBy,
  ]);

  // Update tab counts - memoized to prevent re-renders (optimized single pass)
  const tabCounts = useMemo(() => {
    // Single pass through jobs to count all statuses efficiently
    const counts = {
      all: jobs.length,
      new: 0,
      qualify: 0,
      skip: 0,
    };

    for (const job of jobs) {
      const status = job.qualification_status || 'new';
      if (status === 'new') counts.new++;
      else if (status === 'qualify') counts.qualify++;
      else if (status === 'skip') counts.skip++;
    }

    return tabOptions.map(tab => ({
      ...tab,
      count: counts[tab.id as keyof typeof counts] || 0,
    }));
  }, [jobs, tabOptions]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Pagination debug (development only)
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Pagination Debug:', {
      jobsLength: jobs.length,
      activeTab,
      filteredJobsLength: filteredJobs.length,
      paginatedJobsLength: paginatedJobs.length,
      currentPage,
      pageSize,
      startIndex,
      endIndex,
      firstPaginatedJob: paginatedJobs[0]
        ? {
            id: paginatedJobs[0].id,
            title: paginatedJobs[0].title,
            client_jobs_status: paginatedJobs[0].client_jobs?.[0]?.status,
          }
        : null,
    });
  }

  // Auto-generate AI summaries for visible jobs on load/page change
  useEffect(() => {
    paginatedJobs.forEach(job => {
      if (!job.summary && job.description) {
        void triggerGenerateSummary(job);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedJobs]);

  // Column configuration
  const columns: ColumnConfig<Job>[] = [
    {
      key: 'status',
      label: 'STATUS',
      width: '120px',
      minWidth: '120px',
      cellType: 'status',
      align: 'center',
      getStatusValue: job => {
        const s = job.client_jobs?.[0]?.status || 'new';
        return s ? `job-${s}` : 'job-new';
      },
      render: (_, job) => {
        return (
          <JobQualificationTableDropdown
            job={job}
            onStatusChange={() => {
              // No API call - just trigger re-filter if row status affects tab visibility
              setRefreshTrigger(prev => prev + 0.001);
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
        <div className='flex items-center gap-2 min-w-0'>
          <ClearbitLogoSync
            companyName={job.companies?.name || ''}
            website={job.companies?.website}
            size='sm'
          />
          <div className='font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis min-w-0'>
            {job.companies?.name || '-'}
          </div>
          <ChevronRight className='h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
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
      width: '280px',
      cellType: 'regular',
      render: (_, job) => (
        <IndustryBadges
          industries={job.companies?.industry}
          badgeVariant='compact'
          maxVisible={3}
          noWrap
          showOverflowIndicator={false}
        />
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
      label: (
        <span className='flex items-center gap-1'>
          <Sparkles className='h-3 w-3' /> Score
        </span>
      ),
      width: '100px',
      cellType: 'regular',
      align: 'center',
      render: (_, job) => (
        <ScoreBadge score={job.companies?.lead_score} variant='compact' />
      ),
    },
    {
      key: 'ai_summary',
      label: (
        <span className='flex items-center gap-1'>
          <Sparkles className='h-3 w-3' /> Job Summary
        </span>
      ),
      width: '520px',
      cellType: 'regular',
      render: (_, job) => {
        const isGenerating = generatingSummaryById[job.id || ''] || false;
        if (job.summary && !isGenerating) {
          return (
            <div
              className='text-sm text-foreground whitespace-nowrap overflow-hidden text-ellipsis'
              title={job.summary}
            >
              {job.summary}
            </div>
          );
        }
        if (isGenerating) {
          return (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Sparkles className='h-4 w-4 animate-pulse' />
              <span className='animate-pulse'>Generating your summary…</span>
            </div>
          );
        }
        // On error or no description, show simple dash per spec
        if (failedSummaryById[job.id || ''] || !job.description) {
          return <span className='text-sm text-muted-foreground'>-</span>;
        }
        // Default (no summary yet but has description): show dash until generator kicks in
        return <span className='text-sm text-muted-foreground'>-</span>;
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
        <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
          {job.valid_through
            ? format(new Date(job.valid_through), 'MMM d, yyyy')
            : '-'}
        </div>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      width: '120px',
      cellType: 'regular',
      render: (_, job) => (
        <div className='whitespace-nowrap overflow-hidden text-ellipsis'>
          {job.source || '-'}
        </div>
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

  // Error state - show page with error message
  const showLoadingState = loading || clientIdLoading;

  if (error) {
    return (
      <Page title='Jobs Feed' hideHeader>
        <div className='flex items-center justify-center h-32 text-destructive'>
          Error: {error}
        </div>
      </Page>
    );
  }

  return (
    <Page title='Jobs Feed' hideHeader>
      {/* Container for table layout - fills available height */}
      <div
        className='flex flex-col -mt-2'
        style={{ height: '100%', minHeight: 0 }}
      >
        {/* Filters - Fixed at top */}
        <div className='flex-shrink-0 pb-4 space-y-2'>
          {/* Tab Navigation */}
          <div className='flex-shrink-0 pb-2'>
            <TabNavigation
              tabs={tabCounts}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              className='border-b-0'
            />
          </div>
          {/* Search, Filter and Sort Controls */}
          <div className='flex items-center gap-2 flex-shrink-0'>
            <CollapsibleFilterControls
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
              searchTerm={searchTerm}
              isSearchActive={isSearchActive}
              onStatusChange={setStatusFilter}
              onUserChange={setSelectedSource}
              onSortChange={setSortBy}
              onSearchChange={handleSearchChange}
              onSearchToggle={handleSearchToggle}
            />
          </div>
        </div>

        {/* Table - Scrollable middle */}
        <div className='flex-1 min-h-0 flex flex-col overflow-hidden'>
          <UnifiedTable
            data={paginatedJobs}
            columns={columns}
            tableId='jobs'
            pagination={false} // We handle pagination externally
            stickyHeaders={true}
            scrollable={true}
            onRowClick={handleRowClick}
            loading={showLoadingState}
            emptyMessage='No jobs found'
          />
        </div>

        {/* Pagination - Fixed at bottom */}
        <div className='flex-shrink-0 pt-4'>
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
            className='mt-0'
          />
        </div>

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
