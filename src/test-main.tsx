import { createRoot } from "react-dom/client";

console.log('🚀 Minimal test starting...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error("Root element not found");
}

console.log('✅ Root element found');

// Simple test component
const TestApp = () => {
  console.log('✅ TestApp component rendering');
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🎉 Empowr CRM Test Page
      </h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        If you can see this, React is working!
      </p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>Environment Check:</h3>
        <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'NOT SET'}</p>
        <p>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}</p>
        <p>VITE_GOOGLE_CLIENT_ID: {import.meta.env.VITE_GOOGLE_CLIENT_ID || 'NOT SET'}</p>
      </div>
    </div>
  );
};

console.log('✅ Creating React root...');
const root = createRoot(rootElement);
console.log('✅ Rendering TestApp...');

root.render(<TestApp />);
console.log('✅ TestApp rendered successfully!');
