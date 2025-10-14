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
    primary: '#3b82f6',      // Blue
    secondary: '#6366f1',    // Indigo
    success: '#10b981',      // Green
    warning: '#f59e0b',      // Amber
    error: '#ef4444',        // Red
    muted: '#6b7280',        // Gray
    background: '#ffffff',   // White
    surface: '#f9fafb',      // Light gray
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};
```

## Typography

### Font Stack
- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, -apple-system, sans-serif
- **Monospace**: 'Fira Code', 'Consolas', monospace

### Type Scale
```css
/* Headings */
.text-3xl { font-size: 1.875rem; font-weight: 700; } /* Page titles */
.text-2xl { font-size: 1.5rem; font-weight: 600; }   /* Section titles */
.text-xl  { font-size: 1.25rem; font-weight: 600; }  /* Card titles */
.text-lg  { font-size: 1.125rem; font-weight: 500; } /* Subheadings */

/* Body text */
.text-base { font-size: 1rem; font-weight: 400; }    /* Default body */
.text-sm   { font-size: 0.875rem; font-weight: 400; } /* Secondary text */
.text-xs   { font-size: 0.75rem; font-weight: 400; }  /* Captions */
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
/* Primary Blue - Main brand color */
--primary-50:  #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;  /* Main primary */
--primary-600: #2563eb;
--primary-900: #1e3a8a;

/* Secondary Indigo - Accent color */
--secondary-50:  #eef2ff;
--secondary-100: #e0e7ff;
--secondary-500: #6366f1;  /* Main secondary */
--secondary-600: #5b21b6;
--secondary-900: #312e81;
```

### Semantic Colors
```css
/* Success Green */
--success-50:  #ecfdf5;
--success-100: #d1fae5;
--success-500: #10b981;  /* Main success */
--success-600: #059669;
--success-900: #064e3b;

/* Warning Amber */
--warning-50:  #fffbeb;
--warning-100: #fef3c7;
--warning-500: #f59e0b;  /* Main warning */
--warning-600: #d97706;
--warning-900: #78350f;

/* Error Red */
--error-50:  #fef2f2;
--error-100: #fee2e2;
--error-500: #ef4444;  /* Main error */
--error-600: #dc2626;
--error-900: #7f1d1d;
```

### Neutral Grays
```css
/* Gray scale for text and backgrounds */
--gray-50:  #f9fafb;  /* Light backgrounds */
--gray-100: #f3f4f6;  /* Card backgrounds */
--gray-200: #e5e7eb;  /* Borders */
--gray-300: #d1d5db;  /* Disabled states */
--gray-400: #9ca3af;  /* Placeholder text */
--gray-500: #6b7280;  /* Secondary text */
--gray-600: #4b5563;  /* Primary text */
--gray-700: #374151;  /* Headings */
--gray-800: #1f2937;  /* Dark headings */
--gray-900: #111827;  /* Highest contrast */
```

### Usage Guidelines
```tsx
// Status indicators
<Badge className="bg-success-100 text-success-800">Active</Badge>
<Badge className="bg-warning-100 text-warning-800">Pending</Badge>
<Badge className="bg-error-100 text-error-800">Failed</Badge>

// Interactive elements
<Button className="bg-primary-500 hover:bg-primary-600 text-white">
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

### Layout Consistency
- **Full-screen background**: Fixed gradient covering entire viewport
- **Content container**: Negative margins to break out of Layout padding
- **Responsive spacing**: `px-4 py-6` on mobile, `px-6` on desktop
- **Max width**: `max-w-7xl` for optimal reading width
- **Vertical spacing**: `space-y-6` between major sections

### Card Integration
All cards within pages should:
- Use solid white backgrounds (`bg-white`)
- Have consistent shadows and borders
- Support hover states with smooth transitions
- Be clickable where appropriate (opening popups)
- Include company logos when available

## Layout & Spacing

### Grid System
```css
/* Container widths */
.container-sm  { max-width: 640px; }   /* Mobile */
.container-md  { max-width: 768px; }   /* Tablet */
.container-lg  { max-width: 1024px; }  /* Desktop */
.container-xl  { max-width: 1280px; }  /* Large desktop */
.container-2xl { max-width: 1536px; }  /* Extra large */

/* Grid layouts */
.grid-cols-1   { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2   { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3   { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4   { grid-template-columns: repeat(4, 1fr); }
```

