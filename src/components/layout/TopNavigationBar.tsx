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

interface TopNavigationBarProps {
  pageTitle: string;
  pageSubheading?: string;
  onSearch?: (query: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TopNavigationBar = ({
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
      <div className="flex w-full items-center gap-1 pl-3 pr-4 lg:gap-2 lg:pl-6 lg:pr-6 overflow-visible">
        <SidebarTrigger className="flex-shrink-0" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};
