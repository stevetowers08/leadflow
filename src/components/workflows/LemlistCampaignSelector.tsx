/**
 * Lemlist Campaign Selector
 * 
 * Component for selecting a lemlist campaign in workflow builder
 */

'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getLemlistCampaigns } from '@/services/lemlistWorkflowService';
import { useAuth } from '@/contexts/AuthContext';
import type { LemlistCampaign } from '@/services/lemlistService';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LemlistCampaignSelectorProps {
  value?: string;
  onValueChange: (campaignId: string) => void;
  disabled?: boolean;
}

export function LemlistCampaignSelector({
  value,
  onValueChange,
  disabled = false,
}: LemlistCampaignSelectorProps) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<LemlistCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = async (showRefreshing = false) => {
    if (!user) {
      setError('Please sign in to load campaigns');
      setLoading(false);
      return;
    }

    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const loadedCampaigns = await getLemlistCampaigns(user.id);
      setCampaigns(loadedCampaigns);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load campaigns';
      setError(errorMessage);
      toast.error('Failed to load Lemlist campaigns', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Lemlist Campaign</Label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading campaigns...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Lemlist Campaign</Label>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.includes('credentials not found') ? (
              <div className="space-y-2">
                <p>Please connect Lemlist in Settings first.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/settings/integrations', '_blank')}
                >
                  Go to Settings
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadCampaigns(true)}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </>
                  )}
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="lemlist-campaign">Lemlist Campaign</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadCampaigns(true)}
          disabled={refreshing || disabled}
          className="h-7"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || campaigns.length === 0}
      >
        <SelectTrigger id="lemlist-campaign">
          <SelectValue placeholder={campaigns.length === 0 ? 'No campaigns available' : 'Select a campaign'} />
        </SelectTrigger>
        <SelectContent>
          {campaigns.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No campaigns found
            </div>
          ) : (
            campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                <div className="flex flex-col">
                  <span>{campaign.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {campaign.emailCount} email{campaign.emailCount !== 1 ? 's' : ''} • {campaign.status}
                  </span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {value && campaigns.find(c => c.id === value) && (
        <div className="mt-2 p-3 bg-muted rounded-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {campaigns.find(c => c.id === value)?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {campaigns.find(c => c.id === value)?.emailCount} email{campaigns.find(c => c.id === value)?.emailCount !== 1 ? 's' : ''} in sequence
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Leads will automatically be added to this campaign
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://app.lemlist.com', '_blank')}
              className="h-7"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

