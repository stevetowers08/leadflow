import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { useGlobalErrorHandler, usePerformanceMonitoring } from "./hooks/useGlobalErrorHandler";
import { initializeErrorHandling, setupGlobalErrorHandlers } from "./utils/globalErrorHandlers";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { GmailCallback } from "./components/GmailCallback";
import { UnifiedPopup } from "./components/UnifiedPopup";
import AuthCallback from "./components/auth/AuthCallback";
import { AuthPage } from "./components/auth/AuthPage";
import { ModernLayout } from "./components/layout/ModernLayout";
import { AIProvider } from "./contexts/AIContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ConfirmationProvider } from "./contexts/ConfirmationContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { PopupNavigationProvider } from "./contexts/PopupNavigationContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { SearchProvider } from "./contexts/SearchContext";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Dashboard"));
const CRMInfo = lazy(() => import("./pages/CRMInfo"));
const Jobs = lazy(() => import("./pages/Jobs"));
const People = lazy(() => import("./pages/People"));
const Companies = lazy(() => import("./pages/Companies"));
const Pipeline = lazy(() => import("./pages/Pipeline"));
const ConversationsPage = lazy(() => import("./pages/Conversations"));
const Automations = lazy(() => import("./pages/Automations"));
const Reporting = lazy(() => import("./pages/Reporting"));
const Settings = lazy(() => import("./pages/Settings"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const TabDesignsShowcase = lazy(() => import("./pages/TabDesignsShowcase"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes for stable data
      retry: 3, // More retries for better UX
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sidebar-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <PermissionsProvider user={user} userProfile={userProfile} authLoading={loading}>
      <AIProvider>
        <ConfirmationProvider>
          <SidebarProvider>
            <SearchProvider>
              <PopupNavigationProvider>
                <ModernLayout>
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sidebar-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading page...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/crm-info" element={<CRMInfo />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/auth/gmail-callback" element={<GmailCallback />} />
                    <Route path="/test-callback" element={<div className="p-8"><h1>Test Callback Route Works!</h1></div>} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/people" element={<People />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/pipeline" element={<Pipeline />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/conversations" element={<ConversationsPage />} />
                    <Route path="/automations" element={<Automations />} />
                    <Route path="/reporting" element={<Reporting />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/tab-designs" element={<TabDesignsShowcase />} />
                  </Routes>
                </Suspense>
                </ModernLayout>
                
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;