// Common entity types for modals
export interface Lead {
  id: string;
  name: string;
  company_role?: string;
  stage?: string;
  lead_score?: string;
  email_address?: string;
  linkedin_url?: string;
  employee_location?: string;
  last_interaction_at?: string;
  company_id?: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  linkedin_url?: string;
  head_office?: string;
  industry?: string;
  company_size?: string;
  lead_score?: string;
  score_reason?: string;
  automation_active?: boolean;
  priority?: string;
  confidence_level?: string;
  profile_image_url?: string;
}

export interface Job {
  id: string;
  title: string;
  location?: string;
  priority?: string;
  posted_date?: string;
  salary?: string;
  employment_type?: string;
  automation_active?: boolean;
  lead_score_job?: string;
  company_id?: string;
}

// Modal-specific props
export interface BaseModalProps {
  isLoading: boolean;
  selectedLeads: Lead[];
  onClose: () => void;
  onLeadClick: (leadId: string) => void;
  onToggleSelection: (lead: Lead) => void;
  onRetry?: () => void;
  error?: Error | null;
}

export interface LeadModalProps extends BaseModalProps {
  lead: Lead;
  company?: Company;
  relatedLeads?: Lead[];
  isLoadingRelatedLeads: boolean;
}

export interface CompanyModalProps extends BaseModalProps {
  company: Company;
  relatedLeads?: Lead[];
  relatedJobs?: Job[];
  isLoadingRelatedLeads: boolean;
  isLoadingRelatedJobs: boolean;
  onJobClick: (jobId: string) => void;
}

export interface JobModalProps extends BaseModalProps {
  job: Job;
  company?: Company;
  relatedLeads?: Lead[];
  isLoadingRelatedLeads: boolean;
}
