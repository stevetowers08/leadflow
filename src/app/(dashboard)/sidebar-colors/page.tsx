'use client';

import SidebarColorsClient from './SidebarColorsClient';

// Prevent static generation - this route requires context providers at runtime
export const dynamic = 'force-dynamic';

export default function SidebarColorOptionsPageRoute() {
  return <SidebarColorsClient />;
}

