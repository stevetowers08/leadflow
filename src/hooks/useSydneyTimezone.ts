import { formatDateForSydney, SYDNEY_TIMEZONE } from '@/utils/timezoneUtils';

/**
 * Custom hook for Sydney timezone formatting
 */
export const useSydneyTimezone = () => {
  /**
   * Format a UTC timestamp for Sydney timezone display
   */
  const formatForSydney = (
    utcTimestamp: string | null | undefined,
    format: 'short' | 'long' | 'time' | 'date' = 'short',
    fallback: string = 'Not specified'
  ): string => {
    if (!utcTimestamp) return fallback;

    try {
      return formatDateForSydney(utcTimestamp, format);
    } catch (error) {
      console.warn('Failed to format date for Sydney timezone:', error);
      return fallback;
    }
  };

  /**
   * Format date only (no time)
   */
  const formatDate = (utcTimestamp: string | null | undefined): string => {
    return formatForSydney(utcTimestamp, 'date');
  };

  /**
   * Format time only (no date)
   */
  const formatTime = (utcTimestamp: string | null | undefined): string => {
    return formatForSydney(utcTimestamp, 'time');
  };

  /**
   * Format short date and time
   */
  const formatShort = (utcTimestamp: string | null | undefined): string => {
    return formatForSydney(utcTimestamp, 'short');
  };

  /**
   * Format long date and time
   */
  const formatLong = (utcTimestamp: string | null | undefined): string => {
    return formatForSydney(utcTimestamp, 'long');
  };

  /**
   * Get current time in Sydney timezone
   */
  const getCurrentSydneyTime = (): string => {
    return formatDateForSydney(new Date().toISOString(), 'long');
  };

  /**
   * Get Sydney timezone info
   */
  const getTimezoneInfo = () => ({
    timezone: SYDNEY_TIMEZONE,
    offset: new Date().toLocaleString('en-AU', {
      timeZone: SYDNEY_TIMEZONE,
      timeZoneName: 'longOffset',
    }),
  });

  return {
    formatForSydney,
    formatDate,
    formatTime,
    formatShort,
    formatLong,
    getCurrentSydneyTime,
    getTimezoneInfo,
    timezone: SYDNEY_TIMEZONE,
  };
};
