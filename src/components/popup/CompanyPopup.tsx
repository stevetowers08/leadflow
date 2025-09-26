import React from 'react';
import { CompanyInfoCard } from './CompanyInfoCard';
import { RelatedItemsList } from './RelatedItemsList';

interface CompanyPopupProps {
  company: any;
  relatedLeads?: any[];
  relatedJobs?: any[];
  isLoadingRelatedLeads: boolean;
  isLoadingRelatedJobs: boolean;
  selectedLeads: any[];
  onLeadClick: (leadId: string) => void;
  onJobClick: (jobId: string) => void;
  onToggleSelection: (lead: any) => void;
}

export const CompanyPopup: React.FC<CompanyPopupProps> = React.memo(({
  company,
  relatedLeads = [],
  relatedJobs = [],
  isLoadingRelatedLeads,
  isLoadingRelatedJobs,
  selectedLeads,
  onLeadClick,
  onJobClick,
  onToggleSelection
}) => {
  if (!company) return null;

  return (
    <>
      <CompanyInfoCard company={company} />
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
      <RelatedItemsList
        title="Related Jobs"
        items={relatedJobs}
        isLoading={isLoadingRelatedJobs}
        selectedLeads={selectedLeads}
        onItemClick={onJobClick}
        itemType="job"
      />
    </>
  );
});
