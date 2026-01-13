/**
 * Lemlist Webhook Service
 *
 * Processes incoming webhook events from Lemlist and updates lead/company data
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import {
  LEMLIST_EVENT_TYPES,
  type LemlistWebhookPayload,
} from './lemlistService';
import type { Lead } from '@/types/database';

export interface WebhookProcessingResult {
  success: boolean;
  leadUpdated: boolean;
  activityCreated: boolean;
  error?: string;
}

/**
 * Process a webhook event from Lemlist
 */
export async function processLemlistWebhook(
  userId: string,
  payload: LemlistWebhookPayload,
  supabase: SupabaseClient
): Promise<WebhookProcessingResult> {
  const result: WebhookProcessingResult = {
    success: false,
    leadUpdated: false,
    activityCreated: false,
  };

  try {
    // Find the lead by email
    if (!payload.email) {
      result.error = 'No email in webhook payload';
      return result;
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, workflow_id, status, company_id')
      .eq('email', payload.email)
      .eq('user_id', userId)
      .single();

    if (leadError || !lead) {
      result.error = `Lead not found: ${payload.email}`;
      return result;
    }

    // Process based on event type
    const eventType = payload.type;

    // Map Lemlist event to activity type
    const activityMapping = mapEventToActivity(eventType);

    if (activityMapping) {
      // Create activity log
      const { error: activityError } = await supabase
        .from('activity_log')
        .insert({
          lead_id: lead.id,
          workflow_id: lead.workflow_id,
          activity_type: activityMapping.activityType,
          timestamp: new Date().toISOString(),
          metadata: {
            source: 'lemlist_webhook',
            event_type: eventType,
            campaign_id: payload.campaignId || payload.lemlistCampaignId,
            campaign_name: payload.campaignName,
            is_first: payload.isFirst,
            raw_payload: payload,
          },
        });

      if (!activityError) {
        result.activityCreated = true;
      }

      // Update lead status if needed
      if (activityMapping.leadStatus) {
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            status: activityMapping.leadStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', lead.id);

        if (!updateError) {
          result.leadUpdated = true;
        }
      }

      // Update workflow status if needed
      if (activityMapping.workflowStatus) {
        await supabase
          .from('leads')
          .update({
            workflow_status: activityMapping.workflowStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', lead.id);
      }

      // Update company last_activity if lead has company
      if (lead.company_id) {
        await supabase
          .from('companies')
          .update({
            last_activity: new Date().toISOString(),
          })
          .eq('id', lead.company_id);
      }
    }

    result.success = true;
    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
    return result;
  }
}

/**
 * Map Lemlist event type to our activity type and status updates
 */
function mapEventToActivity(eventType: string): {
  activityType: string;
  leadStatus?: Lead['status'];
  workflowStatus?: 'active' | 'paused' | 'completed';
} | null {
  switch (eventType) {
    // Email events
    case LEMLIST_EVENT_TYPES.EMAIL_SENT:
      return {
        activityType: 'email_sent',
        leadStatus: 'message_sent',
        workflowStatus: 'active',
      };

    case LEMLIST_EVENT_TYPES.EMAIL_OPENED:
      return {
        activityType: 'email_opened',
        leadStatus: 'active',
      };

    case LEMLIST_EVENT_TYPES.EMAIL_CLICKED:
      return {
        activityType: 'email_clicked',
        leadStatus: 'active',
      };

    case LEMLIST_EVENT_TYPES.EMAIL_REPLIED:
      return {
        activityType: 'email_replied',
        leadStatus: 'replied_manual',
        workflowStatus: 'paused',
      };

    case LEMLIST_EVENT_TYPES.EMAIL_BOUNCED:
      return {
        activityType: 'email_bounced',
        workflowStatus: 'paused',
      };

    case LEMLIST_EVENT_TYPES.EMAIL_UNSUBSCRIBED:
      return {
        activityType: 'email_unsubscribed',
        workflowStatus: 'completed',
      };

    // Status events
    case LEMLIST_EVENT_TYPES.INTERESTED:
    case LEMLIST_EVENT_TYPES.EMAIL_INTERESTED:
      return {
        activityType: 'lead_updated',
        leadStatus: 'interested',
      };

    case LEMLIST_EVENT_TYPES.NOT_INTERESTED:
    case LEMLIST_EVENT_TYPES.EMAIL_NOT_INTERESTED:
      return {
        activityType: 'lead_updated',
        leadStatus: 'not_interested',
        workflowStatus: 'completed',
      };

    case LEMLIST_EVENT_TYPES.CAMPAIGN_COMPLETE:
      return {
        activityType: 'workflow_completed',
        leadStatus: 'completed',
        workflowStatus: 'completed',
      };

    // LinkedIn events - map to generic activity
    case LEMLIST_EVENT_TYPES.LINKEDIN_INVITE_ACCEPTED:
    case LEMLIST_EVENT_TYPES.LINKEDIN_REPLIED:
      return {
        activityType: 'linkedin_activity',
        leadStatus: 'active',
      };

    default:
      return null;
  }
}

/**
 * Log webhook delivery to database
 */
export async function logWebhookDelivery(
  webhookId: string,
  eventType: string,
  payload: LemlistWebhookPayload,
  supabase: SupabaseClient
): Promise<string> {
  const { data, error } = await supabase
    .from('lemlist_webhook_deliveries')
    .insert({
      webhook_id: webhookId,
      event_type: eventType,
      payload: payload as Record<string, unknown>,
      lead_email: payload.email,
      campaign_id: payload.campaignId || payload.lemlistCampaignId,
      processed: false,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to log webhook delivery: ${error.message}`);
  }

  return data.id;
}

/**
 * Mark webhook delivery as processed
 */
export async function markWebhookProcessed(
  deliveryId: string,
  success: boolean,
  error: string | undefined,
  supabase: SupabaseClient
): Promise<void> {
  await supabase
    .from('lemlist_webhook_deliveries')
    .update({
      processed: true,
      processing_error: error || null,
      processed_at: new Date().toISOString(),
    })
    .eq('id', deliveryId);
}
