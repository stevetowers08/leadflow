import React from 'react';
import { LeadInfoCard } from './LeadInfoCard';
import { CompanyInfoCard } from './CompanyInfoCard';
import { RelatedItemsList } from './RelatedItemsList';

interface LeadPopupProps {
  lead: any;
  company?: any;
  relatedLeads?: any[];
  isLoadingRelatedLeads: boolean;
  selectedLeads: any[];
  onLeadClick: (leadId: string) => void;
  onToggleSelection: (lead: any) => void;
}

export const LeadPopup: React.FC<LeadPopupProps> = React.memo(({
  lead,
  company,
  relatedLeads = [],
  isLoadingRelatedLeads,
  selectedLeads,
  onLeadClick,
  onToggleSelection
}) => {
  if (!lead) return null;

  return (
    <>
      <LeadInfoCard lead={lead} />
      {company && <CompanyInfoCard company={company} />}
      <RelatedItemsList
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
    </>
  );
});
