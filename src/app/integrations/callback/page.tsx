'use client';

import { Suspense } from 'react';
import IntegrationCallbackClient from './IntegrationCallbackClient';

// Prevent static generation - this route requires AuthProvider context at runtime
export const dynamic = 'force-dynamic';

function IntegrationCallbackWrapper() {
  return <IntegrationCallbackClient />;
}

export default function IntegrationCallbackPage() {
  return (
    <Suspense fallback={
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    }>
      <IntegrationCallbackWrapper />
    </Suspense>
  );
}
