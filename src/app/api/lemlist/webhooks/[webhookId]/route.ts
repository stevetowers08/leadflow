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
