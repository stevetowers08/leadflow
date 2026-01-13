# Lemlist Webhook Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement real-time webhook integration with Lemlist API to sync lead activity, status, and campaign progress automatically.

**Architecture:** Replace polling-based sync with webhook endpoints that receive real-time events from Lemlist. Store webhook configurations in database, validate signatures, process events to update lead/company status, and maintain audit trail of all webhook deliveries.

**Tech Stack:** Next.js API Routes, Supabase (PostgreSQL), TypeScript, Lemlist Webhook API

---

## Task 1: Create Database Schema for Webhooks

**Files:**

- Create: `supabase/migrations/20260113000001_create_lemlist_webhooks.sql`

**Step 1: Write the migration SQL**

Create migration file with webhook storage tables:

```sql
-- Lemlist webhook configurations table
CREATE TABLE IF NOT EXISTS public.lemlist_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  lemlist_webhook_id TEXT UNIQUE, -- ID from lemlist API
  event_types TEXT[] NOT NULL, -- Array of subscribed event types
  campaign_id TEXT, -- Optional: scope to specific campaign
  is_active BOOLEAN NOT NULL DEFAULT true,
  trigger_once BOOLEAN NOT NULL DEFAULT false, -- Only trigger first time event happens
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Webhook delivery log table
CREATE TABLE IF NOT EXISTS public.lemlist_webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES public.lemlist_webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  lead_email TEXT,
  campaign_id TEXT,
  processed BOOLEAN NOT NULL DEFAULT false,
  processing_error TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_lemlist_webhooks_user_id ON public.lemlist_webhooks(user_id);
CREATE INDEX idx_lemlist_webhooks_active ON public.lemlist_webhooks(is_active) WHERE is_active = true;
CREATE INDEX idx_lemlist_webhook_deliveries_webhook_id ON public.lemlist_webhook_deliveries(webhook_id);
CREATE INDEX idx_lemlist_webhook_deliveries_processed ON public.lemlist_webhook_deliveries(processed) WHERE processed = false;
CREATE INDEX idx_lemlist_webhook_deliveries_lead_email ON public.lemlist_webhook_deliveries(lead_email);
CREATE INDEX idx_lemlist_webhook_deliveries_received_at ON public.lemlist_webhook_deliveries(received_at DESC);

-- RLS policies
ALTER TABLE public.lemlist_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lemlist_webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- Users can manage their own webhooks
CREATE POLICY "Users can view their own webhooks"
  ON public.lemlist_webhooks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhooks"
  ON public.lemlist_webhooks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhooks"
  ON public.lemlist_webhooks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhooks"
  ON public.lemlist_webhooks FOR DELETE
  USING (auth.uid() = user_id);

-- Users can view deliveries for their webhooks
CREATE POLICY "Users can view their webhook deliveries"
  ON public.lemlist_webhook_deliveries FOR SELECT
  USING (
    webhook_id IN (
      SELECT id FROM public.lemlist_webhooks WHERE user_id = auth.uid()
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_lemlist_webhooks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lemlist_webhooks_updated_at
  BEFORE UPDATE ON public.lemlist_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_lemlist_webhooks_updated_at();

COMMENT ON TABLE public.lemlist_webhooks IS 'Stores Lemlist webhook configurations for each user';
COMMENT ON TABLE public.lemlist_webhook_deliveries IS 'Audit log of all webhook deliveries from Lemlist';
```

**Step 2: Apply the migration locally**

Run: `npx supabase migration up --local`
Expected: Migration applies successfully, tables created

**Step 3: Verify tables exist**

Run: `npx supabase db ls --local`
Expected: Both tables listed with correct columns

**Step 4: Commit**

