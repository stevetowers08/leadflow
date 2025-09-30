import React from 'react';
import { InfoCard } from '@/components/shared/InfoCard';
import { StatusBadge } from '@/components/StatusBadge';
import { LeadSourceDisplay } from '@/components/features/leads/LeadSourceDisplay';
import { TagDisplay } from '@/components/TagDisplay';
import { TagSelector } from '@/components';
import { getScoreBadgeClasses, getTextScoreBadgeClasses, getPriorityBadgeClasses } from '@/utils/scoreUtils';
import { cn } from '@/lib/utils';
import { 
  Building2, 
  MapPin, 
  Settings, 
  Users, 
  Star, 
  Activity, 
  ExternalLink, 
  Target,
  Globe
} from 'lucide-react';
import { getClearbitLogo } from '@/utils/logoService';

interface CompanyInfoCardProps {
  company: any;
  title?: string;
}

export const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({ 
  company, 
  title = "Company Information" 
}) => {
  if (!company) return null;

  // Get company logo using Clearbit
  const getCompanyLogo = () => {
    if (!company.website) return null;
    const cleanWebsite = company.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    return `https://logo.clearbit.com/${cleanWebsite}`;
  };

  const logoUrl = getCompanyLogo();

  return (
    <InfoCard title={title} contentSpacing="space-y-6 pt-1.5">
      {/* Header Section - Company name, logo and details */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden bg-white border border-gray-200">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={`${company.name} logo`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div 
            className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/20 rounded-xl flex items-center justify-center" 
            style={{ display: logoUrl ? 'none' : 'flex' }}
          >
            <Building2 className="h-6 w-6 text-accent" />
          </div>
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-foreground">{company.name}</div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {company.head_office && <span>{company.head_office}</span>}
            {/* Website and LinkedIn Links */}
            <div className="flex items-center gap-2 ml-2">
              {company.website && (
                <a 
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                  title="Visit website"
                >
                  <Globe className="h-3 w-3 text-gray-500" />
                </a>
              )}
              {company.linkedin_url && (
                <a 
                  href={company.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                  title="View LinkedIn profile"
                >
                  <div className="w-3 h-3 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">in</span>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Company Info Section */}
      <div className="grid grid-cols-3 gap-3">
        <InfoField label="Industry" value={company.industry} />
        <InfoField label="Company Size" value={company.company_size} />
        <InfoField label="Head Office" value={company.head_office} />
        <InfoField label="Added Date" value={company.created_at ? new Date(company.created_at).toLocaleDateString() : "-"} />
        {company.lead_source && (
          <InfoField label="Lead Source" value={company.lead_source} />
        )}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-600">
            Status
          </div>
          <span className={cn(
            "inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-sm",
            company.automation_active 
              ? "bg-green-50 text-green-700 border-green-200"
              : company.confidence_level === 'high'
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : company.confidence_level === 'medium'
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          )}>
            {company.automation_active 
              ? "AUTOMATED" 
              : company.confidence_level === 'high'
              ? "QUALIFIED"
              : company.confidence_level === 'medium'
              ? "PROSPECT"
              : "NEW LEAD"
            }
          </span>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-600">
            AI Score
          </div>
          <span className={cn(
            "inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-sm",
            getScoreBadgeClasses(company.lead_score)
          )}>
            {company.lead_score || "-"}
          </span>
        </div>
      </div>
      
      {/* AI Info Section */}
      {company.score_reason && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-semibold text-blue-700 mb-2">AI Info</div>
          <div className="text-sm text-blue-900 leading-relaxed">{company.score_reason}</div>
        </div>
      )}
      
      {/* Tags Section - At the bottom */}
      {company.tags && company.tags.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-400">
            Tags
          </div>
          <TagDisplay 
            tags={company.tags}
            size="sm"
            maxVisible={5}
            showAll={true}
          />
        </div>
      )}
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
      {value || "-"}
    </div>
  </div>
);
