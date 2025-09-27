import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { PopupProvider } from "./contexts/PopupContext";
import { Layout } from "./components/Layout";
import { UnifiedPopup } from "./components/UnifiedPopup";
import { AuthPage } from "./components/auth/AuthPage";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import TestJobsPage from "./TestJobsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const TestAppGradualContent = () => {
  const { user, loading } = useAuth();

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

  // This will be replaced by the Index page
  return null;
};

const TestAppGradual = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <PermissionsProvider user={null} userProfile={null} authLoading={false}>
              <SidebarProvider>
                <PopupProvider>
                  <Layout>
                    <div className="p-8">
                      <h1 className="text-2xl font-bold mb-4">🧪 Testing Simplified Jobs Page</h1>
                      <TestJobsPage />
                    </div>
                    <UnifiedPopup />
                  </Layout>
                </PopupProvider>
              </SidebarProvider>
            </PermissionsProvider>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default TestAppGradual;
