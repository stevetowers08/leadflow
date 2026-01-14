import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import {
  Camera,
  Users,
  Building2,
  Calendar,
  GitMerge,
  BarChart3,
  Settings2,
  LucideIcon,
} from 'lucide-react';

interface TopNavigationBarProps {
  pageTitle: string;
  pageSubheading?: string;
  onSearch?: (query: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Map routes to their icons and titles from sidebar
const routeConfig: Record<string, { icon: LucideIcon; title: string }> = {
  '/': { icon: Building2, title: 'Companies' },
  '/capture': { icon: Camera, title: 'Capture' },
  '/leads': { icon: Users, title: 'Leads' },
  '/companies': { icon: Building2, title: 'Companies' },
  '/shows': { icon: Calendar, title: 'Shows' },
  '/workflows': { icon: GitMerge, title: 'Campaigns' },
  '/analytics': { icon: BarChart3, title: 'Analytics' },
  '/settings': { icon: Settings2, title: 'Settings' },
};

export const TopNavigationBar = memo(
  ({
    pageTitle,
    pageSubheading,
    onSearch,
    className,
    style,
  }: TopNavigationBarProps) => {
    const pathname = usePathname();

    // Get icon and title for current route
    // Check exact match for '/' first, then check other routes
    const currentRoute =
      pathname === '/'
        ? '/'
        : Object.keys(routeConfig)
            .filter(route => route !== '/')
            .find(route => pathname?.startsWith(route));
    const config = currentRoute ? routeConfig[currentRoute] : null;
    const Icon = config?.icon;
    const displayTitle = config?.title || pageTitle;

    return (
      <header
        className={cn(
          'group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-3 transition-[width,height] ease-linear relative border-b border-border bg-background',
          className
        )}
        style={style}
      >
        <div className='flex w-full items-center gap-3 px-4 lg:px-6'>
          {Icon && <Icon className='h-5 w-5 text-foreground' />}
          <h1 className='text-lg font-semibold'>{displayTitle}</h1>
        </div>
      </header>
    );
  }
);

TopNavigationBar.displayName = 'TopNavigationBar';
