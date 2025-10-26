/**
 * FloatingActionBar Component
 *
 * Modern floating action bar following NN/g best practices (2025):
 * - Appears at bottom when items are selected
 * - Clear count of selected items
 * - 5 primary actions for CRM workflow
 * - Smooth animations
 * - Keyboard accessible
 * - Responsive design
 */

import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  Heart,
  MessageCircle,
  RefreshCw,
  Trash2,
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
  onAddToCampaign: (campaignId: string) => Promise<void>;
  onClear: () => void;
  campaigns?: Array<{ id: string; name: string }>;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  selectedCount,
  isAllSelected = false,
  onDelete,
  onFavourite,
  onExport,
  onSyncCRM,
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

  const handleCampaignSelect = async (campaignId: string) => {
    await handleAction('campaign', () => onAddToCampaign(campaignId));
    setShowCampaignSelect(false);
  };

  const countText = isAllSelected
    ? `All people selected`
    : `${selectedCount} ${selectedCount === 1 ? 'person' : 'people'} selected`;

  return (
    <>
      {/* Floating Action Bar */}
      <div
        className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200'
        role='toolbar'
        aria-label='Bulk actions toolbar'
      >
        <div className='bg-primary text-primary-foreground rounded-lg shadow-2xl border border-primary/20'>
          <div className='flex items-center gap-4 px-6 py-4'>
            {/* Selection Count */}
            <div className='flex items-center gap-2 text-sm font-medium'>
              <span>{countText}</span>
            </div>

            {/* Divider */}
            <div className='h-6 w-px bg-primary-foreground/20' />

            {/* Actions */}
            <div className='flex items-center gap-2'>
              {/* Favourite */}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('favourite', onFavourite)}
                disabled={loading !== null}
                className='text-primary-foreground hover:bg-primary-foreground/10'
                title='Add to favourites'
              >
                <Heart className='h-4 w-4 mr-2' />
                Favourite
              </Button>

              {/* Export CSV */}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('export', onExport)}
                disabled={loading !== null}
                className='text-primary-foreground hover:bg-primary-foreground/10'
                title='Export to CSV'
              >
                <Download className='h-4 w-4 mr-2' />
                Export
              </Button>

              {/* Sync to CRM */}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('sync', onSyncCRM)}
                disabled={loading !== null}
                className='text-primary-foreground hover:bg-primary-foreground/10'
                title='Sync to CRM via n8n'
              >
                <RefreshCw className='h-4 w-4 mr-2' />
                Sync CRM
              </Button>

              {/* Add to Campaign */}
              {campaigns.length > 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowCampaignSelect(true)}
                  disabled={loading !== null}
                  className='text-primary-foreground hover:bg-primary-foreground/10'
                  title='Add to campaign'
                >
                  <MessageCircle className='h-4 w-4 mr-2' />
                  Campaign
                </Button>
              )}

              {/* Delete */}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowDeleteDialog(true)}
                disabled={loading !== null}
                className='text-primary-foreground hover:bg-destructive hover:text-destructive-foreground'
                title='Delete selected'
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Delete
              </Button>
            </div>

            {/* Divider */}
            <div className='h-6 w-px bg-primary-foreground/20' />

            {/* Clear Selection */}
            <Button
              variant='ghost'
              size='sm'
              onClick={onClear}
              disabled={loading !== null}
              className='text-primary-foreground hover:bg-primary-foreground/10'
              title='Clear selection'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className='absolute inset-0 bg-primary/80 rounded-lg flex items-center justify-center'>
              <div className='flex items-center gap-2 text-primary-foreground'>
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
            <Select onValueChange={handleCampaignSelect}>
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
