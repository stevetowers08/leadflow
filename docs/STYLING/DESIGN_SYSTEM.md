# Empowr CRM - Unified Design System Guide

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Design Tokens](#design-tokens)
- [Typography](#typography)
- [Color System](#color-system)
- [Layout & Spacing](#layout--spacing)
- [Components](#components)
- [Action Bars & Tables](#action-bars--tables)
- [Card System](#card-system)
- [Icons & Imagery](#icons--imagery)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)

## Modern CSS Architecture (December 2024)

### Best Practices

**✅ DO: Use Tailwind Utility Classes**

```tsx
// Modern approach with design tokens
const tokens = designTokens.filterControls;
<button className={cn(tokens.button, tokens.buttonDefault)}>
  <Star className={tokens.icon} />
</button>;
```

**❌ DON'T: Custom CSS Files**

```css
/* Avoid custom CSS files */
.action-bar-icon-button {
  height: 32px !important;
  /* ... more overrides */
}
```

### Action Bar Standards (January 2025)

**Height Consistency**: All action bar elements use `h-8` (32px)

- Filter dropdowns: `h-8` (32px)
- Action buttons: `h-8` (32px)
- Search inputs: `h-8` (32px)
- Icon buttons: `h-8 w-8` (32px × 32px)
- Icons inside buttons: `h-4 w-4` (16px)

**Implementation Pattern**:

```tsx
// ✅ Consistent action bar implementation
export const FilterControls = ({ ... }) => {
  const tokens = designTokens.filterControls;

  return (
    <div className={tokens.container}>
      <div className={tokens.leftGroup}>
        <DropdownSelect className={cn(tokens.dropdown, tokens.dropdownSmall)} />
        <button className={cn(tokens.button, tokens.buttonDefault)}>
          <Star className={tokens.icon} />
        </button>
      </div>
    </div>
  );
};
```

### CSS Architecture Principles

1. **Single Source of Truth**: Design tokens in `src/design-system/tokens.ts`
2. **No Custom CSS**: Use Tailwind utilities exclusively
3. **No `!important`**: Clean CSS hierarchy
4. **Consistent Heights**: All action elements are `h-8` (32px)
5. **Inline Search**: Expand inline instead of popup modals

---

## Design Philosophy

### Core Principles

1. **Consistency**: Unified visual language across all interfaces
2. **Clarity**: Clear hierarchy and intuitive navigation
3. **Efficiency**: Streamlined workflows for productivity
4. **Accessibility**: Inclusive design for all users
5. **Scalability**: Flexible system that grows with the product

### Visual Style

- **Modern & Professional**: Clean, business-focused aesthetic
- **Data-Driven**: Emphasis on clear data visualization
- **Minimal**: Reduced visual noise, focus on content
- **Trustworthy**: Reliable and stable visual foundation

## Design Tokens

### Implementation

Design tokens are centralized in `src/design-system/tokens.ts`:

```typescript
export const designTokens = {
  colors: {
    primary: 'hsl(var(--primary))', // Attio Dodger Blue #266DF0
    secondary: 'hsl(var(--secondary))', // Blue
    success: 'hsl(var(--success))', // Green
    warning: 'hsl(var(--warning))', // Amber
    error: 'hsl(var(--destructive))', // Red
    muted: 'hsl(var(--muted))', // Gray
    background: 'hsl(var(--background))', // White
    surface: 'hsl(var(--card))', // Light gray
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.8125rem', // 13px
      base: '0.875rem', // 14px - Attio base (html and body default)
      lg: '1rem', // 16px
      xl: '1.125rem', // 18px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: '400',
      medium: '500', // Attio default body weight
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
  },
  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};
```

## Typography

### Font Stack (Attio CRM Style)

- **Primary**: Inter (Google Fonts) - Medium weight (500) for body text
- **Fallback**: system-ui, -apple-system, sans-serif
- **Base Size**: 14px (matching Attio CRM standards)
- **Monospace**: 'Fira Code', 'Consolas', monospace

**Key Settings**:

- `font-family`: 'Inter', system-ui, -apple-system, sans-serif
- `font-weight`: 500 (medium) for body text
- `font-size`: 14px base size
- `-webkit-font-smoothing`: antialiased
- `-moz-osx-font-smoothing`: grayscale
- `text-rendering`: optimizeLegibility
- `font-optical-sizing`: auto

### Type Scale

```css
/* Headings */
.text-3xl {
  font-size: 1.875rem;
  font-weight: 700;
} /* Page titles */
.text-2xl {
  font-size: 1.5rem;
  font-weight: 600;
} /* Section titles */
.text-xl {
  font-size: 1.25rem;
  font-weight: 600;
} /* Card titles */
.text-lg {
  font-size: 1.125rem;
  font-weight: 500;
} /* Subheadings */

/* Body text - 14px base matching Attio */
.text-base {
  font-size: 0.875rem; /* 14px - Attio base */
  font-weight: 500; /* Medium - Attio default */
} /* Default body */
.text-sm {
  font-size: 0.8125rem; /* 13px */
  font-weight: 500; /* Medium - Attio default */
} /* Secondary text */
.text-xs {
  font-size: 0.75rem; /* 12px */
  font-weight: 500; /* Medium - Attio default */
} /* Captions */
```

### Usage Examples

```tsx
// Page title
<h1 className="text-3xl font-bold text-gray-900">Reporting & Analytics</h1>

// Section heading
<h2 className="text-2xl font-semibold text-gray-900">Daily Activity Trends</h2>

// Card title
<h3 className="text-lg font-semibold text-gray-900">Total People</h3>

// Body text
<p className="text-base text-gray-700">Description text goes here.</p>

// Secondary text
<span className="text-sm text-gray-500">Last updated 2 hours ago</span>

// Caption text
<span className="text-xs text-gray-400">Optional helper text</span>
```

## Color System

### Primary Palette

```css
/* Primary Blue - Main brand color (Attio Dodger Blue) */
--primary: 219 87% 55%; /* Main primary #266DF0 */
--primary-foreground: 0 0% 98%;
--primary-hover: 219 87% 50%;
--primary-light: 219 87% 95%;
--primary-medium: 219 87% 85%;

/* Secondary - Accent color */
--secondary: 219 87% 50%;
--secondary-foreground: 0 0% 98%;
--secondary-hover: 219 87% 45%;
--secondary-light: 219 87% 90%;
--secondary-medium: 219 87% 80%;

/* Note: Using HSL format for better flexibility */
```

### Semantic Colors

```css
/* Success Green */
--success-50: #ecfdf5;
--success-100: #d1fae5;
--success-500: #10b981; /* Main success */
--success-600: #059669;
--success-900: #064e3b;

/* Warning Amber */
--warning-50: #fffbeb;
--warning-100: #fef3c7;
--warning-500: #f59e0b; /* Main warning */
--warning-600: #d97706;
--warning-900: #78350f;

/* Error Red */
--error-50: #fef2f2;
--error-100: #fee2e2;
--error-500: #ef4444; /* Main error */
--error-600: #dc2626;
--error-900: #7f1d1d;
```

### Neutral Grays

```css
/* Gray scale for text and backgrounds */
--gray-50: #f9fafb; /* Light backgrounds */
--gray-100: #f3f4f6; /* Card backgrounds */
--gray-200: #e5e7eb; /* Borders */
--gray-300: #d1d5db; /* Disabled states */
--gray-400: #9ca3af; /* Placeholder text */
--gray-500: #6b7280; /* Secondary text */
--gray-600: #4b5563; /* Primary text */
--gray-700: #374151; /* Headings */
--gray-800: #1f2937; /* Dark headings */
--gray-900: #111827; /* Highest contrast */
```

### Usage Guidelines

```tsx
// Status indicators - using semantic classes
<Badge className="bg-success-light text-success-solid">Active</Badge>
<Badge className="bg-warning-light text-warning-solid">Pending</Badge>
<Badge className="bg-error-light text-error-solid">Failed</Badge>

// Interactive elements - using CSS variables
<Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
  Primary Action
</Button>

<Button className="bg-gray-100 hover:bg-gray-200 text-gray-700">
  Secondary Action
</Button>

// Text hierarchy
<h1 className="text-gray-900">Main heading</h1>
<p className="text-gray-700">Body text</p>
<span className="text-gray-500">Secondary text</span>
<span className="text-gray-400">Placeholder text</span>
```

## Page Layout & Backgrounds

### Standard Page Background

All pages use a consistent gradient background for visual depth:

```tsx
// Standard page background
<div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 -z-10" />

// Page content with negative margins to break out of Layout padding
<div className="relative min-h-screen -mx-4 -my-4 lg:-mx-6 lg:-my-6">
  <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 lg:px-6">
    {/* Page content */}
  </div>
</div>
```

### Detail Pages Layout (Jobs, People, Companies)

Detail pages follow a unified pattern with consistent header and content alignment:

```tsx
// Detail page structure
<>
  <div className='fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 -z-10' />
  <div className='relative min-h-screen -mx-4 -my-4 lg:-mx-6 lg:-my-6'>
    {/* Header - Same width as content */}
    <div className='flex items-center justify-between py-6 max-w-6xl mx-auto px-6'>
      <div className='flex items-center space-x-4'>
        <Button variant='ghost' size='sm'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back
        </Button>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>{title}</h1>
          <div className='flex items-center space-x-2 mt-1'>
            <StatusBadge status={status} />
            {isFavorite && (
              <Star className='w-4 h-4 text-warning fill-current' />
            )}
          </div>
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        {/* Action buttons using action-bar classes */}
      </div>
    </div>

    {/* Main Content */}
    <div className='space-y-6 max-w-6xl mx-auto px-6 pb-8'>
      {/* Entity-specific info card */}
      {/* Company info card (if applicable) */}
      {/* Related items lists */}
    </div>
  </div>
</>
```

### Layout Consistency

- **Full-screen background**: Fixed gradient covering entire viewport
- **Header alignment**: Header width matches content width (`max-w-6xl`)
- **Content container**: Negative margins to break out of Layout padding
- **Responsive spacing**: `px-6` for consistent horizontal padding
- **Max width**: `max-w-6xl` for detail pages (narrower than list pages)
- **Vertical spacing**: `space-y-6` between major sections
- **Bottom padding**: `pb-8` for proper page bottom margin

### Detail Pages Components

**Entity Info Cards**:

- **Jobs**: `JobInfoCard` - Job-specific information
- **People**: `LeadInfoCard` - Person-specific information
- **Companies**: `CompanyInfoCard` - Company-specific information

**Company Information**:

- **Jobs/People pages**: Use `CompanyInfoCard` for related company
- **Company pages**: Use `CompanyInfoCard` for the main entity

**Related Items**:

- **Jobs**: Show related employees and company info
- **People**: Show related jobs and colleagues
- **Companies**: Show related people and jobs

### Card Integration

All cards within pages should:

- Use solid white backgrounds (`bg-white`)
- Have consistent shadows and borders
- Support hover states with smooth transitions
- Be clickable where appropriate (opening popups)
- Include company logos when available
- Follow the unified spacing pattern (`space-y-6`)

## Layout & Spacing

### Page Layout Architecture (Fixed Viewport)

All pages use a unified fixed-viewport layout with internal scrolling via the `Page` component:

```tsx
// Layout Container (h-screen overflow-hidden)
//   └─ Main Content (h-full flex flex-col)
//       └─ Content Wrapper (flex-1 overflow-hidden)
//           └─ Page Component (h-full overflow-hidden)
//               ├─ Header (optional, flex-shrink-0)
//               └─ Scroll Container (flex-1 min-h-0 overflow-y-auto)
//                   └─ Content Wrapper (h-full flex flex-col, padding)
//                       └─ Page Content (flex flex-col, height: 100%)
//                           ├─ Filters (flex-shrink-0)
//                           ├─ Table Wrapper (flex-1 min-h-0)
//                           └─ Pagination (flex-shrink-0)
```

**Key Classes**:

- Layout: `h-screen overflow-hidden` - Prevents page scrolling
- Content: `flex-1 overflow-hidden` - Let pages handle overflow
- Page Container: `h-full flex flex-col overflow-hidden` - Page fills container
- Scroll Container: `flex-1 min-h-0 overflow-y-auto` - Handles vertical scrolling
- Content Wrapper: `h-full flex flex-col` - Flex container with padding
- Table Container: `flex flex-col` with `height: 100%` - Fills content wrapper
- Table Wrapper: `flex-1 min-h-0` - Takes available space
- Table: `overflow-auto` - Table scrolls internally

**Page Component Padding System** (Updated January 2025):

The `Page` component supports two padding modes:

- **Default Padding** (`padding='default'`):
  - Horizontal: `1rem` mobile, `1.5rem` desktop (`px-4 lg:px-6`)
  - Top: `1.5rem` (24px) (`pt-6`)
  - Bottom: `0.75rem` (12px) (`pb-3`)
  - Used for: Jobs, Contacts, Companies

- **Large Padding** (`padding='large'`):
  - Horizontal: `3rem` mobile, `4rem` desktop (`px-12 lg:px-16`)
  - Top: `3rem` (48px) (`pt-12`)
  - Bottom: `1.5rem` (24px) (`pb-6`)
  - Used for: Dashboard, Getting Started, Reporting/Analytics

**Scroll Padding**:

- Content uses `scroll-padding-top` and `scroll-padding-bottom` to prevent cut-off
- Default: `1.5rem` (24px)
- Large: `3rem` (48px)

**Table Pages Structure**:

```tsx
<Page title='Jobs Feed' hideHeader>
  {/* Container fills content wrapper height */}
  <div className='flex flex-col' style={{ height: '100%', minHeight: 0 }}>
    {/* Filters - Fixed at top */}
    <div className='flex-shrink-0 pb-4'>
      <FilterControls {...props} />
    </div>

    {/* Table - Scrollable middle */}
    <div className='flex-1 min-h-0 flex flex-col overflow-hidden'>
      <UnifiedTable
        scrollable={true}
        onRowClick={handleRowClick}
        loading={loading}
      />
    </div>

    {/* Pagination - Fixed at bottom */}
    <div className='flex-shrink-0 pt-4'>
      <PaginationControls {...props} />
    </div>
  </div>
</Page>
```

**Content Pages Structure** (Dashboard, Getting Started, Reporting):

```tsx
<Page title='Dashboard' hideHeader padding='large'>
  <div className='space-y-5 pb-8'>
    {/* Content sections with spacing */}
    <div className='grid gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
      {/* Cards */}
    </div>
  </div>
</Page>
```

**Benefits**:

- ✅ Pages always fit within viewport
- ✅ Tables scroll independently (horizontal & vertical)
- ✅ No page-level scrolling
- ✅ Consistent layout across all pages
- ✅ Proper flex constraints with `min-h-0`

### Grid System

```css
/* Container widths */
.container-sm {
  max-width: 640px;
} /* Mobile */
.container-md {
  max-width: 768px;
} /* Tablet */
.container-lg {
  max-width: 1024px;
} /* Desktop */
.container-xl {
  max-width: 1280px;
} /* Large desktop */
.container-2xl {
  max-width: 1536px;
} /* Extra large */

/* Grid layouts */
.grid-cols-1 {
  grid-template-columns: repeat(1, 1fr);
}
.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}
.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}
.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}
```

### Spacing Scale

```css
/* Padding and margin utilities */
.p-1 {
  padding: 0.25rem;
} /* 4px */
.p-2 {
  padding: 0.5rem;
} /* 8px */
.p-3 {
  padding: 0.75rem;
} /* 12px */
.p-4 {
  padding: 1rem;
} /* 16px */
.p-6 {
  padding: 1.5rem;
} /* 24px */
.p-8 {
  padding: 2rem;
} /* 32px */
.p-12 {
  padding: 3rem;
} /* 48px */

/* Gap utilities for flex/grid */
.gap-1 {
  gap: 0.25rem;
} /* 4px */
.gap-2 {
  gap: 0.5rem;
} /* 8px */
.gap-3 {
  gap: 0.75rem;
} /* 12px */
.gap-4 {
  gap: 1rem;
} /* 16px */
.gap-6 {
  gap: 1.5rem;
} /* 24px */
```

### Layout Patterns

```tsx
// Page layout
<div className="min-h-screen bg-gray-50">
  <main className="container mx-auto px-4 py-8">
    <div className="space-y-6">
      {/* Page content */}
    </div>
  </main>
</div>

// Card grid
<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <Card className="p-6">
    {/* Card content */}
  </Card>
</div>

// Two-column layout
<div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
  <div>{/* Left column */}</div>
  <div>{/* Right column */}</div>
</div>
```

## Action Bars & Tables

### Table Hover States (January 2025)

Modern CRM tables now feature sophisticated hover interactions following 2025 best practices:

#### Key Features

1. **Subtle Row Highlighting**: `hover:bg-gray-100` - Slightly darker background on hover
2. **Left Border Indicator**: `border-l-2 border-primary-400` - Blue accent line appears on hover
3. **Smooth Transitions**: `transition-all duration-150 ease-out` - 150ms smooth animations
4. **Shadow Elevation**: `shadow-sm hover:shadow-sm` - Subtle depth indication
5. **Text Darkening**: `group-hover:text-gray-900` - Cell text becomes darker on row hover
6. **Focus States**: `focus:ring-2 focus:ring-primary-200` - Keyboard accessibility

#### Implementation

```tsx
// Table Row Hover States
<tr
  className={cn(
    'transition-all duration-150 ease-out cursor-pointer group',
    'hover:bg-gray-100 border-l-2 border-transparent hover:border-l-2 hover:border-primary-400',
    'shadow-sm hover:shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-inset',
    onClick && 'cursor-pointer'
  )}
>

// Table Cell Text Response
<td className={cn(
  'px-4 py-2 text-sm transition-colors duration-150',
  'group-hover:text-gray-900',
  // ... other classes
)}>

// Sortable Headers
<th
  className={cn(
    'transition-all duration-150 ease-out',
    'cursor-pointer hover:bg-gray-100/60 hover:shadow-sm',
    // ... other classes
  )}
>
```

#### Design Principles

- **Subtle & Professional**: Smooth color transitions without jarring effects
- **Clear Visual Feedback**: Border + background change for instant recognition
- **Accessibility First**: Keyboard focus states with visual rings
- **No Zoom Effects**: Avoids scale transforms that break table layouts
- **Consistent Timing**: All transitions use 150ms duration for uniformity

### Action Element Heights - **UNIFIED STANDARD (January 2025)**

**ALL action elements across the app use `h-8` (32px) for visual consistency:**

- **Buttons**: `h-8` (32px height) - **ALL button sizes (default, sm, xs, icon)**
- **Dropdown Selects**: `h-8` (32px height)
- **Search Icon Buttons**: `h-8 w-8` (32px × 32px)
- **Filter Buttons**: `h-8` (32px height)
- **Sort Controls**: `h-8` (32px height)
- **Input Fields**: `h-8` (32px height)
- **Icon Buttons**: `h-8 w-8` (32px × 32px)
- **Action Bar Elements**: `h-8` (32px height)

**Why h-8 (32px)?**

- Industry standard for touch targets (WCAG 2.1 AA compliant)
- Matches dropdown heights for visual consistency
- Comfortable spacing for professional apps
- Better than h-7 (28px) which can feel cramped
- 2025 best practice for action elements

### Action Bar Styling - **UNIFIED PATTERN**

All action bars across pages and popups now use consistent styling:

#### Dropdown Selects

```tsx
className =
  'bg-white h-8 px-3 text-sm border border-gray-200 rounded-md hover:border-gray-300 hover:bg-gray-50 transition-colors';
```

#### Icon Buttons (Favorites, etc.)

```tsx
className =
  'h-8 w-8 rounded-md border flex items-center justify-center transition-colors bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50';
```

#### Sort Order Button

```tsx
className =
  'px-2 h-8 text-sm border border-gray-200 rounded-md bg-white hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors';
```

#### Active States

- **Favorites Active**: `bg-primary-50 text-primary-700 border-primary-200`
- **Hover States**: `hover:border-gray-400 hover:bg-gray-50`

### Action Bar Layout - **UNIFIED ACROSS PAGES & POPUPS**

- **Left Section**: Status dropdown → User dropdown → Favorites icon (squared)
- **Right Section**: Sort label → Sort dropdown → Sort order button → Search icon (far right)
- **No Duplicate Elements**: Single search icon positioned on far right only
- **Consistent Spacing**: All elements use `gap-3` for proper spacing
- **Consistent Styling**: All elements use `h-8` height with unified border and hover states
- **Background**: All elements use `bg-white` with `border-gray-300` borders
- **Hover States**: `hover:border-gray-400 hover:bg-gray-50` for all interactive elements

### Table Row Heights - **UNIFIED STANDARD**

- **All Table Rows**: `h-[40px]` (40px fixed height) - **MANDATORY**
- **Table Headers**: `h-[40px]` (40px fixed height) - **MANDATORY**
- **Table Cells**: `px-4` (16px horizontal padding)
- **Table Layout**: `table-layout: fixed` - **MANDATORY** for consistent widths
- **Action Buttons in Rows**: `h-8 w-8` (32px × 32px)
- **Avatars in Rows**: `w-6 h-6` (24px × 24px)
- **Icons in Rows**: `h-4 w-4` (16px × 16px)

### Table Column Widths - **STANDARDIZED**

- **Status Columns**: `150px` width - **CONSISTENT ACROSS ALL TABLES**
  - Jobs page: `150px`
  - People page: `150px`
  - Companies page: `150px`

### Status Dropdown Standards (January 2025)

All status dropdowns use a unified modern design:

#### Key Features

1. **Unified Component**: Single `UnifiedStatusDropdown` for all entity types
2. **Whole Cell Clickable**: Entire status cell is clickable (not just button)
3. **Dot Indicators**: Colored status dots in dropdown items for quick recognition
4. **Checkmark Feedback**: Visual checkmark on selected item
5. **Consistent Width**: `180px` dropdown width
6. **Efficient**: Single source of truth, no code duplication

#### Implementation

```tsx
import { UnifiedStatusDropdown } from '@/components/shared/UnifiedStatusDropdown';

// Usage
<UnifiedStatusDropdown
  entityId={entity.id}
  entityType='people' // or 'companies' or 'jobs'
  currentStatus={entity.status}
  availableStatuses={['new_lead', 'message_sent', 'replied']}
  onStatusChange={handleChange}
/>;
```

#### Visual Design

- **Trigger**: Badge-style button with status color and chevron
- **Dropdown Items**: Status dot + text + checkmark (if selected)
- **Selected State**: Muted background with checkmark
- **Disabled State**: Grayed out during update
- **Focus State**: Blue ring for accessibility

#### Component Locations

- **Main Component**: `src/components/shared/UnifiedStatusDropdown.tsx`
- **Backward Compatibility**: `src/components/people/StatusDropdown.tsx` (re-exports)
- **Jobs Special Handler**: `src/components/jobs/JobQualificationTableDropdown.tsx` (adds onboarding logic)

### Table Header Standards (January 2025)

All tables now feature consistent header styling:

#### Header Requirements

1. **Borders**: All headers have `border-b-2 border-gray-200` for clear separation
2. **No Text Wrapping**: Headers use `whitespace-nowrap` to keep text on single line
3. **Sticky on Scroll**: Headers stick to top when scrolling with `sticky top-0 z-20`
4. **Border Collapse**: Tables use `border-collapse` for cleaner borders

#### Implementation

```tsx
// Table head styling
<th className='px-4 py-2 text-xs font-semibold uppercase tracking-wide border-r border-b-2 border-gray-200 last:border-r-0 whitespace-nowrap'>
  {column.label}
</th>
```

#### Key Classes

- `border-b-2 border-gray-200` - Bottom border for header row
- `border-r border-gray-200` - Right borders between columns
- `last:border-r-0` - Remove border from last column
- `whitespace-nowrap` - Prevent text wrapping in headers
- `sticky top-0 z-20` - Sticky positioning when scrolling
- `bg-gray-50` - Light gray background for sticky headers

#### Table Border Mode

Use `border-collapse` instead of `border-separate` for cleaner borders:

```tsx
<table className='w-full border-collapse'>{/* table content */}</table>
```

This ensures:

- Borders merge into single lines
- Sticky headers work properly
- No double borders
- Cleaner visual appearance

### Table Implementation Pattern

```tsx
// Import UnifiedTable Components
import { UnifiedTable, ColumnConfig } from '@/components/ui/unified-table';

// Table Structure
<div className='bg-white rounded-lg border border-gray-200'>
  <UnifiedTable
    data={data}
    columns={columns}
    stickyHeaders={true}
    scrollable={true}
    onRowClick={handleRowClick}
  />
</div>;
```

**Benefits of New Implementation**:

- ✅ Headers always visible while scrolling
- ✅ Single-line header text (no wrapping)
- ✅ Clear border separation
- ✅ Consistent across all tables (People, Jobs, Companies)

### Button Specifications

| Button Type         | Padding       | Border            | Corner Radius | Background | Icon Size | Height |
| ------------------- | ------------- | ----------------- | ------------- | ---------- | --------- | ------ |
| **Icon Buttons**    | `p-1.5`       | `border-gray-300` | `rounded-md`  | White      | `h-4 w-4` | `h-8`  |
| **Action Button**   | `px-4 py-1.5` | None              | `rounded-md`  | Blue       | `h-4 w-4` | `h-8`  |
| **Search Icon**     | `p-1.5`       | `border-border`   | `rounded-md`  | White      | `h-4 w-4` | `h-8`  |
| **Dropdown Select** | `px-3 py-2`   | `border-border`   | `rounded-md`  | White      | `h-4 w-4` | `h-8`  |
| **Filter Button**   | `px-3 py-2`   | `border-border`   | `rounded-md`  | White      | `h-4 w-4` | `h-8`  |

## Shadow Hover Effects (2025 Best Practices)

### Overview

Modern UI design in 2025 emphasizes **subtle and realistic shadow effects** to enhance user experience without overwhelming the interface. Our implementation follows industry best practices for interactive elements.

### Key Principles

1. **Subtle Elevation**: Use medium shadows (`shadow-md`) for hover states
2. **Layered Shadows**: Combine vertical offset with blur for realistic depth
3. **Smooth Transitions**: Always include transition properties (200ms duration)
4. **Accessibility**: Ensure shadow effects don't compromise readability
5. **Consistency**: Use the same shadow pattern across all interactive elements

### Implementation Standards

#### Clickable Card Hover States

```tsx
// Standard hover state for clickable cards
className =
  'p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all duration-200';
```

**Key Features**:

- **Background**: `hover:bg-gray-100` - Subtle gray background change
- **Shadow**: `hover:shadow-md` - Medium elevation for depth
- **Duration**: `duration-200` - Smooth 200ms transitions
- **Border**: `border-gray-200` - Consistent border styling

#### Shadow Values

**Tailwind Shadow Classes**:

```css
/* shadow-sm - Very subtle (static state) */
0 1px 2px 0 rgb(0 0 0 / 0.05)

/* shadow-md - Medium elevation (hover state) - RECOMMENDED */
0 4px 6px -1px rgb(0 0 0 / 0.1),
0 2px 4px -2px rgb(0 0 0 / 0.1)

/* shadow-lg - Large elevation (not recommended for hover) */
0 10px 15px -3px rgb(0 0 0 / 0.1),
0 4px 6px -4px rgb(0 0 0 / 0.1)
```

#### Best Practices

✅ **DO**:

- Use `shadow-md` for hover states - creates subtle but noticeable elevation
- Include `transition-all duration-200` for smooth animations
- Combine with `hover:bg-gray-100` for background feedback
- Use `border-gray-200` for clean, professional borders
- Maintain consistent shadow values across all interactive elements

❌ **DON'T**:

- Don't use `shadow-sm` for hover - too subtle for modern UX
- Don't use `shadow-lg` for hover - too dramatic and distracting
- Don't use scale transforms (`scale-105`) on hover - breaks layouts
- Don't skip transition timing - makes interactions feel abrupt
- Don't use overly complex multi-layer shadows - reduces performance

#### Examples

```tsx
// Dashboard Recent Jobs/Companies Cards
<div
  onClick={handleClick}
  className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer'
>
  {/* Card content */}
</div>

// Getting Started Setup Steps
<div
  onClick={() => navigate(step.href)}
  className='p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all duration-200 group'
>
  {/* Step content */}
</div>
```

### Performance Considerations

- **Hardware Acceleration**: Shadows automatically use GPU acceleration
- **Mobile Optimization**: Subtle shadows maintain performance on mobile devices
- **Reduced Motion**: Respects `prefers-reduced-motion` for accessibility
- **Layering**: Limit to maximum of 2 shadow layers for optimal performance

### Accessible Alternatives

For users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .hover\:shadow-md:hover {
    box-shadow: none;
  }
}
```

This ensures the background color change (`hover:bg-gray-100`) still provides visual feedback.

---

## Card System

### Modern Card System (2025)

The application uses a sophisticated card design system based on 2025 best practices with **solid white backgrounds** for optimal readability and consistency:

#### Card Variants

- **Minimal**: `bg-white border border-gray-200 shadow-sm` - Clean, subtle (DEFAULT)
- **Elevated**: `bg-white border border-gray-200 shadow-lg shadow-gray-300/20` - More prominent
- **Glass**: `bg-white border border-gray-200 shadow-xl shadow-gray-400/10` - Enhanced shadows
- **Default**: `bg-white border border-gray-200 shadow-sm` - Standard

#### Design Principles

- **Solid White Backgrounds**: All cards use `bg-white` for maximum readability
- **Consistent Shadows**: `shadow-sm` (minimal), `shadow-lg` (elevated), `shadow-xl` (glass)
- **Unified Hover States**: `hover:bg-gray-100 hover:shadow-md transition-all duration-200`
- **Standardized Borders**: `border border-gray-200` for all variants
- **Rounded Corners**: `rounded-lg` for modern feel
- **No Scale Effects**: Avoid scale transforms that break layout flow

#### Card Components

- **ModernCard**: Base container with variants and hover effects
- **MetricCard**: Displays key metrics with icons and trends
- **ActionCard**: Interactive cards for navigation and actions
- **ModernCompanyCard**: Company-specific card with logos and badges
- **ListCard**: Compact list items with icons and badges

#### Small Card List Pattern

Use for short, scannable lists (e.g., recent jobs/companies):

- **Container**: `ModernCard variant="minimal" className="p-4"`
- **Item**: `ListCard` with:
  - Title: Primary line (truncate)
  - Subtitle: Secondary info (company • industry)
  - Logo: Company logo with fallback to default icon
  - Optional right `badge`: status chip (e.g., New)
- **Spacing**: `space-y-2.5` between items
- **Badge tokens**: `px-2 py-0.5 rounded-md text-xs font-medium border`
- **Clickability**: All cards open slide-out panels
- **Examples**:

```tsx
<ModernCard variant='minimal' className='p-4'>
  <div className='flex items-center justify-between mb-3'>
    <h3 className='text-sm font-semibold text-gray-900'>Recent Jobs</h3>
    <button className='text-xs font-medium text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200'>
      View all
    </button>
  </div>
  <div className='space-y-2.5'>
    {jobs.slice(0, 4).map(job => (
      <ListCard
        key={job.id}
        title={job.title}
        subtitle={`${job.company} • ${job.industry}`}
        logo={job.logo || job.company?.profile_image_url}
        onClick={() => openPopup('job', job.id, job.title)}
        variant='minimal'
        badge={
          <span className='px-2 py-0.5 rounded-md text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200'>
            New
          </span>
        }
      />
    ))}
  </div>
</ModernCard>
```

### Popup Card System

#### Base Components

```typescript
<InfoCard
  title="Card Title"
  contentSpacing="space-y-6 pt-4"
  showDivider={true}
>
  {/* Card content */}
</InfoCard>

<InfoField
  label="Field Label"
  value="Field Value"
/>
```

**Properties**:

- `title`: Card section title
- `contentSpacing`: `"space-y-6 pt-4"` (standard spacing)
- `showDivider`: `true` for main cards, `false` for sub-cards

**Styling**:

- Label: `text-xs font-medium text-gray-400`
- Value: `text-sm text-gray-900 font-medium`

#### LeadInfoCard Structure

```typescript
<InfoCard title="Lead Information" contentSpacing="space-y-6 pt-4" showDivider={true}>
  {/* Section 1: Lead Header */}
  <div className="grid grid-cols-3 gap-3 items-center">
    {/* Column 1: Lead Icon + Info */}
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
        <User className="w-10 h-10 text-gray-400" />
      </div>
      <div className="min-w-0">
        <div className="text-xl font-bold text-gray-900 leading-tight">{lead.name}</div>
        <div className="text-sm text-gray-500 leading-tight">{lead.company_role}</div>
      </div>
    </div>

    {/* Column 2: Status */}
    <div className="space-y-1">
      <div className="text-xs font-medium text-gray-400">Status</div>
      <div className="text-sm text-gray-900 font-medium">
        <StatusBadge status={lead.stage || "new"} size="sm" />
      </div>
    </div>

    {/* Column 3: Contact */}
    <div className="space-y-1">
      <div className="text-xs font-medium text-gray-400">Contact</div>
      <div className="text-sm text-gray-900 font-medium space-y-1">
        {/* Email and LinkedIn links */}
      </div>
    </div>
  </div>

  {/* Section 2: Additional Details */}
  <div className="grid grid-cols-3 gap-3">
    <InfoField label="Location" value={lead.employee_location} />
    <InfoField label="Last Interaction" value={formatDistanceToNow(...)} />
    <InfoField label="Added" value={formatDistanceToNow(...)} />
  </div>

  {/* Section 3: Person Tags */}
  <div className="space-y-2">
    <div className="text-xs font-medium text-gray-400">Tags</div>
    {/* Tag display and selector */}
  </div>
</InfoCard>
```

#### CompanyInfoCard Structure

```typescript
<InfoCard title="Company Information" contentSpacing="space-y-4 pt-1" showDivider={false}>
  {/* Section 1: Company Header - 3-column layout */}
  <div className="grid grid-cols-3 gap-3 items-center">
    {/* Column 1: Logo + Company Info with Icons */}
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
        {/* Company logo or Building2 icon */}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold text-gray-900 leading-tight">{company.name}</div>
          {/* LinkedIn and Website icons */}
          {company.linkedin_url && <LinkedInIcon />}
          {company.website && <GlobeIcon />}
        </div>
        <div className="text-sm text-gray-500 leading-tight">{company.head_office}</div>
      </div>
    </div>

    {/* Column 2: AI Score */}
    <div className="space-y-1">
      <div className="text-xs font-medium text-gray-400">AI Score</div>
      <div className="text-sm text-gray-900 font-medium">
        <div className={`h-7 px-2 rounded-md border text-xs font-semibold w-fit flex items-center justify-center ${getScoreBadgeClasses(company.lead_score)}`}>
          {company.lead_score || "-"}
        </div>
      </div>
    </div>

    {/* Column 3: Empty (for consistent 3-column layout) */}
    <div></div>
  </div>

  {/* Section 2: Company Details */}
  <div className="space-y-3">
    <div className="grid grid-cols-3 gap-3">
      <InfoField label="Industry" value={company.industry} />
      <InfoField label="Company Size" value={company.company_size} />
      <InfoField label="Added Date" value={company.created_at ? new Date(company.created_at).toLocaleDateString() : "-"} />
    </div>
  </div>

  {/* Section 3: AI Analysis */}
  {company.score_reason && (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="text-sm font-semibold text-blue-700 mb-2">AI Analysis</div>
      <div className="text-base text-blue-900 leading-relaxed">{company.score_reason}</div>
    </div>
  )}

  {/* Section 4: Company Tags */}
  <div className="space-y-2">
    <div className="text-xs font-medium text-gray-400">Tags</div>
    {/* Tag display and selector */}
  </div>
</InfoCard>
```

#### JobInfoCard Structure

```typescript
<InfoCard title="Job Information" contentSpacing="space-y-6 pt-4" showDivider={true}>
  {/* Section 1: Job Header */}
  <div className="space-y-4">
    <div>
      <h2 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h2>
      {job.company_name && (
        <p className="text-base text-gray-600 mt-1">{job.company_name}</p>
      )}
    </div>

    {/* Key Details Row */}
    <div className="grid grid-cols-3 gap-3">
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-400">Salary Range</div>
        <div className="text-sm text-gray-900 font-medium">{formatSalary()}</div>
      </div>
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-400">Location</div>
        <div className="text-sm text-gray-900 font-medium">{job.location}</div>
      </div>
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-400">Employment Type</div>
        <div className="text-sm text-gray-900 font-medium">{formatEmploymentType()}</div>
      </div>
    </div>
  </div>

  {/* Section 2: Additional Job Details */}
  <div className="grid grid-cols-3 gap-3">
    <InfoField label="Function/Department" value={job.function} />
    <InfoField label="Seniority Level" value={job.seniority_level} />
    <InfoField label="Posted Date" value={job.created_at ? formatDateForSydney(job.created_at, 'date') : "-"} />
  </div>

  {/* Section 3: AI Job Summary */}
  {job.description && job.title ? (
    <AIJobSummary job={job} />
  ) : (
    <div className="text-center py-4 text-gray-500 text-sm">
      AI Job Summary not available - missing job description or title
    </div>
  )}
</InfoCard>
```

### Header Action Buttons - **UNIFIED PATTERN**

#### Standard Styling (Matches Page Action Bars)

```typescript
// Icon Buttons (Star, Message, Activity) - Unified with page action bars
className =
  'h-8 w-8 rounded-md border flex items-center justify-center transition-colors bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50';

// Action Button (Automate) - Consistent with page buttons
className =
  'h-8 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 px-4 py-1.5 text-sm font-medium flex items-center justify-center';
```

#### Button Specifications - **UNIFIED ACROSS PAGES & POPUPS**

| Button Type       | Padding       | Border            | Corner Radius | Background | Icon Size | Height |
| ----------------- | ------------- | ----------------- | ------------- | ---------- | --------- | ------ |
| **Icon Buttons**  | `p-2`         | `border-gray-300` | `rounded-md`  | White      | `h-4 w-4` | `h-8`  |
| **Action Button** | `px-4 py-1.5` | `border-gray-300` | `rounded-md`  | White      | `h-4 w-4` | `h-8`  |

#### Active States

- **Favorites Active**: `bg-primary-50 text-primary-700 border-primary-200`
- **Hover States**: `hover:border-gray-400 hover:bg-gray-50`

### Card Spacing Standards

#### Grid Layouts

- **3-Column Grid**: `grid grid-cols-3 gap-3`
- **2-Column Grid**: `grid grid-cols-2 gap-3`
- **Single Column**: `space-y-3`

#### Vertical Spacing

- **Card Sections**: `space-y-6` or `space-y-8`
- **Field Groups**: `space-y-3`
- **Individual Fields**: `space-y-1`

#### Padding

- **Card Content**: `pt-4` (top padding)
- **Icon Buttons**: `p-1.5`
- **Action Buttons**: `px-4 py-1.5`

### Text Hierarchy

#### Font Sizes

| Element          | Size        | Weight        | Color           | Usage            |
| ---------------- | ----------- | ------------- | --------------- | ---------------- |
| **Card Title**   | `text-xl`   | `font-bold`   | `text-gray-900` | Main entity name |
| **Subtitle**     | `text-base` | Normal        | `text-gray-600` | Secondary info   |
| **Field Labels** | `text-xs`   | `font-medium` | `text-gray-400` | Field headers    |
| **Field Values** | `text-sm`   | `font-medium` | `text-gray-900` | Field content    |
| **Placeholder**  | `text-sm`   | Normal        | `text-gray-500` | Empty states     |

#### Color Palette

- **Primary Text**: `text-gray-900`
- **Secondary Text**: `text-gray-600`
- **Muted Text**: `text-gray-500`
- **Label Text**: `text-gray-400`
- **Border**: `border-gray-300`
- **Background**: `bg-gray-100`

### Component Dependencies

#### Required Imports

```typescript
import { InfoCard } from '@/components/shared/InfoCard';
import { InfoField } from '@/components/shared/InfoField';
import { StatusBadge } from '@/components/StatusBadge';
import { TagDisplay } from '@/components/TagDisplay';
import { TagSelector } from '@/components/forms/TagSelector';
```

#### Icon Requirements

```typescript
import {
  User,
  Building2,
  Star,
  MessageSquare,
  Activity,
  Zap,
} from 'lucide-react';
```

## Components

### Tab Navigation Component

The application uses a standardized `TabNavigation` component for all tabbed interfaces across pages (Jobs, People, Companies) and slide-out panels.

#### Design Pattern

```tsx
import { TabNavigation, TabOption } from '@/components/ui/tab-navigation';

const tabOptions: TabOption[] = [
  { id: 'overview', label: 'Overview', count: 0, icon: FileText },
  { id: 'people', label: 'People', count: people.length, icon: User },
  { id: 'jobs', label: 'Jobs', count: jobs.length, icon: Calendar },
];

<TabNavigation
  tabs={tabOptions}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>;
```

#### Visual Style

- **Active Tab**: Blue underline (`border-primary`) with primary text (`text-primary`)
- **Inactive Tabs**: Gray text (`text-gray-500`) with transparent border
- **Count Badges**:
  - Active: Light blue background (`bg-primary/10`) with primary text (`text-primary`)
  - Inactive: Gray background (`bg-gray-100`) with gray text (`text-gray-500`)
- **Icons**: Optional 16px icons with proper spacing
- **Hover States**: Gray underline on hover for inactive tabs

#### Implementation

```tsx
// Standard tab options with counts
const tabOptions = useMemo<TabOption[]>(
  () => [
    { id: 'overview', label: 'Overview', count: 0, icon: FileText },
    { id: 'people', label: 'People', count: people.length, icon: User },
    { id: 'jobs', label: 'Jobs', count: jobs.length, icon: Calendar },
    {
      id: 'activity',
      label: 'Activity',
      count: interactions.length,
      icon: Mail,
    },
  ],
  [people.length, jobs.length, interactions.length]
);
```

### UnifiedTable Component

The application uses a standardized `UnifiedTable` component for all data tables across Jobs, Contacts, and Companies pages.

#### Table Styling Standards (Updated January 2025)

**Row Heights:**

- **Table Rows**: `h-[40px]` (40px / 2.5rem) - Standardized across all tables
- **Table Headers**: `h-[40px]` (40px / 2.5rem) - Matches row height
- **Cell Padding**: `px-4 py-1` (16px horizontal, 4px vertical) - Total 8px vertical padding leaves 32px for content

**Visual Design:**

- **Border System**: `border-r border-gray-200` on cells, removed on last column
- **Hover States**:
  - Row: `hover:bg-gray-100` with `hover:border-l-2 hover:border-primary-400` left border accent
  - Cell text: `group-hover:text-gray-600`
- **Header Style**:
  - Background: `bg-gray-50`
  - Text: `text-xs font-semibold text-gray-700 uppercase tracking-wide`
  - Sticky: `sticky top-0 z-30` when scrollable

**Scrolling:**

- **Scroll Container**: `flex-1 min-h-0 overflow-y-auto overflow-x-auto`
- **Scrollbar**: `scrollbar-thin` for modern appearance
- **Fixed Table Layout**: `table-layout: fixed` with colgroup for consistent column widths

**Implementation Pattern:**

```tsx
<Page title='Jobs Feed' hideHeader>
  <div className='flex flex-col' style={{ height: '100%', minHeight: 0 }}>
    {/* Filters */}
    <div className='flex-shrink-0 pb-4'>
      <FilterControls {...props} />
    </div>

    {/* Table */}
    <div className='flex-1 min-h-0 flex flex-col overflow-hidden'>
      <UnifiedTable
        data={jobs}
        columns={columns}
        tableId='jobs'
        scrollable={true}
        stickyHeaders={true}
        onRowClick={handleRowClick}
        loading={loading}
      />
    </div>

    {/* Pagination */}
    <div className='flex-shrink-0 pt-4'>
      <PaginationControls {...props} />
    </div>
  </div>
</Page>
```

**Usage**: UnifiedTable is used on:

- Jobs Feed page (with tabs: New, Qualified, Skip, All)
- Contacts page (People management)
- Companies page (Company management)
- Slide-out panels (Company Details, Person Details)

### Button Component

**Standard Height**: All buttons use `h-8` (32px) for consistency with dropdowns and action bar elements.

```tsx
// Button Variants (January 2025)
const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md', // Blue primary button
  actionbar: 'border border-border bg-background hover:bg-accent', // For action bars above tables
  outline: 'border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground',
  ghost: 'text-primary hover:bg-primary-light', // No border/background
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
};

// Button Sizes - ALL USE h-8 (32px) HEIGHT
const buttonSizes = {
  default: 'h-8 px-3 py-1.5 text-sm', // Standard button
  sm: 'h-8 px-2.5 py-1 text-xs', // Compact with reduced padding
  xs: 'h-8 px-2 py-1 text-xs', // Minimal padding
  icon: 'h-8 w-8', // Icon-only button (h-8 × h-8)
  lg: 'h-11 px-8 text-base', // Large CTA buttons
};

// Usage Examples
<Button>Primary Action</Button> {/* Blue primary button, h-8 */}
<Button variant='actionbar'>Action Bar Button</Button> {/* For filter bars */}
<Button variant='outline'>Cancel</Button> {/* Secondary action */}
<Button variant='ghost' size='icon'><Edit /></Button> {/* Icon button */}
```

**Button Usage Guidelines:**

1. **Action Bar Buttons**: Use `variant='actionbar'` for buttons in filter bars above tables
2. **Primary Buttons**: Use default variant (blue) for main actions in forms
3. **Secondary Actions**: Use `variant='outline'` for cancel/back buttons
4. **Icon Buttons**: Use `size='icon'` for icon-only buttons
5. **Never override height**: Buttons are already h-8, don't add `className='h-6'` or similar

**Button Hover States (January 2025):**

| Variant             | Hover Color                            | When to Use                                  |
| ------------------- | -------------------------------------- | -------------------------------------------- |
| `default` (primary) | Darker blue (`hover:bg-primary-hover`) | Main actions, submit buttons, important CTAs |
| `actionbar`         | Unified gray (`hover:bg-gray-100`)     | Filter bars, action bars above tables        |
| `outline`           | Unified gray (`hover:bg-gray-100`)     | Cancel, back, secondary actions              |
| `ghost`             | Unified gray (`hover:bg-gray-100`)     | Subtle actions, icon buttons                 |
| `secondary`         | Medium gray (`hover:bg-gray-200`)      | Alternative secondary actions                |
| `destructive`       | Darker red                             | Delete, dangerous actions                    |

**Key Rule**: Only primary buttons (default variant) should use the darker blue hover. All other buttons use neutral gray hovers.

### Form Components

```tsx
// Input styling
<input
  className={cn(
    "w-full px-3 py-2 border border-gray-300 rounded-md",
    "focus:ring-2 focus:ring-primary focus:border-primary",
    "placeholder:text-gray-400",
    "disabled:bg-gray-50 disabled:text-gray-500"
  )}
  placeholder="Enter text..."
/>

// Label styling
<label className="block text-sm font-medium text-gray-700 mb-1">
  Field Label
</label>

// Error message
<p className="mt-1 text-sm text-error-600">
  This field is required
</p>
```

### Status Components

```tsx
// Status badge
const StatusBadge = ({ status, children }) => {
  const variants = {
    active: 'bg-success-100 text-success-800',
    pending: 'bg-warning-100 text-warning-800',
    inactive: 'bg-gray-100 text-gray-800',
    error: 'bg-error-100 text-error-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[status]
      )}
    >
      {children}
    </span>
  );
};

// Progress indicator
<div className='w-full bg-gray-200 rounded-full h-2'>
  <div
    className='bg-primary h-2 rounded-full transition-all duration-300'
    style={{ width: `${progress}%` }}
  />
</div>;
```

## Hover States System (January 2025)

### Hover Color Standards

**Consistent hover states across all interactive elements:**

**Dropdowns & Selects:**

```tsx
'hover:border-gray-300 hover:bg-gray-100 transition-colors';
```

- Medium gray background (`gray-100`) on hover for consistency
- Border changes to `gray-300` on hover
- Smooth transition

**Action Bar Buttons:**

```tsx
'hover:bg-gray-100 transition-colors';
```

- Unified gray-100 hover across all action elements

**Ghost Buttons:**

```tsx
'hover:bg-gray-100 transition-colors';
```

- Unified gray-100 hover for subtle feedback

**Secondary Buttons:**

```tsx
'hover:bg-gray-200 transition-colors';
```

- Medium gray for clear feedback

**Primary Buttons (Blue):**

```tsx
'hover:bg-primary-hover'; // Darker blue
```

- ONLY primary buttons get the darker blue hover
- Used for main actions, submit buttons

**Table Rows:**

```tsx
'hover:bg-gray-100';
```

- Consistent with ghost buttons

### Hover Best Practices

✅ **DO:**

- Use `gray-100` for **ALL** interactive elements (dropdowns, tables, buttons, action bars)
- Use `gray-200` only for backgrounds that need more contrast (e.g., secondary button default state)
- Only use darker blue hover (`primary-hover`) for primary buttons
- Always include `transition-colors` for smooth animations

❌ **DON'T:**

- Don't use `gray-50` for hover states (too light)
- Don't use darker blue hover for non-primary buttons
- Don't mix hover colors inconsistently
- Don't skip transition effects
- Don't use `primary-hover` for secondary actions

## Icons & Imagery

### Icon System

Using Lucide React for consistent iconography:

```tsx
import {
  User,
  Building2,
  Briefcase,
  BarChart3,
  Activity,
  Settings,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

// Icon sizing
<User className="h-4 w-4" />  // Small (16px)
<User className="h-5 w-5" />  // Medium (20px)
<User className="h-6 w-6" />  // Large (24px)
<User className="h-8 w-8" />  // Extra large (32px)

// Icon with text
<div className="flex items-center gap-2">
  <User className="h-4 w-4 text-gray-500" />
  <span className="text-sm text-gray-700">User Profile</span>
</div>
```

### Icon Guidelines

- **Size**: Use consistent sizing (16px, 20px, 24px, 32px)
- **Color**: Match text color or use semantic colors
- **Alignment**: Center-align with adjacent text
- **Spacing**: Use consistent gap between icon and text

### Company Logos

```tsx
// Logo display with fallback
const CompanyLogo = ({ company, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'rounded-lg bg-gray-100 flex items-center justify-center',
        sizeClasses[size]
      )}
    >
      {company.logo_url ? (
        <img
          src={company.logo_url}
          alt={`${company.name} logo`}
          className='h-full w-full object-contain rounded-lg'
        />
      ) : (
        <Building2 className='h-1/2 w-1/2 text-gray-400' />
      )}
    </div>
  );
};
```

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
/* Default: 0px and up (mobile) */

@media (min-width: 640px) {
  /* sm: tablet */
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  /* md: small desktop */
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  /* lg: desktop */
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  /* xl: large desktop */
  .xl\:grid-cols-5 {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

### Responsive Patterns

```tsx
// Responsive grid
<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Cards adapt to screen size */}
</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* Padding increases on larger screens */}
</div>

// Hide/show elements
<div className="hidden md:block">
  {/* Only visible on medium screens and up */}
</div>

<div className="block md:hidden">
  {/* Only visible on small screens */}
</div>
```

### Mobile Considerations

- **Touch Targets**: Minimum 44px for interactive elements
- **Navigation**: Collapsible mobile menu
- **Tables**: Horizontal scroll or stacked layout (see [Table Pagination Guide](../COMPONENTS/TABLE_PAGINATION_GUIDE.md))
- **Charts**: Responsive sizing and simplified on mobile

## Accessibility

### Color Contrast

- **AA Standard**: 4.5:1 for normal text, 3:1 for large text
- **AAA Standard**: 7:1 for normal text, 4.5:1 for large text

```css
/* High contrast combinations */
.text-gray-900 {
  color: #111827;
} /* 16.8:1 on white */
.text-gray-700 {
  color: #374151;
} /* 9.3:1 on white */
.text-gray-600 {
  color: #4b5563;
} /* 7.1:1 on white */
.text-gray-500 {
  color: #6b7280;
} /* 4.9:1 on white */
```

### Focus States

```css
/* Focus ring for interactive elements */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px hsl(var(--primary));
}

/* Focus visible for keyboard navigation */
.focus-visible\:ring-2:focus-visible {
  box-shadow: 0 0 0 2px hsl(var(--primary));
}
```

### Semantic HTML

```tsx
// Use proper heading hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

// Use semantic elements
<main>
  <section>
    <article>
      <header>
        <h2>Article Title</h2>
      </header>
      <p>Article content...</p>
    </article>
  </section>
</main>

// Use proper form labels
<label htmlFor="email">Email Address</label>
<input id="email" type="email" required />

// Use ARIA attributes when needed
<button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</button>
```

### Screen Reader Support

```tsx
// Skip links for keyboard navigation
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Screen reader only text
<span className="sr-only">
  Current page: Dashboard
</span>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Descriptive alt text
<img
  src="chart.png"
  alt="Bar chart showing 45% increase in leads over the last month"
/>
```

### Keyboard Navigation

- **Tab Order**: Logical tab sequence through interactive elements
- **Focus Management**: Proper focus handling in modals and dropdowns
- **Keyboard Shortcuts**: Common shortcuts (Escape to close, Enter to submit)
- **Skip Links**: Allow users to skip repetitive navigation

---

_For implementation details, see [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)_
_For troubleshooting design issues, see [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)_
