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
        <div className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center p-8">
          <div className="bg-gray-100 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header with STATUS and AI SCORE in top right */}
            <div className="p-6 pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-gray-600 mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-black mb-1">{job.title}</div>
                    <div 
                      className="text-sm font-medium text-gray-600 cursor-pointer hover:text-blue-600 transition-colors group"
                      onClick={() => setShowCompanyModal(true)}
                    >
                      {job.companies?.name || "Unknown Company"}
                    </div>
                  </div>
                </div>
                
                {/* STATUS and AI SCORE in top right */}
                <div className="flex items-center gap-4 ml-6">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500">STATUS</span>
                    <StatusBadge 
                      status={job.priority?.charAt(0).toUpperCase() + job.priority?.slice(1) || "Medium"} 
                      size="sm" 
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <Star className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500">AI SCORE</span>
                    <span className="text-sm font-bold text-black">
                      {job.lead_score_job || "N/A"}
                    </span>
                  </div>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-4 pb-6 space-y-5 flex-1 overflow-y-auto min-h-0">
              {/* Job Information Card */}
              <div className="bg-white rounded-xl p-5">
                <div className="pb-3">
                  <h3 className="text-sm font-semibold text-black">
                    Job Information
                  </h3>
                  <div className="pt-3">
                    <div className="w-full h-[1px] bg-gray-100"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{job.employment_type || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{job.seniority_level || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{job.function || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        {job.posted_date ? formatDateForSydney(job.posted_date, 'date') : "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        {job.valid_through ? formatDateForSydney(job.valid_through, 'date') : "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{job.salary || "Not specified"}</span>
                    </div>
                  </div>
                  
                  {job.linkedin_job_id && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <a 
                        href={`https://www.linkedin.com/jobs/view/${job.linkedin_job_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-black hover:text-blue-600 font-medium transition-colors"
                      >
                        linkedin.com/jobs/view/{job.linkedin_job_id}
                      </a>
                    </div>
                  )}
                </div>
              </div>


              {/* Related Leads Card */}
              <div className="bg-white rounded-xl p-5">
                <div className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-black">
                      Related Leads ({relatedLeads?.length || 0})
                    </h3>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2"
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
                </div>
                <div>
                  {leadsLoading ? (
                    <div className="text-center py-6">
                      <div className="text-sm text-gray-500">Loading leads...</div>
                    </div>
                  ) : relatedLeads && relatedLeads.length > 0 ? (
                    <div className="space-y-3">
                      {relatedLeads.slice(0, 5).map((lead) => (
                        <div 
                          key={lead.id} 
                          className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
                    <div className="text-center py-6">
                      <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <div className="text-sm text-gray-500">No leads found for this company</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Information Card */}
              {job.companies && (
                <div className="bg-white rounded-xl p-5">
                  <div className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
                        {(() => {
                          const logoUrl = getClearbitLogo(job.companies.name, job.companies.website);
                          return logoUrl ? (
                            <img 
                              src={logoUrl} 
                              alt={`${job.companies.name} logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null;
                        })()}
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center" style={{ display: getClearbitLogo(job.companies.name, job.companies.website) ? 'none' : 'flex' }}>
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-black">{job.companies.name}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {job.companies.head_office && (
                            <span>{job.companies.head_office}</span>
                          )}
                          {job.companies.website && (
                            <>
                              {job.companies.head_office && <span>•</span>}
                              <ExternalLink className="h-3 w-3" />
                              <a 
                                href={job.companies.website.startsWith('http') ? job.companies.website : `https://${job.companies.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                              >
                                {job.companies.website.replace(/^https?:\/\/(www\.)?/, '')}
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <Flag className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{job.companies.industry || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{job.companies.head_office || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{job.companies.company_size || "Not specified"}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">AI Score</span>
                        <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                          {job.companies.lead_score || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">Priority</span>
                        <StatusBadge 
                          status={job.companies.priority?.charAt(0).toUpperCase() + job.companies.priority?.slice(1) || "Medium"} 
                          size="sm" 
                          className="!mx-0 w-fit"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">Status</span>
                        <StatusBadge 
                          status={
                            job.companies.automation_active ? "Active" :
                            job.companies.confidence_level === 'high' ? "Qualified" :
                            job.companies.confidence_level === 'medium' ? "Prospect" : "New"
                          } 
                          size="sm" 
                          className="!mx-0 w-fit"
                        />
                      </div>
                    </div>
                    
                    {job.companies.score_reason && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-black">AI Analysis</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {job.companies.score_reason}
                        </p>
                      </div>
                    )}
                    {/* Debug: Show score reason status */}
                    {console.log('🔍 Company score_reason debug:', {
                      companyName: job.companies.name,
                      score_reason: job.companies.score_reason,
                      hasScoreReason: !!job.companies.score_reason
                    })}
                  </div>
                </div>
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
