import { PopupModal } from "@/components/shared/PopupModal";
import { CompanyInfoCard } from "@/components/popup/CompanyInfoCard";
import { RelatedItemsList } from "@/components/popup/RelatedItemsList";
import { NotesSection } from "@/components/NotesSection";
import { StatusBadge } from "@/components/StatusBadge";
import { 
  Building2, 
  Users, 
  Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { JobDetailPopup } from "../jobs/JobDetailPopup";
import { LeadDetailPopup } from "../../features/leads/LeadDetailPopup";
import { LinkedInAutomationModal } from "../automation/LinkedInAutomationModal";
import type { Tables } from "@/integrations/supabase/types";
import { SelectedLead, PopupJob, PopupLead } from "@/types/popup";

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
  const [selectedLeads, setSelectedLeads] = useState<SelectedLead[]>([]);

  // Fetch related jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["company-jobs", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          location,
          priority,
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

  // Fetch related leads
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ["company-leads", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("people")
        .select(`
          id,
          name,
          email_address,
          company_role,
          employee_location,
          stage,
          created_at,
          linkedin_url
        `)
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching leads:", error);
        throw error;
      }
      console.log("✅ Fetched leads:", data);
      return data || [];
    },
    enabled: !!company?.id && isOpen
  });

  const handleJobClick = (jobId: string) => {
    const job = jobsData?.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setShowJobModal(true);
    }
  };

  const handleLeadClick = (leadId: string) => {
    const lead = leadsData?.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setShowLeadModal(true);
    }
  };

  const handleToggleSelection = (lead: any) => {
    setSelectedLeads(prev => {
      const isSelected = prev.some(selected => selected.id === lead.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== lead.id);
      } else {
        return [...prev, lead];
      }
    });
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title={company.name || "Company"}
      subtitle={`${company.industry || "Unknown Industry"} • ${company.head_office || "Unknown Location"}`}
      icon={<Building2 className="h-5 w-5 text-gray-600" />}
      statusBadge={<StatusBadge status={company.automation_active ? "Active" : "Inactive"} size="sm" />}
      statusLabel="Automation"
      scoringDisplay={{
        type: "company_score",
        value: company.lead_score || "0",
        label: "AI Score"
      }}
    >
      <div className="space-y-4">
        {/* Company Information Card */}
        <CompanyInfoCard company={company} />

        {/* Company Notes Section */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company Notes
          </h3>
          <NotesSection 
            entityId={company.id} 
            entityType="company" 
            entityName={company.name || "Company"} 
          />
        </div>

        {/* Related Jobs */}
        {jobsData && jobsData.length > 0 && (
          <RelatedItemsList
            title="Related Jobs"
            items={jobsData}
            isLoading={jobsLoading}
            selectedLeads={selectedLeads}
            onItemClick={handleJobClick}
            itemType="job"
          />
        )}

        {/* Related Leads */}
        {leadsData && leadsData.length > 0 && (
          <RelatedItemsList
            title="Related Leads"
            items={leadsData}
            isLoading={leadsLoading}
            selectedLeads={selectedLeads}
            onItemClick={handleLeadClick}
            onToggleSelection={handleToggleSelection}
            showCheckbox={true}
            showAutomateButton={true}
            itemType="lead"
          />
        )}
      </div>

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
      {showAutomationModal && (
        <LinkedInAutomationModal
          selectedLeads={[{
            id: selectedLead?.id || "unknown",
            Name: selectedLead?.name || "Unknown Name",
            Company: company.name || "Unknown Company",
            "Company Role": selectedLead?.company_role || "Unknown Role",
            "Email Address": selectedLead?.email_address || null,
            "Employee Location": selectedLead?.employee_location || "Unknown Location",
            "LinkedIn URL": selectedLead?.linkedin_url || null,
            "LinkedIn Request Message": "",
            "LinkedIn Connected Message": "",
            "LinkedIn Follow Up Message": "",
            Stage: selectedLead?.stage || "new",
            stage_enum: selectedLead?.stage || "new",
            priority_enum: "medium",
            "Lead Score": "0",
            automation_status_enum: "not_started",
            "Automation Status": "Not Started",
            created_at: selectedLead?.created_at || new Date().toISOString()
          }]}
          isOpen={showAutomationModal}
          onClose={() => setShowAutomationModal(false)}
        />
      )}
    </PopupModal>
  );
}