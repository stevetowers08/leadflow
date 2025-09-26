import React from 'react';

const IndexSimple = () => {
  console.log('🚀 IndexSimple rendering');
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Index Simple Test</h1>
      <p>If you can see this, the Index page is working!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
};

export default IndexSimple;
