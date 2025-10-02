# 🎨 Empowr CRM Design System

A production-ready design system for maintaining consistency across the Empowr CRM application.

## 📁 Structure

```
src/design-system/
├── tokens.ts          # Design tokens and constants
├── components.tsx     # Reusable page components
└── README.md         # This file

eslint-rules/
└── design-system.js  # ESLint rules for consistency

scripts/
└── check-design-system.ts  # Health check script
```

## 🚀 Quick Start

### 1. Using Design System Components

**Before (hardcoded):**
```tsx
<div className="space-y-4">
  <div className="border-b pb-3">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage job postings</p>
      </div>
    </div>
  </div>
  
  <div className="flex items-center gap-6 mb-4 text-sm">
    <div className="flex items-center gap-2 text-muted-foreground">
      <div className="text-muted-foreground">
        <Briefcase className="h-4 w-4" />
      </div>
      <span className="font-medium">150 active jobs</span>
    </div>
  </div>
</div>
```

**After (design system):**
```tsx
import { Page, StatItemProps } from "@/design-system/components";

const stats: StatItemProps[] = [
  {
    icon: Briefcase,
    value: 150,
    label: "active jobs"
  },
  {
    icon: Zap,
    value: 77,
    label: "automated"
  }
];

<Page
  title="Jobs"
  stats={stats}
  loading={loading}
>
  {/* Your page content */}
</Page>
```

### 2. Using Design Tokens

```tsx
import { designTokens } from "@/design-system/tokens";

// Instead of hardcoded classes
<h1 className="text-xl font-semibold tracking-tight">

// Use design tokens
<h1 className={designTokens.typography.heading.h1}>
```

### 3. Using Logo Tokens

```tsx
import { designTokens } from "@/design-system/tokens";

// Standard logo sizing for tables and lists
<div className={designTokens.logos.container}>
  <img className={designTokens.logos.size} />
  <div className={designTokens.logos.fallback}>
    {companyName.charAt(0)}
  </div>
</div>
```

## 🔧 Available Components

### `Page`
Complete page wrapper with header, stats, and loading state.

```tsx
<Page
  title="Page Title"
  stats={statsArray}
  loading={boolean}
  loadingMessage="Custom loading message"
>
  {/* Page content */}
</Page>
```

**Features:**
- **Bold main title**: `text-2xl font-bold` for prominent page headers
- **Inline stats**: Stats displayed directly below title with icons
- **Consistent spacing**: `space-y-4` for uniform page layout
- **Grey subheader**: All stats text uses `text-muted-foreground`

### `PageHeader`
Consistent page header with title and optional subtitle.

```tsx
<PageHeader 
  title="Jobs" 
  subtitle="Manage job postings"
>
  <Button>Add Job</Button>
</PageHeader>
```

### `StatsBar`
Horizontal stats display with icons.

```tsx
<StatsBar 
  stats={[
    { icon: Users, value: 150, label: "leads" },
    { icon: Building2, value: 45, label: "companies" }
  ]}
/>
```

### `LoadingState`
Consistent loading state with spinner and message.

```tsx
<LoadingState 
  title="Jobs" 
  message="Loading jobs..."
/>
```

## 🎯 Page Header Design Standards

### Current Implementation (2025)

All pages now use a **compact, modern header design**:

```
Jobs
212 active jobs  77 automated  186 pending  1 ending soon
```

**Design Principles:**
- **Main title**: Bold, large (`text-2xl font-bold`) for prominence
- **Stats inline**: Displayed directly below title, not in separate bars
- **Grey subheader**: All stats use `text-muted-foreground` for subtlety
- **Minimal spacing**: `mt-1` between title and stats, `mb-3` for header
- **No dividers**: Clean design without border separators
- **Consistent icons**: Small icons (`h-3 w-3`) with stats

### Updated Pages
- ✅ **Jobs**: Compact header with job statistics
- ✅ **People**: Clean title only
- ✅ **Companies**: Clean title only  
- ✅ **Pipeline**: Clean title only
- ✅ **Conversations**: Clean title only
- ✅ **Automations**: Clean title only
- ✅ **Reporting**: Clean title only
- ✅ **Dashboard**: Clean title only
- ✅ **CRM Info**: Clean title only

