import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AppDebug from "./AppDebug.tsx";
import AppWithPages from "./AppWithPages.tsx";
import "./index.css";

console.log('🚀 main.tsx starting...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error("Root element not found");
}

console.log('✅ Root element found, creating React root...');
const root = createRoot(rootElement);
console.log('✅ React root created, rendering App...');
root.render(<AppWithPages />);
console.log('✅ App rendered');
