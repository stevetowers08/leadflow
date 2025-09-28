import { createRoot } from "react-dom/client";

console.log('🚀 Minimal React Test Starting...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error("Root element not found");
}

console.log('✅ Root element found');

const TestComponent = () => {
  console.log('✅ TestComponent rendering');
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🎉 Empowr CRM - WORKING!
      </h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        React is working! Environment variables:
      </p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'NOT SET'}</p>
        <p>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}</p>
        <p>VITE_GOOGLE_CLIENT_ID: {import.meta.env.VITE_GOOGLE_CLIENT_ID || 'NOT SET'}</p>
      </div>
    </div>
  );
};

console.log('✅ Creating React root...');
const root = createRoot(rootElement);
console.log('✅ Rendering TestComponent...');

root.render(<TestComponent />);
console.log('✅ TestComponent rendered successfully!');
