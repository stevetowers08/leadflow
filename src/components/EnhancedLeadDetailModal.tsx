import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CompanyDetailModal } from "@/components/CompanyDetailModal";
import { JobDetailModal } from "@/components/JobDetailModal";
import { 
  ExternalLink, 
  Zap, 
  User, 
  Building2, 
  Mail, 
  MapPin, 
  Star, 
  Calendar, 
  Briefcase, 
  Users,
  MessageSquare,
  Phone,
  Globe,
  TrendingUp,
  Activity,
  Clock,
  Target
} from "lucide-react";

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
  "Phone Number": string | null;
  "Last Contact Date": string | null;
  "Next Action Date": string | null;
  "Message Sent": boolean | null;
  "Connection Request": boolean | null;
  "LinkedIn Responded": boolean | null;
  "Email Reply": boolean | null;
  "Meeting Booked": boolean | null;
  automation_status_enum: string | null;
  created_at: string;
}

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedLeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
  const [isAutomating, setIsAutomating] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch related company data
  const { data: companyData } = useQuery({
    queryKey: ['company', lead?.Company],
    queryFn: async () => {
      if (!lead?.Company) return null;
      const { data, error } = await supabase
        .from('Companies')
        .select('*')
        .ilike('Company Name', lead.Company)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!lead?.Company && isOpen,
  });

  // Fetch related jobs from the same company
  const { data: relatedJobs } = useQuery({
    queryKey: ['company-jobs', lead?.Company],
    queryFn: async () => {
      if (!lead?.Company) return [];
      const { data, error } = await supabase
        .from('Jobs')
        .select('*')
        .ilike('Company', lead.Company)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!lead?.Company && isOpen,
  });

  // Fetch other leads from the same company
  const { data: relatedLeads } = useQuery({
    queryKey: ['company-leads', lead?.Company, lead?.id],
    queryFn: async () => {
      if (!lead?.Company || !lead?.id) return [];
      const { data, error } = await supabase
        .from('People')
        .select('*')
        .ilike('Company', lead.Company)
        .neq('id', lead.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!lead?.Company && !!lead?.id && isOpen,
  });

  if (!lead) return null;

  const handleCompanyClick = () => {
    if (companyData) {
      setSelectedCompany(companyData);
      setIsCompanyModalOpen(true);
    }
  };

  const handleJobClick = (job: any) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleAutomate = async () => {
    setIsAutomating(true);
    try {
      const { data, error } = await supabase.functions.invoke('trigger-automation', {
        body: {
          leadId: lead.id,
          leadData: {
            name: lead.Name,
            company: lead.Company,
            email: lead["Email Address"],
            stage: lead.stage_enum || lead.Stage,
            priority: lead.priority_enum,
            linkedinUrl: lead["LinkedIn URL"],
            leadScore: lead["Lead Score"]
          },
          action: 'lead_automation_trigger'
        }
      });

      if (error) throw error;

      toast({
        title: "Automation Started",
        description: `Automation workflow triggered for ${lead.Name}`,
      });
    } catch (error) {
      toast({
        title: "Automation Failed",
        description: "Failed to trigger automation workflow",
        variant: "destructive",
      });
    } finally {
      setIsAutomating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOutreachStatus = () => {
    if (lead["Meeting Booked"]) return { status: "Meeting Booked", color: "bg-green-100 text-green-800", icon: Calendar };
    if (lead["LinkedIn Responded"] || lead["Email Reply"]) return { status: "Responded", color: "bg-blue-100 text-blue-800", icon: MessageSquare };
    if (lead["Connection Request"]) return { status: "Connected", color: "bg-yellow-100 text-yellow-800", icon: Users };
    if (lead["Message Sent"]) return { status: "Message Sent", color: "bg-orange-100 text-orange-800", icon: MessageSquare };
    return { status: "No Outreach", color: "bg-gray-100 text-gray-800", icon: Clock };
  };

  const outreachStatus = getOutreachStatus();
  const StatusIcon = outreachStatus.icon;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="font-bold">{lead.Name}</div>
                <div className="text-sm font-normal text-muted-foreground">
                  {lead["Company Role"]} at {lead.Company}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status Overview */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <StatusBadge 
                      status={lead.Stage || lead.stage_enum || "NEW LEAD"} 
                      size="md"
                    />
                    <span className="text-sm font-medium">Stage</span>
                  </div>
                  
                  {lead.priority_enum && (
                    <div className="flex items-center gap-3">
                      <StatusBadge status={lead.priority_enum} size="md" />
                      <span className="text-sm font-medium">Priority</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <AIScoreBadge
                      leadData={{
                        name: lead.Name || "",
                        company: lead.Company || "",
                        role: lead["Company Role"] || "",
                        location: lead["Employee Location"] || "",
                        industry: companyData?.Industry,
                        company_size: companyData?.["Company Size"]
                      }}
                      initialScore={lead["Lead Score"] ? parseInt(lead["Lead Score"]) : undefined}
                      showDetails={false}
                    />
                    <span className="text-sm font-medium">AI Score</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={`${outreachStatus.color} border`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {outreachStatus.status}
                    </Badge>
                    <span className="text-sm font-medium">Outreach</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Lead Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lead["Email Address"] && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Email</div>
                            <a 
                              href={`mailto:${lead["Email Address"]}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {lead["Email Address"]}
                            </a>
                          </div>
                        </div>
                      )}

                      {lead["Phone Number"] && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Phone</div>
                            <a 
                              href={`tel:${lead["Phone Number"]}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {lead["Phone Number"]}
                            </a>
                          </div>
                        </div>
                      )}

                      {lead["Employee Location"] && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Location</div>
                            <div className="text-sm">{lead["Employee Location"]}</div>
                          </div>
                        </div>
                      )}

                      {lead["Company Role"] && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Briefcase className="h-4 w-4 text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">Role</div>
                            <div className="text-sm">{lead["Company Role"]}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* LinkedIn Profile */}
                {lead["LinkedIn URL"] && (
                  <Card className="shadow-sm border-blue-200 bg-blue-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="p-1 bg-blue-100 rounded">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        LinkedIn Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={lead["LinkedIn URL"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span className="text-sm">View LinkedIn Profile</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                )}

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
                      onClick={handleAutomate}
                      disabled={isAutomating}
                      className="w-full"
                      size="sm"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {isAutomating ? "Starting..." : "Start Automation"}
                    </Button>
                    
                    {lead["Email Address"] && (
                      <Button variant="outline" className="w-full" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    )}
                    
                    {lead["LinkedIn URL"] && (
                      <Button variant="outline" className="w-full" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        LinkedIn Message
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-muted-foreground">Added:</span>
                      <span>{formatDate(lead.created_at)}</span>
                    </div>
                    
                    {lead["Last Contact Date"] && (
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-muted-foreground">Last Contact:</span>
                        <span>{formatDate(lead["Last Contact Date"])}</span>
                      </div>
                    )}
                    
                    {lead["Next Action Date"] && (
                      <div className="flex items-center gap-3 text-sm">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="text-muted-foreground">Next Action:</span>
                        <span>{formatDate(lead["Next Action Date"])}</span>
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
                        Related Jobs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {relatedJobs.map((job) => (
                        <div 
                          key={job.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleJobClick(job)}
                        >
                          <div className="font-medium text-sm">{job["Job Title"]}</div>
                          <div className="text-xs text-muted-foreground">
                            {job["Job Location"]} • {job.Industry}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Related Leads */}
                {relatedLeads && relatedLeads.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Other Contacts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {relatedLeads.map((relatedLead) => (
                        <div key={relatedLead.id} className="p-3 border rounded-lg">
                          <div className="font-medium text-sm">{relatedLead.Name}</div>
                          <div className="text-xs text-muted-foreground">
                            {relatedLead["Company Role"]} • {relatedLead.Stage}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested Modals */}
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
    </>
  );
}


