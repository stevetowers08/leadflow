/**
 * Utility functions for handling status values consistently across the application
 * Uses ONLY the Stage text field from the People table (ignores enum completely)
 */

import { getUnifiedStatusClass } from './colorScheme';

/**
 * Normalizes a status value to a consistent format
 * Uses ONLY the Stage field, ignores stage_enum completely
 */
export function normalizeStatus(stage: string | null): string {
  // Use ONLY the Stage field, ignore stage_enum
  if (!stage) {
    return 'NEW LEAD'; // Default fallback
  }

  // Return the Stage field value as-is
  return stage;
}

/**
 * Gets the display text for a status value
 * Converts uppercase to proper case
 */
export function getStatusDisplayText(status: string): string {
  // Convert uppercase to proper case
  const displayMapping: Record<string, string> = {
    'NEW LEAD': 'New Lead',
    'new': 'New',
    'IN QUEUE': 'In Queue',
    'in queue': 'In Queue',
    'CONNECT SENT': 'Connect Sent',
    'connection_requested': 'Connect Sent',
    'MSG SENT': 'Message Sent',
    'messaged': 'Messaged',
    'CONNECTED': 'Connected',
    'connected': 'Connected',
    'REPLIED': 'Replied',
    'replied': 'Replied',
    'LEAD LOST': 'Lead Lost',
    'lead_lost': 'Lead Lost',
    'contacted': 'Contacted'
  };

  return displayMapping[status] || status;
}

/**
 * Gets the color class for a status value
 * Now uses the unified color scheme for consistency
 */
export function getStatusColorClass(status: string): string {
  return getUnifiedStatusClass(status);
}

/**
 * Validates if a status value is valid (any non-empty string is valid)
 */
export function isValidStatus(status: string | null): boolean {
  return status !== null && status.trim() !== '';
}
