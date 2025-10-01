/**
 * Optimized Popup Component - Simplified Architecture
 * 
 * This replaces the complex 4-layer architecture with a simple 2-layer system:
 * App → OptimizedPopup → PopupModal
 * 
 * Benefits:
 * - Reduced complexity
 * - Better performance
 * - Easier maintenance
 * - Direct data fetching
 */

import React, { useState, useMemo, useCallback } from 'react';
import { PopupModal } from "@/components/shared/PopupModal";
import { LeadInfoCard } from "@/components/popup/LeadInfoCard";
import { CompanyInfoCard } from "@/components/popup/CompanyInfoCard";
import { JobInfoCard } from "@/components/popup/JobInfoCard";
import { RelatedItemsList } from "@/components/popup/RelatedItemsList";
import { User, Building2, Briefcase } from "lucide-react";

import { useEntityData } from "@/hooks/useEntityData";
import { useAuth } from "@/contexts/AuthContext";
import { useAssignmentRefresh } from '@/hooks/useAssignmentRefresh';

export type EntityType = 'lead' | 'company' | 'job';

interface OptimizedPopupProps {
  entityType: EntityType;
  entityId: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToEntity?: (type: EntityType, id: string, name: string) => void;
  onNavigateToCompany?: (companyId: string, companyName: string) => void;
}

export function OptimizedPopup({ 
  entityType, 
  entityId, 
  isOpen, 
  onClose, 
  onNavigateToEntity, 
  onNavigateToCompany 
}: OptimizedPopupProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const { user } = useAuth();
  const { refreshAssignmentLists, refreshSpecificEntity } = useAssignmentRefresh();

  const entityDataParams = useMemo(() => ({
    entityType,
    entityId,
    isOpen,
    refreshTrigger
  }), [entityType, entityId, isOpen, refreshTrigger]);

  // Use custom hook for data fetching
  const {
    entityData,
    companyData,
    leadsData,
    jobsData,
    isLoading,
    hasError
  } = useEntityData(entityDataParams);

  // Assignment change handler with auto-refresh
  const handleAssignmentChange = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    // Trigger refresh of all assignment lists
    refreshAssignmentLists();
    // Also refresh specific entity
    refreshSpecificEntity(entityType === 'lead' ? 'people' : entityType === 'company' ? 'companies' : 'jobs', entityId);
  }, [entityType, entityId, refreshAssignmentLists, refreshSpecificEntity]);

  // Get popup configuration based on entity type
  const getPopupConfig = () => {
    switch (entityType) {
      case 'lead':
        return {
          title: entityData?.full_name || 'Lead Details',
          subtitle: entityData?.company_name || 'No Company',
          icon: <User className="w-5 h-5" />,
          companyLogo: companyData?.logo_url,
          companyName: companyData?.name,
          entityType: 'lead' as const,
          entityId,
          currentStatus: entityData?.status,
          currentPriority: entityData?.priority,
          currentPipelineStage: entityData?.pipeline_stage,
          ownerId: entityData?.owner_id,
          automationStatus: entityData?.automation_status,
          canChangeStage: true
        };
      case 'company':
        return {
          title: entityData?.name || 'Company Details',
          subtitle: `${entityData?.industry || 'Unknown Industry'} • ${entityData?.size || 'Unknown Size'}`,
          icon: <Building2 className="w-5 h-5" />,
          companyLogo: entityData?.logo_url,
          companyName: entityData?.name,
          entityType: 'company' as const,
          entityId,
          currentStatus: entityData?.status,
          currentPriority: entityData?.priority,
          currentPipelineStage: entityData?.pipeline_stage,
          ownerId: entityData?.owner_id,
          automationStatus: entityData?.automation_status,
          canChangeStage: true
        };
      case 'job':
        return {
          title: entityData?.title || 'Job Details',
          subtitle: `${entityData?.company_name || 'Unknown Company'} • ${entityData?.location || 'Unknown Location'}`,
          icon: <Briefcase className="w-5 h-5" />,
          companyLogo: companyData?.logo_url,
          companyName: companyData?.name,
          entityType: 'job' as const,
          entityId,
          currentStatus: entityData?.status,
          currentPriority: entityData?.priority,
          currentPipelineStage: entityData?.pipeline_stage,
          ownerId: entityData?.owner_id,
          automationStatus: entityData?.automation_status,
          canChangeStage: true
        };
      default:
        return {
          title: 'Details',
          subtitle: '',
          icon: <User className="w-5 h-5" />,
          companyLogo: null,
          companyName: '',
          entityType: 'lead' as const,
          entityId,
          currentStatus: null,
          currentPriority: null,
          currentPipelineStage: null,
          ownerId: null,
          automationStatus: null,
          canChangeStage: false
        };
    }
  };

  const config = getPopupConfig();

  // Render content based on entity type
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sidebar-primary"></div>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="flex items-center justify-center p-8 text-red-500">
          <div className="text-center">
            <p className="text-lg font-semibold">Error loading data</p>
            <p className="text-sm text-gray-500">Please try again later</p>
          </div>
        </div>
      );
    }

    switch (entityType) {
      case 'lead':
        return (
          <div className="space-y-6">
            <LeadInfoCard 
              lead={entityData} 
              company={companyData}
              onAssignmentChange={handleAssignmentChange}
            />
            {companyData && (
              <CompanyInfoCard 
                company={companyData}
                onAssignmentChange={handleAssignmentChange}
              />
            )}
            {jobsData && jobsData.length > 0 && (
              <RelatedItemsList
                title="Related Jobs"
                items={jobsData}
                type="job"
              />
            )}
          </div>
        );
      case 'company':
        return (
          <div className="space-y-6">
            <CompanyInfoCard 
              company={entityData}
              onAssignmentChange={handleAssignmentChange}
            />
            {leadsData && leadsData.length > 0 && (
              <RelatedItemsList
                title="Related Leads"
                items={leadsData}
                type="lead"
              />
            )}
            {jobsData && jobsData.length > 0 && (
              <RelatedItemsList
                title="Related Jobs"
                items={jobsData}
                type="job"
              />
            )}
          </div>
        );
      case 'job':
        return (
          <div className="space-y-6">
            <JobInfoCard 
              job={entityData}
              company={companyData}
              onAssignmentChange={handleAssignmentChange}
            />
            {companyData && (
              <CompanyInfoCard 
                company={companyData}
                onAssignmentChange={handleAssignmentChange}
              />
            )}
            {leadsData && leadsData.length > 0 && (
              <RelatedItemsList
                title="Related Leads"
                items={leadsData}
                type="lead"
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      subtitle={config.subtitle}
      icon={config.icon}
      companyLogo={config.companyLogo}
      companyName={config.companyName}
      entityType={config.entityType}
      entityId={config.entityId}
      currentStatus={config.currentStatus}
      currentPriority={config.currentPriority}
      currentPipelineStage={config.currentPipelineStage}
      ownerId={config.ownerId}
      automationStatus={config.automationStatus}
      canChangeStage={config.canChangeStage}
      onAssignmentChange={handleAssignmentChange}
      isLoading={isLoading}
      error={hasError ? 'Failed to load data' : null}
    >
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded"></div>}>
        {renderContent()}
      </Suspense>
    </PopupModal>
  );
}
