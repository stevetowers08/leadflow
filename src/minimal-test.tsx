import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('🚀 Minimal React Test Starting...');
console.log('React version:', React.version);
console.log('React DOM available:', !!createRoot);

// Check for React DevTools conflicts
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('⚠️ React DevTools detected - this might cause conflicts');
} else {
  console.log('✅ No React DevTools detected');
}

// Check for multiple React instances
const reactInstances = [];
if (window.React) reactInstances.push('window.React');
if (window.ReactDOM) reactInstances.push('window.ReactDOM');
if (reactInstances.length > 0) {
  console.log('⚠️ Multiple React instances detected:', reactInstances);
} else {
  console.log('✅ No multiple React instances detected');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error('Root element not found');
}

const MinimalApp = () => {
  console.log('🎯 MinimalApp component rendering...');
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      padding: '20px'
    }}>
      <h1 style={{ color: '#4CAF50', fontSize: '2.5em', marginBottom: '20px' }}>
        ✅ Minimal React Test
      </h1>
      <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>
        React Version: {React.version}
      </p>
      <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>
        If you see this, React is working!
      </p>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'left',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px', color: '#555' }}>Debug Info:</h2>
        <pre style={{
          backgroundColor: '#eee',
          padding: '10px',
          borderRadius: '4px',
          overflowX: 'auto',
          fontSize: '0.9em'
        }}>
          React Version: {React.version}<br/>
          Environment: {import.meta.env.MODE}<br/>
          Build Time: {new Date().toISOString()}
        </pre>
        <p style={{ marginTop: '15px', fontSize: '0.9em', color: '#777' }}>
          Check browser console (F12) for detailed logs.
        </p>
      </div>
    </div>
  );
};

try {
  console.log('🔄 Creating React root...');
  const root = createRoot(rootElement);
  console.log('🔄 Rendering MinimalApp...');
  root.render(<MinimalApp />);
  console.log('✅ MinimalApp rendered successfully!');
} catch (error) {
  console.error('❌ Error rendering MinimalApp:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial;">
      <h1>Error Rendering React App</h1>
      <pre>${error}</pre>
    </div>
  `;
}