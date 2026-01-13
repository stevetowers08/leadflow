import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { loadLemlistCredentials } from '@/services/lemlistWorkflowService';
import { lemlistService, LEMLIST_EVENT_TYPES } from '@/services/lemlistService';

/**
 * List user's webhook configurations
 * GET /api/lemlist/webhooks
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: webhooks, error } = await supabase
      .from('lemlist_webhooks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch webhooks',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Create a new webhook configuration
 * POST /api/lemlist/webhooks
 *
 * Body: {
 *   eventTypes: string[],
 *   campaignId?: string,
 *   triggerOnce?: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { eventTypes, campaignId, triggerOnce = false } = body;

    if (!eventTypes || !Array.isArray(eventTypes) || eventTypes.length === 0) {
      return NextResponse.json(
        { error: 'eventTypes array is required' },
        { status: 400 }
      );
    }

    // Load Lemlist credentials
    const credentials = await loadLemlistCredentials(user.id);
    if (!credentials) {
      return NextResponse.json(
        { error: 'Lemlist credentials not configured' },
        { status: 400 }
      );
    }

    lemlistService.setApiKey(credentials.apiKey);
    lemlistService.setEmail(credentials.email);

    // Build webhook URL for this user/campaign
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/lemlist/webhook`;

    // Create webhooks in Lemlist for each event type
    const createdWebhooks = [];
    const errors = [];

    for (const eventType of eventTypes) {
      try {
        const lemlistWebhook = await lemlistService.createWebhook({
          targetUrl: webhookUrl,
          event: eventType,
          campaignId: campaignId,
          isFirst: triggerOnce,
        });

        createdWebhooks.push({
          eventType,
          lemlistWebhookId: lemlistWebhook.hookId,
        });
      } catch (error) {
        errors.push({
          eventType,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    if (createdWebhooks.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create any webhooks', details: errors },
        { status: 500 }
      );
    }

    // Store in our database
    const { data: webhook, error: dbError } = await supabase
      .from('lemlist_webhooks')
      .insert({
        user_id: user.id,
        webhook_url: webhookUrl,
        lemlist_webhook_id: createdWebhooks[0].lemlistWebhookId, // Store first one as reference
        event_types: eventTypes,
        campaign_id: campaignId || null,
        is_active: true,
        trigger_once: triggerOnce,
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({
      webhook,
      created: createdWebhooks,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to create webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
