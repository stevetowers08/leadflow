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

  // Get current user and profile (real or mock)
  const currentUser = user || (bypassAuth ? getMockUser() : null);
  const currentUserProfile =
    userProfile || (bypassAuth ? getMockUserProfile() : null);

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

