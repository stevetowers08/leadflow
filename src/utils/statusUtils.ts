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
  // Convert to proper case (first letter capitalized only)
  const displayMapping: Record<string, string> = {
    // Lead stages - actual database values
    'NEW LEAD': 'New Lead',
    'new': 'New Lead',
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
    'contacted': 'Contacted',
    'meeting_booked': 'Meeting Booked',
    'meeting_held': 'Meeting Held',
    'disqualified': 'Disqualified',
    
    // Job priorities - actual database values (UPPERCASE)
    'HIGH': 'High',
    'MEDIUM': 'Medium',
    'LOW': 'Low',
    'VERY HIGH': 'Very High',
    'very-high': 'Very High',
    'very high': 'Very High',
    
    // Company status mappings - actual database values
    'active': 'Active',
    'qualified': 'Qualified',
    'prospect': 'Prospect',
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    
    // Job status mappings
    'new job': 'New Job',
    'automated': 'Automated',
    'paused': 'Paused',
    'completed': 'Completed',
    'failed': 'Failed',
    
    // User roles and statuses
    'owner': 'Owner',
    'admin': 'Admin',
    'recruiter': 'Recruiter',
    'inactive': 'Inactive',
    
    // Additional status mappings
    'assigned': 'Assigned',
    'has logo': 'Has Logo',
    'no logo': 'No Logo',
    'sent': 'Sent',
    'delivered': 'Delivered',
    'pending': 'Pending',
    'linkedin': 'LinkedIn',
    'email': 'Email',
    'unknown': 'Unknown'
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
