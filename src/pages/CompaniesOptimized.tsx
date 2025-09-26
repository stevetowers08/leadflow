import React, { useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { usePopup } from "@/contexts/PopupContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Plus, RefreshCw, Building2 } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getCompanyLogoUrlSync } from "@/utils/logoService";
import { getLabel } from '@/utils/labels';
import { useCompanies, usePrefetchData, useCacheInvalidation } from "@/hooks/useSupabaseData";
import { useDebouncedFetch } from "@/hooks/useDebouncedFetch";
import { useRequestDeduplication } from "@/hooks/useDebouncedFetch";

interface Company {
  id: string;
  name: string;
  website?: string;
  linkedin_url?: string;
  head_office?: string;
  industry?: string;
  company_size?: string;
  lead_score?: string;
  score_reason?: string;
  automation_active?: boolean;
  automation_started_at?: string;
  priority?: string;
  confidence_level?: string;
  is_favourite?: boolean;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  people_count?: number;
  jobs_count?: number;
}

const CompaniesOptimized = React.memo(() => {
  // State for pagination, sorting, and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { openCompanyPopup } = usePopup();
  const { toast } = useToast();
  const { deduplicate } = useRequestDeduplication();
  const { prefetchCompany } = usePrefetchData();
  const { invalidateCompanies } = useCacheInvalidation();

  // Set page meta tags
  usePageMeta({
    title: 'Companies - Empowr CRM',
    description: 'Manage company profiles and track business relationships. View company details, team size, and job opportunities.',
    keywords: 'companies, businesses, profiles, relationships, team size, opportunities',
    ogTitle: 'Companies - Empowr CRM',
    ogDescription: 'Manage company profiles and track business relationships.',
    twitterTitle: 'Companies - Empowr CRM',
    twitterDescription: 'Manage company profiles and track business relationships.'
  });

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useDebouncedFetch(
    useCallback(() => Promise.resolve(searchTerm), [searchTerm]),
    { delay: 500 }
  );

  // Use optimized data fetching hook
  const {
    data: companiesData,
    isLoading,
    error,
    refetch
  } = useCompanies(
    { page: currentPage, pageSize },
    { column: sortBy, ascending: sortOrder === "asc" },
    { 
      search: debouncedSearch.data || searchTerm,
      status: statusFilter 
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  );

  // Memoized companies with logo information
  const companies = useMemo(() => {
    if (!companiesData?.data) return [];
    
    return companiesData.data.map((company: Company) => ({
      ...company,
      logo_url: getCompanyLogoUrlSync(company.name, company.website)
    }));
  }, [companiesData?.data]);

  // Sort options
  const sortOptions = [
    { label: "Created Date", value: "created_at" },
    { label: "Name", value: "name" },
    { label: "Industry", value: "industry" },
    { label: "Location", value: "head_office" },
    { label: "Size", value: "company_size" },
    { label: getLabel('sort', 'ai_score'), value: "lead_score" },
    { label: "Priority", value: "priority" },
    { label: "People Count", value: "people_count" },
    { label: "Jobs Count", value: "jobs_count" },
  ];

  // Status filter options
  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "active" },
    { label: "Qualified", value: "qualified" },
    { label: "Prospect", value: "prospect" },
    { label: "New Lead", value: "new" },
  ];

  // Handle refresh with deduplication
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await deduplicate('refresh-companies', async () => {
        await refetch();
        invalidateCompanies();
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh companies",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, invalidateCompanies, deduplicate, toast]);

  // Handle row click with prefetching
  const handleRowClick = useCallback((company: Company) => {
    prefetchCompany(company.id);
    openCompanyPopup(company.id);
  }, [openCompanyPopup, prefetchCompany]);

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

  // Handle status filter change
  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
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

  // Get status badge for company
  const getCompanyStatus = useCallback((company: Company) => {
    if (company.automation_active) return "Active";
    if (company.confidence_level === 'high') return "Qualified";
    if (company.confidence_level === 'medium') return "Prospect";
    return "New Lead";
  }, []);

  // Table columns
  const columns = useMemo(() => [
    {
      key: "name",
      label: "Company",
      width: "200px",
      render: (company: Company) => (
        <div className="min-w-0 max-w-80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {(() => {
                const logoUrl = company.logo_url;
                return logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={company.name}
                    className="w-8 h-8 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null;
              })()}
              <div 
                className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold"
                style={{ display: company.logo_url ? 'none' : 'flex' }}
              >
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-sm font-medium break-words leading-tight">
              {company.name || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "industry",
      label: "Industry",
      width: "120px",
      render: (company: Company) => (
        <div className="min-w-0 max-w-32">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {company.industry || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "head_office",
      label: "Location",
      width: "120px",
      render: (company: Company) => (
        <div className="min-w-0 max-w-32">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {company.head_office || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "company_size",
      label: "Size",
      width: "100px",
      render: (company: Company) => (
        <div className="text-sm text-muted-foreground">
          {company.company_size || "-"}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "100px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <StatusBadge 
          status={getCompanyStatus(company)} 
          size="sm" 
        />
      ),
    },
    {
      key: "lead_score",
      label: getLabel('table', 'ai_score'),
      width: "80px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {company.lead_score || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "people_count",
      label: "People",
      width: "80px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <span className="text-sm text-muted-foreground">
            {company.people_count || 0}
          </span>
        </div>
      ),
    },
    {
      key: "jobs_count",
      label: "Jobs",
      width: "80px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <span className="text-sm text-muted-foreground">
            {company.jobs_count || 0}
          </span>
        </div>
      ),
    },
    {
      key: "automation_active",
      label: "Auto",
      width: "60px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full ${company.automation_active ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      width: "100px",
      render: (company: Company) => (
        <div className="text-sm text-muted-foreground">
          {new Date(company.created_at).toLocaleDateString()}
        </div>
      ),
    },
  ], [getCompanyStatus]);

  // Error handling
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">Error loading companies</div>
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Companies</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage company profiles and track business relationships
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
            Add Company
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
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-9 text-sm w-64 bg-white"
            />
          </div>
          
          {/* Status Filter */}
          <DropdownSelect
            options={statusOptions}
            value={statusFilter}
            onValueChange={handleStatusFilterChange}
            placeholder="All Status"
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
        data={companies}
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
          totalPages: companiesData ? Math.ceil(companiesData.totalCount / pageSize) : 0,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
        enableExport={true}
        exportFilename="companies.csv"
      />
    </div>
  );
});

CompaniesOptimized.displayName = 'CompaniesOptimized';

export default CompaniesOptimized;
