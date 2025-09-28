import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import SupabaseErrorBoundary from "./components/SupabaseErrorBoundary.tsx";
import "./index.css";
import "./debug-env.ts";

console.log('🚀 Empowr CRM starting...');

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
