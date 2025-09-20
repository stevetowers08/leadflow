import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Building2, Mail, MapPin, Star, TrendingUp, Eye, ChevronDown, MoreVertical, Target, MessageCircle, Users2 } from "lucide-react";

interface Lead {
  id: string;
  Name: string;
  Company: string | null;
  "Email Address": string | null;
  "Employee Location": string | null;
  "Company Role": string | null;
  Stage: string | null;
  stage_enum: string | null;
  priority_enum: string | null;
  "Lead Score": string | null;
  "LinkedIn URL": string | null;
  created_at: string;
  "Next Action Date": string | null;
  "Last Contact Date": string | null;
  "Meeting Date": string | null;
  Jobs: string | null;
}

// Recruiting pipeline stages and colors
const RECRUITING_STAGES = [
  'NEW LEAD',
  'IN QUEUE', 
  'CONNECT SENT',
  'MSG SENT',
  'CONNECTED',
  'REPLIED',
  'LEAD LOST'
];

const recruitingStageColors: Record<string, string> = {
  'NEW LEAD': "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
  'IN QUEUE': "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200",
  'CONNECT SENT': "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
  'MSG SENT': "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200",
  'CONNECTED': "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200",
  'REPLIED': "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
  'LEAD LOST': "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
};

const Opportunities = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [availableStages, setAvailableStages] = useState<string[]>(RECRUITING_STAGES);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("People")
        .select(`
          id,
          Name,
          Company,
          "Email Address",
          "Employee Location", 
          "Company Role",
          Stage,
          stage_enum,
          priority_enum,
          "Lead Score",
          "LinkedIn URL",
          created_at,
          "Next Action Date",
          "Last Contact Date",
          "Meeting Date",
          Jobs
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      console.log("Fetched leads:", data);
      setLeads(data || []);
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
        .from("People")
        .update({ 
          Stage: newStage,
          stage_enum: newStage as any
        })
        .eq("id", leadId);

      if (error) throw error;

      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { ...lead, Stage: newStage, stage_enum: newStage }
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

  const groupedLeads = availableStages.reduce((acc, stage) => {
    const stageLeads = leads.filter(lead => {
      const leadStage = lead.Stage || lead.stage_enum || 'NEW LEAD';
      return leadStage === stage;
    });
    acc[stage] = stageLeads;
    console.log(`Stage ${stage}:`, stageLeads.length, "leads");
    return acc;
  }, {} as Record<string, Lead[]>);

  // If no leads have stages, put them all in 'NEW LEAD' stage
  const totalLeadsInStages = Object.values(groupedLeads).flat().length;
  if (totalLeadsInStages === 0 && leads.length > 0) {
    groupedLeads['NEW LEAD'] = leads;
    console.log("No staged leads found, putting all in 'NEW LEAD' stage:", leads.length);
  }

  const getRecruitingStats = () => {
    const activeLeads = leads.filter(lead => !['LEAD LOST'].includes(lead.Stage || ''));
    const connectedLeads = leads.filter(lead => ['CONNECTED', 'REPLIED'].includes(lead.Stage || ''));
    const totalCompanies = new Set(leads.map(lead => lead.Company).filter(Boolean)).size;
    
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Opportunities</h1>
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
      <div className="flex justify-between items-center">
        <div>         
          <h1 className="text-xl font-bold tracking-tight text-foreground">Recruiting Pipeline</h1>
          <p className="text-sm text-muted-foreground">Track decision makers at companies with open positions</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-200 rounded-lg">
                <Target className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-900">Active Leads</p>
                <p className="text-lg font-bold text-blue-900">{activeLeads}</p>
                <p className="text-xs text-blue-700">decision makers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-200 rounded-lg">
                <MessageCircle className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-900">Connected</p>
                <p className="text-lg font-bold text-green-900">{connectedLeads}</p>
                <p className="text-xs text-green-700">conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-200 rounded-lg">
                <Users2 className="h-4 w-4 text-purple-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-purple-900">Companies</p>
                <p className="text-lg font-bold text-purple-900">{totalCompanies}</p>
                <p className="text-xs text-purple-700">with open roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pipeline Stages */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Outreach Pipeline</h2>
          <div className="text-xs text-muted-foreground">
            Total: {leads.length} | Active: {activeLeads}
          </div>
        </div>
        
        {/* Horizontally scrollable pipeline */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {availableStages.map(stage => {
              const stageLeads = groupedLeads[stage] || [];
              const stageColor = recruitingStageColors[stage] || recruitingStageColors['NEW LEAD'];
              
              return (
                <Card key={stage} className={`${stageColor} min-h-[450px] w-72 flex-shrink-0`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-xs font-semibold">
                      <span>{stage}</span>
                      <span className="text-xs bg-white/80 px-2 py-0.5 rounded-full">
                        {stageLeads.length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[380px] overflow-y-auto">
                    {stageLeads.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-xs opacity-60">No leads in this stage</p>
                      </div>
                    ) : (
                      stageLeads.map(lead => (
                        <Card 
                          key={lead.id} 
                          className="bg-white/90 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer border border-white/60"
                          onClick={() => handleLeadClick(lead)}
                        >
                          <CardContent className="p-3">
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-xs leading-tight">{lead.Name}</h4>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0 opacity-60 hover:opacity-100"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent 
                                    className="w-44 bg-white shadow-lg border border-gray-200 rounded-md z-50" 
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-b">
                                      Move to Stage
                                    </div>
                                    {availableStages.map(newStage => (
                                      <DropdownMenuItem
                                        key={newStage}
                                        className="cursor-pointer hover:bg-gray-100 px-2 py-1.5 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateLeadStage(lead.id, newStage);
                                        }}
                                      >
                                        {newStage}
                                      </DropdownMenuItem>
                                    ))}
                                    <div className="border-t mt-1 pt-1">
                                      <DropdownMenuItem
                                        className="cursor-pointer hover:bg-gray-100 px-2 py-1.5 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLeadClick(lead);
                                        }}
                                      >
                                        <Eye className="h-3 w-3 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              {lead.Company && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Building2 className="h-3 w-3" />
                                  <span className="truncate">{lead.Company}</span>
                                </div>
                              )}
                              
                              {lead["Company Role"] && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  <span className="truncate">{lead["Company Role"]}</span>
                                </div>
                              )}

                              {lead.Jobs && (
                                <div className="text-xs text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded text-center truncate">
                                  {lead.Jobs}
                                </div>
                              )}
                              
                              {lead["Employee Location"] && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{lead["Employee Location"]}</span>
                                </div>
                              )}

                              {/* Recruiting Pipeline Info */}
                              {lead["Last Contact Date"] && (
                                <div className="text-xs text-muted-foreground">
                                  Last: {new Date(lead["Last Contact Date"]).toLocaleDateString()}
                                </div>
                              )}

                              {lead["Next Action Date"] && (
                                <div className="text-xs text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                                  Next: {new Date(lead["Next Action Date"]).toLocaleDateString()}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-1">
                                {lead.priority_enum && (
                                  <StatusBadge status={lead.priority_enum} size="sm" />
                                )}
                                {lead["Lead Score"] && (
                                  <span className="text-xs font-medium text-yellow-700 bg-yellow-100/80 px-1.5 py-0.5 rounded-full">
                                    {lead["Lead Score"]}
                                  </span>
                                )}
                              </div>

                              {/* Pipeline Actions */}
                              <div className="flex gap-1 pt-1">
                                {lead["Email Address"] && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 px-1.5 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(`mailto:${lead["Email Address"]}`, '_blank');
                                    }}
                                  >
                                    <Mail className="h-2.5 w-2.5 mr-1" />
                                    Email
                                  </Button>
                                )}
                                {lead["LinkedIn URL"] && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 px-1.5 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(lead["LinkedIn URL"], '_blank');
                                    }}
                                  >
                                    LinkedIn
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <LeadDetailModal
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

export default Opportunities;