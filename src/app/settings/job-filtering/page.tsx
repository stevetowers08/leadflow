'use client';

import JobFilteringSettingsPage from '@/pages/JobFilteringSettingsPage';

// Prevent static generation - requires QueryClientProvider at runtime
export const dynamic = 'force-dynamic';

export default function JobFilteringSettingsPageRoute() {
  return <JobFilteringSettingsPage />;
}

