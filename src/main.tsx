import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import SupabaseErrorBoundary from './components/diagnostics/SupabaseErrorBoundary.tsx';
import './index.css';
import './styles/hover-overflow-fixes.css';
import './styles/mobile.css';
import './styles/select-overrides.css';
import { logger } from './utils/logger';

// Defer non-critical imports to improve initial load
const initializeApp = async () => {
  logger.info('🚀 RECRUITEDGE starting...');

  // Only show environment debug info in development
  if (process.env.NODE_ENV === 'development') {
    logger.debug('🔍 Environment Debug Info:');
    logger.debug('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    logger.debug(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY:',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
    );
    logger.debug(
      'NEXT_PUBLIC_GOOGLE_CLIENT_ID:',
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    );
  }

  // Add global error handler
  window.addEventListener('error', event => {
    logger.error('🚨 Global Error:', event.error);
  });

  window.addEventListener('unhandledrejection', event => {
    logger.error('🚨 Unhandled Promise Rejection:', event.reason);
  });

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    logger.error('❌ Root element not found');
    throw new Error('Root element not found');
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
initializeApp().catch(error => {
  logger.error('❌ Failed to initialize app:', error);
});
