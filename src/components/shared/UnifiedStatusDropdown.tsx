/**
 * Unified Status Dropdown - Modern & Efficient
 *
 * Single source of truth for all status dropdowns
 * - Whole cell is clickable
 * - Modern design with status dots
 * - Clean, efficient code
 * - Optimistic updates
 * - Works with People, Companies, and Jobs
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { Check, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

export interface UnifiedStatusDropdownProps {
  entityId: string;
  entityType: 'people' | 'companies' | 'jobs';
  currentStatus: string;
  availableStatuses: string[];
  onStatusChange?: () => void;
  disabled?: boolean;
  variant?: 'button' | 'cell';
}

const UnifiedStatusDropdownComponent: React.FC<UnifiedStatusDropdownProps> = ({
  entityId,
  entityType,
  currentStatus,
  availableStatuses,
  onStatusChange,
  disabled = false,
  variant = 'button',
}) => {
  const { user } = useAuth();
  const { data: clientId } = useClientId(); // Use cached client_id
  const { toast } = useToast();
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync local status with prop changes from parent
  React.useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  // Memoize updateStatus callback to prevent unnecessary re-renders
  const updateStatus = React.useCallback(
    async (newStatus: string) => {
      if (newStatus === localStatus || isUpdating) return;

      const previousStatus = localStatus;
      setLocalStatus(newStatus);
      setIsUpdating(true);

      try {
        // Jobs use client_jobs table
        if (entityType === 'jobs') {
          if (!user?.id) throw new Error('No user found');
          if (!clientId) throw new Error('No client found');

          // Optimized: Use cached client_id instead of fetching
          const { error } = await supabase.from('client_jobs').upsert(
            {
              client_id: clientId,
              job_id: entityId,
              status: newStatus,
              priority_level: 'medium',
              qualified_by: user.id,
              qualified_at:
                newStatus === 'qualify' ? new Date().toISOString() : null,
            },
            { onConflict: 'client_id,job_id' }
          );

          if (error) throw error;

          // Send webhook asynchronously (fire and forget)
          // Best practice: Don't block UI on webhook delivery
          if (newStatus === 'qualify') {
            // Fire and forget - don't await
            (async () => {
              try {
                // Get the job to fetch company_id
                const { data: jobData } = await supabase
                  .from('jobs')
                  .select('company_id')
                  .eq('id', entityId)
                  .maybeSingle();

                if (jobData?.company_id) {
                  const webhookPayload = {
                    job_id: entityId,
                    company_id: jobData.company_id,
                    client_id: clientId,
                    user_id: user.id,
                  };

                  console.log(
                    '[Webhook] Invoking webhook with payload:',
                    webhookPayload
                  );

                  const { error: webhookError, data: webhookData } =
                    await supabase.functions.invoke(
                      'job-qualification-webhook',
                      {
                        body: webhookPayload,
                      }
                    );

                  if (webhookError) {
                    console.error(
                      '[Webhook] Failed to send job qualification webhook:',
                      webhookError
                    );
                  } else {
                    console.log(
                      `[Webhook] Successfully triggered job qualification webhook for job ${entityId}`
                    );
                    console.log('[Webhook] Response:', webhookData);
                  }
                }
              } catch (webhookErr) {
                console.error(
                  '[Webhook] Error in webhook delivery:',
                  webhookErr
                );
                // Non-blocking: Webhook failure doesn't affect job qualification
              }
            })();
          }
        } else {
          // People and Companies update directly
          const statusField =
            entityType === 'people' ? 'people_stage' : 'pipeline_stage';

          const { error } = await supabase
            .from(entityType)
            .update({
              [statusField]: newStatus,
              updated_at: new Date().toISOString(),
            })
            .eq('id', entityId);

          if (error) throw error;
        }

        onStatusChange?.();

        toast({
          title: 'Status updated',
          description: `Changed to ${getStatusDisplayText(newStatus)}`,
        });
      } catch (error) {
        setLocalStatus(previousStatus);
        console.error('Status update failed:', error);

        toast({
          title: 'Update failed',
          description: 'Please try again',
          variant: 'destructive',
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [
      localStatus,
      isUpdating,
      entityId,
      entityType,
      user,
      clientId,
      toast,
      onStatusChange,
    ]
  );

  // Memoize utility function calls to prevent recalculation on every render
  const statusClasses = React.useMemo(
    () => getUnifiedStatusClass(localStatus),
    [localStatus]
  );
  const displayText = React.useMemo(
    () => getStatusDisplayText(localStatus),
    [localStatus]
  );

  // Extract the background color class for the status indicator
  const statusIndicatorClass = React.useMemo(
    () => statusClasses.split(' ')[0] || 'bg-gray-100',
    [statusClasses]
  );

  // Choose variant styling
  const isCellVariant = variant === 'cell';

  // For cell variant, the entire cell should be the trigger with background color
  // Use w-full h-full to fill the cell naturally
  const triggerStyles = isCellVariant
    ? cn(
        'w-full h-full flex items-center justify-center gap-1.5',
        'transition-opacity duration-150',
        disabled || isUpdating
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:opacity-90 cursor-pointer'
      )
    : cn(
        'flex items-center gap-2 px-3 text-sm',
        'bg-white border border-gray-200 rounded-md',
        'hover:border-gray-300 hover:bg-gray-50',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'transition-colors',
        'h-8',
        'min-w-[140px]',
        disabled || isUpdating
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer'
      );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled || isUpdating}
        className={triggerStyles}
      >
        {isCellVariant ? (
          <>
            <span className='text-xs font-medium'>{displayText}</span>
            {!disabled && !isUpdating && (
              <ChevronDown className='h-3 w-3 flex-shrink-0' />
            )}
          </>
        ) : (
          <>
            <div className='flex items-center gap-2 flex-1'>
              <div
                className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  statusIndicatorClass
                )}
              />
              <span className='text-gray-700 font-medium text-sm'>
                {displayText}
              </span>
            </div>
            {!disabled && !isUpdating && (
              <ChevronDown className='h-4 w-4 text-gray-400 flex-shrink-0' />
            )}
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='start'
        side='bottom'
        sideOffset={4}
        className='w-[180px] p-1'
        onClick={e => e.stopPropagation()}
      >
        {availableStatuses.map(status => {
          const isSelected = status === localStatus;
          const statusClassString = getUnifiedStatusClass(status);
          const bgClass = statusClassString.split(' ')[0] || 'bg-gray-100';

          return (
            <DropdownMenuItem
              key={status}
              onClick={() => updateStatus(status)}
              disabled={isSelected}
              className={cn(
                'flex items-center justify-between gap-2 cursor-pointer px-2.5 py-1.5 rounded-md text-sm',
                'transition-colors text-gray-700',
                isSelected ? 'bg-blue-50 font-medium' : 'hover:bg-gray-50'
              )}
            >
              <div className='flex items-center gap-2 flex-1 min-w-0'>
                <div
                  className={cn('w-2 h-2 rounded-full flex-shrink-0', bgClass)}
                />
                <span className='truncate'>{getStatusDisplayText(status)}</span>
              </div>
              {isSelected && (
                <Check className='h-4 w-4 text-blue-600 flex-shrink-0' />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Memoize component to prevent re-renders when parent re-renders
export const UnifiedStatusDropdown = React.memo(
  UnifiedStatusDropdownComponent,
  (prevProps, nextProps) => {
    // Only re-render if these critical props change
    return (
      prevProps.entityId === nextProps.entityId &&
      prevProps.currentStatus === nextProps.currentStatus &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.variant === nextProps.variant &&
      prevProps.entityType === nextProps.entityType &&
      prevProps.availableStatuses.length ===
        nextProps.availableStatuses.length &&
      prevProps.availableStatuses.every(
        (status, i) => status === nextProps.availableStatuses[i]
      )
    );
  }
);
