/**
 * Lemlist Integration Card
 *
 * PDR Section: Settings Screen - Integrations
 * Allows users to connect their Lemlist account via API key
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { lemlistService } from '@/services/lemlistService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export function LemlistIntegrationCard() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [lemlistEmail, setLemlistEmail] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [campaignCount, setCampaignCount] = useState(0);
  const [hasCredentials, setHasCredentials] = useState(false); // Track if credentials exist in DB

  const loadLemlistStatus = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      setIsConnected(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get stored API key from user settings
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('metadata')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching user profile:', fetchError);
        setIsConnected(false);
        setIsLoading(false);
        return;
      }

      const metadata = (data?.metadata as Record<string, unknown>) || {};
      const storedKey = metadata.lemlist_api_key as string | undefined;
      const storedEmail = (metadata.lemlist_email as string) || '';

      // Check if credentials exist in database
      if (
        storedKey &&
        typeof storedKey === 'string' &&
        storedKey.trim().length > 0
      ) {
        setHasCredentials(true);
        lemlistService.setApiKey(storedKey);
        lemlistService.setEmail(storedEmail);
        lemlistService.setUserId(user.id);
        setLemlistEmail(storedEmail);
        // Don't pre-fill API key for security (it's a password field)

        // Credentials exist but connection not verified yet
        // User must test connection to verify it works
        setIsConnected(false);
      } else {
        setHasCredentials(false);
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error loading Lemlist status:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadLemlistStatus();
  }, [loadLemlistStatus]);

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter your Lemlist API key');
      return;
    }

    if (!lemlistEmail.trim()) {
      toast.error('Please enter your Lemlist email');
      return;
    }

    if (!user) {
      toast.error('Please sign in to connect Lemlist');
      return;
    }

    try {
      setIsSaving(true);

      // Store API key and email in user profile metadata first
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('metadata')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch user profile: ${fetchError.message}`);
      }

      const currentMetadata =
        (profile?.metadata as Record<string, unknown>) || {};
      const updatedMetadata = {
        ...currentMetadata,
        lemlist_api_key: apiKey,
        lemlist_email: lemlistEmail.trim(),
      };

      const { error: updateError, data: updatedData } = await supabase
        .from('user_profiles')
        .update({ metadata: updatedMetadata })
        .eq('id', user.id)
        .select('metadata')
        .single();

      if (updateError) {
        throw new Error(`Failed to save credentials: ${updateError.message}`);
      }

      // Verify the save worked
      if (
        !updatedData?.metadata ||
        (updatedData.metadata as Record<string, unknown>).lemlist_api_key !==
          apiKey
      ) {
        throw new Error('Failed to verify credentials were saved');
      }

      // Mark credentials as saved
      setHasCredentials(true);

      // Save credentials to service and test connection
      lemlistService.setApiKey(apiKey);
      lemlistService.setEmail(lemlistEmail.trim());
      lemlistService.setUserId(user.id);

      // Test the API key to verify it works
      try {
        const campaigns = await lemlistService.getCampaigns();
        setIsConnected(true);
        setCampaignCount(campaigns.length);
        toast.success('Lemlist connected successfully', {
          description: `Found ${campaigns.length} campaign(s)`,
        });
      } catch (testError) {
        // Credentials saved but connection test failed
        // Don't mark as connected - user can test later
        setIsConnected(false);
        setCampaignCount(0);

        const testErrorMessage =
          testError instanceof Error ? testError.message : String(testError);
        const isNetworkError =
          testErrorMessage === 'Failed to fetch' ||
          testErrorMessage.includes('timeout') ||
          testErrorMessage.includes('network');
        const isConfigError =
          testErrorMessage.includes('400') ||
          testErrorMessage.includes('API key not configured') ||
          testErrorMessage.includes('Bad Request') ||
          testErrorMessage.includes('401') ||
          testErrorMessage.includes('Unauthorized');

        if (isConfigError) {
          toast.error('Invalid API key', {
            description:
              'Credentials saved, but API key is invalid. Please update your credentials.',
          });
        } else if (isNetworkError) {
          toast.warning('Credentials saved', {
            description:
              'Connection test failed. Your credentials are saved. Click "Test Connection" to verify later.',
          });
        } else {
          toast.warning('Credentials saved', {
            description:
              'Connection test failed. Your credentials are saved. Please test the connection.',
          });
        }
      }

      setApiKey('');
      setLemlistEmail('');
    } catch (error) {
      // Handle network errors gracefully (don't log to console for expected failures)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save credentials';
      const isNetworkError =
        errorMessage === 'Failed to fetch' ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('network') ||
        errorMessage.includes('CORS');

      // Only log unexpected errors
      if (!isNetworkError) {
        console.error('Error saving Lemlist credentials:', error);
      }

      // Provide user-friendly error messages
      let userMessage = 'Failed to connect to Lemlist';
      if (errorMessage.includes('timeout')) {
        userMessage =
          'Connection timeout. Please check your internet connection and try again.';
      } else if (
        errorMessage.includes('401') ||
        errorMessage.includes('Unauthorized')
      ) {
        userMessage =
          'Invalid API key. Please check your credentials and try again.';
      } else if (errorMessage.includes('Failed to fetch')) {
        userMessage =
          'Unable to reach Lemlist API. Please check your internet connection.';
      }

      toast.error('Failed to connect Lemlist', {
        description: userMessage,
      });
      setIsConnected(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!user || !hasCredentials) return;

    try {
      setIsTesting(true);

      // Test the connection by fetching campaigns
      const campaigns = await lemlistService.getCampaigns();
      setIsConnected(true);
      setCampaignCount(campaigns.length);
      toast.success('Connection verified', {
        description: `Found ${campaigns.length} campaign(s)`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isConfigError =
        errorMessage.includes('400') ||
        errorMessage.includes('API key not configured') ||
        errorMessage.includes('Bad Request') ||
        errorMessage.includes('401') ||
        errorMessage.includes('Unauthorized');

      setIsConnected(false);
      setCampaignCount(0);

      if (isConfigError) {
        toast.error('Connection failed', {
          description: 'Invalid API key. Please update your credentials.',
        });
      } else {
        toast.error('Connection test failed', {
          description:
            'Unable to verify connection. Please check your internet and try again.',
        });
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('metadata')
        .eq('id', user.id)
        .single();

      const currentMetadata =
        (profile?.metadata as Record<string, unknown>) || {};
      const { lemlist_api_key, lemlist_email, ...restMetadata } =
        currentMetadata;

      const { error } = await supabase
        .from('user_profiles')
        .update({ metadata: restMetadata as Json })
        .eq('id', user.id);

      if (error) throw error;

      lemlistService.setApiKey('');
      setIsConnected(false);
      setHasCredentials(false);
      setApiKey('');
      setLemlistEmail('');
      setCampaignCount(0);
      toast.success('Lemlist disconnected');
    } catch (error) {
      console.error('Error disconnecting Lemlist:', error);
      toast.error('Failed to disconnect Lemlist');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lemlist</CardTitle>
          <CardDescription>Email campaign automation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-4'>
            <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Lemlist</CardTitle>
            <CardDescription>Email campaign automation</CardDescription>
          </div>
          {isConnected ? (
            <CheckCircle2 className='h-5 w-5 text-success' />
          ) : hasCredentials ? (
            <div
              className='h-5 w-5 rounded-full border-2 border-warning'
              title='Credentials saved but not verified'
            />
          ) : (
            <XCircle className='h-5 w-5 text-muted-foreground' />
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {hasCredentials ? (
          <>
            <div className='space-y-2'>
              {isConnected ? (
                <>
                  <p className='text-sm text-muted-foreground'>
                    Status:{' '}
                    <span className='text-success font-medium'>Connected</span>
                  </p>
                  {campaignCount > 0 && (
                    <p className='text-sm text-muted-foreground'>
                      {campaignCount} campaign{campaignCount !== 1 ? 's' : ''}{' '}
                      available
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className='text-sm text-muted-foreground'>
                    Status:{' '}
                    <span className='text-warning font-medium'>
                      Credentials saved
                    </span>
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Connection not verified. Click "Test Connection" to verify
                    your API key.
                  </p>
                </>
              )}
            </div>

            {!isConnected && (
              <Button
                onClick={handleTestConnection}
                disabled={isTesting}
                variant='default'
                className='w-full'
              >
                {isTesting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
            )}

            <Button
              variant='outline'
              onClick={handleDisconnect}
              disabled={isSaving}
              className='w-full'
            >
              {isSaving ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Disconnecting...
                </>
              ) : (
                'Disconnect'
              )}
            </Button>

            {isConnected && (
              <Button
                variant='ghost'
                onClick={() => window.open('https://app.lemlist.com', '_blank')}
                className='w-full'
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                Open Lemlist
              </Button>
            )}
          </>
        ) : (
          <>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='lemlist-email'>Lemlist Email</Label>
                <Input
                  id='lemlist-email'
                  type='email'
                  placeholder='your-email@example.com'
                  value={lemlistEmail}
                  onChange={e => setLemlistEmail(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lemlist-api-key'>API Key</Label>
                <Input
                  id='lemlist-api-key'
                  type='password'
                  placeholder='Enter your Lemlist API key'
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  disabled={isSaving}
                />
                <p className='text-xs text-muted-foreground'>
                  Find your API key in{' '}
                  <a
                    href='https://app.lemlist.com/settings/api'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    Lemlist Settings
                  </a>
                </p>
              </div>
            </div>
            <Button
              onClick={handleConnect}
              disabled={isSaving || !apiKey.trim() || !lemlistEmail.trim()}
              className='w-full'
            >
              {isSaving ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Connecting...
                </>
              ) : (
                'Connect Account'
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
