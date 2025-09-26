import React from 'react';
import { ModalContainer } from './shared/ModalContainer';
import { EntityHeader } from './shared/EntityHeader';
import { RelatedItems } from './shared/RelatedItems';
import { CompanyInfoCard } from '../popup/CompanyInfoCard';
import { Building2 } from 'lucide-react';
import { CompanyModalProps } from './types';

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = React.memo(({
  company,
  relatedLeads = [],
  relatedJobs = [],
  isLoading,
  isLoadingRelatedLeads,
  isLoadingRelatedJobs,
  selectedLeads,
  onClose,
  onLeadClick,
  onJobClick,
  onToggleSelection,
  onRetry,
  error
}) => {
  if (!company) return null;

  return (
    <ModalContainer
      isOpen={!!company}
      onClose={onClose}
      icon={<Building2 className="h-5 w-5 text-muted-foreground mt-1" />}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
    >
      <EntityHeader 
        type="company" 
        entity={company} 
      />
      <div className="space-y-6">
        <CompanyInfoCard company={company} />
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
        <RelatedItems
          title="Related Jobs"
          items={relatedJobs}
          isLoading={isLoadingRelatedJobs}
          selectedLeads={selectedLeads}
          onItemClick={onJobClick}
          itemType="job"
        />
      </div>
    </ModalContainer>
  );
});
