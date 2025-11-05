'use client';

import { Suspense } from 'react';
import AuthCallback from '@/components/auth/AuthCallback';
import { useSearchParams } from 'next/navigation';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  // If there's an error from the route handler, show it
  if (error && message) {
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
          <p className='text-gray-600 text-sm mb-6'>{message}</p>
          <button
            onClick={() => (window.location.href = '/')}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, use the client component for hash-based (implicit) flow
  return <AuthCallback />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
