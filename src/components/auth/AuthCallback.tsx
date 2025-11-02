'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev) {
          console.log('🔄 AuthCallback component mounted');
        }

        // Check for auth errors in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (error) {
          if (isDev) {
            console.error('❌ Auth error in URL:', error, errorDescription);
          }
          setErrorMessage(
            errorDescription || error || 'Authentication failed'
          );
          setStatus('error');
          return;
        }

        // Get the session from the hash fragment
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken) {
          if (isDev) {
            console.log('✅ Access token found in hash');
          }

          // Set the session manually
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('❌ Error setting session:', sessionError);
            setErrorMessage(sessionError.message);
            setStatus('error');
            return;
          }

          if (data.session) {
            console.log('✅ Session set successfully');
            setStatus('success');

            // Refresh user profile
            await refreshProfile();

            // Small delay to ensure auth context is updated
            await new Promise(resolve => setTimeout(resolve, 500));

            // Redirect to dashboard
            router.push('/');
          } else {
            console.log('⚠️ No session found');
            setErrorMessage('No session found after OAuth callback');
            setStatus('error');
          }
        } else {
          // Try to get session from Supabase (might already be set)
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            console.log('✅ Session already exists');
            setStatus('success');
            await refreshProfile();
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push('/');
          } else {
            console.log('⚠️ No session found');
            setErrorMessage('No session found after OAuth callback');
            setStatus('error');
          }
        }
      } catch (error) {
        console.error('❌ Unexpected error in auth callback:', error);
        setErrorMessage(
          error instanceof Error ? error.message : 'An unexpected error occurred'
        );
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [router, refreshProfile]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mb-4'>
            <svg
              className='mx-auto h-12 w-12 text-green-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Authentication Successful
          </h2>
          <p className='text-gray-600 mb-6'>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center max-w-md mx-auto p-6'>
        <div className='mb-4'>
          <svg
            className='mx-auto h-12 w-12 text-red-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Authentication Failed
        </h2>
        <p className='text-gray-600 text-sm mb-6'>{errorMessage}</p>
        <button
          onClick={() => router.push('/')}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AuthCallback;
