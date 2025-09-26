import React, { useMemo, useCallback } from 'react';
import { usePopup } from '@/contexts/PopupContext';
import { LeadDetailModal } from './LeadDetailModal';
import { CompanyDetailModal } from './CompanyDetailModal';
import { JobDetailModal } from './JobDetailModal';

export const ModalManager: React.FC = React.memo(() => {
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

  const handleRetry = useCallback(() => {
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
  }, [activePopup, popupData, closePopup, openLeadPopup, openCompanyPopup, openJobPopup]);

  const errorState = useMemo(() => {
    switch (activePopup) {
      case 'lead':
        return popupData.errorLead || popupData.errorRelatedLeads || popupData.errorRelatedJobs;
      case 'company':
        return popupData.errorCompany || popupData.errorRelatedLeads || popupData.errorRelatedJobs;
      case 'job':
        return popupData.errorJob || popupData.errorRelatedLeads;
      default:
        return null;
    }
  }, [activePopup, popupData.errorLead, popupData.errorRelatedLeads, popupData.errorRelatedJobs, popupData.errorCompany, popupData.errorJob]);

  const loadingState = useMemo(() => {
    switch (activePopup) {
      case 'lead':
        return popupData.isLoadingLead || popupData.isLoadingRelatedLeads || popupData.isLoadingRelatedJobs;
      case 'company':
        return popupData.isLoadingCompany || popupData.isLoadingRelatedLeads || popupData.isLoadingRelatedJobs;
      case 'job':
        return popupData.isLoadingJob || popupData.isLoadingRelatedLeads;
      default:
        return false;
    }
  }, [activePopup, popupData.isLoadingLead, popupData.isLoadingRelatedLeads, popupData.isLoadingRelatedJobs, popupData.isLoadingCompany, popupData.isLoadingJob]);

  if (!activePopup) return null;

  switch (activePopup) {
    case 'lead':
      return (
        <LeadDetailModal
          lead={popupData.lead}
          company={popupData.company}
          relatedLeads={popupData.relatedLeads}
          isLoading={loadingState}
          isLoadingRelatedLeads={popupData.isLoadingRelatedLeads || false}
          selectedLeads={selectedLeads}
          onClose={closePopup}
          onLeadClick={openLeadPopup}
          onToggleSelection={toggleLeadSelection}
          onRetry={handleRetry}
          error={errorState}
        />
      );
    
    case 'company':
      return (
        <CompanyDetailModal
          company={popupData.company}
          relatedLeads={popupData.relatedLeads}
          relatedJobs={popupData.relatedJobs}
          isLoading={loadingState}
          isLoadingRelatedLeads={popupData.isLoadingRelatedLeads || false}
          isLoadingRelatedJobs={popupData.isLoadingRelatedJobs || false}
          selectedLeads={selectedLeads}
          onClose={closePopup}
          onLeadClick={openLeadPopup}
          onJobClick={openJobPopup}
          onToggleSelection={toggleLeadSelection}
          onRetry={handleRetry}
          error={errorState}
        />
      );
    
    case 'job':
      return (
        <JobDetailModal
          job={popupData.job}
          company={popupData.company}
          relatedLeads={popupData.relatedLeads}
          isLoading={loadingState}
          isLoadingRelatedLeads={popupData.isLoadingRelatedLeads || false}
          selectedLeads={selectedLeads}
          onClose={closePopup}
          onLeadClick={openLeadPopup}
          onToggleSelection={toggleLeadSelection}
          onRetry={handleRetry}
          error={errorState}
        />
      );
    
    default:
      return null;
  }
});
