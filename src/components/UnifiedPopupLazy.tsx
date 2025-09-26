import React, { Suspense, lazy } from 'react';
import { usePopup } from '@/contexts/PopupContext';
import { PopupContainer } from './popup/PopupContainer';

// Lazy load popup components for better performance
const LeadPopup = lazy(() => import('./popup/LeadPopup').then(module => ({ default: module.LeadPopup })));
const CompanyPopup = lazy(() => import('./popup/CompanyPopup').then(module => ({ default: module.CompanyPopup })));
const JobPopup = lazy(() => import('./popup/JobPopup').then(module => ({ default: module.JobPopup })));

// Loading skeleton component
const PopupSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

export const UnifiedPopupLazy: React.FC = React.memo(() => {
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
          <Suspense fallback={<PopupSkeleton />}>
            <LeadPopup
              lead={popupData.lead}
              company={popupData.company}
              relatedLeads={popupData.relatedLeads}
              isLoadingRelatedLeads={popupData.isLoadingRelatedLeads || false}
              selectedLeads={selectedLeads}
              onLeadClick={openLeadPopup}
              onToggleSelection={toggleLeadSelection}
            />
          </Suspense>
        );
      case 'company':
        return (
          <Suspense fallback={<PopupSkeleton />}>
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
          </Suspense>
        );
      case 'job':
        return (
          <Suspense fallback={<PopupSkeleton />}>
            <JobPopup
              job={popupData.job}
              company={popupData.company}
              relatedLeads={popupData.relatedLeads}
              isLoadingRelatedLeads={popupData.isLoadingRelatedLeads || false}
              selectedLeads={selectedLeads}
              onLeadClick={openLeadPopup}
              onToggleSelection={toggleLeadSelection}
            />
          </Suspense>
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
