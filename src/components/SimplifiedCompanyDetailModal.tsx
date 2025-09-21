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
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { SimplifiedJobDetailModal } from "./SimplifiedJobDetailModal";
import { LeadDetailModal } from "./LeadDetailModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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
      const { data, error } = await supabase
        .from("People")
        .select(`
          id,
          Name,
          "Company Role",
          "Lead Score",
          "Employee Location",
          automation_status_enum,
          "Message Sent",
          "Connection Request",
          "Email Reply",
          "Meeting Booked",
          created_at
        `)
        .eq("company_id", company.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }
      
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

  if (!company) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Building2 className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-900">
                  {company["Company Name"] || "Unknown Company"}
                </h1>
                <div className="text-sm text-gray-500">
                  {[company.Industry, company["Head Office"]].filter(Boolean).join(' • ')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {company.Priority && (
                  <Badge variant="outline" className="text-xs">
                    {company.Priority} Priority
                  </Badge>
                )}
                <StatusBadge status={company.status_enum} />
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {/* Company Overview - At the Top */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Basic Information */}
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Company Size</label>
                      <p className="text-sm text-gray-900">
                        {company["Company Size"] || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Industry</label>
                      <p className="text-sm text-gray-900">
                        {company.Industry || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Head Office</label>
                      <p className="text-sm text-gray-900">
                        {company["Head Office"] || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Website</label>
                      {company.Website ? (
                        <a 
                          href={company.Website.startsWith('http') ? company.Website : `https://${company.Website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {company.Website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">Not specified</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Created</label>
                      <p className="text-sm text-gray-900">
                        {company.created_at ? formatDate(company.created_at) : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Score */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
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
                  </div>
                  {company["Score Reason"] && (
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {company["Score Reason"]}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Intelligence */}
            {company["AI Info"] && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    AI Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">
                    {company["AI Info"]}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Related Jobs */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Related Jobs
                  <Badge variant="outline" className="ml-2 text-xs">
                    {relatedJobs?.length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-32">
                  <div className="space-y-1">
                    {relatedJobs?.map((job) => (
                      <div 
                        key={job.id}
                        className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer transition-colors group"
                        onClick={() => handleJobClick(job)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {job["Job Title"] || "Untitled Job"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {job["Job Location"] && `${job["Job Location"]}`}
                            {job["Employment Type"] && ` • ${job["Employment Type"]}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {job.Priority && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {job.Priority}
                            </Badge>
                          )}
                          <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </div>
                    ))}
                    {(!relatedJobs || relatedJobs.length === 0) && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No related jobs found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Related Leads */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Related People
                  <Badge variant="outline" className="ml-2 text-xs">
                    {relatedLeads?.length || 0}
                  </Badge>
                  {leadsLoading && <span className="text-xs text-gray-500">(Loading...)</span>}
                  {leadsError && <span className="text-xs text-red-500">(Error)</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-32">
                  <div className="space-y-1">
                    {relatedLeads?.map((lead) => (
                      <div 
                        key={lead.id}
                        className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer transition-colors group"
                        onClick={() => handleLeadClick(lead)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {lead.Name || "Unknown Lead"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {lead["Company Role"] && `${lead["Company Role"]}`}
                            {lead["Employee Location"] && ` • ${lead["Employee Location"]}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {lead.Priority && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {lead.Priority}
                            </Badge>
                          )}
                          <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </div>
                    ))}
                    {(!relatedLeads || relatedLeads.length === 0) && !leadsLoading && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No related people found
                      </div>
                    )}
                    {leadsLoading && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        Loading people...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                window.location.href = `/jobs?filter=${encodeURIComponent(company["Company Name"] || "")}`;
              }}
              className="flex-1 text-xs"
            >
              <Briefcase className="h-3 w-3 mr-1" />
              View All Jobs ({relatedJobs?.length || 0})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                window.location.href = `/leads?filter=${encodeURIComponent(company["Company Name"] || "")}`;
              }}
              className="flex-1 text-xs"
            >
              <Users className="h-3 w-3 mr-1" />
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
    </>
  );
}