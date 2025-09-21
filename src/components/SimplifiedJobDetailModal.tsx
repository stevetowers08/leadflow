import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LinkedInConfirmationModal } from "./LinkedInConfirmationModal";
import type { Tables } from "@/integrations/supabase/types";

interface SimplifiedJobDetailModalProps {
  job: Tables<"Jobs">;
  isOpen: boolean;
  onClose: () => void;
}

export function SimplifiedJobDetailModal({ job, isOpen, onClose }: SimplifiedJobDetailModalProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedLeadsForAutomation, setSelectedLeadsForAutomation] = useState<any[]>([]);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const { toast } = useToast();

  // Fetch company data
  const { data: companyData } = useQuery({
    queryKey: ["job-company", job?.Company],
    queryFn: async () => {
      if (!job?.Company) return null;
      const { data, error } = await supabase
        .from("Companies")
        .select("*")
        .ilike("Company Name", `%${job.Company}%`)
        .limit(1);

      if (error) throw error;
      return data?.[0];
    },
    enabled: !!job?.Company && isOpen
  });

  // Fetch related leads for this job's company
  const { data: relatedLeads, isLoading: leadsLoading } = useQuery({
    queryKey: ["job-leads", job?.Company],
    queryFn: async () => {
      if (!job?.Company) return [];
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

      if (error) throw error;
      return data || [];
    },
    enabled: !!job?.Company && isOpen
  });

  const handleLeadSelect = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(relatedLeads?.map(lead => lead.id) || []);
    } else {
      setSelectedLeads([]);
    }
  };

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
        description: "Please select at least one person to automate",
        variant: "destructive",
      });
      return;
    }
    setShowAutomationModal(true);
  };

  const handleConfirmAutomation = () => {
    setShowAutomationModal(false);
    setSelectedLeadsForAutomation([]);
    toast({
      title: "Success",
      description: `Automation triggered for ${selectedLeadsForAutomation.length} people`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isJobExpired = job?.["Valid Through"] && new Date(job["Valid Through"]) < new Date();
  const daysRemaining = job?.["Valid Through"] 
    ? Math.ceil((new Date(job["Valid Through"]).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3">
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
            <div className="flex items-center gap-2">
              {job?.Priority && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs font-medium px-2 py-1">
                  {job.Priority}
                </Badge>
              )}
              {isJobExpired ? (
                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs font-medium px-2 py-1">Expired</Badge>
              ) : daysRemaining !== null && daysRemaining <= 7 ? (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs font-medium px-2 py-1">
                  {daysRemaining <= 0 ? "Expires today" : `${daysRemaining}d left`}
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium px-2 py-1">Active</Badge>
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
                        {job?.["Posted Date"] ? formatDate(job["Posted Date"]) : formatDate(job?.created_at || new Date().toISOString())}
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
                
                {/* Job URL */}
                {job?.["Job URL"] && (
                  <div className="flex items-center gap-2 text-sm">
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

          {/* Company Information - Clickable */}
          {companyData && (
            <Card 
              className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                onClose();
                window.location.href = `/companies?filter=${encodeURIComponent(companyData["Company Name"] || "")}`;
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  {companyData.Logo ? (
                    <img src={companyData.Logo} alt="Company logo" className="w-10 h-10 rounded object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-600 text-sm font-medium">
                      {companyData["Company Name"]?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
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
                      <AIScoreBadge
                        leadData={{
                          name: "Job Candidate",
                          company: job?.Company || "",
                          role: job?.["Job Title"] || "",
                          location: job?.["Job Location"] || "",
                          industry: job?.Industry,
                          company_size: "Unknown"
                        }}
                        initialScore={job?.["Lead Score"] ? parseInt(job["Lead Score"]) : undefined}
                        showDetails={false}
                      />
                    )}
                    <Badge className="bg-blue-100 text-blue-800 border text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {relatedLeads?.length || 0} Leads
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leads Section with Multi-Select */}
          {relatedLeads && relatedLeads.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader 
                className="pb-2 cursor-pointer hover:bg-gray-50 transition-colors"
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
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {relatedLeads.map((lead) => (
                      <div 
                        key={lead.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
                              <AIScoreBadge
                                leadData={{
                                  name: lead.Name || "",
                                  company: job.Company || "",
                                  role: lead["Company Role"] || "",
                                  location: lead["Employee Location"] || "",
                                  industry: job.Industry,
                                  company_size: "Unknown"
                                }}
                                initialScore={lead["Lead Score"] ? parseInt(lead["Lead Score"]) : undefined}
                                showDetails={false}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedLeadsForAutomation.length} of {relatedLeads?.length || 0} leads selected
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                onClick={handleAutomateLeads}
                disabled={selectedLeadsForAutomation.length === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Automate {selectedLeadsForAutomation.length} Leads
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* LinkedIn Confirmation Modal */}
    {showAutomationModal && (
      <LinkedInConfirmationModal
        selectedLeads={selectedLeadsForAutomation}
        isOpen={showAutomationModal}
        onClose={() => setShowAutomationModal(false)}
        onConfirm={handleConfirmAutomation}
        jobTitle={job["Job Title"]}
        companyName={job.Company}
      />
    )}
  );
}
