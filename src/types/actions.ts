/**
 * Unified Action System Types
 * Handles CRM sync and campaign integration
 */

export type EntityType = 'company' | 'person';
export type ActionType = 'crm_sync' | 'campaign_add' | 'bulk_action';
export type CrmProvider = 'salesforce' | 'pipedrive' | 'zoho';

export interface EntityAction {
  type: ActionType;
  entityType: EntityType;
  entityIds: string[];
  targetCrm?: CrmProvider;
  campaignId?: string;
  actionData?: Record<string, unknown>;
}

export interface CrmSyncAction extends EntityAction {
  type: 'crm_sync';
  targetCrm: CrmProvider;
  syncFields?: string[];
  createIfNotExists?: boolean;
}

export interface CampaignAddAction extends EntityAction {
  type: 'campaign_add';
  campaignId: string;
  sequenceStep?: number;
}

export interface BulkAction extends EntityAction {
  type: 'bulk_action';
  actions: EntityAction[];
}

export interface CrmIntegration {
  id: string;
  provider: CrmProvider;
  name: string;
  isActive: boolean;
  apiKey?: string;
  webhookUrl?: string;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmFieldMapping {
  localField: string;
  crmField: string;
  isRequired: boolean;
  defaultValue?: unknown;
}

export interface CrmSyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: string[];
  crmIds: Record<string, string>; // localId -> crmId mapping
}

export interface CampaignSequence {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  steps: CampaignStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStep {
  id: string;
  sequenceId: string;
  orderPosition: number;
  stepType: 'email' | 'wait' | 'condition';
  title: string;
  description?: string;
  config: Record<string, unknown>;
  createdAt: string;
}

export interface CampaignParticipant {
  id: string;
  sequenceId: string;
  personId: string;
  currentStepId?: string;
  status: 'active' | 'completed' | 'paused' | 'bounced' | 'unsubscribed';
  startedAt: string;
  completedAt?: string;
}
