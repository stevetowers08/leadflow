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

export const UnifiedStatusDropdown: React.FC<UnifiedStatusDropdownProps> = ({
  entityId,
  entityType,
  currentStatus,
  availableStatuses,
  onStatusChange,
  disabled = false,
  variant = 'button',
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync local status with prop changes from parent
  React.useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  const updateStatus = async (newStatus: string) => {
    if (newStatus === localStatus || isUpdating) return;

    const previousStatus = localStatus;
    setLocalStatus(newStatus);
    setIsUpdating(true);

    try {
      // Jobs use client_jobs table
      if (entityType === 'jobs') {
        if (!user?.id) throw new Error('No user found');

        const { data: clientUser } = await supabase
          .from('client_users')
          .select('client_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!clientUser?.client_id) throw new Error('No client found');

        const { error } = await supabase.from('client_jobs').upsert(
          {
            client_id: clientUser.client_id,
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
                  client_id: clientUser.client_id,
                  user_id: user.id,
                };

                console.log(
                  '[Webhook] Invoking webhook with payload:',
                  webhookPayload
                );

                const { error: webhookError, data: webhookData } =
                  await supabase.functions.invoke('job-qualification-webhook', {
                    body: webhookPayload,
                  });

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
              console.error('[Webhook] Error in webhook delivery:', webhookErr);
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
  };

  const statusClasses = getUnifiedStatusClass(localStatus);
  const displayText = getStatusDisplayText(localStatus);

  // Extract the background color class for the status indicator
  const statusIndicatorClass =
    getUnifiedStatusClass(localStatus).split(' ')[0] || 'bg-gray-100';

  // Choose variant styling
  const isCellVariant = variant === 'cell';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled || isUpdating}
        className={cn(
          isCellVariant
            ? // Cell variant - full cell color, no border, centered text
              cn(
                'absolute inset-0 w-full h-full flex items-center justify-center',
                statusClasses,
                'transition-all duration-150 whitespace-nowrap'
              )
            : // Button variant - button-like with border and dot
              cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm',
                'bg-white border border-gray-200 rounded-lg',
                'hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'transition-all duration-200 ease-in-out',
                'min-w-[140px]'
              ),
          (disabled || isUpdating) && 'opacity-50 cursor-not-allowed',
          !disabled &&
            !isUpdating &&
            (isCellVariant
              ? 'hover:opacity-90 cursor-pointer'
              : 'cursor-pointer')
        )}
      >
        {isCellVariant ? (
          // Cell variant: just text, no dot
          <>
            <span>{displayText}</span>
            {!disabled && !isUpdating && (
              <ChevronDown className='h-3 w-3 flex-shrink-0 ml-1' />
            )}
          </>
        ) : (
          // Button variant: dot + text + chevron
          <>
            <div className='flex items-center gap-2 flex-1'>
              <div
                className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  statusIndicatorClass
                )}
              />
              <span className='text-gray-900 font-medium text-xs'>
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
                'transition-colors text-gray-900',
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
