# CRM Table Page Design Guide

## Overview

This document defines the complete design system for CRM table pages across the application. It establishes standards for layout, typography, spacing, interactions, and visual hierarchy to create a consistent, professional user experience.

**Last Updated**: October 16, 2025  
**Version**: 3.1  
**Status**: ✅ Implemented and Active

---

## Design Philosophy

### Core Principles

1. **Consistency First**: Every table page follows identical patterns
2. **Information Density**: Maximum data visibility without clutter
3. **Visual Hierarchy**: Clear distinction between data types and importance
4. **Professional Aesthetics**: Clean, modern design that builds trust
5. **Scalable Architecture**: Easy to maintain and extend across features

### CRM Industry Standards

Based on analysis of leading CRMs (Salesforce, HubSpot, Monday.com, Pipedrive):

- **Row Height**: 44px for optimal data density and touch targets
- **Font Size**: 12px unified across all elements for consistency
- **Grid Lines**: Subtle borders for data separation without distraction
- **Status Indicators**: Full-cell backgrounds for immediate recognition
- **Scrolling**: Fixed height with sticky headers for large datasets

---

## Typography System

### Unified Font Sizes

**All text elements use 12px (`0.75rem`) for consistency:**

```css
/* Headers */
font-size: 0.75rem !important; /* 12px */

/* Regular Cells */
font-size: 0.75rem !important; /* 12px */

/* Status Cells */
font-size: 0.75rem !important; /* 12px */
```

### Font Weights

- **Headers**: `font-weight: 600` (semibold)
- **Regular Content**: `font-weight: 400` (normal)
- **Status Content**: `font-weight: 500` (medium)
- **AI Scores**: `font-weight: 500` (medium) + monospace font

### Text Transform

- **Headers**: `text-transform: uppercase` + `letter-spacing: 0.05em`
- **Content**: Normal case

---

## Layout Architecture

### Page Structure

```
┌─────────────────────────────────────────┐
│ Page Header (hidden for table pages)    │
├─────────────────────────────────────────┤
│ Tab Navigation                          │
├─────────────────────────────────────────┤
│ Filter Controls                         │
├─────────────────────────────────────────┤
│ Data Table (with scrolling)              │
├─────────────────────────────────────────┤
│ Pagination Controls                     │
└─────────────────────────────────────────┘
```

### Spacing System

```css
/* Section Spacing */
.tab-section {
  margin-bottom: 1rem;
} /* 16px */
.filter-section {
  margin-bottom: 1rem;
} /* 16px */
.table-section {
  margin-bottom: 1rem;
} /* 16px */

/* Tab Spacing */
.tab-nav {
  gap: 1.5rem;
} /* 24px between tabs */
.tab-padding {
  padding: 0.75rem 0.25rem;
} /* 12px vertical, 4px horizontal */

/* Filter Spacing */
.filter-container {
  gap: 0.75rem;
} /* 12px between filters */
.filter-inner {
  gap: 0.5rem;
} /* 8px between grouped filters */
```

---

## Table System

### Row Heights

**Standardized 44px height across all elements:**

```css
.table-system th,
.table-system td {
  height: 44px !important;
  min-height: 44px !important;
  vertical-align: middle !important;
}
```

### Grid System

```css
.table-system {
  border-collapse: separate !important;
  border-spacing: 0 !important;
  border: 1px solid #d1d5db !important; /* Updated to gray-300 */
  border-radius: 8px !important;
  overflow: hidden !important;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1) !important;
}

.table-system th,
.table-system td {
  border-right: 1px solid #d1d5db !important; /* Updated to gray-300 */
  border-bottom: 1px solid #d1d5db !important; /* Updated to gray-300 */
}
```

### Logo System

#### Company Logo Standards

**Size**: 24px x 24px (`w-6 h-6`) for optimal table integration

**Implementation**:

```typescript
<div className='w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'>
  {company.website ? (
    <img
      src={getClearbitLogo(company.name)}
      alt={company.name}
      className='w-6 h-6 rounded-lg object-cover'
      onError={handleLogoError}
    />
  ) : null}
  <Building2 className='h-3 w-3 text-gray-400' />
</div>
```

