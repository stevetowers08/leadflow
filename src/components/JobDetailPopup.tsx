import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { LinkedInConfirmationModal } from "@/components/LinkedInConfirmationModal";
import { 
  Building2, 
  ExternalLink, 
  MapPin, 
  Users, 
  Calendar, 
  Clock,
  TrendingUp,
  Briefcase,
  Globe,
  DollarSign,
  MessageSquare,
  User,
  CheckCircle,
  XCircle,
  Activity,
  Star,
  Flag,
  Settings,
  Phone,
  Mail
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CompanyDetailPopup } from "./CompanyDetailPopup";
import { LeadDetailPopup } from "./LeadDetailPopup";
import { LinkedInAutomationModal } from "./LinkedInAutomationModal";
import { getClearbitLogo } from "@/utils/logoService";
import { formatDateForSydney } from "@/utils/timezoneUtils";
import type { Tables } from "@/integrations/supabase/types";

interface JobDetailPopupProps {
  job: Tables<"jobs"> & {
    companies?: {
      name: string;
      industry: string;
      head_office: string;
      company_size?: string;
      website?: string;
      lead_score?: string;
      priority?: string;
      automation_active?: boolean;
      confidence_level?: string;
      logo_url?: string;
      people_count?: number;
      score_reason?: string;
    } | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailPopup({ job, isOpen, onClose }: JobDetailPopupProps) {
  // Don't render if job is null
  if (!job) {
    return null;
  }

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedLeads, setSelectedLeads] = useState<any[]>([]);
  const [showAutomationModal, setShowAutomationModal] = useState(false);

  // Debug modal state changes
  useEffect(() => {
    console.log("🔍 showAutomationModal changed to:", showAutomationModal);
    console.log("🔍 selectedLeads count:", selectedLeads.length);
    console.log("🔍 selectedLeads data:", selectedLeads);
  }, [showAutomationModal, selectedLeads]);

  // Fetch related leads for this company
  const { data: relatedLeads, isLoading: leadsLoading } = useQuery({
    queryKey: ["job-leads", job?.company_id],
    queryFn: async () => {
      if (!job?.company_id) return [];
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
          last_interaction_at
        `)
        .eq("company_id", job.company_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching leads:", error);
        throw error;
      }
      console.log("✅ Fetched leads:", data);
      return data || [];
    },
    enabled: !!job?.company_id && isOpen
  });

  // Calculate days until job expires
  const getDaysUntilExpiry = () => {
    if (!job.valid_through) return null;
    try {
      const endDate = new Date(job.valid_through);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

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

  const daysUntilExpiry = getDaysUntilExpiry();
  const daysSincePosted = getDaysSincePosted();

  // Transform lead data to match LinkedInConfirmationModal interface
  const transformLeadForAutomation = (lead: any) => {
    const transformed = {
      id: lead.id,
      Name: lead.name || "Unknown Name",
      Company: job.companies?.name || "Unknown Company",
      "Company Role": lead.company_role || "Unknown Role",
      "Email Address": lead.email_address || null,
      "Employee Location": lead.employee_location || "Unknown Location",
      "LinkedIn URL": lead.linkedin_url || null,
      "LinkedIn Request Message": lead.linkedin_request_message || "",
      "LinkedIn Connected Message": lead.linkedin_connected_message || "",
      "LinkedIn Follow Up Message": lead.linkedin_follow_up_message || "",
      Stage: lead.stage || "new",
      stage_enum: lead.stage || "new",
      priority_enum: null,
      "Lead Score": lead.lead_score || "0",
      automation_status_enum: null,
      "Automation Status": null,
      created_at: lead.last_interaction_at || new Date().toISOString()
    };
    console.log("🔄 Transformed lead:", transformed);
    return transformed;
  };

  // Handle lead selection
  const handleLeadSelect = (leadId: string, checked: boolean) => {
    console.log("Lead selection:", leadId, checked);
    if (checked) {
      const lead = relatedLeads?.find(l => l.id === leadId);
      if (lead) {
        const transformedLead = transformLeadForAutomation(lead);
        setSelectedLeads(prev => [...prev, transformedLead]);
        console.log("Added lead to selection:", lead.name);
      }
    } else {
      setSelectedLeads(prev => prev.filter(l => l.id !== leadId));
      console.log("Removed lead from selection:", leadId);
    }
  };


  return (
    <>
      
      {/* Custom Job Detail Modal */}
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
                        const logoUrl = getClearbitLogo(job.companies?.name, job.companies?.website);
                        return logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={`${job.companies?.name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null;
                      })()}
                      <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center" style={{ display: getClearbitLogo(job.companies?.name, job.companies?.website) ? 'none' : 'flex' }}>
                        <Briefcase className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-gray-900 leading-tight">{job.title}</div>
                    <div 
                      className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors group"
                      onClick={() => setShowCompanyModal(true)}
                    >
                      <Building2 className="h-3 w-3 group-hover:text-blue-600" />
                      <span className="font-medium">{job.companies?.name || "Unknown Company"}</span>
                      <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                      {job.location && (
                        <>
                          <span className="mx-1">•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
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
            <div className="flex-1 overflow-y-auto min-h-0 p-6 pt-4 pb-6 space-y-4">
              {/* Job Information Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-orange-600" />
                    Job Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Employment Type</label>
                        <p className="text-sm font-semibold">{job.employment_type || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Seniority Level</label>
                        <p className="text-sm font-semibold">{job.seniority_level || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Function</label>
                        <p className="text-sm font-semibold">{job.function || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Posted Date</label>
                        <p className="text-sm font-semibold">
                          {job.posted_date ? formatDateForSydney(job.posted_date, 'date') : "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Valid Through</label>
                        <p className="text-sm font-semibold">
                          {job.valid_through ? formatDateForSydney(job.valid_through, 'date') : "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Salary</label>
                        <p className="text-sm font-semibold">{job.salary || "Not specified"}</p>
                      </div>
                    </div>
                    
                    {job.linkedin_job_id && (
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">LinkedIn Job</label>
                        <p className="text-sm font-semibold">
                          <a 
                            href={`https://www.linkedin.com/jobs/view/${job.linkedin_job_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            View on LinkedIn
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </p>
                      </div>
                    )}

                    <div className="flex gap-8">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Priority</label>
                        <StatusBadge 
                          status={job.priority?.charAt(0).toUpperCase() + job.priority?.slice(1) || "Medium"} 
                          size="sm" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">AI Score</label>
                        <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-md">
                          {job.lead_score_job || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Related Leads Card */}
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
                      {relatedLeads.slice(0, 5).map((lead) => (
                        <div 
                          key={lead.id} 
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Checkbox
                            id={`lead-${lead.id}`}
                            checked={selectedLeads.some(l => l.id === lead.id)}
                            onCheckedChange={(checked) => handleLeadSelect(lead.id, checked as boolean)}
                          />
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => {
                              setSelectedLead(lead);
                              setShowLeadModal(true);
                            }}
                          >
                            <div className="font-medium text-sm text-gray-900">{lead.name}</div>
                            <div className="text-xs text-gray-600 mt-0.5">
                              {lead.company_role} • {lead.employee_location}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={lead.stage || "new"} size="sm" />
                          </div>
                        </div>
                      ))}
                      {relatedLeads.length > 5 && (
                        <div className="text-center py-3">
                          <div className="text-sm text-gray-500">
                            +{relatedLeads.length - 5} more leads available
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <div className="text-sm text-muted-foreground">No leads found for this company</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Company Information Card */}
              {job.companies && (
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
                          <p className="text-sm font-semibold">{job.companies.name}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Head Office</label>
                          <p className="text-sm font-semibold">{job.companies.head_office || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Industry</label>
                          <p className="text-sm font-semibold">{job.companies.industry || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Company Size</label>
                          <p className="text-sm font-semibold">{job.companies.company_size || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Website</label>
                          <p className="text-sm font-semibold">
                            {job.companies.website ? (
                              <a 
                                href={job.companies.website.startsWith('http') ? job.companies.website : `https://${job.companies.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                {job.companies.website.replace(/^https?:\/\//, '')}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : "Not specified"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">LinkedIn</label>
                          <p className="text-sm font-semibold">
                            {job.companies.linkedin_url ? (
                              <a 
                                href={job.companies.linkedin_url}
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
                            status={job.companies.priority?.charAt(0).toUpperCase() + job.companies.priority?.slice(1) || "Medium"} 
                            size="sm" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">Status</label>
                          <StatusBadge 
                            status={
                              job.companies.automation_active ? "Active" :
                              job.companies.confidence_level === 'high' ? "Qualified" :
                              job.companies.confidence_level === 'medium' ? "Prospect" : "New"
                            } 
                            size="sm" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">AI Score</label>
                          <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-md">
                            {job.companies.lead_score || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* AI Analysis */}
                      {job.companies.score_reason && (
                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 font-medium">AI Analysis</label>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {job.companies.score_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Company Modal */}
      {showCompanyModal && job.companies && (
        <CompanyDetailPopup
          company={{
            id: job.company_id || "",
            name: job.companies.name,
            industry: job.companies.industry,
            head_office: job.companies.head_office,
          } as any}
          isOpen={showCompanyModal}
          onClose={() => setShowCompanyModal(false)}
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

      {/* LinkedIn Automation Modal */}
      <LinkedInAutomationModal
        selectedLeads={selectedLeads}
        isOpen={showAutomationModal}
        onClose={() => {
          setShowAutomationModal(false);
          setSelectedLeads([]);
        }}
        jobTitle={job.title}
        companyName={job.companies?.name}
      />
    </>
  );
}

