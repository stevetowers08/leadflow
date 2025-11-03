'use client';

import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

export default function Loading() {
  return (
    <div className='p-6 space-y-6'>
      <LoadingSkeleton className='h-8 w-48' />
      <div className='grid gap-3 grid-cols-1 md:grid-cols-3'>
        <LoadingSkeleton className='h-24' count={6} />
      </div>
    </div>
  );
}


