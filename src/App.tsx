import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import {
  useGlobalErrorHandler,
  usePerformanceMonitoring,
} from './hooks/useGlobalErrorHandler';
import { initializeConsoleFilter } from './utils/consoleFilter';
import {
  initializeErrorHandling,
  setupGlobalErrorHandlers,
} from './utils/globalErrorHandlers';

import { ErrorBoundaryProvider } from './components/ErrorBoundary';
import { GmailCallback } from './components/GmailCallback';
import AuthCallback from './components/auth/AuthCallback';
import { AuthPage } from './components/auth/AuthPage';
import { Layout } from './components/layout/Layout';
import {
  getAuthConfig,
  getMockUser,
  getMockUserProfile,
  shouldBypassAuth,
} from './config/auth';
import { AIProvider } from './contexts/AIContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConfirmationProvider } from './contexts/ConfirmationContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { PermissionsProvider } from './contexts/PermissionsContext';
import { SearchProvider } from './contexts/SearchContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { LoggingProvider } from './utils/enhancedLogger';
import { PerformanceProvider } from './utils/performanceMonitoring';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GettingStarted = lazy(() => import('./pages/GettingStarted'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const Jobs = lazy(() => import('./pages/Jobs'));
const People = lazy(() => import('./pages/People'));
const Companies = lazy(() => import('./pages/Companies'));
const Pipeline = lazy(() => import('./pages/Pipeline'));
const ConversationsPage = lazy(() => import('./pages/Conversations'));
const CommunicationsPage = lazy(() => import('./pages/CommunicationsPage'));
const Reporting = lazy(() => import('./pages/Reporting'));
const Settings = lazy(() => import('./pages/Settings'));
const TabDesignsPage = lazy(() => import('./pages/TabDesignsPage'));
const SidebarColorOptions = lazy(() => import('./pages/SidebarColorOptions'));
const JobFilteringSettingsPage = lazy(
  () => import('./pages/JobFilteringSettingsPage')
);
const Campaigns = lazy(() => import('./pages/Campaigns'));
const CampaignSequenceBuilderPage = lazy(
  () => import('./pages/CampaignSequenceBuilderPage')
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes for stable data
      retry: 3, // More retries for better UX
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const AppRoutes = () => {
  // Enable error logging and performance monitoring
  useGlobalErrorHandler();
  usePerformanceMonitoring();

  const { user, userProfile, loading } = useAuth();
  const authConfig = getAuthConfig();
  const bypassAuth = shouldBypassAuth();

  // Debug logging
  console.log('🔍 Auth Debug:', {
    user: !!user,
    userProfile: !!userProfile,
    loading,
    authConfig,
    bypassAuth,
    nodeEnv: import.meta.env.NODE_ENV,
    viteBypassAuth: import.meta.env.VITE_BYPASS_AUTH,
  });

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

  // Authentication check - only enforce if not bypassing
  if (!bypassAuth && !user) {
    return <AuthPage />;
  }

  // Get current user and profile (real or mock)
  const currentUser = user || (bypassAuth ? getMockUser() : null);
  const currentUserProfile =
    userProfile || (bypassAuth ? getMockUserProfile() : null);

  // If we're bypassing auth but still don't have a user, something is wrong
  if (bypassAuth && !currentUser) {
    console.error('❌ Auth bypass enabled but no user available');
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
      authLoading={false}
    >
      <AIProvider>
        <ConfirmationProvider>
          <SidebarProvider>
            <SearchProvider>
              <Layout>
                <Suspense
                  fallback={
                    <div className='min-h-screen flex items-center justify-center'>
                      <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sidebar-primary mx-auto mb-4'></div>
                        <p className='text-muted-foreground'>Loading page...</p>
                      </div>
                    </div>
                  }
                >
                  <Routes>
                    <Route path='/' element={<Dashboard />} />
                    <Route
                      path='/getting-started'
                      element={<GettingStarted />}
                    />
                    <Route path='/about' element={<AboutPage />} />
                    <Route path='/auth/callback' element={<AuthCallback />} />
                    <Route
                      path='/auth/gmail-callback'
                      element={<GmailCallback />}
                    />
                    <Route path='/jobs' element={<Jobs />} />
                    <Route path='/people' element={<People />} />
                    <Route path='/companies' element={<Companies />} />
                    <Route path='/pipeline' element={<Pipeline />} />
                    <Route
                      path='/conversations'
                      element={<ConversationsPage />}
                    />
                    <Route
                      path='/crm/communications'
                      element={<CommunicationsPage />}
                    />
                    <Route path='/reporting' element={<Reporting />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/tab-designs' element={<TabDesignsPage />} />
                    <Route
                      path='/sidebar-colors'
                      element={<SidebarColorOptions />}
                    />
                    <Route
                      path='/settings/job-filtering'
                      element={<JobFilteringSettingsPage />}
                    />
                    <Route path='/campaigns' element={<Campaigns />} />
                    <Route
                      path='/campaigns/sequence/:id'
                      element={<CampaignSequenceBuilderPage />}
                    />
                  </Routes>
                </Suspense>
              </Layout>
            </SearchProvider>
          </SidebarProvider>
        </ConfirmationProvider>
      </AIProvider>
    </PermissionsProvider>
  );
};

const App = () => {
  useEffect(() => {
    // Initialize console filtering to suppress browser extension noise
    initializeConsoleFilter();

    // Initialize error handling system
    const initErrorHandling = async () => {
      try {
        // Get admin email from environment or user profile
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        await initializeErrorHandling(adminEmail);
        setupGlobalErrorHandlers();
      } catch (error) {
        console.error('Failed to initialize error handling:', error);
      }
    };

    initErrorHandling();
  }, []);

  return (
    <ErrorBoundaryProvider>
      <LoggingProvider>
        <PerformanceProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <OnboardingProvider>
                  <AppRoutes />
                  <Toaster />
                </OnboardingProvider>
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </PerformanceProvider>
      </LoggingProvider>
    </ErrorBoundaryProvider>
  );
};

export default App;
// Test comment
