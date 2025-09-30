import React from 'react';
import { InfoCard } from '@/components/shared/InfoCard';
import { StatusBadge } from '@/components/StatusBadge';
import { LeadAssignment } from '@/components';
import { 
  User, 
  Briefcase, 
  MapPin, 
  Mail, 
  ExternalLink, 
  Calendar 
} from 'lucide-react';
import { formatDateForSydney } from '@/utils/timezoneUtils';
import { cn } from '@/lib/utils';

interface LeadInfoCardProps {
  lead: any;
}

export const LeadInfoCard: React.FC<LeadInfoCardProps> = ({ lead }) => {
  if (!lead) return null;

  const getScoreBadgeClasses = (score: number | null) => {
    if (!score) return "bg-gray-50 text-gray-700 border-gray-200";
    if (score >= 80) return "bg-green-50 text-green-700 border-green-200";
    if (score >= 60) return "bg-blue-50 text-blue-700 border-blue-200";
    if (score >= 40) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <InfoCard title="Lead Information" contentSpacing="space-y-6 pt-1.5">
      {/* Lead Info Section */}
      <div className="grid grid-cols-3 gap-3">
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
            ) : "-"
          } 
        />
        <InfoField 
          label="LinkedIn"
          value={
            lead.linkedin_url ? (
              <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80">
                View Profile
              </a>
            ) : "-"
          } 
        />
        <InfoField 
          label="Last Interaction"
          value={
            lead.last_interaction_at ? formatDateForSydney(lead.last_interaction_at, 'date') : "-"
          } 
        />
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-600">
            Status
          </div>
          <span className={cn(
            "inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-sm",
            lead.stage === 'qualified' ? "bg-green-50 text-green-700 border-green-200" :
            lead.stage === 'prospect' ? "bg-blue-50 text-blue-700 border-blue-200" :
            lead.stage === 'contacted' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
            "bg-gray-50 text-gray-700 border-gray-200"
          )}>
            {lead.stage || "NEW"}
          </span>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-600">
            AI Score
          </div>
          <span className={cn(
            "inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-sm",
            getScoreBadgeClasses(lead.lead_score)
          )}>
            {lead.lead_score || "-"}
          </span>
        </div>
      </div>
      
      {/* Lead Assignment */}
      <div>
        <LeadAssignment 
          leadId={lead.id} 
          currentOwnerId={lead.owner_id} 
          entityType="lead"
        />
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
    <div className="text-xs font-medium text-gray-400">
      {label}
    </div>
    <div className="text-sm text-gray-900 font-medium">
      {value || "-"}
    </div>
  </div>
);
