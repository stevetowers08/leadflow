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
import { UnifiedPopup } from './components/UnifiedPopup';
import AuthCallback from './components/auth/AuthCallback';
import { Layout } from './components/layout/Layout';
import { AIProvider } from './contexts/AIContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConfirmationProvider } from './contexts/ConfirmationContext';
import { PermissionsProvider } from './contexts/PermissionsContext';
import { PopupNavigationProvider } from './contexts/PopupNavigationContext';
import { SearchProvider } from './contexts/SearchContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { LoggingProvider } from './utils/enhancedLogger';
import { PerformanceProvider } from './utils/performanceMonitoring';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const Jobs = lazy(() => import('./pages/Jobs'));
const People = lazy(() => import('./pages/People'));
const Companies = lazy(() => import('./pages/Companies'));
const Pipeline = lazy(() => import('./pages/Pipeline'));
const ConversationsPage = lazy(() => import('./pages/Conversations'));
const Automations = lazy(() => import('./pages/Automations'));
const Reporting = lazy(() => import('./pages/Reporting'));
const Settings = lazy(() => import('./pages/Settings'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const TabDesignsPage = lazy(() => import('./pages/TabDesignsPage'));

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

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sidebar-primary mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Temporarily disabled for testing data loading
  // if (!user) {
  //   return <AuthPage />;
  // }

  // Temporary mock user for testing data loading
  const mockUser = user || {
    id: 'f100f6bc-22d8-456f-bcce-44c7881b68ef', // Dev bypass user ID
    email: 'test@example.com',
    user_metadata: {},
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    factors: [],
    identities: [],
    recovery_sent_at: null,
    new_email: null,
    invited_at: null,
    action_link: null,
    email_change_sent_at: null,
    new_phone: null,
    phone_change_sent_at: null,
    reauthentication_sent_at: null,
    reauthentication_token: null,
    is_anonymous: false,
  };

  const mockUserProfile = userProfile || {
    id: 'f100f6bc-22d8-456f-bcce-44c7881b68ef',
    email: 'test@example.com',
    full_name: 'Test User',
    role: 'owner',
    user_limit: 100,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <PermissionsProvider
      user={mockUser}
      userProfile={mockUserProfile}
      authLoading={loading}
    >
      <AIProvider>
        <ConfirmationProvider>
          <SidebarProvider>
            <SearchProvider>
              <PopupNavigationProvider>
                <Layout>
                  <Suspense
                    fallback={
                      <div className='min-h-screen flex items-center justify-center'>
                        <div className='text-center'>
                          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sidebar-primary mx-auto mb-4'></div>
                          <p className='text-gray-600'>Loading page...</p>
                        </div>
                      </div>
                    }
                  >
                    <Routes>
                      <Route path='/' element={<Dashboard />} />
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
                      <Route path='/campaigns' element={<Campaigns />} />
                      <Route
                        path='/conversations'
                        element={<ConversationsPage />}
                      />
                      <Route path='/automations' element={<Automations />} />
                      <Route path='/reporting' element={<Reporting />} />
                      <Route path='/settings' element={<Settings />} />
                      <Route path='/tab-designs' element={<TabDesignsPage />} />
                    </Routes>
                  </Suspense>
                </Layout>

                {/* Unified Popup System */}
                <Suspense fallback={null}>
                  <UnifiedPopup />
                </Suspense>
              </PopupNavigationProvider>
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
                <AppRoutes />
                <Toaster />
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
