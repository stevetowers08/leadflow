import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('🚀 Empowr CRM starting...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error("Root element not found");
}

console.log('✅ Root element found, creating React root...');
const root = createRoot(rootElement);
console.log('✅ React root created, rendering App...');

// Full CRM Application - FIXED!
root.render(<App />);
console.log('✅ Full CRM App with FIXED DataTable rendered successfully');
