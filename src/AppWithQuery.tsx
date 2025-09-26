import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

const AppWithQuery = () => {
  console.log('🚀 AppWithQuery rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1>App With Query Test</h1>
          <p>If you can see this, React Query is working!</p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default AppWithQuery;
