'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { secureGmailService } from '../services/secureGmailService';

export const GmailCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [error, setError] = useState<string | null>(null);

  const handleGmailCallback = useCallback(
    async (code: string) => {
      try {
        setStatus('loading');
        await secureGmailService.handleGmailCallback(code);
        setStatus('success');

        // Redirect to communications page
        router.push('/crm/communications');
      } catch (error) {
        setStatus('error');
        setError(
          error instanceof Error ? error.message : 'Authentication failed'
        );
      }
    },
    [router]
  );

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setError(error);
        return;
      }

      if (code) {
        await handleGmailCallback(code);
      } else {
        setStatus('error');
        setError('No authorization code received');
      }
    };

    processCallback();
  }, [searchParams, handleGmailCallback]);

  const handleRetry = () => {
    router.push('/crm/communications');
  };

  // Minimal loading state
  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Connecting Gmail...</p>
        </div>
      </div>
    );
  }

  // Success state
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
            Gmail Connected
          </h2>
          <p className='text-gray-600 mb-6'>Redirecting to communications...</p>
        </div>
      </div>
    );
  }

  // Error state
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
          Connection Failed
        </h2>
        <p className='text-gray-600 text-sm mb-6'>{error}</p>
        <button
          onClick={handleRetry}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Go to Communications
        </button>
      </div>
    </div>
  );
};
