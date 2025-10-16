import { cn } from '@/lib/utils';
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import React from 'react';

/**
 * StatusBadge Component
 *
 * NOTE: Do NOT use this component in table cells!
 * Tables use the unified table system which applies status colors
 * directly to cell backgrounds via getUnifiedStatusClass().
 *
 * Use this component for:
 * - Popup modals
 * - Cards
 * - Forms
 * - Any non-table UI elements
 */

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className,
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const statusClass = getUnifiedStatusClass(status);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium text-white',
        sizeStyles[size],
        statusClass,
        className
      )}
    >
      {status}
    </span>
  );
};
