// Replaced legacy DataTable with ModernDataTable
import { FavoriteToggle } from "@/components/FavoriteToggle";
import { OwnerDisplay } from "@/components/OwnerDisplay";
import { Button } from "@/components/ui/button";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { useAuth } from "@/contexts/AuthContext";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import { Page, type StatItemProps } from "@/design-system/components";
import { ModernDataTable } from "@/design-system/modern-components";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { getClearbitLogo } from "@/utils/logoService";
import {
    ArrowUpDown,
    CheckCircle,
    Search,
    Star,
    Target,
    Users,
    Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Lead = Tables<"people"> & {
  company_name?: string | null;
  company_logo_url?: string | null;
};

// Normalize various truthy values that might be stored as string/boolean
const toBoolean = (val: unknown): boolean => {
  return val === true || val === 'true' || val === 't' || val === 1 || val === '1' || val === 'yes';
};

const People = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [users, setUsers] = useState<{id: string, full_name: string, role: string}[]>([]);
  const [selectedLeadForAssignment, setSelectedLeadForAssignment] = useState<Lead | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Email", value: "email" },
    { label: "Company", value: "company_name" },
    { label: "Status", value: "stage" },
    { label: "Priority", value: "priority" },
  ];

  // Status filter options
  const statusOptions = [
    { label: "All Stages", value: "all" },
    { label: "New Lead", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Qualified", value: "qualified" },
    { label: "Unqualified", value: "unqualified" },
    { label: "Meeting Scheduled", value: "meeting_scheduled" },
    { label: "Proposal Sent", value: "proposal_sent" },
    { label: "Negotiation", value: "negotiation" },
    { label: "Closed Won", value: "closed_won" },
    { label: "Closed Lost", value: "closed_lost" },
  ];

  // Calculate stats for stats cards (match current enum values)
  const peopleStats = useMemo(() => {
    let newLeads = 0;
    let contactedLeads = 0; // aggregate of connected/messaged/replied
    let meetingScheduledLeads = 0; // meeting_booked
    let closedWonLeads = 0; // use meeting_held as "won"
    let closedLostLeads = 0; // lead_lost

    leads.forEach(lead => {
      switch (lead.stage) {
        case 'new':
          newLeads++;
          break;
        case 'connected':
        case 'messaged':
        case 'replied':
          contactedLeads++;
          break;
        case 'meeting_booked':
          meetingScheduledLeads++;
          break;
        case 'meeting_held':
          closedWonLeads++;
          break;
        case 'lead_lost':
        case 'disqualified':
          closedLostLeads++;
          break;
        default:
          break;
      }
    });

    return {
      totalPeople: leads.length,
      newLeads,
      contactedLeads,
      meetingScheduledLeads,
      closedWonLeads,
      closedLostLeads
    };
  }, [leads]);

  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    // Filter by search term, status, favorites, and tab/user selection
    const filtered = leads.filter(lead => {
      // Search filter
      const matchesSearch = !searchTerm || (() => {
        const searchLower = searchTerm.toLowerCase();
        return (
          lead.name?.toLowerCase().includes(searchLower) ||
          lead.email_address?.toLowerCase().includes(searchLower) ||
          lead.company_name?.toLowerCase().includes(searchLower)
        );
      })();

      // Status filter
      const matchesStatus = statusFilter === "all" || lead.stage === statusFilter;

      // Favorites filter
      const isFavorite = toBoolean(lead.favourite) || toBoolean(lead.is_favourite);
      const matchesFavorites = !showFavoritesOnly || isFavorite;
      
      // User filter
      const matchesUser = selectedUser === 'all' || lead.owner_id === selectedUser;

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
        case "first_name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "last_name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email_address?.toLowerCase() || "";
          bValue = b.email_address?.toLowerCase() || "";
          break;
        case "company_name":
          aValue = a.company_name?.toLowerCase() || "";
          bValue = b.company_name?.toLowerCase() || "";
          break;
      case "stage":
          aValue = a.stage?.toLowerCase() || "";
          bValue = b.stage?.toLowerCase() || "";
          break;
        // no priority on people; fall back to lead_score
        case "priority":
          aValue = parseFloat(a.lead_score || '0');
          bValue = parseFloat(b.lead_score || '0');
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
  }, [leads, searchTerm, sortBy, sortOrder, statusFilter, showFavoritesOnly, selectedUser]);

  const fetchLeads = async (forceRefresh = false) => {
    // Debounce rapid calls - only fetch if it's been more than 2 seconds since last fetch
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime < 2000) {
      console.log('🚫 Debouncing fetchLeads - too soon since last fetch');
      return;
    }
    
    const startTime = performance.now();
    try {
      setLoading(true);
      setLastFetchTime(now);
      
      // Fetch all people with company information - optimized selection
      const { data: allLeads, error: allError } = await supabase
        .from("people")
        .select(`
          id, name, email_address, company_id, company_role, lead_score, stage, 
          connected_at, last_reply_at, last_interaction_at, owner_id, created_at, 
          confidence_level, is_favourite, favourite, lead_source, linkedin_url, 
          employee_location,
          company_name:companies(name),
          company_logo_url:companies(website)
        `)
        .order("created_at", { ascending: false });
      
      if (allError) {
        console.error('Error fetching leads:', allError);
        throw allError;
      }
      
      console.log('Total leads fetched:', allLeads?.length);

      // Normalize nested objects returned by Supabase (aliases like company_name:companies(name))
      const normalizedLeads = (allLeads || []).map((lead: any) => {
        const companyName = typeof lead.company_name === 'object' && lead.company_name !== null
          ? lead.company_name.name
          : lead.company_name;
        const companyLogoUrl = typeof lead.company_logo_url === 'object' && lead.company_logo_url !== null
          ? lead.company_logo_url.website
          : lead.company_logo_url;
        return {
          ...lead,
          company_name: companyName ?? null,
          company_logo_url: companyLogoUrl ?? null,
        } as Lead;
      });

      setLeads(normalizedLeads);
      
      const endTime = performance.now();
      console.log(`⚡ People fetch completed in ${Math.round(endTime - startTime)}ms`);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
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
    // Fetch both leads and users in parallel for faster loading
    Promise.all([fetchLeads(true), fetchUsers()]); // Force initial fetch
  }, []);

  // ModernDataTable columns expect (value, row)
  const columns = [
    {
      key: "status",
      label: "Status",
      width: "120px",
      minWidth: "120px",
      align: "center" as const,
      render: (v: any) => (
        <div className="border justify-center items-center flex mx-auto bg-blue-50 text-blue-700 border-blue-200 h-8 text-xs font-medium rounded-full text-center px-3 min-w-[80px]">
          {v === 'new' ? 'New' :
           v === 'connection_requested' ? 'Connection Requested' :
           v === 'connected' ? 'Connected' :
           v === 'messaged' ? 'Messaged' :
           v === 'replied' ? 'Replied' :
           v === 'meeting_booked' ? 'Meeting Booked' :
           v === 'meeting_held' ? 'Meeting Held' :
           v === 'disqualified' ? 'Disqualified' :
           v === 'in queue' ? 'In Queue' :
           v === 'lead_lost' ? 'Lead Lost' :
           'New'}
        </div>
      ),
    },
    {
      key: "favorite",
      label: "",
      render: (_: any, row: any) => (
        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteToggle
            entityId={row.id}
            entityType="lead"
            isFavorite={toBoolean(row.favourite) || toBoolean(row.is_favourite)}
            onToggle={(isFavorite) => {
              setLeads(prev => prev.map(l => l.id === row.id 
                ? { 
                    ...l, 
                    favourite: isFavorite,
                    is_favourite: isFavorite ? 'true' : 'false'
                  } 
                : l));
            }}
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "person",
      label: "Person",
      width: "300px",
      minWidth: "300px",
      align: "left" as const,
      render: (_: any, row: any) => (
        <div className="min-w-0">
          <div className="text-sm font-medium leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            {row.name || "-"}
          </div>
        </div>
      ),
    },
    { 
      key: "company_name", 
      label: "Company",
      width: "250px",
      minWidth: "250px",
      align: "left" as const,
      render: (v: any, row: any) => (
        <div className="min-w-0 cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors duration-150">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              {row.company_logo_url ? (
                <img 
                  src={getClearbitLogo(row.company_name || "", row.company_logo_url)} 
                  alt={row.company_name}
                  className="w-6 h-6 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white items-center justify-center text-xs font-semibold hidden">
                {row.company_name ? row.company_name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="text-sm leading-tight hover:text-blue-600 transition-colors duration-150 whitespace-nowrap overflow-hidden text-ellipsis">
                {row.company_name || "-"}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    { 
      key: "company_role", 
      label: "Role",
      width: "200px",
      minWidth: "200px",
      align: "left" as const,
      render: (v: any) => (
        <div className="min-w-0">
          <div className="text-sm text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            {v || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "owner_display",
      label: "Assigned To",
      render: (_: any, row: any) => (
        <div 
          className="cursor-pointer hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors duration-150"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLeadForAssignment(row as Lead);
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
      key: "priority",
      label: "Priority",
      width: "120px",
      minWidth: "120px",
      align: "center" as const,
      render: (v: any) => (
        <div className="border justify-center items-center flex mx-auto bg-orange-50 text-orange-700 border-orange-200 h-8 text-xs font-medium rounded-full text-center px-3 min-w-[80px]">
          {v || "Medium"}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      width: "120px",
      minWidth: "120px",
      align: "center" as const,
      render: (v: any) => (
        <span className="text-sm text-gray-500">
          {v ? new Date(v).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "120px",
      minWidth: "120px",
      align: "center" as const,
      render: (_: any, row: any) => (
        <div className="flex items-center justify-center gap-1">
          <FavoriteToggle
            entityId={row.id}
            entityType="lead"
            isFavorite={toBoolean(row.favourite) || toBoolean(row.is_favourite)}
            onToggle={(isFavorite) => {
              setLeads(prev => prev.map(l => l.id === row.id 
                ? { 
                    ...l, 
                    favourite: isFavorite,
                    is_favourite: isFavorite ? 'true' : 'false'
                  } 
                : l));
            }}
            size="sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLeadForAssignment(row as Lead);
              setIsAssignmentModalOpen(true);
            }}
            className="h-8 w-8 p-0"
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const tableData = useMemo(() => filteredAndSortedLeads.map((lead) => ({
    id: lead.id,
    person: lead.name,
    name: lead.name,
    email_address: lead.email_address,
    company_name: lead.company_name || '-',
    company_logo_url: lead.company_logo_url || null,
    company_role: lead.company_role || '-',
    owner_id: lead.owner_id,
    confidence_level: lead.confidence_level || 'medium',
    priority: lead.confidence_level || 'medium',
    created_at: lead.created_at,
    favourite: lead.favourite,
    is_favourite: lead.is_favourite,
    linkedin_url: lead.linkedin_url,
    stage: lead.stage,
    status: lead.stage,
  })), [filteredAndSortedLeads]);

  const handleRowClick = (lead: Lead) => {
    console.log('🔍 Lead clicked:', lead.name, lead.id);
    console.log('🔍 openPopup function:', openPopup);
    openPopup('lead', lead.id, lead.name || 'Unknown');
    console.log('🔍 openPopup called');
  };

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (!confirm(`Are you sure you want to delete "${leadName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `"${leadName}" has been deleted.`,
      });

      // Refresh the leads list
      fetchLeads();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete lead: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Stats for People page
  const stats: StatItemProps[] = [
    {
      icon: Users,
      value: peopleStats.totalPeople,
      label: "people"
    },
    {
      icon: Zap,
      value: peopleStats.contactedLeads,
      label: "contacted"
    },
    {
      icon: Target,
      value: peopleStats.newLeads,
      label: "new leads"
    },
    {
      icon: CheckCircle,
      value: peopleStats.meetingScheduledLeads,
      label: "meetings scheduled"
    }
  ];

  return (
    <Page
      stats={stats}
      hideHeader
    >
      {/* Search, Filter and Sort Controls */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-48 text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <DropdownSelect
            options={statusOptions}
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
            placeholder="All Statuses"
            className="min-w-32 bg-white h-9"
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
            className="min-w-40 bg-white h-9"
          />

          {/* Favorites Filter */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border h-9",
              showFavoritesOnly 
                ? "bg-primary-50 text-primary-700 border-primary-200" 
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            )}
          >
            <Star className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
            Favorites
            {leads.filter(lead => lead.is_favourite).length > 0 && (
              <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {leads.filter(lead => lead.is_favourite).length}
              </span>
            )}
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <DropdownSelect
            options={sortOptions}
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
            placeholder="Sort by"
            className="min-w-32 bg-white"
          />
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

        <ModernDataTable 
          data={tableData} 
          columns={columns as any} 
          loading={loading} 
          onRowClick={(row) => handleRowClick(row as Lead)}
        />

      {/* Person Detail Modal - Now handled by UnifiedPopup */}

      {/* Assignment Modal */}
      {selectedLeadForAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Assign Person</h3>
            <p className="text-sm text-gray-600 mb-4">
              Assign "{selectedLeadForAssignment.name}" to a user
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
                  value={selectedLeadForAssignment.owner_id}
                  onValueChange={(value) => {
                    setSelectedLeadForAssignment(prev => 
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
                    setSelectedLeadForAssignment(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isSavingAssignment}
                  onClick={async () => {
                    if (!selectedLeadForAssignment) return;
                    
                    setIsSavingAssignment(true);
                    try {
                      const { data, error } = await supabase
                        .from('people')
                        .update({ owner_id: selectedLeadForAssignment.owner_id })
                        .eq('id', selectedLeadForAssignment.id)
                        .select();

                      if (error) throw error;

                      // Update local state
                      setLeads(prev => 
                        prev.map(lead => 
                          lead.id === selectedLeadForAssignment.id 
                            ? { ...lead, owner_id: selectedLeadForAssignment.owner_id }
                            : lead
                        )
                      );

                      toast({
                        title: "Success",
                        description: `Person assigned successfully`,
                      });

                      setIsAssignmentModalOpen(false);
                      setSelectedLeadForAssignment(null);
                    } catch (error) {
                      console.error('Error assigning person:', error);
                      toast({
                        title: "Error",
                        description: "Failed to assign person",
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

export default People;