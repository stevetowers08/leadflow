import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';
import React from 'react';

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    industry?: string;
    head_office?: string;
    company_size?: string;
    website?: string;
    logo?: string;
    lead_score?: string;
    pipeline_stage?: string;
  };
  onClick: () => void;
  className?: string;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onClick,
  className = ''
}) => {
  // Get company logo using Clearbit
  const getCompanyLogo = () => {
    if (company.logo) return company.logo;
    if (!company.website) return null;
    const cleanWebsite = company.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    return `https://logo.clearbit.com/${cleanWebsite}`;
  };

  const logo = getCompanyLogo();

  return (
    <div 
      className={cn(
        "px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {/* Company Logo */}
        <div className="flex-shrink-0 w-8 h-8 rounded-md border border-gray-200 bg-white flex items-center justify-center">
          {logo ? (
            <img
              src={logo}
              alt={`${company.name} logo`}
              className="w-full h-full rounded-md object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full rounded-md bg-gray-100 text-gray-400 flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
          )}
        </div>
        
        {/* Company Info */}
        <div className="flex-1 min-w-0 cursor-pointer">
          <div className="font-semibold text-sm truncate">{company.name}</div>
          {company.head_office && (
            <div className="text-xs text-gray-500 truncate">{company.head_office}</div>
          )}
        </div>
        
        {/* Pipeline Stage and AI Score */}
        <div className="flex items-center gap-2">
          <StatusBadge status={company.pipeline_stage || "new_lead"} size="sm" />
          <span className={cn(
            "inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium border",
            company.lead_score === "High" && "bg-green-50 text-green-700 border-green-200",
            company.lead_score === "Medium" && "bg-yellow-50 text-yellow-700 border-yellow-200", 
            company.lead_score === "Low" && "bg-red-50 text-red-700 border-red-200",
            !company.lead_score && "bg-gray-50 text-gray-700 border-gray-200"
          )}>
            {company.lead_score || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};
