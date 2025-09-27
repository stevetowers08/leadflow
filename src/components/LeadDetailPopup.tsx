import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User, 
  ExternalLink, 
  MapPin, 
  Building2, 
  Mail,
  Calendar,
  Clock,
  TrendingUp,
  Briefcase,
  Globe,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CompanyDetailPopup } from "./CompanyDetailPopup";
import { JobDetailPopup } from "./JobDetailPopup";
import { LinkedInAutomationModal } from "./LinkedInAutomationModal";
import type { Tables } from "@/integrations/supabase/types";

interface LeadDetailPopupProps {
  lead: Tables<"people"> | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailPopup({ lead, isOpen, onClose }: LeadDetailPopupProps) {
  // Don't render if lead is null
  if (!lead) {
    return null;
  }

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedLeads, setSelectedLeads] = useState<any[]>([]);

  // Fetch company data
  const { data: companyData, isLoading: companyLoading } = useQuery({
    queryKey: ["lead-company", lead?.company_id],
    queryFn: async () => {
      if (!lead?.company_id) return null;
      const { data, error } = await supabase
        .from("companies")
        .select(`
          id,
          name,
          industry,
          head_office,
          company_size,
          website,
          lead_score,
          priority,
          automation_active,
          confidence_level,
          linkedin_url,
          logo_url,
          created_at,
          updated_at
        `)
        .eq("id", lead.company_id)
        .single();

      if (error) {
        console.error("❌ Error fetching company:", error);
        throw error;
      }
      console.log("✅ Fetched company:", data);
      return data;
    },
    enabled: !!lead?.company_id && isOpen
  });

