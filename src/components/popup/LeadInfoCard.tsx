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
    <InfoCard title="Lead Information" contentSpacing="space-y-4 pt-2">
      <div className="grid grid-cols-3 gap-4">
        <InfoField icon={<User className="h-4 w-4" />} value={lead.name} />
        <InfoField icon={<Briefcase className="h-4 w-4" />} value={lead.company_role} />
        <InfoField icon={<MapPin className="h-4 w-4" />} value={lead.employee_location} />
        <InfoField 
          icon={<Mail className="h-4 w-4" />} 
          value={
            lead.email_address ? (
              <a href={`mailto:${lead.email_address}`} className="text-blue-600 hover:text-blue-800">
                {lead.email_address}
              </a>
            ) : "Not specified"
          } 
        />
        <InfoField 
          icon={<ExternalLink className="h-4 w-4" />} 
          value={
            lead.linkedin_url ? (
              <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                View Profile
              </a>
            ) : "Not specified"
          } 
        />
        <InfoField 
          icon={<Calendar className="h-4 w-4" />} 
          value={
            lead.last_interaction_at ? formatDateForSydney(lead.last_interaction_at, 'date') : "Not specified"
          } 
        />
      </div>
      
      <div className="flex gap-8">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">Status</label>
          <StatusBadge status={lead.stage || "new"} size="sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">AI Score</label>
          <StatusBadge status={lead.lead_score || "Medium"} size="sm" />
        </div>
      </div>
    </InfoCard>
  );
};

interface InfoFieldProps {
  icon: React.ReactNode;
  value: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ icon, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-muted-foreground flex-shrink-0">{icon}</div>
    <span className="text-sm text-foreground">
      {value || "Not specified"}
    </span>
  </div>
);
