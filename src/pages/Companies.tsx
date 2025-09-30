import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components";
import { StatusBadge } from "@/components/StatusBadge";
import { CompanyDetailPopup } from "@/components/CompanyDetailPopup";
import { CompaniesStatsCards } from "@/components/StatsCards";
import { FavoriteToggle } from "@/components/FavoriteToggle";
import { OwnerDisplay } from "@/components/OwnerDisplay";
import { LeadSourceDisplay } from "@/components/features/leads/LeadSourceDisplay";
import { TagDisplay } from "@/components/TagDisplay";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Trash2, Building2, Users, Briefcase, CheckCircle, Star, AlertCircle } from "lucide-react";
import { getClearbitLogo } from "@/utils/logoService";
import { Page } from "@/design-system/components";
import { cn } from "@/lib/utils";
import { getScoreBadgeClasses } from "@/utils/scoreUtils";
import type { Tables } from "@/integrations/supabase/types";
import { OPTIMIZED_QUERIES } from "@/utils/queryOptimizer";

type Company = Tables<"companies"> & {
  people_count?: number;
  jobs_count?: number;
};

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();

  // Sort options
  const sortOptions = [
    { label: "Created Date", value: "created_at" },
    { label: "Company Name", value: "name" },
    { label: "Industry", value: "industry" },
    { label: "Head Office", value: "head_office" },
    { label: "Score", value: "lead_score" },
    { label: "Priority", value: "priority" },
    { label: "Leads Count", value: "people_count" },
    { label: "Jobs Count", value: "jobs_count" },
  ];

  // Status filter options
  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Active", value: "active" },
    { label: "Qualified", value: "qualified" },
    { label: "Prospect", value: "prospect" },
    { label: "New", value: "new" },
  ];

  // Source filter options
  const sourceOptions = [
    { label: "All Sources", value: "all" },
    { label: "LinkedIn", value: "LinkedIn" },
    { label: "Website", value: "Website" },
    { label: "Referral", value: "Referral" },
    { label: "Cold Email", value: "Cold Email" },
    { label: "Trade Show", value: "Trade Show" },
    { label: "Social Media", value: "Social Media" },
    { label: "Google Search", value: "Google Search" },
    { label: "Industry Publication", value: "Industry Publication" },
    { label: "Partnership", value: "Partnership" },
    { label: "Other", value: "Other" },
  ];

  // Calculate stats for stats cards
  const companiesStats = useMemo(() => {
    let activeCompanies = 0;
    let qualifiedCompanies = 0;
    let prospectCompanies = 0;
    let newCompanies = 0;
    let companiesWithLeads = 0;
    let companiesWithJobs = 0;
    
    companies.forEach(company => {
      // Count companies with leads
      if (company.people_count && company.people_count > 0) {
        companiesWithLeads++;
      }
      
      // Count companies with jobs
      if (company.jobs_count && company.jobs_count > 0) {
        companiesWithJobs++;
      }
      
      // Categorize by status
      if (company.automation_active) {
        activeCompanies++;
      } else if (company.confidence_level === 'high') {
        qualifiedCompanies++;
      } else if (company.confidence_level === 'medium') {
        prospectCompanies++;
      } else {
        newCompanies++;
      }
    });
    
    return {
      totalCompanies: companies.length,
      activeCompanies,
      qualifiedCompanies,
      prospectCompanies,
      newCompanies,
      companiesWithLeads,
      companiesWithJobs
    };
  }, [companies]);


  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
    // Filter by search term, status, and favorites
    const filtered = companies.filter(company => {
      // Search filter
      const matchesSearch = !searchTerm || (() => {
        const searchLower = searchTerm.toLowerCase();
        return (
          company.name?.toLowerCase().includes(searchLower) ||
          company.industry?.toLowerCase().includes(searchLower) ||
          company.head_office?.toLowerCase().includes(searchLower)
        );
      })();

      // Status filter
      const matchesStatus = statusFilter === "all" || (() => {
        if (company.automation_active) return statusFilter === "active";
        else if (company.confidence_level === 'high') return statusFilter === "qualified";
        else if (company.confidence_level === 'medium') return statusFilter === "prospect";
        else if (company.confidence_level === 'low') return statusFilter === "new";
        else return statusFilter === "new";
      })();

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || company.is_favourite;
      
      // Source filter
      const matchesSource = sourceFilter === "all" || company.lead_source === sourceFilter;

      return matchesSearch && matchesStatus && matchesFavorites && matchesSource;
    });

    // Sort the filtered results
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "created_at":
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          break;
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "industry":
          aValue = a.industry?.toLowerCase() || "";
          bValue = b.industry?.toLowerCase() || "";
          break;
        case "head_office":
          aValue = a.head_office?.toLowerCase() || "";
          bValue = b.head_office?.toLowerCase() || "";
          break;
        case "lead_score":
          aValue = parseInt(a.lead_score || "0");
          bValue = parseInt(b.lead_score || "0");
          break;
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority?.toLowerCase() as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority?.toLowerCase() as keyof typeof priorityOrder] || 0;
          break;
        case "people_count":
          aValue = a.people_count || 0;
          bValue = b.people_count || 0;
          break;
        case "jobs_count":
          aValue = a.jobs_count || 0;
          bValue = b.jobs_count || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [companies, searchTerm, sortBy, sortOrder, statusFilter, sourceFilter, showFavoritesOnly]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      // Fetch all companies
      const { data: allCompanies, error: allError } = await supabase
        .from("companies")
        .select(OPTIMIZED_QUERIES.getCompaniesList())
        .order("created_at", { ascending: false });
      
      if (allError) throw allError;
      
      console.log('Total companies fetched:', allCompanies?.length);
      
      // Get people count for each company
      const { data: peopleCounts, error: peopleError } = await supabase
        .from("people")
        .select("company_id")
        .not("company_id", "is", null);

      if (peopleError) throw peopleError;

      // Get jobs count for each company
      const { data: jobsCounts, error: jobsError } = await supabase
        .from("jobs")
        .select("company_id")
        .not("company_id", "is", null);

      if (jobsError) throw jobsError;

      // Get tags for each company
      const { data: companyTags, error: tagsError } = await supabase
        .from("entity_tags")
        .select(`
          entity_id,
          tags!inner (
            id,
            name,
            color,
            description
          )
        `)
        .eq("entity_type", "company");

      if (tagsError) throw tagsError;

      // Count people per company
      const companyPeopleCount: Record<string, number> = {};
      peopleCounts?.forEach(person => {
        if (person.company_id) {
          companyPeopleCount[person.company_id] = (companyPeopleCount[person.company_id] || 0) + 1;
        }
      });

      // Count jobs per company
      const companyJobsCount: Record<string, number> = {};
      jobsCounts?.forEach(job => {
        if (job.company_id) {
          companyJobsCount[job.company_id] = (companyJobsCount[job.company_id] || 0) + 1;
        }
      });

      // Group tags per company
      const companyTagsMap: Record<string, any[]> = {};
      companyTags?.forEach(item => {
        if (item.entity_id) {
          if (!companyTagsMap[item.entity_id]) {
            companyTagsMap[item.entity_id] = [];
          }
          companyTagsMap[item.entity_id].push({
            id: item.tags.id,
            name: item.tags.name,
            color: item.tags.color,
            description: item.tags.description,
          });
        }
      });

      // Add counts to companies
      const companiesWithCounts = (allCompanies || []).map(company => ({
        ...company,
        people_count: companyPeopleCount[company.id] || 0,
        jobs_count: companyJobsCount[company.id] || 0,
        tags: companyTagsMap[company.id] || [],
      }));

      console.log('Companies with counts:', companiesWithCounts.length);

      setCompanies(companiesWithCounts);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch companies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const columns = [
    {
      key: "status",
      label: "Status",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "140px",
      render: (company: Company) => {
        if (company.automation_active) {
          return <StatusBadge status="Active" size="sm" />;
        } else if (company.confidence_level === 'high') {
          return <StatusBadge status="Qualified" size="sm" />;
        } else if (company.confidence_level === 'medium') {
          return <StatusBadge status="Prospect" size="sm" />;
        } else if (company.confidence_level === 'low') {
          return <StatusBadge status="New" size="sm" />;
        } else {
          return <StatusBadge status="New" size="sm" />;
        }
      },
    },
    {
      key: "favorite",
      label: "",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "60px",
      render: (company: Company) => (
        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteToggle
            entityId={company.id}
            entityType="company"
            isFavorite={company.is_favourite || false}
            onToggle={(isFavorite) => {
              setCompanies(prev => prev.map(c => 
                c.id === company.id ? { ...c, is_favourite: isFavorite } : c
              ));
            }}
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      width: "180px",
      render: (company: Company) => (
        <OwnerDisplay 
          ownerId={company.owner_id} 
          size="sm"
          showName={true}
          showRole={false}
        />
      ),
    },
    {
      key: "source",
      label: "Lead Source",
      width: "160px",
      render: (company: Company) => (
        <LeadSourceDisplay 
          source={company.lead_source}
          sourceDetails={company.source_details}
          sourceDate={company.source_date}
          size="sm"
          showDetails={false}
          showDate={false}
        />
      ),
    },
    {
      key: "tags",
      label: "Tags",
      width: "200px",
      render: (company: Company) => (
        <TagDisplay 
          tags={company.tags || []}
          size="sm"
          maxVisible={2}
          showAll={false}
        />
      ),
    },
    {
      key: "name",
      label: "Company",
      width: "320px",
      render: (company: Company) => (
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              {company.website ? (
                <img 
                  src={`https://logo.clearbit.com/${company.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}`}
                  alt={company.name}
                  className="w-8 h-8 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"
                style={{ display: company.website ? 'none' : 'flex' }}
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
      width: "260px",
      render: (company: Company) => (
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {company.industry || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "head_office",
      label: "Location",
      width: "240px",
      render: (company: Company) => (
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {company.head_office || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "company_size",
      label: "Size",
      width: "140px",
      render: (company: Company) => (
        <div className="text-sm text-muted-foreground">
          {company.company_size || "-"}
        </div>
      ),
    },
    {
      key: "lead_score",
      label: "AI Score",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "100px",
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <span
            className={cn(
              "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border",
              getScoreBadgeClasses(company.lead_score ?? null)
            )}
          >
            {company.lead_score ?? "-"}
          </span>
        </div>
      ),
    },
    {
      key: "people_count",
      label: "People",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "100px",
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 border border-gray-200">
            {company.people_count || 0}
          </span>
        </div>
      ),
    },
    {
      key: "jobs_count",
      label: "Jobs",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "100px",
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 border border-gray-200">
            {company.jobs_count || 0}
          </span>
        </div>
      ),
    },
    {
      key: "automation_active",
      label: "Auto",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "80px",
      render: (company: Company) => (
        <div className="flex items-center justify-center">
          <div className={`w-2.5 h-2.5 rounded-full ${company.automation_active ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "140px",
      render: (company: Company) => (
        <div className="text-sm text-muted-foreground">
          {new Date(company.created_at).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const handleRowClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailModalOpen(true);
  };

  const handleDeleteCompany = async (companyId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete the company "${companyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Company "${companyName}" has been deleted.`,
      });

      // Refresh the companies list
      fetchCompanies();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete company: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Page
      title="Companies"
      subtitle="Manage your target companies and prospects"
    >

        {/* Search, Filter and Sort Controls */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm w-64 bg-white"
              />
            </div>
            
            {/* Status Filter */}
            <DropdownSelect
              options={statusOptions}
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
              placeholder="All Statuses"
              className="min-w-32 bg-white"
            />
            
            {/* Source Filter */}
            <DropdownSelect
              options={sourceOptions}
              value={sourceFilter}
              onValueChange={(value) => setSourceFilter(value)}
              placeholder="All Sources"
              className="min-w-32 bg-white"
            />

            {/* Favorites Filter */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                showFavoritesOnly 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-white text-muted-foreground hover:text-foreground border border-border"
              )}
            >
              <Star className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
              Favorites
              {companies.filter(company => company.is_favourite).length > 0 && (
                <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  {companies.filter(company => company.is_favourite).length}
                </span>
              )}
            </button>
          </div>
          
          {/* Sort Controls - Far Right */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort:</span>
            <DropdownSelect
              options={sortOptions}
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
              placeholder="Select sort"
              className="min-w-32 bg-white"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        <DataTable
          data={filteredAndSortedCompanies}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          pagination={{
            enabled: true,
            pageSize: 20,
            pageSizeOptions: [10, 20, 50, 100],
            showPageSizeSelector: true,
            showItemCount: true,
          }}
        />

      {/* Company Detail Modal */}
      {selectedCompany && (
        <CompanyDetailPopup
          company={selectedCompany}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedCompany(null);
          }}
        />
      )}
    </Page>
  );
};

export default Companies;
