import React from 'react';

const VoiceAI: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Voice AI</h1>
          <p className='text-muted-foreground'>
            Manage your voice AI agents and settings
          </p>
        </div>
      </div>

      <div className='p-6 border rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>Voice AI Dashboard</h2>
        <p className='text-muted-foreground'>
          Voice AI functionality is temporarily disabled due to a component
          loading issue. Please check back later.
        </p>
      </div>
    </div>
  );
};

export default VoiceAI;
