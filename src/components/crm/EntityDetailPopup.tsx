import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { PopupModal } from "@/components/shared/PopupModal";
import { FavoriteToggle } from "@/components/FavoriteToggle";
import { NotesSection } from "@/components/NotesSection";
import { LeadInfoCard } from "@/components/popup/LeadInfoCard";
import { CompanyInfoCard } from "@/components/popup/CompanyInfoCard";
import { CompanyCard } from "@/components/shared/CompanyCard";
import { InfoCard } from "@/components/shared/InfoCard";
import { InfoField } from "@/components/shared/InfoField";
import { JobInfoCard } from "@/components/popup/JobInfoCard";
import { RelatedItemsList } from "@/components/popup/RelatedItemsList";
import { StatusBadge } from "@/components/StatusBadge";
import { UserAssignmentDisplay } from "@/components/shared/UserAssignmentDisplay";
import { Button } from "@/components/ui/button";
import {
  User,
  Building2,
  Briefcase,
  MoreVertical,
  MessageSquare,
  Star,
  Activity,
  Plus,
  Zap
} from "lucide-react";
// Lazy load heavy components for better performance
const ActivityTimeline = lazy(() => import("./ActivityTimeline").then(module => ({ default: module.ActivityTimeline })));
const LinkedInAutomationModal = lazy(() => import("./automation/LinkedInAutomationModal").then(module => ({ default: module.LinkedInAutomationModal })));
const AddNoteModal = lazy(() => import("./AddNoteModal").then(module => ({ default: module.AddNoteModal })));
import { useEntityData } from "@/hooks/useEntityData";
import { useAuth } from "@/contexts/AuthContext";
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
import { useAssignmentRefresh } from '@/hooks/useAssignmentRefresh';
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type EntityType = 'lead' | 'company' | 'job';

interface EntityDetailPopupProps {
  entityType: EntityType;
  entityId: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToEntity?: (entityType: EntityType, entityId: string, entityName?: string) => void;
  onNavigateToCompany?: (companyId: string, companyName: string) => void; // Keep for backward compatibility
}

