import React from "react";

const TestApp = () => {
  console.log('🚀 TestApp rendering...');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test App</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ background: '#e6f3ff', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
        <strong>Status:</strong> App is rendering successfully
      </div>
      <button onClick={() => console.log('Button clicked!')}>
        Test Button
      </button>
    </div>
  );
};

export default TestApp;
