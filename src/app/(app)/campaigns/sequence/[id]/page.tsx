'use client';

// Reuse existing campaign sequence builder
// This route works for both /campaigns/sequence/[id] and /workflows/sequence/[id]
import CampaignSequenceBuilderPage from '@/components/pages/CampaignSequenceBuilderPage';

export default function CampaignSequencePage() {
  return <CampaignSequenceBuilderPage />;
}
