import React, { useState } from 'react';
import { InfoCard } from '@/components/shared/InfoCard';
import { InfoField } from '@/components/shared/InfoField';
import { TagDisplay } from '@/components/TagDisplay';
import { TagSelector } from '@/components/forms/TagSelector';
import { Button } from '@/components/ui/button';
import { Globe, Plus, Building2 } from 'lucide-react';
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
}

export const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({ 
  company, 
  onCompanyClick
}) => {
  const [tags, setTags] = useState<Tag[]>(company.tags || []);
  const [showTagSelector, setShowTagSelector] = useState(false);

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
    <InfoCard title="Company Information" contentSpacing="space-y-8" showDivider={false}>
      {/* Section 1: Company Header */}
      <div className="grid grid-cols-3 gap-3 items-center">
        {/* Column 1 - Logo, Company Name, Head Office */}
        <div className="flex items-center gap-3">
          {/* Company Logo */}
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
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
            <Building2 className={`w-10 h-10 text-gray-400 ${logo ? 'hidden' : ''}`} />
          </div>
          
          {/* Company Info */}
          <div className="min-w-0">
            <div className="text-xl font-bold text-gray-900 leading-tight">{company.name}</div>
            {company.head_office && (
              <div className="text-sm text-gray-500 leading-tight">{company.head_office}</div>
            )}
          </div>
        </div>

        {/* Column 2 - AI Score */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">AI Score</div>
          <div className="text-sm text-gray-900 font-medium">
            <div className={`px-2 py-1 rounded-md border text-xs font-semibold w-fit ${getScoreBadgeClasses(company.lead_score)}`}>
              {company.lead_score || "-"}
            </div>
          </div>
        </div>

        {/* Column 3 - LinkedIn and Website Icons */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide"></div>
          <div className="text-sm text-gray-900 font-medium">
            <div className="flex items-center gap-3">
              {company.linkedin_url && (
                <a 
                  href={company.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                  title="View LinkedIn profile"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-bold">in</span>
                  </div>
                </a>
              )}
              
              {company.website && (
                <a 
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                  title="Visit website"
                >
                  <Globe className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>
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
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tags</div>
          
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTagSelector(false)}
                  >
                    ×
                  </Button>
                </div>
                <TagSelector
                  entityId={company.id}
                  entityType="company"
                  selectedTags={tags}
                  onTagsChange={setTags}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setShowTagSelector(false)}>
                    Done
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
    </InfoCard>
  );
};
