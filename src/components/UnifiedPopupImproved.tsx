import React from 'react';
import { usePopup } from '@/contexts/PopupContext';
import { PopupContainer } from './popup/PopupContainer';
import { LeadPopup } from './popup/LeadPopup';
import { CompanyPopup } from './popup/CompanyPopup';
import { JobPopup } from './popup/JobPopup';

export const UnifiedPopupImproved: React.FC = React.memo(() => {
  const { 
    activePopup, 
    popupData, 
    closePopup, 
    selectedLeads, 
    toggleLeadSelection,
    openLeadPopup,
    openCompanyPopup,
    openJobPopup
  } = usePopup();

  const handleRetry = () => {
    closePopup();
    setTimeout(() => {
      if (activePopup === 'lead' && popupData.lead?.id) {
        openLeadPopup(popupData.lead.id);
      } else if (activePopup === 'company' && popupData.company?.id) {
        openCompanyPopup(popupData.company.id);
      } else if (activePopup === 'job' && popupData.job?.id) {
        openJobPopup(popupData.job.id);
      }
    }, 100);
  };

  const renderPopupContent = () => {
    switch (activePopup) {
      case 'lead':
        return (
          <LeadPopup
            lead={popupData.lead}
            company={popupData.company}
            relatedLeads={popupData.relatedLeads}
            isLoadingRelatedLeads={popupData.isLoadingRelatedLeads || false}
            selectedLeads={selectedLeads}
            onLeadClick={openLeadPopup}
            onToggleSelection={toggleLeadSelection}
          />
        );
      case 'company':
        return (
          <CompanyPopup
            company={popupData.company}
            relatedLeads={popupData.relatedLeads}
            relatedJobs={popupData.relatedJobs}
            isLoadingRelatedLeads={popupData.isLoadingRelatedLeads || false}
            isLoadingRelatedJobs={popupData.isLoadingRelatedJobs || false}
            selectedLeads={selectedLeads}
            onLeadClick={openLeadPopup}
            onJobClick={openJobPopup}
            onToggleSelection={toggleLeadSelection}
          />
        );
      case 'job':
        return (
          <JobPopup
            job={popupData.job}
            company={popupData.company}
            relatedLeads={popupData.relatedLeads}
            isLoadingRelatedLeads={popupData.isLoadingRelatedLeads || false}
            selectedLeads={selectedLeads}
            onLeadClick={openLeadPopup}
            onToggleSelection={toggleLeadSelection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PopupContainer
      activePopup={activePopup}
      popupData={popupData}
      onClose={closePopup}
      onRetry={handleRetry}
    >
      {renderPopupContent()}
    </PopupContainer>
  );
});