**Fallback Icon**: Building2 icon at 12px x 12px (`h-3 w-3`) when logo fails to load

**Styling**:

- **Container**: `w-6 h-6` (24px x 24px)
- **Image**: `w-6 h-6` with `object-cover` for proper scaling
- **Background**: `bg-gray-100` for consistent appearance
- **Border Radius**: `rounded-lg` for modern look
- **Icon Size**: `h-3 w-3` (12px x 12px) for fallback

### Cell Types

#### 1. Status Columns (Unified Color System)

**Purpose**: Immediate visual recognition of data state using the unified color scheme

**Columns**: Status, Priority, AI Score, Lead Score

**Implementation**:

```typescript
// For word-based statuses (use StatusBadge)
<EnhancedTableCell
  data-cell-type='status'
  style={{ width: '120px', minWidth: '120px' }}
>
  <StatusBadge status={status} size="sm" />
</EnhancedTableCell>

// For numeric scores (use custom styling with unified colors)
<EnhancedTableCell
  data-cell-type='status'
  style={{ width: '100px', minWidth: '100px' }}
>
  <span className={cn(
    "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border",
    getUnifiedStatusClass(score)
  )}>
    {score || '-'}
  </span>
</EnhancedTableCell>
```

**Unified Color System**:

All status colors are now managed by the unified color scheme system:

```typescript
import { getUnifiedStatusClass } from '@/utils/colorScheme';

// Automatically provides consistent colors for all status types
const statusClasses = getUnifiedStatusClass(status);
// Returns: "bg-blue-50 text-blue-700 border-blue-200" (example)
```

**Color Categories**:

- **Lead Stages**: new, connected, messaged, replied, meeting_booked, etc.
- **Company Pipeline**: new_lead, automated, replied, meeting_scheduled, etc.
- **Job Status**: active, pending, expired (derived from company pipeline)
- **Priority Levels**: very_high, high, medium, low
- **AI Scores**: Numeric values with color-coded ranges

#### 2. Regular Columns (Single-Line Content)

**Purpose**: Standard data display with proper spacing and **NO MULTI-LINE TEXT**

**Columns**: Job Title, Company, Location, Function, Salary, etc.

**Implementation**:

```typescript
<EnhancedTableCell
  style={{ width: '450px', minWidth: '450px' }}
>
  <div className='text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis'>
    {content}
  </div>
</EnhancedTableCell>
```

**Critical Requirements**:

- **ALWAYS use `whitespace-nowrap`** to prevent text wrapping
- **ALWAYS use `overflow-hidden text-ellipsis`** for long text
- **NEVER use `break-words`** in table cells
- **Single line only** - no exceptions

**Styling**:

```css
.table-system td {
  padding: 0 1rem !important; /* 16px horizontal padding */
  background-color: white !important;
  color: #374151 !important;
}

/* Ensure single-line text */
.table-system td div {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
```

---

## Unified System Integration

### Status System Architecture

**Core Principle**: **WORDS = StatusBadge, NUMBERS = Custom Styling**

#### ✅ **StatusBadge Component** (For Words)

- **Used for**: STATUS, Priority, Text-based AI Scores
- **Values**: Words like "VERY HIGH", "HIGH", "MEDIUM", "LOW", "New Lead", "Connected"
- **Styling**: `rounded-md` (moderate rounding), unified colors
- **Implementation**: `<StatusBadge status={value} size="sm" />`

#### ✅ **Custom Badge Styling** (For Numbers)

- **Used for**: Numeric AI Scores, Count columns
- **Values**: Numbers like 82, 100, 0, 5, 12
- **Styling**: `rounded-md`, `px-2 py-1`, `text-xs font-medium`
- **Implementation**: Custom span with `getUnifiedStatusClass()` or `getScoreBadgeClasses()`

### Color System Usage

