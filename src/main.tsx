import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import SupabaseErrorBoundary from "./components/diagnostics/SupabaseErrorBoundary.tsx";
import "./index.css";
import { logger } from "./utils/logger";

// Defer non-critical imports to improve initial load
const initializeApp = async () => {
  // Only load debug files in development
  if (import.meta.env.DEV) {
    await import("./debug-env.ts");
  }

  logger.info('🚀 Empowr CRM starting...');

  // Only show environment debug info in development
  if (import.meta.env.DEV) {
    logger.debug('🔍 Environment Debug Info:');
    logger.debug('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    logger.debug('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
    logger.debug('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    logger.debug('All env vars:', import.meta.env);
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
  logger.info('✅ React root created, rendering full CRM app...');

  // Full CRM Application with Error Boundaries
  root.render(
    <SupabaseErrorBoundary>
      <App />
    </SupabaseErrorBoundary>
  );
  logger.info('✅ Full CRM App with error boundaries rendered successfully');
};

// Initialize app asynchronously to improve initial paint
initializeApp().catch((error) => {
  logger.error('❌ Failed to initialize app:', error);
});
