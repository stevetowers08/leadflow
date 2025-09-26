import React from 'react';
import { ModalContainer } from './shared/ModalContainer';
import { EntityHeader } from './shared/EntityHeader';
import { RelatedItems } from './shared/RelatedItems';
import { JobInfoCard } from '../popup/JobInfoCard';
import { CompanyInfoCard } from '../popup/CompanyInfoCard';
import { Briefcase } from 'lucide-react';
import { JobModalProps } from './types';

export const JobDetailModal: React.FC<JobDetailModalProps> = React.memo(({
  job,
  company,
  relatedLeads = [],
  isLoading,
  isLoadingRelatedLeads,
  selectedLeads,
  onClose,
  onLeadClick,
  onToggleSelection,
  onRetry,
  error
}) => {
  if (!job) return null;

  return (
    <ModalContainer
      isOpen={!!job}
      onClose={onClose}
      icon={<Briefcase className="h-5 w-5 text-muted-foreground" />}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
    >
      <EntityHeader 
        type="job" 
        entity={job} 
        company={company} 
      />
      <div className="space-y-6 mt-6">
        <JobInfoCard job={job} />
        {company && <CompanyInfoCard company={company} />}
        <RelatedItems
          title="Related Leads"
          items={relatedLeads}
          isLoading={isLoadingRelatedLeads}
          selectedLeads={selectedLeads}
          onItemClick={onLeadClick}
          onToggleSelection={onToggleSelection}
          showCheckbox={true}
          showAutomateButton={true}
          itemType="lead"
        />
      </div>
    </ModalContainer>
  );
});
