'use client';

// Use existing Campaigns component - it's the workflow builder
// The campaign sequence builder is the visual workflow builder
import Campaigns from '@/pages/Campaigns';

export const dynamic = 'force-dynamic';

export default function WorkflowsPage() {
  return <Campaigns />;
}