  // Fetch related jobs for this company
  const { data: relatedJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["lead-jobs", lead?.company_id],
    queryFn: async () => {
      if (!lead?.company_id) return [];
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          location,
          function,
          posted_date,
          valid_through,
          lead_score_job,
          priority,
          employment_type,
          seniority_level,
          salary,
          description,
          linkedin_job_id,
          job_url,
          automation_active,
          created_at,
          updated_at
        `)
        .eq("company_id", lead.company_id)
        .order("posted_date", { ascending: false });

      if (error) {
        console.error("❌ Error fetching jobs:", error);
        throw error;
      }
      console.log("✅ Fetched jobs:", data);
      return data || [];
    },
    enabled: !!lead?.company_id && isOpen
  });

  // Calculate days since last interaction
  const getDaysSinceLastInteraction = () => {
    if (!lead || !lead.last_interaction_at) return null;
    try {
      const date = new Date(lead.last_interaction_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  const daysSinceLastInteraction = getDaysSinceLastInteraction();

  return (
    <>
      {/* Lead Detail Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-gray-900 leading-tight">{lead.name}</div>
                    <div 
                      className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-purple-600 transition-colors group"
                      onClick={() => setShowCompanyModal(true)}
                    >
                      <Building2 className="h-3 w-3 group-hover:text-purple-600" />
                      <span className="font-medium">{lead.company_role} at {companyData?.name || "Unknown Company"}</span>
                      <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                      {lead.employee_location && (
                        <>
                          <span className="mx-1">•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{lead.employee_location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 pt-4 pb-2 space-y-4">
                {/* Lead Information Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600" />
                        Lead Information
                      </CardTitle>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={selectedLeads.length === 0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("🚀 Automate button clicked!");
                          setShowAutomationModal(true);
                        }}
                      >
                        Automate ({selectedLeads.length})
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox 
                          id="select-lead"
                          checked={selectedLeads.some(l => l.id === lead.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLeads([...selectedLeads, lead]);
                            } else {
                              setSelectedLeads(selectedLeads.filter(l => l.id !== lead.id));
                            }
                          }}
                        />
                        <label htmlFor="select-lead" className="text-sm font-medium">
                          Select this lead for automation
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Full Name</label>
                          <p className="text-sm font-semibold">{lead.name}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Role</label>
                          <p className="text-sm font-semibold">{lead.company_role || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Location</label>
                          <p className="text-sm font-semibold">{lead.employee_location || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Email</label>
                          <p className="text-sm font-semibold">
                            {lead.email_address ? (
                              <a 
                                href={`mailto:${lead.email_address}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {lead.email_address}
                              </a>
                            ) : "Not specified"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">LinkedIn</label>
                          <p className="text-sm font-semibold">
                            {lead.linkedin_url ? (
                              <a 
                                href={lead.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                View Profile
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : "Not specified"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Last Contact</label>
                          <p className="text-sm font-semibold">
                            {daysSinceLastInteraction ? `${daysSinceLastInteraction} days ago` : "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-8">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Stage</label>
                          <StatusBadge status={lead.stage || "new"} size="sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Lead Score</label>
                          <p className="text-sm font-semibold">{lead.lead_score || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Jobs Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      Active Jobs ({relatedJobs?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {jobsLoading ? (
                      <div className="text-center py-4">
                        <div className="text-sm text-muted-foreground">Loading jobs...</div>
                      </div>
                    ) : relatedJobs && relatedJobs.length > 0 ? (
                      <div className="space-y-3">
                        {relatedJobs.slice(0, 3).map((job) => (
                          <div 
                            key={job.id} 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowJobModal(true);
                            }}
                          >
                            <div className="flex-1">
                              <div className="font-medium text-sm">{job.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {job.location} • {job.function}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge 
                                status={job.priority?.charAt(0).toUpperCase() + job.priority?.slice(1) || "Medium"} 
                                size="sm" 
                              />
                              <div className="text-xs font-medium">{job.lead_score_job || "-"}</div>
                            </div>
                          </div>
                        ))}
                        {relatedJobs.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{relatedJobs.length - 3} more jobs
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-sm text-muted-foreground">No jobs found for this company</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Company Information Card */}
                {companyData && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          Company Information
                        </div>
                        {companyData.website && (
                          <a 
                            href={companyData.website.startsWith('http') ? companyData.website : `https://${companyData.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                          >
                            {companyData.website.replace(/^https?:\/\/(www\.)?/, '')}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Company Name</label>
                          <p 
                            className="text-xs font-medium cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => setShowCompanyModal(true)}
                          >
                            {companyData.name}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Head Office</label>
                          <p className="text-xs font-medium">{companyData.head_office || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Industry</label>
                          <p className="text-xs font-medium">{companyData.industry || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Company Size</label>
                          <p className="text-xs font-medium">{companyData.company_size || "Not specified"}</p>
                        </div>
                      </div>
                      
                      {/* AI Score and Reason */}
                      {companyData.lead_score && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500 font-medium">AI Score</label>
                            <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-md">
                              {companyData.lead_score}
                            </span>
                          </div>
                          {companyData.score_reason && (
                            <div>
                              <label className="text-xs text-gray-500 font-medium">AI Analysis</label>
                              <p className="text-xs text-gray-700 leading-relaxed mt-1">
                                {companyData.score_reason}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-8">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Priority</label>
                          <StatusBadge 
                            status={companyData.priority?.charAt(0).toUpperCase() + companyData.priority?.slice(1) || "Medium"} 
                            size="sm" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Status</label>
                          <StatusBadge 
                            status={
                              companyData.automation_active ? "Active" :
                              companyData.confidence_level === 'high' ? "Qualified" :
                              companyData.confidence_level === 'medium' ? "Prospect" : "New"
                            } 
                            size="sm" 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Company Modal */}
      {showCompanyModal && companyData && (
        <CompanyDetailPopup
          company={companyData}
          isOpen={showCompanyModal}
          onClose={() => setShowCompanyModal(false)}
        />
      )}

      {/* Job Modal */}
      {showJobModal && selectedJob && (
        <JobDetailPopup
          job={selectedJob}
          isOpen={showJobModal}
          onClose={() => {
            setShowJobModal(false);
            setSelectedJob(null);
          }}
        />
      )}

      {/* Automation Modal */}
      {showAutomationModal && selectedLeads && selectedLeads.length > 0 && (
        <LinkedInAutomationModal
          selectedLeads={selectedLeads.map(lead => ({
            id: lead.id,
            Name: lead.name || "Unknown Name",
            Company: companyData?.name || "Unknown Company",
            "Company Role": lead.company_role || "Unknown Role",
            "Email Address": lead.email_address || null,
            "Employee Location": lead.employee_location || "Unknown Location",
            "LinkedIn URL": lead.linkedin_url || null,
            "LinkedIn Request Message": lead.linkedin_request_message || "",
            "LinkedIn Connected Message": lead.linkedin_connected_message || "",
            "LinkedIn Follow Up Message": lead.linkedin_follow_up_message || "",
            Stage: lead.stage || "new",
            stage_enum: lead.stage || "new",
            priority_enum: "medium", // Default since priority field doesn't exist in people table
            "Lead Score": lead.lead_score || "0",
            automation_status_enum: "not_started", // Default since automation_status doesn't exist
            "Automation Status": "Not Started", // Default since automation_status doesn't exist
            created_at: lead.created_at || new Date().toISOString()
          }))}
          isOpen={showAutomationModal}
          onClose={() => setShowAutomationModal(false)}
        />
      )}
    </>
  );
}
