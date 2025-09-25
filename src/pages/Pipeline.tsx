import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailPopup } from "@/components/LeadDetailPopup";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Building2, Mail, MapPin, Star, TrendingUp, Eye, ChevronDown, MoreVertical, Target, MessageCircle, Users2, ArrowUpDown, Trash2 } from "lucide-react";
import { getProfileImage } from '@/utils/linkedinProfileUtils';

interface Lead {
  id: string;
  name: string | null;
  company_id: string | null;
  company_name: string | null;
  company_logo_url: string | null;
  email_address: string | null;
  employee_location: string | null;
  company_role: string | null;
  stage: string | null;
  lead_score: string | null;
  linkedin_url: string | null;
  owner_id: string | null;
  created_at: string | null;
  confidence_level: string | null;
  email_draft: string | null;
  connection_request_date: string | null;
  connection_accepted_date: string | null;
  message_sent_date: string | null;
  response_date: string | null;
  meeting_booked: string | null;
  meeting_date: string | null;
  email_sent_date: string | null;
  email_reply_date: string | null;
  stage_updated: string | null;
  is_favourite: string | null;
  jobs: string | null;
}

// Sales pipeline stages - Based on actual database stages
const RECRUITING_STAGES = [
  { key: 'new', label: 'New Leads' },
  { key: 'in queue', label: 'In Queue' }, 
  { key: 'connection_requested', label: 'Connection Requested' },
  { key: 'messaged', label: 'Messaged' },
  { key: 'connected', label: 'Connected' },
  { key: 'replied', label: 'Replied' },
  { key: 'lead_lost', label: 'Lost' }
];

// Remove color gradients - use clean design

