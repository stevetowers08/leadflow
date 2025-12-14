'use client';

import { Suspense } from 'react';
import IntegrationCallbackClient from './IntegrationCallbackClient';

// Prevent static generation - this route requires AuthProvider context at runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const dynamicParams = true;

function IntegrationCallbackWrapper() {
  return <IntegrationCallbackClient />;
}

export default function IntegrationCallbackPage() {
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
      <IntegrationCallbackWrapper />
    </Suspense>
  );
}
