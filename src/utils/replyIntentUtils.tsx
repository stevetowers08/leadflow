/**
 * Utility functions for displaying reply intent in the UI
 * Provides visual indicators for reply sentiment (interested, not_interested, maybe)
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Reply intent types from the email sentiment analysis
 */
export type ReplyIntent = 'interested' | 'not_interested' | 'maybe' | null;

/**
 * Get the color classes for a reply intent badge
 */
export function getReplyIntentBadgeClasses(intent: ReplyIntent): string {
  switch (intent) {
    case 'interested':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'not_interested':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'maybe':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-gray-50 text-gray-500 border-gray-200';
  }
}

/**
 * Get the emoji for reply intent
 */
export function getReplyIntentEmoji(intent: ReplyIntent): string {
  switch (intent) {
    case 'interested':
      return '✓';
    case 'not_interested':
      return '✗';
    case 'maybe':
      return '?';
    default:
      return '—';
  }
}

/**
 * Get the display text for reply intent
 */
export function getReplyIntentText(intent: ReplyIntent): string {
  switch (intent) {
    case 'interested':
      return 'Interested';
    case 'not_interested':
      return 'Not Interested';
    case 'maybe':
      return 'Maybe';
    default:
      return 'No Reply';
  }
}

/**
 * Get icon color classes based on reply intent
 */
export function getReplyIntentIconClasses(intent: ReplyIntent): string {
  switch (intent) {
    case 'interested':
      return 'text-emerald-600';
    case 'not_interested':
      return 'text-red-600';
    case 'maybe':
      return 'text-amber-600';
    default:
      return 'text-gray-400';
  }
}

/**
 * Reply Intent Indicator Component
 * Small inline indicator to show reply sentiment
 */
interface ReplyIntentIndicatorProps {
  intent: ReplyIntent;
  size?: 'sm' | 'md';
  showText?: boolean;
  className?: string;
}

export function ReplyIntentIndicator({
  intent,
  size = 'sm',
  showText = false,
  className,
}: ReplyIntentIndicatorProps) {
  if (!intent) return null;

  const sizeClasses = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium',
        getReplyIntentBadgeClasses(intent),
        className
      )}
      title={`Reply: ${getReplyIntentText(intent)}`}
    >
      <span className={cn(sizeClasses, getReplyIntentIconClasses(intent))}>
        {getReplyIntentEmoji(intent)}
      </span>
      {showText && <span>{getReplyIntentText(intent)}</span>}
    </div>
  );
}

/**
 * Get the dot indicator color for reply intent
 */
export function getReplyIntentDotColor(intent: ReplyIntent): string {
  switch (intent) {
    case 'interested':
      return 'bg-emerald-500';
    case 'not_interested':
      return 'bg-red-500';
    case 'maybe':
      return 'bg-amber-500';
    default:
      return 'bg-gray-300';
  }
}
