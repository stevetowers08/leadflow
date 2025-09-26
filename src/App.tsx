import React, { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { PopupProvider } from "./contexts/PopupContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PopupErrorBoundary } from "./components/PopupErrorBoundary";
import { AuthPage } from "./components/auth/AuthPage";
import { Toaster } from "@/components/ui/sonner";
import { usePopupKeyboardShortcuts } from "@/hooks/usePopupKeyboardShortcuts";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { initializeBrowserCompatibility } from "@/utils/browserCompatibility";

// Lazy load modal manager for better performance
const ModalManager = lazy(() => import("./components/modals/ModalManager").then(module => ({ default: module.ModalManager })));

// Component to handle popup keyboard shortcuts
const PopupKeyboardShortcuts = () => {
  usePopupKeyboardShortcuts();
  return null;
};

// Pages
import Index from "./pages/Index";
import TestPage from "./pages/TestPage";
import IndexDebug from "./pages/IndexDebug";
import Pipeline from "./pages/Pipeline";
import Leads from "./pages/Leads";
import Companies from "./pages/Companies";
import Jobs from "./pages/Jobs";
import Reporting from "./pages/Reporting";
import Automations from "./pages/Automations";
import Settings from "./pages/Settings";
import PersonalSettings from "./pages/PersonalSettings";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import Admin from "./pages/Admin";
import { ConversationsPage } from "./pages/Conversations";
import TouchAndAccessibilityTestPage from "./pages/TouchAndAccessibilityTestPage";
import DataTest from "./components/DataTest";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AuthenticatedApp = () => {
  // TEMPORARY: Skip auth context usage
  console.log('🔍 AuthenticatedApp rendering - bypassing auth context');
  
  // Mock user data for testing
  const mockUser = {
    id: 'f100f6bc-22d8-456f-bcce-44c7881b68ef',
    email: 'stevetowers08@gmail.com',
    user_metadata: {
      full_name: 'Steve Towers',
      name: 'Steve Towers'
    },
    aud: 'authenticated',
    role: 'authenticated'
  };
  
  const mockUserProfile = {
    id: 'f100f6bc-22d8-456f-bcce-44c7881b68ef',
    email: 'stevetowers08@gmail.com',
    full_name: 'Steve Towers',
    role: 'owner',
    user_limit: 1000,
    is_active: true
  };
  
  return (
    <SidebarProvider>
      <PermissionsProvider user={mockUser} userProfile={mockUserProfile} authLoading={false}>
        <PopupProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<IndexDebug />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="/conversations" element={<ConversationsPage />} />
              <Route path="/reporting" element={<Reporting />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/tests/touch-accessibility" element={<TouchAndAccessibilityTestPage />} />
              <Route path="/test-data" element={<DataTest />} />
            </Routes>
            <PopupErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <ModalManager />
              </Suspense>
            </PopupErrorBoundary>
            {/* <PopupKeyboardShortcuts /> */}
          </Layout>
        </PopupProvider>
      </PermissionsProvider>
    </SidebarProvider>
  );
};

const AppContent = () => {
  // TEMPORARY: Skip auth check entirely
  console.log('🔍 AppContent rendering - bypassing auth');
  return <AuthenticatedApp />;
};

const App = () => {
  console.log('🚀 App component mounted');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;