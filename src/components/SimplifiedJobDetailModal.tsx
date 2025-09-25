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
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { SimplifiedCompanyDetailModal } from "./SimplifiedCompanyDetailModal";
import { SimplifiedLeadDetailModal } from "./SimplifiedLeadDetailModal";
import { LinkedInAutomationModal } from "./LinkedInAutomationModal";
import type { Tables } from "@/integrations/supabase/types";

interface SimplifiedJobDetailModalProps {
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
      profile_image_url?: string;
      people_count?: number;
    } | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function SimplifiedJobDetailModal({ job, isOpen, onClose }: SimplifiedJobDetailModalProps) {
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
      {/* Temporarily disable Dialog to test */}
      {false && (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100">
            <DialogTitle className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center shadow-sm">
                  <Briefcase className="h-4 w-4 text-blue-600" />
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
            </DialogTitle>
          </DialogHeader>

              <ScrollArea className="max-h-[70vh]">
            <div className="p-6 pt-4 pb-2 space-y-4">
              {/* Job Information Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    Job Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                      <label className="text-xs text-gray-500 font-medium">Posted Date</label>
                      <p className="text-sm font-semibold">
                        {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : "Not specified"}
                        {daysSincePosted && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({daysSincePosted === 1 ? '1 day ago' : `${daysSincePosted} days ago`})
                          </span>
                        )}
                      </p>
                      </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium">Valid Through</label>
                      <p className="text-sm font-semibold">
                        {job.valid_through ? new Date(job.valid_through).toLocaleDateString() : "Not specified"}
                        {daysUntilExpiry !== null && (
                          <span className={`text-xs ml-1 ${
                            daysUntilExpiry <= 7 ? 'text-red-600' : 
                            daysUntilExpiry <= 30 ? 'text-yellow-600' : 'text-gray-500'
                          }`}>
                            ({daysUntilExpiry <= 0 ? 'Expired' : 
                             daysUntilExpiry === 1 ? 'Expires tomorrow' : 
                             `${daysUntilExpiry} days left`})
                          </span>
                        )}
                      </p>
                    </div>
                      </div>

                  {job.salary && (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium">Salary</label>
                      <p className="text-sm font-bold text-green-600">{job.salary}</p>
                    </div>
                  )}

                  {job.function && (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium">Job Function</label>
                      <p className="text-sm font-semibold">{job.function}</p>
                    </div>
                  )}

                  {job.linkedin_job_id && (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium">LinkedIn Job</label>
                          <a 
                            href={`https://www.linkedin.com/jobs/view/${job.linkedin_job_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                          >
                        linkedin.com/jobs/view/{job.linkedin_job_id.slice(0, 8)}...
                            <ExternalLink className="h-3 w-3" />
                          </a>
                    </div>
                  )}

                </CardContent>
              </Card>

              {/* Job Description Card */}
              {job.description && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto leading-relaxed">
                      {job.description}
                  </div>
                  </CardContent>
                </Card>
              )}

              {/* Company Information Card */}
              {job.companies && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        Company Information
                      </div>
                      {job.companies.website && (
                        <a 
                          href={job.companies.website.startsWith('http') ? job.companies.website : `https://${job.companies.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                        >
                          {job.companies.website.replace(/^https?:\/\/(www\.)?/, '')}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Industry</label>
                        <p className="text-sm font-semibold">{job.companies.industry || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Head Office</label>
                        <p className="text-sm font-semibold">{job.companies.head_office || "Not specified"}</p>
                    </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Company Size</label>
                        <p className="text-sm font-semibold">{job.companies.company_size || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">AI Lead Score</label>
                        <p className="text-sm font-semibold">{job.companies.lead_score || "Not specified"}</p>
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
                    </div>
                </CardContent>
              </Card>
              )}

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
                            <div className="font-semibold text-sm text-gray-900">{lead.name}</div>
                            <div className="text-xs text-gray-600">
                              {lead.company_role} • {lead.employee_location}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={lead.stage || "new"} size="sm" />
                          </div>
                        </div>
                      ))}
                      {relatedLeads.length > 5 && (
                        <div className="text-center py-2">
                          <div className="text-xs text-gray-500">
                            +{relatedLeads.length - 5} more leads available
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">No leads found for this company</div>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </ScrollArea>

          <div className="flex justify-end px-6 pt-2">
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
              </div>
            </DialogContent>
          </Dialog>
      )}
      
      {/* Custom Job Detail Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center shadow-sm">
                      <Briefcase className="h-4 w-4 text-blue-600" />
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
            <div className="p-8 pt-6 pb-4 space-y-6 flex-1 overflow-y-auto min-h-0">
              {/* Job Information Card */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="pb-2">
                  <h3 className="text-base flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    Job Information
                  </h3>
                </div>
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
                      <label className="text-xs text-gray-500 font-medium">Posted Date</label>
                      <p className="text-sm font-semibold">
                        {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium">Valid Through</label>
                      <p className="text-sm font-semibold">
                        {job.valid_through ? new Date(job.valid_through).toLocaleDateString() : "Not specified"}
                      </p>
                    </div>
                  </div>
                  
                  {job.salary && (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium">Salary</label>
                      <p className="text-sm font-bold text-green-600">{job.salary}</p>
                    </div>
                  )}
                  
                  {job.function && (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium">Job Function</label>
                      <p className="text-sm font-semibold">{job.function}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Leads Card */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      Related Leads ({relatedLeads?.length || 0})
                    </h3>
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
                </div>
                <div>
                  {leadsLoading ? (
                    <div className="text-center py-4">
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
                            <div className="font-semibold text-sm text-gray-900">{lead.name}</div>
                            <div className="text-xs text-gray-600">
                              {lead.company_role} • {lead.employee_location}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={lead.stage || "new"} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">No leads found for this company</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Information Card */}
              {job.companies && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      Company Information
                      </h3>
                      {job.companies.website && (
                        <a 
                          href={job.companies.website.startsWith('http') ? job.companies.website : `https://${job.companies.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                        >
                          {job.companies.website.replace(/^https?:\/\/(www\.)?/, '')}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                        </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Industry</label>
                        <p className="text-sm font-semibold">{job.companies.industry || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Head Office</label>
                        <p className="text-sm font-semibold">{job.companies.head_office || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Company Size</label>
                        <p className="text-sm font-semibold">{job.companies.company_size || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">AI Lead Score</label>
                        <p className="text-sm font-semibold">{job.companies.lead_score || "Not specified"}</p>
                        </div>
                      </div>

                    <div className="flex gap-8">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Priority</label>
                        <div className="flex justify-start">
                          <StatusBadge 
                            status={job.companies.priority?.charAt(0).toUpperCase() + job.companies.priority?.slice(1) || "Medium"} 
                            size="sm" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">Status</label>
                        <div className="flex justify-start">
                          <StatusBadge 
                            status={
                              job.companies.automation_active ? "Active" :
                              job.companies.confidence_level === 'high' ? "Qualified" :
                              job.companies.confidence_level === 'medium' ? "Prospect" : "New"
                            } 
                            size="sm" 
                          />
                        </div>
                      </div>
                        </div>
                      </div>
                    </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Company Modal - DISABLED FOR TESTING */}
      {false && showCompanyModal && job.companies && (
        <SimplifiedCompanyDetailModal
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
        <SimplifiedLeadDetailModal
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
        onClose={() => setShowAutomationModal(false)}
        onConfirm={() => {
          setShowAutomationModal(false);
          setSelectedLeads([]);
        }}
        jobTitle={job.title}
        companyName={job.companies?.name}
      />
    </>
  );
}