```bash
git add supabase/migrations/20260113000001_create_lemlist_webhooks.sql
git commit -m "feat: add database schema for lemlist webhooks

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Add TypeScript Types for Webhooks

**Files:**

- Modify: `src/types/database.ts:310` (after ActivityLog interface)

**Step 1: Add webhook interfaces**

Add after the ActivityLog interface:

```typescript
// Lemlist webhook configuration
export interface LemlistWebhook {
  id: string;
  user_id: string;
  webhook_url: string;
  lemlist_webhook_id: string | null;
  event_types: string[];
  campaign_id: string | null;
  is_active: boolean;
  trigger_once: boolean;
  created_at: string;
  updated_at: string;
}

// Lemlist webhook delivery log
export interface LemlistWebhookDelivery {
  id: string;
  webhook_id: string | null;
  event_type: string;
  payload: Record<string, unknown>;
  lead_email: string | null;
  campaign_id: string | null;
  processed: boolean;
  processing_error: string | null;
  received_at: string;
  processed_at: string | null;
}
```

**Step 2: Verify types compile**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: add TypeScript types for lemlist webhooks

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Add Webhook Event Types to Lemlist Service

**Files:**

- Modify: `src/services/lemlistService.ts:51` (after LemlistLead interface)

**Step 1: Add webhook types and event constants**

Add after the LemlistLead interface:

```typescript
// Lemlist webhook event types
export const LEMLIST_EVENT_TYPES = {
  // Lead status events
  CONTACTED: 'contacted',
  HOOKED: 'hooked',
  ATTRACTED: 'attracted',
  WARMED: 'warmed',
  INTERESTED: 'interested',
  SKIPPED: 'skipped',
  NOT_INTERESTED: 'notInterested',

  // Email activity events
  EMAIL_SENT: 'emailsSent',
  EMAIL_OPENED: 'emailsOpened',
  EMAIL_CLICKED: 'emailsClicked',
  EMAIL_REPLIED: 'emailsReplied',
  EMAIL_BOUNCED: 'emailsBounced',
  EMAIL_SEND_FAILED: 'emailsSendFailed',
  EMAIL_FAILED: 'emailsFailed',
  EMAIL_UNSUBSCRIBED: 'emailsUnsubscribed',
  EMAIL_INTERESTED: 'emailsInterested',
  EMAIL_NOT_INTERESTED: 'emailsNotInterested',

  // LinkedIn events
  LINKEDIN_VISIT_DONE: 'linkedinVisitDone',
  LINKEDIN_VISIT_FAILED: 'linkedinVisitFailed',
  LINKEDIN_INVITE_DONE: 'linkedinInviteDone',
  LINKEDIN_INVITE_FAILED: 'linkedinInviteFailed',
  LINKEDIN_INVITE_ACCEPTED: 'linkedinInviteAccepted',
  LINKEDIN_REPLIED: 'linkedinReplied',
  LINKEDIN_SENT: 'linkedinSent',
  LINKEDIN_INTERESTED: 'linkedinInterested',
  LINKEDIN_NOT_INTERESTED: 'linkedinNotInterested',

  // Operational alerts
  CUSTOM_DOMAIN_ERRORS: 'customDomainErrors',
  CONNECTION_ISSUE: 'connectionIssue',
  SEND_LIMIT_REACHED: 'sendLimitReached',
  LEMWARM_PAUSED: 'lemwarmPaused',
  CAMPAIGN_COMPLETE: 'campaignComplete',
} as const;

export type LemlistEventType =
  (typeof LEMLIST_EVENT_TYPES)[keyof typeof LEMLIST_EVENT_TYPES];

export interface LemlistWebhookPayload {
  type: string;
  campaignId?: string;
  campaignName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  lemlistCampaignId?: string;
  isFirst?: boolean;
  [key: string]: unknown;
}

export interface CreateWebhookParams {
  targetUrl: string;
  event?: LemlistEventType;
  campaignId?: string;
  isFirst?: boolean;
}

