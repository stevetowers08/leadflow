'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import {
  useGlobalErrorHandler,
  usePerformanceMonitoring,
} from '@/hooks/useGlobalErrorHandler';
import { useNotificationTriggers } from '@/hooks/useNotificationTriggers';
import { initializeConsoleFilter } from '@/utils/consoleFilter';
import {
  initializeErrorHandling,
  setupGlobalErrorHandlers,
} from '@/utils/globalErrorHandlers';
import { ErrorBoundaryProvider } from '@/components/ErrorBoundary';
import {
  getAuthConfig,
  getMockUser,
  getMockUserProfile,
  shouldBypassAuth,
} from '@/config/auth';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import type { User } from '@supabase/supabase-js';
import { AuthPage } from '@/components/auth/AuthPage';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { PermissionsProvider } from '@/contexts/PermissionsContext';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { SlidePanelProvider } from '@/contexts/SlidePanelContext';
import { ConfirmationProvider } from '@/contexts/ConfirmationContext';
import { LoggingProvider } from '@/utils/enhancedLogger';
import { PerformanceProvider } from '@/utils/performanceMonitoring';
import { useClientId } from '@/hooks/useClientId';
import { OAuthRedirectHandler } from '@/components/auth/OAuthRedirectHandler';
import { useLeadEnrichmentRealtime } from '@/hooks/useLeadEnrichmentRealtime';
import { logger } from '@/utils/productionLogger';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - reduced for better freshness
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      retry: 2, // Reduced retries for faster failure handling
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Disable refetch on focus for better performance
      refetchOnMount: true, // Still refetch on mount for fresh data
      refetchOnReconnect: true, // Refetch on reconnect
    },
  },
});

// Client component wrapper for initialization hooks
function AppInitialization({ children }: { children: React.ReactNode }) {
  // Enable error logging and performance monitoring
  useGlobalErrorHandler();
  usePerformanceMonitoring();
  // Initialize notification triggers (meeting reminders, follow-ups)
  useNotificationTriggers();
  // Listen for real-time lead enrichment status changes
  useLeadEnrichmentRealtime();

  useEffect(() => {
    // Initialize console filtering to suppress browser extension noise
    initializeConsoleFilter();

    // Initialize error handling system
    const initErrorHandling = async () => {
      try {
        // Get admin email from environment or user profile
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || undefined;
        await initializeErrorHandling(adminEmail);
        setupGlobalErrorHandlers();
      } catch (error) {
        logger.error('Failed to initialize error handling:', error);
      }
    };

    initErrorHandling();
  }, []);

  return <>{children}</>;
}

// Client Guard: Multi-tenant removed per migration 20250220000000_remove_non_pdr_tables.sql
// The client_users and clients tables were removed as multi-tenant is not in PDR.
// All users now manage their own data via RLS policies.
// This guard is now a no-op but kept for potential future use.
function ClientGuard({ children }: { children: React.ReactNode }) {
  // Multi-tenant removed - no client_id check needed
  // All authenticated users can access the app
  return <>{children}</>;
}

