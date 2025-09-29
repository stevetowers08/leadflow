import { PopupModal } from "@/components/shared/PopupModal";
import { JobInfoCard } from "@/components/popup/JobInfoCard";
import { CompanyInfoCard } from "@/components/popup/CompanyInfoCard";
import { RelatedItemsList } from "@/components/popup/RelatedItemsList";
import { StatusBadge } from "@/components/StatusBadge";
import { 
  Building2, 
  Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CompanyDetailPopup } from "./CompanyDetailPopup";
import { LeadDetailPopup } from "./LeadDetailPopup";
import { LinkedInAutomationModal } from "./LinkedInAutomationModal";
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
      linkedin_url?: string;
      people_count?: number;
      score_reason?: string;
    };
  } | null;
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
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedLeads, setSelectedLeads] = useState<any[]>([]);

  // Fetch company data
  const { data: companyData, isLoading: companyLoading } = useQuery({
    queryKey: ["job-company", job?.company_id],
    queryFn: async () => {
      if (!job?.company_id) return null;
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
        .eq("id", job.company_id)
        .single();

      if (error) {
        console.error("❌ Error fetching company:", error);
        throw error;
      }
      console.log("✅ Fetched company:", data);
      return data;
    },
    enabled: !!job?.company_id && isOpen
  });

  // Fetch related leads
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ["job-leads", job?.company_id],
    queryFn: async () => {
      if (!job?.company_id) return [];
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
      title={job.title || "Job"}
      subtitle={`${job.location} • ${companyData?.name || "Unknown Company"}`}
      icon={<Briefcase className="h-5 w-5 text-gray-600" />}
      statusBadge={<StatusBadge status={job.status || "active"} size="sm" />}
      statusLabel="Status"
      scoringDisplay={{
        type: "job_score",
        value: job.lead_score_job || "0",
        label: "AI Score"
      }}
    >
      <div className="space-y-4">
        {/* Job Information Card */}
        <JobInfoCard job={job} />

        {/* Company Information Card */}
        {companyData && <CompanyInfoCard company={companyData} />}

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

      {/* Company Modal */}
      {showCompanyModal && companyData && (
        <CompanyDetailPopup
          company={companyData}
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

      {/* Automation Modal */}
      {showAutomationModal && (
        <LinkedInAutomationModal
          selectedLeads={[{
            id: selectedLead?.id || "unknown",
            Name: selectedLead?.name || "Unknown Name",
            Company: companyData?.name || "Unknown Company",
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