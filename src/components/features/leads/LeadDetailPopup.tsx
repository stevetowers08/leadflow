import { PopupModal } from "@/components/shared/PopupModal";
import { LeadInfoCard } from "@/components/popup/LeadInfoCard";
import { CompanyInfoCard } from "@/components/popup/CompanyInfoCard";
import { RelatedItemsList } from "@/components/popup/RelatedItemsList";
import { StatusBadge } from "@/components/StatusBadge";
import { 
  User, 
  Building2, 
  Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CompanyDetailPopup } from "../../CompanyDetailPopup";
import { JobDetailPopup } from "../../JobDetailPopup";
import { LinkedInAutomationModal } from "../../LinkedInAutomationModal";
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
          score_reason
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

  // Fetch related jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["lead-jobs", lead?.company_id],
    queryFn: async () => {
      if (!lead?.company_id) return [];
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

  const handleLeadClick = (leadId: string) => {
    // Handle lead click if needed
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
      title={lead.name || "Lead"}
      subtitle={lead.company_role || "Unknown Role"}
      icon={<User className="h-5 w-5 text-gray-600" />}
      statusBadge={<StatusBadge status={lead.stage || "new"} size="sm" />}
      statusLabel="Status"
      scoringDisplay={{
        type: "lead_score",
        value: lead.lead_score || "Medium",
        label: "AI Score"
      }}
    >
      <div className="space-y-4">
        {/* Lead Information Card */}
        <LeadInfoCard lead={lead} />

        {/* Company Information Card */}
        {companyData && <CompanyInfoCard company={companyData} />}

        {/* Related Jobs */}
        {jobsData && jobsData.length > 0 && (
          <RelatedItemsList
            title="Related Jobs"
            items={jobsData}
            isLoading={jobsLoading}
            selectedLeads={selectedLeads}
            onItemClick={(jobId) => {
              const job = jobsData.find(j => j.id === jobId);
              if (job) {
                setSelectedJob(job);
                setShowJobModal(true);
              }
            }}
            itemType="job"
          />
        )}
      </div>

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
      {showAutomationModal && (
        <LinkedInAutomationModal
          selectedLeads={[{
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
            priority_enum: "medium",
            "Lead Score": lead.lead_score || "0",
            automation_status_enum: "not_started",
            "Automation Status": "Not Started",
            created_at: lead.created_at || new Date().toISOString()
          }]}
          isOpen={showAutomationModal}
          onClose={() => setShowAutomationModal(false)}
        />
      )}
    </PopupModal>
  );
}