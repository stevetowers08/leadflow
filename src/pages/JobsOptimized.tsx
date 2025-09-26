import React, { useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { getPriorityColor } from "@/utils/statusUtils";
import { usePopup } from "@/contexts/PopupContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Plus, RefreshCw, Briefcase } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getCompanyLogoUrlSync } from "@/utils/logoService";
import { getLabel } from '@/utils/labels';
import { useJobs, usePrefetchData, useCacheInvalidation } from "@/hooks/useSupabaseData";
import { useDebouncedFetch } from "@/hooks/useDebouncedFetch";
import { useRequestDeduplication } from "@/hooks/useDebouncedFetch";
import { formatDateForSydney } from "@/utils/timezoneUtils";

interface Job {
  id: string;
  title: string;
  company_id: string;
  location?: string;
  priority?: string;
  lead_score_job?: number;
  posted_date?: string;
  salary?: string;
  employment_type?: string;
  automation_active?: boolean;
  created_at: string;
  companies: {
    id: string;
    name: string;
    website?: string;
    industry?: string;
  };
  company_name?: string;
  company_industry?: string;
  company_logo_url?: string;
}

const JobsOptimized = React.memo(() => {
  // State for pagination, sorting, and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { openJobPopup } = usePopup();
  const { toast } = useToast();
  const { deduplicate } = useRequestDeduplication();
  const { prefetchJob } = usePrefetchData();
  const { invalidateJobs } = useCacheInvalidation();

  // Set page meta tags
  usePageMeta({
    title: 'Jobs - Empowr CRM',
    description: 'Browse and manage job opportunities. Track job postings, priorities, and automation status.',
    keywords: 'jobs, opportunities, postings, recruitment, hiring, automation',
    ogTitle: 'Jobs - Empowr CRM',
    ogDescription: 'Browse and manage job opportunities.',
    twitterTitle: 'Jobs - Empowr CRM',
    twitterDescription: 'Browse and manage job opportunities.'
  });

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useDebouncedFetch(
    useCallback(() => Promise.resolve(searchTerm), [searchTerm]),
    { delay: 500 }
  );

  // Use optimized data fetching hook
  const {
    data: jobsData,
    isLoading,
    error,
    refetch
  } = useJobs(
    { page: currentPage, pageSize },
    { column: sortBy, ascending: sortOrder === "asc" },
    { 
      search: debouncedSearch.data || searchTerm,
      priority: priorityFilter 
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  // Memoized jobs with company information
  const jobs = useMemo(() => {
    if (!jobsData?.data) return [];
    
    return jobsData.data.map((job: Job) => ({
      ...job,
      company_name: job.companies?.name || null,
      company_industry: job.companies?.industry || null,
      company_logo_url: getCompanyLogoUrlSync(
        job.companies?.name || '', 
        job.companies?.website
      )
    }));
  }, [jobsData?.data]);

  // Sort options
  const sortOptions = [
    { label: "Posted Date", value: "posted_date" },
    { label: "Created Date", value: "created_at" },
    { label: "Title", value: "title" },
    { label: "Location", value: "location" },
    { label: "Priority", value: "priority" },
    { label: getLabel('sort', 'ai_score'), value: "lead_score_job" },
    { label: "Company", value: "companies.name" },
  ];

  // Priority filter options
  const priorityOptions = [
    { label: "All Priorities", value: "all" },
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  // Handle refresh with deduplication
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await deduplicate('refresh-jobs', async () => {
        await refetch();
        invalidateJobs();
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh jobs",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, invalidateJobs, deduplicate, toast]);

  // Handle row click with prefetching
  const handleRowClick = useCallback((job: Job) => {
    prefetchJob(job.id);
    openJobPopup(job.id);
  }, [openJobPopup, prefetchJob]);

  // Handle search with debouncing
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  }, []);

  // Handle sort order toggle
  const handleSortOrderToggle = useCallback(() => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  }, []);

  // Handle priority filter change
  const handlePriorityFilterChange = useCallback((value: string) => {
    setPriorityFilter(value);
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  // Table columns
  const columns = useMemo(() => [
    {
      key: "title",
      label: "Job Title",
      width: "250px",
      render: (job: Job) => (
        <div className="min-w-0 max-w-80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium break-words leading-tight">
              {job.title || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "companies.name",
      label: "Company",
      width: "150px",
      render: (job: Job) => (
        <div className="min-w-0 max-w-48">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-muted flex items-center justify-center flex-shrink-0">
              {(() => {
                const logoUrl = job.company_logo_url;
                return logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={job.companies?.name}
                    className="w-6 h-6 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null;
              })()}
              <div 
                className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold"
                style={{ display: job.company_logo_url ? 'none' : 'flex' }}
              >
                {job.companies?.name ? job.companies.name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
            <div className="text-sm text-muted-foreground break-words leading-tight">
              {job.companies?.name || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      width: "120px",
      render: (job: Job) => (
        <div className="min-w-0 max-w-32">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {job.location || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      width: "100px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <StatusBadge 
          status={job.priority || "Medium"} 
          size="sm" 
          className={getPriorityColor(job.priority || "Medium")}
        />
      ),
    },
    {
      key: "lead_score_job",
      label: getLabel('table', 'ai_score'),
      width: "80px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {job.lead_score_job || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "employment_type",
      label: "Type",
      width: "100px",
      render: (job: Job) => (
        <div className="text-sm text-muted-foreground">
          {job.employment_type || "-"}
        </div>
      ),
    },
    {
      key: "salary",
      label: "Salary",
      width: "120px",
      render: (job: Job) => (
        <div className="text-sm text-muted-foreground">
          {job.salary || "-"}
        </div>
      ),
    },
    {
      key: "posted_date",
      label: "Posted",
      width: "100px",
      render: (job: Job) => (
        <div className="text-sm text-muted-foreground">
          {job.posted_date ? formatDateForSydney(job.posted_date, 'date') : "-"}
        </div>
      ),
    },
    {
      key: "automation_active",
      label: "Auto",
      width: "60px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <div className="flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full ${job.automation_active ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      ),
    },
  ], []);

  // Error handling
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">Error loading jobs</div>
          <div className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Jobs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse and manage job opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
        </div>
      </div>

      {/* Search, Filter and Sort Controls */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-9 text-sm w-64 bg-white"
            />
          </div>
          
          {/* Priority Filter */}
          <DropdownSelect
            options={priorityOptions}
            value={priorityFilter}
            onValueChange={handlePriorityFilterChange}
            placeholder="All Priorities"
            className="min-w-32 bg-white"
          />
        </div>
        
        {/* Sort Controls - Far Right */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Sort:</span>
          <DropdownSelect
            options={sortOptions}
            value={sortBy}
            onValueChange={handleSortChange}
            placeholder="Select sort"
            className="min-w-32 bg-white"
          />
          <button
            onClick={handleSortOrderToggle}
            className="px-2 py-1 text-sm border rounded hover:bg-muted transition-colors"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={jobs}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        pagination={{
          enabled: true,
          pageSize: pageSize,
          pageSizeOptions: [10, 20, 50, 100],
          showPageSizeSelector: true,
          showItemCount: true,
          currentPage: currentPage,
          totalPages: jobsData ? Math.ceil(jobsData.totalCount / pageSize) : 0,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
        enableExport={true}
        exportFilename="jobs.csv"
      />
    </div>
  );
});

JobsOptimized.displayName = 'JobsOptimized';

export default JobsOptimized;