```typescript
// Import the unified system
import { getUnifiedStatusClass } from '@/utils/colorScheme';
import { getScoreBadgeClasses } from '@/utils/scoreUtils';
import { StatusBadge } from '@/components/StatusBadge';

// For word-based statuses
<StatusBadge status="New Lead" size="sm" />

// For numeric scores
<span className={cn(
  "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border",
  getScoreBadgeClasses(score)
)}>
  {score || '-'}
</span>

// For any status with unified colors
<span className={cn(
  "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border",
  getUnifiedStatusClass(status)
)}>
  {status}
</span>
```

### Status Field Mapping

**Companies Table**:

- **Field**: `pipeline_stage` (database enum)
- **Values**: new_lead, automated, replied, meeting_scheduled, proposal_sent, negotiation, closed_won, closed_lost, on_hold
- **Display**: Use `getStatusDisplayText()` for proper formatting

**People Table**:

- **Field**: `stage` (database enum)
- **Values**: new, connection_requested, connected, messaged, replied, meeting_booked, meeting_held, disqualified, in queue, lead_lost
- **Display**: Use `getStatusDisplayText()` for proper formatting

**Jobs Table**:

- **Field**: Derived from company's `pipeline_stage`
- **Values**: active, pending, expired (calculated via `getJobStatusFromPipeline()`)
- **Display**: Use `getJobStatusFromPipeline()` for calculation

---

## Scrolling & Performance

### Pagination Configuration

**No Table Scrolling**: Tables use pagination instead of scrolling to avoid confusion

```typescript
<UnifiedTable
  pagination={false} // External pagination
  stickyHeaders={true}
  maxHeight='100%'
  className='table-system'
>
```

**Container Setup**:

```typescript
<div className='bg-white rounded-lg border border-gray-200 w-full overflow-hidden'>
  <UnifiedTable className='table-system'>
    {/* Table content */}
  </UnifiedTable>
</div>
```

### Pagination System

**Standard Configuration**:

- **Default Page Size**: 25 rows (industry standard)
- **Page Size Options**: 10, 25, 50, 100 rows per page
- **Navigation**: Previous/Next buttons with page counter
- **Results Display**: "Showing X to Y of Z results"

**Implementation**:

```typescript
const [pageSize, setPageSize] = useState(25);
const [currentPage, setCurrentPage] = useState(1);

// Calculate pagination
const totalPages = Math.ceil(filteredJobs.length / pageSize);
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
```

### Performance Considerations

- **Pagination**: Prevents excessive DOM rendering
- **Page Size Control**: Users can adjust based on their needs
- **No Scrolling**: Eliminates confusing nested scrollbars
- **Natural Page Flow**: Matches standard web behavior

---

## Tab Navigation System

### Modern Tab Design

**Visual Style**:

- Underline indicator for active state
- Subtle hover effects
- Badge counts for data context
- No icons for minimal appearance

**Implementation**:

```typescript
<div className='border-b border-gray-200 mb-4'>
  <nav className='flex space-x-6'>
    {tabOptions.map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={cn(
          'relative flex items-center gap-2 py-3 px-1 text-sm font-medium transition-colors duration-200',
          'border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300',
          activeTab === tab.id
            ? 'text-blue-600 border-blue-600'
            : 'text-gray-500'
        )}
      >
        <span>{tab.label}</span>
        <span className={cn(
          'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full',
          activeTab === tab.id
            ? 'bg-blue-100 text-blue-600'
            : 'bg-gray-100 text-gray-500'
        )}>
          {tab.count}
        </span>
      </button>
    ))}
  </nav>
</div>
```

### Content Alignment Rules

#### Numeric Data Centering

**Rule**: All columns containing numeric data must be centered for better readability and visual consistency.

**Implementation**:

```typescript
// ✅ CORRECT: Numeric columns centered
{
  key: 'ai_score',
  label: 'AI Score',
  width: '100px',
  cellType: 'regular',
  align: 'center',
  render: (_, job) => {
    const score = job.lead_score_job || job.companies?.lead_score;
    return (
      <div className='flex justify-center items-center'>
        <span>{score ?? '-'}</span>
      </div>
    );
  },
},
{
  key: 'leads',
  label: 'Leads',
  width: '100px',
  cellType: 'regular',
  align: 'center',
  render: value => (
    <div className='flex justify-center items-center'>
      <span>{value || 0}</span>
    </div>
  ),
},
```