### Spacing Scale
```css
/* Padding and margin utilities */
.p-1  { padding: 0.25rem; }   /* 4px */
.p-2  { padding: 0.5rem; }    /* 8px */
.p-3  { padding: 0.75rem; }   /* 12px */
.p-4  { padding: 1rem; }      /* 16px */
.p-6  { padding: 1.5rem; }    /* 24px */
.p-8  { padding: 2rem; }      /* 32px */
.p-12 { padding: 3rem; }      /* 48px */

/* Gap utilities for flex/grid */
.gap-1 { gap: 0.25rem; }      /* 4px */
.gap-2 { gap: 0.5rem; }       /* 8px */
.gap-3 { gap: 0.75rem; }      /* 12px */
.gap-4 { gap: 1rem; }         /* 16px */
.gap-6 { gap: 1.5rem; }       /* 24px */
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

### Action Element Heights - **FINAL STANDARD**
- **All Action Elements**: `h-8` (32px height) - **MANDATORY**
- **Search Icon Button**: `h-8 w-8` (32px × 32px)
- **Dropdown Selects**: `h-8` (32px height)
- **Filter Buttons**: `h-8` (32px height)
- **Sort Controls**: `h-8` (32px height)
- **Input Fields**: `h-8` (32px height)
- **Icon Buttons**: `h-8` (32px height)
- **Action Buttons**: `h-8` (32px height)

### Action Bar Styling - **UNIFIED PATTERN**
All action bars across pages and popups now use consistent styling:

#### Dropdown Selects
```tsx
className="min-w-32 bg-white h-8 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50"
```

#### Icon Buttons (Favorites, etc.)
```tsx
className="h-8 w-8 rounded-md border flex items-center justify-center transition-colors bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
```

#### Sort Order Button
```tsx
className="px-2 h-8 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center transition-colors"
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
- **All Table Rows**: `min-h-[56px]` (56px minimum height) - **MANDATORY**
- **Table Headers**: `min-h-[56px]` (56px minimum height) - **MANDATORY**
- **Table Cells**: `px-4 min-h-[56px]` (16px horizontal padding, 56px minimum height)
- **Action Buttons in Rows**: `h-8 w-8` (32px × 32px)
- **Status Badges in Rows**: `min-h-[56px]` (56px minimum height to match row)
- **Avatars in Rows**: `w-8 h-8` (32px × 32px)
- **Icons in Rows**: `h-4 w-4` (16px × 16px)

### Table Implementation Pattern
```tsx
// Import EnhancedTable Components
import { 
  EnhancedTable, 
  EnhancedTableBody, 
  EnhancedTableCell, 
  EnhancedTableHead, 
  EnhancedTableHeader, 
  EnhancedTableRow 
} from "@/components/ui/enhanced-table";

// Table Structure
<div className="bg-white rounded-lg border border-gray-200">
  <EnhancedTable dualScrollbars={false} stickyHeader={true} maxHeight="600px">
    <EnhancedTableHeader>
      <EnhancedTableRow className="transition-colors data-[state=selected]:bg-muted hover:bg-muted/50 border-b border-gray-200 bg-gray-50/50">
        <EnhancedTableHead className="h-8 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center min-h-[56px]" scope="col" style={{width: '120px', minWidth: '120px'}}>
          <div className="flex items-center gap-2 justify-center">
            <span>Status</span>
          </div>
        </EnhancedTableHead>
        {/* ... other headers ... */}
      </EnhancedTableRow>
    </EnhancedTableHeader>
    <EnhancedTableBody>
      {data.map((item, index) => (
        <EnhancedTableRow 
          key={item.id} 
          className="data-[state=selected]:bg-muted border-b border-gray-100 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-200 transition-colors duration-200 group cursor-pointer relative min-h-[56px]" 
          role="row" 
          tabIndex={0} 
          aria-label={`Row ${index + 1}`}
          onClick={() => handleRowClick(item)}
        >
          <EnhancedTableCell className="align-middle [&:has([role=checkbox])]:pr-0 text-sm font-normal leading-tight px-4 border-r border-gray-50 last:border-r-0 group-hover:border-r-gray-100 group-hover:last:border-r-0 min-h-[56px] text-center" style={{width: '120px', minWidth: '120px'}}>
            {/* Cell content */}
          </EnhancedTableCell>
          {/* ... other cells ... */}
        </EnhancedTableRow>
      ))}
    </EnhancedTableBody>
  </EnhancedTable>
</div>
```

### Button Specifications
| Button Type | Padding | Border | Corner Radius | Background | Icon Size | Height |
|-------------|---------|--------|---------------|------------|-----------|--------|
| **Icon Buttons** | `p-1.5` | `border-gray-300` | `rounded-md` | White | `h-4 w-4` | `h-8` |
| **Action Button** | `px-4 py-1.5` | None | `rounded-md` | Blue | `h-4 w-4` | `h-8` |
| **Search Icon** | `p-1.5` | `border-border` | `rounded-md` | White | `h-4 w-4` | `h-8` |
| **Dropdown Select** | `px-3 py-2` | `border-border` | `rounded-md` | White | `h-4 w-4` | `h-8` |
| **Filter Button** | `px-3 py-2` | `border-border` | `rounded-md` | White | `h-4 w-4` | `h-8` |

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
- **Unified Hover States**: `hover:shadow-md hover:scale-[1.01] transition-all duration-200`
- **Standardized Borders**: `border border-gray-200` for all variants
- **Rounded Corners**: `rounded-2xl` for modern feel

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
- **Clickability**: All cards open popups via `usePopupNavigation`
- **Examples**:

