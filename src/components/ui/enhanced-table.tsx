import { cn } from '@/lib/utils';
import * as React from 'react';

interface EnhancedTableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  className?: string;
  stickyHeader?: boolean;
  dualScrollbars?: boolean;
  maxHeight?: string;
  enableVirtualScrolling?: boolean;
  rowHeight?: number;
}

const EnhancedTable = React.forwardRef<HTMLTableElement, EnhancedTableProps>(
  (
    {
      className,
      children,
      stickyHeader = true,
      dualScrollbars = false,
      maxHeight = '600px',
      enableVirtualScrolling = false,
      rowHeight = 48,
      ...props
    },
    ref
  ) => {
    const topScrollRef = React.useRef<HTMLDivElement>(null);
    const bottomScrollRef = React.useRef<HTMLDivElement>(null);
    const tableRef = React.useRef<HTMLDivElement>(null);
    const [tableWidth, setTableWidth] = React.useState(0);
    const [isScrolling, setIsScrolling] = React.useState(false);
    const scrollTimeoutRef = React.useRef<NodeJS.Timeout>();

    // Measure table width for scrollbar synchronization
    React.useEffect(() => {
      if (!dualScrollbars || !tableRef.current) return;

      const measureTable = () => {
        const table = tableRef.current?.querySelector('table');
        if (table) {
          setTableWidth(table.scrollWidth);
        }
      };

      measureTable();
      window.addEventListener('resize', measureTable);
      return () => window.removeEventListener('resize', measureTable);
    }, [dualScrollbars, children]);

    // Optimized scroll handling
    const handleScroll = React.useCallback(() => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    }, []);

    // Synchronize scrollbars with performance optimization
    React.useEffect(() => {
      if (!dualScrollbars) return;

      const topScroll = topScrollRef.current;
      const bottomScroll = bottomScrollRef.current;
      const tableContainer = tableRef.current;

      if (!topScroll || !bottomScroll || !tableContainer) return;

      let isScrolling = false;

      const syncScroll = (source: HTMLElement, targets: HTMLElement[]) => {
        if (isScrolling) return;
        isScrolling = true;

        requestAnimationFrame(() => {
          targets.forEach(target => {
            if (target !== source) {
              target.scrollLeft = source.scrollLeft;
            }
          });
          isScrolling = false;
        });
      };

      const handleTopScroll = () => {
        syncScroll(topScroll, [bottomScroll, tableContainer]);
      };

      const handleBottomScroll = () => {
        syncScroll(bottomScroll, [topScroll, tableContainer]);
      };

      const handleTableScroll = () => {
        syncScroll(tableContainer, [topScroll, bottomScroll]);
        handleScroll();
      };

      topScroll.addEventListener('scroll', handleTopScroll, { passive: true });
      bottomScroll.addEventListener('scroll', handleBottomScroll, {
        passive: true,
      });
      tableContainer.addEventListener('scroll', handleTableScroll, {
        passive: true,
      });

      return () => {
        topScroll.removeEventListener('scroll', handleTopScroll);
        bottomScroll.removeEventListener('scroll', handleBottomScroll);
        tableContainer.removeEventListener('scroll', handleTableScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, [dualScrollbars, handleScroll]);

    return (
      <div className='relative w-full table-scroll-container'>
        {/* Top scrollbar - only show if table is wider than container */}
        {dualScrollbars && tableWidth > 0 && (
          <div
            ref={topScrollRef}
            className='overflow-x-auto overflow-y-hidden h-3 mb-1 scrollbar-thin'
            style={{ scrollbarWidth: 'thin' }}
          >
            <div
              className='h-1 bg-transparent'
              style={{ width: `${tableWidth}px` }}
            />
          </div>
        )}

        {/* Table container */}
        <div
          ref={tableRef}
          className={cn(
            'relative w-full overflow-auto scrollbar-thin',
            isScrolling && 'scroll-smooth'
          )}
          style={{
            maxHeight: maxHeight,
            scrollbarWidth: 'thin',
            scrollBehavior: isScrolling ? 'smooth' : 'auto',
          }}
        >
          <table
            ref={ref}
            className={cn('w-full caption-bottom text-sm', className)}
            {...props}
          >
            {children}
          </table>
        </div>

        {/* Bottom scrollbar - only show if table is wider than container */}
        {dualScrollbars && tableWidth > 0 && (
          <div
            ref={bottomScrollRef}
            className='overflow-x-auto overflow-y-hidden h-3 mt-1 scrollbar-thin'
            style={{ scrollbarWidth: 'thin' }}
          >
            <div
              className='h-1 bg-transparent'
              style={{ width: `${tableWidth}px` }}
            />
          </div>
        )}
      </div>
    );
  }
);
EnhancedTable.displayName = 'EnhancedTable';

const EnhancedTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      '[&_tr]:border-b',
      'sticky top-0 z-10 bg-white shadow-sm backdrop-blur-sm',
      className
    )}
    {...props}
  />
));
EnhancedTableHeader.displayName = 'EnhancedTableHeader';

const EnhancedTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
EnhancedTableBody.displayName = 'EnhancedTableBody';

const EnhancedTableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
EnhancedTableFooter.displayName = 'EnhancedTableFooter';

const EnhancedTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50',
      className
    )}
    {...props}
  />
));
EnhancedTableRow.displayName = 'EnhancedTableRow';

const EnhancedTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      'text-sm font-semibold tracking-wide bg-gray-50/80 backdrop-blur-sm',
      className
    )}
    {...props}
  />
));
EnhancedTableHead.displayName = 'EnhancedTableHead';

const EnhancedTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle [&:has([role=checkbox])]:pr-0',
      'text-sm font-normal leading-relaxed',
      className
    )}
    {...props}
  />
));
EnhancedTableCell.displayName = 'EnhancedTableCell';

const EnhancedTableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
EnhancedTableCaption.displayName = 'EnhancedTableCaption';

export {
  EnhancedTable,
  EnhancedTableBody,
  EnhancedTableCaption,
  EnhancedTableCell,
  EnhancedTableFooter,
  EnhancedTableHead,
  EnhancedTableHeader,
  EnhancedTableRow,
};
