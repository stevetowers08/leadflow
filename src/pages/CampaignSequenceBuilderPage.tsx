import CampaignSequenceBuilder from '@/components/campaigns/SmartleadStyleSequenceBuilder';
import { useCampaignSequences } from '@/hooks/useCampaignSequences';
import { CampaignSequence } from '@/types/campaign.types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CampaignSequenceBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sequences, isLoading } = useCampaignSequences();
  const [sequence, setSequence] = useState<CampaignSequence | null>(null);

  useEffect(() => {
    if (id && sequences) {
      const foundSequence = sequences.find(s => s.id === id);
      if (foundSequence) {
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => setSequence(foundSequence), 0);
      } else if (!isLoading) {
        // Sequence not found, redirect to campaigns
        navigate('/campaigns');
      }
    }
  }, [id, sequences, isLoading, navigate]);

  const handleClose = () => {
    navigate('/campaigns');
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
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Sequence Not Found
          </h2>
          <p className='text-gray-600 mb-4'>
            The requested sequence could not be found.
          </p>
          <button
            onClick={() => navigate('/campaigns')}
            className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700'
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return <CampaignSequenceBuilder sequence={sequence} onClose={handleClose} />;
}
