import React, { useState, useMemo, useCallback } from "react";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { getStatusDisplayText } from "@/utils/statusUtils";
import { usePopup } from "@/contexts/PopupContext";
import { LeadsStatsCards } from "@/components/StatsCards";
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

const LeadsOptimized = React.memo(() => {
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
    title: 'Leads - Empowr CRM',
    description: 'Manage your lead pipeline and track prospect interactions. View lead details, company information, and automation status.',
    keywords: 'leads, prospects, CRM, lead management, sales pipeline, automation',
    ogTitle: 'Leads - Empowr CRM',
    ogDescription: 'Manage your lead pipeline and track prospect interactions.',
    twitterTitle: 'Leads - Empowr CRM',
    twitterDescription: 'Manage your lead pipeline and track prospect interactions.'
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

  // Calculate stats for stats cards
  const leadsStats = useMemo(() => {
    if (!leadsData?.data) {
      return {
        totalLeads: 0,
        newLeads: 0,
        qualifiedLeads: 0,
        prospectLeads: 0,
        connectedLeads: 0,
        meetingBooked: 0
      };
    }

    const stats = leadsData.data.reduce((acc, lead) => {
      acc.totalLeads++;
      
      if (lead.stage === 'new') acc.newLeads++;
      else if (lead.stage === 'qualified') acc.qualifiedLeads++;
      else if (lead.stage === 'prospect') acc.prospectLeads++;
      else if (lead.stage === 'connected') acc.connectedLeads++;
      else if (lead.stage === 'meeting_booked') acc.meetingBooked++;
      
      return acc;
    }, {
      totalLeads: 0,
      newLeads: 0,
      qualifiedLeads: 0,
      prospectLeads: 0,
      connectedLeads: 0,
      meetingBooked: 0
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
  ];

  // Handle refresh with deduplication
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await deduplicate('refresh-leads', async () => {
        await refetch();
        invalidateLeads();
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh leads",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, invalidateLeads, deduplicate, toast]);

  // Handle row click with prefetching
  const handleRowClick = useCallback((lead: Lead) => {
    // Prefetch related data for better UX
    prefetchLead(lead.id);
    openLeadPopup(lead.id);
  }, [openLeadPopup, prefetchLead]);

  // Handle search with debouncing
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  // Handle sort order toggle
  const handleSortOrderToggle = useCallback(() => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    setCurrentPage(1); // Reset to first page when changing sort order
  }, []);

  // Handle status filter change
  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Table columns
  const columns = useMemo(() => [
    {
      key: "name",
      label: "Lead",
      width: "200px",
      render: (lead: Lead) => {
        const { avatarUrl, initials } = getProfileImage(lead.name, 32);
        
        return (
          <div className="min-w-0 max-w-80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <img 
                  src={avatarUrl} 
                  alt={lead.name || 'Lead'}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div 
                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold"
                  style={{ display: 'none' }}
                >
                  {initials}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium break-words leading-tight">{lead.name || "-"}</div>
                <div className="text-xs text-muted-foreground break-words leading-tight">
                  {lead.company_role || "No role specified"}
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "company_name",
      label: "Company",
      width: "150px",
      render: (lead: Lead) => (
        <div className="min-w-0 max-w-64">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              {lead.company_logo_url ? (
                <img 
                  src={lead.company_logo_url} 
                  alt={lead.company_name || 'Company'}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    console.log(`Failed to load company logo for ${lead.company_name}: ${lead.company_logo_url}`);
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded company logo for ${lead.company_name}: ${lead.company_logo_url}`);
                  }}
                />
              ) : null}
              <div 
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold"
                style={{ display: lead.company_logo_url ? 'none' : 'flex' }}
              >
                {lead.company_name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            </div>
            <div className="text-sm font-medium break-words leading-tight">
              {lead.company_name || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "employee_location",
      label: "Location",
      width: "120px",
      render: (lead: Lead) => (
        <div className="min-w-0 max-w-48">
          <div className="text-xs text-muted-foreground break-words leading-tight">
            {lead.employee_location || "-"}
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
        <StatusBadge 
          status={lead.stage || "new"} 
          size="sm"
        />
      ),
    },
    {
      key: "lead_score",
      label: "Score",
      width: "80px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (lead: Lead) => (
        <div className="flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            lead.lead_score ? 
              (parseInt(lead.lead_score) >= 80 ? 'bg-green-500' :
               parseInt(lead.lead_score) >= 60 ? 'bg-yellow-500' :
               parseInt(lead.lead_score) >= 40 ? 'bg-orange-500' : 'bg-red-500') :
              'bg-gray-300'
          }`} />
          <span className="text-sm font-medium">
            {lead.lead_score || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Added",
      width: "100px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (lead: Lead) => {
        if (!lead.created_at) return <span className="text-xs">-</span>;
        
        try {
          const date = new Date(lead.created_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return (
            <div className="text-center">
              <div className="text-xs text-muted-foreground">
                {diffDays === 1 ? '1 day ago' : `${diffDays} days ago`}
              </div>
            </div>
          );
        } catch {
          return <span className="text-xs">-</span>;
        }
      },
    },
    {
      key: "last_interaction_at",
      label: "Last Contact",
      width: "120px",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      render: (lead: Lead) => {
        if (!lead.last_interaction_at) return <span className="text-xs">-</span>;
        
        try {
          const date = new Date(lead.last_interaction_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return (
            <div className="text-center">
              <div className="text-xs text-muted-foreground">
                {diffDays === 1 ? '1 day ago' : `${diffDays} days ago`}
              </div>
            </div>
          );
        } catch {
          return <span className="text-xs">-</span>;
        }
      },
    },
  ], []);

  // Error handling
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">Error loading leads</div>
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track your lead pipeline
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
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <LeadsStatsCards 
        totalLeads={leadsStats.totalLeads}
        newLeads={leadsStats.newLeads}
        qualifiedLeads={leadsStats.qualifiedLeads}
        prospectLeads={leadsStats.prospectLeads}
        connectedLeads={leadsStats.connectedLeads}
        meetingBooked={leadsStats.meetingBooked}
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
        exportFilename="leads.csv"
      />
    </div>
  );
});

LeadsOptimized.displayName = 'LeadsOptimized';

export default LeadsOptimized;