```tsx
<ModernCard variant="minimal" className="p-4">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-sm font-semibold text-gray-900">Recent Jobs</h3>
    <button className="text-xs font-medium text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200">
      View all
    </button>
  </div>
  <div className="space-y-2.5">
    {jobs.slice(0, 4).map((job) => (
      <ListCard
        key={job.id}
        title={job.title}
        subtitle={`${job.company} • ${job.industry}`}
        logo={job.logo || job.company?.profile_image_url}
        onClick={() => openPopup('job', job.id, job.title)}
        variant="minimal"
        badge={
          <span className="px-2 py-0.5 rounded-md text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">New</span>
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
className="h-8 w-8 rounded-md border flex items-center justify-center transition-colors bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50"

// Action Button (Automate) - Consistent with page buttons
className="h-8 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 px-4 py-1.5 text-sm font-medium flex items-center justify-center"
```

#### Button Specifications - **UNIFIED ACROSS PAGES & POPUPS**
| Button Type | Padding | Border | Corner Radius | Background | Icon Size | Height |
|-------------|---------|--------|---------------|------------|-----------|--------|
| **Icon Buttons** | `p-2` | `border-gray-300` | `rounded-md` | White | `h-4 w-4` | `h-8` |
| **Action Button** | `px-4 py-1.5` | `border-gray-300` | `rounded-md` | White | `h-4 w-4` | `h-8` |

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
| Element | Size | Weight | Color | Usage |
|---------|------|--------|-------|-------|
| **Card Title** | `text-xl` | `font-bold` | `text-gray-900` | Main entity name |
| **Subtitle** | `text-base` | Normal | `text-gray-600` | Secondary info |
| **Field Labels** | `text-xs` | `font-medium` | `text-gray-400` | Field headers |
| **Field Values** | `text-sm` | `font-medium` | `text-gray-900` | Field content |
| **Placeholder** | `text-sm` | Normal | `text-gray-500` | Empty states |

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
import { User, Building2, Star, MessageSquare, Activity, Zap } from 'lucide-react';
```

## Components

### Button Component
```tsx
// Button variants
const buttonVariants = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
  outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
  ghost: "hover:bg-gray-100 text-gray-700",
  destructive: "bg-error-500 hover:bg-error-600 text-white",
};

// Button sizes - ALL ACTION ELEMENTS USE h-8 (32px) HEIGHT
const buttonSizes = {
  sm: "px-3 py-1.5 text-sm h-8",     // Small buttons
  md: "px-4 py-2 text-base h-8",      // Standard height for all action elements
  lg: "px-6 py-3 text-lg h-12",      // Large buttons
};

// Usage
<Button variant="primary" size="md">
  Primary Button
</Button>
```

### Form Components
```tsx
// Input styling
<input 
  className={cn(
    "w-full px-3 py-2 border border-gray-300 rounded-md",
    "focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
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
    active: "bg-success-100 text-success-800",
    pending: "bg-warning-100 text-warning-800",
    inactive: "bg-gray-100 text-gray-800",
    error: "bg-error-100 text-error-800",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      variants[status]
    )}>
      {children}
    </span>
  );
};

// Progress indicator
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

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
    <div className={cn(
      "rounded-lg bg-gray-100 flex items-center justify-center",
      sizeClasses[size]
    )}>
      {company.logo_url ? (
        <img 
          src={company.logo_url} 
          alt={`${company.name} logo`}
          className="h-full w-full object-contain rounded-lg"
        />
      ) : (
        <Building2 className="h-1/2 w-1/2 text-gray-400" />
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

@media (min-width: 640px) {  /* sm: tablet */
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 768px) {  /* md: small desktop */
  .md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) { /* lg: desktop */
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}

@media (min-width: 1280px) { /* xl: large desktop */
  .xl\:grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
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
.text-gray-900 { color: #111827; } /* 16.8:1 on white */
.text-gray-700 { color: #374151; } /* 9.3:1 on white */
.text-gray-600 { color: #4b5563; } /* 7.1:1 on white */
.text-gray-500 { color: #6b7280; } /* 4.9:1 on white */
```

### Focus States
```css
/* Focus ring for interactive elements */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--primary-500);
}

/* Focus visible for keyboard navigation */
.focus-visible\:ring-2:focus-visible {
  box-shadow: 0 0 0 2px var(--primary-500);
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

*For implementation details, see [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)*
*For troubleshooting design issues, see [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)*
