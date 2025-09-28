import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useGlobalErrorHandler, usePerformanceMonitoring } from "./hooks/useGlobalErrorHandler";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { PopupProvider } from "./contexts/PopupContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { UnifiedPopup } from "./components/UnifiedPopup";
import { AuthPage } from "./components/auth/AuthPage";

// Pages
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Leads from "./pages/Leads";
import Companies from "./pages/Companies";
import Pipeline from "./pages/Pipeline";
import { ConversationsPage } from "./pages/Conversations";
import Automations from "./pages/Automations";
import Reporting from "./pages/Reporting";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
      <SidebarProvider>
        <PopupProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/conversations" element={<ConversationsPage />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="/reporting" element={<Reporting />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
            <UnifiedPopup />
          </Layout>
        </PopupProvider>
      </SidebarProvider>
    </PermissionsProvider>
  );
};

const App = () => {
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