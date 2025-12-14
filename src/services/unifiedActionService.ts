/**
 * Unified Action Service
 * Handles CRM sync and campaign integration
 */

import { supabase } from '@/integrations/supabase/client';
import {
  CampaignAddAction,
  CampaignSequence,
  CrmProvider,
  CrmSyncAction,
  CrmSyncResult,
  EntityAction,
} from '@/types/actions';
import { Company, Lead } from '@/types/database';

export class UnifiedActionService {
  /**
   * Execute a unified action (CRM sync or campaign add)
   */
  async executeAction(action: EntityAction): Promise<CrmSyncResult | boolean> {
    switch (action.type) {
      case 'crm_sync':
        return this.syncToCrm(action as CrmSyncAction);
      case 'campaign_add':
        return this.addToCampaign(action as CampaignAddAction);
      case 'bulk_action':
        return this.executeBulkAction(action);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Sync entities to external CRM
   */
  async syncToCrm(action: CrmSyncAction): Promise<CrmSyncResult> {
    const { entityType, entityIds, targetCrm } = action;

    try {
      // Get entities from database
      const entities = await this.getEntities(entityType, entityIds);

      // Map to CRM format
      const crmData = this.mapToCrmFormat(entities, targetCrm);

      // Sync to CRM (placeholder - would integrate with actual CRM APIs)
      const result = await this.performCrmSync(crmData, targetCrm);

      // Update local records with CRM IDs
      await this.updateLocalCrmIds(entityType, entityIds, result.crmIds);

      return result;
    } catch (error) {
      console.error('CRM sync error:', error);
      return {
        success: false,
        syncedCount: 0,
        failedCount: entityIds.length,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        crmIds: {},
      };
    }
  }

  /**
   * Add entities to campaign sequence
   */
  async addToCampaign(
    action: CampaignAddAction
  ): Promise<Record<string, unknown>> {
    const { entityIds, campaignId } = action;

    try {
      // Validate campaign exists
      const campaign = await this.getCampaign(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Add participants to campaign
      const participants = entityIds.map(personId => ({
        sequence_id: campaignId,
        person_id: personId,
        status: 'active',
        started_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from('campaign_sequence_leads')
        .insert(participants)
        .select();

      if (error) throw error;

      return {
        success: true,
        addedCount: participants.length,
        campaignId,
        participants: data,
      };
    } catch (error) {
      console.error('Campaign add error:', error);
      throw error;
    }
  }

  /**
   * Execute multiple actions in sequence
   */
  async executeBulkAction(
    action: EntityAction
  ): Promise<Record<string, unknown>> {
    const results = [];

    for (const subAction of action.actionData?.actions || []) {
      try {
        const result = await this.executeAction(subAction);
        results.push({ success: true, result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get entities from database
   */
  private async getEntities(
    entityType: 'company' | 'lead',
    entityIds: string[]
  ): Promise<Array<Record<string, unknown>>> {
    const table = entityType === 'company' ? 'companies' : 'leads';

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .in('id', entityIds);

    if (error) throw error;
    return data || [];
  }

  /**
   * Map local data to CRM format
   */
  private mapToCrmFormat(
    entities: (Company | Person)[],
    crmProvider: CrmProvider
  ): Record<string, unknown>[] {
    return entities.map(entity => {
      switch (crmProvider) {
        case 'salesforce':
          return this.mapToSalesforce(entity);
        case 'pipedrive':
          return this.mapToPipedrive(entity);
        case 'zoho':
          return this.mapToZoho(entity);
        default:
          return entity;
      }
    });
  }

  /**
   * Map to Salesforce format
   */
  private mapToSalesforce(entity: Company | Lead): Record<string, unknown> {
    if ('first_name' in entity || 'email' in entity) {
      // Lead entity
      return {
        FirstName: entity.first_name || '',
        LastName: entity.last_name || '',
        Email: entity.email || '',
        Title: entity.job_title || '',
        Company: entity.company || '',
        Phone: entity.phone || '',
        LeadSource: 'Empowr CRM',
      };
    } else {
      // Company entity
      return {
        Name: entity.name || '',
        Website: entity.website || '',
        Industry: entity.industry || '',
        NumberOfEmployees: entity.company_size || '',
        Description: entity.score_reason || '',
        LeadSource: 'Empowr CRM',
      };
    }
  }

  /**
   * Map to Pipedrive format
   */
  private mapToPipedrive(entity: Company | Lead): Record<string, unknown> {
    if ('first_name' in entity || 'email' in entity) {
      // Lead entity
      const fullName =
        `${entity.first_name || ''} ${entity.last_name || ''}`.trim();
      return {
        name: fullName || '',
        email: entity.email || '',
        phone: entity.phone || '',
        org_name: entity.company || '',
        title: entity.job_title || '',
      };
    } else {
      // Company entity
      return {
        name: entity.name || '',
        address: entity.head_office || '',
        website: entity.website || '',
      };
    }
  }

  /**
   * Map to Zoho format
   */
  private mapToZoho(entity: Company | Lead): Record<string, unknown> {
    if ('first_name' in entity || 'email' in entity) {
      // Lead entity
      return {
        First_Name: entity.first_name || '',
        Last_Name: entity.last_name || '',
        Email: entity.email || '',
        Title: entity.job_title || '',
        Company: entity.company || '',
        Phone: entity.phone || '',
      };
    } else {
      // Company entity
      return {
        Account_Name: entity.name || '',
        Website: entity.website || '',
        Industry: entity.industry || '',
        Description: entity.score_reason || '',
      };
    }
  }

  /**
   * Perform actual CRM sync (placeholder)
   */
  private async performCrmSync(
    crmData: Record<string, unknown>[],
    crmProvider: CrmProvider
  ): Promise<CrmSyncResult> {
    // This would integrate with actual CRM APIs
    // For now, return a mock result
    return {
      success: true,
      syncedCount: crmData.length,
      failedCount: 0,
      errors: [],
      crmIds: crmData.reduce(
        (acc, _, index) => {
          acc[`entity_${index}`] = `crm_${index}`;
          return acc;
        },
        {} as Record<string, string>
      ),
    };
  }

  /**
   * Update local records with CRM IDs
   */
  private async updateLocalCrmIds(
    entityType: 'company' | 'lead',
    entityIds: string[],
    crmIds: Record<string, string>
  ): Promise<void> {
    const table = entityType === 'company' ? 'companies' : 'leads';
    const crmIdField =
      entityType === 'company' ? 'salesforce_id' : 'salesforce_contact_id';

    for (const [localId, crmId] of Object.entries(crmIds)) {
      await supabase
        .from(table)
        .update({ [crmIdField]: crmId })
        .eq('id', localId);
    }
  }

  /**
   * Get campaign by ID
   */
  private async getCampaign(
    campaignId: string
  ): Promise<CampaignSequence | null> {
    const { data, error } = await supabase
      .from('campaign_sequences')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Get available CRM integrations
   */
  async getCrmIntegrations(): Promise<Array<Record<string, unknown>>> {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('platform', 'crm')
      .eq('connected', true);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get available campaigns
   */
  async getAvailableCampaigns(): Promise<CampaignSequence[]> {
    const { data, error } = await supabase
      .from('campaign_sequences')
      .select('*')
      .in('status', ['active', 'draft'])
      .order('status', { ascending: false }) // active first
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
