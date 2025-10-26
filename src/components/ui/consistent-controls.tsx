/**
 * Consistent UI Components - Tabs, Filters, Dropdowns, and Controls
 *
 * Based on modern design patterns from screenshots:
 * - Uniform heights across all interactive elements
 * - Consistent spacing and typography
 * - Clean, minimal aesthetic
 * - Proper focus states and accessibility
 */

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, Search } from 'lucide-react';
import { forwardRef } from 'react';

// Standard height for all interactive elements - consistent with action bar standard
const STANDARD_HEIGHT = 'h-8'; // 32px for consistent action element heights
const STANDARD_PADDING = 'px-3 py-2';

// Modern Tabs Component
const tabsVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-transparent text-muted-foreground hover:text-foreground',
        active:
          'bg-white text-foreground shadow-sm border border-gray-300 ring-1 ring-primary/10',
        glass:
          'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20',
        neumorphism:
          'bg-gray-100 text-gray-700 shadow-neumorphism-light hover:shadow-lg',
      },
      size: {
        default: `${STANDARD_HEIGHT} px-4`,
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface TabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsVariants> {
  active?: boolean;
}

const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ className, variant, size, active, ...props }, ref) => {
    return (
      <button
        className={cn(
          'relative',
          tabsVariants({
            variant: active ? 'active' : variant,
            size,
            className,
          }),
          active &&
            "after:content-[''] after:absolute after:left-2 after:right-2 after:-bottom-px after:h-[2px] after:bg-primary"
        )}
        role='tab'
        aria-selected={active}
        ref={ref}
        {...props}
      />
    );
  }
);
Tab.displayName = 'Tab';

// Tabs Container
const TabsList = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-md p-1 bg-white gap-1 border border-gray-300 shadow-sm',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

// Modern Filter Dropdown Component
const filterVariants = cva(
  'inline-flex items-center justify-between whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 bg-white border border-gray-300 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:border-gray-400 hover:bg-gray-50',
  {
    variants: {
      variant: {
        default: '',
        glass: 'glass-light text-white hover:bg-white/20 border-white/20',
        neumorphism: 'neumorphism-light text-gray-700 hover:shadow-lg',
        ghost: 'text-foreground',
      },
      size: {
        default: `${STANDARD_HEIGHT} ${STANDARD_PADDING}`,
        sm: 'h-8 px-2 text-xs',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface FilterProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof filterVariants> {
  label?: string;
  icon?: React.ReactNode;
}

const FilterButton = forwardRef<HTMLButtonElement, FilterProps>(
  ({ className, variant, size, label, icon, children, ...props }, ref) => {
    return (
      <button
        className={cn(filterVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <div className='flex items-center gap-2'>
          {icon && <span className='text-muted-foreground'>{icon}</span>}
          {label && <span>{label}</span>}
          {children}
        </div>
        <ChevronDown className='h-4 w-4 text-muted-foreground' />
      </button>
    );
  }
);
FilterButton.displayName = 'FilterButton';

// Modern Search Input Component
const searchVariants = cva(
  'flex w-full items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50',
  {
    variants: {
      variant: {
        default: 'focus:border-primary focus:ring-primary',
        glass:
          'glass-light text-white placeholder:text-white/70 focus:border-white/40 focus:ring-white/20',
        neumorphism: 'neumorphism-light focus:shadow-lg focus:bg-white',
      },
      size: {
        default: STANDARD_HEIGHT,
        sm: 'h-8 text-xs',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof searchVariants> {
  onClear?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, variant, size, onClear, ...props }, ref) => {
    return (
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500' />
        <input
          className={cn(
            searchVariants({ variant, size }),
            'pl-10 pr-10', // Padding for icons
            className
          )}
          ref={ref}
          {...props}
        />
        {onClear && (
          <button
            onClick={onClear}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 hover:text-gray-700'
          >
            ×
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

// Modern Action Button Component
const actionButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        outline: 'border border-gray-300 bg-white',
        ghost: 'text-foreground',
        glass: 'glass-light text-white hover:bg-white/20',
        neumorphism: 'neumorphism-light text-gray-700 hover:shadow-lg',
      },
      size: {
        default: `${STANDARD_HEIGHT} ${STANDARD_PADDING}`,
        sm: 'h-8 px-2 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: `${STANDARD_HEIGHT} w-10`,
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  icon?: React.ReactNode;
  loading?: boolean;
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant, size, icon, loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(actionButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
        ) : (
          icon && <span className='mr-2'>{icon}</span>
        )}
        {children}
      </button>
    );
  }
);
ActionButton.displayName = 'ActionButton';

// Modern Table Header Component
const tableHeaderVariants = cva(
  'flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground',
  {
    variants: {
      variant: {
        default: '',
        glass: '',
        neumorphism: '',
      },
      size: {
        default: `${STANDARD_HEIGHT} px-1`,
        sm: 'h-8 px-2 text-xs',
        lg: 'h-12 px-4 text-base',
      },
      sortable: {
        true: 'cursor-pointer select-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      sortable: false,
    },
  }
);

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableHeaderVariants> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

const TableHeader = forwardRef<HTMLDivElement, TableHeaderProps>(
  (
    {
      className,
      variant,
      size,
      sortable,
      sortDirection,
      onSort,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          tableHeaderVariants({ variant, size, sortable, className }),
          sortable && 'hover:bg-muted/50'
        )}
        ref={ref}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        {children}
        {sortable && (
          <div className='flex flex-col'>
            <ChevronDown
              className={cn(
                'h-3 w-3 transition-colors',
                sortDirection === 'asc'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
              style={{
                transform:
                  sortDirection === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </div>
        )}
      </div>
    );
  }
);
TableHeader.displayName = 'TableHeader';

// Modern Dropdown Menu Component
const dropdownVariants = cva('relative inline-block text-left', {
  variants: {
    size: {
      default: '',
      sm: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface DropdownProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dropdownVariants> {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, size, trigger, children, ...props }, ref) => {
    return (
      <div
        className={cn(dropdownVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        {trigger}
        <div className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          {children}
        </div>
      </div>
    );
  }
);
Dropdown.displayName = 'Dropdown';

// Standard Row Height Component
const RowContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-4', className)}
    {...props}
  />
));
RowContainer.displayName = 'RowContainer';

// Standard Control Bar Component
const ControlBar = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between gap-4 py-4', className)}
    {...props}
  />
));
ControlBar.displayName = 'ControlBar';

// Standard Filter Bar Component
const FilterBar = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-3 py-3', className)}
    {...props}
  />
));
FilterBar.displayName = 'FilterBar';

// Standard Table Row Component (uniform height and spacing)
const TableRow = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    selected?: boolean;
    hover?: boolean;
  }
>(({ className, selected, hover = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-4 px-4 py-3 border-b border-border last:border-b-0 transition-colors',
      hover && 'hover:bg-muted/50',
      selected && 'bg-primary/5 border-primary/20',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

// Standard Table Cell Component (alignment + optional width)
const TableCell = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    width?: string;
    align?: 'left' | 'center' | 'right';
  }
>(({ className, width, align = 'left', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center text-sm',
      align === 'center' && 'justify-center',
      align === 'right' && 'justify-end',
      className
    )}
    style={{ width }}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

export {
  ActionButton,
  actionButtonVariants,
  ControlBar,
  Dropdown,
  dropdownVariants,
  FilterBar,
  FilterButton,
  filterVariants,
  RowContainer,
  SearchInput,
  searchVariants,
  Tab,
  TableCell,
  TableHeader,
  tableHeaderVariants,
  TableRow,
  TabsList,
  tabsVariants,
};
