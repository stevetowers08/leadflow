import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LinkedInConfirmationModal } from "@/components/LinkedInConfirmationModal";
import { 
  Building2, 
  ExternalLink, 
  MapPin, 
  Users, 
  Star, 
  Calendar, 
  Globe, 
  Briefcase, 
  MessageSquare,
  TrendingUp,
  Target,
  Activity,
  Zap,
  Mail,
  Clock,
  DollarSign,
  Clock3,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { CompanyDetailModal } from "@/components/CompanyDetailModal";
import { useState } from "react";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"People">;
type Company = Tables<"Companies">;

interface JobDetailModalProps {
  job: Tables<"Jobs">;
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedJobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  const [selectedLeads, setSelectedLeads] = useState<any[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Fetch related company data
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
          "Automation Status",
          automation_status_enum,
          "Message Sent",
          "Connection Request",
          "LinkedIn Responded",
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

  // Fetch other jobs from the same company
  const { data: relatedJobs } = useQuery({
    queryKey: ["company-jobs", job?.Company, job?.id],
    queryFn: async () => {
      if (!job?.Company || !job?.id) return [];
      const { data, error } = await supabase
        .from("Jobs")
        .select("*")
        .ilike("Company", job.Company)
        .neq("id", job.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!job?.Company && !!job?.id && isOpen,
  });

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleCompanyClick = () => {
    if (companyData) {
      setSelectedCompany(companyData);
      setIsCompanyModalOpen(true);
    }
  };

  const handleLeadSelect = (leadId: string, checked: boolean) => {
    const lead = relatedLeads?.find(l => l.id === leadId);
    if (!lead) return;

    if (checked) {
      setSelectedLeads(prev => [...prev, lead]);
    } else {
      setSelectedLeads(prev => prev.filter(l => l.id !== leadId));
    }
  };

  const handleAddToAutomation = () => {
    if (selectedLeads.length > 0) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmAutomation = () => {
    setSelectedLeads([]);
    setShowConfirmation(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isJobExpired = job?.["Valid Through"] && new Date(job["Valid Through"]) < new Date();
  const daysRemaining = job?.["Valid Through"] 
    ? Math.ceil((new Date(job["Valid Through"]).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getJobMetrics = () => {
    if (!relatedLeads) return { totalLeads: 0, qualifiedLeads: 0, connectedLeads: 0, meetingsBooked: 0 };
    
    const totalLeads = relatedLeads.length;
    const qualifiedLeads = relatedLeads.filter(l => l.stage_enum === 'qualified' || l.stage_enum === 'interview').length;
    const connectedLeads = relatedLeads.filter(l => l["Connection Request"]).length;
    const meetingsBooked = relatedLeads.filter(l => l["Meeting Booked"]).length;
    
    return { totalLeads, qualifiedLeads, connectedLeads, meetingsBooked };
  };

  const metrics = getJobMetrics();

  if (!job) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-purple-100 rounded-full">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="font-bold">{job?.["Job Title"] || "Untitled Job"}</div>
                <div className="text-sm font-normal text-muted-foreground">
                  {job?.Company || "Unknown Company"} • {job?.["Job Location"] || "Location not specified"}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Job Overview */}
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {job?.Priority && (
                    <div className="flex items-center gap-3">
                      <StatusBadge status={job.Priority.toLowerCase()} size="md" />
                      <span className="text-sm font-medium">Priority</span>
                    </div>
                  )}
                  
                  {job?.["Lead Score"] && (
                    <div className="flex items-center gap-3">
                      <AIScoreBadge
                        leadData={{
                          name: "Job Candidate",
                          company: job?.Company || "",
                          role: job?.["Job Title"] || "",
                          location: job?.["Job Location"] || "",
                          industry: job?.Industry,
                          company_size: companyData?.["Company Size"]
                        }}
                        initialScore={job?.["Lead Score"] ? parseInt(job["Lead Score"]) : undefined}
                        showDetails={false}
                      />
                      <span className="text-sm font-medium">AI Score</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-800 border">
                      <Users className="h-3 w-3 mr-1" />
                      {metrics.totalLeads} Candidates
                    </Badge>
                    <span className="text-sm font-medium">Pipeline</span>
                  </div>
                  
                  {isJobExpired ? (
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">Expired</Badge>
                      <span className="text-sm font-medium">Status</span>
                    </div>
                  ) : daysRemaining !== null && daysRemaining <= 7 ? (
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        {daysRemaining <= 0 ? "Expires today" : `${daysRemaining} days left`}
                      </Badge>
                      <span className="text-sm font-medium">Expiry</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-100 text-green-800 border">Active</Badge>
                      <span className="text-sm font-medium">Status</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Job Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Details */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Job Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job?.["Job Location"] && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Location</div>
                            <div className="text-sm">{job["Job Location"]}</div>
                          </div>
                        </div>
                      )}

                      {job?.Industry && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Building2 className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Industry</div>
                            <div className="text-sm">{job.Industry}</div>
                          </div>
                        </div>
                      )}

                      {job?.Function && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Target className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Function</div>
                            <div className="text-sm">{job.Function}</div>
                          </div>
                        </div>
                      )}

                      {job?.["Employment Type"] && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Clock3 className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Employment Type</div>
                            <div className="text-sm">{job["Employment Type"]}</div>
                          </div>
                        </div>
                      )}

                      {job?.Salary && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <DollarSign className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Salary</div>
                            <div className="text-sm">{job.Salary}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="text-sm font-medium">Posted</div>
                          <div className="text-sm">{job?.["Posted Date"] ? formatDate(job["Posted Date"]) : formatDate(job?.created_at || new Date().toISOString())}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Information */}
                {companyData && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Company Information
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCompanyClick}
                          className="ml-auto h-7 px-3 text-xs"
                        >
                          View Details
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {companyData.Industry && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="text-muted-foreground">Industry:</span>
                            <span>{companyData.Industry}</span>
                          </div>
                        )}
                        {companyData["Company Size"] && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-muted-foreground">Size:</span>
                            <span>{companyData["Company Size"]}</span>
                          </div>
                        )}
                        {companyData["Head Office"] && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-muted-foreground">Location:</span>
                            <span>{companyData["Head Office"]}</span>
                          </div>
                        )}
                        {companyData["Website"] && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <span className="text-muted-foreground">Website:</span>
                            <a 
                              href={companyData["Website"]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Job URL */}
                {job?.["Job URL"] && (
                  <Card className="shadow-sm border-blue-200 bg-blue-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ExternalLink className="h-5 w-5" />
                        Job Posting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={job["Job URL"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span className="text-sm">View Original Job Posting</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                )}

                {/* Pipeline Metrics */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Candidate Pipeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{metrics.totalLeads}</div>
                        <div className="text-xs text-muted-foreground">Total Candidates</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{metrics.qualifiedLeads}</div>
                        <div className="text-xs text-muted-foreground">Qualified</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{metrics.connectedLeads}</div>
                        <div className="text-xs text-muted-foreground">Connected</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{metrics.meetingsBooked}</div>
                        <div className="text-xs text-muted-foreground">Meetings</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Actions & Related */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={handleAddToAutomation}
                      disabled={selectedLeads.length === 0}
                      className="w-full"
                      size="sm"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Automate Candidates ({selectedLeads.length})
                    </Button>
                    
                    {job?.["Job URL"] && (
                      <Button variant="outline" className="w-full" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Job Posting
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full" size="sm">
                      <Target className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </CardContent>
                </Card>

                {/* Job Status */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Job Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-muted-foreground">Posted:</span>
                      <span>{job?.["Posted Date"] ? formatDate(job["Posted Date"]) : formatDate(job?.created_at || new Date().toISOString())}</span>
                    </div>
                    
                    {job?.["Valid Through"] && (
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-muted-foreground">Valid Until:</span>
                        <span>{formatDate(job["Valid Through"])}</span>
                      </div>
                    )}
                    
                    {daysRemaining !== null && (
                      <div className="flex items-center gap-3 text-sm">
                        {isJobExpired ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : daysRemaining <= 7 ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-muted-foreground">Status:</span>
                        <span className={isJobExpired ? "text-red-600" : daysRemaining <= 7 ? "text-yellow-600" : "text-green-600"}>
                          {isJobExpired ? "Expired" : daysRemaining <= 0 ? "Expires today" : `${daysRemaining} days left`}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Related Jobs */}
                {relatedJobs && relatedJobs.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Other Jobs ({relatedJobs.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <ScrollArea className="h-48">
                        {relatedJobs.map((relatedJob) => (
                          <div key={relatedJob.id} className="p-3 border rounded-lg mb-2">
                            <div className="font-medium text-sm">{relatedJob["Job Title"]}</div>
                            <div className="text-xs text-muted-foreground">
                              {relatedJob["Job Location"]} • {relatedJob.Industry}
                            </div>
                            {relatedJob["Lead Score"] && (
                              <div className="mt-1">
                                <AIScoreBadge
                                  leadData={{
                                    name: "Job Candidate",
                                    company: relatedJob.Company || "",
                                    role: relatedJob["Job Title"] || "",
                                    location: relatedJob["Job Location"] || "",
                                    industry: relatedJob.Industry,
                                    company_size: companyData?.["Company Size"]
                                  }}
                                  initialScore={relatedJob["Lead Score"] ? parseInt(relatedJob["Lead Score"]) : undefined}
                                  showDetails={false}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Candidates Section */}
            {relatedLeads && relatedLeads.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Potential Candidates ({relatedLeads.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {relatedLeads.map((lead) => (
                        <div 
                          key={lead.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleLeadClick(lead)}
                        >
                          <div className="flex items-center justify-between">
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
                                    company_size: companyData?.["Company Size"]
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested Modals */}
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

      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          isOpen={isCompanyModalOpen}
          onClose={() => {
            setIsCompanyModalOpen(false);
            setSelectedCompany(null);
          }}
        />
      )}

      {showConfirmation && (
        <LinkedInConfirmationModal
          selectedLeads={selectedLeads}
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmAutomation}
          jobTitle={job?.["Job Title"] || "Untitled Job"}
          companyName={job?.Company || "Unknown Company"}
        />
      )}
    </>
  );
}
