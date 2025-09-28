import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const ModernSignIn: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle, signInWithLinkedIn } = useAuth();

  const handleGoogleSignIn = async () => {
    setLoading('google');
    setError(null);

    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(null);
    }
  };

  const handleLinkedInSignIn = async () => {
    setLoading('linkedin');
    setError(null);

    try {
      const { error } = await signInWithLinkedIn();
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error('LinkedIn sign-in error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          Welcome to Empowr CRM
        </h1>
        
        {error && (
          <div style={{ 
            color: 'red', 
            backgroundColor: '#ffe6e6', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading !== null}
            style={{
              padding: '12px 24px',
              backgroundColor: loading === 'google' ? '#ccc' : '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading === 'google' ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              width: '100%'
            }}
          >
            {loading === 'google' ? 'Signing in...' : 'Sign in with Google'}
          </button>
          
          <button 
            onClick={handleLinkedInSignIn}
            disabled={loading !== null}
            style={{
              padding: '12px 24px',
              backgroundColor: loading === 'linkedin' ? '#ccc' : '#0077B5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading === 'linkedin' ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              width: '100%'
            }}
          >
            {loading === 'linkedin' ? 'Signing in...' : 'Sign in with LinkedIn'}
          </button>
        </div>
        
        <p style={{ color: '#666', marginTop: '20px', fontSize: '14px' }}>
          Secure authentication powered by OAuth
        </p>
      </div>
    </div>
  );
};