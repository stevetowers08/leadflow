/**
 * Bulk Leads Service
 *
 * Handles bulk operations for leads and adding them to campaigns (both email and Lemlist)
 */

import { supabase } from '@/integrations/supabase/client';
import { bulkAddToCampaign } from './bulkPeopleService';
import { bulkAddPeopleToLemlistCampaign } from '../bulkLemlistService';
import type { Lead } from '@/types/database';

/**
 * Get lead IDs from leads (leads are already in the leads table)
 */
async function getLeadIdsFromLeads(leads: Lead[]): Promise<{
  leadIds: string[];
  leadToLeadMap: Map<string, string>; // Maps lead ID to lead ID (identity map)
  errors: Array<{ leadId: string; error: string }>;
}> {
  const leadIds: string[] = [];
  const leadToLeadMap = new Map<string, string>();
  const errors: Array<{ leadId: string; error: string }> = [];

  for (const lead of leads) {
    try {
      if (!lead.email) {
        errors.push({
          leadId: lead.id,
          error: 'Lead missing email address',
        });
        continue;
      }

      // Leads are already in the leads table, just use their IDs
      leadIds.push(lead.id);
      leadToLeadMap.set(lead.id, lead.id);
    } catch (error) {
      errors.push({
        leadId: lead.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return { leadIds, leadToLeadMap: leadToLeadMap, errors };
}

/**
 * Bulk add leads to campaign (email or Lemlist)
 */
export async function bulkAddLeadsToCampaign(
  leadIds: string[],
  campaignId: string,
  userId: string
): Promise<{
  success: number;
  failed: number;
  errors: Array<{ leadId: string; error: string }>;
}> {
  const leadIdsCount = leadIds.length;
  const leadIdsArray = [...leadIds]; // Create a copy to avoid closure issues

  try {
    console.log('[bulkAddLeadsToCampaign] Starting', {
      leadIds: leadIdsCount,
      campaignId,
      userId,
    });

    // Fetch leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .in('id', leadIdsArray);

    if (leadsError || !leads) {
      console.error(
        '[bulkAddLeadsToCampaign] Failed to fetch leads',
        leadsError
      );
      return {
        success: 0,
        failed: leadIdsCount,
        errors: [
          {
            leadId: 'all',
            error: leadsError?.message || 'Failed to fetch leads',
          },
        ],
      };
    }

    console.log('[bulkAddLeadsToCampaign] Fetched leads', leads.length);

    // Get lead IDs (leads are already in the leads table)
    // Type assertion needed: database query returns Supabase types, but function expects database.ts Lead type
    const {
      leadIds: processedLeadIds,
      leadToLeadMap,
      errors: conversionErrors,
    } = await getLeadIdsFromLeads(leads as Lead[]);

    console.log('[bulkAddLeadsToCampaign] Processing leads', {
      leadIds: processedLeadIds.length,
      conversionErrors: conversionErrors.length,
    });

    if (processedLeadIds.length === 0) {
      console.error(
        '[bulkAddLeadsToCampaign] No valid leads',
        conversionErrors
      );
      return {
        success: 0,
        failed: leadIdsCount,
        errors: conversionErrors,
      };
    }

    // Check if it's a Lemlist campaign (ID starts with "cam_")
    const isLemlistCampaign = campaignId.startsWith('cam_');
    console.log('[bulkAddLeadsToCampaign] Campaign type', {
      isLemlistCampaign,
      campaignId,
    });

    if (isLemlistCampaign) {
      // Use Lemlist service - convert leads to format needed
      const result = await bulkAddPeopleToLemlistCampaign(
        userId,
        campaignId,
        processedLeadIds
      );

      // Map lead IDs back to lead IDs for error reporting (identity map)
      const mappedErrors = result.errors.map(err => ({
        leadId: err.personId || 'unknown',
        error: err.error,
      }));

      return {
        success: result.success,
        failed: result.failed + conversionErrors.length,
        errors: [...conversionErrors, ...mappedErrors],
      };
    } else {
      // Use regular email campaign service
      console.log('[bulkAddLeadsToCampaign] Adding to email campaign', {
        leadIds: processedLeadIds.length,
        campaignId,
      });
      const result = await bulkAddToCampaign(processedLeadIds, campaignId);
      console.log('[bulkAddLeadsToCampaign] Email campaign result', result);

      return {
        success: result.successCount,
        failed: result.errorCount + conversionErrors.length,
        errors: [
          ...conversionErrors,
          ...result.errors.map(err => ({
            leadId: err.id || 'unknown',
            error: err.error,
          })),
        ],
      };
    }
  } catch (error) {
    console.error('[bulkAddLeadsToCampaign] Error', error);
    return {
      success: 0,
      failed: leadIdsCount,
      errors: [
        {
          leadId: 'all',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
    };
  }
}
