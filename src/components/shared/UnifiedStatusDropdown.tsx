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
import { shouldBypassAuth } from '@/config/auth';
import { Check, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

export interface UnifiedStatusDropdownProps {
  entityId: string;
  entityType: 'people' | 'companies' | 'jobs' | 'leads';
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
  const { data: clientId, isLoading: clientIdLoading } = useClientId(); // Use cached client_id
  const bypassAuth = shouldBypassAuth();
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
        // Jobs require client_id for proper multi-tenant isolation (industry best practice)
        if (entityType === 'jobs') {
          if (!user?.id) {
            throw new Error('No user found');
          }

          // In bypassAuth mode, allow operations even if clientId is not yet loaded
          // The clientId will be fetched in the background
          if (!bypassAuth) {
            // Wait for clientId to load if still loading (only in non-bypass mode)
            if (clientIdLoading) {
              throw new Error('Please wait, loading client information...');
            }

            // clientId is required for all operations (following Salesforce/HubSpot pattern)
            if (!clientId) {
              throw new Error(
                'Client organization required. Please contact support to set up your account.'
              );
            }
          } else if (!clientId && !clientIdLoading) {
            // In bypassAuth mode, if clientId is still null after loading, try to fetch it
            // This handles the case where the mock user might not have a client_id yet
            console.warn('BypassAuth mode: clientId not found, attempting to fetch...');
          }

          // Use client_jobs table for multi-tenant isolation
          // In bypassAuth mode, if clientId is missing, we'll try to get it or use a fallback
          let finalClientId = clientId;
          
          if (!finalClientId && bypassAuth) {
            // Try to fetch clientId one more time
            const { data: clientUser } = await supabase
              .from('client_users')
              .select('client_id')
              .eq('user_id', user.id)
              .maybeSingle();
            
            finalClientId = clientUser?.client_id || null;
            
            if (!finalClientId) {
              // In bypassAuth dev mode, if no client_id exists, we can't update client_jobs
              // Fall back to updating jobs.qualification_status directly (dev-only)
              console.warn('BypassAuth: No client_id found, updating jobs table directly');
              const { error: jobsError } = await supabase
                .from('jobs')
                .update({
                  qualification_status: newStatus,
                  qualified_at: newStatus === 'qualify' ? new Date().toISOString() : null,
                  qualified_by: newStatus === 'qualify' ? user.id : null,
                })
                .eq('id', entityId);
              
              if (jobsError) throw jobsError;
              // Skip webhook and return early since we used fallback update
              onStatusChange?.();
              toast({
                title: 'Status updated',
                description: `Changed to ${getStatusDisplayText(newStatus)}`,
              });
              setIsUpdating(false);
              return;
            }
          }
          
          if (!finalClientId) {
            throw new Error(
              'Client organization required. Please contact support to set up your account.'
            );
          }

          const { error } = await supabase.from('client_jobs').upsert(
            {
              client_id: finalClientId,
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

                if (jobData?.company_id && finalClientId) {
                  const webhookPayload = {
                    job_id: entityId,
                    company_id: jobData.company_id,
                    client_id: finalClientId,
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
          // People, Companies, and Leads update directly
          let statusField: string;
          let tableName: string;
          
          if (entityType === 'leads') {
            tableName = 'leads';
            statusField = 'status'; // PDR Section 7: leads table uses 'status' field
          } else if (entityType === 'people') {
            tableName = 'people';
            statusField = 'people_stage';
          } else {
            tableName = entityType;
            statusField = 'pipeline_stage';
          }

          const { error } = await supabase
            .from(tableName)
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
      clientIdLoading,
      bypassAuth,
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

  // Disable dropdown if disabled, updating, or clientId is loading
  // clientId is required for jobs (multi-tenant isolation)
  // In bypassAuth mode, allow operations even if clientId is still loading
  const isDisabled =
    disabled ||
    isUpdating ||
    (entityType === 'jobs' && !bypassAuth && (clientIdLoading || !clientId));

  // For cell variant, the entire cell should be the trigger with background color
  // Use w-full h-full to fill the cell naturally
  const triggerStyles = isCellVariant
    ? cn(
        'w-full h-full flex items-center justify-center gap-1.5',
        'transition-opacity duration-150',
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:opacity-90 cursor-pointer'
      )
    : cn(
        'flex items-center gap-2 px-3 text-sm',
        'bg-white border border-border rounded-md',
        'hover:border-border hover:bg-muted',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'transition-colors',
        'h-8',
        'min-w-[140px]',
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer'
      );

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
        disabled={isDisabled}
        className={triggerStyles}
      >
        {isCellVariant ? (
          <>
            <span className='text-xs font-medium'>{displayText}</span>
            {!isDisabled && (
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
              <span className='text-foreground font-medium text-sm'>
                {displayText}
              </span>
            </div>
            {!isDisabled && (
              <ChevronDown className='h-4 w-4 text-muted-foreground flex-shrink-0' />
            )}
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='start'
        side='bottom'
        sideOffset={4}
        className='w-[180px] p-1'
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
                'transition-colors text-foreground',
                isSelected ? 'bg-primary/10 font-medium' : 'hover:bg-muted'
              )}
            >
              <div className='flex items-center gap-2 flex-1 min-w-0'>
                <div
                  className={cn('w-2 h-2 rounded-full flex-shrink-0', bgClass)}
                />
                <span className='truncate'>{getStatusDisplayText(status)}</span>
              </div>
              {isSelected && (
                <Check className='h-4 w-4 text-primary flex-shrink-0' />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
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
