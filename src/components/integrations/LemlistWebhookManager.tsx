'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
      toast.error(
        error instanceof Error ? error.message : 'Failed to create webhook'
      );
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
      <CardContent className='space-y-4'>
        {webhooks.length === 0 ? (
          <div className='text-center py-6'>
            <AlertCircle className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
            <p className='text-sm text-muted-foreground mb-4'>
              No webhooks configured. Create a webhook to enable real-time sync.
            </p>
            <Button onClick={createDefaultWebhook} disabled={creating}>
              <Plus className='h-4 w-4 mr-2' />
              {creating ? 'Creating...' : 'Create Default Webhook'}
            </Button>
          </div>
        ) : (
          <>
            <div className='space-y-3'>
              {webhooks.map(webhook => (
                <div
                  key={webhook.id}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Badge
                        variant={webhook.is_active ? 'default' : 'secondary'}
                      >
                        {webhook.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {webhook.campaign_id && (
                        <Badge variant='outline'>
                          Campaign: {webhook.campaign_id}
                        </Badge>
                      )}
                      {webhook.trigger_once && (
                        <Badge variant='outline'>First event only</Badge>
                      )}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {webhook.event_types.length} event types
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      Created{' '}
                      {new Date(webhook.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Switch
                      checked={webhook.is_active}
                      onCheckedChange={checked =>
                        toggleWebhook(webhook.id, checked)
                      }
                    />
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => deleteWebhook(webhook.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={createDefaultWebhook}
              disabled={creating}
              variant='outline'
              className='w-full'
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Another Webhook
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
