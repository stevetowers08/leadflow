'use client';

import * as React from 'react';
import {
  BarChart3,
  Camera,
  Home,
  LayoutDashboard,
  Megaphone,
  Settings,
  Users,
  Building2,
  Film,
  Palette,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, userProfile } = useAuth();
  const pathname = usePathname();

  // Get user data for NavUser
  const userData = React.useMemo(() => {
    if (!user) {
      return {
        name: 'Guest',
        email: '',
        avatar: '',
      };
    }

    return {
      name:
        userProfile?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'User',
      email: user.email || '',
      avatar: userProfile?.avatar_url || user.user_metadata?.avatar_url || '',
    };
  }, [user, userProfile]);

  // Leadflow navigation items
  const navMain = [
    {
      title: 'Overview',
      url: '/',
      icon: Home,
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
      title: 'Campaigns',
      url: '/workflows',
      icon: Megaphone,
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: BarChart3,
    },
    {
      title: 'Shows',
      url: '/shows',
      icon: Film,
    },
  ];

  const navSecondary = [
    {
      title: 'Style Guide',
      url: '/style-guide',
      icon: Palette,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/'>
                <div className='flex items-center gap-2'>
                  <span className='text-base font-semibold'>Leadflow</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
