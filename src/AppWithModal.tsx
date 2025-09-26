import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { PopupProvider } from "./contexts/PopupContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PopupErrorBoundary } from "./components/PopupErrorBoundary";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Toaster } from "@/components/ui/sonner";

// Import only the Index page first
import Index from "./pages/Index";

// Lazy load modal manager for better performance
const ModalManager = lazy(() => import("./components/modals/ModalManager").then(module => ({ default: module.ModalManager })));

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

const AppWithModal = () => {
  console.log('🚀 AppWithModal rendering');
  
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
                      <Route path="/" element={<Index />} />
                    </Routes>
                    <PopupErrorBoundary>
                      <Suspense fallback={<LoadingSpinner />}>
                        <ModalManager />
                      </Suspense>
                    </PopupErrorBoundary>
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

export default AppWithModal;
