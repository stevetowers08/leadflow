import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getClearbitLogo } from "@/utils/logoService";
import { 
  Building2, 
  ExternalLink, 
  MapPin, 
  Users, 
  Briefcase,
  TrendingUp,
  Globe,
  Mail,
  Calendar,
  Clock,
  Phone,
  Flag,
  Settings,
  Star,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { JobDetailPopup } from "./JobDetailPopup";
import { LeadDetailPopup } from "./LeadDetailPopup";
import { LinkedInAutomationModal } from "./LinkedInAutomationModal";
import type { Tables } from "@/integrations/supabase/types";

interface CompanyDetailPopupProps {
  company: (Tables<"companies"> & {
    people_count?: number;
    jobs_count?: number;
  }) | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailPopup({ company, isOpen, onClose }: CompanyDetailPopupProps) {
  // Don't render if company is null
  if (!company) {
    return null;
  }

  const [showJobModal, setShowJobModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedLeads, setSelectedLeads] = useState<any[]>([]);

  // Fetch related leads for this company
  const { data: relatedLeads, isLoading: leadsLoading } = useQuery({
    queryKey: ["company-leads", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("people")
        .select(`
          id,
          name,
          company_role,
          email_address,
          employee_location,
          stage,
          lead_score,
          linkedin_url,
          linkedin_request_message,
          linkedin_connected_message,
          linkedin_follow_up_message,
          last_interaction_at,
          created_at
        `)
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && isOpen
  });

  // Fetch related jobs for this company
  const { data: relatedJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["company-jobs", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
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
        .eq("company_id", company.id)
        .order("posted_date", { ascending: false });

      if (error) {
        console.error("❌ Error fetching jobs:", error);
        throw error;
      }
      console.log("✅ Fetched jobs:", data);
      return data || [];
    },
    enabled: !!company?.id && isOpen
  });

  return (
    <>
      {/* Custom Company Detail Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center p-6" onClick={onClose}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                      {(() => {
                        const logoUrl = getClearbitLogo(company.name, company.website);
                        return logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={`${company.name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null;
                      })()}
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center" style={{ display: getClearbitLogo(company.name, company.website) ? 'none' : 'flex' }}>
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-gray-900 leading-tight">{company.name}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{company.head_office || "Location not specified"}</span>
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
            <div className="flex-1 overflow-y-auto min-h-0 p-6 pt-4 pb-6 space-y-4">
                {/* Company Information Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Company Name</label>
                          <p className="text-sm font-semibold">{company.name}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Head Office</label>
                          <p className="text-sm font-semibold">{company.head_office || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Industry</label>
                          <p className="text-sm font-semibold">{company.industry || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Company Size</label>
                          <p className="text-sm font-semibold">{company.company_size || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Website</label>
                          <p className="text-sm font-semibold">
                            {company.website ? (
                              <a 
                                href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                {company.website.replace(/^https?:\/\//, '')}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : "Not specified"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">LinkedIn</label>
                          <p className="text-sm font-semibold">
                            {company.linkedin_url ? (
                              <a 
                                href={company.linkedin_url}
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
                      </div>

                      <div className="flex gap-8">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Priority</label>
                          <StatusBadge 
                            status={company.priority?.charAt(0).toUpperCase() + company.priority?.slice(1) || "Medium"} 
                            size="sm" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Status</label>
                          <StatusBadge 
                            status={
                              company.automation_active ? "Active" :
                              company.confidence_level === 'high' ? "Qualified" :
                              company.confidence_level === 'medium' ? "Prospect" : "New"
                            } 
                            size="sm" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">AI Score</label>
                          <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-md">
                            {company.lead_score || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* AI Analysis */}
                      {company.score_reason && (
                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 font-medium">AI Analysis</label>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {company.score_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Related Leads Section */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        Related Leads ({relatedLeads?.length || 0})
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
                    {leadsLoading ? (
                      <div className="text-center py-4">
                        <div className="text-sm text-muted-foreground">Loading leads...</div>
                      </div>
                    ) : relatedLeads && relatedLeads.length > 0 ? (
                      <div className="space-y-3">
                        {relatedLeads.slice(0, 5).map((lead) => {
                          // Calculate days since last interaction
                          const getDaysSinceLastInteraction = () => {
                            if (!lead.last_interaction_at) return null;
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
                            <div 
                              key={lead.id} 
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <Checkbox 
                                  checked={selectedLeads.some(l => l.id === lead.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedLeads([...selectedLeads, lead]);
                                    } else {
                                      setSelectedLeads(selectedLeads.filter(l => l.id !== lead.id));
                                    }
                                  }}
                                />
                                <div 
                                  className="flex-1 cursor-pointer"
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setShowLeadModal(true);
                                  }}
                                >
                                  <div className="font-medium text-sm">{lead.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {lead.company_role} • {lead.employee_location}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <StatusBadge status={lead.stage || "new"} size="sm" />
                              </div>
                            </div>
                          );
                        })}
                        {relatedLeads.length > 5 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{relatedLeads.length - 5} more leads
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-sm text-muted-foreground">No leads found for this company</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Active Jobs Section */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      Active Jobs ({relatedJobs?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {jobsLoading ? (
                      <div className="text-sm text-muted-foreground">Loading jobs...</div>
                    ) : relatedJobs && relatedJobs.length > 0 ? (
                      <div className="space-y-3">
                        {relatedJobs.slice(0, 3).map((job) => {
                          // Calculate days since posted
                          const getDaysSincePosted = () => {
                            if (!job.posted_date) return null;
                            try {
                              const date = new Date(job.posted_date);
                              const now = new Date();
                              const diffTime = Math.abs(now.getTime() - date.getTime());
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              return diffDays;
                            } catch {
                              return null;
                            }
                          };
                          const daysSincePosted = getDaysSincePosted();

                          return (
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
                                <div className="text-xs text-muted-foreground mb-1">
                                  {job.location} • {job.function}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  {daysSincePosted && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>Posted {daysSincePosted}d ago</span>
                                    </div>
                                  )}
                                  {job.valid_through && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>Expires {new Date(job.valid_through).toLocaleDateString()}</span>
                                    </div>
                                  )}
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
                          );
                        })}
                        {relatedJobs.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{relatedJobs.length - 3} more jobs
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No jobs found for this company</div>
                    )}
                  </CardContent>
                </Card>
            </div>
          </div>
        </div>
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

      {/* Lead Modal */}
      {showLeadModal && selectedLead && (
        <LeadDetailPopup
          lead={selectedLead}
          isOpen={showLeadModal}
          onClose={() => {
            setShowLeadModal(false);
            setSelectedLead(null);
          }}
        />
      )}

      {/* Automation Modal */}
      {showAutomationModal && selectedLeads && selectedLeads.length > 0 && (
        <>
          {console.log("🚀 Opening automation modal with leads:", selectedLeads)}
          <LinkedInAutomationModal
          selectedLeads={selectedLeads.map(lead => ({
            id: lead.id,
            Name: lead.name || "Unknown Name",
            Company: company.name || "Unknown Company",
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
        </>
      )}
    </>
  );
}