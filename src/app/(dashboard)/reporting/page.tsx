'use client';

import Reporting from '@/pages/Reporting';

// Prevent static generation - requires QueryClientProvider at runtime
export const dynamic = 'force-dynamic';

export default function ReportingPage() {
  return <Reporting />;
}

