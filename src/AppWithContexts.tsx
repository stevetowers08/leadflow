import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { PopupProvider } from "./contexts/PopupContext";
import { SidebarProvider } from "./contexts/SidebarContext";

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

const AppWithContexts = () => {
  console.log('🚀 AppWithContexts rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <PermissionsProvider user={null} userProfile={null} authLoading={false}>
              <PopupProvider>
                <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                  <h1>App With Contexts Test</h1>
                  <p>If you can see this, all context providers are working!</p>
                  <p>Timestamp: {new Date().toISOString()}</p>
                </div>
              </PopupProvider>
            </PermissionsProvider>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default AppWithContexts;
