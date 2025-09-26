import React from 'react';
import { ModalContainer } from './shared/ModalContainer';
import { EntityHeader } from './shared/EntityHeader';
import { RelatedItems } from './shared/RelatedItems';
import { LeadInfoCard } from '../popup/LeadInfoCard';
import { CompanyInfoCard } from '../popup/CompanyInfoCard';
import { User } from 'lucide-react';
import { LeadModalProps } from './types';

export const LeadDetailModal: React.FC<LeadDetailModalProps> = React.memo(({
  lead,
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
  if (!lead) return null;

  return (
    <ModalContainer
      isOpen={!!lead}
      onClose={onClose}
      icon={<User className="h-5 w-5 text-muted-foreground mt-1" />}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
    >
      <EntityHeader 
        type="lead" 
        entity={lead} 
        company={company} 
      />
      <div className="space-y-6">
        <LeadInfoCard lead={lead} />
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
