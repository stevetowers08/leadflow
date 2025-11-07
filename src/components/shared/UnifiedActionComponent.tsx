/**
 * Unified Action Component
 * Provides CRM sync and campaign integration buttons
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UnifiedActionService } from '@/services/unifiedActionService';
import {
    CampaignSequence,
    CrmIntegration,
    CrmProvider,
    CrmSyncResult,
    EntityAction,
} from '@/types/actions';
import {
    Building2,
    ExternalLink,
    Loader2,
    Mail,
    Upload,
    Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface UnifiedActionProps {
  entityType: 'company' | 'person';
  entityIds: string[];
  entityNames?: string[];
  onActionComplete?: () => void;
}

export const UnifiedActionComponent: React.FC<UnifiedActionProps> = ({
  entityType,
  entityIds,
  entityNames = [],
  onActionComplete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    'crm_sync' | 'campaign_add' | null
  >(null);
  const [selectedCrm, setSelectedCrm] = useState<CrmProvider | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignSequence[]>([]);
  const [crmIntegrations, setCrmIntegrations] = useState<CrmIntegration[]>([]);

  const { toast } = useToast();
  const actionService = useMemo(() => new UnifiedActionService(), []);

  const loadData = useCallback(async () => {
    try {
      const [campaignsData, crmData] = await Promise.all([
        actionService.getAvailableCampaigns(),
        actionService.getCrmIntegrations(),
      ]);
      setCampaigns(campaignsData);
      setCrmIntegrations(crmData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [actionService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAction = async () => {
    if (!selectedAction) return;

    setIsLoading(true);

    try {
      let action: EntityAction;

      if (selectedAction === 'crm_sync') {
        action = {
          type: 'crm_sync',
          entityType,
          entityIds,
          targetCrm: selectedCrm!,
          actionData: {
            syncFields: ['name', 'email', 'company', 'phone'],
            createIfNotExists: true,
          },
        };
      } else {
        action = {
          type: 'campaign_add',
          entityType,
          entityIds,
          campaignId: selectedCampaign!,
          actionData: {
            sequenceStep: 1,
          },
        };
      }

      const result = await actionService.executeAction(action);

      if (selectedAction === 'crm_sync') {
        const syncResult = result as CrmSyncResult;
        if (syncResult.success) {
          toast({
            title: 'CRM Sync Successful',
            description: `Synced ${syncResult.syncedCount} ${entityType}s to ${selectedCrm}`,
          });
        } else {
          toast({
            title: 'CRM Sync Failed',
            description: syncResult.errors.join(', '),
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Campaign Added',
          description: `Added ${entityIds.length} ${entityType}s to campaign`,
        });
      }

      setIsOpen(false);
      onActionComplete?.();
    } catch (error) {
      console.error('Action error:', error);
      toast({
        title: 'Action Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEntityIcon = () => {
    return entityType === 'company' ? (
      <Building2 className='h-4 w-4' />
    ) : (
      <Users className='h-4 w-4' />
    );
  };

  const getEntityLabel = () => {
    return entityType === 'company' ? 'Companies' : 'People';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='flex items-center gap-2'>
          {getEntityIcon()}
          Actions ({entityIds.length})
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {getEntityIcon()}
            {getEntityLabel()} Actions
          </DialogTitle>
          <DialogDescription>
            Choose an action for {entityIds.length} selected{' '}
            {getEntityLabel().toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Selected Entities */}
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm'>
                Selected {getEntityLabel()}
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='flex flex-wrap gap-1'>
                {entityNames.slice(0, 5).map((name, index) => (
                  <Badge key={index} variant='secondary' className='text-xs'>
                    {name}
                  </Badge>
                ))}
                {entityNames.length > 5 && (
                  <Badge variant='outline' className='text-xs'>
                    +{entityNames.length - 5} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Selection */}
          <div className='space-y-3'>
            <div className='flex gap-2'>
              <Button
                variant={selectedAction === 'crm_sync' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedAction('crm_sync')}
                className='flex-1'
              >
                <Upload className='h-4 w-4 mr-2' />
                Sync to CRM
              </Button>
              <Button
                variant={
                  selectedAction === 'campaign_add' ? 'default' : 'outline'
                }
                size='sm'
                onClick={() => setSelectedAction('campaign_add')}
                className='flex-1'
              >
                <Mail className='h-4 w-4 mr-2' />
                Add to Campaign
              </Button>
            </div>

            {/* CRM Selection */}
            {selectedAction === 'crm_sync' && (
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Select CRM</label>
                <Select
                  value={selectedCrm || ''}
                  onValueChange={value => setSelectedCrm(value as CrmProvider)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Choose CRM provider' />
                  </SelectTrigger>
                  <SelectContent>
                    {crmIntegrations.map(integration => (
                      <SelectItem
                        key={integration.id}
                        value={integration.provider}
                      >
                        <div className='flex items-center gap-2'>
                          <ExternalLink className='h-4 w-4' />
                          {integration.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Campaign Selection */}
            {selectedAction === 'campaign_add' && (
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Select Campaign</label>
                <Select
                  value={selectedCampaign || ''}
                  onValueChange={setSelectedCampaign}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Choose campaign' />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        <div className='flex flex-col items-start gap-1'>
                          <div className='flex items-center gap-2'>
                            <Mail className='h-4 w-4' />
                            <span className='font-medium'>{campaign.name}</span>
                            <Badge
                              variant={
                                campaign.status === 'active'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className='text-xs'
                            >
                              {campaign.status}
                            </Badge>
                          </div>
                          {campaign.description && (
                            <span className='text-xs text-muted-foreground ml-6'>
                              {campaign.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            disabled={
              isLoading ||
              !selectedAction ||
              (selectedAction === 'crm_sync' && !selectedCrm) ||
              (selectedAction === 'campaign_add' && !selectedCampaign)
            }
          >
            {isLoading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
            {selectedAction === 'crm_sync' ? 'Sync to CRM' : 'Add to Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
