import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { PopupProvider } from "./contexts/PopupContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Layout } from "./components/Layout";

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

const AppWithLayout = () => {
  console.log('🚀 AppWithLayout rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <PermissionsProvider user={null} userProfile={null} authLoading={false}>
              <PopupProvider>
                <Layout>
                  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                    <h1>App With Layout Test</h1>
                    <p>If you can see this, the Layout component is working!</p>
                    <p>Timestamp: {new Date().toISOString()}</p>
                  </div>
                </Layout>
              </PopupProvider>
            </PermissionsProvider>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default AppWithLayout;