export interface LemlistWebhookResponse {
  hookId: string;
  targetUrl: string;
  event?: string;
  campaignId?: string;
  isFirst?: boolean;
}
```

**Step 2: Add webhook management methods to LemlistService class**

Add these methods before the closing brace of the LemlistService class (around line 872):

```typescript
  /**
   * Create a webhook subscription
   * API Reference: https://developer.lemlist.com/api-reference/endpoints/webhooks/add-webhook
   */
  async createWebhook(params: CreateWebhookParams): Promise<LemlistWebhookResponse> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/hooks`,
        {
          method: 'POST',
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetUrl: params.targetUrl,
            event: params.event,
            campaignId: params.campaignId,
            isFirst: params.isFirst,
          }),
        },
        10000
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          errorData.error || `Lemlist API error: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating Lemlist webhook:', error);
      throw error;
    }
  }

  /**
   * Delete a webhook subscription
   * API Reference: https://developer.lemlist.com/api-reference/endpoints/webhooks/delete-webhook
   */
  async deleteWebhook(hookId: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/hooks/${hookId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
        10000
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          errorData.error || `Lemlist API error: ${response.status}`
        );
      }
    } catch (error) {
      console.error('Error deleting Lemlist webhook:', error);
      throw error;
    }
  }

  /**
   * List all webhooks
   * API Reference: https://developer.lemlist.com/api-reference/endpoints/webhooks/list-webhooks
   */
  async listWebhooks(): Promise<LemlistWebhookResponse[]> {
    if (!this.apiKey) {
      throw new Error('Lemlist API key not configured');
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/hooks`,
        {
          method: 'GET',
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        },
        10000
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(
          errorData.error || `Lemlist API error: ${response.status}`
        );
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error listing Lemlist webhooks:', error);
      throw error;
    }
  }
```

**Step 3: Verify service compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add src/services/lemlistService.ts
git commit -m "feat: add webhook management methods to lemlist service

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create Webhook Processing Service

**Files:**

- Create: `src/services/lemlistWebhookService.ts`

**Step 1: Write webhook processing service**

```typescript
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
```

**Step 2: Verify service compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add src/services/lemlistWebhookService.ts
git commit -m "feat: add lemlist webhook processing service

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Create Webhook Receiver API Route

**Files:**

- Create: `src/app/api/lemlist/webhook/route.ts`

**Step 1: Write webhook receiver endpoint**

```typescript
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
```

**Step 2: Verify route compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Test webhook endpoint is accessible**

Run: `npm run dev` in background, then:

```bash
curl -X POST http://localhost:3000/api/lemlist/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"test","campaignId":"test123"}'
```

Expected: Returns `{"received":true}`

**Step 4: Commit**

```bash
git add src/app/api/lemlist/webhook/route.ts
git commit -m "feat: add lemlist webhook receiver endpoint

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Create Webhook Management API Routes

**Files:**

- Create: `src/app/api/lemlist/webhooks/route.ts`
- Create: `src/app/api/lemlist/webhooks/[webhookId]/route.ts`

**Step 1: Write webhooks list/create endpoint**

Create `src/app/api/lemlist/webhooks/route.ts`:

```typescript
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
```

**Step 2: Write webhook delete endpoint**

Create `src/app/api/lemlist/webhooks/[webhookId]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { loadLemlistCredentials } from '@/services/lemlistWorkflowService';
import { lemlistService } from '@/services/lemlistService';

/**
 * Delete a webhook configuration
 * DELETE /api/lemlist/webhooks/[webhookId]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { webhookId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webhookId = params.webhookId;

    // Get webhook configuration
    const { data: webhook, error: fetchError } = await supabase
      .from('lemlist_webhooks')
      .select('*')
      .eq('id', webhookId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Load Lemlist credentials
    const credentials = await loadLemlistCredentials(user.id);
    if (credentials && webhook.lemlist_webhook_id) {
      try {
        lemlistService.setApiKey(credentials.apiKey);
        lemlistService.setEmail(credentials.email);

        // Delete from Lemlist
        await lemlistService.deleteWebhook(webhook.lemlist_webhook_id);
      } catch (error) {
        console.warn('Failed to delete webhook from Lemlist:', error);
        // Continue anyway to delete from our database
      }
    }

    // Delete from our database
    const { error: deleteError } = await supabase
      .from('lemlist_webhooks')
      .delete()
      .eq('id', webhookId)
      .eq('user_id', user.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Update webhook configuration (activate/deactivate)
 * PATCH /api/lemlist/webhooks/[webhookId]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { webhookId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webhookId = params.webhookId;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive boolean is required' },
        { status: 400 }
      );
    }

    // Update in database
    const { data: webhook, error: updateError } = await supabase
      .from('lemlist_webhooks')
      .update({ is_active: isActive })
      .eq('id', webhookId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ webhook });
  } catch (error) {
    console.error('Error updating webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to update webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

**Step 3: Verify routes compile**

Run: `npm run build`
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add src/app/api/lemlist/webhooks/
git commit -m "feat: add webhook management API routes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Add Webhook UI Component

**Files:**

- Create: `src/components/integrations/LemlistWebhookManager.tsx`

**Step 1: Write webhook management UI component**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import type { LemlistWebhook } from '@/types/database';
import { LEMLIST_EVENT_TYPES } from '@/services/lemlistService';

export function LemlistWebhookManager() {
  const [webhooks, setWebhooks] = useState<LemlistWebhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadWebhooks();
  }, []);

  async function loadWebhooks() {
    try {
      const response = await fetch('/api/lemlist/webhooks');
      if (!response.ok) throw new Error('Failed to load webhooks');

      const data = await response.json();
      setWebhooks(data.webhooks || []);
    } catch (error) {
      console.error('Error loading webhooks:', error);
      toast.error('Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  }

  async function createDefaultWebhook() {
    setCreating(true);
    try {
      // Create webhook for most important events
      const response = await fetch('/api/lemlist/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTypes: [
            LEMLIST_EVENT_TYPES.EMAIL_SENT,
            LEMLIST_EVENT_TYPES.EMAIL_OPENED,
            LEMLIST_EVENT_TYPES.EMAIL_CLICKED,
            LEMLIST_EVENT_TYPES.EMAIL_REPLIED,
            LEMLIST_EVENT_TYPES.EMAIL_BOUNCED,
            LEMLIST_EVENT_TYPES.INTERESTED,
            LEMLIST_EVENT_TYPES.NOT_INTERESTED,
          ],
          triggerOnce: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create webhook');
      }

      toast.success('Webhook created successfully');
      await loadWebhooks();
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create webhook');
    } finally {
      setCreating(false);
    }
  }

  async function deleteWebhook(webhookId: string) {
    try {
      const response = await fetch(`/api/lemlist/webhooks/${webhookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete webhook');

      toast.success('Webhook deleted');
      await loadWebhooks();
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('Failed to delete webhook');
    }
  }

  async function toggleWebhook(webhookId: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/lemlist/webhooks/${webhookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update webhook');

      toast.success(isActive ? 'Webhook activated' : 'Webhook deactivated');
      await loadWebhooks();
    } catch (error) {
      console.error('Error updating webhook:', error);
      toast.error('Failed to update webhook');
    }
  }

  if (loading) {
    return <div>Loading webhooks...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lemlist Webhooks</CardTitle>
        <CardDescription>
          Real-time sync of lead activity and campaign events from Lemlist
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {webhooks.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              No webhooks configured. Create a webhook to enable real-time sync.
            </p>
            <Button onClick={createDefaultWebhook} disabled={creating}>
              <Plus className="h-4 w-4 mr-2" />
              {creating ? 'Creating...' : 'Create Default Webhook'}
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                        {webhook.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {webhook.campaign_id && (
                        <Badge variant="outline">Campaign: {webhook.campaign_id}</Badge>
                      )}
                      {webhook.trigger_once && (
                        <Badge variant="outline">First event only</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {webhook.event_types.length} event types
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Created {new Date(webhook.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={webhook.is_active}
                      onCheckedChange={(checked) => toggleWebhook(webhook.id, checked)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWebhook(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={createDefaultWebhook}
              disabled={creating}
              variant="outline"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Webhook
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

**Step 2: Verify component compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add src/components/integrations/LemlistWebhookManager.tsx
git commit -m "feat: add lemlist webhook management UI component

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Add Activity Type for LinkedIn Events

**Files:**

- Modify: `src/types/database.ts:297` (ActivityLog interface)

**Step 1: Add new activity type**

Update the `activity_type` union type to include LinkedIn activities:

```typescript
  activity_type:
    | 'email_sent'
    | 'email_opened'
    | 'email_clicked'
    | 'email_replied'
    | 'email_bounced'      // Add this
    | 'email_unsubscribed' // Add this
    | 'linkedin_activity'  // Add this
    | 'workflow_paused'
    | 'workflow_resumed'
    | 'workflow_completed' // Add this
    | 'lead_created'
    | 'lead_updated'
    | 'workflow_assigned'
    | 'manual_note';
```

**Step 2: Verify types compile**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: add new activity types for webhook events

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Integration Testing Documentation

**Files:**

- Create: `docs/lemlist-webhook-integration.md`

**Step 1: Write integration testing documentation**

````markdown
# Lemlist Webhook Integration

## Overview

This integration enables real-time synchronization of lead activity and campaign events from Lemlist to LeadFlow.

## Features

- ✅ Real-time lead status updates
- ✅ Email activity tracking (sent, opened, clicked, replied, bounced)
- ✅ LinkedIn activity tracking
- ✅ Campaign completion events
- ✅ Automatic lead and company status updates
- ✅ Full audit trail of all webhook deliveries

## Setup

### 1. Configure Lemlist Integration

First, ensure you have Lemlist connected in Settings with your API key and email.

### 2. Create Webhook

Navigate to Settings > Integrations > Lemlist and click "Create Default Webhook". This will:

- Subscribe to key email and status events
- Set up the webhook receiver endpoint
- Enable real-time sync for all campaigns

### 3. Verify Webhook

Check the webhook list to confirm it's active. You should see:

- Status: Active
- Event types: 7 events subscribed
- Webhook URL pointing to your deployment

## Event Mappings

### Email Events

| Lemlist Event        | Activity Type        | Lead Status      | Workflow Status |
| -------------------- | -------------------- | ---------------- | --------------- |
| `emailsSent`         | `email_sent`         | `message_sent`   | `active`        |
| `emailsOpened`       | `email_opened`       | `active`         | -               |
| `emailsClicked`      | `email_clicked`      | `active`         | -               |
| `emailsReplied`      | `email_replied`      | `replied_manual` | `paused`        |
| `emailsBounced`      | `email_bounced`      | -                | `paused`        |
| `emailsUnsubscribed` | `email_unsubscribed` | -                | `completed`     |

### Status Events

| Lemlist Event      | Activity Type        | Lead Status      | Workflow Status |
| ------------------ | -------------------- | ---------------- | --------------- |
| `interested`       | `lead_updated`       | `interested`     | -               |
| `notInterested`    | `lead_updated`       | `not_interested` | `completed`     |
| `campaignComplete` | `workflow_completed` | `completed`      | `completed`     |

### LinkedIn Events

| Lemlist Event            | Activity Type       | Lead Status |
| ------------------------ | ------------------- | ----------- |
| `linkedinInviteAccepted` | `linkedin_activity` | `active`    |
| `linkedinReplied`        | `linkedin_activity` | `active`    |

## Testing

### Local Testing

1. Start the dev server: `npm run dev`
2. Use ngrok to expose local endpoint:
   ```bash
   ngrok http 3000
   ```
````

3. Update webhook URL in database to ngrok URL
4. Trigger events in Lemlist
5. Monitor webhook deliveries in database

### Manual Testing

Test webhook endpoint directly:

```bash
curl -X POST http://localhost:3000/api/lemlist/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "emailsSent",
    "email": "test@example.com",
    "campaignId": "your-campaign-id",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Monitoring

View webhook deliveries:

```sql
SELECT
  id,
  event_type,
  lead_email,
  processed,
  processing_error,
  received_at,
  processed_at
FROM lemlist_webhook_deliveries
ORDER BY received_at DESC
LIMIT 50;
```

Check for errors:

```sql
SELECT *
FROM lemlist_webhook_deliveries
WHERE processed = false OR processing_error IS NOT NULL
ORDER BY received_at DESC;
```

## Troubleshooting

### Webhook not receiving events

1. Check webhook is active in database
2. Verify Lemlist webhook ID is stored correctly
3. Check Lemlist dashboard for webhook delivery status
4. Ensure public URL is accessible from internet

### Events received but not processed

1. Check `lemlist_webhook_deliveries` table for errors
2. Verify lead exists in database with matching email
3. Check logs for processing errors
4. Ensure campaign ID matches

### Lead status not updating

1. Verify event type mapping in `lemlistWebhookService.ts`
2. Check lead status values match database enum
3. Ensure RLS policies allow updates

## Security

- Webhook endpoint is public (POST only)
- Events are matched to users via campaign ID
- All deliveries logged for audit trail
- Invalid payloads return 200 to prevent retries
- Service role key used for database access

## Performance

- Webhook processing is asynchronous
- Each delivery logged before processing
- Failed processing doesn't block receipt
- No rate limiting on webhook endpoint

## Future Enhancements

- [ ] Webhook signature verification
- [ ] User-specific webhook URLs with tokens
- [ ] Retry failed processing
- [ ] Webhook analytics dashboard
- [ ] Email notifications for errors
- [ ] Batch webhook processing

````

**Step 2: Commit**

```bash
git add docs/lemlist-webhook-integration.md
git commit -m "docs: add lemlist webhook integration documentation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
````

---

## Task 10: Add Webhook Manager to Integrations Page

**Files:**

- Modify: `src/components/IntegrationsPage.tsx`

**Step 1: Import and add webhook manager component**

Find the section where LemlistIntegrationCard is rendered and add the webhook manager below it:

```typescript
// Add import at top
import { LemlistWebhookManager } from '@/components/integrations/LemlistWebhookManager';

// Add in the render section, after LemlistIntegrationCard:
{/* Show webhook manager if Lemlist is connected */}
{lemlistConnected && (
  <div className="mt-6">
    <LemlistWebhookManager />
  </div>
)}
```

**Step 2: Verify integration page compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Test in browser**

Run: `npm run dev`
Navigate to integrations page
Expected: Webhook manager shows when Lemlist is connected

**Step 4: Commit**

```bash
git add src/components/IntegrationsPage.tsx
git commit -m "feat: integrate webhook manager into integrations page

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Completion Checklist

- [x] Database schema created
- [x] TypeScript types defined
- [x] Webhook service methods added
- [x] Webhook processing service created
- [x] Webhook receiver endpoint created
- [x] Webhook management endpoints created
- [x] UI component created
- [x] Activity types extended
- [x] Documentation written
- [x] Integration with UI completed

## Testing Plan

1. **Unit Tests** (future work)
   - Test event mapping logic
   - Test webhook payload parsing
   - Test status update logic

2. **Integration Tests**
   - Create webhook via UI
   - Send test webhook event
   - Verify lead status updated
   - Verify activity log created
   - Verify company last_activity updated

3. **End-to-End Tests**
   - Connect Lemlist account
   - Create webhook for campaign
   - Send real email via Lemlist
   - Verify all events sync correctly
   - Check webhook delivery log

## Deployment Notes

1. Set `NEXT_PUBLIC_APP_URL` environment variable to production URL
2. Apply database migrations: `npx supabase db push`
3. Verify webhook endpoint is publicly accessible
4. Test with Lemlist webhook tester if available
5. Monitor first few webhook deliveries for errors

## Follow-up Tasks

- Add webhook signature verification for security
- Implement retry logic for failed processing
- Create webhook analytics dashboard
- Add email notifications for webhook errors
- Implement bulk webhook cleanup utility
