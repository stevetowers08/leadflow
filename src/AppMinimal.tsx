import React, { useEffect, useState } from 'react';

const AppMinimal = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  useEffect(() => {
    const info: string[] = [];
    
    try {
      info.push('🚀 AppMinimal mounted');
      info.push('✅ React is working');
      info.push('✅ useEffect is working');
      
      // Test basic browser APIs
      if (typeof window !== 'undefined') {
        info.push('✅ Window object available');
        info.push(`📍 URL: ${window.location.href}`);
        info.push(`🌐 User Agent: ${navigator.userAgent.substring(0, 50)}...`);
      }
      
      if (typeof document !== 'undefined') {
        info.push('✅ Document object available');
        info.push(`📄 Title: ${document.title}`);
      }
      
      // Test localStorage
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        info.push('✅ LocalStorage working');
      } catch (e) {
        info.push(`❌ LocalStorage error: ${e}`);
      }
      
      // Test sessionStorage
      try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
        info.push('✅ SessionStorage working');
      } catch (e) {
        info.push(`❌ SessionStorage error: ${e}`);
      }
      
      // Test console
      console.log('✅ Console is working');
      info.push('✅ Console is working');
      
      setDebugInfo(info);
    } catch (error) {
      console.error('❌ Error in AppMinimal:', error);
      info.push(`❌ Error: ${error}`);
      setDebugInfo(info);
    }
  }, []);

  console.log('🚀 AppMinimal rendering');
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>🔍 Minimal App Debug Test</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#666', marginBottom: '15px' }}>System Status:</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          {debugInfo.map((info, index) => (
            <div key={index} style={{ 
              marginBottom: '5px',
              color: info.includes('❌') ? '#d32f2f' : info.includes('✅') ? '#2e7d32' : '#333'
            }}>
              {info}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#666', marginBottom: '15px' }}>Basic Info:</h2>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
        <p><strong>React Version:</strong> {React.version}</p>
        <p><strong>Current Time:</strong> {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AppMinimal;
