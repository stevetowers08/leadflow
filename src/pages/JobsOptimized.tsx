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
import { getClearbitLogo } from "@/utils/logoService";
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
      company_logo_url: job.companies?.website ? getClearbitLogo(job.companies.name, job.companies.website) : null
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
      key: "status",
      label: "Status",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "120px",
      render: (job: Job) => {
        if (job.automation_started_leads && job.automation_started_leads > 0) {
          return (
            <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200 w-32 flex justify-center">
              AUTOMATED ({job.automation_started_leads})
            </div>
          );
        } else if (job.new_leads && job.new_leads > 0) {
          return (
            <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 w-32 flex justify-center">
              NEW JOB
            </div>
          );
        } else {
          return (
            <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200 w-32 flex justify-center">
              -
            </div>
          );
        }
      },
    },
    {
      key: "title",
      label: "Job Title",
      render: (job: Job) => (
        <div className="min-w-0 w-80">
          <div className="text-sm font-medium break-words leading-tight">{job.title || "-"}</div>
        </div>
      ),
    },
    {
      key: "companies.name",
      label: "Company",
      render: (job: Job) => (
        <div className="min-w-0 w-64">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              {job.company_logo_url ? (
                <img 
                  src={job.company_logo_url} 
                  alt={job.companies?.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    console.log(`Failed to load company logo for ${job.companies?.name}: ${job.company_logo_url}`);
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded company logo for ${job.companies?.name}: ${job.company_logo_url}`);
                  }}
                />
              ) : null}
              <div 
                className={`w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold ${job.company_logo_url ? 'hidden' : 'flex'}`}
              >
                {job.companies?.name ? job.companies.name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
            <div className="text-sm font-medium break-words leading-tight">{job.companies?.name || "-"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "company_industry",
      label: "Industry",
      render: (job: Job) => (
        <div className="min-w-0 w-80">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {job.company_industry || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (job: Job) => (
        <div className="min-w-0 w-56">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {job.location || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "function",
      label: "Function",
      render: (job: Job) => (
        <div className="min-w-0 w-64">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {job.function || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => {
        const priority = job.priority?.toLowerCase() || "medium";
        const uppercasePriority = priority.toUpperCase();
        return (
          <div className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full border border-orange-200 w-24 flex justify-center">
            {uppercasePriority}
          </div>
        );
      },
    },
    {
      key: "lead_score_job",
      label: "AI Score",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
            {job.lead_score_job || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "total_leads",
      label: "Leads",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
            {job.total_leads || 0}
          </span>
        </div>
      ),
    },
    {
      key: "posted_date",
      label: "Posted",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => {
        if (!job.posted_date) return <span className="text-sm">-</span>;
        
        try {
          const date = new Date(job.posted_date);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                {diffDays === 0 ? 'Today' : 
                 diffDays === 1 ? '1 day ago' : 
                 `${diffDays} days ago`}
              </div>
            </div>
          );
        } catch {
          return <span className="text-sm">-</span>;
        }
      },
    },
    {
      key: "valid_through",
      label: "Expires",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => {
        if (!job.valid_through) return <span className="text-sm">-</span>;
        
        try {
          const expiryDate = new Date(job.valid_through);
          const now = new Date();
          const diffTime = expiryDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let className = "text-sm";
          if (diffDays < 0) {
            className += " text-red-600 font-medium";
          } else if (diffDays <= 7) {
            className += " text-yellow-600 font-medium";
          } else {
            className += " text-muted-foreground";
          }
          
          return (
            <div className="text-center">
              <div className={className}>
                {diffDays < 0 ? 'Expired' :
                 diffDays === 0 ? 'Today' :
                 diffDays === 1 ? 'Tomorrow' :
                 `${diffDays} days`}
              </div>
            </div>
          );
        } catch {
          return <span className="text-sm">-</span>;
        }
      },
    },
    {
      key: "actions",
      label: "Actions",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (job: Job) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteJob(job.id, job.title);
          }}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
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
