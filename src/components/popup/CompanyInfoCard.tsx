import React from 'react';
import { InfoCard } from '../shared/InfoCard';
import { StatusBadge } from '../StatusBadge';
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
  Target 
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

  const logoUrl = company.profile_image_url || getClearbitLogo(company.name, company.website);

  return (
    <InfoCard title={title} contentSpacing="space-y-3 pt-1.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden">
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
          <div className="text-lg font-semibold text-foreground">{company.name}</div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {company.head_office && <span>{company.head_office}</span>}
            {company.website && (
              <>
                {company.head_office && <span>•</span>}
                <ExternalLink className="h-3 w-3" />
                <a 
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {company.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <InfoField label="Company Name" value={company.name} />
        <InfoField label="Head Office" value={company.head_office} />
        <InfoField label="Industry" value={company.industry} />
        <InfoField label="Company Size" value={company.company_size} />
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            AI Score
          </div>
          <div className="flex items-center justify-start">
            <span className={cn(
              "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border",
              getScoreBadgeClasses(company.lead_score)
            )}>
              {company.lead_score || "-"}
            </span>
          </div>
        </div>
        <InfoField label="Automation" value={company.automation_active ? "Active" : "Inactive"} />
        {company.linkedin_url && (
          <InfoField 
            label="LinkedIn"
            value={
              <a 
                href={company.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent hover:text-accent/80"
              >
                LinkedIn
              </a>
            } 
          />
        )}
        {company.priority && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Priority
            </div>
            <div className="flex items-center justify-start">
              <span className={cn(
                "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border",
                getPriorityBadgeClasses(company.priority)
              )}>
                {company.priority || "Medium"}
              </span>
            </div>
          </div>
        )}
        {company.confidence_level && (
          <InfoField label="Confidence Level" value={company.confidence_level} />
        )}
      </div>
      
      {company.score_reason && (
        <div className="p-2.5 bg-gray-50 rounded-lg">
          <div className="text-xs text-muted-foreground font-medium mb-1">AI Score Reason</div>
          <div className="text-sm text-foreground">{company.score_reason}</div>
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
      {value || "Not specified"}
    </div>
  </div>
);
