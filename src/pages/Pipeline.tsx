import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailPopup } from "@/components/LeadDetailPopup";
import { PipelineStatsCards } from "@/components/StatsCards";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, Mail, Phone, MapPin, Calendar, RefreshCw, Filter, TrendingUp, Target, CheckCircle } from "lucide-react";
import { getClearbitLogo } from "@/utils/logoService";
import { Page } from "@/design-system/components";
import { designTokens } from "@/design-system/tokens";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"people"> & {
  company_name?: string | null;
  company_logo_url?: string | null;
};

const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  // Define pipeline stages in order (matching database enum values)
  const pipelineStages = [
    { key: "new", label: "New Lead", color: "bg-gray-50 text-gray-700 border-gray-200" },
    { key: "in queue", label: "In Queue", color: "bg-gray-50 text-gray-700 border-gray-200" },
    { key: "connection_requested", label: "Connection Requested", color: "bg-gray-50 text-gray-700 border-gray-200" },
    { key: "connected", label: "Connected", color: "bg-gray-50 text-gray-700 border-gray-200" },
    { key: "messaged", label: "Messaged", color: "bg-gray-50 text-gray-700 border-gray-200" },
    { key: "replied", label: "Replied", color: "bg-gray-50 text-gray-700 border-gray-200" },
    { key: "meeting_booked", label: "Meeting Booked", color: "bg-gray-50 text-gray-700 border-gray-200" },
    { key: "meeting_held", label: "Meeting Held", color: "bg-gray-50 text-gray-700 border-gray-200" },
    { key: "disqualified", label: "Disqualified", color: "bg-gray-50 text-gray-700 border-gray-200" },
    { key: "lead_lost", label: "Lead Lost", color: "bg-gray-50 text-gray-700 border-gray-200" }
  ];

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("people")
        .select(`
          id, name, company_role, email_address, linkedin_url, employee_location, lead_score, stage, automation_started_at,
          linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, connected_at,
          message_sent, meeting_booked, email_sent, email_reply,
          connection_request_date, connection_accepted_date, message_sent_date, response_date,
          meeting_booked, meeting_date, email_sent_date, email_reply_date, stage_updated,
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

  // Group leads by stage
  const leadsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage.key] = leads.filter(lead => lead.stage === stage.key);
    return acc;
  }, {} as Record<string, Lead[]>);


  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const LeadCard = ({ lead }: { lead: Lead }) => (
    <Card 
      className="cursor-pointer hover:shadow-sm transition-all duration-200 border border-gray-200 bg-white"
      onClick={() => handleLeadClick(lead)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            {lead.company_logo_url ? (
              <img
                src={lead.company_logo_url}
                alt={lead.company_name || "Company"}
                className="w-8 h-8 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold"
              style={{ display: lead.company_logo_url ? 'none' : 'flex' }}
            >
              {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate mb-1">{lead.name}</h3>
            <p className="text-xs text-gray-600 truncate font-medium">{lead.company_role}</p>
            <p className="text-xs text-gray-500 truncate">{lead.company_name}</p>
            
            <div className="flex items-center gap-2 mt-3">
              {lead.lead_score && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-gray-300 text-gray-600 bg-gray-50"
                >
                  {lead.lead_score}
                </Badge>
              )}
              {lead.employee_location && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {lead.employee_location}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <Page
      title="Pipeline"
      subtitle="Track leads through recruitment stages"
    >
      <div className="flex gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={fetchLeads} className={designTokens.shadows.button}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" className={designTokens.shadows.button}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Single Horizontal Scrolling Pipeline Board */}
      <div className="relative">
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex gap-6 min-w-max">
            {pipelineStages.map((stage) => {
              const stageLeads = leadsByStage[stage.key] || [];
              return (
                <div key={stage.key} className="flex-shrink-0 w-80">
                  {/* Stage Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 text-sm">{stage.label}</h3>
                      <Badge variant="outline" className="text-xs">
                        {stageLeads.length}
                      </Badge>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                  </div>
                  
                  {/* Leads Column - No individual scrolling */}
                  <div className="space-y-3">
                    {stageLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="text-center text-gray-400 text-sm py-12 border border-dashed border-gray-200 rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No leads in this stage</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailPopup
          lead={selectedLead}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedLead(null);
          }}
        />
      )}
    </Page>
  );
};

export default Pipeline;