const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [availableStages, setAvailableStages] = useState<string[]>(RECRUITING_STAGES.map(s => s.key));
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  // Sort options
  const sortOptions = [
    { label: "Created Date", value: "created_at" },
    { label: "Name", value: "name" },
    { label: "Company", value: "company_name" },
    { label: "Stage", value: "stage" },
    { label: "Score", value: "lead_score" },
    { label: "Location", value: "employee_location" },
    { label: "Role", value: "company_role" },
  ];

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("people")
        .select(`
          id,
          name,
          company_id,
          companies!inner(name, profile_image_url),
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
          jobs
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform data to include company name and logo
      const transformedData = data?.map(lead => ({
        ...lead,
        company_name: lead.companies?.name || null,
        company_logo_url: lead.companies?.profile_image_url || null
      })) || [];
      
      console.log("Fetched leads:", transformedData);
      setLeads(transformedData);
    } catch (error) {
      console.error("Error fetching leads:", error);
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

  const updateLeadStage = async (leadId: string, newStage: string) => {
    try {
      const { error } = await supabase
        .from("people")
        .update({ 
          stage: newStage as any
        })
        .eq("id", leadId);

      if (error) throw error;

      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { ...lead, stage: newStage }
            : lead
        )
      );

      toast({
        title: "Success",
        description: "Lead stage updated successfully",
      });
    } catch (error) {
      console.error("Error updating lead stage:", error);
      toast({
        title: "Error", 
        description: "Failed to update lead stage",
        variant: "destructive",
      });
    }
  };

  // Sort leads function
  const sortLeads = (leads: Lead[]) => {
    return leads.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name || "";
          bValue = b.name || "";
          break;
        case "company_name":
          aValue = a.company_name || "";
          bValue = b.company_name || "";
          break;
        case "stage":
          aValue = a.stage || "";
          bValue = b.stage || "";
          break;
        case "lead_score":
          aValue = a.lead_score || "";
          bValue = b.lead_score || "";
          break;
        case "employee_location":
          aValue = a.employee_location || "";
          bValue = b.employee_location || "";
          break;
        case "company_role":
          aValue = a.company_role || "";
          bValue = b.company_role || "";
          break;
        case "created_at":
        default:
          aValue = new Date(a.created_at || "");
          bValue = new Date(b.created_at || "");
          break;
      }

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        if (sortOrder === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }

      // Handle date/number comparison
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  const groupedLeads = availableStages.reduce((acc, stage) => {
    const stageLeads = leads.filter(lead => {
      const leadStage = lead.stage || 'new';
      return leadStage === stage;
    });
    
    // Sort the leads within this stage
    const sortedStageLeads = sortLeads(stageLeads);
    acc[stage] = sortedStageLeads;
    console.log(`Stage ${stage}:`, sortedStageLeads.length, "leads");
    return acc;
  }, {} as Record<string, Lead[]>);

  // Debug: Log total leads and stage distribution
  console.log("Total leads:", leads.length);
  console.log("Available stages:", availableStages);
  console.log("Grouped leads:", Object.keys(groupedLeads).map(stage => `${stage}: ${groupedLeads[stage].length}`));

  // If no leads have stages, put them all in 'new' stage
  const totalLeadsInStages = Object.values(groupedLeads).flat().length;
  if (totalLeadsInStages === 0 && leads.length > 0) {
    groupedLeads['new'] = leads;
    console.log("No staged leads found, putting all in 'new' stage:", leads.length);
  }

  const getRecruitingStats = () => {
    const activeLeads = leads.filter(lead => !['lead_lost'].includes(lead.stage || ''));
    const connectedLeads = leads.filter(lead => ['connected', 'replied'].includes(lead.stage || ''));
    const totalCompanies = new Set(leads.map(lead => lead.company_id).filter(Boolean)).size;
    
    return { 
      activeLeads: activeLeads.length, 
      connectedLeads: connectedLeads.length, 
      totalCompanies 
    };
  };

  const { activeLeads, connectedLeads, totalCompanies } = getRecruitingStats();

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleDeleteLead = async (leadId: string, leadName: string | null) => {
    if (!confirm(`Are you sure you want to delete the lead "${leadName || 'Unknown'}"? This action cannot be undone.`)) {
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
        description: `Lead "${leadName || 'Unknown'}" has been deleted.`,
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">Pipeline</h1>
            <p className="text-muted-foreground">Track your sales pipeline by stage</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats in Top Right */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-base font-semibold tracking-tight">Sales Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track leads through your recruiting stages
          </p>
        </div>
        
        {/* Stats Cards - Top Right */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">{activeLeads}</span>
              <span className="text-sm text-gray-600">Active Leads</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">{connectedLeads}</span>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">{totalCompanies}</span>
              <span className="text-sm text-gray-600">Companies</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sort Controls Row */}
      <div className="flex items-center justify-end mb-6">
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
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
      
      {/* Kanban Board - Consistent styling */}
      <div className="w-full">
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {availableStages.map(stage => {
              const stageLeads = groupedLeads[stage] || [];
              const stageInfo = RECRUITING_STAGES.find(s => s.key === stage);
              const stageLabel = stageInfo?.label || stage;
              
              return (
                <div key={stage} className="w-72 bg-gray-50 rounded-lg p-3 flex-shrink-0">
                  {/* Stage Header - Consistent with other pages */}
                  <div className="flex items-center justify-between mb-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900">{stageLabel}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                      {stageLeads.length}
                    </span>
                  </div>
                  
                  {/* Enhanced Leads Container */}
                  <div className="space-y-3">
                    {stageLeads.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No leads in this stage</p>
                      </div>
                    ) : (
                      stageLeads.map(lead => (
                        <div 
                          key={lead.id} 
                          className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                          onClick={() => handleLeadClick(lead)}
                        >
                          {/* Header with Status and Score */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {/* Priority Status Indicator */}
                              {lead.meeting_booked === "true" ? (
                                <div className="w-2 h-2 bg-green-500 rounded-full" title="Meeting Booked"></div>
                              ) : lead.response_date ? (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" title="Replied"></div>
                              ) : lead.confidence_level === 'high' ? (
                                <div className="w-2 h-2 bg-yellow-500 rounded-full" title="High Priority"></div>
                              ) : lead.confidence_level === 'low' ? (
                                <div className="w-2 h-2 bg-red-500 rounded-full" title="Low Priority"></div>
                              ) : (
                                <div className="w-2 h-2 bg-gray-300 rounded-full" title="Standard"></div>
                              )}
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {stageLabel}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {lead.lead_score && (
                                <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                                  {lead.lead_score}
                                </div>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLead(lead.id, lead.name);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Lead Info with Profile Image */}
                          <div className="flex items-center gap-3 mb-2">
                            {(() => {
                              const { avatarUrl, initials } = getProfileImage(lead.name, 32);
                              return (
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
                                    className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold"
                                    style={{ display: 'none' }}
                                  >
                                    {initials}
                                  </div>
                                </div>
                              );
                            })()}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-gray-900 truncate">
                                {lead.name}
                              </div>
                            </div>
                          </div>
                          
                          {/* Company - Secondary */}
                          {lead.company_name && (
                            <div className="text-sm text-gray-600 mb-1 truncate">
                              {lead.company_name}
                            </div>
                          )}
                          
                          {/* Role - Tertiary */}
                          {lead.company_role && (
                            <div className="text-xs text-gray-500 mb-2 truncate">
                              {lead.company_role}
                            </div>
                          )}

                          {/* Footer with Location and Owner */}
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                            {lead.employee_location && (
                              <div className="text-xs text-gray-500 truncate max-w-20">
                                {lead.employee_location}
                              </div>
                            )}
                            {lead.owner_id && (
                              <div className="text-xs text-gray-400 truncate max-w-20">
                                {lead.owner_id}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <LeadDetailPopup
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
};

export default Pipeline;