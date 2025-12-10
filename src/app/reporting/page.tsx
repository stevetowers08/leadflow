// (DELETE) - Redirecting to new /analytics route
// This route is kept for backward compatibility but redirects to /analytics

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ReportingPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/analytics');
  }, [router]);

  return null;
}

