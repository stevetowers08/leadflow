/**
 * Timezone utility functions for handling dates in Supabase
 * Configured for Sydney timezone (Australia/Sydney)
 */

// Sydney timezone constant
export const SYDNEY_TIMEZONE = 'Australia/Sydney';

/**
 * Convert UTC timestamp to local timezone
 */
export const convertToLocalTimezone = (utcTimestamp: string, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): Date => {
  return new Date(utcTimestamp);
};

/**
 * Format date for display in Sydney timezone
 */
export const formatDateForDisplay = (
  utcTimestamp: string, 
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }
): string => {
  const date = new Date(utcTimestamp);
  return date.toLocaleString('en-AU', { ...options, timeZone: SYDNEY_TIMEZONE });
};

/**
 * Format date for display in Sydney timezone with custom format
 */
export const formatDateForSydney = (
  utcTimestamp: string,
  format: 'short' | 'long' | 'time' | 'date' = 'short'
): string => {
  const date = new Date(utcTimestamp);
  
  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: SYDNEY_TIMEZONE
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: SYDNEY_TIMEZONE
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: SYDNEY_TIMEZONE
    },
    date: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: SYDNEY_TIMEZONE
    }
  };

  return date.toLocaleString('en-AU', formatOptions[format]);
};

/**
 * Get current timestamp in UTC for database storage
 */
export const getCurrentUTCTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Convert local date to UTC for database storage
 */
export const convertToUTC = (localDate: Date): string => {
  return localDate.toISOString();
};

/**
 * Format date for different timezones
 */
export const formatDateInTimezone = (
  utcTimestamp: string,
  timezone: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
): string => {
  const date = new Date(utcTimestamp);
  return date.toLocaleString('en-US', { ...options, timeZone: timezone });
};

/**
 * Get user's timezone
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * List of common timezones
 */
export const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'UTC'
];

/**
 * Create a Supabase query with timezone conversion
 */
export const createTimezoneQuery = (column: string, timezone: string = 'UTC') => {
  return `timezone('${timezone}', ${column})`;
};