// Wrapper component to provide PermissionsProvider with auth data
function PermissionsWrapper({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading } = useAuth();
  const bypassAuth = shouldBypassAuth();
  const [checkingSession, setCheckingSession] = React.useState(true);
  const [hasSession, setHasSession] = React.useState(false);

  // Check session directly from Supabase (not just context) to avoid race conditions
  // This is critical for OAuth callbacks where context might not be updated yet
  React.useEffect(() => {
    const checkSession = async () => {
      if (bypassAuth) {
        setCheckingSession(false);
        return;
      }

      try {
        const { supabase } = await import('@/integrations/supabase/client');

        // Check cookies first for debugging
        if (typeof document !== 'undefined') {
          const cookies = document.cookie.split(';').map(c => c.trim());
          const supabaseCookies = cookies.filter(
            c => c.startsWith('sb-') || c.includes('supabase')
          );
          logger.debug('🍪 Available cookies:', {
            total: cookies.length,
            supabaseCookies: supabaseCookies.length,
            cookieNames: supabaseCookies.map(c => c.split('=')[0]),
          });
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        const hasValidSession = !!session?.user;

        logger.debug('🔍 PermissionsWrapper: Session check', {
          hasSession: hasValidSession,
          userId: session?.user?.id,
          email: session?.user?.email,
          error: sessionError?.message,
          pathname:
            typeof window !== 'undefined'
              ? window.location.pathname
              : 'unknown',
        });

        setHasSession(hasValidSession);
      } catch (error) {
        logger.error('❌ Error checking session:', error);
        setHasSession(false);
      } finally {
        setCheckingSession(false);
      }
    };

    // Initial delay to allow cookies to be set after redirect
    const initialDelay = setTimeout(() => {
      checkSession();
    }, 100);

    // Re-check session periodically if we don't have a user in context yet
    // This handles the race condition where session exists but context hasn't updated
    // Increased timeout to 10 seconds for OAuth callback scenarios
    if (!user && !bypassAuth) {
      const interval = setInterval(() => {
        checkSession();
      }, 500);

      // Clear interval after 10 seconds (increased from 5)
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 10000);

      return () => {
        clearTimeout(initialDelay);
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => {
      clearTimeout(initialDelay);
    };
  }, [bypassAuth, user]);

  // Check if user explicitly signed out in bypass mode
  const bypassDisabled =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('bypass-auth-disabled') === 'true' ||
        localStorage.getItem('bypass-auth-disabled') === 'true'
      : false;

  // Show loading state while checking auth (only if not bypassing)
  if ((loading || checkingSession) && !bypassAuth) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sidebar-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  // If bypass is disabled (user signed out), show sign-in page
  if (bypassAuth && bypassDisabled) {
    return <AuthPage />;
  }

  // Redirect to sign-in if no user and not bypassing
  // Check both context user and direct session to avoid race conditions
  // IMPORTANT: Give session check time to complete before redirecting
  // This handles the race condition where cookies exist but haven't been read yet
  if (!bypassAuth && !user && !hasSession && !checkingSession) {
    logger.debug('🔍 PermissionsWrapper: No user found', {
      user: !!user,
      hasSession,
      loading,
      checkingSession,
      bypassAuth,
      pathname:
        typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    });
    return <AuthPage />;
  }

  // Get current user and profile (real or mock)
  // Only use mock user if bypass is enabled AND not disabled by sign-out
  // IMPORTANT: Double-check bypassDisabled here to prevent auto-login after sign-out
  const shouldUseMock = bypassAuth && !bypassDisabled;

  // If bypass is disabled, don't create mock user even if user is null
  const currentUser = bypassDisabled
    ? null
    : user || (shouldUseMock ? getMockUser() : null);
  const currentUserProfile = bypassDisabled
    ? null
    : userProfile || (shouldUseMock ? getMockUserProfile() : null);

  // If we're bypassing auth but still don't have a user, something is wrong
  if (bypassAuth && !bypassDisabled && !currentUser) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-destructive'>Authentication configuration error</p>
        </div>
      </div>
    );
  }

  return (
    <PermissionsProvider
      user={currentUser as User | null}
      userProfile={currentUserProfile}
      authLoading={loading && !bypassAuth}
    >
      <ClientGuard>{children}</ClientGuard>
    </PermissionsProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryProvider>
      <LoggingProvider>
        <PerformanceProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <OrganizationProvider>
                  <PermissionsWrapper>
                    <OnboardingProvider>
                      <SlidePanelProvider>
                        <SearchProvider>
                          <ConfirmationProvider>
                            <AppInitialization>
                              <OAuthRedirectHandler />
                              {children}
                              <Toaster />
                            </AppInitialization>
                          </ConfirmationProvider>
                        </SearchProvider>
                      </SlidePanelProvider>
                    </OnboardingProvider>
                  </PermissionsWrapper>
                </OrganizationProvider>
              </AuthProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </PerformanceProvider>
      </LoggingProvider>
    </ErrorBoundaryProvider>
  );
}
