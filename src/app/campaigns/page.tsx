// (DELETE) - Replaced by /workflows
// Campaigns functionality is replaced by the Visual Workflow Builder
// Can be removed after workflows page is fully implemented

'use client';

import Campaigns from '@/pages/Campaigns';

// Prevent static generation - requires QueryClientProvider at runtime
export const dynamic = 'force-dynamic';

export default function CampaignsPage() {
  return <Campaigns />;
}

