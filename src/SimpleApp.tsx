import React from "react";

const SimpleApp = () => {
  console.log('🚀 SimpleApp rendering...');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple App Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ background: '#e6f3ff', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
        <strong>Status:</strong> App is rendering successfully
      </div>
    </div>
  );
};

export default SimpleApp;
