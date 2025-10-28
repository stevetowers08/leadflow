/**
 * Format a date as relative time (e.g., "2 days ago", "3 months ago")
 */

export interface FormatOptions {
  includeAbout?: boolean; // Add "about" prefix for fuzzy times
  showNoContact?: boolean; // Show "No contact" for null/undefined
}

/**
 * Format a date string as relative time
 * @param dateString - ISO date string or null/undefined
 * @param options - Formatting options
 * @returns Formatted relative time string or null
 */
export const formatRelativeTime = (
  dateString: string | null | undefined,
  options: FormatOptions = {}
): string | null => {
  const { includeAbout = true, showNoContact = true } = options;

  if (!dateString) {
    return showNoContact ? 'No contact' : null;
  }

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'In the future';
    }

    if (diffDays === 0) {
      return 'Today';
    }

    if (diffDays === 1) {
      return '1 day ago';
    }

    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    if (diffDays === 7) {
      return includeAbout ? 'about 1 week ago' : '1 week ago';
    }

    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return includeAbout ? `about ${weeks} week${weeks > 1 ? 's' : ''} ago` : `${weeks} weeks ago`;
    }

    if (diffDays === 30) {
      return includeAbout ? 'about 1 month ago' : '1 month ago';
    }

    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return includeAbout ? `about ${months} month${months > 1 ? 's' : ''} ago` : `${months} months ago`;
    }

    const years = Math.floor(diffDays / 365);
    return includeAbout ? `about ${years} year${years > 1 ? 's' : ''} ago` : `${years} years ago`;
  } catch (error) {
    console.warn('Failed to format relative time:', error);
    return null;
  }
};

/**
 * Format a date as relative time with "No contact" fallback
 * Useful for displaying in tables where null should show "No contact"
 */
export const formatLastActivity = (dateString: string | null | undefined): string => {
  return formatRelativeTime(dateString, { includeAbout: true, showNoContact: true }) || 'No contact';
};

/**
 * Format a date as relative time without "No contact" fallback
 * Returns null if the date is invalid/null
 */
export const formatRelativeTimeOnly = (dateString: string | null | undefined): string | null => {
  return formatRelativeTime(dateString, { includeAbout: true, showNoContact: false });
};

