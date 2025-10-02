import React, { useState } from 'react';
import { InfoCard } from '@/components/shared/InfoCard';
import { InfoField } from '@/components/shared/InfoField';
import { TagDisplay } from '@/components/TagDisplay';
import { TagSelector } from '@/components/forms/TagSelector';
import { Plus, Building2, Globe } from 'lucide-react';
import { getScoreBadgeClasses } from '@/utils/scoreUtils';

interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface CompanyInfoCardProps {
  company: {
    id: string;
    name: string;
    industry?: string;
    head_office?: string;
    company_size?: string;
    website?: string;
    linkedin_url?: string;
    lead_score?: string;
    automation_active?: boolean;
    score_reason?: string;
    created_at?: string;
    lead_source?: string;
    logo_url?: string;
    tags?: Tag[];
  };
  onCompanyClick?: (companyId: string, companyName: string) => void;
  showTitle?: boolean;
}

export const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({ 
  company, 
  onCompanyClick,
  showTitle = true
}) => {
  const [tags, setTags] = useState<Tag[]>(company.tags || []);
  const [showTagSelector, setShowTagSelector] = useState(false);
  
  // Simple click handler
  const handleCompanyClick = onCompanyClick ? () => onCompanyClick(company.id, company.name) : undefined;

  // Get company logo using Clearbit (same logic as CompanyCard)
  const getCompanyLogo = () => {
    if (company.logo_url) return company.logo_url;
    if (!company.website) return null;
    const cleanWebsite = company.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    return `https://logo.clearbit.com/${cleanWebsite}`;
  };

  const logo = getCompanyLogo();

  if (!company) return null;

  return (
    <InfoCard title={showTitle ? "Company Information" : undefined} contentSpacing="space-y-4 pt-1" showDivider={false}>
      {/* Section 1: Company Header - Aligned with Lead Card */}
      <div className="grid grid-cols-3 gap-3 items-center">
        {/* Column 1 - Logo, Company Name with Icons, Head Office */}
        <div 
          className={`flex items-center gap-3 ${handleCompanyClick ? 'cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg p-2' : ''}`}
          onClick={handleCompanyClick}
          role={handleCompanyClick ? 'button' : undefined}
          tabIndex={handleCompanyClick ? 0 : undefined}
          aria-label={handleCompanyClick ? `View ${company.name} company details` : undefined}
          aria-describedby={handleCompanyClick ? `company-${company.id}-description` : undefined}
        >
          {/* Company Logo - Aligned with Lead Card */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            {logo ? (
              <img 
                src={logo} 
                alt={`${company.name} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <Building2 className={`w-8 h-8 text-gray-400 ${logo ? 'hidden' : ''}`} />
          </div>
          
          {/* Company Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-gray-900 leading-tight">{company.name}</div>
              {company.linkedin_url && (
                <a 
                  href={company.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sidebar-primary hover:text-sidebar-primary/80 transition-colors"
                  title="View LinkedIn profile"
                >
                  <img src="https://logo.clearbit.com/linkedin.com" alt="LinkedIn" className="h-4 w-4" />
                </a>
              )}
              {company.website && (
                <a 
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sidebar-primary hover:text-sidebar-primary/80 transition-colors"
                  title="Visit website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
            {company.head_office && (
              <div className="text-sm text-gray-500 leading-tight">{company.head_office}</div>
            )}
          </div>
        </div>

        {/* Column 2 - AI Score */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400">AI Score</div>
          <div className="text-sm text-gray-900 font-medium">
            <div className={`h-7 px-2 rounded-md border text-xs font-semibold w-fit flex items-center justify-center ${getScoreBadgeClasses(company.lead_score)}`}>
              {company.lead_score || "-"}
            </div>
          </div>
        </div>

        {/* Column 3 - Empty (for consistent 3-column layout) */}
        <div></div>

      </div>

      {/* Section 2: Company Details */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <InfoField label="Industry" value={company.industry} />
          <InfoField label="Company Size" value={company.company_size} />
          <InfoField label="Added Date" value={company.created_at ? new Date(company.created_at).toLocaleDateString() : "-"} />
        </div>
      </div>

      {/* Section 3: AI Analysis */}
      {company.score_reason && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-semibold text-blue-700 mb-2">AI Analysis</div>
          <div className="text-sm text-blue-900 leading-relaxed">{company.score_reason}</div>
        </div>
      )}
        
        {/* Company Tags */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-400">Tags</div>
          
          {tags.length > 0 ? (
            <div className="space-y-2">
              <TagDisplay 
                tags={tags}
                size="sm"
                maxVisible={5}
                showAll={true}
              />
              <button
                onClick={() => setShowTagSelector(true)}
                className="h-6 w-6 p-0 border border-gray-300 hover:bg-gray-100 rounded flex items-center justify-center"
              >
                <Plus className="h-3 w-3 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-500">No tags added yet</div>
              <button
                onClick={() => setShowTagSelector(true)}
                className="h-6 w-6 p-0 border border-gray-300 hover:bg-gray-100 rounded flex items-center justify-center"
              >
                <Plus className="h-3 w-3 text-gray-600" />
              </button>
            </div>
          )}

          {/* Tag Selector Modal */}
          {showTagSelector && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Tags</h3>
                  <button
                    onClick={() => setShowTagSelector(false)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-2"
                  >
                    ×
                  </button>
                </div>
                <TagSelector
                  entityId={company.id}
                  entityType="company"
                  selectedTags={tags}
                  onTagsChange={setTags}
                />
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => setShowTagSelector(false)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm hover:shadow-md h-8 px-3"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </InfoCard>
  );
};
