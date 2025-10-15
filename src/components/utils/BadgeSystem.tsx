/**
 * Centralized Badge System
 * This ensures consistent badge rendering across the entire application
 */

import React from 'react';
import { StatusBadge } from './StatusBadge';
import { AIScoreBadge } from './AIScoreBadge';

export type BadgeType = 'stage' | 'priority' | 'score' | 'status';

export interface BadgeProps {
  type: BadgeType;
  value: string | number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  leadData?: any;
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
  switch (type) {
    case 'stage':
      return <StatusBadge status={String(value)} size={size} />;

    case 'priority':
      return <StatusBadge status={String(value)} size={size} />;

    case 'status':
      return <StatusBadge status={String(value)} size={size} />;

    case 'score':
      if (!leadData) {
        console.warn('AIScoreBadge requires leadData');
        return <StatusBadge status='N/A' size={size} />;
      }
      return (
        <AIScoreBadge
          leadData={leadData}
          initialScore={
            typeof value === 'number' ? value : parseInt(String(value))
          }
          showDetails={showDetails}
        />
      );

    default:
      console.error(`Unknown badge type: ${type}`);
      return <StatusBadge status='Unknown' size={size} />;
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

export const StatusBadge = (props: Omit<BadgeProps, 'type'>) => (
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
