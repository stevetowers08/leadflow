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
} from '@/components/ui/sidebar';
import { LeadFlowLogo } from '@/components/LeadFlowLogo';
import { OrganizationSwitcher } from '@/components/shared/OrganizationSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

/**
 * Updated Navigation - PDR Section 5.1
 *
 * LeadFlow Console Navigation:
 * - Overview (/) - Icon: LayoutDashboard
 * - Capture (/capture) - Icon: Camera - Business card scanner
 * - Leads (/leads) - Icon: Users
 * - Companies (/companies) - Icon: Building2
 * - Shows (/shows) - Icon: Calendar
 * - Campaigns (/workflows) - Icon: GitMerge
 * - Analytics (/analytics) - Icon: BarChart3
 * - Settings (/settings) - Icon: Settings2
 */
const data = {
  navMain: [
    {
      title: 'Overview',
      url: '/',
      icon: LayoutDashboard,
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
      title: 'Companies',
      url: '/companies',
      icon: Building2,
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
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader className='flex-shrink-0 !gap-1'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/'>
                <LeadFlowLogo size={120} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className='px-3 py-2'>
          <OrganizationSwitcher />
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
