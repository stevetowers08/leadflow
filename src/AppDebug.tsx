import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { PopupProvider } from "./contexts/PopupContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Toaster } from "@/components/ui/sonner";

// Simple test page
const TestPage = () => (
  <div style={{ padding: '20px' }}>
    <h1>Test Page</h1>
    <p>If you can see this, the app is working!</p>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppDebug = () => {
  console.log('🚀 AppDebug rendering');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <SidebarProvider>
              <PermissionsProvider user={null} userProfile={null} authLoading={false}>
                <PopupProvider>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<TestPage />} />
                    </Routes>
                    {/* Temporarily remove ModalManager to isolate the issue */}
                  </Layout>
                </PopupProvider>
              </PermissionsProvider>
            </SidebarProvider>
          </AuthProvider>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default AppDebug;
