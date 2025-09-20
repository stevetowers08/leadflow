import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Building2, Mail, MapPin, Star, TrendingUp, Eye, ChevronDown, MoreVertical } from "lucide-react";

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
}

const stageColors: Record<string, string> = {
  new: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200",
  contacted: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
  qualified: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
  interview: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
  offer: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
  hired: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
  lost: "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
};

const stageIcons: Record<string, string> = {
  new: "🆕",
  contacted: "📞",
  qualified: "✅",
  interview: "🎯",
  offer: "💼",
  hired: "🎉",
  lost: "❌"
};

const Opportunities = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [availableStages, setAvailableStages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchAvailableStages = async () => {
    try {
      // Get unique stages from the database
      const { data, error } = await supabase
        .from("People")
        .select("Stage, stage_enum")
        .not("Stage", "is", null);

      if (error) throw error;

      const stages = new Set<string>();
      
      data?.forEach(row => {
        if (row.stage_enum) stages.add(row.stage_enum);
        if (row.Stage && !row.stage_enum) stages.add(row.Stage.toLowerCase());
      });

      // Default stages if none exist
      const stageArray = stages.size > 0 
        ? Array.from(stages).sort()
        : ['new', 'contacted', 'qualified', 'interview', 'offer', 'hired', 'lost'];
      
      console.log("Available stages:", stageArray);
      setAvailableStages(stageArray);
    } catch (error) {
      console.error("Error fetching stages:", error);
      setAvailableStages(['new', 'contacted', 'qualified', 'interview', 'offer', 'hired', 'lost']);
    }
  };

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
          "Meeting Date"
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      console.log("Fetched leads:", data); // Debug log
      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Error",
        description: "Failed to fetch opportunities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableStages();
    fetchLeads();
  }, []);

  const updateLeadStage = async (leadId: string, newStage: string) => {
    try {
      const { error } = await supabase
        .from("People")
        .update({ 
          stage_enum: newStage as any,
          Stage: newStage.charAt(0).toUpperCase() + newStage.slice(1)
        })
        .eq("id", leadId);

      if (error) throw error;

      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { ...lead, stage_enum: newStage, Stage: newStage.charAt(0).toUpperCase() + newStage.slice(1) }
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
      const leadStage = lead.stage_enum || lead.Stage?.toLowerCase() || 'new';
      return leadStage === stage;
    });
    acc[stage] = stageLeads;
    console.log(`Stage ${stage}:`, stageLeads.length, "leads");
    return acc;
  }, {} as Record<string, Lead[]>);

  const getStageStats = () => {
    const activeLeads = leads.filter(lead => !['hired', 'lost'].includes(lead.stage_enum || lead.Stage?.toLowerCase() || ''));
    const hiredThisMonth = leads.filter(lead => {
      const stage = lead.stage_enum || lead.Stage?.toLowerCase();
      const createdThisMonth = new Date(lead.created_at).getMonth() === new Date().getMonth();
      return stage === 'hired' && createdThisMonth;
    });
    const totalScore = leads.reduce((sum, lead) => sum + (parseInt(lead["Lead Score"] || "0") || 0), 0);
    
    return { activeLeads: activeLeads.length, hiredThisMonth: hiredThisMonth.length, totalScore };
  };

  const { activeLeads, hiredThisMonth, totalScore } = getStageStats();

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Opportunities</h1>
          <p className="text-muted-foreground">Track your sales pipeline by stage</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-200 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Active Pipeline</p>
                <p className="text-2xl font-bold text-blue-900">{activeLeads}</p>
                <p className="text-xs text-blue-700">opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-200 rounded-full">
                <span className="text-lg">🎉</span>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Hired This Month</p>
                <p className="text-2xl font-bold text-green-900">{hiredThisMonth}</p>
                <p className="text-xs text-green-700">new hires</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-200 rounded-full">
                <Star className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Total Lead Score</p>
                <p className="text-2xl font-bold text-purple-900">{totalScore}</p>
                <p className="text-xs text-purple-700">combined score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pipeline Stages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sales Pipeline</h2>
          <div className="text-sm text-muted-foreground">
            Total Leads: {leads.length} | Active: {activeLeads}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {availableStages.map(stage => {
          const stageLeads = groupedLeads[stage] || [];
          const stageKey = stage as keyof typeof stageColors;
          const stageName = stage.charAt(0).toUpperCase() + stage.slice(1);
          const stageColor = stageColors[stageKey] || stageColors.new;
          const stageIcon = stageIcons[stageKey] || "📋";
          
          return (
            <Card key={stage} className={`${stageColor} min-h-[400px]`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-lg">{stageIcon}</span>
                  {stageName}
                  <span className="ml-auto text-xs bg-white/70 px-2 py-1 rounded-full">
                    {stageLeads.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-3xl opacity-50 mb-2">{stageIcon}</div>
                    <p className="text-sm">No leads in this stage</p>
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <Card 
                      key={lead.id} 
                      className="bg-white/80 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer border border-white/50"
                      onClick={() => handleLeadClick(lead)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-sm leading-tight">{lead.Name}</h4>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                className="w-48 bg-white shadow-lg border border-gray-200 rounded-md z-50" 
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                                  Move to Stage
                                </div>
                                {availableStages.map(newStage => (
                                  <DropdownMenuItem
                                    key={newStage}
                                    className="cursor-pointer hover:bg-gray-100 px-3 py-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateLeadStage(lead.id, newStage);
                                    }}
                                  >
                                    <StatusBadge status={newStage} size="sm" className="mr-2" />
                                    {newStage.charAt(0).toUpperCase() + newStage.slice(1)}
                                  </DropdownMenuItem>
                                ))}
                                <div className="border-t mt-1 pt-1">
                                  <DropdownMenuItem
                                    className="cursor-pointer hover:bg-gray-100 px-3 py-2"
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
                          
                          {lead["Employee Location"] && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{lead["Employee Location"]}</span>
                            </div>
                          )}

                          {/* CRM Pipeline Info */}
                          {lead["Last Contact Date"] && (
                            <div className="text-xs text-muted-foreground">
                              Last contact: {new Date(lead["Last Contact Date"]).toLocaleDateString()}
                            </div>
                          )}

                          {lead["Next Action Date"] && (
                            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              Next: {new Date(lead["Next Action Date"]).toLocaleDateString()}
                            </div>
                          )}

                          {lead["Meeting Date"] && (
                            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                              Meeting: {new Date(lead["Meeting Date"]).toLocaleDateString()}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-1">
                            {lead.priority_enum && (
                              <StatusBadge status={lead.priority_enum} size="sm" />
                            )}
                            {lead["Lead Score"] && (
                              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                                Score: {lead["Lead Score"]}
                              </span>
                            )}
                          </div>

                          {/* Pipeline Actions */}
                          <div className="flex gap-1 pt-2">
                            {lead["Email Address"] && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`mailto:${lead["Email Address"]}`, '_blank');
                                }}
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Button>
                            )}
                            {lead["LinkedIn URL"] && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
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