import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components";
import { StatusBadge } from "@/components/StatusBadge";
import { EntityDetailPopup } from "@/components/crm/EntityDetailPopup";
import { CompaniesStatsCards } from "@/components/StatsCards";
import { FavoriteToggle } from "@/components/FavoriteToggle";
import { OwnerDisplay } from "@/components/OwnerDisplay";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
  const [selectedCompanyForNavigation, setSelectedCompanyForNavigation] = useState<{id: string, name: string} | null>(null);
  const [isCompanyNavigationModalOpen, setIsCompanyNavigationModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [users, setUsers] = useState<{id: string, full_name: string, role: string}[]>([]);
  const [selectedCompanyForAssignment, setSelectedCompanyForAssignment] = useState<Company | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
    { label: "New Lead", value: "new_lead" },
    { label: "Automated", value: "automated" },
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
    let repliedCompanies = 0;
    let meetingScheduledCompanies = 0;
    let proposalSentCompanies = 0;
    let negotiationCompanies = 0;
    let closedWonCompanies = 0;
    let closedLostCompanies = 0;
    let onHoldCompanies = 0;
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
        case 'replied':
          repliedCompanies++;
          break;
        case 'meeting_scheduled':
          meetingScheduledCompanies++;
          break;
        case 'proposal_sent':
          proposalSentCompanies++;
          break;
        case 'negotiation':
          negotiationCompanies++;
          break;
        case 'closed_won':
          closedWonCompanies++;
          break;
        case 'closed_lost':
          closedLostCompanies++;
          break;
        case 'on_hold':
          onHoldCompanies++;
          break;
        default:
          newLeadCompanies++; // Default to new_lead if no stage set
      }
    });
    
    return {
      totalCompanies: companies.length,
      newLeadCompanies,
      automatedCompanies,
      repliedCompanies,
      meetingScheduledCompanies,
      proposalSentCompanies,
      negotiationCompanies,
      closedWonCompanies,
      closedLostCompanies,
      onHoldCompanies,
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
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "140px",
      render: (company: Company) => {
        switch (company.pipeline_stage) {
          case 'new_lead':
            return <StatusBadge status="New Lead" size="sm" />;
          case 'automated':
            return <StatusBadge status="Automated" size="sm" />;
          case 'replied':
            return <StatusBadge status="Replied" size="sm" />;
          case 'meeting_scheduled':
            return <StatusBadge status="Meeting Scheduled" size="sm" />;
          case 'proposal_sent':
            return <StatusBadge status="Proposal Sent" size="sm" />;
          case 'negotiation':
            return <StatusBadge status="Negotiation" size="sm" />;
          case 'closed_won':
            return <StatusBadge status="Closed Won" size="sm" />;
          case 'closed_lost':
            return <StatusBadge status="Closed Lost" size="sm" />;
          case 'on_hold':
            return <StatusBadge status="On Hold" size="sm" />;
          default:
            return <StatusBadge status="New Lead" size="sm" />;
        }
      },
    },
    {
      key: "name",
      label: "Company",
      width: "280px",
      render: (company: Company) => (
        <div 
          className="min-w-0 cursor-pointer hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors duration-150"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(company);
          }}
        >
          <div className="flex items-center gap-3">
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
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              {company.website ? (
                <img 
                  src={`https://logo.clearbit.com/${company.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}`}
                  alt={company.name}
                  className="w-8 h-8 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
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
            <div className="flex flex-col min-w-0 flex-1">
              <div className="text-sm font-medium break-words leading-tight hover:text-primary transition-colors duration-150">
                {company.name || "-"}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "head_office",
      label: "Head Office",
      width: "200px",
      render: (company: Company) => (
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {company.head_office || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "industry",
      label: "Industry",
      width: "400px",
      render: (company: Company) => (
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {company.industry || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "company_size",
      label: "Size",
      width: "200px",
      render: (company: Company) => (
        <div className="text-sm text-muted-foreground">
          {company.company_size || "-"}
        </div>
      ),
    },
    {
      key: "owner",
      label: "Assigned To",
      width: "180px",
      render: (company: Company) => (
        <div 
          className="cursor-pointer hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors duration-150"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCompanyForAssignment(company);
            setIsAssignmentModalOpen(true);
          }}
        >
          <OwnerDisplay 
            key={`${company.id}-${company.owner_id}`}
            ownerId={company.owner_id} 
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

  const handleCompanyNavigation = (companyId: string, companyName: string) => {
    // Close current company modal and open new company modal
    setIsDetailModalOpen(false);
    setSelectedCompany(null);
    setSelectedCompanyForNavigation({ id: companyId, name: companyName });
    setIsCompanyNavigationModalOpen(true);
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
              className="min-w-40 bg-white"
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
        <EntityDetailPopup
          entityType="company"
          entityId={selectedCompany.id}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedCompany(null);
          }}
        />
      )}

      {/* Assignment Modal */}
      {selectedCompanyForAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Assign Company</h3>
            <p className="text-sm text-gray-600 mb-4">
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
    </Page>
  );
};

export default Companies;
