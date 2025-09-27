import React from "react";

const MinimalDiagnostic = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>
          🔍 Minimal Diagnostic
        </h1>
        
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#374151', marginBottom: '10px' }}>Status</h2>
          <p style={{ color: '#6b7280' }}>✅ React is working</p>
          <p style={{ color: '#6b7280' }}>✅ Component is rendering</p>
          <p style={{ color: '#6b7280' }}>✅ No AuthContext dependency</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#374151', marginBottom: '10px' }}>Next Steps</h2>
          <p style={{ color: '#6b7280' }}>If you can see this, the issue is with:</p>
          <ul style={{ color: '#6b7280', marginLeft: '20px' }}>
            <li>AuthContext</li>
            <li>Supabase client</li>
            <li>One of the imported components</li>
          </ul>
        </div>

        <button 
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={() => alert('Button works!')}
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

export default MinimalDiagnostic;
