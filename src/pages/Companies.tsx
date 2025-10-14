// Companies page using EnhancedTable directly (like Jobs page)
import { FavoriteToggle } from "@/components/FavoriteToggle";
import { OwnerDisplay } from "@/components/OwnerDisplay";
import { AIScoreBadge } from "@/components/ai/AIScoreBadge";
import { Button } from "@/components/ui/button";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { EnhancedTable, EnhancedTableBody, EnhancedTableCell, EnhancedTableHead, EnhancedTableHeader, EnhancedTableRow } from "@/components/ui/enhanced-table";
import { SearchIconButton, SearchModal } from "@/components/ui/search-modal";
import { useAuth } from "@/contexts/AuthContext";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import { Page, type StatItemProps } from "@/design-system/components";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { OPTIMIZED_QUERIES } from "@/utils/queryOptimizer";
import { getStatusDisplayText } from "@/utils/statusUtils";
import { Building2, CheckCircle, Star, Target, Zap } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

type Company = Tables<"companies"> & {
  people_count?: number;
  jobs_count?: number;
};

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [users, setUsers] = useState<{id: string, full_name: string, role: string}[]>([]);
  const [selectedCompanyForAssignment, setSelectedCompanyForAssignment] = useState<Company | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();

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
    { label: "All Stages", value: "all" },
    { label: getStatusDisplayText("new_lead"), value: "new_lead" },
    { label: getStatusDisplayText("automated"), value: "automated" },
    { label: "Replied", value: "replied" },
    { label: "Meeting Scheduled", value: "meeting_scheduled" },
    { label: "Proposal Sent", value: "proposal_sent" },
    { label: "Negotiation", value: "negotiation" },
    { label: "Closed Won", value: "closed_won" },
    { label: "Closed Lost", value: "closed_lost" },
    { label: "On Hold", value: "on_hold" },
  ];

  // Calculate stats for stats cards
  const companiesStats = useMemo(() => {
    let newLeadCompanies = 0;
    let automatedCompanies = 0;
    let meetingScheduledCompanies = 0;
    let closedLostCompanies = 0;
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
      
      // Categorize by pipeline_stage
      switch (company.pipeline_stage) {
        case 'new_lead':
          newLeadCompanies++;
          break;
        case 'automated':
          automatedCompanies++;
          break;
        case 'meeting_scheduled':
          meetingScheduledCompanies++;
          break;
        case 'closed_lost':
          closedLostCompanies++;
          break;
        default:
          newLeadCompanies++; // Default to new_lead if no stage set
      }
    });
    
    return {
      totalCompanies: companies.length,
      newLeadCompanies,
      automatedCompanies,
      meetingScheduledCompanies,
      closedLostCompanies,
      companiesWithLeads,
      companiesWithJobs
    };
  }, [companies]);

  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
    // Filter by search term, status, favorites, and tab/user selection
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
      const matchesStatus = statusFilter === "all" || company.pipeline_stage === statusFilter;

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || company.is_favourite;
      
      // User filter
      const matchesUser = selectedUser === 'all' || company.owner_id === selectedUser;

      return matchesSearch && matchesStatus && matchesFavorites && matchesUser;
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
  }, [companies, searchTerm, sortBy, sortOrder, statusFilter, showFavoritesOnly, selectedUser]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      // Fetch all companies
      const { data: allCompanies, error: allError } = await supabase
        .from("companies")
        .select(OPTIMIZED_QUERIES.getCompaniesList())
        .order("created_at", { ascending: false });
      
      if (allError) {
        console.error('Error fetching companies:', allError);
        throw allError;
      }
      
      // Get people count for each company
      const { data: peopleCounts, error: peopleError } = await supabase
        .from("people")
        .select("company_id")
        .not("company_id", "is", null);

      if (peopleError) {
        console.error('Error fetching people counts:', peopleError);
        throw peopleError;
      }

      // Get jobs count for each company
      const { data: jobsCounts, error: jobsError } = await supabase
        .from("jobs")
        .select("company_id")
        .not("company_id", "is", null);

      if (jobsError) {
        console.error('Error fetching jobs counts:', jobsError);
        throw jobsError;
      }

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

      if (tagsError) {
        console.error('Error fetching company tags:', tagsError);
        throw tagsError;
      }

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

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, role')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
  }, []);

  const columns = [
    {
      key: "status",
      label: "Status",
      render: (v: any) => (
        <div className="border justify-center items-center flex mx-auto bg-blue-50 text-blue-700 border-blue-200 h-8 text-xs font-medium rounded-full text-center px-3 min-w-[80px]">
          {v === 'new_lead' ? getStatusDisplayText('new_lead') : 
           v === 'automated' ? getStatusDisplayText('automated') :
           v === 'replied' ? getStatusDisplayText('replied') :
           v === 'meeting_scheduled' ? getStatusDisplayText('meeting_scheduled') :
           v === 'proposal_sent' ? getStatusDisplayText('proposal_sent') :
           v === 'negotiation' ? getStatusDisplayText('negotiation') :
           v === 'closed_won' ? getStatusDisplayText('closed_won') :
           v === 'closed_lost' ? getStatusDisplayText('closed_lost') :
           v === 'on_hold' ? getStatusDisplayText('on_hold') :
           getStatusDisplayText('new_lead')}
        </div>
      ),
    },
    {
      key: "name",
      label: "Company",
      render: (_: any, row: any) => (
        <div 
          className="min-w-0 cursor-pointer hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors duration-150"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row as Company);
          }}
        >
          <div className="flex items-center gap-3">
            <div onClick={(e) => e.stopPropagation()}>
              <FavoriteToggle
                entityId={row.id}
                entityType="company"
                isFavorite={row.is_favourite || false}
                onToggle={(isFavorite) => {
                  setCompanies(prev => prev.map(c => c.id === row.id ? { ...c, is_favourite: isFavorite } : c));
                }}
                size="sm"
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {row.website ? (
                <img 
                  src={`https://logo.clearbit.com/${row.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}`}
                  alt={row.name}
                  className="w-8 h-8 rounded-lg object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const nextElement = (e.currentTarget.nextElementSibling as HTMLElement);
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center"
                style={{ display: row.website ? 'none' : 'flex' }}
              >
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="text-sm font-medium break-words leading-tight hover:text-sidebar-primary transition-colors duration-150">
                {row.name || "-"}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    { key: "head_office", label: "Head Office" },
    { key: "industry", label: "Industry" },
    { key: "company_size", label: "Size" },
    {
      key: "owner_display",
      label: "Assigned To",
      render: (_: any, row: any) => (
        <div 
          className="cursor-pointer hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors duration-150"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCompanyForAssignment(row as Company);
            setIsAssignmentModalOpen(true);
          }}
        >
          <OwnerDisplay 
            key={`${row.id}-${row.owner_id}`}
            ownerId={row.owner_id} 
            size="sm"
            showName={true}
            showRole={false}
          />
        </div>
      ),
    },
    {
      key: "lead_score",
      label: "AI Score",
      render: (_: any, row: any) => (
        <div className="flex items-center justify-center">
          <AIScoreBadge leadData={{ name: row.name || "", company: row.name || "", role: "", location: row.head_office || "" }} initialScore={row.lead_score ? parseInt(row.lead_score) : undefined} />
        </div>
      ),
    },
    {
      key: "people_count",
      label: "People",
      render: (v: any) => (
        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium bg-muted border">{v || 0}</span>
      ),
    },
    {
      key: "jobs_count",
      label: "Jobs",
      render: (v: any) => (
        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium bg-muted border">{v || 0}</span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (v: any) => (
        <div className="text-sm text-muted-foreground">{v ? new Date(v).toLocaleDateString() : '-'}</div>
      ),
    },
  ];

  const tableData = useMemo(() => filteredAndSortedCompanies.map((company) => ({
    id: company.id,
    name: company.name,
    head_office: company.head_office || '-',
    industry: company.industry || '-',
    company_size: company.company_size || '-',
    owner_id: company.owner_id,
    lead_score: company.lead_score,
    people_count: company.people_count || 0,
    jobs_count: company.jobs_count || 0,
    created_at: company.created_at,
    website: company.website,
    is_favourite: company.is_favourite,
    pipeline_stage: company.pipeline_stage,
    status: company.pipeline_stage,
  })), [filteredAndSortedCompanies]);

  const handleRowClick = (company: Company) => {
    openPopup('company', company.id, company.name);
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

  // Stats for Companies page
  const stats: StatItemProps[] = [
    {
      icon: Building2,
      value: companiesStats.totalCompanies,
      label: "companies"
    },
    {
      icon: Zap,
      value: companiesStats.automatedCompanies,
      label: "automated"
    },
    {
      icon: Target,
      value: companiesStats.newLeadCompanies,
      label: "new prospects"
    },
    {
      icon: CheckCircle,
      value: companiesStats.meetingScheduledCompanies,
      label: "meetings scheduled"
    }
  ];

  return (
      <Page
        stats={stats}
        hideHeader
      >

        {/* Search, Filter and Sort Controls - Full Width */}
        <div className="flex items-center justify-between gap-4 mb-4 w-full">
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <DropdownSelect
              options={statusOptions}
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
              placeholder="All Statuses"
              className="min-w-32 bg-background h-8"
            />
            
            {/* Assignment Filter */}
            <DropdownSelect
              options={[
                { label: "All Users", value: "all" },
                ...users.map(userItem => ({
                  label: userItem.id === user?.id ? `${userItem.full_name} (me)` : userItem.full_name,
                  value: userItem.id
                }))
              ]}
              value={selectedUser}
              onValueChange={(value) => setSelectedUser(value)}
              placeholder="Filter by user"
              className="min-w-40 bg-white h-8"
            />
            

            {/* Favorites Icon Button */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "h-8 w-8 rounded-md border flex items-center justify-center transition-colors action-bar-icon",
                showFavoritesOnly 
                  ? "bg-primary-50 text-primary-700 border-primary-200" 
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              )}
              title={showFavoritesOnly ? "Show all companies" : "Show favorites only"}
            >
              <Star className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
            </button>
          </div>
          
          {/* Sort Controls - Far Right */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <DropdownSelect
              options={sortOptions}
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
              placeholder="Select sort"
              className="min-w-32 bg-background h-8"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-2 h-8 text-sm border rounded bg-background hover:bg-muted/50 flex items-center justify-center action-bar-icon"
              title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
            
            {/* Search Icon Button - Far Right */}
            <SearchIconButton 
              onClick={() => setIsSearchModalOpen(true)}
              className="ml-2"
            />
          </div>
        </div>

        {/* Data Table - Full Width */}
        <div className="bg-white rounded-lg border border-gray-200 w-full">
          <EnhancedTable dualScrollbars={false} stickyHeader={true} maxHeight="calc(100vh - 300px)">
            <EnhancedTableHeader>
              <EnhancedTableRow className="transition-colors data-[state=selected]:bg-muted hover:bg-muted/50 border-b border-gray-200 bg-gray-50/50">
                <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center min-h-[56px]" scope="col" style={{width: '120px', minWidth: '120px'}}>
                  <div className="flex items-center gap-2 justify-center">
                    <span>Status</span>
                  </div>
                </EnhancedTableHead>
                <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left min-h-[56px]" scope="col" style={{width: '300px', minWidth: '300px'}}>
                  <div className="flex items-center gap-2 justify-start">
                    <span>Company</span>
                  </div>
                </EnhancedTableHead>
                <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left min-h-[56px]" scope="col" style={{width: '200px', minWidth: '200px'}}>
                  <div className="flex items-center gap-2 justify-start">
                    <span>Head Office</span>
                  </div>
                </EnhancedTableHead>
                <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left min-h-[56px]" scope="col" style={{width: '150px', minWidth: '150px'}}>
                  <div className="flex items-center gap-2 justify-start">
                    <span>Industry</span>
                  </div>
                </EnhancedTableHead>
                <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left min-h-[56px]" scope="col" style={{width: '120px', minWidth: '120px'}}>
                  <div className="flex items-center gap-2 justify-start">
                    <span>Size</span>
                  </div>
                </EnhancedTableHead>
                <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left min-h-[56px]" scope="col" style={{width: '150px', minWidth: '150px'}}>
                  <div className="flex items-center gap-2 justify-start">
                    <span>Assigned To</span>
                  </div>
                </EnhancedTableHead>
                <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center min-h-[56px]" scope="col" style={{width: '100px', minWidth: '100px'}}>
                  <div className="flex items-center gap-2 justify-center">
                    <span>AI Score</span>
                  </div>
                </EnhancedTableHead>
                <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center min-h-[56px]" scope="col" style={{width: '100px', minWidth: '100px'}}>
                  <div className="flex items-center gap-2 justify-center">
                    <span>People</span>
                  </div>
                </EnhancedTableHead>
                <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center min-h-[56px]" scope="col" style={{width: '100px', minWidth: '100px'}}>
                  <div className="flex items-center gap-2 justify-center">
                    <span>Jobs</span>
                  </div>
                </EnhancedTableHead>
                <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center min-h-[56px]" scope="col" style={{width: '120px', minWidth: '120px'}}>
                  <div className="flex items-center gap-2 justify-center">
                    <span>Created</span>
                  </div>
                </EnhancedTableHead>
              </EnhancedTableRow>
            </EnhancedTableHeader>
            <EnhancedTableBody>
              {tableData.map((company, index) => (
                <EnhancedTableRow 
                  key={company.id} 
                  className="data-[state=selected]:bg-muted border-b border-gray-100 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-200 transition-colors duration-200 group cursor-pointer relative min-h-[56px]" 
                  role="row" 
                  tabIndex={0} 
                  aria-label={`Row ${index + 1}`}
                  onClick={() => handleRowClick(company as Company)}
                >
                  {/* Status */}
                  <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px] text-center" style={{width: '120px', minWidth: '120px'}}>
                    <div className="border justify-center items-center flex mx-auto bg-blue-50 text-blue-700 border-blue-200 h-8 text-xs font-medium rounded-full text-center px-3 min-w-[80px]">
                      {company.status === 'new_lead' ? getStatusDisplayText('new_lead') : 
                       company.status === 'automated' ? getStatusDisplayText('automated') :
                       company.status === 'replied' ? getStatusDisplayText('replied') :
                       company.status === 'meeting_scheduled' ? getStatusDisplayText('meeting_scheduled') :
                       company.status === 'proposal_sent' ? getStatusDisplayText('proposal_sent') :
                       company.status === 'negotiation' ? getStatusDisplayText('negotiation') :
                       company.status === 'closed_won' ? getStatusDisplayText('closed_won') :
                       company.status === 'closed_lost' ? getStatusDisplayText('closed_lost') :
                       company.status === 'on_hold' ? getStatusDisplayText('on_hold') :
                       getStatusDisplayText('new_lead')}
                    </div>
                  </EnhancedTableCell>
                  
                  {/* Company */}
                  <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px]" style={{width: '300px', minWidth: '300px'}}>
                    <div 
                      className="min-w-0 cursor-pointer hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors duration-150"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(company as Company);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div onClick={(e) => e.stopPropagation()}>
                          <FavoriteToggle
                            entityId={company.id}
                            entityType="company"
                            isFavorite={company.is_favourite || false}
                            onToggle={(isFavorite) => {
                              setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, is_favourite: isFavorite } : c));
                            }}
                            size="sm"
                          />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          {company.website ? (
                            <img 
                              src={`https://logo.clearbit.com/${company.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}`}
                              alt={company.name}
                              className="w-8 h-8 rounded-lg object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                const nextElement = (e.currentTarget.nextElementSibling as HTMLElement);
                                if (nextElement) {
                                  nextElement.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className="w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center"
                            style={{ display: company.website ? 'none' : 'flex' }}
                          >
                            <Building2 className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="text-sm font-medium break-words leading-tight hover:text-sidebar-primary transition-colors duration-150">
                            {company.name || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </EnhancedTableCell>
                  
                  {/* Head Office */}
                  <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px]" style={{width: '200px', minWidth: '200px'}}>
                    <div className="min-w-0">
                      <div className="text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {company.head_office || "-"}
                      </div>
                    </div>
                  </EnhancedTableCell>
                  
                  {/* Industry */}
                  <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px]" style={{width: '150px', minWidth: '150px'}}>
                    <div className="min-w-0">
                      <div className="text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {company.industry || "-"}
                      </div>
                    </div>
                  </EnhancedTableCell>
                  
                  {/* Size */}
                  <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px]" style={{width: '120px', minWidth: '120px'}}>
                    <div className="min-w-0">
                      <div className="text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {company.company_size || "-"}
                      </div>
                    </div>
                  </EnhancedTableCell>
                  
                  {/* Assigned To */}
                  <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px]" style={{width: '150px', minWidth: '150px'}}>
                    <div className="min-w-0">
                      <OwnerDisplay 
                        ownerId={company.owner_id} 
                        entityId={company.id} 
                        entityType="company"
                        onAssignmentChange={() => {
                          console.log('Assignment changed for company:', company.id);
                        }}
                        className="text-sm"
                      />
                    </div>
                  </EnhancedTableCell>
                  
                  {/* AI Score */}
                  <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px] text-center" style={{width: '100px', minWidth: '100px'}}>
                    <div className="flex items-center justify-center">
                      <AIScoreBadge leadData={{ name: company.name || "", company: company.name || "", role: "", location: company.head_office || "" }} initialScore={company.lead_score ? parseInt(company.lead_score) : undefined} />
                    </div>
                  </EnhancedTableCell>
                  
                  {/* People Count */}
                  <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px] text-center" style={{width: '100px', minWidth: '100px'}}>
                    <div className="min-w-0">
                      <div className="text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {company.people_count || 0}
                      </div>
                    </div>
                  </EnhancedTableCell>
                  
                  {/* Jobs Count */}
                  <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px] text-center" style={{width: '100px', minWidth: '100px'}}>
                    <div className="min-w-0">
                      <div className="text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {company.jobs_count || 0}
                      </div>
                    </div>
                  </EnhancedTableCell>
                  
                  {/* Created */}
                  <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px] text-center" style={{width: '120px', minWidth: '120px'}}>
                    <div className="min-w-0">
                      <div className="text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {company.created_at ? new Date(company.created_at).toLocaleDateString() : "-"}
                      </div>
                    </div>
                  </EnhancedTableCell>
                </EnhancedTableRow>
              ))}
            </EnhancedTableBody>
          </EnhancedTable>
        </div>

      {/* Company Detail Modal - Now handled by UnifiedPopup */}

      {/* Assignment Modal */}
      {selectedCompanyForAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-foreground mb-4">Assign Company</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Assign "{selectedCompanyForAssignment.name}" to a user
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select User</label>
                <DropdownSelect
                  disabled={isSavingAssignment}
                  options={[
                    { label: "Unassigned", value: null },
                    ...users.map(user => ({
                      label: user.full_name,
                      value: user.id
                    }))
                  ]}
                  value={selectedCompanyForAssignment.owner_id}
                  onValueChange={(value) => {
                    setSelectedCompanyForAssignment(prev => 
                      prev ? { ...prev, owner_id: value } : null
                    );
                  }}
                  placeholder="Select a user..."
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  disabled={isSavingAssignment}
                  onClick={() => {
                    setIsAssignmentModalOpen(false);
                    setSelectedCompanyForAssignment(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isSavingAssignment}
                  onClick={async () => {
                    if (!selectedCompanyForAssignment) return;
                    
                    setIsSavingAssignment(true);
                    try {
                      const { data, error } = await supabase
                        .from('companies')
                        .update({ owner_id: selectedCompanyForAssignment.owner_id })
                        .eq('id', selectedCompanyForAssignment.id)
                        .select();

                      if (error) throw error;

                      // Update local state
                      setCompanies(prev => 
                        prev.map(company => 
                          company.id === selectedCompanyForAssignment.id 
                            ? { ...company, owner_id: selectedCompanyForAssignment.owner_id }
                            : company
                        )
                      );

                      toast({
                        title: "Success",
                        description: `Company assigned successfully`,
                      });

                      setIsAssignmentModalOpen(false);
                      setSelectedCompanyForAssignment(null);
                    } catch (error) {
                      console.error('Error assigning company:', error);
                      toast({
                        title: "Error",
                        description: "Failed to assign company",
                        variant: "destructive",
                      });
                    } finally {
                      setIsSavingAssignment(false);
                    }
                  }}
                >
                  {isSavingAssignment ? "Saving..." : "Save Assignment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        placeholder="Search companies..."
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={(value) => {
          setSearchTerm(value);
          setIsSearchModalOpen(false);
        }}
      />
    </Page>
  );
};

export default memo(Companies);