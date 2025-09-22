import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { DynamicStatusBadge } from "@/components/DynamicStatusBadge";
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
  Info, 
  User, 
  Briefcase, 
  MessageSquare,
  TrendingUp,
  Target,
  Activity,
  Zap,
  Mail,
  Phone,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { JobDetailModal } from "@/components/JobDetailModal";
import { useState } from "react";
import { useCompanyStatus } from "@/hooks/useDynamicStatus";
import { isValidImageUrl, getCompanyLogoFallback } from "@/utils/logoUtils";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"People">;
type Job = Tables<"Jobs">;

interface CompanyDetailModalProps {
  company: Tables<"Companies">;
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedCompanyDetailModal({ company, isOpen, onClose }: CompanyDetailModalProps) {
  const companyId = company?.id ?? null;

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Dynamic status management
  const { status, leadCount, isLoading: statusLoading } = useCompanyStatus(company);

  // Fetch related leads
  const { data: relatedLeads, isLoading: leadsLoading } = useQuery({
    queryKey: ["company-leads", companyId],
    queryFn: async () => {
      if (!companyId) return [] as Lead[];
      const { data, error } = await supabase
        .from("People")
        .select(`
          id,
          "Name",
          "Stage",
          stage_enum,
          "Lead Score",
          "Company Role",
          "Email Address",
          "LinkedIn URL",
          "LinkedIn Request Message",
          "LinkedIn Connected Message", 
          "LinkedIn Follow Up Message",
          priority_enum,
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
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: Boolean(companyId && isOpen)
  });

  // Fetch related jobs
  const { data: relatedJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["company-jobs", companyId],
    queryFn: async () => {
      if (!companyId) return [] as Job[];
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
          "Lead Score",
          Industry,
          Function,
          created_at
        `)
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: Boolean(companyId && isOpen)
  });

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
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

  const getCompanyMetrics = () => {
    if (!relatedLeads) return { totalLeads: 0, activeLeads: 0, connectedLeads: 0, meetingsBooked: 0 };
    
    const totalLeads = relatedLeads.length;
    const activeLeads = relatedLeads.filter(l => l.stage_enum !== 'lost' && l.stage_enum !== 'closed').length;
    const connectedLeads = relatedLeads.filter(l => l["Connection Request"]).length;
    const meetingsBooked = relatedLeads.filter(l => l["Meeting Booked"]).length;
    
    return { totalLeads, activeLeads, connectedLeads, meetingsBooked };
  };

  const metrics = getCompanyMetrics();

  if (!company) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-full">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-bold">{company["Company Name"]}</div>
                <div className="text-sm font-normal text-muted-foreground">
                  {company.Industry} • {company["Company Size"]} employees
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Company Overview */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <DynamicStatusBadge
                      status={status}
                      leadCount={leadCount}
                      isLoading={statusLoading}
                      showLeadCount={true}
                      size="md"
                    />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  
                  {company["Priority"] && (
                    <div className="flex items-center gap-3">
                      <StatusBadge status={company["Priority"].toLowerCase()} size="md" />
                      <span className="text-sm font-medium">Priority</span>
                    </div>
                  )}
                  
                  {company["Lead Score"] && (
                    <div className="flex items-center gap-3">
                      <AIScoreBadge
                        leadData={{
                          name: "Company Lead",
                          company: company["Company Name"] || "",
                          role: "Decision Maker",
                          location: company["Head Office"] || "",
                          industry: company.Industry,
                          company_size: company["Company Size"]
                        }}
                        initialScore={company["Lead Score"] ? parseInt(company["Lead Score"]) : undefined}
                        showDetails={false}
                      />
                      <span className="text-sm font-medium">AI Score</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-800 border">
                      <Users className="h-3 w-3 mr-1" />
                      {metrics.totalLeads} Leads
                    </Badge>
                    <span className="text-sm font-medium">Pipeline</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Company Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Details */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Company Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company["Industry"] && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Building2 className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Industry</div>
                            <div className="text-sm">{company["Industry"]}</div>
                          </div>
                        </div>
                      )}

                      {company["Company Size"] && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Users className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Company Size</div>
                            <div className="text-sm">{company["Company Size"]} employees</div>
                          </div>
                        </div>
                      )}

                      {company["Head Office"] && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Head Office</div>
                            <div className="text-sm">{company["Head Office"]}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="text-sm font-medium">Added</div>
                          <div className="text-sm">{formatDate(company.created_at)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Website & Contact */}
                {company["Website"] && (
                  <Card className="shadow-sm border-blue-200 bg-blue-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Website & Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={company["Website"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span className="text-sm">Visit Company Website</span>
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
                      Pipeline Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{metrics.totalLeads}</div>
                        <div className="text-xs text-muted-foreground">Total Leads</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{metrics.activeLeads}</div>
                        <div className="text-xs text-muted-foreground">Active</div>
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
                      Automate Leads ({selectedLeads.length})
                    </Button>
                    
                    {company["Website"] && (
                      <Button variant="outline" className="w-full" size="sm">
                        <Globe className="h-4 w-4 mr-2" />
                        Research Company
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full" size="sm">
                      <Target className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-muted-foreground">Company Added:</span>
                      <span>{formatDate(company.created_at)}</span>
                    </div>
                    
                    {relatedLeads && relatedLeads.length > 0 && (
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-muted-foreground">Latest Lead:</span>
                        <span>{formatDate(relatedLeads[0].created_at)}</span>
                      </div>
                    )}
                    
                    {relatedJobs && relatedJobs.length > 0 && (
                      <div className="flex items-center gap-3 text-sm">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span className="text-muted-foreground">Latest Job:</span>
                        <span>{formatDate(relatedJobs[0].created_at)}</span>
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
                        Open Jobs ({relatedJobs.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <ScrollArea className="h-48">
                        {relatedJobs.map((job) => (
                          <div 
                            key={job.id}
                            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors mb-2"
                            onClick={() => handleJobClick(job)}
                          >
                            <div className="font-medium text-sm">{job["Job Title"]}</div>
                            <div className="text-xs text-muted-foreground">
                              {job["Job Location"]} • {job.Industry}
                            </div>
                            {job["Lead Score"] && (
                              <div className="mt-1">
                                <AIScoreBadge
                                  leadData={{
                                    name: "Job Candidate",
                                    company: company["Company Name"] || "",
                                    role: job["Job Title"] || "",
                                    location: job["Job Location"] || "",
                                    industry: job.Industry,
                                    company_size: company["Company Size"]
                                  }}
                                  initialScore={job["Lead Score"] ? parseInt(job["Lead Score"]) : undefined}
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

            {/* Leads Section */}
            {relatedLeads && relatedLeads.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Company Leads ({relatedLeads.length})
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
                                    company: company["Company Name"] || "",
                                    role: lead["Company Role"] || "",
                                    location: lead["Employee Location"] || "",
                                    industry: company.Industry,
                                    company_size: company["Company Size"]
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

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={isJobModalOpen}
          onClose={() => {
            setIsJobModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}

      {showConfirmation && (
        <LinkedInConfirmationModal
          selectedLeads={selectedLeads}
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmAutomation}
          jobTitle="Company Outreach"
          companyName={company["Company Name"]}
        />
      )}
    </>
  );
}


