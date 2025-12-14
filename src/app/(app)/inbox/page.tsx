'use client';

// Moved from /conversations - PDR Section 5.4: Unified Inbox
// Future enhancement: Consider ResizablePanelGroup split view (Threads 30% + Chat 70%)
import dynamicImport from 'next/dynamic';

const ConversationsClient = dynamicImport(
  () => import('@/components/pages/Conversations'),
  {
    ssr: false,
    loading: () => (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading inbox...</p>
        </div>
      </div>
    ),
  }
);

export const dynamic = 'force-dynamic';

export default function InboxPage() {
  return <ConversationsClient />;
}
