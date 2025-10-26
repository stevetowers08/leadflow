/**
 * StatusDropdown Component
 *
 * Clickable status badge with dropdown for quick status changes
 * - Modern dropdown UX (no form, direct update)
 * - Consistent with status color scheme
 * - Keyboard accessible
 * - Optimistic updates
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

export interface StatusDropdownProps {
  entityId: string;
  entityType: 'people' | 'companies' | 'jobs';
  currentStatus: string;
  availableStatuses: string[];
  onStatusChange?: (newStatus: string) => void;
  disabled?: boolean;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
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

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === localStatus || isUpdating) return;

    // Optimistic update
    const previousStatus = localStatus;
    setLocalStatus(newStatus);

    setIsUpdating(true);
    try {
      // Determine the correct field name based on entity type
      const statusField =
        entityType === 'people'
          ? 'people_stage'
          : entityType === 'companies'
            ? 'pipeline_stage'
            : 'status';

      const { error } = await supabase
        .from(entityType)
        .update({
          [statusField]: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entityId);

      if (error) throw error;

      // Notify parent component
      onStatusChange?.(newStatus);

      toast({
        title: 'Status Updated',
        description: `Status changed to ${getStatusDisplayText(newStatus)}`,
      });
    } catch (error) {
      // Revert optimistic update
      setLocalStatus(previousStatus);

      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const statusClasses = getUnifiedStatusClass(localStatus);
  const displayText = getStatusDisplayText(localStatus);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled || isUpdating}
        className={`
          inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium
          transition-all duration-150 cursor-pointer whitespace-nowrap
          ${statusClasses}
          ${disabled || isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        `}
        onClick={e => e.stopPropagation()} // Prevent row click
      >
        <span className='whitespace-nowrap'>{displayText}</span>
        {!disabled && <ChevronDown className='h-3 w-3 flex-shrink-0' />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        onClick={e => e.stopPropagation()} // Prevent row click
      >
        {availableStatuses.map(status => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={status === localStatus}
            className={`
              ${status === localStatus ? 'bg-muted font-medium' : ''}
            `}
          >
            <div className='flex items-center gap-2'>
              <div
                className={`w-2 h-2 rounded-full ${getUnifiedStatusClass(status)}`}
              />
              {getStatusDisplayText(status)}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
