import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Handling OAuth callback...');
        
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Auth callback error:', error);
          navigate('/?error=auth_callback_failed');
          return;
        }

        if (data.session) {
          console.log('✅ OAuth callback successful:', {
            user: data.session.user?.email,
            provider: data.session.user?.app_metadata?.provider
          });
          
          // Redirect to home page
          navigate('/');
        } else {
          console.log('⚠️ No session found in callback');
          navigate('/?error=no_session');
        }
      } catch (error) {
        console.error('❌ Auth callback exception:', error);
        navigate('/?error=auth_callback_exception');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
            <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Completing Sign In</h2>
          <p className="text-blue-700">
            Please wait while we complete your authentication...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
