import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'LeadFlow Touch - Mobile Capture',
  description: 'Hyper-fast capture interface for the exhibition floor',
};

/**
 * Mobile Route Group Layout
 * 
 * Full viewport layouts for mobile scanner and capture flows
 * No sidebar or desktop navigation
 */
export default function MobileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-[100dvh] w-screen overflow-hidden">
      {children}
    </div>
  );
}