**Columns That Must Be Centered**:

- **AI Score**: Numeric values (0-100) - white background, no colored styling
- **Lead Score**: Numeric values (0-100) - white background, no colored styling
- **Leads Count**: Numeric values (0+) - white background, no colored styling
- **Priority Score**: Numeric values (if applicable)
- **Any other numeric data columns**

**Note**: AI Score and Leads columns use `cellType: 'ai-score'` and `cellType: 'lead-score'` respectively for centering, but have white backgrounds without colored styling for clean readability.

**Columns That Remain Left-Aligned**:

- **Text Content**: Job titles, company names, descriptions
- **Status Text**: Word-based statuses (handled by StatusBadge)
- **Dates**: Posted dates, expiration dates
- **Mixed Content**: Company info with logos

**CSS Override Handling**:
The `table-system.css` applies `display: flex !important` to all cell content. To center numeric data, use:

```css
flex justify-center items-center
```

This overrides the default flex behavior and centers the content both horizontally and vertically.

---

## Filter Controls System

### Unified Design System Integration

**Location**: `src/design-system/components.tsx` - **FilterControls component**

**Implementation**: Filter controls are now part of the unified design system with centralized tokens, ensuring consistency across all table pages.

### One-Change-Affects-All Architecture

**Design Tokens**: `src/design-system/tokens.ts` - **filterControls section**

**Change one token, affect all filter controls:**

```typescript
// In src/design-system/tokens.ts
filterControls: {
  // CHANGE THIS TO AFFECT ALL DROPDOWNS
  dropdown: 'bg-white h-8 !py-1 text-sm border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50',

  // CHANGE THIS TO AFFECT ALL FILTER BUTTONS
  button: 'h-8 w-8 rounded-md border flex items-center justify-center transition-colors action-bar-icon',
  buttonDefault: 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
  buttonActive: 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600',
}
```

**Usage in Components:**

```typescript
import { FilterControls } from '@/design-system/components';

<FilterControls
  statusOptions={statusOptions}
  userOptions={userOptions}
  sortOptions={sortOptions}
  statusFilter={statusFilter}
  selectedUser={selectedUser}
  sortBy={sortBy}
  showFavoritesOnly={showFavoritesOnly}
  onStatusChange={setStatusFilter}
  onUserChange={setSelectedUser}
  onSortChange={setSortBy}
  onFavoritesToggle={() => setShowFavoritesOnly(!showFavoritesOnly)}
  onSearchClick={() => setIsSearchModalOpen(true)}
/>
```

### Benefits of Unified System

1. **Single Source of Truth**: All styling defined in `designTokens.filterControls`
2. **Instant Updates**: Change one token, all filter controls update automatically
3. **Consistency**: Identical appearance and behavior across all table pages
4. **Performance**: React.memo optimization prevents unnecessary re-renders
5. **Type Safety**: TypeScript interfaces ensure proper usage
6. **Maintainability**: Easy to update, extend, or modify filter behavior

### Compact Design

**Height**: 32px (`h-8`) for compact appearance
**Spacing**: 8px between grouped controls, 12px between groups
**Styling**: Consistent border and hover states

### Unified Border System

**All components now use `border-gray-300` for consistency:**

```typescript
// In src/design-system/tokens.ts
borders: {
  default: 'border border-gray-300',
  card: 'border border-gray-300',
  table: 'border border-gray-300',
  tableHeader: 'border-b border-gray-300',
  tableCell: 'border-r border-gray-300 last:border-r-0',
  tableRow: 'border-b border-gray-300 last:border-b-0',
}
```

**Components Updated:**

