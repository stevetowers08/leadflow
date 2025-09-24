import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { AIScoreBadge } from "@/components/AIScoreBadge";
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
      
      setLeads(data || []);
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
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">Opportunities Pipeline</h1>
          <p className="text-gray-600">
            Track and manage your recruiting pipeline across all stages
          </p>
        </div>
      
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Target className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Active Leads</p>
                  <p className="text-2xl font-bold text-blue-900">{activeLeads}</p>
                  <p className="text-sm text-blue-700 opacity-75">decision makers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-200 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">Connected</p>
                  <p className="text-2xl font-bold text-green-900">{connectedLeads}</p>
                  <p className="text-sm text-green-700 opacity-75">conversations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-200 rounded-lg">
                  <Users2 className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">Companies</p>
                  <p className="text-2xl font-bold text-purple-900">{totalCompanies}</p>
                  <p className="text-sm text-purple-700 opacity-75">with open roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      
        {/* Sales Pipeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Sales Pipeline</h2>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Total: {leads.length} | Active: {activeLeads}
            </div>
          </div>
          
          {/* Pipeline Board */}
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
            {availableStages.map(stage => {
              const stageLeads = groupedLeads[stage] || [];
              const stageColor = recruitingStageColors[stage] || recruitingStageColors['NEW LEAD'];
              
              return (
                <div key={stage} className="flex-shrink-0 w-80">
                  {/* Stage Header */}
                  <div className={`${stageColor} rounded-t-lg border-2 border-b-0 border-gray-200 p-4`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 text-sm">{stage}</h3>
                      <span className="bg-white/90 px-2 py-1 rounded-full text-xs font-bold text-gray-700">
                        {stageLeads.length}
                      </span>
                    </div>
                  </div>
                  
                  {/* Stage Column */}
                  <div className="bg-gray-50 border-2 border-t-0 border-gray-200 rounded-b-lg min-h-[500px] p-3 space-y-3">
                    {stageLeads.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-2xl mb-2">📋</div>
                        <p className="text-sm opacity-60">No leads in this stage</p>
                      </div>
                    ) : (
                      stageLeads.map(lead => (
                        <Card 
                          key={lead.id} 
                          className="bg-white hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 group"
                          onClick={() => handleLeadClick(lead)}
                        >
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h4 className="font-semibold text-sm leading-tight text-gray-900">{lead.Name}</h4>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-gray-100"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent 
                                    className="w-40 bg-white shadow-lg border border-gray-200 rounded-md z-50" 
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-b">
                                      Move to Stage
                                    </div>
                                    {availableStages.map(newStage => (
                                      <DropdownMenuItem
                                        key={newStage}
                                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 text-xs"
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
                                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLeadClick(lead);
                                        }}
                                      >
                                        <Eye className="h-2.5 w-2.5 mr-1" />
                                        View Details
                                      </DropdownMenuItem>
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              {lead.Company && (
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <Building2 className="h-3 w-3 text-gray-500" />
                                  <span className="truncate font-medium">{lead.Company}</span>
                                </div>
                              )}
                              
                              {lead["Company Role"] && (
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <User className="h-3 w-3 text-gray-500" />
                                  <span className="truncate">{lead["Company Role"]}</span>
                                </div>
                              )}

                              {lead.Jobs && (
                                <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full text-center font-medium">
                                  {lead.Jobs}
                                </div>
                              )}
                              
                              {lead["Employee Location"] && (
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <MapPin className="h-3 w-3 text-gray-500" />
                                  <span className="truncate">{lead["Employee Location"]}</span>
                                </div>
                              )}

                              {/* Pipeline Info */}
                              {lead["Next Action Date"] && (
                                <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full font-medium">
                                  Next: {new Date(lead["Next Action Date"]).toLocaleDateString()}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-1">
                                {lead.priority_enum && (
                                  <StatusBadge status={lead.priority_enum} size="sm" />
                                )}
                                <AIScoreBadge
                                  leadData={{
                                    name: lead.Name || "",
                                    company: lead.Company || "",
                                    role: lead["Company Role"] || "",
                                    location: lead["Employee Location"] || "",
                                    industry: lead["Company Industry"] || "Unknown",
                                    company_size: "Unknown"
                                  }}
                                  initialScore={lead["Lead Score"] ? parseInt(lead["Lead Score"]) : undefined}
                                  showDetails={false}
                                />
                              </div>

                              {/* Quick Actions */}
                              <div className="flex gap-1 pt-1">
                                {lead["Email Address"] && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-xs hover:bg-blue-50 hover:border-blue-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(`mailto:${lead["Email Address"]}`, '_blank');
                                    }}
                                  >
                                    <Mail className="h-3 w-3" />
                                  </Button>
                                )}
                                {lead["LinkedIn URL"] && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-xs hover:bg-blue-50 hover:border-blue-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(lead["LinkedIn URL"], '_blank');
                                    }}
                                  >
                                    <MessageCircle className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
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
    </div>
  );
};

export default Opportunities;