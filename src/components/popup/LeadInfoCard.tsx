import React, { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Star, Plus, User, Zap } from 'lucide-react';
import { TagSelector } from '@/components/forms/TagSelector';
import { TagDisplay } from '@/components/TagDisplay';
import { useEntityTags } from '@/hooks/useEntityTags';
import { InfoCard } from '@/components/shared/InfoCard';
import { UserAssignmentDisplay } from '@/components/shared/UserAssignmentDisplay';
import { getTextScoreBadgeClasses } from '@/utils/scoreUtils';

interface LeadInfoCardProps {
  lead: {
    id: string;
    name: string;
    company_role?: string;
    employee_location?: string;
    email_address?: string;
    linkedin_url?: string;
    last_interaction_at?: string;
    stage?: string;
    owner_id?: string;
    created_at?: string;
    lead_score?: string;
  };
  onAutomate?: () => void;
}

export const LeadInfoCard: React.FC<LeadInfoCardProps> = ({ lead, onAutomate }) => {
  if (!lead) return null;

  const { tags, addTag, removeTag, updateTags } = useEntityTags({
    entityId: lead.id,
    entityType: 'person'
  });

  const [showTagSelector, setShowTagSelector] = useState(false);

  const getScoreBadgeClasses = (score: number | null) => {
    if (!score) return "bg-gray-50 text-gray-700 border-gray-200";
    if (score >= 80) return "bg-green-50 text-green-700 border-green-200";
    if (score >= 60) return "bg-blue-50 text-blue-700 border-blue-200";
    if (score >= 40) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <InfoCard 
      title="Lead Information" 
        contentSpacing="space-y-4 pt-4"
      showDivider={true}
      actionButton={
        onAutomate ? (
          <button
            onClick={onAutomate}
            className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground transition-colors px-4 py-1.5 h-8 text-sm font-medium flex items-center justify-center rounded-md"
          >
            <Zap className="h-4 w-4" />
          </button>
        ) : undefined
      }
    >
      {/* Row 1: Lead Name + LinkedIn, Last Interaction, Added */}
      <div className="grid grid-cols-3 gap-3 items-center">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-gray-900 leading-tight">{lead.name}</div>
              {lead.linkedin_url && (
                <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                  <img src="https://logo.clearbit.com/linkedin.com" alt="LinkedIn" className="h-4 w-4" />
                </a>
              )}
            </div>
            {lead.company_role && (
              <div className="text-sm text-gray-500 leading-tight">{lead.company_role}</div>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400">Last Interaction</div>
          <div className="text-sm text-gray-900 font-medium">
            {lead.last_interaction_at ? (
              formatDistanceToNow(new Date(lead.last_interaction_at), { addSuffix: true })
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400">Added</div>
          <div className="text-sm text-gray-900 font-medium">
            {lead.created_at ? (
              formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Location, Email */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400">Location</div>
          <div className="text-sm text-gray-900 font-medium">
            {lead.employee_location ? (
              lead.employee_location.replace(/,?\s*Australia\s*,?/gi, '').replace(/^,\s*|,\s*$/g, '').trim() || '-'
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400">Email</div>
          <div className="text-sm text-gray-900 font-medium">
            {lead.email_address ? (
              <a href={`mailto:${lead.email_address}`} className="text-blue-600 hover:text-blue-800 transition-colors truncate">
                {lead.email_address}
              </a>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </div>
        <div className="space-y-1">
          {/* Empty third column - maintains consistent 3-column grid layout */}
        </div>
      </div>
      
      {/* Section 4: Person Tags */}
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
                entityId={lead.id}
                entityType="person"
                selectedTags={tags}
                onTagsChange={updateTags}
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

      {/* Assignment, Status, AI Score Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400">Assignment</div>
          <div className="w-fit">
            <UserAssignmentDisplay
              ownerId={lead.owner_id}
              entityId={lead.id}
              entityType="lead"
              onAssignmentChange={() => {
                // Trigger refresh if needed
                console.log('Assignment changed for lead:', lead.id);
              }}
              className="text-sm"
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400">Status</div>
          <div className="w-fit">
            <StatusBadge status={lead.stage || "new"} size="sm" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400">AI Score</div>
          <div className={`h-7 px-2 rounded-md text-xs font-semibold border flex items-center justify-center w-fit ${getTextScoreBadgeClasses(lead.lead_score)}`}>
            {lead.lead_score || "-"}
          </div>
        </div>
      </div>
    </InfoCard>
  );
};