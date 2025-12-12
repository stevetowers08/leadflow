import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

interface TopNavigationBarProps {
  pageTitle: string;
  pageSubheading?: string;
  onSearch?: (query: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TopNavigationBar = memo(({
  pageTitle,
  pageSubheading,
  onSearch,
  className,
  style,
}: TopNavigationBarProps) => {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b border-white/20 transition-[width,height] ease-linear overflow-visible topnav-glass',
        className
      )}
      style={style}
    >
      <div className="flex w-full items-center gap-1 pl-3 pr-4 sm:gap-2 sm:pl-4 sm:pr-4 lg:gap-2 lg:pl-6 lg:pr-6 overflow-visible">
        <SidebarTrigger className="flex-shrink-0 min-h-[48px] min-w-[48px] sm:min-h-0 sm:min-w-0" />
        <Separator
          orientation="vertical"
          className="mx-1 sm:mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList className="flex items-center min-w-0">
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/" className="truncate">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate text-sm sm:text-base">{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
});

TopNavigationBar.displayName = 'TopNavigationBar';
