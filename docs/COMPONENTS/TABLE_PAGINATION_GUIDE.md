# Table Pagination & Scrolling Best Practices Guide

## Table of Contents

- [Overview](#overview)
- [Current Implementation Analysis](#current-implementation-analysis)
- [Pagination Best Practices](#pagination-best-practices)
- [Scrolling Issues & Solutions](#scrolling-issues--solutions)
- [Performance Optimization](#performance-optimization)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Implementation Recommendations](#implementation-recommendations)
- [Testing Checklist](#testing-checklist)

## Overview

This guide documents the current table pagination implementation in Empowr CRM and provides comprehensive best practices for improving user experience, performance, and accessibility. Based on 2024 industry standards and user research.

### Key Metrics

- **Target Load Time**: < 500ms for pagination changes
- **Scroll Performance**: 60fps smooth scrolling
- **Mobile Usability**: Touch-friendly controls (44px minimum)
- **Accessibility**: WCAG 2.1 AA compliance

## Current Implementation Analysis

### Existing Components

#### 1. **usePagination Hook** (`src/hooks/usePagination.ts`)

**Strengths:**

- ✅ Comprehensive pagination state management
- ✅ Ellipsis handling for large page counts
- ✅ Page size customization
- ✅ TypeScript interfaces

**Issues Identified:**

- ❌ Missing keyboard navigation support
- ❌ No URL state persistence
- ❌ Limited mobile optimization
- ❌ No virtual scrolling for large datasets

#### 2. **PaginationControls Component** (`src/components/utils/PaginationControls.tsx`)

**Strengths:**

- ✅ Clean UI with shadcn/ui components
- ✅ Page size selector
- ✅ Item count display
- ✅ Responsive design considerations

**Issues Identified:**

- ❌ Missing "Go to page" input for large datasets
- ❌ No keyboard shortcuts
- ❌ Limited mobile touch targets
- ❌ No loading states during page changes

#### 3. **EnhancedTable Component** (`src/components/ui/enhanced-table.tsx`)

**Strengths:**

- ✅ Single scrollbar implementation (recommended)
- ✅ Sticky headers
- ✅ Scroll synchronization
- ✅ Responsive design

**Issues Identified:**

- ❌ Performance issues with large datasets
- ❌ No virtual scrolling
- ❌ Limited mobile optimization
- ❌ Complex scrollbar synchronization logic

### Current Scrolling Issues

#### 1. **Performance Issues**

- Large datasets cause slow rendering
- Scroll synchronization overhead
- Memory usage with 1000+ rows
- Re-render cycles during scrolling

#### 2. **Mobile Experience**

- Horizontal scrolling difficult on touch devices
- Pagination controls too small for touch
- No swipe gestures for navigation
- Limited responsive breakpoints

#### 3. **Accessibility Gaps**

- Missing keyboard navigation
- No screen reader announcements
- Limited focus management
- No skip links for large tables

## Pagination Best Practices

### 1. **Consistent Placement & Design**

```tsx
// ✅ Good: Consistent bottom placement
<div className='flex items-center justify-between mt-6 px-4'>
  <div className='flex items-center gap-4'>
    {/* Item count and page size */}
  </div>
  <div className='flex items-center gap-2'>{/* Pagination controls */}</div>
</div>
```

### 2. **Clear Navigation Controls**

```tsx
// ✅ Good: Intuitive labels and states
<PaginationPrevious
  disabled={!hasPreviousPage}
  aria-label="Go to previous page"
>
  Previous
</PaginationPrevious>

<PaginationNext
  disabled={!hasNextPage}
  aria-label="Go to next page"
>
  Next
</PaginationNext>
```

### 3. **Limit Visible Page Links**

```tsx
// ✅ Good: Maximum 7 visible pages with ellipsis
const maxVisiblePages = 7;
const visiblePages = useMemo(() => {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
}, [currentPage, totalPages]);
```

### 4. **Highlight Current Page**

```tsx
// ✅ Good: Clear current page indication
<PaginationLink
  isActive={page === currentPage}
  className={cn(
    'cursor-pointer transition-colors',
    page === currentPage
      ? 'bg-primary-500 text-white hover:bg-primary-600'
      : 'hover:bg-gray-100'
  )}
>
  {page}
</PaginationLink>
```

### 5. **Page Size Options**

```tsx
// ✅ Good: Flexible page size options
const pageSizeOptions = [10, 25, 50, 100, 250];

<Select
  value={pageSize.toString()}
  onValueChange={value => onPageSizeChange(Number(value))}
>
  <SelectTrigger className='w-20 h-8'>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {pageSizeOptions.map(size => (
      <SelectItem key={size} value={size.toString()}>
        {size}
      </SelectItem>
    ))}
  </SelectContent>
</Select>;
```

### 6. **Go-to-Page Input for Large Datasets**

```tsx
// ✅ Good: Direct page navigation
const [goToPage, setGoToPage] = useState('');

const handleGoToPage = () => {
  const page = parseInt(goToPage);
  if (page >= 1 && page <= totalPages) {
    onPageChange(page);
    setGoToPage('');
  }
};

<div className='flex items-center gap-2'>
  <span className='text-sm text-gray-500'>Go to:</span>
  <input
    type='number'
    value={goToPage}
    onChange={e => setGoToPage(e.target.value)}
    placeholder='Page'
    className='w-16 px-2 py-1 text-sm border rounded'
    min='1'
    max={totalPages}
  />
  <Button
    size='sm'
    onClick={handleGoToPage}
    disabled={
      !goToPage || parseInt(goToPage) < 1 || parseInt(goToPage) > totalPages
    }
  >
    Go
  </Button>
</div>;
```

## Scrolling Issues & Solutions

### 1. **Single Scrollbar Implementation**

**Issue:** Dual scrollbars (`dualScrollbars={true}`) create confusing UX with multiple scrollbars.

**Solution:** Use single scrollbar implementation for cleaner user experience.

```tsx
// ✅ Recommended - Single scrollbar
<EnhancedTable dualScrollbars={false} stickyHeader={true} maxHeight="600px">

// ❌ Avoid - Dual scrollbars can be confusing
<EnhancedTable dualScrollbars={true} stickyHeader={true} maxHeight="600px">
```

**Benefits:**

- Cleaner visual design
- Less confusing for users
- Better mobile experience
- Reduced complexity

### 2. **Fixed Headers Implementation**

```tsx
// ✅ Good: Proper sticky header implementation
<EnhancedTableHeader className='sticky top-0 z-10 bg-white shadow-sm'>
  <EnhancedTableRow>
    {columns.map(column => (
      <EnhancedTableHead
        key={column.key}
        className='bg-gray-50/80 backdrop-blur-sm'
      >
        {column.label}
      </EnhancedTableHead>
    ))}
  </EnhancedTableRow>
</EnhancedTableHeader>
```

### 3. **Horizontal Scrolling Solutions**

#### Option A: Responsive Column Hiding

```tsx
// ✅ Good: Hide non-essential columns on mobile
const getVisibleColumns = (screenSize: 'mobile' | 'tablet' | 'desktop') => {
  const allColumns = [
    { key: 'title', label: 'Job Title', priority: 'high' },
    { key: 'company', label: 'Company', priority: 'high' },
    { key: 'location', label: 'Location', priority: 'medium' },
    { key: 'salary', label: 'Salary', priority: 'low' },
    { key: 'status', label: 'Status', priority: 'medium' },
  ];

  const priorityMap = {
    mobile: ['high'],
    tablet: ['high', 'medium'],
    desktop: ['high', 'medium', 'low'],
  };

  return allColumns.filter(col =>
    priorityMap[screenSize].includes(col.priority)
  );
};
```

#### Option B: Stacked Mobile Layout

```tsx
// ✅ Good: Stacked layout for mobile
const MobileTableRow = ({ row, columns }) => (
  <div className='bg-white border rounded-lg p-4 space-y-2'>
    {columns.map(column => (
      <div key={column.key} className='flex justify-between'>
        <span className='text-sm font-medium text-gray-500'>
          {column.label}:
        </span>
        <span className='text-sm text-gray-900'>
          {column.render
            ? column.render(row[column.key], row)
            : row[column.key]}
        </span>
      </div>
    ))}
  </div>
);
```

### 4. **Virtual Scrolling for Large Datasets**

```tsx
// ✅ Good: Virtual scrolling implementation
import { FixedSizeList as List } from 'react-window';

const VirtualizedTable = ({ data, columns, height = 400 }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <EnhancedTableRow>
        {columns.map(column => (
          <EnhancedTableCell key={column.key}>
            {column.render
              ? column.render(data[index][column.key], data[index])
              : data[index][column.key]}
          </EnhancedTableCell>
        ))}
      </EnhancedTableRow>
    </div>
  );

  return (
    <div className='border rounded-lg'>
      <EnhancedTableHeader>
        <EnhancedTableRow>
          {columns.map(column => (
            <EnhancedTableHead key={column.key}>
              {column.label}
            </EnhancedTableHead>
          ))}
        </EnhancedTableRow>
      </EnhancedTableHeader>
      <List
        height={height}
        itemCount={data.length}
        itemSize={48} // Row height
        className='scrollbar-thin'
      >
        {Row}
      </List>
    </div>
  );
};
```

### 5. **Smooth Scrolling Performance**

```tsx
// ✅ Good: Optimized scroll handling
const useScrollOptimization = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const handleScroll = useCallback(() => {
    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return { isScrolling, handleScroll };
};
```

## Performance Optimization

### 1. **Memoization Strategy**

```tsx
// ✅ Good: Memoized pagination component
const PaginationControls = React.memo<PaginationControlsProps>(
  ({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    visiblePages,
    showFirstEllipsis,
    showLastEllipsis,
    hasNextPage,
    hasPreviousPage,
    pageSizeOptions = [10, 20, 50, 100],
    showPageSizeSelector = true,
    showItemCount = true,
    className,
  }) => {
    const startItem = useMemo(
      () => (currentPage - 1) * pageSize + 1,
      [currentPage, pageSize]
    );
    const endItem = useMemo(
      () => Math.min(currentPage * pageSize, totalItems),
      [currentPage, pageSize, totalItems]
    );

    // Component implementation...
  }
);
```

### 2. **Debounced Page Changes**

```tsx
// ✅ Good: Debounced page changes for better UX
const useDebouncedPagination = (
  onPageChange: (page: number) => void,
  delay = 300
) => {
  const debouncedPageChange = useMemo(
    () => debounce(onPageChange, delay),
    [onPageChange, delay]
  );

  return debouncedPageChange;
};
```

### 3. **Lazy Loading**

```tsx
// ✅ Good: Lazy loading for large datasets
const useLazyPagination = (totalItems: number, pageSize: number) => {
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([1]));
  const [data, setData] = useState<Record<number, any[]>>({});

  const loadPage = useCallback(
    async (page: number) => {
      if (loadedPages.has(page)) return data[page];

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      const pageData = await fetchPageData(startIndex, endIndex);

      setData(prev => ({ ...prev, [page]: pageData }));
      setLoadedPages(prev => new Set([...prev, page]));

      return pageData;
    },
    [loadedPages, pageSize, data]
  );

  return { loadPage, loadedPages, data };
};
```

## Accessibility Guidelines

### 1. **Keyboard Navigation**

```tsx
// ✅ Good: Full keyboard support
const PaginationControls = ({ onPageChange, currentPage, totalPages }) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (currentPage > 1) onPageChange(currentPage - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentPage < totalPages) onPageChange(currentPage + 1);
          break;
        case 'Home':
          e.preventDefault();
          onPageChange(1);
          break;
        case 'End':
          e.preventDefault();
          onPageChange(totalPages);
          break;
      }
    },
    [currentPage, totalPages, onPageChange]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div role='navigation' aria-label='Pagination Navigation' tabIndex={0}>
      {/* Pagination controls */}
    </div>
  );
};
```

### 2. **Screen Reader Support**

```tsx
// ✅ Good: Comprehensive ARIA labels
<div role='region' aria-label='Table pagination' aria-live='polite'>
  <div aria-label={`Page ${currentPage} of ${totalPages}`}>
    Showing {startItem} to {endItem} of {totalItems} results
  </div>

  <nav aria-label='Pagination Navigation'>
    <button
      aria-label={`Go to page ${page}`}
      aria-current={page === currentPage ? 'page' : undefined}
      onClick={() => onPageChange(page)}
    >
      {page}
    </button>
  </nav>
</div>
```

### 3. **Focus Management**

```tsx
// ✅ Good: Proper focus management
const useFocusManagement = () => {
  const focusRef = useRef<HTMLButtonElement>(null);

  const focusPagination = useCallback(() => {
    focusRef.current?.focus();
  }, []);

  return { focusRef, focusPagination };
};
```

## Implementation Recommendations

### 1. **Immediate Improvements**

#### A. Fix PaginationControls Props Issue

```tsx
// ❌ Current: Incorrect props destructuring
export const PaginationControls: React.FC<PaginationControlsProps> = (
  currentPage, // This should be destructured from props
  totalPages,
  // ... other props
) => {

// ✅ Fixed: Proper props destructuring
export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  visiblePages,
  showFirstEllipsis,
  showLastEllipsis,
  hasNextPage,
  hasPreviousPage,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showItemCount = true,
  className,
}) => {
```

#### B. Add URL State Persistence

```tsx
// ✅ Good: URL state persistence
const useUrlPagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '25');

  const updateUrl = useCallback(
    (page: number, size: number) => {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('page', page.toString());
        newParams.set('pageSize', size.toString());
        return newParams;
      });
    },
    [setSearchParams]
  );

  return { currentPage, pageSize, updateUrl };
};
```

### 2. **Medium-term Enhancements**

#### A. Implement Virtual Scrolling

- Add react-window dependency
- Create VirtualizedTable component
- Implement row height calculation
- Add scroll position restoration

#### B. Mobile Optimization

- Implement stacked mobile layout
- Add swipe gestures for navigation
- Optimize touch targets (44px minimum)
- Add mobile-specific pagination controls

#### C. Performance Monitoring

- Add pagination performance metrics
- Implement loading state indicators
- Add error boundaries for pagination
- Monitor scroll performance

### 3. **Long-term Improvements**

#### A. Advanced Features

- Infinite scrolling option
- Smart prefetching
- Search within paginated results
- Export paginated data

#### B. Analytics Integration

- Track pagination usage patterns
- Monitor performance metrics
- A/B test different pagination styles
- User behavior analysis

## Testing Checklist

### 1. **Functional Testing**

- [ ] Page navigation works correctly
- [ ] Page size changes update display
- [ ] Go-to-page input functions properly
- [ ] URL state persists on refresh
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

### 2. **Performance Testing**

- [ ] Pagination changes < 500ms
- [ ] Smooth scrolling at 60fps
- [ ] Memory usage with large datasets
- [ ] Virtual scrolling performance
- [ ] Mobile scroll performance

### 3. **Accessibility Testing**

- [ ] Keyboard navigation
- [ ] Screen reader announcements
- [ ] Focus management
- [ ] Color contrast compliance
- [ ] Touch target sizes

### 4. **Cross-browser Testing**

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### 5. **Responsive Testing**

- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1440px+)

---

_This guide is updated regularly as new best practices emerge and implementation improvements are made. For specific implementation details, refer to the actual code in the repository._
