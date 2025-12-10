'use client';

/**
 * Simplified Sidebar - Clean shadcn-style design
 *
 * Features:
 * - Clean, minimal navigation
 * - Standard shadcn sidebar styling
 * - No complex glassmorphism effects
 */

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Home,
  Megaphone,
  MessageSquare,
  Rocket,
  Settings,
  Target,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RecruitEdgeLogo } from '../RecruitEdgeLogo';
import { useClientId } from '@/hooks/useClientId';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const navigationItems = [
  { name: 'Getting Started', href: '/getting-started', icon: Rocket },
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare },
  { name: 'Deals', href: '/pipeline', icon: Target },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Analytics', href: '/reporting', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { data: clientId } = useClientId();

  const { data: clientName } = useQuery({
    queryKey: ['client-name', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      
      const { data, error } = await supabase
        .from('clients')
        .select('name')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching client name:', error);
        return null;
      }

      return data?.name || null;
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className='flex h-full w-full flex-col border-r bg-sidebar'>
      <div className='flex h-12 shrink-0 items-center gap-2 border-b px-4'>
        <RecruitEdgeLogo className='text-base font-semibold' />
        {onClose && (
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='ml-auto h-8 w-8 lg:hidden'
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      <nav className='flex-1 space-y-1 overflow-y-auto p-2'>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className='h-4 w-4' />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {clientName && (
        <div className='border-t p-4'>
          <div className='text-sm font-medium text-sidebar-foreground truncate'>
            {clientName}
          </div>
        </div>
      )}
    </div>
  );
};
