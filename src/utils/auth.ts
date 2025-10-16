import { supabase } from '@/integrations/supabase/client';

/**
 * Clear OAuth state and session data to resolve state mismatch issues
 */
export const clearOAuthState = async () => {
  try {
    // Clear any existing session
    await supabase.auth.signOut();

    // Clear localStorage items that might cause state conflicts
    const keysToRemove = [
      'sb-jedfundfhzytpnbjkspn-auth-token',
      'supabase.auth.token',
      'supabase.auth.refresh_token',
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear any sessionStorage items
    sessionStorage.clear();

    return true;
  } catch (error) {
    console.error('Error clearing OAuth state:', error);
    return false;
  }
};

/**
 * Check if the current URL contains OAuth error parameters
 */
export const hasOAuthError = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('error') || urlParams.has('error_code');
};

/**
 * Get OAuth error details from URL parameters
 */
export const getOAuthError = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorCode = urlParams.get('error_code');
  const errorDescription = urlParams.get('error_description');

  return {
    error,
    errorCode,
    errorDescription: errorDescription
      ? decodeURIComponent(errorDescription)
      : null,
  };
};

/**
 * Clean up OAuth error parameters from URL
 */
export const cleanOAuthErrorFromUrl = () => {
  if (typeof window !== 'undefined' && hasOAuthError()) {
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    url.searchParams.delete('error_code');
    url.searchParams.delete('error_description');
    url.searchParams.delete('state');
    url.searchParams.delete('code');

    window.history.replaceState({}, document.title, url.toString());
  }
};
