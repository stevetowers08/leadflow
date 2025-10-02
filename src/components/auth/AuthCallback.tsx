import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 AuthCallback component mounted');
        console.log('Current URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        
        setStatus('loading');
        
        // Minimal delay for Supabase processing
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get the session
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Session data:', data);
        console.log('Session error:', error);
        
        if (error) {
          console.error('❌ Session error:', error);
          setErrorMessage(error.message);
          setStatus('error');
          return;
        }

        if (data.session) {
          console.log('✅ Session found:', {
            user: data.session.user?.email,
            provider: data.session.user?.app_metadata?.provider,
            userMetadata: data.session.user?.user_metadata
          });
          
          setStatus('success');
          
          // Clear the URL hash
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Instant redirect for seamless experience
          navigate('/');
        } else {
          console.log('⚠️ No session found');
          setErrorMessage('No session found after OAuth callback');
          setStatus('error');
        }
      } catch (error) {
        console.error('❌ Auth callback exception:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  // Minimal loading state - just a subtle indicator
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-sidebar-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-sidebar-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-sidebar-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  // Error state - minimal and clean
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 text-sm mb-6">
            {errorMessage}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-sidebar-primary text-white text-sm font-medium rounded-md hover:bg-sidebar-primary/90 transition-colors"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Success state - should rarely be seen due to instant redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm text-gray-600">Redirecting...</span>
      </div>
    </div>
  );
};

export default AuthCallback;
