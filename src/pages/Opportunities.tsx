import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LEAD_STAGE_OPTIONS } from "@/hooks/useDropdownOptions";
import { User, Building2, Mail, MapPin, Star, TrendingUp, Eye } from "lucide-react";

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
}

const stageColors = {
  new: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200",
  contacted: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
  qualified: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
  interview: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
  offer: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
  hired: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
  lost: "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
};

const stageIcons = {
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
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
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
    fetchLeads();
  }, []);

  const groupedLeads = LEAD_STAGE_OPTIONS.reduce((acc, stage) => {
    const stageLeads = leads.filter(lead => 
      (lead.stage_enum || lead.Stage?.toLowerCase()) === stage.value
    );
    acc[stage.value] = stageLeads;
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
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {LEAD_STAGE_OPTIONS.map(stage => {
          const stageLeads = groupedLeads[stage.value] || [];
          const stageKey = stage.value as keyof typeof stageColors;
          
          return (
            <Card key={stage.value} className={`${stageColors[stageKey]} min-h-[400px]`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-lg">{stageIcons[stageKey]}</span>
                  {stage.label}
                  <span className="ml-auto text-xs bg-white/70 px-2 py-1 rounded-full">
                    {stageLeads.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-3xl opacity-50 mb-2">{stageIcons[stageKey]}</div>
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLeadClick(lead);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
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
                          
                          <div className="flex items-center justify-between pt-1">
                            {lead.priority_enum && (
                              <StatusBadge status={lead.priority_enum} size="sm" />
                            )}
                            {lead["Lead Score"] && (
                              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                                {lead["Lead Score"]}
                              </span>
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