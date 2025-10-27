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
}

export const UnifiedStatusDropdown: React.FC<UnifiedStatusDropdownProps> = ({
  entityId,
  entityType,
  currentStatus,
  availableStatuses,
  onStatusChange,
  disabled = false,
}) => {
  const { toast } = useToast();
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (newStatus: string) => {
    if (newStatus === localStatus || isUpdating) return;

    const previousStatus = localStatus;
    setLocalStatus(newStatus);
    setIsUpdating(true);

    try {
      // Jobs use client_jobs table
      if (entityType === 'jobs') {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) throw new Error('No user found');

        const { data: clientUser } = await supabase
          .from('client_users')
          .select('client_id')
          .eq('user_id', userData.user.id)
          .single();

        if (!clientUser?.client_id) throw new Error('No client found');

        const { error } = await supabase.from('client_jobs').upsert(
          {
            client_id: clientUser.client_id,
            job_id: entityId,
            status: newStatus,
            priority_level: 'medium',
            qualified_by: userData.user.id,
            qualified_at:
              newStatus === 'qualify' ? new Date().toISOString() : null,
          },
          { onConflict: 'client_id,job_id' }
        );

        if (error) throw error;
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

  return (
    <div className='w-full'>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled || isUpdating}
          className={cn(
            'w-full inline-flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium',
            'transition-all duration-150 whitespace-nowrap',
            'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
            statusClasses,
            (disabled || isUpdating) && 'opacity-50 cursor-not-allowed',
            !disabled && !isUpdating && 'hover:opacity-90 cursor-pointer'
          )}
        >
          <span className='truncate'>{displayText}</span>
          {!disabled && !isUpdating && (
            <ChevronDown className='h-3 w-3 flex-shrink-0' />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='start'
          side='bottom'
          sideOffset={2}
          alignOffset={-2}
          className='w-[150px] min-w-[150px] max-w-[150px] p-1'
          onClick={e => e.stopPropagation()}
        >
          {availableStatuses.map(status => {
            const isSelected = status === localStatus;
            const statusClassString = getUnifiedStatusClass(status);
            // Extract just the background color class (first class in the string)
            const bgClass = statusClassString.split(' ')[0] || 'bg-gray-100';

            return (
              <DropdownMenuItem
                key={status}
                onClick={() => updateStatus(status)}
                disabled={isSelected}
                className={cn(
                  'flex items-center justify-between gap-2 cursor-pointer px-2.5 py-1.5 rounded-md text-xs',
                  'transition-colors text-gray-900',
                  isSelected
                    ? 'bg-blue-50 font-medium'
                    : 'hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 focus:bg-gray-50'
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
                  <Check className='h-3.5 w-3.5 text-blue-600 flex-shrink-0' />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
