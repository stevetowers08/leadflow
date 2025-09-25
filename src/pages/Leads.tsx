import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailPopup } from "@/components/LeadDetailPopup";
import { LeadsStatsCards } from "@/components/StatsCards";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Search, ArrowUpDown } from "lucide-react";
import { getProfileImage } from '@/utils/linkedinProfileUtils';

import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"people"> & {
  company_name?: string | null;
  company_logo_url?: string | null;
};

interface Company {
  id: string;
  name: string;
}

const Leads = () => {
  const [leads, setLeads] = useState<Tables<"people">[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  // Sort options
  const sortOptions = [
    { label: "Created Date", value: "created_at" },
    { label: "Name", value: "name" },
    { label: "Email", value: "email_address" },
    { label: "Location", value: "employee_location" },
    { label: "Stage", value: "stage" },
    { label: "Score", value: "lead_score" },
    { label: "Last Contact", value: "last_interaction_at" },
  ];

  // Status filter options
  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "New", value: "new" },
    { label: "In Queue", value: "in queue" },
    { label: "Connect Sent", value: "connection_requested" },
    { label: "Connected", value: "connected" },
    { label: "Messaged", value: "messaged" },
    { label: "Replied", value: "replied" },
    { label: "Lead Lost", value: "lead_lost" },
  ];

  // Calculate stats for stats cards
  const leadsStats = useMemo(() => {
    let newLeads = 0;
    let connectedLeads = 0;
    let messagedLeads = 0;
    let repliedLeads = 0;
    let meetingBookedLeads = 0;
    let qualifiedLeads = 0;
    
    leads.forEach(lead => {
      switch (lead.stage) {
        case 'new':
          newLeads++;
          break;
        case 'connected':
          connectedLeads++;
          break;
        case 'messaged':
          messagedLeads++;
          break;
        case 'replied':
          repliedLeads++;
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
      totalLeads: leads.length,
      newLeads,
      connectedLeads,
      messagedLeads,
      repliedLeads,
      meetingBookedLeads,
      qualifiedLeads
    };
  }, [leads]);

  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    // Filter by search term and status
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

      return matchesSearch && matchesStatus;
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
          companies!inner(name, profile_image_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform data to include company information
      const transformedData = data?.map((lead: any) => ({
        ...lead,
        company_name: lead.companies?.name || null,
        company_logo_url: lead.companies?.profile_image_url || null
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
      key: "name",
      label: "Lead",
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
      key: "email_address",
      label: "Email",
      render: (lead: Lead) => (
        <div className="min-w-0 max-w-64">
          <div className="text-xs text-muted-foreground break-words leading-tight">
            {lead.email_address || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "employee_location",
      label: "Location",
      render: (lead: Lead) => (
        <div className="min-w-0 max-w-48">
          <div className="text-xs text-muted-foreground break-words leading-tight">
            {lead.employee_location || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "linkedin_url",
      label: "LinkedIn",
      render: (lead: Lead) => (
        <div className="min-w-0 max-w-40">
          {lead.linkedin_url ? (
            <a 
              href={lead.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 break-words leading-tight"
            >
              View Profile
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: "stage",
      label: "Stage",
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
  ];

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Leads</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your recruitment leads and their stages
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <LeadsStatsCards 
          totalLeads={leadsStats.totalLeads}
          newLeads={leadsStats.newLeads}
          connectedLeads={leadsStats.connectedLeads}
          messagedLeads={leadsStats.messagedLeads}
          repliedLeads={leadsStats.repliedLeads}
          meetingBookedLeads={leadsStats.meetingBookedLeads}
          qualifiedLeads={leadsStats.qualifiedLeads}
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
      </div>
      
      <LeadDetailPopup
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLead(null);
        }}
      />
    </>
  );
};

export default Leads;