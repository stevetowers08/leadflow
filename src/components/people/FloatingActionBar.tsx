/**
 * FloatingActionBar Component
 *
 * Modern floating action bar following NN/g best practices (2025):
 * - Appears at bottom when items are selected
 * - Clear count of selected items
 * - 5 primary actions for CRM campaigns
 * - Smooth animations
 * - Keyboard accessible
 * - Responsive design
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ActionSlideTrigger, type ActionItem } from '@/components/ui/ActionSlideTrigger';
import {
  Download,
  ListPlus,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Workflow,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

export interface FloatingActionBarProps {
  selectedCount: number;
  isAllSelected?: boolean;
  onDelete: () => Promise<void>;
  onFavourite: () => Promise<void>;
  onExport: () => Promise<void>;
  onSyncCRM: () => Promise<void>;
  onSendEmail: () => Promise<void>;
  onAddToCampaign: (campaignId: string, campaignType: 'email' | 'lemlist') => Promise<void>;
  onClear: () => void;
  campaigns?: Array<{ id: string; name: string; type: 'email' | 'lemlist' }>;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  selectedCount,
  isAllSelected = false,
  onDelete,
  onFavourite,
  onExport,
  onSyncCRM,
  onSendEmail,
  onAddToCampaign,
  onClear,
  campaigns = [],
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCampaignSelect, setShowCampaignSelect] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  // Don't show if nothing selected
  if (selectedCount === 0 && !isAllSelected) {
    return null;
  }

  const handleAction = async (action: string, fn: () => Promise<void>) => {
    setLoading(action);
    try {
      await fn();
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    await handleAction('delete', onDelete);
    setShowDeleteDialog(false);
  };

  const handleCampaignSelect = async (campaignId: string, campaignType: 'email' | 'lemlist') => {
    await handleAction('campaign', () => onAddToCampaign(campaignId, campaignType));
    setShowCampaignSelect(false);
  };

  const countText = isAllSelected
    ? `All selected`
    : `${selectedCount} selected`;

  return (
    <>
      {/* Floating Action Bar */}
      <div
        className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200'
        role='toolbar'
        aria-label='Bulk actions toolbar'
      >
        <div className='rounded-xl shadow-xl border bg-background text-foreground'>
          <div className='flex items-center gap-3 px-3 py-2'>
            {/* Count pill */}
            <div className='inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium'>
              <span>{isAllSelected ? 'All' : selectedCount}</span>
              <span className='text-muted-foreground'>selected</span>
            </div>

            {/* Add to list */}
            {campaigns.length > 0 && (
              <Button
                variant='secondary'
                size='sm'
                onClick={() => setShowCampaignSelect(true)}
                disabled={loading !== null}
                className='gap-2'
              >
                <ListPlus className='h-4 w-4' />
                Add to list
              </Button>
            )}

            {/* Send email (placeholder – caller can replace later) */}
            <Button
              variant='secondary'
              size='sm'
              onClick={() => handleAction('email', onSendEmail)}
              disabled={loading !== null}
              className='gap-2'
            >
              <Mail className='h-4 w-4' />
              Send email
            </Button>

            {/* Run campaigns */}
            <Button
              variant='secondary'
              size='sm'
              onClick={() => handleAction('sync', onSyncCRM)}
              disabled={loading !== null}
              className='gap-2'
            >
              <Workflow className='h-4 w-4' />
              Run campaigns
            </Button>

            {/* More Actions Slider */}
            <ActionSlideTrigger
              actions={[
                {
                  id: 'export',
                  label: 'Export CSV',
                  icon: Download,
                  onClick: () => handleAction('export', onExport),
                  variant: 'default',
                },
                {
                  id: 'delete',
                  label: 'Delete',
                  icon: Trash2,
                  onClick: () => setShowDeleteDialog(true),
                  variant: 'destructive',
                  divider: true,
                },
                {
                  id: 'clear',
                  label: 'Clear selection',
                  icon: X,
                  onClick: onClear,
                  variant: 'default',
                  divider: true,
                },
              ]}
              title='More Actions'
              variant='secondary'
              size='sm'
            >
              More
              <MoreHorizontal className='h-4 w-4' />
            </ActionSlideTrigger>
          </div>

          {loading && (
            <div className='absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center'>
              <div className='flex items-center gap-2'>
                <RefreshCw className='h-4 w-4 animate-spin' />
                <span className='text-sm font-medium'>Processing...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {countText}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected people and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Campaign Selection Dialog */}
      <AlertDialog
        open={showCampaignSelect}
        onOpenChange={setShowCampaignSelect}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add to Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Select a campaign to enroll {countText}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='py-4'>
            <Select onValueChange={(value) => {
              const selectedCampaign = campaigns.find(c => c.id === value);
              if (selectedCampaign) {
                handleCampaignSelect(selectedCampaign.id, selectedCampaign.type);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder='Select a campaign' />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map(campaign => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
