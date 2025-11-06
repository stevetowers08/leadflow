'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface CellLoadingSpinnerProps {
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Compact loading spinner for table cells
 * Uses smooth CSS animation with prefers-reduced-motion support
 */
export const CellLoadingSpinner: React.FC<CellLoadingSpinnerProps> = ({
  size = 'sm',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'text-muted-foreground',
        className
      )}
      role='status'
      aria-label='Loading'
    >
      <Loader2
        className={cn(
          size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
          'animate-spin',
          // Smooth animation with reduced motion support
          'motion-safe:animate-spin motion-reduce:animate-pulse'
        )}
        style={{
          animationDuration: '0.6s',
        }}
      />
    </div>
  );
};
