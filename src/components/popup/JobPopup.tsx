import React from 'react';
import { JobInfoCard } from './JobInfoCard';
import { CompanyInfoCard } from './CompanyInfoCard';
import { RelatedItemsList } from './RelatedItemsList';

interface JobPopupProps {
  job: any;
  company?: any;
  relatedLeads?: any[];
  isLoadingRelatedLeads: boolean;
  selectedLeads: any[];
  onLeadClick: (leadId: string) => void;
  onToggleSelection: (lead: any) => void;
}

export const JobPopup: React.FC<JobPopupProps> = React.memo(({
  job,
  company,
  relatedLeads = [],
  isLoadingRelatedLeads,
  selectedLeads,
  onLeadClick,
  onToggleSelection
}) => {
  if (!job) return null;

  return (
    <>
      <JobInfoCard job={job} />
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
