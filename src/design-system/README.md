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
    icon: <Briefcase className="h-4 w-4" />,
    value: 150,
    label: "active jobs"
  }
];

<Page
  title="Jobs"
  subtitle="Manage job postings"
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

## 🔧 Available Components

### `Page`
Complete page wrapper with header, stats, and loading state.

```tsx
<Page
  title="Page Title"
  subtitle="Page description"
  stats={statsArray}
  loading={boolean}
  loadingMessage="Custom loading message"
>
  {/* Page content */}
</Page>
```

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
    { icon: <Users className="h-4 w-4" />, value: 150, label: "leads" },
    { icon: <Building2 className="h-4 w-4" />, value: 45, label: "companies" }
  ]}
/>
```

### `LoadingState`
Consistent loading state with spinner and message.

```tsx
<LoadingState 
  title="Jobs" 
  subtitle="Manage job postings"
  message="Loading jobs..."
/>
```

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

## 🔮 Future Enhancements

- [ ] Storybook documentation
- [ ] Theme switching support
- [ ] Responsive breakpoint tokens
- [ ] Animation tokens
- [ ] Color palette tokens
- [ ] Component testing utilities

## 📚 Examples

See `src/pages/Jobs-example-with-design-system.tsx` for a complete example of migrating a page to use the design system.
