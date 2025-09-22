import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { DynamicStatusBadge } from "@/components/DynamicStatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LinkedInConfirmationModal } from "@/components/LinkedInConfirmationModal";
import { Building2, ExternalLink, MapPin, Users, Star, Calendar, Globe, Info, User, Briefcase, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { JobDetailModal } from "@/components/JobDetailModal";
import { useState } from "react";
import { useCompanyStatus } from "@/hooks/useDynamicStatus";
import { isValidImageUrl, getCompanyLogoFallback } from "@/utils/logoUtils";
import type { Tables } from "@/integrations/supabase/types";

// Type definitions for the component
type Lead = Tables<"People">;
type Job = Tables<"Jobs">;

interface Company {
  id: string;
  "Company Name": string;
  "Industry": string | null;
  "Website": string | null;
  "Company Size": string | null;
  "Head Office": string | null;
  "Lead Score": number | null;
  "Priority": string | null;
  "STATUS": string | null;
  "Company Info": string | null;
  "LinkedIn URL": string | null;
  "Profile Image URL": string | null;
  created_at: string;
}

interface CompanyDetailModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailModal({ company, isOpen, onClose }: CompanyDetailModalProps) {
  // Always call hooks unconditionally. Use guards in queries instead of early returns.
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
    // Optionally refresh the leads data
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/50 dark:border-green-800";
    if (score >= 60) return "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/50 dark:border-yellow-800";
    if (score >= 40) return "text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/50 dark:border-orange-800";
    return "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/50 dark:border-red-800";
  };

  if (!company) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                {company["Company Name"]}
              </div>
              <div className="flex items-center gap-2">
                <DynamicStatusBadge
                  status={status}
                  leadCount={leadCount}
                  isLoading={statusLoading}
                  showLeadCount={true}
                  size="md"
                />
                {company["Priority"] && (
                  <StatusBadge status={company["Priority"].toLowerCase()} size="md" />
                )}
                {company["Lead Score"] && (
                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getScoreColor(company["Lead Score"])}`}>
                    Score: {company["Lead Score"]}
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">

            {/* Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Company Details</h3>
                
                {company["Industry"] && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{company["Industry"]}</span>
                  </div>
                )}

                {company["Company Size"] && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{company["Company Size"]} employees</span>
                  </div>
                )}

                {company["Head Office"] && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{company["Head Office"]}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Added {formatDate(company.created_at)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Contact Info</h3>
                
                {company["Website"] && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={company["Website"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {company["Website"]}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {company["LinkedIn URL"] && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
                    </svg>
                    <a 
                      href={company["LinkedIn URL"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      LinkedIn Profile
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Company Information */}
            {company["Company Info"] && (
              <div className="p-6 bg-muted/20 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <h3 className="text-lg font-medium text-foreground">Company Information</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {company["Company Info"]}
                </p>
              </div>
            )}

            {/* Related Leads */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground">
                  Related Leads ({relatedLeads?.length || 0})
                </h3>
                </div>
                {selectedLeads.length > 0 && (
                  <Button 
                    size="sm" 
                    onClick={handleAddToAutomation}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Add {selectedLeads.length} to Automation
                  </Button>
                )}
              </div>
              
              {leadsLoading ? (
                <div className="text-sm text-muted-foreground">Loading leads...</div>
              ) : relatedLeads && relatedLeads.length > 0 ? (
                <ScrollArea className="max-h-64">
                  <div className="space-y-3 pr-4">
                    {relatedLeads.map((lead) => (
                      <div key={lead.id} className="space-y-2">
                        <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                          <Checkbox
                            id={`company-lead-${lead.id}`}
                            checked={selectedLeads.some(l => l.id === lead.id)}
                            onCheckedChange={(checked) => handleLeadSelect(lead.id, checked as boolean)}
                            disabled={lead["Automation Status"] === "ACTIVE" || lead["Automation Status"] === "PENDING"}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <label 
                                htmlFor={`company-lead-${lead.id}`}
                                className="font-medium text-sm cursor-pointer flex items-center gap-2"
                              >
                                {lead["Name"]}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLeadClick(lead);
                                  }}
                                  className="text-xs text-primary hover:underline"
                                >
                                  View Details
                                </button>
                              </label>
                              <StatusBadge 
                                status={lead["Stage"] || lead.stage_enum || "NEW LEAD"} 
                                size="sm"
                              />
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground mt-1">
                              {lead["Company Role"] && (
                                <div>{lead["Company Role"]}</div>
                              )}
                              {lead["Email Address"] && (
                                <div>{lead["Email Address"]}</div>
                              )}
                              {lead["Lead Score"] && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  Score: {lead["Lead Score"]}
                                </div>
                              )}
                              {lead["Automation Status"] && (
                                <div className="text-orange-600">
                                  Automation: {lead["Automation Status"]}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-sm text-muted-foreground">No leads found for this company.</div>
              )}
            </div>

            {/* Related Jobs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground">
                  Related Jobs ({relatedJobs?.length || 0})
                </h3>
              </div>
              
              {jobsLoading ? (
                <div className="text-sm text-muted-foreground">Loading jobs...</div>
              ) : relatedJobs && relatedJobs.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {relatedJobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="p-3 bg-muted/20 rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => handleJobClick(job)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{job["Job Title"]}</span>
                        {job.status_enum && (
                          <StatusBadge 
                            status={job.status_enum} 
                            size="sm"
                          />
                        )}
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {job["Job Location"] && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job["Job Location"]}
                          </div>
                        )}
                        {job["Employment Type"] && (
                          <div>{job["Employment Type"]}</div>
                        )}
                        {job["Salary"] && (
                          <div>{job["Salary"]}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No jobs found for this company.</div>
              )}
            </div>


            {/* Action Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LeadDetailModal
        lead={selectedLead}
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setSelectedLead(null);
        }}
      />

      <JobDetailModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={() => {
          setIsJobModalOpen(false);
          setSelectedJob(null);
        }}
      />

      <LinkedInConfirmationModal
        selectedLeads={selectedLeads}
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmAutomation}
        companyName={company["Company Name"]}
      />
    </>
  );
}