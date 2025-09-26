import React, { useState, useEffect } from 'react';

const IndexDebug = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const info: string[] = [];
    
    try {
      info.push('✅ Component mounted');
      info.push('✅ React is working');
      
      // Test if we can access window
      if (typeof window !== 'undefined') {
        info.push('✅ Window object available');
      }
      
      // Test if we can access document
      if (typeof document !== 'undefined') {
        info.push('✅ Document object available');
      }
      
      // Test if we can access localStorage
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        info.push('✅ LocalStorage working');
      } catch (e) {
        info.push('❌ LocalStorage error: ' + e);
      }
      
      setDebugInfo(info);
    } catch (error) {
      info.push('❌ Error in useEffect: ' + error);
      setDebugInfo(info);
    }
  }, []);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Debug Page</h1>
      <div className="space-y-2">
        {debugInfo.map((info, index) => (
          <div key={index} className="text-sm font-mono">
            {info}
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Browser Info:</h2>
        <p>User Agent: {navigator.userAgent}</p>
        <p>URL: {window.location.href}</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
};

export default IndexDebug;
