import React, { useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { getStatusDisplayText } from "@/utils/statusUtils";
import { usePopup } from "@/contexts/PopupContext";
import { PipelineStatsCards } from "@/components/StatsCards";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Plus, RefreshCw } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getClearbitLogo } from "@/utils/logoService";
import { getLabel } from '@/utils/labels';
import { useLeads, usePrefetchData, useCacheInvalidation } from "@/hooks/useSupabaseData";
import { useDebouncedFetch } from "@/hooks/useDebouncedFetch";
import { useRequestDeduplication } from "@/hooks/useDebouncedFetch";

interface Lead {
  id: string;
  name: string;
  company_id: string;
  email_address?: string;
  employee_location?: string;
  company_role?: string;
  stage?: string;
  lead_score?: string;
  linkedin_url?: string;
  created_at: string;
  confidence_level?: string;
  companies: {
    id: string;
    name: string;
    website?: string;
  };
  company_name?: string;
  company_logo_url?: string;
}

const PipelineOptimized = React.memo(() => {
  // State for pagination, sorting, and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { openLeadPopup } = usePopup();
  const { toast } = useToast();
  const { deduplicate } = useRequestDeduplication();
  const { prefetchLead } = usePrefetchData();
  const { invalidateLeads } = useCacheInvalidation();

  // Set page meta tags
  usePageMeta({
    title: 'Pipeline - Empowr CRM',
    description: 'Visualize your sales pipeline and track lead progression through different stages.',
    keywords: 'pipeline, sales, leads, stages, progression, CRM',
    ogTitle: 'Pipeline - Empowr CRM',
    ogDescription: 'Visualize your sales pipeline and track lead progression.',
    twitterTitle: 'Pipeline - Empowr CRM',
    twitterDescription: 'Visualize your sales pipeline and track lead progression.'
  });

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useDebouncedFetch(
    useCallback(() => Promise.resolve(searchTerm), [searchTerm]),
    { delay: 500 }
  );

  // Use optimized data fetching hook
  const {
    data: leadsData,
    isLoading,
    error,
    refetch
  } = useLeads(
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

  // Memoized leads with company information
  const leads = useMemo(() => {
    if (!leadsData?.data) return [];
    
    return leadsData.data.map((lead: Lead) => ({
      ...lead,
      company_name: lead.companies?.name || null,
      company_logo_url: lead.companies?.website ? getClearbitLogo(lead.companies.name, lead.companies.website) : null
    }));
  }, [leadsData?.data]);

  // Calculate pipeline stats
  const pipelineStats = useMemo(() => {
    if (!leadsData?.data) {
      return {
        totalLeads: 0,
        newLeads: 0,
        qualifiedLeads: 0,
        prospectLeads: 0,
        connectedLeads: 0,
        meetingBooked: 0,
        disqualified: 0
      };
    }

    const stats = leadsData.data.reduce((acc, lead) => {
      acc.totalLeads++;
      
      switch (lead.stage) {
        case 'new':
          acc.newLeads++;
          break;
        case 'qualified':
          acc.qualifiedLeads++;
          break;
        case 'prospect':
          acc.prospectLeads++;
          break;
        case 'connected':
          acc.connectedLeads++;
          break;
        case 'meeting_booked':
          acc.meetingBooked++;
          break;
        case 'disqualified':
          acc.disqualified++;
          break;
        default:
          acc.newLeads++;
      }
      
      return acc;
    }, {
      totalLeads: 0,
      newLeads: 0,
      qualifiedLeads: 0,
      prospectLeads: 0,
      connectedLeads: 0,
      meetingBooked: 0,
      disqualified: 0
    });

    return stats;
  }, [leadsData?.data]);

  // Sort options
  const sortOptions = [
    { label: "Created Date", value: "created_at" },
    { label: "Name", value: "name" },
    { label: "Role", value: "company_role" },
    { label: "Stage", value: "stage" },
    { label: getLabel('sort', 'ai_score'), value: "lead_score" },
    { label: "Confidence", value: "confidence_level" },
  ];

  // Status filter options
  const statusOptions = [
    { label: "All Stages", value: "all" },
    { label: "New", value: "new" },
    { label: "Qualified", value: "qualified" },
    { label: "Prospect", value: "prospect" },
    { label: "Connected", value: "connected" },
    { label: "Meeting Booked", value: "meeting_booked" },
    { label: "Disqualified", value: "disqualified" },
  ];

  // Handle refresh with deduplication
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await deduplicate('refresh-pipeline', async () => {
        await refetch();
        invalidateLeads();
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh pipeline",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, invalidateLeads, deduplicate, toast]);

  // Handle row click with prefetching
  const handleRowClick = useCallback((lead: Lead) => {
    prefetchLead(lead.id);
    openLeadPopup(lead.id);
  }, [openLeadPopup, prefetchLead]);

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

  // Table columns
  const columns = useMemo(() => [
    {
      key: "name",
      label: "Lead",
      width: "200px",
      render: (lead: Lead) => (
        <div className="min-w-0 max-w-80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              {(() => {
                const logoUrl = lead.company_logo_url;
                return logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={lead.companies?.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null;
              })()}
              <div 
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold"
                style={{ display: lead.company_logo_url ? 'none' : 'flex' }}
              >
                {lead.companies?.name ? getStatusDisplayText(lead.companies.name.charAt(0)) : '?'}
              </div>
            </div>
            <div className="text-sm font-medium break-words">{lead.name || "-"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "company_role",
      label: "Role",
      width: "150px",
      render: (lead: Lead) => (
        <div className="min-w-0 max-w-48">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {lead.company_role || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "companies.name",
      label: "Company",
      width: "150px",
      render: (lead: Lead) => (
        <div className="min-w-0 max-w-48">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {lead.companies?.name || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "stage",
      label: "Stage",
      width: "120px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (lead: Lead) => (
        <StatusBadge status={lead.stage || "new"} size="sm" />
      ),
    },
    {
      key: "lead_score",
      label: getLabel('table', 'ai_score'),
      width: "80px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (lead: Lead) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {lead.lead_score || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "email_address",
      label: "Email",
      width: "200px",
      render: (lead: Lead) => (
        <div className="min-w-0 max-w-64">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {lead.email_address || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "employee_location",
      label: "Location",
      width: "120px",
      render: (lead: Lead) => (
        <div className="min-w-0 max-w-32">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {lead.employee_location || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      width: "100px",
      render: (lead: Lead) => (
        <div className="text-sm text-muted-foreground">
          {new Date(lead.created_at).toLocaleDateString()}
        </div>
      ),
    },
  ], []);

  // Error handling
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">Error loading pipeline</div>
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sales Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Visualize and manage your lead progression through different stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" className="shadow-sm hover:shadow-md transition-shadow">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <PipelineStatsCards 
        totalLeads={pipelineStats.totalLeads}
        newLeads={pipelineStats.newLeads}
        qualifiedLeads={pipelineStats.qualifiedLeads}
        prospectLeads={pipelineStats.prospectLeads}
        connectedLeads={pipelineStats.connectedLeads}
        meetingBooked={pipelineStats.meetingBooked}
        disqualified={pipelineStats.disqualified}
      />

      {/* Search, Filter and Sort Controls */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search leads..."
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
            placeholder="All Stages"
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
        data={leads}
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
          totalPages: leadsData ? Math.ceil(leadsData.totalCount / pageSize) : 0,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
        enableExport={true}
        exportFilename="pipeline.csv"
      />
    </div>
  );
});

PipelineOptimized.displayName = 'PipelineOptimized';

export default PipelineOptimized;
