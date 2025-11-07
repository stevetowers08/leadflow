import { cn } from '@/lib/utils';
import React from 'react';

interface MinimalLayoutProps {
  children: React.ReactNode;
}

export const MinimalLayout = ({ children }: MinimalLayoutProps) => {
  return (
    <div className='min-h-screen w-full bg-muted'>
      {/* Main content without sidebar */}
      <main className='w-full overflow-auto scrollbar-modern'>
        {/* Content */}
        <div className={cn('min-h-screen')}>{children}</div>
      </main>
    </div>
  );
};
