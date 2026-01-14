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
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { logger } from '@/utils/logger';

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
  onAddToLemlistWorkflow?: (workflowId: string) => Promise<void>;
  onClear?: () => void;
  campaigns?: Array<{ id: string; name: string; type: 'email' | 'lemlist' }>;
  userId?: string;
}

const FloatingActionBarComponent: React.FC<FloatingActionBarProps> = ({
  selectedCount,
  isAllSelected = false,
  onDelete,
  onFavourite,
  onExport,
  onSyncCRM,
  onSendEmail,
  onAddToCampaign,
  onAddToLemlistWorkflow,
  onClear,
  campaigns = [],
  userId,
}) => {
  // Debug logging at component entry
  logger.debug('[FloatingActionBar] Component called with:', {
    selectedCount,
    isAllSelected,
    campaignsCount: campaigns.length,
    hasUserId: !!userId,
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCampaignSelect, setShowCampaignSelect] = useState(false);
  const [showLemlistWorkflowSelect, setShowLemlistWorkflowSelect] =
    useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [lemlistWorkflows, setLemlistWorkflows] = useState<
    Array<{ id: string; name: string; status: string; emailCount: number }>
  >([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);

  const handleAction = useCallback(
    async (action: string, fn: () => Promise<void>) => {
      setLoading(action);
      try {
        await fn();
      } finally {
        setLoading(null);
      }
    },
    []
  );

  const handleDelete = useCallback(async () => {
    setLoading('delete');
    try {
      await onDelete();
    } finally {
      setLoading(null);
    }
    setShowDeleteDialog(false);
  }, [onDelete]);

  const handleCampaignSelect = useCallback(
    async (campaignId: string, campaignType: 'email' | 'lemlist') => {
      setLoading('campaign');
      try {
        await onAddToCampaign(campaignId, campaignType);
      } finally {
        setLoading(null);
      }
      setShowCampaignSelect(false);
    },
    [onAddToCampaign]
  );

  const handleLemlistWorkflowSelect = useCallback(
    async (workflowId: string) => {
      if (!onAddToLemlistWorkflow) return;
      setLoading('lemlist');
      try {
        await onAddToLemlistWorkflow(workflowId);
      } finally {
        setLoading(null);
      }
      setShowLemlistWorkflowSelect(false);
    },
    [onAddToLemlistWorkflow]
  );

  const loadLemlistWorkflows = useCallback(async () => {
    if (!userId) {
      setWorkflowError('User ID not available');
      return;
    }

    setLoadingWorkflows(true);
    setWorkflowError(null);

    try {
      const { getLemlistCampaigns } =
        await import('@/services/lemlistWorkflowService');
      const workflows = await getLemlistCampaigns(userId);
      setLemlistWorkflows(
        workflows.map(w => ({
          id: w.id,
          name: w.name,
          status: w.status,
          emailCount: w.emailCount,
        }))
      );
    } catch (error) {
      logger.error('Error loading lemlist workflows:', error);
      setWorkflowError(
        error instanceof Error
          ? error.message
          : 'Failed to load lemlist workflows. Please ensure Lemlist is connected in Settings.'
      );
    } finally {
      setLoadingWorkflows(false);
    }
  }, [userId]);

  useEffect(() => {
    if (
      showLemlistWorkflowSelect &&
      lemlistWorkflows.length === 0 &&
      !loadingWorkflows &&
      !workflowError &&
      userId
    ) {
      loadLemlistWorkflows();
    }
  }, [
    showLemlistWorkflowSelect,
    lemlistWorkflows.length,
    loadingWorkflows,
    workflowError,
    userId,
    loadLemlistWorkflows,
  ]);

  // Don't show if nothing selected - MUST be after all hooks
  if (selectedCount === 0 && !isAllSelected) {
    return null;
  }

  // Debug logging
  logger.debug('[FloatingActionBar] Rendering with:', {
    selectedCount,
    isAllSelected,
    shouldShow: selectedCount > 0 || isAllSelected,
  });

  const countText = isAllSelected
    ? `All selected`
    : `${selectedCount} selected`;

  return (
    <>
      {/* Floating Action Bar - mobile optimized */}
      <div
        className='fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200 pb-[env(safe-area-inset-bottom)]'
        role='toolbar'
        aria-label='Bulk actions toolbar'
      >
        <div className='rounded-xl shadow-xl border bg-background text-foreground px-3 py-1.5'>
          {/* Horizontal scroll container for mobile */}
          <div className='flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide'>
            {/* Add to list */}
            {campaigns.length > 0 && (
              <Button
                variant='secondary'
                size='default'
                onClick={() => setShowCampaignSelect(true)}
                disabled={loading !== null}
                className='touch-manipulation flex-shrink-0'
              >
                <ListPlus className='h-4 w-4' />
                <span>Add to list</span>
              </Button>
            )}

            {/* Export CSV */}
            <Button
              variant='secondary'
              size='default'
              onClick={() => handleAction('export', onExport)}
              disabled={loading !== null}
              className='touch-manipulation flex-shrink-0'
            >
              <Download className='h-4 w-4' />
              <span>Export</span>
            </Button>

            {/* Delete */}
            <Button
              variant='destructive'
              size='default'
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading !== null}
              className='touch-manipulation flex-shrink-0'
            >
              <Trash2 className='h-4 w-4' />
              <span>Delete</span>
            </Button>

            {/* Clear selection */}
            {onClear && (
              <Button
                variant='ghost'
                size='default'
                onClick={onClear}
                disabled={loading !== null}
                className='touch-manipulation flex-shrink-0'
              >
                <X className='h-4 w-4' />
                <span>Clear</span>
              </Button>
            )}
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
              <SelectContent>
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

      {/* Lemlist Workflow Selection Dialog - mobile optimized */}
      <AlertDialog
        open={showLemlistWorkflowSelect}
        onOpenChange={setShowLemlistWorkflowSelect}
      >
        <AlertDialogContent className='w-[calc(100%-2rem)] max-w-md mx-auto rounded-xl sm:rounded-lg'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-base sm:text-lg'>
              Add to Lemlist Workflow
            </AlertDialogTitle>
            <AlertDialogDescription className='text-sm'>
              Select a lemlist workflow to add {countText}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='py-4'>
            {loadingWorkflows ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
                <span className='ml-2 text-sm text-muted-foreground'>
                  Loading workflows...
                </span>
              </div>
            ) : workflowError ? (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription className='text-sm'>
                  {workflowError}
                </AlertDescription>
              </Alert>
            ) : lemlistWorkflows.length === 0 ? (
              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription className='text-sm'>
                  No lemlist workflows found. Please create a workflow in
                  Lemlist or connect your Lemlist account in Settings.
                </AlertDescription>
              </Alert>
            ) : (
              <Select onValueChange={handleLemlistWorkflowSelect}>
                <SelectTrigger className='h-12 sm:h-10 text-base sm:text-sm touch-manipulation'>
                  <SelectValue placeholder='Select a lemlist workflow' />
                </SelectTrigger>
                <SelectContent>
                  {lemlistWorkflows.map(workflow => (
                    <SelectItem
                      key={workflow.id}
                      value={workflow.id}
                      className='py-3 sm:py-2 text-base sm:text-sm touch-manipulation'
                    >
                      <div className='flex flex-col'>
                        <span>{workflow.name}</span>
                        <span className='text-xs text-muted-foreground'>
                          {workflow.emailCount} email
                          {workflow.emailCount !== 1 ? 's' : ''} •{' '}
                          {workflow.status}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <AlertDialogFooter className='flex-col-reverse sm:flex-row gap-2 sm:gap-0'>
            <AlertDialogCancel
              className='h-12 sm:h-10 text-base sm:text-sm touch-manipulation w-full sm:w-auto'
              onClick={() => {
                setShowLemlistWorkflowSelect(false);
                setWorkflowError(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            {!loadingWorkflows &&
              !workflowError &&
              lemlistWorkflows.length > 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={loadLemlistWorkflows}
                  disabled={loadingWorkflows}
                  className='h-12 sm:h-10 text-base sm:text-sm touch-manipulation w-full sm:w-auto'
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loadingWorkflows ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </Button>
              )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Memoize to prevent unnecessary re-renders when parent component updates
export const FloatingActionBar = memo(FloatingActionBarComponent);
