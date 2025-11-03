'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
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
      {children}
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

