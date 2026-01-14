'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  Settings2,
  Users,
  GitMerge,
  BarChart3,
  Camera,
  Calendar,
  Building2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LeadFlowLogo } from '@/components/LeadFlowLogo';
import { OrganizationSwitcher } from '@/components/shared/OrganizationSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

/**
 * Updated Navigation - PDR Section 5.1
 *
 * LeadFlow Console Navigation:
 * - Companies (/) - Icon: Building2 - Home page
 * - Capture (/capture) - Icon: Camera - Business card scanner
 * - Leads (/leads) - Icon: Users
 * - Shows (/shows) - Icon: Calendar
 * - Campaigns (/workflows) - Icon: GitMerge
 * - Analytics (/analytics) - Icon: BarChart3
 * - Settings (/settings) - Icon: Settings2
 */
const data = {
  navMain: [
    {
      title: 'Companies',
      url: '/',
      icon: Building2,
    },
    {
      title: 'Capture',
      url: '/capture',
      icon: Camera,
    },
    {
      title: 'Leads',
      url: '/leads',
      icon: Users,
    },
    {
      title: 'Shows',
      url: '/shows',
      icon: Calendar,
    },
    {
      title: 'Campaigns',
      url: '/workflows',
      icon: GitMerge,
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userData = {
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatar:
      (user?.user_metadata?.avatar_url as string | undefined) ||
      '/avatars/default.jpg',
  };

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='flex-shrink-0 !gap-0 !p-0'>
        <div className='w-full h-12 border-b border-sidebar-border bg-sidebar px-4 flex items-center justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0'>
          <Link
            href='/'
            className='flex items-center group-data-[collapsible=icon]:hidden'
          >
            <LeadFlowLogo size={110} />
          </Link>
          <SidebarTrigger className='ml-auto group-data-[collapsible=icon]:ml-0' />
        </div>
      </SidebarHeader>
      <SidebarContent className='flex-1 min-h-0 overflow-y-auto'>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter className='flex-shrink-0'>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