- ✅ Filter Controls: `border-gray-300`
- ✅ Tables: `border-gray-300`
- ✅ Cards: `border-gray-300`
- ✅ Dropdowns: `border-gray-300`
- ✅ Search Modal: `border-gray-300`
- ✅ Tab Navigation: `border-gray-300`
- ✅ Pagination: `border-gray-300`

### Action Bar Icon Integration

**Favorite button includes `action-bar-icon` class for proper sizing:**

```typescript
// Defined in designTokens.filterControls.button
className =
  'h-8 w-8 rounded-md border flex items-center justify-center transition-colors action-bar-icon';
```

### Important: Dropdown Height Override

**Problem**: The `SelectTrigger` component has hardcoded `py-2` padding that makes dropdowns taller than buttons.

**Solution**: Use `!py-1` to override the default padding:

- **Default**: `h-8` + `py-2` = 32px + 16px = 48px total height
- **Fixed**: `h-8` + `!py-1` = 32px + 8px = 40px total height
- **Result**: Dropdowns now match button heights perfectly

**Critical Classes**:

```typescript
className =
  'h-8 !py-1 text-sm border border-border rounded-md hover:border-gray-400 hover:bg-gray-50';
```

**Why `!py-1` Works**:

- `!important` overrides component's default `py-2`
- Reduces padding from 16px to 8px total
- Maintains consistent height with icon buttons

---

## Hover States & Interactions

### Row Hover Effects

```css
/* Regular cells get subtle hover background */
.table-system tr:hover td:not([data-cell-type]) {
  background-color: #f9fafb !important;
}

/* Status cells maintain their colors on hover */
.table-system tr:hover td[data-cell-type='status'] {
  background-color: var(--status-bg) !important;
}
```

### Interactive Elements

- **Clickable Rows**: Full row click for detail view
- **Hover Feedback**: Subtle background changes
- **Focus States**: Keyboard navigation support
- **Loading States**: Skeleton or spinner during data fetch

---

## Responsive Design

### Breakpoint Strategy

**Desktop (1024px+)**:

- Full table with all columns
- Standard 48px row height
- Full padding and spacing

**Tablet (768px - 1023px)**:

- Maintain 48px row height
- Horizontal scrolling for overflow
- Preserve padding and spacing

**Mobile (Below 768px)**:

- Consider card-based layout
- Maintain accessibility standards
- Touch-friendly interaction areas

### Responsive Adjustments

```css
@media (max-width: 768px) {
  .table-system {
    --table-padding-regular: 0.75rem; /* 12px on mobile */
  }
}
```

---

## Accessibility Standards

### WCAG Compliance

- **Color Contrast**: All text meets AA standards
- **Keyboard Navigation**: Full table accessibility
- **Screen Readers**: Semantic HTML structure
- **Focus Indicators**: Clear focus states

### Implementation

```typescript
<UnifiedTable
  data={data}
  columns={columns}
  onRowClick={handleRowClick}
  loading={loading}
  emptyMessage="No data found"
>
```

---

## Implementation Status

### ✅ Completed Features

- **Jobs Page**: Fully implemented with unified table system
- **JobsV2**: Unified system with derived status (active/pending/expired)
- **CompaniesV2**: Unified system with pipeline_stage enum values
- **PeopleV2**: Unified system with stage enum values
- **48px Row Height**: Consistent across all cells
- **12px Font Size**: Unified typography system
- **Grid Lines**: Light gray borders for subtle separation
- **Rounded Corners**: 8px border radius with proper overflow
- **Box Shadow**: Subtle drop shadow for depth
- **Unified Color System**: Consistent status colors across all tables
- **Single-Line Text**: All cells use `whitespace-nowrap` to prevent wrapping
- **Status System**: WORDS = StatusBadge, NUMBERS = Custom styling
- **Tab Navigation**: Modern underline style with badges
- **Filter Controls**: Compact design with unified styling
- **Pagination**: Standard 25 rows per page with size options

### 🔄 Migration Status

- ✅ **JobsV2**: Migrated to unified system
- ✅ **PeopleV2**: Migrated to unified system
- ✅ **CompaniesV2**: Migrated to unified system
- ⚠️ **Legacy Pages**: Jobs.tsx, People.tsx, Companies.tsx are deprecated and will be removed

