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
 * Converts all variations to proper title case formatting
 */
export function getStatusDisplayText(status: string): string {
  if (!status) return '';

  // Convert to proper case (first letter capitalized only)
  const displayMapping: Record<string, string> = {
    // Lead stages - all variations
    'NEW LEAD': 'New Lead',
    new: 'New Lead',
    'new lead': 'New Lead',
    NEW: 'New Lead',
    'IN QUEUE': 'In Queue',
    'in queue': 'In Queue',
    in_queue: 'In Queue',
    'CONNECT SENT': 'Connect Sent',
    connection_requested: 'Connect Sent',
    connect_sent: 'Connect Sent',
    'connect sent': 'Connect Sent',
    'MSG SENT': 'Message Sent',
    messaged: 'Messaged',
    message_sent: 'Message Sent',
    'message sent': 'Message Sent',
    CONNECTED: 'Connected',
    connected: 'Connected',
    REPLIED: 'Replied',
    replied: 'Replied',
    'LEAD LOST': 'Lead Lost',
    lead_lost: 'Lead Lost',
    'lead lost': 'Lead Lost',
    contacted: 'Contacted',
    meeting_booked: 'Meeting Booked',
    'meeting booked': 'Meeting Booked',
    meeting_held: 'Meeting Held',
    'meeting held': 'Meeting Held',
    disqualified: 'Disqualified',

    // Job priorities - all variations
    HIGH: 'High',
    high: 'High',
    MEDIUM: 'Medium',
    medium: 'Medium',
    LOW: 'Low',
    low: 'Low',
    'VERY HIGH': 'Very High',
    'very-high': 'Very High',
    'very high': 'Very High',
    very_high: 'Very High',
    VERY_HIGH: 'Very High',

    // Company status mappings - all variations
    active: 'Active',
    ACTIVE: 'Active',
    qualified: 'Qualified',
    QUALIFIED: 'Qualified',
    prospect: 'Prospect',
    PROSPECT: 'Prospect',

    // Job status mappings - all variations
    'new job': 'New Job',
    new_job: 'New Job',
    'NEW JOB': 'New Job',
    NEW_JOB: 'New Job',
    automated: 'Automated',
    AUTOMATED: 'Automated',
    paused: 'Paused',
    PAUSED: 'Paused',
    completed: 'Completed',
    COMPLETED: 'Completed',
    failed: 'Failed',
    FAILED: 'Failed',

    // User roles and statuses - all variations
    owner: 'Owner',
    OWNER: 'Owner',
    admin: 'Admin',
    ADMIN: 'Admin',
    recruiter: 'Recruiter',
    RECRUITER: 'Recruiter',
    inactive: 'Inactive',
    INACTIVE: 'Inactive',

    // Company pipeline stages - all variations (from DB enum)
    new_lead: 'New Lead',
    NEW_LEAD: 'New Lead',
    automated: 'Automated',
    AUTOMATED: 'Automated',
    replied: 'Replied',
    REPLIED: 'Replied',
    meeting_scheduled: 'Meeting Scheduled',
    'meeting scheduled': 'Meeting Scheduled',
    MEETING_SCHEDULED: 'Meeting Scheduled',
    proposal_sent: 'Proposal Sent',
    'proposal sent': 'Proposal Sent',
    PROPOSAL_SENT: 'Proposal Sent',
    negotiation: 'Negotiation',
    NEGOTIATION: 'Negotiation',
    closed_won: 'Closed Won',
    'closed won': 'Closed Won',
    CLOSED_WON: 'Closed Won',
    closed_lost: 'Closed Lost',
    'closed lost': 'Closed Lost',
    CLOSED_LOST: 'Closed Lost',
    on_hold: 'On Hold',
    'on hold': 'On Hold',
    ON_HOLD: 'On Hold',

    // Reply types - all variations (from DB enum)
    interested: 'Interested',
    INTERESTED: 'Interested',
    not_interested: 'Not Interested',
    'not interested': 'Not Interested',
    NOT_INTERESTED: 'Not Interested',
    maybe: 'Maybe',
    MAYBE: 'Maybe',

    // Interaction types - all variations (from DB enum)
    linkedin_connection_request_sent: 'LinkedIn Connection Request Sent',
    LINKEDIN_CONNECTION_REQUEST_SENT: 'LinkedIn Connection Request Sent',
    linkedin_connected: 'LinkedIn Connected',
    LINKEDIN_CONNECTED: 'LinkedIn Connected',
    linkedin_message_sent: 'LinkedIn Message Sent',
    LINKEDIN_MESSAGE_SENT: 'LinkedIn Message Sent',
    linkedin_message_reply: 'LinkedIn Message Reply',
    LINKEDIN_MESSAGE_REPLY: 'LinkedIn Message Reply',
    email_sent: 'Email Sent',
    EMAIL_SENT: 'Email Sent',
    email_reply: 'Email Reply',
    EMAIL_REPLY: 'Email Reply',
    meeting_booked: 'Meeting Booked',
    MEETING_BOOKED: 'Meeting Booked',
    meeting_held: 'Meeting Held',
    MEETING_HELD: 'Meeting Held',
    disqualified: 'Disqualified',
    DISQUALIFIED: 'Disqualified',
    note: 'Note',
    NOTE: 'Note',

    // Campaign status - all variations
    draft: 'Draft',
    DRAFT: 'Draft',

    // Additional status mappings - all variations
    assigned: 'Assigned',
    ASSIGNED: 'Assigned',
    'has logo': 'Has Logo',
    has_logo: 'Has Logo',
    'HAS LOGO': 'Has Logo',
    HAS_LOGO: 'Has Logo',
    'no logo': 'No Logo',
    no_logo: 'No Logo',
    'NO LOGO': 'No Logo',
    NO_LOGO: 'No Logo',
    sent: 'Sent',
    SENT: 'Sent',
    delivered: 'Delivered',
    DELIVERED: 'Delivered',
    pending: 'Pending',
    PENDING: 'Pending',
    linkedin: 'LinkedIn',
    LINKEDIN: 'LinkedIn',
    email: 'Email',
    EMAIL: 'Email',
    unknown: 'Unknown',
    UNKNOWN: 'Unknown',
    expired: 'Expired',
    EXPIRED: 'Expired',
    not_automated: 'Not Automated',
    NOT_AUTOMATED: 'Not Automated',
    'not automated': 'Not Automated',
    'NOT AUTOMATED': 'Not Automated',
  };

  // Return mapped value or convert to title case if not found
  return displayMapping[status] || convertToTitleCase(status);
}

/**
 * Converts a string to title case (first letter of each word capitalized)
 */
function convertToTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
