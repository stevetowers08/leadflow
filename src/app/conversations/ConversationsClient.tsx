'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Client Component wrapper for dynamic import with SSR disabled
// This ensures the component only loads on the client where AuthProvider exists
// Using explicit ComponentType to avoid Next.js route inference issues
const ConversationsPageComponent = dynamic<ComponentType>(
  () => import('@/pages/Conversations').then(mod => ({ default: mod.default })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    )
  }
);

export default function ConversationsClient() {
  return <ConversationsPageComponent />;
}

