import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import SupabaseErrorBoundary from "./components/SupabaseErrorBoundary.tsx";
import "./index.css";
import "./debug-env.ts";

console.log('🚀 Empowr CRM starting...');
console.log('🔍 Environment Debug Info:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('All env vars:', import.meta.env);

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('🚨 Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error("Root element not found");
}

console.log('✅ Root element found, creating React root...');
const root = createRoot(rootElement);
console.log('✅ React root created, rendering full CRM app...');

// Full CRM Application with Error Boundaries
root.render(
  <SupabaseErrorBoundary>
    <App />
  </SupabaseErrorBoundary>
);
console.log('✅ Full CRM App with error boundaries rendered successfully');
