import React from 'react';
import { PopupModal } from '../shared/PopupModal';
import { StatusBadge } from '../StatusBadge';
import { getLabel } from '@/utils/labels';
import { User, Building2, Briefcase } from 'lucide-react';

interface PopupContainerProps {
  activePopup: 'lead' | 'company' | 'job' | null;
  popupData: any;
  onClose: () => void;
  onRetry: () => void;
  children: React.ReactNode;
}

export const PopupContainer: React.FC<PopupContainerProps> = ({
  activePopup,
  popupData,
  onClose,
  onRetry,
  children
}) => {
  if (!activePopup) return null;

  const getPopupTitle = () => {
    switch (activePopup) {
      case 'lead':
        return popupData.lead?.name || 'Lead';
      case 'company':
        return popupData.company?.name || 'Company';
      case 'job':
        return popupData.job?.title || 'Job';
      default:
        return '';
    }
  };

  const getPopupSubtitle = () => {
    switch (activePopup) {
      case 'lead':
        return `${popupData.lead?.company_role || ''} at ${popupData.company?.name || 'Unknown Company'}`;
      case 'company':
        return popupData.company?.head_office || 'Location not specified';
      case 'job':
        const location = popupData.job?.location || 'Location not specified';
        const companyName = popupData.company?.name || 'Unknown Company';
        return `${location} • ${companyName}`;
      default:
        return '';
    }
  };

  const getPopupIcon = () => {
    switch (activePopup) {
      case 'lead':
        return <User className="h-5 w-5 text-muted-foreground mt-1" />;
      case 'company':
        return <Building2 className="h-5 w-5 text-muted-foreground mt-1" />;
      case 'job':
        return <Briefcase className="h-5 w-5 text-muted-foreground mt-1" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (activePopup) {
      case 'lead':
        return <StatusBadge status={popupData.lead?.stage || "new"} size="sm" />;
      case 'company':
        return <StatusBadge 
          status={popupData.company?.automation_active ? "Active" : 
                 popupData.company?.confidence_level === 'high' ? "Qualified" : 
                 popupData.company?.confidence_level === 'medium' ? "Prospect" : "New Lead"} 
          size="sm" 
        />;
      case 'job':
        return <StatusBadge status={popupData.job?.priority || "Medium"} size="sm" />;
      default:
        return null;
    }
  };

  const getScoringDisplay = () => {
    switch (activePopup) {
      case 'lead':
        return {
          label: getLabel('popup', 'ai_score'),
          value: popupData.lead?.lead_score || "N/A",
          type: 'lead_score' as const
        };
      case 'company':
        return {
          label: getLabel('popup', 'ai_score'),
          value: popupData.company?.lead_score || "N/A",
          type: 'company_score' as const
        };
      case 'job':
        return {
          label: getLabel('popup', 'ai_score'),
          value: popupData.job?.lead_score_job || "N/A",
          type: 'job_score' as const
        };
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (activePopup) {
      case 'lead':
        return getLabel('popup', 'status');
      case 'company':
        return getLabel('popup', 'status');
      case 'job':
        return getLabel('popup', 'priority');
      default:
        return getLabel('popup', 'status');
    }
  };

  const getLoadingState = () => {
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
  };

  const getErrorState = () => {
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
  };

  return (
    <PopupModal
      isOpen={!!activePopup}
      onClose={onClose}
      title={getPopupTitle()}
      subtitle={getPopupSubtitle()}
      icon={getPopupIcon()}
      statusBadge={getStatusBadge()}
      statusLabel={getStatusLabel()}
      scoringDisplay={getScoringDisplay()}
      isLoading={getLoadingState()}
      error={getErrorState()}
      onRetry={onRetry}
    >
      {children}
    </PopupModal>
  );
};
