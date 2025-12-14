'use client';

import dynamic from 'next/dynamic';

// Client Component wrapper for dynamic import with SSR disabled
// This ensures the component only loads on the client where AuthProvider exists
const IntegrationCallback = dynamic(
  () => import('@/components/integrations/IntegrationCallback'),
  {
    ssr: false,
    loading: () => (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    ),
  }
);

export default function IntegrationCallbackClient() {
  return <IntegrationCallback />;
}
