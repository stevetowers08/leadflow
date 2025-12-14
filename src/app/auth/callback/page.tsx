'use client';

import { Suspense } from 'react';
import AuthCallback from '@/components/auth/AuthCallback';

function AuthCallbackWrapper() {
  return <AuthCallback />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-muted'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-muted-foreground'>Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackWrapper />
    </Suspense>
  );
}
