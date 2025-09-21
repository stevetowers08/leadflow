import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  TrendingUp,
  Target,
  Eye,
  Bot,
  Info
} from "lucide-react";
import { useState } from "react";
import { SimplifiedJobDetailModal } from "./SimplifiedJobDetailModal";
import { SimplifiedLeadDetailModal } from "./SimplifiedLeadDetailModal";
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
          Company,
          "Job Location",
          Industry,
          "Lead Score",
          "Posted Date",
          "Valid Through",
          Priority,
          "Employment Type",
          status_enum,
          created_at
        `)
        .ilike("Company", `%${company["Company Name"]}%`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && isOpen,
  });

  // Fetch related leads for this company
  const { data: relatedLeads } = useQuery({
    queryKey: ["company-leads", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("People")
        .select(`
          id,
          Name,
          Company,
          "Company Role",
          "Email Address", 
          "LinkedIn URL",
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
        .ilike("Company", `%${company["Company Name"]}%`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
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
            <div className="p-2 bg-gray-100 rounded-lg">
              <Building2 className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-medium text-gray-900">
                {company["Company Name"] || "Unknown Company"}
              </h1>
              <div className="text-sm text-gray-600">
                {company.Industry && `${company.Industry}`}
                {company["Head Office"] && ` • ${company["Head Office"]}`}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {company.Priority && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs font-medium px-2 py-1">
                  {company.Priority}
                </Badge>
              )}
              <StatusBadge status={company.status_enum} />
            </div>
          </DialogTitle>
        </DialogHeader>

          <div className="space-y-4">
            {/* Company Details - Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Company Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-600 text-sm font-medium">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">
                        {company["Company Size"] && `${company["Company Size"]}`}
                        {company.Industry && ` • ${company.Industry}`}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        {company["Head Office"] && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {company["Head Office"]}
                          </span>
                        )}
                        {company.Website && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Website
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600">
                          {company.created_at ? formatDate(company.created_at) : "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
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
                    </div>
                  </div>
                  
                  {/* Website URL */}
                  {company.Website && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-3 w-3 text-gray-500" />
                      <a 
                        href={company.Website.startsWith('http') ? company.Website : `https://${company.Website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {company.Website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Intelligence */}
            {(company["AI Info"] || company["Company Info"] || company["Score Reason"]) && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    AI Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {company["AI Info"] && (
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-sm text-purple-700">{company["AI Info"]}</div>
                      </div>
                    )}
                    {company["Company Info"] && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm text-green-700">{company["Company Info"]}</div>
                      </div>
                    )}
                    {company["Score Reason"] && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-700">{company["Score Reason"]}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Jobs */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Related Jobs ({relatedJobs?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {relatedJobs?.map((job) => (
                      <div 
                        key={job.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => handleJobClick(job)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {job["Job Title"] || "Untitled Job"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {job["Job Location"] && `${job["Job Location"]}`}
                            {job["Employment Type"] && ` • ${job["Employment Type"]}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.Priority && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs px-2 py-1">
                              {job.Priority}
                            </Badge>
                          )}
                          <Eye className="h-3 w-3 text-gray-400" />
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
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Related Leads ({relatedLeads?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {relatedLeads?.map((lead) => (
                      <div 
                        key={lead.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => handleLeadClick(lead)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {lead["Full Name"] || "Unknown Lead"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {lead["Job Title"] && `${lead["Job Title"]}`}
                            {lead["Location"] && ` • ${lead["Location"]}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {lead.Priority && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs px-2 py-1">
                              {lead.Priority}
                            </Badge>
                          )}
                          <Eye className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    ))}
                    {(!relatedLeads || relatedLeads.length === 0) && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No related leads found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                window.location.href = `/jobs?filter=${encodeURIComponent(company["Company Name"] || "")}`;
              }}
              className="flex-1"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              View All Jobs ({relatedJobs?.length || 0})
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                window.location.href = `/leads?filter=${encodeURIComponent(company["Company Name"] || "")}`;
              }}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              View All People ({relatedLeads?.length || 0})
            </Button>
          </div>

          {/* Company Details - Compact */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {company.Industry && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-muted-foreground">Industry:</span>
                    <span>{company.Industry}</span>
                  </div>
                )}
                
                {company["Company Size"] && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-muted-foreground">Size:</span>
                    <span>{company["Company Size"]}</span>
                  </div>
                )}
                
                {company["Head Office"] && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-muted-foreground">Location:</span>
                    <span>{company["Head Office"]}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-muted-foreground">Added:</span>
                  <span>{formatDate(company.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Jobs */}
          {relatedJobs && relatedJobs.length > 0 && (
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Recent Jobs ({relatedJobs.length})
                  </h3>
                </div>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {relatedJobs.map((job) => (
                      <div key={job.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{job["Job Title"]}</div>
                            <div className="text-xs text-muted-foreground">
                              {job["Job Location"]} • {job.Industry} • {job["Employment Type"]}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Posted {formatDate(job["Posted Date"] || job.created_at)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {job.Priority && (
                              <StatusBadge status={job.Priority.toLowerCase()} size="sm" />
                            )}
                            {job["Lead Score"] && (
                              <Badge variant="outline" className="text-xs">
                                Score: {job["Lead Score"]}
                              </Badge>
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

          {/* Recent Leads */}
          {relatedLeads && relatedLeads.length > 0 && (
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Recent Leads ({relatedLeads.length})
                  </h3>
                </div>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {relatedLeads.map((lead) => (
                      <div key={lead.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{lead.Name}</div>
                            <div className="text-xs text-muted-foreground">
                              {lead["Company Role"]} • {lead["Employee Location"]}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Added {formatDate(lead.created_at)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge 
                              status={lead.stage_enum || lead.Stage?.toLowerCase() || "new"} 
                              size="sm"
                            />
                            {lead["Lead Score"] && (
                              <Badge variant="outline" className="text-xs">
                                Score: {lead["Lead Score"]}
                              </Badge>
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
      <SimplifiedLeadDetailModal
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
