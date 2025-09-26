import React from 'react';
import { InfoCard } from '../shared/InfoCard';
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
    <InfoCard title={title} contentSpacing="space-y-4 pt-2">
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
            className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center" 
            style={{ display: logoUrl ? 'none' : 'flex' }}
          >
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold text-foreground">{company.name}</div>
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
                  className="hover:text-blue-600 transition-colors"
                >
                  {company.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <InfoField icon={<Building2 className="h-4 w-4" />} value={company.name} />
        <InfoField icon={<MapPin className="h-4 w-4" />} value={company.head_office} />
        <InfoField icon={<Settings className="h-4 w-4" />} value={company.industry} />
        <InfoField icon={<Users className="h-4 w-4" />} value={company.company_size} />
        <InfoField icon={<Star className="h-4 w-4" />} value={company.lead_score} />
        <InfoField 
          icon={<Activity className="h-4 w-4" />} 
          value={company.automation_active ? "Active" : "Inactive"} 
        />
        {company.linkedin_url && (
          <InfoField 
            icon={<ExternalLink className="h-4 w-4" />} 
            value={
              <a 
                href={company.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                LinkedIn
              </a>
            } 
          />
        )}
        {company.priority && (
          <InfoField icon={<Target className="h-4 w-4" />} value={company.priority} />
        )}
        {company.confidence_level && (
          <InfoField icon={<Activity className="h-4 w-4" />} value={company.confidence_level} />
        )}
      </div>
      
      {company.score_reason && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-muted-foreground font-medium mb-1">AI Score Reason</div>
          <div className="text-sm text-foreground">{company.score_reason}</div>
        </div>
      )}
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
