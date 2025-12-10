import CampaignSequenceBuilder from '@/components/campaigns/SmartleadStyleSequenceBuilder';
import { useCampaignSequences } from '@/hooks/useCampaignSequences';
import { CampaignSequence } from '@/types/campaign.types';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Client-side mount guard wrapper
export default function CampaignSequenceBuilderPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't call hooks until component is mounted on client
  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading sequence...</p>
        </div>
      </div>
    );
  }

  // Now safe to use hooks after mount (client-side only)
  return <CampaignSequenceBuilderContent />;
}

function CampaignSequenceBuilderContent() {
  // Get id from Next.js params - will be passed as prop in production
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : undefined;
  const { sequences, isLoading } = useCampaignSequences();
  const [sequence, setSequence] = useState<CampaignSequence | null>(null);

  useEffect(() => {
    if (id && sequences) {
      const foundSequence = sequences.find(s => s.id === id);
      if (foundSequence) {
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => setSequence(foundSequence), 0);
      } else if (!isLoading) {
        // Sequence not found, redirect based on current path
        const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/workflows')
          ? '/workflows'
          : '/campaigns';
        router.push(basePath);
      }
    }
  }, [id, sequences, isLoading, router]);

  const handleClose = () => {
    // Redirect based on current path
    const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/workflows')
      ? '/workflows'
      : '/campaigns';
    router.push(basePath);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading sequence...</p>
        </div>
      </div>
    );
  }

  if (!sequence) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-foreground mb-2'>
            Sequence Not Found
          </h2>
          <p className='text-gray-600 mb-4'>
            The requested sequence could not be found.
          </p>
          <button
            onClick={() => {
              const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/workflows')
                ? '/workflows'
                : '/campaigns';
              router.push(basePath);
            }}
            className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700'
          >
            Back to Workflows
          </button>
        </div>
      </div>
    );
  }

  return <CampaignSequenceBuilder sequence={sequence} onClose={handleClose} />;
}
