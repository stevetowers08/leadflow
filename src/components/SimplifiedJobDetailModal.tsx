import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  ExternalLink, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Briefcase, 
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SimplifiedCompanyDetailModal } from "./SimplifiedCompanyDetailModal";
import type { Tables } from "@/integrations/supabase/types";

interface SimplifiedJobDetailModalProps {
  job: Tables<"Jobs">;
  isOpen: boolean;
  onClose: () => void;
}

export function SimplifiedJobDetailModal({ job, isOpen, onClose }: SimplifiedJobDetailModalProps) {
  const [selectedLeadsForAutomation, setSelectedLeadsForAutomation] = useState<any[]>([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [messages, setMessages] = useState<{[key: string]: {request: string, connected: string, followUp: string}}>({});
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch company data
  const { data: companyData, isLoading: companyLoading } = useQuery({
    queryKey: ["job-company", job?.Company],
    queryFn: async () => {
      if (!job?.Company) return null;
      console.log("🔍 Searching for company:", job.Company);
      
      // Try exact match first
      let { data, error } = await supabase
        .from("Companies")
        .select("*")
        .eq("Company Name", job.Company)
        .limit(1);

      // If no exact match, try case-insensitive search
      if (!data || data.length === 0) {
        const { data: fuzzyData, error: fuzzyError } = await supabase
          .from("Companies")
          .select("*")
          .ilike("Company Name", `%${job.Company}%`)
          .limit(1);
        
        data = fuzzyData;
        error = fuzzyError;
      }

      if (error) {
        console.error("Company query error:", error);
        throw error;
      }
      
      console.log("🏢 Found company data:", data?.[0]);
      return data?.[0];
    },
    enabled: !!job?.Company && isOpen
  });

  // Fetch related leads for this job's company
  const { data: relatedLeads, isLoading: leadsLoading } = useQuery({
    queryKey: ["job-leads", job?.Company],
    queryFn: async () => {
      if (!job?.Company) return [];
      console.log("🔍 Searching for leads from company:", job.Company);
      
      const { data, error } = await supabase
        .from("People")
        .select(`
          id,
          Name,
          Company,
          "Company Role",
          "Email Address", 
          "LinkedIn URL",
          "LinkedIn Request Message",
          "LinkedIn Connected Message",
          "LinkedIn Follow Up Message",
          Stage,
          stage_enum,
          "Lead Score",
          "Employee Location",
          automation_status_enum,
          "Message Sent",
          "Connection Request",
          "Email Reply",
          "Meeting Booked",
          created_at
        `)
        .ilike("Company", `%${job.Company}%`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Leads query error:", error);
        throw error;
      }
      
      console.log("👥 Found leads:", data?.length || 0);
      return data || [];
    },
    enabled: !!job?.Company && isOpen
  });

  const handleLeadSelect = (lead: any) => {
    setSelectedLeadsForAutomation(prev => {
      const isSelected = prev.some(l => l.id === lead.id);
      return isSelected 
        ? prev.filter(l => l.id !== lead.id)
        : [...prev, lead];
    });
  };

  const handleAutomateLeads = () => {
    if (selectedLeadsForAutomation.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one lead to automate",
        variant: "destructive",
      });
      return;
    }
    setShowAutomationModal(true);
  };

  const initializeMessages = () => {
    const newMessages: {[key: string]: {request: string, connected: string, followUp: string}} = {};
    selectedLeadsForAutomation.forEach(lead => {
      newMessages[lead.id] = {
        request: lead["LinkedIn Request Message"] || '',
        connected: lead["LinkedIn Connected Message"] || '',
        followUp: lead["LinkedIn Follow Up Message"] || ''
      };
    });
    setMessages(newMessages);
  };

  // Initialize messages when modal opens
  useEffect(() => {
    if (showAutomationModal && selectedLeadsForAutomation.length > 0) {
      initializeMessages();
    }
  }, [showAutomationModal, selectedLeadsForAutomation]);

  const handleMessageChange = (leadId: string, messageType: 'request' | 'connected' | 'followUp', message: string) => {
    setMessages(prev => ({
      ...prev,
      [leadId]: {
        ...prev[leadId],
        [messageType]: message
      }
    }));
  };

  const sendToWebhook = async (lead: any, leadMessages: {request: string, connected: string, followUp: string}) => {
    const webhookUrl = 'https://n8n.empowr.ai/webhook/automation-trigger';
    
    const payload = {
      lead_id: lead.id,
      lead_name: lead.Name,
      company: job.Company,
      job_title: job["Job Title"],
      job_id: job.id,
      campaign: selectedCampaign,
      messages: {
        request_message: leadMessages.request,
        connected_message: leadMessages.connected,
        follow_up_message: leadMessages.followUp
      },
      job_details: {
        title: job["Job Title"],
        company: job.Company,
        industry: job.Industry,
        location: job.Location,
        salary_range: job["Salary Range"],
        job_type: job["Job Type"],
        experience_level: job["Experience Level"],
        remote_option: job["Remote Option"]
      }
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }
  };

  const handleConfirmAutomation = async () => {
    if (!selectedCampaign) {
      toast({
        title: "Error",
        description: "Please select a campaign",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Send each lead to the webhook
      const promises = selectedLeadsForAutomation.map(lead => 
        sendToWebhook(lead, messages[lead.id] || {request: '', connected: '', followUp: ''})
      );
      
      await Promise.all(promises);
      
      // Update lead automation status in database
      const leadIds = selectedLeadsForAutomation.map(lead => lead.id);
      const { error } = await supabase
        .from('People')
        .update({ 
          automation_status_enum: 'automation_triggered',
          "Automation Status": 'Automation Triggered',
          updated_at: new Date().toISOString()
        })
        .in('id', leadIds);

      if (error) {
        console.error('Database update error:', error);
      }

      setShowAutomationModal(false);
      setSelectedLeadsForAutomation([]);
      setMessages({});
      
      toast({
        title: "Success",
        description: `${selectedLeadsForAutomation.length} lead(s) added to automation queue and sent to n8n`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add leads to automation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    // Handle DD/MM/YYYY or DD/M/YYYY format
    const parseDate = (dateStr: string) => {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return new Date(`${year}-${month}-${day}`);
      }
      return new Date(dateStr);
    };
    
    try {
      const date = parseDate(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Helper function to parse dates consistently
  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dateStr);
  };

  const validThroughDate = job?.["Valid Through"] ? parseDate(job["Valid Through"]) : null;
  const isJobExpired = validThroughDate && validThroughDate < new Date();
  const daysRemaining = validThroughDate 
    ? Math.ceil((validThroughDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-700 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    if (score >= 40) return "text-orange-700 bg-orange-50 border-orange-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  if (!job) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Briefcase className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-medium text-gray-900">
                    {job?.["Job Title"] || "Untitled Job"}
                  </h1>
                  <div className="text-sm text-gray-600">
                    {job?.Company || "Unknown Company"} • {job?.["Job Location"] || "Location not specified"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {job?.Priority && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-600">Priority</span>
                    <StatusBadge status={job.Priority} size="md" />
                  </div>
                )}
                {job?.["Lead Score"] && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-600">Score</span>
                    <div className={`h-6 w-16 rounded-full text-xs font-medium text-center flex items-center justify-center ${getScoreColor(job["Lead Score"])}`}>
                      {job["Lead Score"]}
                    </div>
                  </div>
                )}
                {isJobExpired ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-600">Status</span>
                    <Badge variant="destructive" className="h-6 w-20 text-xs font-medium rounded-full text-center">Expired</Badge>
                  </div>
                ) : daysRemaining !== null && daysRemaining <= 7 ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-600">Status</span>
                    <Badge variant="secondary" className="h-6 w-20 text-xs font-medium rounded-full text-center">
                      {daysRemaining <= 0 ? "Expires today" : `${daysRemaining}d left`}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-600">Status</span>
                    <Badge variant="secondary" className="h-6 w-20 text-xs font-medium rounded-full text-center">Active</Badge>
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Job Details - Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Job Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-600 text-sm font-medium">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">
                        {job?.["Employment Type"] && `${job["Employment Type"]}`}
                        {job?.["Seniority Level"] && ` • ${job["Seniority Level"]}`}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        {job?.["Job Location"] && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job["Job Location"]}
                          </span>
                        )}
                        {job?.["Salary"] && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {job.Salary}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600">
                          {job?.["Posted Date"] ? formatDate(job["Posted Date"]) : (job?.created_at ? formatDate(job.created_at) : 'N/A')}
                        </span>
                      </div>
                      {job?.["Valid Through"] && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {formatDate(job["Valid Through"])}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Additional Job Information */}
                  <div className="space-y-2 pt-2">
                    {job?.["Industry"] && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">Industry: </span>
                        <span className="font-medium">{job.Industry}</span>
                      </div>
                    )}
                    {job?.["Function"] && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">Function: </span>
                        <span className="font-medium">{job.Function}</span>
                      </div>
                    )}
                    {job?.["Lead Score"] && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">Lead Score: </span>
                        <Badge 
                          className={`text-xs px-2 py-1 ${
                            job["Lead Score"]?.toString().toLowerCase() === 'very high' ? 'bg-green-100 text-green-800 border-green-200' :
                            job["Lead Score"]?.toString().toLowerCase() === 'high' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            job["Lead Score"]?.toString().toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            job["Lead Score"]?.toString().toLowerCase() === 'low' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }`}
                        >
                          {job["Lead Score"]}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Job URL */}
                  {job?.["Job URL"] && (
                    <div className="flex items-center gap-2 text-sm pt-2">
                      <ExternalLink className="h-3 w-3 text-gray-500" />
                      <a 
                        href={job["Job URL"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        View Job Posting
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Leads Section with Multi-Select */}
            {relatedLeads && relatedLeads.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader 
                  className="pb-2 cursor-pointer transition-colors"
                  onClick={() => {
                    onClose();
                    window.location.href = `/leads?filter=${encodeURIComponent(job?.Company || "")}`;
                  }}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Potential Leads ({relatedLeads.length})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {/* Small Blue Automation Button */}
                      {selectedLeadsForAutomation.length > 0 && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAutomateLeads();
                          }}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Automate ({selectedLeadsForAutomation.length})
                        </Button>
                      )}
                      <Checkbox
                        checked={selectedLeadsForAutomation.length === relatedLeads.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedLeadsForAutomation(relatedLeads);
                          } else {
                            setSelectedLeadsForAutomation([]);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-xs text-muted-foreground">Select All</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {relatedLeads.map((lead) => (
                      <div 
                        key={lead.id}
                        className="p-3 border rounded-lg transition-colors cursor-pointer"
                        onClick={() => {
                          onClose();
                          window.location.href = `/leads?filter=${encodeURIComponent(lead.Name || "")}`;
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedLeadsForAutomation.some(l => l.id === lead.id)}
                            onCheckedChange={() => handleLeadSelect(lead)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{lead.Name}</div>
                            <div className="text-xs text-muted-foreground">
                              {lead["Company Role"]} • {lead["Employee Location"]}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge 
                              status={lead.stage_enum || lead.Stage?.toLowerCase() || "new"} 
                              size="sm"
                            />
                            {lead["Lead Score"] && (
                              <Badge 
                                className={`text-xs px-2 py-1 ${
                                  lead["Lead Score"]?.toLowerCase() === 'very high' ? 'bg-green-100 text-green-800 border-green-200' :
                                  lead["Lead Score"]?.toLowerCase() === 'high' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                  lead["Lead Score"]?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  lead["Lead Score"]?.toLowerCase() === 'low' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                  'bg-gray-100 text-gray-800 border-gray-200'
                                }`}
                              >
                                {lead["Lead Score"]}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Company Information - Clickable */}
            {(companyData || companyLoading) && (
              <Card 
                className="shadow-sm cursor-pointer transition-shadow"
                onClick={() => {
                  console.log("🏢 Company clicked:", companyData);
                  setShowCompanyModal(true);
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {companyLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  ) : companyData ? (
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{companyData["Company Name"]}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {companyData.Industry && companyData.Industry}
                          {companyData["Company Size"] && ` • ${companyData["Company Size"]}`}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          {companyData["Head Office"] && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {companyData["Head Office"]}
                            </span>
                          )}
                          {companyData.Website && (
                            <a 
                              href={companyData.Website.startsWith('http') ? companyData.Website : `https://${companyData.Website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Globe className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {job?.["Lead Score"] && (
                          <Badge 
                            className={`text-xs px-2 py-1 ${
                              job["Lead Score"]?.toString().toLowerCase() === 'very high' ? 'bg-green-100 text-green-800 border-green-200' :
                              job["Lead Score"]?.toString().toLowerCase() === 'high' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              job["Lead Score"]?.toString().toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              job["Lead Score"]?.toString().toLowerCase() === 'low' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            {job["Lead Score"]}
                          </Badge>
                        )}
                        <Badge className="bg-blue-100 text-blue-800 border text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {relatedLeads?.length || 0} Leads
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No company information found for "{job?.Company}"
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showCompanyModal && (
        <SimplifiedCompanyDetailModal
          company={companyData}
          isOpen={showCompanyModal}
          onClose={() => setShowCompanyModal(false)}
        />
      )}

      {/* Enhanced Automation Modal */}
      {showAutomationModal && (
        <Dialog open={showAutomationModal} onOpenChange={() => setShowAutomationModal(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" style={{ zIndex: 999999 }}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                LinkedIn Automation ({selectedLeadsForAutomation.length} leads)
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Campaign Selection */}
              <div>
                <Label htmlFor="campaign-select" className="text-sm font-medium">
                  Campaign Selection:
                </Label>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a campaign..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech-recruitment">Tech Recruitment</SelectItem>
                    <SelectItem value="sales-outreach">Sales Outreach</SelectItem>
                    <SelectItem value="marketing-leads">Marketing Leads</SelectItem>
                    <SelectItem value="general-networking">General Networking</SelectItem>
                    <SelectItem value="custom-campaign">Custom Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Leads with LinkedIn Messages */}
              <div>
                <h3 className="font-medium mb-2">LinkedIn Messages ({selectedLeadsForAutomation.length})</h3>
                <ScrollArea className="h-96 border rounded-lg p-2">
                  <div className="space-y-4">
                    {selectedLeadsForAutomation.map((lead) => (
                      <div key={lead.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{lead.Name}</div>
                            <div className="text-xs text-gray-600">
                              {lead["Company Role"]} • {lead["Employee Location"]}
                            </div>
                          </div>
                          <StatusBadge 
                            status={lead.stage_enum || lead.Stage?.toLowerCase() || "new"} 
                            size="sm"
                          />
                        </div>
                        <div className="space-y-3">
                          {/* Request Message */}
                          <div>
                            <Label htmlFor={`request-${lead.id}`} className="text-xs font-medium text-gray-700">
                              Connection Request Message:
                            </Label>
                            <Textarea
                              id={`request-${lead.id}`}
                              value={messages[lead.id]?.request || ''}
                              onChange={(e) => handleMessageChange(lead.id, 'request', e.target.value)}
                              className="mt-1 text-sm"
                              rows={3}
                              placeholder="Enter your connection request message..."
                            />
                          </div>

                          {/* Connected Message */}
                          <div>
                            <Label htmlFor={`connected-${lead.id}`} className="text-xs font-medium text-gray-700">
                              Connected Message:
                            </Label>
                            <Textarea
                              id={`connected-${lead.id}`}
                              value={messages[lead.id]?.connected || ''}
                              onChange={(e) => handleMessageChange(lead.id, 'connected', e.target.value)}
                              className="mt-1 text-sm"
                              rows={3}
                              placeholder="Enter your connected message..."
                            />
                          </div>

                          {/* Follow Up Message */}
                          <div>
                            <Label htmlFor={`followup-${lead.id}`} className="text-xs font-medium text-gray-700">
                              Follow Up Message:
                            </Label>
                            <Textarea
                              id={`followup-${lead.id}`}
                              value={messages[lead.id]?.followUp || ''}
                              onChange={(e) => handleMessageChange(lead.id, 'followUp', e.target.value)}
                              className="mt-1 text-sm"
                              rows={3}
                              placeholder="Enter your follow up message..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowAutomationModal(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAutomation}
                  disabled={loading || !selectedCampaign}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Starting Automation...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Start Automation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}