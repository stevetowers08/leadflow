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

export const TopNavigationBar = memo(
  ({
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
          'group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear',
          className
        )}
        style={style}
      >
        <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mx-2 data-[orientation=vertical]:h-4'
          />
          <Breadcrumb className='min-w-0 flex-1'>
            <BreadcrumbList className='flex items-center min-w-0'>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='/' className='truncate'>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem className='min-w-0'>
                <BreadcrumbPage className='truncate text-sm sm:text-base'>
                  {pageTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
    );
  }
);

TopNavigationBar.displayName = 'TopNavigationBar';
