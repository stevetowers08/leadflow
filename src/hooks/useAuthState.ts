/**
 * Authentication Hook
 *
 * Handles core authentication state and operations
 * Separated from profile management for better maintainability
 */

import { supabase } from '@/integrations/supabase/client';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { useCallback, useState } from 'react';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);

      // Check if Google OAuth is configured
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!googleClientId || googleClientId.includes('your-google-client-id')) {
        const authError = new Error(
          'Google OAuth is not configured. Please contact your administrator.'
        );
        setError(authError.message);
        return { error: authError };
      }

      // Get redirect URL - prefer environment variable, fallback to window.location.origin
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const redirectTo = `${siteUrl}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      return { error };
    } catch (error) {
      const authError = error as AuthError;
      setError(`Google sign-in failed: ${authError.message}`);
      return { error: authError };
    }
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        return { error };
      } catch (error) {
        const authError = error as AuthError;
        setError(`Email sign-in failed: ${authError.message}`);
        return { error: authError };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      setError(null);
      console.log('🚪 Signing out...');
      console.log('🔍 Current user before sign out:', user?.email);

      // Sign out from Supabase first (before clearing state)
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.warn('⚠️ Supabase sign out error:', error);
      }

      // Clear all Supabase auth storage keys
      if (typeof window !== 'undefined') {
        // Clear all Supabase-related localStorage keys (comprehensive)
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
          if (
            key.includes('supabase') || 
            key.includes('sb-') ||
            key.includes('auth') ||
            key.includes('token') ||
            key.includes('session') ||
            key.startsWith('supabase.auth')
          ) {
            localStorage.removeItem(key);
          }
        });

        // Clear sessionStorage completely
        sessionStorage.clear();

        // Set flags to prevent auto-login in bypass mode (both storage for persistence)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('bypass-auth-disabled', 'true');
          localStorage.setItem('bypass-auth-disabled', 'true');
        }
      }

      // Clear all state
      setUser(null);
      setSession(null);
      setLoading(false);

      console.log('✅ Sign out successful - state and storage cleared');

      // Force a hard redirect to clear any cached state
      if (typeof window !== 'undefined') {
        // Use replace to prevent back button from going to authenticated page
        window.location.replace('/');
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('❌ Sign out error:', authError);

      // Force clear everything even if sign out fails
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      setUser(null);
      setSession(null);
      setLoading(false);

      console.log('✅ State cleared despite sign out error');

      // Force redirect
      if (typeof window !== 'undefined') {
        window.location.replace('/');
      }

      return { error: null }; // Return success since state is cleared
    }
  }, [user]);

  const updateProfile = useCallback(
    async (updates: { full_name?: string; avatar_url?: string }) => {
      try {
        setError(null);
        const { error } = await supabase.auth.updateUser({
          data: updates,
        });
        return { error };
      } catch (error) {
        const authError = error as AuthError;
        setError(`Profile update failed: ${authError.message}`);
        return { error: authError };
      }
    },
    []
  );

  const clearAuthState = useCallback(async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setSession(null);
      return true;
    } catch (error) {
      console.error('❌ Clear auth state error:', error);
      setError(
        `Failed to clear auth state: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return false;
    }
  }, []);

  const forceReAuth = useCallback(async () => {
    try {
      console.log('🔄 Forcing re-authentication...');
      setError(null);

      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();

      // Reload page to start fresh
      window.location.reload();
    } catch (error) {
      console.error('❌ Error during force re-auth:', error);
      setError(
        `Force re-authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      window.location.reload();
    }
  }, []);

  return {
    user,
    session,
    loading,
    error,
    setUser,
    setSession,
    setLoading,
    setError,
    signInWithGoogle,
    signInWithPassword,
    signOut,
    updateProfile,
    clearAuthState,
    forceReAuth,
  };
};
