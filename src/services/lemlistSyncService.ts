/**
 * Lemlist Sync Service
 *
 * Syncs lead activity data from lemlist campaigns back to our database
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { lemlistService, type LemlistLead } from './lemlistService';
import { loadLemlistCredentials } from './lemlistWorkflowService';

export interface SyncResult {
  leadsProcessed: number;
  activitiesCreated: number;
  errors: Array<{ email: string; error: string }>;
}

/**
 * Sync activity data from a lemlist campaign to our database
 */
export async function syncLemlistCampaign(
  userId: string,
  campaignId: string,
  supabase?: SupabaseClient
): Promise<SyncResult> {
  const result: SyncResult = {
    leadsProcessed: 0,
    activitiesCreated: 0,
    errors: [],
  };

  try {
    // Load lemlist credentials
    const credentials = await loadLemlistCredentials(userId);
    if (!credentials) {
      throw new Error('Lemlist credentials not found');
    }

    // Set credentials in service
    lemlistService.setApiKey(credentials.apiKey);
    lemlistService.setEmail(credentials.email);

    // Fetch all leads from the campaign
    const lemlistLeads = await lemlistService.getCampaignLeads(campaignId);

    if (lemlistLeads.length === 0) {
      return result; // No leads to sync
    }

    // Process each lead
    for (const lemlistLead of lemlistLeads) {
      try {
        const activitiesCount = await syncLemlistLead(
          userId,
          lemlistLead,
          supabase
        );
        result.leadsProcessed++;
        result.activitiesCreated += activitiesCount;
      } catch (error) {
        result.errors.push({
          email: lemlistLead.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  } catch (error) {
    console.error('Error syncing lemlist campaign:', error);
    throw error;
  }
}

/**
 * Sync a single lemlist lead's activity to our database
 * Returns the number of activities created
 */
async function syncLemlistLead(
  userId: string,
  lemlistLead: LemlistLead,
  supabaseClient?: SupabaseClient
): Promise<number> {
  if (!lemlistLead.email) {
    throw new Error('Lead email is required');
  }

  // Import supabase client if not provided
  if (!supabaseClient) {
    const { supabase } = await import('@/integrations/supabase/client');
    supabaseClient = supabase;
  }

  // Find our lead by email
  const { data: ourLead, error: leadError } = await supabaseClient
    .from('leads')
    .select('id, workflow_id')
    .eq('email', lemlistLead.email)
    .eq('user_id', userId)
    .single();

  if (leadError || !ourLead) {
    // Lead not found in our database - skip silently
    return 0;
  }

  let activitiesCreated = 0;

  // Sync email opened activity
  if (lemlistLead.activity?.opened && lemlistLead.activity.openedAt) {
    const existing = await checkActivityExists(
      ourLead.id,
      'email_opened',
      lemlistLead.activity.openedAt,
      supabaseClient
    );
    if (!existing) {
      await createActivityLog(
        {
          lead_id: ourLead.id,
          workflow_id: ourLead.workflow_id,
          activity_type: 'email_opened',
          timestamp: lemlistLead.activity.openedAt,
          metadata: {
            source: 'lemlist',
            campaign_id: lemlistLead.campaignId,
            lemlist_lead_id: lemlistLead.id,
          },
        },
        supabaseClient
      );
      activitiesCreated++;
    }
  }

  // Sync email clicked activity
  if (lemlistLead.activity?.clicked && lemlistLead.activity.clickedAt) {
    const existing = await checkActivityExists(
      ourLead.id,
      'email_clicked',
      lemlistLead.activity.clickedAt,
      supabaseClient
    );
    if (!existing) {
      await createActivityLog(
        {
          lead_id: ourLead.id,
          workflow_id: ourLead.workflow_id,
          activity_type: 'email_clicked',
          timestamp: lemlistLead.activity.clickedAt,
          metadata: {
            source: 'lemlist',
            campaign_id: lemlistLead.campaignId,
            lemlist_lead_id: lemlistLead.id,
          },
        },
        supabaseClient
      );
      activitiesCreated++;
    }
  }

  // Sync email replied activity
  if (lemlistLead.activity?.replied && lemlistLead.activity.repliedAt) {
    const existing = await checkActivityExists(
      ourLead.id,
      'email_replied',
      lemlistLead.activity.repliedAt,
      supabaseClient
    );
    if (!existing) {
      await createActivityLog(
        {
          lead_id: ourLead.id,
          workflow_id: ourLead.workflow_id,
          activity_type: 'email_replied',
          timestamp: lemlistLead.activity.repliedAt,
          metadata: {
            source: 'lemlist',
            campaign_id: lemlistLead.campaignId,
            lemlist_lead_id: lemlistLead.id,
          },
        },
        supabaseClient
      );
      activitiesCreated++;
    }
  }

  // Update lead status if replied
  if (lemlistLead.activity?.replied) {
    await supabaseClient
      .from('leads')
      .update({
        status: 'replied_manual',
        updated_at: new Date().toISOString(),
      })
      .eq('id', ourLead.id)
      .neq('status', 'replied_manual'); // Only update if not already replied
  }

  return activitiesCreated;
}

/**
 * Check if an activity already exists to avoid duplicates
 */
async function checkActivityExists(
  leadId: string,
  activityType: string,
  timestamp: string,
  supabaseClient?: SupabaseClient
): Promise<boolean> {
  // Import supabase client if not provided
  if (!supabaseClient) {
    const { supabase } = await import('@/integrations/supabase/client');
    supabaseClient = supabase;
  }

  const { data, error } = await supabaseClient
    .from('activity_log')
    .select('id')
    .eq('lead_id', leadId)
    .eq('activity_type', activityType)
    .gte(
      'timestamp',
      new Date(new Date(timestamp).getTime() - 60000).toISOString()
    ) // Within 1 minute
    .lte(
      'timestamp',
      new Date(new Date(timestamp).getTime() + 60000).toISOString()
    )
    .limit(1)
    .single();

  return !error && !!data;
}

/**
 * Create an activity log entry
 */
async function createActivityLog(
  activity: {
    lead_id: string;
    workflow_id: string | null;
    activity_type: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  },
  supabaseClient?: SupabaseClient
): Promise<void> {
  // Import supabase client if not provided
  if (!supabaseClient) {
    const { supabase } = await import('@/integrations/supabase/client');
    supabaseClient = supabase;
  }

  const { error } = await supabaseClient.from('activity_log').insert({
    lead_id: activity.lead_id,
    workflow_id: activity.workflow_id,
    activity_type: activity.activity_type,
    timestamp: activity.timestamp,
    metadata: activity.metadata || {},
  });

  if (error) {
    console.error('Error creating activity log:', error);
    throw error;
  }
}

/**
 * Sync a single lead by email from a lemlist campaign
 */
export async function syncLemlistLeadByEmail(
  userId: string,
  campaignId: string,
  email: string,
  supabase?: SupabaseClient
): Promise<{ synced: boolean; activitiesCreated: number }> {
  try {
    // Load lemlist credentials
    const credentials = await loadLemlistCredentials(userId);
    if (!credentials) {
      throw new Error('Lemlist credentials not found');
    }

    // Set credentials in service
    lemlistService.setApiKey(credentials.apiKey);
    lemlistService.setEmail(credentials.email);

    // Fetch lead from lemlist
    const lemlistLead = await lemlistService.getLeadByEmail(campaignId, email);

    if (!lemlistLead) {
      return { synced: false, activitiesCreated: 0 };
    }

    // Sync the lead and get actual count of activities created
    const activitiesCreated = await syncLemlistLead(
      userId,
      lemlistLead,
      supabase
    );

    return { synced: true, activitiesCreated };
  } catch (error) {
    console.error('Error syncing lemlist lead by email:', error);
    throw error;
  }
}
