'use client';

// Use existing Campaigns component - it's the campaign builder
// The campaign sequence builder is the visual campaign builder
import Campaigns from '@/pages/Campaigns';

export const dynamic = 'force-dynamic';

export default function CampaignsPage() {
  return <Campaigns />;
}

