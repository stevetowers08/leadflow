import React from "react";
import { createRoot } from "react-dom/client";

// Ensure React is available globally for forwardRef and other React APIs
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

import ReportingApp from "./ReportingApp.tsx";
import SupabaseErrorBoundary from "./components/diagnostics/SupabaseErrorBoundary.tsx";
import { logger } from "./utils/logger";
import "./index.css";

// Defer non-critical imports to improve initial load
const initializeReportingApp = async () => {
  // Only load debug files in development
  if (import.meta.env.DEV) {
    await import("./debug-env.ts");
  }

  logger.info('📊 Empowr CRM Reporting Dashboard starting...');

  // Only show environment debug info in development
  if (import.meta.env.DEV) {
    logger.debug('🔍 Environment Debug Info:');
    logger.debug('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    logger.debug('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
    logger.debug('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
  }

  // Add global error handler
  window.addEventListener('error', (event) => {
    logger.error('🚨 Global Error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('🚨 Unhandled Promise Rejection:', event.reason);
  });

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    logger.error('❌ Root element not found');
    throw new Error("Root element not found");
  }

  logger.info('✅ Root element found, creating React root...');
  const root = createRoot(rootElement);
  logger.info('✅ React root created, rendering reporting dashboard...');

  // Reporting-only Application with Error Boundaries
  root.render(
    <SupabaseErrorBoundary>
      <ReportingApp />
    </SupabaseErrorBoundary>
  );
  logger.info('✅ Reporting Dashboard rendered successfully');
};

// Initialize reporting app asynchronously to improve initial paint
initializeReportingApp().catch((error) => {
  logger.error('❌ Failed to initialize reporting app:', error);
});