---

## ✅ Unified System Implementation

The unified table system is now fully implemented using:

- **UnifiedTable Component**: `src/components/ui/unified-table.tsx`
- **Table Styling**: `src/styles/table-system.css`
- **Design System**: `src/design-system/components.tsx`

### Current Implementation Status

- ✅ **JobsV2**: Uses UnifiedTable with proper cell types
- ✅ **PeopleV2**: Uses UnifiedTable with proper cell types
- ✅ **CompaniesV2**: Uses UnifiedTable with proper cell types
- ⚠️ **Legacy Pages**: Deprecated and will be removed

### Testing Checklist

- [x] JobsV2 table has consistent 44px row height
- [x] PeopleV2 table has consistent 44px row height
- [x] CompaniesV2 table has consistent 44px row height
- [x] Headers match data row height (44px)
- [x] Company logos are 24px x 24px (w-6 h-6)
- [x] Fallback icons are 12px x 12px (h-3 w-3)
- [x] All text uses unified 12px font size
- [x] Status columns have full-cell backgrounds
- [x] Regular columns have proper padding
- [x] Grid lines are visible and subtle
- [x] Rounded corners and box shadow applied
- [x] Scrolling works with sticky headers
- [x] Hover states preserve colored backgrounds
- [x] Tab navigation uses modern underline style
- [x] Filter controls are compact (28px height)
- [x] Spacing is optimized and consistent
- [x] AI Score and Leads columns are centered with white backgrounds
- [x] UnifiedTable component works correctly
- [x] PaginationControls component works correctly
- [x] TabNavigation component works correctly
- [x] SearchModal component works correctly
- [x] Accessibility standards met
- [x] Responsive behavior verified
- [x] Color contrast requirements met

---

## Future Enhancements

### Planned Features

- **Dark Mode Support**: Complete dark theme implementation
- **Column Resizing**: User-adjustable column widths
- **Advanced Sorting**: Multi-column sorting capabilities
- **Export Functionality**: CSV/Excel export options
- **Bulk Actions**: Multi-select operations
- **Real-time Updates**: Live data synchronization

### Performance Optimizations

- **Virtual Scrolling**: For datasets >1000 rows
- **Lazy Loading**: Progressive data loading
- **Memoization**: React performance optimizations
- **CSS Optimization**: Reduced bundle size

---

## Best Practices

### Development Guidelines

1. **Always use the table-system class** for consistent styling
2. **Use data-cell-type attributes** for status columns
3. **Maintain 48px row height** across all implementations
4. **Use 12px font size** for all text elements
5. **ALWAYS use `whitespace-nowrap`** to prevent multi-line text
6. **Use unified color system** for all status styling
7. **Follow WORDS = StatusBadge, NUMBERS = Custom styling** rule
8. **Use correct database enum fields** (pipeline_stage for companies, stage for people)
9. **Center all numeric data columns** for better readability
10. **Test hover states** to ensure colored backgrounds persist
11. **Verify scrolling behavior** with large datasets
12. **Check responsive behavior** on mobile devices

### Maintenance

- **Regular audits** of table implementations
- **Performance monitoring** for large datasets
- **Accessibility testing** with screen readers
- **Cross-browser compatibility** verification
- **Documentation updates** for new features

---

## Conclusion

This CRM Table Page Design Guide establishes a comprehensive, scalable system for all table-based interfaces in the application. By following these standards, we ensure consistency, maintainability, and optimal user experience across all CRM features.

The unified 12px font size, 48px row height, single-line text requirement, and centralized unified color system create a professional, modern interface that scales efficiently and provides excellent usability for both desktop and mobile users.

**Key Achievements**:

- **Unified Color System**: Consistent status colors across all tables
- **Single-Line Text**: No multi-line text in any table cells
- **Status System**: Clear distinction between word-based and numeric statuses
- **Database Integration**: Proper use of database enum fields
- **Performance**: Optimized rendering with pagination and memoization
