/**
 * Lemlist Integration Card
 * 
 * PDR Section: Settings Screen - Integrations
 * Allows users to connect their Lemlist account via API key
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { lemlistService } from '@/services/lemlistService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function LemlistIntegrationCard() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [campaignCount, setCampaignCount] = useState(0);

  useEffect(() => {
    loadLemlistStatus();
  }, []);

  const loadLemlistStatus = async () => {
    try {
      setIsLoading(true);
      
      // Get stored API key from user settings
      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('metadata')
          .eq('id', user.id)
          .single();

        if (data?.metadata?.lemlist_api_key) {
          const storedKey = data.metadata.lemlist_api_key;
          lemlistService.setApiKey(storedKey);
          
          // Test connection
          try {
            const campaigns = await lemlistService.getCampaigns();
            setIsConnected(true);
            setCampaignCount(campaigns.length);
          } catch (error) {
            setIsConnected(false);
          }
        }
      }
    } catch (error) {
      console.error('Error loading Lemlist status:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter your Lemlist API key');
      return;
    }

    if (!user) {
      toast.error('Please sign in to connect Lemlist');
      return;
    }

    try {
      setIsSaving(true);

      // Test the API key
      lemlistService.setApiKey(apiKey);
      const campaigns = await lemlistService.getCampaigns();

      // Store API key in user profile metadata
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('metadata')
        .eq('id', user.id)
        .single();

      const currentMetadata = profile?.metadata || {};
      const updatedMetadata = {
        ...currentMetadata,
        lemlist_api_key: apiKey,
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({ metadata: updatedMetadata })
        .eq('id', user.id);

      if (error) throw error;

      setIsConnected(true);
      setCampaignCount(campaigns.length);
      setApiKey('');
      toast.success('Lemlist connected successfully', {
        description: `Found ${campaigns.length} campaign(s)`,
      });
    } catch (error) {
      console.error('Error connecting Lemlist:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please check your API key';
      toast.error('Failed to connect Lemlist', {
        description: errorMessage,
      });
      setIsConnected(false);
    } finally {
      setIsSaving(false);
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

      const currentMetadata = profile?.metadata || {};
      const { lemlist_api_key, ...restMetadata } = currentMetadata;

      const { error } = await supabase
        .from('user_profiles')
        .update({ metadata: restMetadata })
        .eq('id', user.id);

      if (error) throw error;

      lemlistService.setApiKey('');
      setIsConnected(false);
      setApiKey('');
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
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lemlist</CardTitle>
            <CardDescription>Email campaign automation</CardDescription>
          </div>
          {isConnected ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <XCircle className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Status: <span className="text-success font-medium">Connected</span>
              </p>
              {campaignCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {campaignCount} campaign{campaignCount !== 1 ? 's' : ''} available
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect'
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.open('https://app.lemlist.com', '_blank')}
              className="w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Lemlist
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="lemlist-api-key">API Key</Label>
              <Input
                id="lemlist-api-key"
                type="password"
                placeholder="Enter your Lemlist API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                Find your API key in{' '}
                <a
                  href="https://app.lemlist.com/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Lemlist Settings
                </a>
              </p>
            </div>
            <Button
              onClick={handleConnect}
              disabled={isSaving || !apiKey.trim()}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

