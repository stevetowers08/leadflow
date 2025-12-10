/**
 * Profile Image Utilities
 * Handles profile image display with fallbacks
 */

/**
 * Generate UI Avatars URL as fallback
 * UI Avatars is a free service that generates avatar images from initials
 *
 * @param name - Person's name for initials
 * @param size - Image size in pixels
 * @param backgroundColor - Background color (optional)
 * @param textColor - Text color (optional)
 * @returns UI Avatars URL
 */
import { API_URLS } from '@/constants/urls';

export const getUIAvatarUrl = (
  name: string | null | undefined,
  size: number = 32,
  backgroundColor: string = '4f46e5', // Indigo-600
  textColor: string = 'ffffff' // White
): string => {
  const initials = getInitials(name);
  return API_URLS.UI_AVATARS(initials, size, backgroundColor, textColor);
};

/**
 * Generate fallback initials from name
 * @param name - Full name
 * @returns Initials string
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return '?';

  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Get profile image with fallback to UI Avatars
 * @param name - Person's name for fallback initials
 * @param size - Image size in pixels
 * @param backgroundColor - Background color (optional)
 * @param textColor - Text color (optional)
 * @returns Object with avatarUrl and initials
 */
export const getProfileImage = (
  name: string | null | undefined,
  size: number = 32,
  backgroundColor: string = '4f46e5',
  textColor: string = 'ffffff'
) => {
  const initials = getInitials(name);
  const avatarUrl = getUIAvatarUrl(name, size, backgroundColor, textColor);

  return {
    avatarUrl,
    initials,
    hasImage: true, // UI Avatars always works
  };
};
