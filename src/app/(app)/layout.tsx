'use client';

import { ReactNode } from 'react';
import { Layout } from '@/components/layout/Layout';

/**
 * Desktop App Route Group Layout
 * 
 * All desktop pages with sidebar navigation
 * Uses the standard Layout component with sidebar
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}







