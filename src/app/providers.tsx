'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
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
import { LoggingProvider } from '@/utils/enhancedLogger';
import { PerformanceProvider } from '@/utils/performanceMonitoring';
import { useClientId } from '@/hooks/useClientId';
import { OAuthRedirectHandler } from '@/components/auth/OAuthRedirectHandler';

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
        console.error('Failed to initialize error handling:', error);
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

  // Check if user explicitly signed out in bypass mode
  const bypassDisabled =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('bypass-auth-disabled') === 'true' ||
        localStorage.getItem('bypass-auth-disabled') === 'true'
      : false;

  // Show loading state while checking auth (only if not bypassing)
  if (loading && !bypassAuth) {
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
  if (!bypassAuth && !user) {
    return <AuthPage />;
  }

  // Get current user and profile (real or mock)
  // Only use mock user if bypass is enabled AND not disabled by sign-out
  const shouldUseMock = bypassAuth && !bypassDisabled;
  const currentUser = user || (shouldUseMock ? getMockUser() : null);
  const currentUserProfile =
    userProfile || (shouldUseMock ? getMockUserProfile() : null);

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
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <OrganizationProvider>
                <PermissionsWrapper>
                  <OnboardingProvider>
                    <SlidePanelProvider>
                      <SearchProvider>
                        <AppInitialization>
                          <OAuthRedirectHandler />
                          {children}
                          <Toaster />
                        </AppInitialization>
                      </SearchProvider>
                    </SlidePanelProvider>
                  </OnboardingProvider>
                </PermissionsWrapper>
              </OrganizationProvider>
            </AuthProvider>
          </QueryClientProvider>
        </PerformanceProvider>
      </LoggingProvider>
    </ErrorBoundaryProvider>
  );
}
