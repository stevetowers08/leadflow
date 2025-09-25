import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageLoadingSpinner } from "./components/LoadingSpinner";
import { Toaster } from "@/components/ui/sonner";
import { useGlobalErrorHandler, usePerformanceMonitoring } from "./hooks/useGlobalErrorHandler";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

// Pages
import Index from "./pages/Index";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Simplified loading state to prevent flickering
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/reporting" element={<Reporting />} />
        <Route path="/settings" element={<PersonalSettings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <PermissionsProvider>
              <AppRoutes />
              <Toaster />
            </PermissionsProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;