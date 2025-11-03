'use client';

import dynamic from 'next/dynamic';

// Client Component wrapper for dynamic import with SSR disabled
// This ensures the component only loads on the client where providers exist
const SidebarColorOptions = dynamic(
  () => import('@/pages/SidebarColorOptions'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sidebar options...</p>
        </div>
      </div>
    )
  }
);

export default function SidebarColorsClient() {
  return <SidebarColorOptions />;
}