## 🛠️ Development Tools

### Design System Health Check
```bash
npm run check-design-system
```

This script checks for:
- ✅ Consistent header styling
- ✅ Proper stats component usage
- ✅ Design token compliance

### ESLint Rules (Optional)
Add to your `.eslintrc.js`:
```javascript
module.exports = {
  extends: ['./eslint-rules/design-system.js'],
  rules: {
    'design-system/consistent-headers': 'error',
    'design-system/use-stats-component': 'warn',
  },
};
```

## 📋 Migration Guide

### Step 1: Replace Headers
```tsx
// Before
<h1 className="text-xl font-semibold tracking-tight">Jobs</h1>

// After
<PageHeader title="Jobs" />
```

### Step 2: Replace Stats
```tsx
// Before
<div className="flex items-center gap-6 mb-4 text-sm">
  {/* hardcoded stats */}
</div>

// After
<StatsBar stats={statsArray} />
```

### Step 3: Replace Loading States
```tsx
// Before
if (loading) {
  return <div>Loading...</div>;
}

// After
<Page loading={loading} loadingMessage="Loading...">
  {/* content */}
</Page>
```

## 🎯 Benefits

- ✅ **Consistency**: All pages look and behave the same
- ✅ **Maintainability**: Change design tokens to update entire app
- ✅ **Developer Experience**: Less boilerplate, more focus on features
- ✅ **Quality**: Automated checks prevent inconsistencies
- ✅ **Scalability**: Easy to add new pages with consistent design
- ✅ **Space Efficiency**: Compact headers maximize content area

## 📏 Logo Sizing Standards

### Consistent Logo Sizing Across All Pages

All company logos should use the standardized sizing tokens:

- **Tables/Lists**: `w-8 h-8` (32px) - Standard size for data tables
- **Compact Views**: `w-6 h-6` (24px) - Small logos for dense layouts  
- **Detail Views**: `w-10 h-10` (40px) - Large logos for popups/modals
- **Headers**: `w-12 h-12` (48px) - Extra large logos for page headers

### Logo Container Standards

```tsx
// Standard logo container - slightly rounded squares
<div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
  <img className="w-8 h-8 rounded-lg object-cover" />
  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
    {companyName.charAt(0)}
  </div>
</div>
```

### Pages Updated
- ✅ **Jobs**: Company logos in table (w-8 h-8, rounded-lg)
- ✅ **Leads**: Company logos in table (w-8 h-8, rounded-lg)  
- ✅ **Companies**: Company logos in table (w-8 h-8, rounded-lg)
- ✅ **Pipeline**: Lead avatars in cards (w-8 h-8, rounded-lg)

### Logo Style Consistency
All logos now use **slightly rounded squares** (`rounded-lg`) instead of circles (`rounded-full`) for a more modern, consistent appearance across all pages.

## 🎨 Sidebar Design Standards

### Current Implementation (2025)

The sidebar uses a **dark, professional design**:

- **Background**: `#2d3e50` (dark blue-gray)
- **Borders**: `#34495e` (slightly lighter for contrast)
- **Width**: `w-56` (224px) - compact but functional
- **Text**: White for titles, grey for secondary text
- **Hover states**: Subtle background changes
- **No dividers**: Clean design without unnecessary borders

### Navigation Structure
```
Empowr CRM
├── Dashboard
├── People
├── Companies  
├── Jobs
├── Pipeline
├── Conversations
├── Campaigns
├── Automations
├── Reporting
└── Settings
```

## 🔮 Future Enhancements

- [ ] Storybook documentation
- [ ] Theme switching support
- [ ] Responsive breakpoint tokens
- [ ] Animation tokens
- [ ] Color palette tokens
- [ ] Component testing utilities

## 📚 Examples

See `src/pages/Jobs-example-with-design-system.tsx` for a complete example of migrating a page to use the design system.
