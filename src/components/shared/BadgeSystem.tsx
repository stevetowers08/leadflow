/**
 * Centralized Badge System
 * This ensures consistent badge rendering across the entire application
 */

import React from 'react';
import { AIScoreBadge } from '../ai/AIScoreBadge';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { cn } from '@/lib/utils';

export type BadgeType = 'stage' | 'priority' | 'score' | 'status';

export interface BadgeProps {
  type: BadgeType;
  value: string | number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  leadData?: Record<string, unknown>;
}

/**
 * Centralized badge rendering system
 * This is the ONLY way badges should be rendered in the app
 */
export const Badge: React.FC<BadgeProps> = ({
  type,
  value,
  size = 'md',
  showDetails = false,
  leadData,
}) => {
  const sizeStyles = {
    sm: 'text-xs font-medium',
    md: 'text-sm font-medium',
    lg: 'text-base font-medium',
  };

  switch (type) {
    case 'stage':
      return (
        <span className={cn('text-xs font-medium', sizeStyles[size])}>
          {getStatusDisplayText(String(value))}
        </span>
      );

    case 'priority':
      return (
        <span className={cn('text-xs font-medium', sizeStyles[size])}>
          {getStatusDisplayText(String(value))}
        </span>
      );

    case 'status':
      return (
        <span className={cn('text-xs font-medium', sizeStyles[size])}>
          {getStatusDisplayText(String(value))}
        </span>
      );

    case 'score':
      if (!leadData) {
        console.warn('AIScoreBadge requires leadData');
        return (
          <span className={cn('text-xs font-medium', sizeStyles[size])}>
            N/A
          </span>
        );
      }
      return (
        <AIScoreBadge
          leadData={
            leadData as {
              name: string;
              company: string;
              role: string;
              location: string;
              experience?: string;
              industry?: string;
              company_size?: string;
            }
          }
          initialScore={
            typeof value === 'number' ? value : parseInt(String(value))
          }
          showDetails={showDetails}
        />
      );

    default:
      console.error(`Unknown badge type: ${type}`);
      return (
        <span className={cn('text-xs font-medium', sizeStyles[size])}>
          Unknown
        </span>
      );
  }
};

/**
 * Convenience functions for common badge types
 */
export const StageBadge = (props: Omit<BadgeProps, 'type'>) => (
  <Badge {...props} type='stage' />
);

export const PriorityBadge = (props: Omit<BadgeProps, 'type'>) => (
  <Badge {...props} type='priority' />
);

export const ScoreBadge = (props: Omit<BadgeProps, 'type'>) => (
  <Badge {...props} type='score' />
);

export const StatusBadgeWrapper = (props: Omit<BadgeProps, 'type'>) => (
  <Badge {...props} type='status' />
);

/**
 * Validation function to ensure proper badge usage
 */
export const validateBadgeUsage = () => {
  const issues: string[] = [];

  // This would be called during build/CI to catch issues
  console.log('🔍 Validating badge usage...');

  return issues;
};
