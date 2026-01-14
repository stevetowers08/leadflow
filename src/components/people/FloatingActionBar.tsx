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
import {
  Download,
  ListPlus,
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
  onAddToCampaign: (
    campaignId: string,
    campaignType: 'email' | 'lemlist'
  ) => Promise<void>;
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

  const handleCampaignSelect = async (
    campaignId: string,
    campaignType: 'email' | 'lemlist'
  ) => {
    await handleAction('campaign', () =>
      onAddToCampaign(campaignId, campaignType)
    );
    setShowCampaignSelect(false);
  };

  const countText = isAllSelected
    ? `All selected`
    : `${selectedCount} selected`;

  return (
    <>
      {/* Floating Action Bar - mobile optimized */}
      <div
        className='fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200 w-[calc(100%-2rem)] sm:w-auto pb-[env(safe-area-inset-bottom)]'
        role='toolbar'
        aria-label='Bulk actions toolbar'
      >
        <div className='rounded-xl shadow-xl border bg-background text-foreground w-full sm:min-w-[600px] sm:max-w-[90vw]'>
          {/* Horizontal scroll container for mobile */}
          <div className='flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 overflow-x-auto scrollbar-hide'>
            {/* Add to list */}
            {campaigns.length > 0 && (
              <Button
                variant='secondary'
                size='sm'
                onClick={() => setShowCampaignSelect(true)}
                disabled={loading !== null}
                className='h-10 sm:h-8 px-3 sm:px-4 touch-manipulation flex-shrink-0 gap-1.5 sm:gap-2'
              >
                <ListPlus className='h-4 w-4' />
                <span className='hidden xs:inline'>Add to list</span>
              </Button>
            )}

            {/* Run campaigns */}
            <Button
              variant='secondary'
              size='sm'
              onClick={() => handleAction('sync', onSyncCRM)}
              disabled={loading !== null}
              className='h-10 sm:h-8 px-3 sm:px-4 touch-manipulation flex-shrink-0 gap-1.5 sm:gap-2'
            >
              <Workflow className='h-4 w-4' />
              <span className='hidden xs:inline'>Run</span>
            </Button>

            {/* Export CSV */}
            <Button
              variant='secondary'
              size='sm'
              onClick={() => handleAction('export', onExport)}
              disabled={loading !== null}
              className='h-10 sm:h-8 px-3 sm:px-4 touch-manipulation flex-shrink-0 gap-1.5 sm:gap-2'
            >
              <Download className='h-4 w-4' />
              <span className='hidden xs:inline'>Export</span>
            </Button>

            {/* Delete */}
            <Button
              variant='destructive'
              size='sm'
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading !== null}
              className='h-10 sm:h-8 px-3 sm:px-4 touch-manipulation flex-shrink-0 gap-1.5 sm:gap-2'
            >
              <Trash2 className='h-4 w-4' />
              <span className='hidden xs:inline'>Delete</span>
            </Button>

            {/* Clear selection */}
            <Button
              variant='ghost'
              size='sm'
              onClick={onClear}
              disabled={loading !== null}
              className='h-10 sm:h-8 text-sm gap-1.5 sm:gap-2 touch-manipulation flex-shrink-0'
            >
              <X className='h-4 w-4' />
              <span className='hidden xs:inline'>Clear</span>
            </Button>
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

      {/* Delete Confirmation Dialog - mobile optimized */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='w-[calc(100%-2rem)] max-w-md mx-auto rounded-xl sm:rounded-lg'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-base sm:text-lg'>
              Delete {countText}?
            </AlertDialogTitle>
            <AlertDialogDescription className='text-sm'>
              This action cannot be undone. This will permanently delete the
              selected people and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-col-reverse sm:flex-row gap-2 sm:gap-0'>
            <AlertDialogCancel className='h-12 sm:h-10 text-base sm:text-sm touch-manipulation w-full sm:w-auto'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='h-12 sm:h-10 text-base sm:text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 touch-manipulation w-full sm:w-auto'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Campaign Selection Dialog - mobile optimized */}
      <AlertDialog
        open={showCampaignSelect}
        onOpenChange={setShowCampaignSelect}
      >
        <AlertDialogContent className='w-[calc(100%-2rem)] max-w-md mx-auto rounded-xl sm:rounded-lg'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-base sm:text-lg'>
              Add to Campaign
            </AlertDialogTitle>
            <AlertDialogDescription className='text-sm'>
              Select a campaign to enroll {countText}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='py-4'>
            <Select
              onValueChange={value => {
                const selectedCampaign = campaigns.find(c => c.id === value);
                if (selectedCampaign) {
                  handleCampaignSelect(
                    selectedCampaign.id,
                    selectedCampaign.type
                  );
                }
              }}
            >
              <SelectTrigger className='h-12 sm:h-10 text-base sm:text-sm touch-manipulation'>
                <SelectValue placeholder='Select a campaign' />
              </SelectTrigger>
              <SelectContent className='max-h-[50vh]'>
                {campaigns.map(campaign => (
                  <SelectItem
                    key={campaign.id}
                    value={campaign.id}
                    className='py-3 sm:py-2 text-base sm:text-sm touch-manipulation'
                  >
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter className='flex-col-reverse sm:flex-row gap-2 sm:gap-0'>
            <AlertDialogCancel className='h-12 sm:h-10 text-base sm:text-sm touch-manipulation w-full sm:w-auto'>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
