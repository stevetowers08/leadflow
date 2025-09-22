/**
 * Utility functions for handling status values consistently across the application
 * Uses ONLY the Stage text field from the People table (ignores enum completely)
 */

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
    'IN QUEUE': 'In Queue',
    'CONNECT SENT': 'Connect Sent',
    'MSG SENT': 'Message Sent',
    'CONNECTED': 'Connected',
    'REPLIED': 'Replied',
    'LEAD LOST': 'Lead Lost',
    'contacted': 'Contacted'
  };

  return displayMapping[status] || status;
}

/**
 * Gets the color class for a status value
 * Colors based on logical progression through the sales funnel
 */
export function getStatusColorClass(status: string): string {
  const colorMapping: Record<string, string> = {
    // Initial stage - Blue (fresh/new)
    'NEW LEAD': "bg-blue-50 text-blue-700 border-blue-200",
    'contacted': "bg-blue-50 text-blue-700 border-blue-200",
    
    // Active stages - Yellow/Orange (in progress)
    'IN QUEUE': "bg-yellow-50 text-yellow-700 border-yellow-200",
    'CONNECT SENT': "bg-orange-50 text-orange-700 border-orange-200",
    'MSG SENT': "bg-amber-50 text-amber-700 border-amber-200",
    
    // Positive stages - Green (successful)
    'CONNECTED': "bg-green-50 text-green-700 border-green-200",
    'REPLIED': "bg-emerald-50 text-emerald-700 border-emerald-200",
    
    // Negative stage - Red (lost)
    'LEAD LOST': "bg-red-50 text-red-700 border-red-200"
  };

  return colorMapping[status] || "bg-slate-50 text-slate-700 border-slate-200";
}

/**
 * Validates if a status value is valid (any non-empty string is valid)
 */
export function isValidStatus(status: string | null): boolean {
  return status !== null && status.trim() !== '';
}
