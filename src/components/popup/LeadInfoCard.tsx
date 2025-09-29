import React from 'react';
import { InfoCard } from '../shared/InfoCard';
import { StatusBadge } from '../StatusBadge';
import { 
  User, 
  Briefcase, 
  MapPin, 
  Mail, 
  ExternalLink, 
  Calendar 
} from 'lucide-react';
import { formatDateForSydney } from '@/utils/timezoneUtils';

interface LeadInfoCardProps {
  lead: any;
}

export const LeadInfoCard: React.FC<LeadInfoCardProps> = ({ lead }) => {
  if (!lead) return null;

  return (
    <InfoCard title="Lead Information" contentSpacing="space-y-3 pt-1.5">
      <div className="grid grid-cols-3 gap-4">
        <InfoField label="Name" value={lead.name} />
        <InfoField label="Title" value={lead.company_role} />
        <InfoField label="Location" value={lead.employee_location} />
        <InfoField 
          label="Email"
          value={
            lead.email_address ? (
              <a href={`mailto:${lead.email_address}`} className="text-accent hover:text-accent/80">
                {lead.email_address}
              </a>
            ) : "Not specified"
          } 
        />
        <InfoField 
          label="LinkedIn"
          value={
            lead.linkedin_url ? (
              <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80">
                View Profile
              </a>
            ) : "Not specified"
          } 
        />
        <InfoField 
          label="Last Interaction"
          value={
            lead.last_interaction_at ? formatDateForSydney(lead.last_interaction_at, 'date') : "Not specified"
          } 
        />
      </div>
      
      <div className="flex gap-6 items-start">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">Status</label>
          <StatusBadge status={lead.stage || "new"} size="sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">AI Score</label>
          <StatusBadge status={lead.lead_score || "Medium"} size="sm" />
        </div>
      </div>
    </InfoCard>
  );
};

interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
  <div className="space-y-1">
    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
      {label}
    </div>
    <div className="text-sm text-gray-900 font-medium">
      {value || "Not specified"}
    </div>
  </div>
);
