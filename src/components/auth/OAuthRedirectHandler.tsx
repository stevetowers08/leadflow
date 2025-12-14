'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * OAuth Redirect Handler
 *
 * Detects OAuth callback tokens in hash fragments and redirects to /auth/callback
 * This handles cases where Supabase redirects to root URL instead of /auth/callback
 */
export function OAuthRedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check for OAuth tokens in hash fragment immediately
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const error = hashParams.get('error');

    // If we have OAuth tokens or errors in the hash, redirect to callback page
    if (accessToken || refreshToken || error) {
      // Skip if already on callback page
      if (pathname === '/auth/callback') return;

      // Preserve the hash fragment in the redirect
      const callbackUrl = `/auth/callback${window.location.hash}`;
      router.replace(callbackUrl);
    }
  }, [pathname, router]);

  return null;
}
