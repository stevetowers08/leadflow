'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
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
import { AuthPage } from '@/components/auth/AuthPage';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { PermissionsProvider } from '@/contexts/PermissionsContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { SlidePanelProvider } from '@/contexts/SlidePanelContext';
import { LoggingProvider } from '@/utils/enhancedLogger';
import { PerformanceProvider } from '@/utils/performanceMonitoring';
import { useClientId } from '@/hooks/useClientId';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes for stable data
      retry: 3, // More retries for better UX
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
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

// Client Guard: Ensures authenticated users have a client_id (multi-tenant requirement)
// Following industry best practices: redirect to sign-in when tenant context is missing
// Account setup must be done by owner/admin before user can access the app
function ClientGuard({ children }: { children: React.ReactNode }) {
  const { user, signOut, loading: authLoading } = useAuth();
  const { data: clientId, isLoading: clientIdLoading } = useClientId();
  const bypassAuth = shouldBypassAuth();

  // If no client_id and auth is complete, automatically sign out and redirect to sign-in
  // Industry best practice: Missing tenant context requires re-authentication
  // (Similar to Salesforce/HubSpot: organization context is required)
  // User must be set up by admin/owner first
  const hasTriggeredSignOut = React.useRef(false);

  useEffect(() => {
    // Prevent multiple sign-out calls
    if (hasTriggeredSignOut.current) return;

    if (
      !bypassAuth &&
      !authLoading &&
      !clientIdLoading &&
      user &&
      !clientId
    ) {
      // User authenticated but missing client_id - sign out automatically
      // Admin/owner must set up the account first
      hasTriggeredSignOut.current = true;
      console.warn(
        'User authenticated but missing client_id. Redirecting to sign-in.'
      );
      signOut();
    }
  }, [user, clientId, authLoading, clientIdLoading, bypassAuth, signOut]);

  // Reset sign-out flag if user gets a clientId or user changes
  useEffect(() => {
    if (clientId || !user) {
      hasTriggeredSignOut.current = false;
    }
  }, [clientId, user]);

  // Show loading while checking client_id (must be after all hooks)
  if (!bypassAuth && user && (authLoading || clientIdLoading)) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-muted'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sidebar-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Verifying account setup...</p>
        </div>
      </div>
    );
  }

  // Show message while signing out (must be after all hooks)
  if (!bypassAuth && user && !clientId && !authLoading && !clientIdLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-muted px-4'>
        <div className='text-center max-w-md w-full'>
          <div className='bg-white rounded-lg shadow-lg p-8'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sidebar-primary/10'>
              <svg
                className='h-6 w-6 text-sidebar-primary'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            </div>
            <h2 className='text-xl font-semibold text-foreground mb-2'>
              Account Setup Required
            </h2>
            <p className='text-muted-foreground text-sm'>
              Your account needs to be linked to an organization by an admin
              before you can access the application. Please contact your account
              administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Wrapper component to provide PermissionsProvider with auth data
function PermissionsWrapper({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading } = useAuth();
  const bypassAuth = shouldBypassAuth();

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

  // Redirect to sign-in if no user and not bypassing
  if (!bypassAuth && !user) {
    return <AuthPage />;
  }

  // Get current user and profile (real or mock)
  const currentUser = user || (bypassAuth ? getMockUser() : null);
  const currentUserProfile =
    userProfile || (bypassAuth ? getMockUserProfile() : null);

  // If we're bypassing auth but still don't have a user, something is wrong
  if (bypassAuth && !currentUser) {
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
      user={currentUser}
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
              <PermissionsWrapper>
                <OnboardingProvider>
                  <SlidePanelProvider>
                    <SearchProvider>
                      <AppInitialization>
                        {children}
                        <Toaster />
                      </AppInitialization>
                    </SearchProvider>
                  </SlidePanelProvider>
                </OnboardingProvider>
              </PermissionsWrapper>
            </AuthProvider>
          </QueryClientProvider>
        </PerformanceProvider>
      </LoggingProvider>
    </ErrorBoundaryProvider>
  );
}

