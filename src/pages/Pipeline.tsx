import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { usePopup } from "@/contexts/PopupContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Building2, Mail, MapPin, Star, TrendingUp, Eye, ChevronDown, MoreVertical, Target, MessageCircle, Users2, ArrowUpDown, Trash2, Users, CheckCircle } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getProfileImage } from '@/utils/linkedinProfileUtils';
import { getLabel } from '@/utils/labels';
import { getCompanyLogoUrlSync } from '@/utils/logoService';

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

const Pipeline = React.memo(() => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [availableStages, setAvailableStages] = useState<string[]>(RECRUITING_STAGES.map(s => s.key));
  const [loading, setLoading] = useState(true);
  const { openLeadPopup } = usePopup();
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  // Set page meta tags
  usePageMeta({
    title: 'Pipeline - Empowr CRM',
    description: 'Visualize and manage your recruitment pipeline with kanban-style boards. Track candidate progress through different stages of the hiring process.',
    keywords: 'pipeline, recruitment, kanban, candidate tracking, hiring process, stages, CRM',
    ogTitle: 'Pipeline - Empowr CRM',
    ogDescription: 'Visualize and manage your recruitment pipeline with kanban-style boards.',
    twitterTitle: 'Pipeline - Empowr CRM',
    twitterDescription: 'Visualize and manage your recruitment pipeline with kanban-style boards.'
  });

  // Sort options
  const sortOptions = [
    { label: "Created Date", value: "created_at" },
    { label: "Name", value: "name" },
    { label: "Company", value: "company_name" },
    { label: "Stage", value: "stage" },
    { label: getLabel('sort', 'ai_score'), value: "lead_score" },
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
          companies!inner(name, website, logo_url, logo_cached_at),
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
        company_logo_url: getCompanyLogoUrlSync(
          lead.companies?.name || '', 
          lead.companies?.website,
          lead.companies?.logo_url
        )
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

  // Memoized sort leads function
  const sortLeads = useCallback((leads: Lead[]) => {
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
  }, [sortBy, sortOrder]);

  // Memoized grouped leads calculation
  const groupedLeads = useMemo(() => {
    return availableStages.reduce((acc, stage) => {
      const stageLeads = leads.filter(lead => {
        const leadStage = lead.stage || 'new';
        return leadStage === stage;
      });
      
      // Sort the leads within this stage
      const sortedStageLeads = sortLeads(stageLeads);
      acc[stage] = sortedStageLeads;
      return acc;
    }, {} as Record<string, Lead[]>);
  }, [leads, availableStages, sortLeads]);

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

  // Memoized stats calculation
  const { activeLeads, connectedLeads, totalCompanies } = useMemo(() => {
    const activeLeads = leads.filter(lead => !['lead_lost'].includes(lead.stage || ''));
    const connectedLeads = leads.filter(lead => ['connected', 'replied'].includes(lead.stage || ''));
    const totalCompanies = new Set(leads.map(lead => lead.company_id).filter(Boolean)).size;
    
    return { activeLeads: activeLeads.length, connectedLeads: connectedLeads.length, totalCompanies };
  }, [leads]);

  const handleLeadClick = useCallback((lead: Lead) => {
    openLeadPopup(lead.id);
  }, [openLeadPopup]);

  const handleDeleteLead = useCallback(async (leadId: string, leadName: string | null) => {
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
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Pipeline</h1>
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
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Sales Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track leads through your recruiting stages
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="text-muted-foreground">
            <Users className="h-4 w-4" />
          </div>
          <span className="font-medium">{activeLeads} active leads</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
          </div>
          <span className="font-medium">{connectedLeads} connected</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="text-muted-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-medium">{totalCompanies} companies</span>
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
            className="px-2 py-1 text-sm border rounded hover:bg-muted hover:border-border transition-colors"
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
                <div key={stage} className="w-72 bg-muted rounded-lg p-3 flex-shrink-0">
                  {/* Stage Header - Consistent with other pages */}
                  <div className="flex items-center justify-between mb-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-foreground">{stageLabel}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full font-medium">
                      {stageLeads.length}
                    </span>
                  </div>
                  
                  {/* Enhanced Leads Container */}
                  <div className="space-y-3">
                    {stageLeads.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
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
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {stageLabel}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {lead.lead_score && (
                                <div className="text-sm font-semibold text-foreground bg-muted px-3 py-2 rounded-md">
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
                                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold"
                                    style={{ display: 'none' }}
                                  >
                                    {initials}
                                  </div>
                                </div>
                              );
                            })()}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-foreground truncate">
                                {lead.name}
                              </div>
                            </div>
                          </div>
                          
                          {/* Company - Secondary */}
                          {lead.company_name && (
                            <div className="text-sm text-muted-foreground mb-1 truncate">
                              {lead.company_name}
                            </div>
                          )}
                          
                          {/* Role - Tertiary */}
                          {lead.company_role && (
                            <div className="text-xs text-muted-foreground mb-2 truncate">
                              {lead.company_role}
                            </div>
                          )}

                          {/* Footer with Location and Owner */}
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                            {lead.employee_location && (
                              <div className="text-xs text-muted-foreground truncate max-w-20">
                                {lead.employee_location}
                              </div>
                            )}
                            {lead.owner_id && (
                              <div className="text-xs text-muted-foreground truncate max-w-20">
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

    </div>
  );
});

Pipeline.displayName = 'Pipeline';

export default Pipeline;