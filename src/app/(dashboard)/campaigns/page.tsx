'use client';

import Campaigns from '@/pages/Campaigns';

// Prevent static generation - requires QueryClientProvider at runtime
export const dynamic = 'force-dynamic';

export default function CampaignsPage() {
  return <Campaigns />;
}

