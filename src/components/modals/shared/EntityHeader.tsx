import React, { useMemo } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { getLabel } from '@/utils/labels';
import { Lead, Company, Job } from '../types';

interface EntityHeaderProps {
  type: 'lead' | 'company' | 'job';
  entity: Lead | Company | Job;
  company?: Company;
}

export const EntityHeader: React.FC<EntityHeaderProps> = React.memo(({ type, entity, company }) => {
  const title = useMemo(() => {
    switch (type) {
      case 'lead':
        return entity?.name || 'Lead';
      case 'company':
        return entity?.name || 'Company';
      case 'job':
        return entity?.title || 'Job';
      default:
        return '';
    }
  }, [type, entity?.name, entity?.title]);

  const subtitle = useMemo(() => {
    switch (type) {
      case 'lead':
        return `${entity?.company_role || ''} at ${company?.name || 'Unknown Company'}`;
      case 'company':
        return entity?.head_office || 'Location not specified';
      case 'job':
        return entity?.location || 'Location not specified';
      default:
        return '';
    }
  }, [type, entity?.company_role, entity?.head_office, entity?.location, company?.name]);

  const statusBadge = useMemo(() => {
    switch (type) {
      case 'lead':
        return <StatusBadge status={entity?.stage || "new"} size="sm" />;
      case 'company':
        return <StatusBadge 
          status={entity?.automation_active ? "Active" : 
                 entity?.confidence_level === 'high' ? "Qualified" : 
                 entity?.confidence_level === 'medium' ? "Prospect" : "New Lead"} 
          size="sm" 
        />;
      case 'job':
        return <StatusBadge status={entity?.priority || "Medium"} size="sm" />;
      default:
        return null;
    }
  }, [type, entity?.stage, entity?.automation_active, entity?.confidence_level, entity?.priority]);

  const scoringDisplay = useMemo(() => {
    const score = type === 'job' ? entity?.lead_score_job : entity?.lead_score;
    if (!score) return null;
    
    return (
      <div className="flex items-center gap-1 text-sm">
        <span className="text-gray-500">{getLabel('popup', 'ai_score')}:</span>
        <span className="font-medium text-gray-900">{score}</span>
      </div>
    );
  }, [type, entity?.lead_score, entity?.lead_score_job]);

  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-lg font-semibold text-black mb-1">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm font-medium text-gray-600">
          {subtitle}
        </p>
      )}
      <div className="flex items-center gap-2 mt-2">
        {statusBadge}
        {scoringDisplay}
      </div>
    </div>
  );
});
