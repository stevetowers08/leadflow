/**
 * Unified Status Dropdown - Modern & Efficient
 *
 * Single source of truth for all status dropdowns
 * - Whole cell is clickable
 * - Modern design with status dots
 * - Clean, efficient code
 * - Optimistic updates
 * - Works with People and Companies
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
  entityType: 'people' | 'companies' | 'leads';
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
        // Note: jobs and people entity types removed - recruitment features removed
        // Update status for leads or companies
        if (entityType === 'leads') {
          const { error } = await supabase
            .from('leads')
            .update({
              status: newStatus,
              updated_at: new Date().toISOString(),
            })
            .eq('id', entityId);
          if (error) throw error;
        } else if (entityType === 'companies') {
          const { error } = await supabase
            .from('companies')
            .update({
              pipeline_stage: newStatus,
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
    () => statusClasses.split(' ')[0] || 'bg-muted',
    [statusClasses]
  );

  // Choose variant styling
  const isCellVariant = variant === 'cell';

  // Disable dropdown if disabled or updating
  const isDisabled = disabled || isUpdating;

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
        'bg-background border border-border rounded-md',
        'shadow-[0_1px_4px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.35)]',
        'hover:border-border hover:bg-muted',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'transition-colors',
        'h-8',
        'min-w-[140px]',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      );

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={isDisabled} className={triggerStyles}>
          {isCellVariant ? (
            <>
              <span className='text-xs font-medium'>{displayText}</span>
              {!isDisabled && <ChevronDown className='h-3 w-3 flex-shrink-0' />}
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
                    className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      bgClass
                    )}
                  />
                  <span className='truncate'>
                    {getStatusDisplayText(status)}
                  </span>
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
