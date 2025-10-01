import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components";
import { StatusBadge } from "@/components/StatusBadge";
import { PeopleStatsCards } from "@/components/StatsCards";
import { FavoriteToggle } from "@/components/FavoriteToggle";
import { OwnerDisplay } from "@/components/OwnerDisplay";
import { useToast } from "@/hooks/use-toast";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Search, ArrowUpDown, Users, UserPlus, MessageSquare, CheckCircle, Calendar, Star } from "lucide-react";
import { getProfileImage } from '@/utils/linkedinProfileUtils';
import { getClearbitLogo } from "@/utils/logoService";
import { Page } from "@/design-system/components";
import { cn } from "@/lib/utils";

import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"people"> & {
  company_name?: string | null;
  company_logo_url?: string | null;
};

interface Company {
  id: string;
  name: string;
}

const formatLeadLocation = (location?: string | null): string => {
  if (!location) {
    return "-";
  }

  const parts = location
    .split(",")
    .map(part => part.trim())
    .filter(part => part.length > 0 && part.toLowerCase() !== "australia");

  if (parts.length === 0) {
    return "-";
  }

  return parts.join(", ");
};

const People = () => {
  const [leads, setLeads] = useState<Tables<"people">[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const { openPopup } = usePopupNavigation();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { toast } = useToast();

  // Sort options
  const sortOptions = [
    { label: "Created Date", value: "created_at" },
    { label: "Name", value: "name" },
    { label: "Email", value: "email_address" },
    { label: "Location", value: "employee_location" },
    { label: "Status", value: "stage" },
    { label: "Score", value: "lead_score" },
    { label: "Last Contact", value: "last_interaction_at" },
  ];

  // Status filter options
  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "New Prospect", value: "new" },
    { label: "Researching", value: "in queue" },
    { label: "Initial Outreach", value: "connection_requested" },
    { label: "Connected", value: "connected" },
    { label: "Follow-up Sent", value: "messaged" },
    { label: "Responded", value: "replied" },
    { label: "Lost Opportunity", value: "lead_lost" },
  ];

  // Calculate stats for stats cards
  const peopleStats = useMemo(() => {
    let newPeople = 0;
    let connectedPeople = 0;
    let messagedPeople = 0;
    let repliedPeople = 0;
    let meetingBookedLeads = 0;
    let qualifiedLeads = 0;
    
    leads.forEach(lead => {
      switch (lead.stage) {
        case 'new':
          newPeople++;
          break;
        case 'connected':
          connectedPeople++;
          break;
        case 'messaged':
          messagedPeople++;
          break;
        case 'replied':
          repliedPeople++;
          break;
        case 'meeting_booked':
          meetingBookedLeads++;
          break;
        case 'meeting_held':
          qualifiedLeads++;
          break;
      }
    });
    
    return {
      totalPeople: leads.length,
      newPeople,
      connectedPeople,
      messagedPeople,
      repliedPeople,
      meetingBookedLeads,
      qualifiedLeads
    };
  }, [leads]);


  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    // Filter by search term, status, and favorites
    const filtered = leads.filter(lead => {
      // Search filter
      const matchesSearch = !searchTerm || (() => {
        const searchLower = searchTerm.toLowerCase();
        return (
          lead.name?.toLowerCase().includes(searchLower) ||
          lead.email_address?.toLowerCase().includes(searchLower) ||
          lead.company_role?.toLowerCase().includes(searchLower) ||
          lead.employee_location?.toLowerCase().includes(searchLower)
        );
      })();

      // Status filter
      const matchesStatus = statusFilter === "all" || lead.stage === statusFilter;

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || lead.is_favourite;

      return matchesSearch && matchesStatus && matchesFavorites;
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
        case "email_address":
          aValue = a.email_address?.toLowerCase() || "";
          bValue = b.email_address?.toLowerCase() || "";
          break;
        case "employee_location":
          aValue = a.employee_location?.toLowerCase() || "";
          bValue = b.employee_location?.toLowerCase() || "";
          break;
        case "stage":
          aValue = a.stage?.toLowerCase() || "";
          bValue = b.stage?.toLowerCase() || "";
          break;
        case "lead_score":
          aValue = parseInt(a.lead_score || "0");
          bValue = parseInt(b.lead_score || "0");
          break;
        case "last_interaction_at":
          aValue = new Date(a.last_interaction_at || 0).getTime();
          bValue = new Date(b.last_interaction_at || 0).getTime();
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
  }, [leads, searchTerm, sortBy, sortOrder, statusFilter]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("people")
        .select(`
          id,
          name,
          company_id,
          email_address,
          employee_location, 
          company_role,
          stage,
          lead_score,
          linkedin_url,
          owner_id,
          created_at,
          confidence_level,
          email_draft,
          connection_request_date,
          connection_accepted_date,
          message_sent_date,
          response_date,
          meeting_booked,
          meeting_date,
          email_sent_date,
          email_reply_date,
          stage_updated,
          is_favourite,
          jobs,
          last_interaction_at,
          connected_at,
          last_reply_at,
          favourite,
          companies(name, logo_url, website)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform data to include company information
      const transformedData = data?.map((lead: any) => ({
        ...lead,
        company_name: lead.companies?.name || null,
        company_logo_url: lead.companies?.website ? `https://logo.clearbit.com/${lead.companies.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}` : null
      })) || [];
      
      setLeads(transformedData as Lead[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const columns = [
    {
      key: "stage",
      label: "Status",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "140px",
      render: (lead: Lead) => (
        <StatusBadge
          status={lead.stage || "new"}
          size="sm"
        />
      ),
    },
    {
      key: "favorite",
      label: "",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "60px",
      render: (lead: Lead) => (
        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteToggle
            entityId={lead.id}
            entityType="lead"
            isFavorite={lead.is_favourite || false}
            onToggle={(isFavorite) => {
              setLeads(prev => prev.map(l => 
                l.id === lead.id ? { ...l, is_favourite: isFavorite } : l
              ));
            }}
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "owner",
      label: "Assigned To",
      width: "180px",
      render: (lead: Lead) => (
        <OwnerDisplay 
          ownerId={lead.owner_id} 
          size="sm" 
          showName={true}
          showRole={false}
        />
      ),
    },
    {
      key: "name",
      label: "Lead",
      width: "320px",
      render: (lead: Lead) => {
        const { avatarUrl, initials } = getProfileImage(lead.name, 32);
        
        return (
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
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
                  className="w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-sm font-semibold"
                  style={{ display: 'none' }}
                >
                  {initials}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium break-words leading-tight">{lead.name || "-"}</div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "company_role",
      label: "Role",
      width: "260px",
      render: (lead: Lead) => (
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {lead.company_role || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "company_name",
      label: "Company",
      width: "280px",
      render: (lead: Lead) => (
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {lead.company_logo_url ? (
                <img 
                  src={lead.company_logo_url} 
                  alt={lead.company_name || 'Company'}
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
                className="w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-sm font-semibold"
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
      width: "220px",
      render: (lead: Lead) => (
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground break-words leading-tight">
            {formatLeadLocation(lead.employee_location)}
          </div>
        </div>
      ),
    },
    {
      key: "lead_score",
      label: "AI Score",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "120px",
      render: (lead: Lead) => (
        <div className="flex items-center justify-center">
          <StatusBadge 
            status={lead.lead_score || "Medium"} 
            size="sm" 
          />
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Added",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "120px",
      render: (lead: Lead) => {
        if (!lead.created_at) return <span className="text-sm">-</span>;
        
        try {
          const date = new Date(lead.created_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                {diffDays === 1 ? '1 day ago' : `${diffDays} days ago`}
              </div>
            </div>
          );
        } catch {
          return <span className="text-sm">-</span>;
        }
      },
    },
    {
      key: "last_interaction_at",
      label: "Last Contact",
      headerAlign: "center" as const,
      cellAlign: "center" as const,
      width: "140px",
      render: (lead: Lead) => {
        if (!lead.last_interaction_at) return <span className="text-sm">-</span>;
        
        try {
          const date = new Date(lead.last_interaction_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                {diffDays === 1 ? '1 day ago' : `${diffDays} days ago`}
              </div>
            </div>
          );
        } catch {
          return <span className="text-sm">-</span>;
        }
      },
    },
  ];

  const handleRowClick = (lead: Lead) => {
    console.log('🔍 Lead clicked:', lead.name, lead.id);
    console.log('🔍 openPopup function:', openPopup);
    openPopup('lead', lead.id, lead.name);
    console.log('🔍 openPopup called');
  };

  const handleAssignmentChange = () => {
    // Refresh the leads list when assignment changes
    fetchLeads();
  };

  return (
    <Page
      title="People"
      subtitle="Manage your recruitment people and their stages"
    >

        {/* Search, Filter and Sort Controls */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm w-64 bg-background"
              />
            </div>
            
            {/* Status Filter */}
            <DropdownSelect
              options={statusOptions}
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
              placeholder="All Statuses"
              className="min-w-32 bg-background"
            />

            {/* Favorites Filter */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                showFavoritesOnly 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "bg-white text-muted-foreground hover:text-foreground border border-border"
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
          
          {/* Sort Controls - Far Right */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort:</span>
            <DropdownSelect
              options={sortOptions}
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
              placeholder="Select sort"
              className="min-w-32 bg-background"
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
          data={filteredAndSortedLeads}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          pagination={{
            enabled: true,
            pageSize: 25,
            pageSizeOptions: [10, 25, 50, 100],
            showPageSizeSelector: true,
            showItemCount: true,
          }}
        />
      
      {/* Lead Detail Modal - Now handled by UnifiedPopup */}
    </Page>
  );
};

export default People;