import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  processLemlistWebhook,
  logWebhookDelivery,
  markWebhookProcessed,
} from '@/services/lemlistWebhookService';
import type { LemlistWebhookPayload } from '@/services/lemlistService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Webhook receiver endpoint for Lemlist events
 * POST /api/lemlist/webhook
 *
 * This endpoint:
 * 1. Receives webhook events from Lemlist
 * 2. Logs the delivery to database
 * 3. Processes the event (updates lead/company, creates activity)
 * 4. Returns 200 OK to acknowledge receipt
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook payload
    const payload = (await request.json()) as LemlistWebhookPayload;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find which user this webhook belongs to
    // We'll look up by matching the webhook URL or campaign
    // For now, we'll need to identify the user from the payload's campaign
    // This is a limitation - we may need to add a signature or token to the webhook URL

    // Extract campaign ID from payload
    const campaignId = payload.campaignId || payload.lemlistCampaignId;

    if (!campaignId) {
      console.error('No campaign ID in webhook payload');
      return NextResponse.json(
        { error: 'No campaign ID in payload' },
        { status: 400 }
      );
    }

    // Find webhook configuration by campaign ID
    const { data: webhook, error: webhookError } = await supabase
      .from('lemlist_webhooks')
      .select('id, user_id, is_active')
      .eq('campaign_id', campaignId)
      .eq('is_active', true)
      .single();

    if (webhookError || !webhook) {
      console.error(
        'Webhook configuration not found for campaign:',
        campaignId
      );
      // Still return 200 to avoid Lemlist retries
      return NextResponse.json({ received: true });
    }

    // Log the delivery
    const deliveryId = await logWebhookDelivery(
      webhook.id,
      payload.type,
      payload,
      supabase
    );

    // Process the webhook
    const result = await processLemlistWebhook(
      webhook.user_id,
      payload,
      supabase
    );

    // Mark as processed
    await markWebhookProcessed(
      deliveryId,
      result.success,
      result.error,
      supabase
    );

    // Always return 200 to acknowledge receipt
    return NextResponse.json({
      received: true,
      processed: result.success,
      deliveryId,
    });
  } catch (error) {
    console.error('Error processing Lemlist webhook:', error);
    // Still return 200 to avoid Lemlist retries
    return NextResponse.json({
      received: true,
      processed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET handler for webhook verification (if Lemlist requires it)
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    service: 'lemlist-webhook-receiver',
  });
}
