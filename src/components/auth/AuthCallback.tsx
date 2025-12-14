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
        const errorCode = urlParams.get('error_code');

        if (error) {
          if (isDev) {
            console.error(
              '❌ Auth error in URL:',
              error,
              errorCode,
              errorDescription
            );
          }

          // Handle specific error cases
          if (errorCode === 'bad_oauth_state') {
            // Clear any stale auth state and prompt user to retry
            await supabase.auth.signOut();
            localStorage.removeItem(
              'sb-' +
                process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split(
                  '.'
                )[0] +
                '-auth-token'
            );
            sessionStorage.clear();

            setErrorMessage(
              'Authentication session expired or invalid. Please try signing in again.'
            );
          } else {
            setErrorMessage(
              errorDescription || error || 'Authentication failed'
            );
          }
          setStatus('error');
          return;
        }

        // PKCE Flow: Supabase uses PKCE by default when redirectTo is provided
        // This is the secure, modern OAuth flow (implicit flow is deprecated)
        const code = urlParams.get('code');
        if (code) {
          if (isDev) {
            console.log(
              '✅ Authorization code found - exchanging via API route (PKCE flow)...'
            );
          }

          // Exchange code for session via API route (server-side for security)
          try {
            const response = await fetch('/api/auth/exchange-code', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code }),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
              console.error(
                '❌ Error exchanging code for session:',
                result.error
              );
              setErrorMessage(
                result.error || 'Failed to exchange code for session'
              );
              setStatus('error');
              return;
            }

            if (result.success) {
              console.log('✅ Session created successfully via PKCE flow');
              setStatus('success');

              // Refresh user profile
              await refreshProfile();

              // Small delay to ensure auth context is updated
              await new Promise(resolve => setTimeout(resolve, 500));

              // Redirect to dashboard
              router.push('/');
              return;
            }
          } catch (fetchError) {
            console.error('❌ Error calling exchange-code API:', fetchError);
            setErrorMessage(
              fetchError instanceof Error
                ? fetchError.message
                : 'Failed to exchange authorization code'
            );
            setStatus('error');
            return;
          }
        }

        // Fallback: Check for tokens in hash fragment (deprecated implicit flow)
        // This should NOT happen if redirectTo is properly configured, but we handle it as a fallback
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken) {
          if (isDev) {
            console.warn(
              '⚠️ WARNING: Tokens found in hash fragment (implicit flow). This is deprecated.'
            );
            console.warn(
              '⚠️ Supabase should use PKCE flow (code in query params) when redirectTo is provided.'
            );
            console.warn(
              '⚠️ Check your Supabase configuration - this should not happen in normal operation.'
            );
          }

          // Set the session manually (fallback only)
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('❌ Error setting session from hash:', sessionError);
            setErrorMessage(sessionError.message);
            setStatus('error');
            return;
          }

          if (data.session) {
            console.log('✅ Session set from hash fragment (fallback)');
            setStatus('success');
            await refreshProfile();
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push('/');
            return;
          }
        }

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
          setErrorMessage(
            'No session found after OAuth callback. Please try signing in again.'
          );
          setStatus('error');
        }
      } catch (error) {
        console.error('❌ Unexpected error in auth callback:', error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
        );
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [router, refreshProfile]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-muted'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-muted'>
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
          <h2 className='text-2xl font-bold text-foreground mb-2'>
            Authentication Successful
          </h2>
          <p className='text-muted-foreground mb-6'>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-muted'>
      <div className='text-center max-w-md mx-auto p-6'>
        <div className='mb-4'>
          <svg
            className='mx-auto h-12 w-12 text-destructive'
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
        <h2 className='text-2xl font-bold text-foreground mb-2'>
          Authentication Failed
        </h2>
        <p className='text-muted-foreground text-sm mb-6'>{errorMessage}</p>
        <div className='flex gap-3 justify-center'>
          <button
            onClick={() => {
              // Clear auth state and redirect to home to retry
              supabase.auth.signOut().then(() => {
                router.push('/');
              });
            }}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className='px-4 py-2 bg-gray-200 text-foreground rounded-md hover:bg-gray-300 transition-colors'
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
