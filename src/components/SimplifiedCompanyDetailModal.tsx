import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Building2, 
  ExternalLink, 
  MapPin, 
  Users, 
  Globe, 
  Briefcase,
  Calendar,
  Eye,
  Bot,
  Info,
  ArrowRight,
  Zap,
  CheckSquare,
  Square,
  Heart,
  Trash2,
  Star
} from "lucide-react";
import { useState, useEffect } from "react";
import { SimplifiedJobDetailModal } from "./SimplifiedJobDetailModal";
import { LeadDetailModal } from "./LeadDetailModal";
import { LinkedInConfirmationModal } from "./LinkedInConfirmationModal";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

interface SimplifiedCompanyDetailModalProps {
  company: Tables<"Companies">;
  isOpen: boolean;
  onClose: () => void;
}

export function SimplifiedCompanyDetailModal({ company, isOpen, onClose }: SimplifiedCompanyDetailModalProps) {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLeadsForAutomation, setSelectedLeadsForAutomation] = useState<any[]>([]);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [messages, setMessages] = useState<{[key: string]: {request: string, connected: string, followUp: string}}>({});
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch related jobs for this company
  const { data: relatedJobs } = useQuery({
    queryKey: ["company-jobs", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("Jobs")
        .select(`
          id,
          "Job Title",
          "Job Location",
          "Posted Date",
          "Employment Type",
          "Salary",
          status_enum,
          "Priority",
          "Job URL",
          created_at
        `)
        .eq("company_id", company.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && isOpen,
  });

  // Fetch related leads for this company
  const { data: relatedLeads, isLoading: leadsLoading, error: leadsError } = useQuery({
    queryKey: ["company-leads", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      // Let's see what's actually in the People table
      const { data: allPeople, error: allError } = await supabase
        .from("People")
        .select("id, Name, Company, company_id")
        .limit(5);
        
      console.log("Sample people in database:", allPeople);
      
      const { data, error } = await supabase
        .from("People")
        .select(`
          id,
          Name,
          "Company Role",
          "Lead Score",
          "Employee Location",
          "LinkedIn URL",
          "LinkedIn Request Message",
          "LinkedIn Connected Message",
          "LinkedIn Follow Up Message",
          automation_status_enum,
          "Automation Status",
          Stage,
          stage_enum,
          "Message Sent",
          "Connection Request",
          "Email Reply",
          "Meeting Booked",
          created_at,
          Company,
          company_id,
          Favourite
        `)
        .eq("company_id", company.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }
      
      console.log("Query results:", data);
      return data || [];
    },
    enabled: !!company?.id && isOpen,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleJobClick = (job: any) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleLeadSelect = (lead: any) => {
    console.log("Lead selected:", lead);
    setSelectedLeadsForAutomation(prev => {
      const isSelected = prev.some(l => l.id === lead.id);
      const newSelection = isSelected 
        ? prev.filter(l => l.id !== lead.id)
        : [...prev, lead];
      return newSelection;
    });
  };

  // Initialize messages for each lead
  const initializeMessages = () => {
    const initialMessages: {[key: string]: {request: string, connected: string, followUp: string}} = {};
    selectedLeadsForAutomation.forEach(lead => {
      // Only use existing messages from database, leave empty if none exist
      initialMessages[lead.id] = {
        request: lead["LinkedIn Request Message"] || '',
        connected: lead["LinkedIn Connected Message"] || '',
        followUp: lead["LinkedIn Follow Up Message"] || ''
      };
    });
    setMessages(initialMessages);
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
    const webhookUrl = "https://n8n.srv814433.hstgr.cloud/webhook/crm";
    
    const webhookPayload = {
      timestamp: new Date().toISOString(),
      source: "crm_automation",
      action: "lead_automation_trigger",
      lead: {
        id: lead.id,
        name: lead.Name,
        company: lead.Company,
        role: lead["Company Role"],
        location: lead["Employee Location"],
        linkedin_url: lead["LinkedIn URL"],
        email: lead["Email Address"],
        stage: lead.Stage || lead.stage_enum,
        priority: lead.priority_enum,
        lead_score: lead["Lead Score"],
        automation_status: lead.automation_status_enum || lead["Automation Status"]
      },
      company: {
        name: company.Company,
        industry: company.Industry,
        location: company.Location,
        website: company.Website,
        company_size: company["Company Size"]
      },
      messages: {
        request_message: leadMessages.request,
        connected_message: leadMessages.connected,
        follow_up_message: leadMessages.followUp
      },
      campaign: selectedCampaign,
      automation_type: "linkedin_outreach"
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  };

  const handleAutomateSelected = () => {
    if (selectedLeadsForAutomation.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one person to automate",
        variant: "destructive",
      });
      return;
    }
    setShowAutomationModal(true);
  };

  const handleConfirmAutomation = async () => {
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
        .from('Leads')
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

  const handleFavoriteCompany = async () => {
    try {
      const { error } = await supabase
        .from("Companies")
        .update({ Favourite: company.Favourite ? null : "true" })
        .eq("id", company.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: company.Favourite ? "Company removed from favorites" : "Company added to favorites",
      });
      
      // Refresh the company data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCompany = async () => {
    if (!confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("Companies")
        .delete()
        .eq("id", company.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete company",
        variant: "destructive",
      });
    }
  };

  const handleFavoritePerson = async (personId: string, currentFavorite: string | null) => {
    try {
      const { error } = await supabase
        .from("People")
        .update({ Favourite: currentFavorite ? null : "true" })
        .eq("id", personId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: currentFavorite ? "Person removed from favorites" : "Person added to favorites",
      });
      
      // Refresh the leads data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const handleDeletePerson = async (personId: string, personName: string) => {
    if (!confirm(`Are you sure you want to delete ${personName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("People")
        .delete()
        .eq("id", personId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Person deleted successfully",
      });
      
      // Refresh the leads data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete person",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-700 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    if (score >= 40) return "text-orange-700 bg-orange-50 border-orange-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  if (!company) return null;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
              <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
                <DialogHeader className="pb-2">
                  <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-50 rounded">
                        <Building2 className="h-3.5 w-3.5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">
                          {company["Company Name"] || "Unknown Company"}
                        </h1>
                        <div className="text-sm text-gray-500">
                          {[company.Industry, company["Head Office"]].filter(Boolean).join(' • ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {company.Priority && (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium text-gray-600">Priority</span>
                          <StatusBadge status={company.Priority} size="md" />
                        </div>
                      )}
                      {company["Lead Score"] && (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium text-gray-600">Score</span>
                          <div className={`h-6 w-16 rounded-full text-xs font-medium text-center flex items-center justify-center ${getScoreColor(company["Lead Score"])}`}>
                            {company["Lead Score"]}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleFavoriteCompany}
                          className="h-7 px-2"
                        >
                          {company.Favourite ? (
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          ) : (
                            <Star className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteCompany}
                          className="h-7 px-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
            {/* Company Overview - At the Top */}
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  Company Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <div className="grid grid-cols-2 gap-2">
                  {/* Basic Information */}
                  <div className="space-y-1">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Size</label>
                      <p className="text-sm text-gray-900">
                        {company["Company Size"] || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Industry</label>
                      <p className="text-sm text-gray-900">
                        {company.Industry || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-1">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-sm text-gray-900">
                        {company["Head Office"] || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Website</label>
                      {company.Website ? (
                      <a 
                        href={company.Website.startsWith('http') ? company.Website : `https://${company.Website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                          className="text-sm text-blue-600 flex items-center gap-1"
                      >
                          {company.Website.length > 20 ? company.Website.substring(0, 20) + '...' : company.Website}
                          <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                      ) : (
                        <p className="text-sm text-gray-500">Not specified</p>
                    )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related People */}
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Related People
                    <Badge variant="outline" className="ml-1.5 text-sm px-1.5 py-0.5">
                      {relatedLeads?.length || 0}
                    </Badge>
                          {leadsLoading && <span className="text-sm text-gray-500">(Loading...)</span>}
                          {leadsError && (
                            <span className="text-sm text-red-500">
                              (Error: {leadsError.message || 'Unknown error'})
                            </span>
                          )}
                  </div>
                <div className="flex items-center gap-2">
                    {selectedLeadsForAutomation.length > 0 && (
                      <Button
                        size="sm"
                        onClick={handleAutomateSelected}
                        className="text-sm h-6 px-2"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Automate ({selectedLeadsForAutomation.length})
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-0.5">
                  {relatedLeads?.map((lead) => {
                    const isSelected = selectedLeadsForAutomation.some(l => l.id === lead.id);
                    return (
                      <div 
                        key={lead.id}
                        className="flex items-center justify-between p-1.5 border rounded"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLeadSelect(lead);
                            }}
                            className="flex-shrink-0"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => handleLeadClick(lead)}
                          >
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {lead.Name || "Unknown Lead"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead["Company Role"] && `${lead["Company Role"]}`}
                              {lead["Employee Location"] && ` • ${lead["Employee Location"]}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <StatusBadge status={lead.stage_enum || lead.Stage} size="sm" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoritePerson(lead.id, lead.Favourite);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            {lead.Favourite ? (
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            ) : (
                              <Star className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePerson(lead.id, lead.Name);
                            }}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <ArrowRight className="h-2.5 w-2.5 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                  {(!relatedLeads || relatedLeads.length === 0) && !leadsLoading && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      No related people found
                    </div>
                  )}
                  {leadsLoading && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      Loading people...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Score */}
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bot className="h-3.5 w-3.5" />
                  AI Score
                  <AIScoreBadge
                    leadData={{
                      name: "",
                      company: company["Company Name"] || "",
                      role: "",
                      location: company["Head Office"] || "",
                      industry: company.Industry || "",
                      company_size: company["Company Size"] || ""
                    }}
                    initialScore={company["Lead Score"]}
                  />
                </CardTitle>
              </CardHeader>
              {company["Score Reason"] && (
                <CardContent className="pt-0">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reasoning</label>
                    <p className="text-sm text-gray-900 p-1.5 bg-gray-50 rounded mt-0.5">
                      {company["Score Reason"]}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* AI Intelligence */}
            {company["AI Info"] && (
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Bot className="h-3.5 w-3.5" />
                    AI Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-900 p-1.5 bg-gray-50 rounded">
                    {company["AI Info"]}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Related Jobs */}
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  Related Jobs
                  <Badge variant="outline" className="ml-1.5 text-sm px-1.5 py-0.5">
                    {relatedJobs?.length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-24">
                  <div className="space-y-0.5">
                    {relatedJobs?.map((job) => (
                      <div 
                        key={job.id}
                        className="flex items-center justify-between p-1.5 border rounded cursor-pointer"
                        onClick={() => handleJobClick(job)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {job["Job Title"] || "Untitled Job"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job["Job Location"] && `${job["Job Location"]}`}
                            {job["Employment Type"] && ` • ${job["Employment Type"]}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {job.Priority && (
                            <Badge variant="outline" className="text-sm px-1 py-0">
                              {job.Priority}
                  </Badge>
                          )}
                          <ArrowRight className="h-2.5 w-2.5 text-gray-400" />
                </div>
              </div>
                    ))}
                    {(!relatedJobs || relatedJobs.length === 0) && (
                      <div className="text-sm text-gray-500 text-center py-2">
                        No related jobs found
                      </div>
                    )}
                  </div>
                </ScrollArea>
            </CardContent>
          </Card>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-1.5 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                window.location.href = `/jobs?filter=${encodeURIComponent(company["Company Name"] || "")}`;
              }}
              className="flex-1 text-sm h-7"
            >
              <Briefcase className="h-2.5 w-2.5 mr-1" />
              View All Jobs ({relatedJobs?.length || 0})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                window.location.href = `/leads?filter=${encodeURIComponent(company["Company Name"] || "")}`;
              }}
              className="flex-1 text-sm h-7"
            >
              <Users className="h-2.5 w-2.5 mr-1" />
              View All People ({relatedLeads?.length || 0})
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Detail Modal */}
      {selectedJob && (
        <SimplifiedJobDetailModal
          job={selectedJob}
          isOpen={isJobModalOpen}
          onClose={() => {
            setIsJobModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={isLeadModalOpen}
          onClose={() => {
            setIsLeadModalOpen(false);
            setSelectedLead(null);
          }}
        />
      )}

      {/* Enhanced Automation Modal */}
      {showAutomationModal && (
        <Dialog open={showAutomationModal} onOpenChange={() => setShowAutomationModal(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" style={{ zIndex: 999999 }}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                LinkedIn Automation
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Company Info */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-medium text-blue-900">Company: {company.Company}</h3>
                <p className="text-sm text-blue-700">Industry: {company.Industry}</p>
              </div>

              {/* Campaign Selection */}
              <div className="space-y-2">
                <Label htmlFor="campaign-select" className="text-sm font-medium">
                  Select Campaign:
                </Label>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger id="campaign-select" className="w-full">
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
                              After Connection Message:
                            </Label>
                            <Textarea
                              id={`connected-${lead.id}`}
                              value={messages[lead.id]?.connected || ''}
                              onChange={(e) => handleMessageChange(lead.id, 'connected', e.target.value)}
                              className="mt-1 text-sm"
                              rows={3}
                              placeholder="Enter your message after they accept..."
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
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button 
                  variant="outline"
                  onClick={() => setShowAutomationModal(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmAutomation}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading || !selectedCampaign}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {loading ? "Starting Automation..." : "Start Automation"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
            </>
          );
        }