export function EntityDetailPopup({ entityType, entityId, isOpen, onClose, onNavigateToEntity, onNavigateToCompany }: EntityDetailPopupProps) {
  // console.log('🔍 EntityDetailPopup render:', { entityType, entityId, isOpen });
  
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedLeads, setSelectedLeads] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { onAssignmentChange } = usePopupNavigation();
  const { refreshAssignmentLists, refreshSpecificEntity } = useAssignmentRefresh();

  const { user } = useAuth();

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

  // Update favorite state when entityData changes
  React.useEffect(() => {
    if (entityData) {
      setIsFavorite(entityData.is_favourite || false);
    }
  }, [entityData]);

  // Reset selected leads when popup opens or entityId changes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedLeads([]);
    }
  }, [isOpen, entityId]);

  // Simple navigation handlers
  const handleCompanyClick = (companyId: string, companyName: string) => {
    // Use unified navigation if available, otherwise fall back to company-specific navigation
    if (onNavigateToEntity) {
      onNavigateToEntity('company', companyId, companyName);
    } else if (onNavigateToCompany) {
      onNavigateToCompany(companyId, companyName);
    }
  };

  const handleLeadClick = (leadId: string) => {
    const lead = leadsData?.find(l => l.id === leadId);
    if (lead) {
      if (onNavigateToEntity) {
        onNavigateToEntity('lead', leadId, lead.name);
      } else if (onNavigateToCompany) {
        // Fallback to company navigation pattern for backward compatibility
        onNavigateToCompany(leadId, lead.name);
      }
    }
  };

  const handleJobClick = (jobId: string) => {
    const job = jobsData?.find(j => j.id === jobId);
    if (job) {
      if (onNavigateToEntity) {
        onNavigateToEntity('job', jobId, job.title);
      } else if (onNavigateToCompany) {
        // Fallback to company navigation pattern for backward compatibility
        onNavigateToCompany(jobId, job.title);
      }
    }
  };

  const handleKeyDown = () => {
    // Simple keyboard handler - just close on Escape
    // Could be enhanced later
  };

  const handleAutomationClick = () => {
    if (selectedLeads.length > 0) {
      setShowAutomationModal(true);
    }
  };

  const handleCurrentLeadAutomation = () => {
    // Create a single lead array with the current lead for automation
    // Use the same structure as the database to avoid double mapping
    const currentLead = {
      id: entityData?.id || "",
      name: entityData?.name || "Unknown Name",
      company_role: entityData?.company_role || "Unknown Role",
      email_address: entityData?.email_address || null,
      employee_location: entityData?.employee_location || "Unknown Location",
      linkedin_url: entityData?.linkedin_url || null,
      linkedin_request_message: entityData?.linkedin_request_message || "",
      linkedin_connected_message: entityData?.linkedin_connected_message || "",
      linkedin_follow_up_message: entityData?.linkedin_follow_up_message || "",
      stage: entityData?.stage || "new",
      lead_score: entityData?.lead_score || 0,
      automation_started_at: entityData?.automation_started_at || null,
      created_at: entityData?.created_at || new Date().toISOString()
    };
    
    setSelectedLeads([currentLead]);
    setShowAutomationModal(true);
  };

  const handleActivityClick = () => {
    setShowActivityModal(true);
  };

  const handlePipelineStageChange = async (stage: string) => {
    if (entityType !== 'company' || !entityId) return;
    
    // Only allow stage changes if current stage is 'replied' or below
    const currentStage = entityData?.pipeline_stage;
    const allowedStages = ['new_lead', 'automated', 'replied'];
    
    if (!allowedStages.includes(currentStage)) {
      alert('You can only change the stage for companies in "New Lead", "Automated", or "Replied" stages.');
      return;
    }
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to move this company from "${currentStage}" to "${stage}"?`
    );
    
    if (!confirmed) return;
    
    try {
      const { error } = await supabase
        .from('companies')
        .update({ pipeline_stage: stage })
        .eq('id', entityId);
      
      if (error) {
        console.error('Error updating pipeline stage:', error);
        return;
      }
      
      // Pipeline stage updated successfully
      // The useEntityData hook should automatically refetch and update the UI
    } catch (error) {
      console.error('Error updating pipeline stage:', error);
    }
  };

  // Determine automation status for company
  const getAutomationStatus = () => {
    if (!leadsData || leadsData.length === 0) return 'manual';
    
    // A lead is automated if automation has started and they're in an automated stage
    const automatedStages = ['connection_requested', 'in queue', 'messaged', 'connected'];
    
    const hasAutomatedLeads = leadsData.some(lead => 
      lead.automation_started_at && automatedStages.includes(lead.stage)
    );
    
    // A lead is pending if automation has started but they're still in 'new' stage
    const hasPendingLeads = leadsData.some(lead => 
      lead.automation_started_at && lead.stage === 'new'
    );
    
    if (hasAutomatedLeads) return 'automated';
    if (hasPendingLeads) return 'pending';
    return 'manual'; // No automation started on any leads
  };

  const handleToggleSelection = (leadId: string) => {
    setSelectedLeads(prev => {
      const lead = leadsData?.find(l => l.id === leadId);
      if (!lead) return prev;
      
      const isSelected = prev.some(selected => selected.id === leadId);
      if (isSelected) {
        return prev.filter(selected => selected.id !== leadId);
      } else {
        return [...prev, lead];
      }
    });
  };

  const handleAssignmentChange = () => {
    setRefreshTrigger(prev => prev + 1);
    // Trigger refresh of all assignment lists
    refreshAssignmentLists();
    // Also refresh specific entity
    refreshSpecificEntity(entityType === 'lead' ? 'people' : entityType === 'company' ? 'companies' : 'jobs', entityId);
    // Notify the popup navigation context about the assignment change
    onAssignmentChange?.();
  };

  // Get popup configuration based on entity type
  const getPopupConfig = () => {
    switch (entityType) {
      case 'lead':
        return {
          title: entityData?.name || "Lead",
          subtitle: entityData?.company_role || "Unknown Role",
          icon: <User className="h-6 w-6 text-gray-600" />,
          statusBadge: <StatusBadge status={entityData?.stage || "new"} size="sm" />,
          statusLabel: "Status",
          scoringDisplay: {
            type: "lead_score" as const,
            value: entityData?.lead_score || "Medium",
            label: "AI Score"
          }
        };
      case 'company':
        return {
          title: entityData?.name || "Company",
          subtitle: entityData?.head_office || "Location not specified",
          icon: <Building2 className="h-6 w-6 text-gray-600" />,
          statusBadge: <StatusBadge status={entityData?.automation_active ? "Automated" : "Pending"} size="sm" />,
          statusLabel: "Automation",
          scoringDisplay: {
            type: "lead_score" as const,
            value: entityData?.lead_score || "Medium",
            label: "AI Score"
          }
        };
      case 'job':
        return {
          title: entityData?.title || "Job",
          subtitle: `${entityData?.location || "Unknown Location"} • ${companyData?.name || "Unknown Company"}`,
          icon: <Briefcase className="h-6 w-6 text-gray-600" />,
          statusBadge: null,
          statusLabel: "",
          scoringDisplay: null
        };
      default:
        return {
          title: "Unknown",
          subtitle: "",
          icon: null,
          statusBadge: null,
          statusLabel: "",
          scoringDisplay: null
        };
    }
  };

  const config = getPopupConfig();

  // Get company logo for jobs, companies, and leads
  const getCompanyLogo = () => {
    if (entityType === 'job' && companyData?.website) {
      const cleanWebsite = companyData.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      return `https://logo.clearbit.com/${cleanWebsite}`;
    }
    if (entityType === 'company' && entityData?.website) {
      const cleanWebsite = entityData.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      return `https://logo.clearbit.com/${cleanWebsite}`;
    }
    if (entityType === 'lead' && companyData?.website) {
      const cleanWebsite = companyData.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      return `https://logo.clearbit.com/${cleanWebsite}`;
    }
    return null;
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    console.log('🔍 EntityDetailPopup: Showing loading state');
    return (
      <PopupModal
        isOpen={isOpen}
        onClose={onClose}
        title="Loading..."
        subtitle="Please wait while we load the data"
        icon={<User className="h-6 w-6 text-gray-600" />}
        isLoading={true}
      >
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sidebar-primary"></div>
        </div>
      </PopupModal>
    );
  }

  // Show error state if there's an error
  if (hasError) {
    console.log('🔍 EntityDetailPopup: Showing error state');
    return (
      <PopupModal
        isOpen={isOpen}
        onClose={onClose}
        title="Error"
        subtitle="Failed to load data"
        icon={<User className="h-6 w-6 text-red-600" />}
        error={new Error('Failed to load entity data')}
        onRetry={() => setRefreshTrigger(prev => prev + 1)}
      >
        <div className="flex items-center justify-center p-8">
          <p className="text-red-600">Failed to load entity data. Please try again.</p>
        </div>
      </PopupModal>
    );
  }

  // Show nothing if no entity data (this should not happen with proper loading states)
  if (!entityData) {
    console.warn('🔍 EntityDetailPopup: No entity data available, but not loading or error state');
    return null;
  }



  return (
    <div onKeyDown={handleKeyDown}>
      <PopupModal
        isOpen={isOpen}
        onClose={onClose}
        title={config.title}
        subtitle={config.subtitle}
        icon={config.icon}
        companyLogo={getCompanyLogo()}
        companyName={companyData?.name}
        entityType={entityType}
        entityId={entityId}
        currentStatus={entityData?.confidence_level || entityData?.stage}
        currentPriority={entityData?.priority}
        currentPipelineStage={entityData?.pipeline_stage}
        onStatusChange={(status) => {
          // TODO: Implement status update
        }}
        onPriorityChange={(priority) => {
          // TODO: Implement priority update
        }}
        onPipelineStageChange={handlePipelineStageChange}
        automationStatus={getAutomationStatus()}
        canChangeStage={(() => {
          const currentStage = entityData?.pipeline_stage;
          const allowedStages = ['new_lead', 'automated', 'replied'];
          return allowedStages.includes(currentStage);
        })()}
        favoriteButton={null}
        ownerId={entityType === 'lead' ? null : entityData?.owner_id} // Don't show assignment in header for leads
        onAssignmentChange={entityType === 'lead' ? undefined : handleAssignmentChange} // Don't handle assignment in header for leads
      actionButton={
        <div className="flex items-center gap-4">
          {/* Favorite Toggle - Same size as other action icons */}
          {(entityType === 'lead' || entityType === 'company') && (
            <button
              onClick={async () => {
                try {
                  const newFavoriteStatus = !isFavorite;
                  const tableName = entityType === "lead" ? "people" : "companies";
                  
                  const { error } = await supabase
                    .from(tableName)
                    .update({ is_favourite: newFavoriteStatus })
                    .eq("id", entityId);

                  if (error) throw error;
                  setIsFavorite(newFavoriteStatus);
                } catch (error) {
                  console.error('Error toggling favorite:', error);
                }
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50"
            >
              <Star 
                className={cn(
                  "h-4 w-4",
                  isFavorite ? "fill-current text-yellow-500" : ""
                )}
              />
            </button>
          )}
          
          {/* Notes Button - Smaller with subtle border */}
          {(entityType === 'lead' || entityType === 'company') && (
            <button 
              onClick={() => setShowAddNoteModal(true)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          )}
          
          {/* Activity Button - Smaller with subtle border */}
          <button 
            onClick={handleActivityClick}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50"
          >
            <Activity className="h-4 w-4" />
          </button>

          {/* User Assignment Display - Only for leads in header */}
          {entityType === 'lead' && (
            <div className="flex-shrink-0">
              <UserAssignmentDisplay
                ownerId={entityData?.owner_id}
                entityId={entityId || ''}
                entityType={entityType}
                onAssignmentChange={handleAssignmentChange}
              />
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4">

        {entityType === 'lead' && (
          <>
            <LeadInfoCard lead={entityData} onAutomate={handleCurrentLeadAutomation} />
            {companyData && (
              <InfoCard title="Company Information" contentSpacing="space-y-6 pt-4" showDivider={true}>
                {/* Replace first section with clickable CompanyCard */}
                <CompanyCard 
                  company={{
                    ...companyData,
                    logo: companyData.logo_url // Map logo_url to logo for CompanyCard
                  }} 
                  onClick={() => handleCompanyClick(companyData.id, companyData.name)}
                />
                
                {/* Section 2: Company Details (from CompanyInfoCard) */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <InfoField label="Industry" value={companyData.industry} />
                    <InfoField label="Company Size" value={companyData.company_size} />
                    <InfoField label="Added Date" value={companyData.created_at ? new Date(companyData.created_at).toLocaleDateString() : "-"} />
                  </div>
                </div>

                {/* Section 3: AI Analysis (from CompanyInfoCard) */}
                {companyData.score_reason && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-semibold text-blue-700 mb-2">AI Analysis</div>
                    <div className="text-sm text-blue-900 leading-relaxed">{companyData.score_reason}</div>
                  </div>
                )}
                
                {/* Company Tags (from CompanyInfoCard) */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tags</div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500">No tags added yet</div>
                    <button
                      onClick={() => {/* TODO: Add tag functionality */}}
                      className="h-6 w-6 p-0 border border-gray-300 hover:bg-gray-100 rounded flex items-center justify-center"
                    >
                      <Plus className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </InfoCard>
            )}
            {leadsData && leadsData.length > 0 && (
              <RelatedItemsList
                title="Other Company Employees"
                items={leadsData}
                isLoading={isLoading}
                selectedLeads={selectedLeads}
                onItemClick={handleLeadClick}
                onToggleSelection={handleToggleSelection}
                showCheckbox={true}
                showAutomateButton={true}
                itemType="lead"
                onAutomationClick={handleAutomationClick}
              />
            )}
            
            {/* Notes Section - At the bottom for leads */}
            <NotesSection
              entityId={entityId}
              entityType={entityType}
              entityName={entityData?.name || entityData?.title}
            />
          </>
        )}

        {entityType === 'company' && (
          <>
            <CompanyInfoCard 
              company={entityData} 
              showTitle={false}
            />
            <RelatedItemsList
              title="Employees"
              items={leadsData || []}
              isLoading={isLoading}
              selectedLeads={selectedLeads}
              onItemClick={handleLeadClick}
              onToggleSelection={handleToggleSelection}
              showCheckbox={true}
              showAutomateButton={true}
              itemType="lead"
              onAutomationClick={handleAutomationClick}
            />
            <RelatedItemsList
              title="Active Jobs"
              items={jobsData || []}
              isLoading={isLoading}
              selectedLeads={selectedLeads}
              onItemClick={handleJobClick}
              itemType="job"
            />
            
            {/* Notes Section - At the bottom for companies */}
            <NotesSection
              entityId={entityId}
              entityType={entityType}
              entityName={entityData?.name || entityData?.title}
            />
          </>
        )}

        {entityType === 'job' && (
          <>
            <JobInfoCard job={entityData} />
            {companyData && (
              <InfoCard title="Company Information" contentSpacing="space-y-6 pt-4" showDivider={true}>
                {/* Replace first section with clickable CompanyCard */}
                <CompanyCard 
                  company={{
                    ...companyData,
                    logo: companyData.logo_url // Map logo_url to logo for CompanyCard
                  }} 
                  onClick={() => handleCompanyClick(companyData.id, companyData.name)}
                />
                
                {/* Section 2: Company Details (from CompanyInfoCard) */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <InfoField label="Industry" value={companyData.industry} />
                    <InfoField label="Company Size" value={companyData.company_size} />
                    <InfoField label="Added Date" value={companyData.created_at ? new Date(companyData.created_at).toLocaleDateString() : "-"} />
                  </div>
                </div>

                {/* Section 3: AI Analysis (from CompanyInfoCard) */}
                {companyData.score_reason && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-semibold text-blue-700 mb-2">AI Analysis</div>
                    <div className="text-sm text-blue-900 leading-relaxed">{companyData.score_reason}</div>
                  </div>
                )}
                
                {/* Company Tags (from CompanyInfoCard) */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tags</div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500">No tags added yet</div>
                    <button
                      onClick={() => {/* TODO: Add tag functionality */}}
                      className="h-6 w-6 p-0 border border-gray-300 hover:bg-gray-100 rounded flex items-center justify-center"
                    >
                      <Plus className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </InfoCard>
            )}
            {leadsData && leadsData.length > 0 && (
              <RelatedItemsList
                title="Employees"
                items={leadsData}
                isLoading={isLoading}
                selectedLeads={selectedLeads}
                onItemClick={handleLeadClick}
                onToggleSelection={handleToggleSelection}
                showCheckbox={true}
                showAutomateButton={true}
                itemType="lead"
                onAutomationClick={handleAutomationClick}
              />
            )}
          </>
        )}
      </div>

      {/* Nested Modals - Removed in favor of unified navigation */}

      {/* Automation Modal */}
      {showAutomationModal && (
        <LinkedInAutomationModal
          selectedLeads={selectedLeads.map(lead => ({
            id: lead.id,
            Name: lead.name,
            Company: companyData?.name || "Unknown Company",
            "Company Role": lead.company_role || "Unknown Role",
            "Email Address": lead.email_address || null,
            "Employee Location": lead.employee_location || "Unknown Location",
            "LinkedIn URL": lead.linkedin_url || null,
            "LinkedIn Request Message": lead.linkedin_request_message || "",
            "LinkedIn Connected Message": lead.linkedin_connected_message || "",
            "LinkedIn Follow Up Message": lead.linkedin_follow_up_message || "",
            Stage: lead.stage || "new",
            stage_enum: lead.stage || "new",
            priority_enum: "medium", // Default value since priority field doesn't exist
            "Lead Score": lead.lead_score?.toString() || "0",
            automation_status_enum: lead.automation_started_at ? "running" : "not_started",
            "Automation Status": lead.automation_started_at ? "Running" : "Not Started",
            created_at: lead.created_at || new Date().toISOString()
          }))}
          isOpen={showAutomationModal}
          onClose={() => setShowAutomationModal(false)}
          jobTitle={entityType === 'lead' ? entityData?.company_role : undefined}
          companyName={companyData?.name}
        />
      )}

      {/* Activity Modal */}
      {showActivityModal && (
        <PopupModal
          isOpen={showActivityModal}
          onClose={() => setShowActivityModal(false)}
          title="Activity"
          isLoading={false}
        >
          <div className="p-4">
            <ActivityTimeline 
              entityId={entityId} 
              entityName={entityData?.name || entityData?.company_name || 'Unknown'}
              entityType={entityType}
            />
          </div>
        </PopupModal>
      )}

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        entityType={entityType}
        entityId={entityId}
        entityName={entityData?.name || 'Unknown'}
        onNoteAdded={() => {
          // Note added successfully - data will refresh automatically
        }}
      />
    </PopupModal>
    </div>
  );
}
