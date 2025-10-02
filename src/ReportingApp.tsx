import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { AIProvider } from "@/contexts/AIContext";
import { ConfirmationProvider } from "@/contexts/ConfirmationContext";
import { MinimalLayout } from "@/components/layout/MinimalLayout";
import { useAuth } from "@/contexts/AuthContext";
import Reporting from "@/pages/Reporting";

// Create a separate query client for the reporting app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const ReportingRoutes = () => {
  const { user, loading } = useAuth();
  const { userProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sidebar-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reporting dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <PermissionsProvider user={user} userProfile={userProfile} authLoading={loading}>
      <AIProvider>
        <ConfirmationProvider>
          <MinimalLayout>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sidebar-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading reporting data...</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Reporting />} />
                <Route path="/reporting" element={<Reporting />} />
                {/* Redirect any other routes to reporting */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </MinimalLayout>
        </ConfirmationProvider>
      </AIProvider>
    </PermissionsProvider>
  );
};

const ReportingApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ReportingRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default ReportingApp;
