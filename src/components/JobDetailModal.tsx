import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LinkedInConfirmationModal } from "@/components/LinkedInConfirmationModal";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { CompanyDetailModal } from "@/components/CompanyDetailModal";
import { Building2, MapPin, Clock, DollarSign, Calendar, Briefcase, Star, Users, User, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Job {
  id: string;
  "Job Title": string;
  Company: string;
  Logo: string | null;
  "Job Location": string | null;
  Industry: string | null;
  Function: string | null;
  "Lead Score": number | null;
  "Score Reason (from Company)": string | null;
  "Posted Date": string | null;
  "Valid Through": string | null;
  Priority: string | null;
  "Job Description": string | null;
  "Employment Type": string | null;
  Salary: string | null;
  created_at: string;
}

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  const [selectedLeads, setSelectedLeads] = useState<any[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  if (!job) return null;

  // Fetch related company data
  const { data: companyData } = useQuery({
    queryKey: ["job-company", job.Company],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Companies")
        .select("*")
        .ilike("Company Name", `%${job.Company}%`)
        .limit(1);

      if (error) throw error;
      return data?.[0];
    },
    enabled: !!job.Company && isOpen
  });

  // Fetch related leads for this job's company
  const { data: relatedLeads, isLoading: leadsLoading } = useQuery({
    queryKey: ["job-leads", job.Company],
    queryFn: async () => {
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
          "Automation Status"
        `)
        .ilike("Company", `%${job.Company}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!job.Company && isOpen
  });

  // Fetch other jobs from the same company
  const { data: otherJobs } = useQuery({
    queryKey: ["company-other-jobs", job.Company, job.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Jobs")
        .select(`
          id,
          "Job Title",
          "Job Location",
          "Posted Date",
          "Employment Type",
          Salary,
          Priority,
          created_at
        `)
        .ilike("Company", `%${job.Company}%`)
        .neq("id", job.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!job.Company && isOpen
  });

  const handleLeadSelect = (leadId: string, checked: boolean) => {
    const lead = relatedLeads?.find(l => l.id === leadId);
    if (!lead) return;

    if (checked) {
      setSelectedLeads(prev => [...prev, lead]);
    } else {
      setSelectedLeads(prev => prev.filter(l => l.id !== leadId));
    }
  };

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
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    if (score >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const isJobExpired = job["Valid Through"] && new Date(job["Valid Through"]) < new Date();
  const daysRemaining = job["Valid Through"] 
    ? Math.ceil((new Date(job["Valid Through"]).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {job.Logo ? (
                <img src={job.Logo} alt="Company logo" className="w-8 h-8 rounded object-cover" />
              ) : (
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div>
                <div className="font-semibold">{job["Job Title"]}</div>
                <button
                  onClick={handleCompanyClick}
                  className="text-sm text-primary hover:underline text-left"
                >
                  {job.Company}
                </button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
            {job.Priority && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Priority:</span>
                <StatusBadge status={job.Priority.toLowerCase()} size="md" />
              </div>
            )}
            {job["Lead Score"] && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(job["Lead Score"])}`}>
                  Score: {job["Lead Score"]}
                </span>
              </div>
            )}
            {isJobExpired ? (
              <Badge variant="destructive">Expired</Badge>
            ) : daysRemaining !== null && daysRemaining <= 7 && (
              <Badge variant="secondary">
                {daysRemaining <= 0 ? "Expires today" : `${daysRemaining} days left`}
              </Badge>
            )}
          </div>

          {/* Job Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Job Details</h3>
              
              {job["Job Location"] && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job["Job Location"]}</span>
                </div>
              )}

              {job.Industry && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.Industry}</span>
                </div>
              )}

              {job.Function && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.Function}</span>
                </div>
              )}

              {job["Employment Type"] && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job["Employment Type"]}</span>
                </div>
              )}

              {job.Salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.Salary}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Timeline</h3>
              
              {job["Posted Date"] && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Posted {formatDate(job["Posted Date"])}</span>
                </div>
              )}

              {job["Valid Through"] && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm ${isJobExpired ? 'text-red-600' : ''}`}>
                    {isJobExpired ? "Expired" : "Valid until"} {formatDate(job["Valid Through"])}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Added {formatDate(job.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          {job["Job Description"] && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Job Description</h3>
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {job["Job Description"]}
                </div>
              </div>
            </div>
          )}

          {/* Score Reason */}
          {job["Score Reason (from Company)"] && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Score Analysis</h3>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-900 leading-relaxed">
                  {job["Score Reason (from Company)"]}
                </div>
              </div>
            </div>
          )}

          {/* Related Leads */}
          {relatedLeads && relatedLeads.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Available Leads ({relatedLeads.length})
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
              ) : (
                <ScrollArea className="max-h-64">
                  <div className="space-y-3 pr-4">
                    {relatedLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg"
                      >
                        <Checkbox
                          id={`lead-${lead.id}`}
                          checked={selectedLeads.some(l => l.id === lead.id)}
                          onCheckedChange={(checked) => handleLeadSelect(lead.id, checked as boolean)}
                          disabled={lead["Automation Status"] === "ACTIVE" || lead["Automation Status"] === "PENDING"}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <label 
                              htmlFor={`lead-${lead.id}`}
                              className="font-medium text-sm cursor-pointer flex items-center gap-2"
                            >
                              {lead.Name}
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
                              status={lead.Stage || lead.stage_enum || "NEW LEAD"} 
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
                            {lead["Automation Status"] && (
                              <div className="text-orange-600">
                                Automation: {lead["Automation Status"]}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}

          {/* Other Jobs from Same Company */}
          {otherJobs && otherJobs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Other Jobs at {job.Company} ({otherJobs.length})
                </h3>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {otherJobs.map((otherJob) => (
                  <div 
                    key={otherJob.id} 
                    className="p-3 bg-muted/20 rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => {
                      // This would need to be handled by parent component
                      console.log("Navigate to job:", otherJob.id);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{otherJob["Job Title"]}</span>
                      {otherJob.Priority && (
                        <StatusBadge 
                          status={otherJob.Priority.toLowerCase()} 
                          size="sm"
                        />
                      )}
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {otherJob["Job Location"] && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {otherJob["Job Location"]}
                        </div>
                      )}
                      {otherJob["Employment Type"] && (
                        <div>{otherJob["Employment Type"]}</div>
                      )}
                      {otherJob.Salary && (
                        <div>{otherJob.Salary}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
      
      <LinkedInConfirmationModal
        selectedLeads={selectedLeads}
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmAutomation}
        jobTitle={job["Job Title"]}
        companyName={job.Company}
      />
      
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setSelectedLead(null);
        }}
      />

      <CompanyDetailModal
        company={selectedCompany}
        isOpen={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false);
          setSelectedCompany(null);
        }}
      />
    </Dialog>
  );
}