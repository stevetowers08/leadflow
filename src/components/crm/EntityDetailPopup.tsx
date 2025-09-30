import React, { useState } from 'react';
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
import {
  User,
  Building2,
  Briefcase,
  MoreVertical,
  MessageSquare,
  Star,
  Activity,
  Plus
} from "lucide-react";
import { LinkedInAutomationModal } from "./automation/LinkedInAutomationModal";
import { ActivityTimeline } from "./ActivityTimeline";
import { AddNoteModal } from "./AddNoteModal";
import { useEntityData } from "@/hooks/useEntityData";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
  onNavigateToCompany?: (companyId: string, companyName: string) => void;
}

export function EntityDetailPopup({ entityType, entityId, isOpen, onClose, onNavigateToCompany }: EntityDetailPopupProps) {
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

  const { user } = useAuth();

  // Use custom hook for data fetching
  const {
    entityData,
    companyData,
    leadsData,
    jobsData,
    isLoading,
    hasError
  } = useEntityData({ entityType, entityId, isOpen, refreshTrigger });

  // Update favorite state when entityData changes
  React.useEffect(() => {
    if (entityData) {
      setIsFavorite(entityData.is_favourite || false);
    }
  }, [entityData]);

  // Navigation handlers
  const handleCompanyClick = (companyId: string, companyName: string) => {
    if (onNavigateToCompany) {
      // Use parent's navigation handler to replace the current popup
      onNavigateToCompany(companyId, companyName);
    } else {
      // Fallback to nested modal for backward compatibility
      setShowCompanyModal(true);
    }
  };

  const handleLeadClick = (leadId: string) => {
    const lead = leadsData?.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setShowLeadModal(true);
    }
  };

  const handleJobClick = (jobId: string) => {
    const job = jobsData?.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setShowJobModal(true);
    }
  };

  const handleAutomationClick = () => {
    if (selectedLeads.length > 0) {
      setShowAutomationModal(true);
    }
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
      
      console.log('Pipeline stage updated to:', stage);
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

  const handleToggleSelection = (lead: any) => {
    setSelectedLeads(prev => {
      const isSelected = prev.some(selected => selected.id === lead.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== lead.id);
      } else {
        return [...prev, lead];
      }
    });
  };

  const handleAssignmentChange = () => {
    setRefreshTrigger(prev => prev + 1);
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

  // Get company logo for jobs and companies
  const getCompanyLogo = () => {
    if (entityType === 'job' && companyData?.website) {
      const cleanWebsite = companyData.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      return `https://logo.clearbit.com/${cleanWebsite}`;
    }
    if (entityType === 'company' && entityData?.website) {
      const cleanWebsite = entityData.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      return `https://logo.clearbit.com/${cleanWebsite}`;
    }
    return null;
  };

  if (!entityData) return null;


  return (
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
      automationStatus={(() => {
        const status = getAutomationStatus();
        console.log('Automation status being passed to PopupModal:', status);
        return status;
      })()}
      canChangeStage={(() => {
        const currentStage = entityData?.pipeline_stage;
        const allowedStages = ['new_lead', 'automated', 'replied'];
        return allowedStages.includes(currentStage);
      })()}
      favoriteButton={null}
      ownerId={entityType === 'company' ? entityData?.owner_id : undefined}
      onAssignmentChange={handleAssignmentChange}
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
              className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50"
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
              className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          )}
          
           {/* Activity Button - Smaller with subtle border */}
           <button 
             onClick={handleActivityClick}
             className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50"
           >
             <Activity className="h-4 w-4" />
           </button>
        </div>
      }
    >
      <div className="space-y-4">

        {entityType === 'lead' && (
          <>
            <LeadInfoCard lead={entityData} />
            {companyData && (
              <InfoCard contentSpacing="space-y-6 pt-4" showDivider={true}>
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
              onCompanyClick={handleCompanyClick}
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

      {/* Nested Modals */}
      {showCompanyModal && entityData?.company_id && (
        <EntityDetailPopup
          entityType="company"
          entityId={entityData.company_id}
          isOpen={showCompanyModal}
          onClose={() => setShowCompanyModal(false)}
        />
      )}

      {showLeadModal && selectedLead && (
        <EntityDetailPopup
          entityType="lead"
          entityId={selectedLead.id}
          isOpen={showLeadModal}
          onClose={() => {
            setShowLeadModal(false);
            setSelectedLead(null);
          }}
        />
      )}

      {showJobModal && selectedJob && (
        <EntityDetailPopup
          entityType="job"
          entityId={selectedJob.id}
          isOpen={showJobModal}
          onClose={() => {
            setShowJobModal(false);
            setSelectedJob(null);
          }}
        />
      )}

      {/* Automation Modal */}
      {showAutomationModal && (
        <LinkedInAutomationModal
          selectedLeads={[{
            id: selectedLead?.id || "unknown",
            Name: selectedLead?.name || "Unknown Name",
            Company: companyData?.name || "Unknown Company",
            "Company Role": selectedLead?.company_role || "Unknown Role",
            "Email Address": selectedLead?.email_address || null,
            "Employee Location": selectedLead?.employee_location || "Unknown Location",
            "LinkedIn URL": selectedLead?.linkedin_url || null,
            "LinkedIn Request Message": "",
            "LinkedIn Connected Message": "",
            "LinkedIn Follow Up Message": "",
            Stage: selectedLead?.stage || "new",
            stage_enum: selectedLead?.stage || "new",
            priority_enum: "medium",
            "Lead Score": "0",
            automation_status_enum: "not_started",
            "Automation Status": "Not Started",
            created_at: selectedLead?.created_at || new Date().toISOString()
          }]}
          isOpen={showAutomationModal}
          onClose={() => setShowAutomationModal(false)}
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
          // Optionally refresh data or show success message
          console.log('Note added successfully');
        }}
      />
    </PopupModal>
  );
}
