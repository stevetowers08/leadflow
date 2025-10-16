# 🎨 Unified Design System - Empowr CRM

## Overview

This document consolidates all design system standards for the Empowr CRM, focusing on badge styling, scoring systems, popup design, and UI consistency across all components.

---

## 🏷️ Badge System Architecture

### Core Principle: **WORDS = BADGES, NUMBERS = CUSTOM STYLING**

#### ✅ **StatusBadge Component** (For Words)

- **Used for**: STATUS, Priority, Text-based AI Scores
- **Values**: Words like "VERY HIGH", "HIGH", "MEDIUM", "LOW", "High", "Medium", "Low"
- **Styling**: `rounded-md` (less rounded), fixed width, proper colors
- **Implementation**: `<StatusBadge status={value} size="sm" />`

#### ✅ **Custom Badge Styling** (For Numbers)

- **Used for**: Numeric AI Scores, Count columns
- **Values**: Numbers like 82, 100, 0, 5, 12
- **Styling**: `rounded-md`, `px-2 py-1`, `text-xs font-medium`
- **Implementation**: Custom span with `getScoreBadgeClasses()` or gray styling

---

## 🎨 Popup Design Standards

### Typography

- **Labels**: `text-xs font-medium text-gray-400 uppercase tracking-wide`
- **Values**: `text-sm text-gray-900 font-medium`
- **Prominent Values**: `text-base font-semibold text-gray-900` (for job titles, salary)

### Layout

- **Grid**: 3-column layout with `gap-4` spacing
- **Spacing**: `space-y-1` between label and value, `space-y-4` between sections
- **Alignment**: `justify-start` for badge alignment

### Badge Styling

- **Custom Badges**: `px-2 py-1 rounded-md text-xs font-medium border`
- **StatusBadge**: Fixed width, `rounded-md` styling
- **Colors**: Consistent color schemes using `bg-*-50` backgrounds

### Header Design

- **Title**: `text-base font-semibold text-gray-900`
- **Subtitle**: `text-xs font-medium text-gray-400`
- **Labels**: `capitalize` class for proper capitalization
- **Badges**: Left-aligned with `justify-start`

### InfoField Component

```typescript
const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
  <div className="space-y-1">
    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
      {label}
    </div>
    <div className="text-sm text-gray-900 font-medium">
      {value || "Not specified"}
    </div>
  </div>
);
```

### Grid Layout

```typescript
<div className="grid grid-cols-3 gap-4">
  <InfoField label="Field 1" value={value1} />
  <InfoField label="Field 2" value={value2} />
  <InfoField label="Field 3" value={value3} />
</div>
```

---

## 📊 Scoring System Implementation

### 1. **People Table (Leads)**

```typescript
// AI Score Column - WORDS = StatusBadge
{
  key: "lead_score",
  label: "AI Score",
  render: (lead: Lead) => (
    <StatusBadge
      status={lead.lead_score || "Medium"}
      size="sm"
    />
  ),
}
```

- **Values**: "High", "Medium", "Low"
- **Component**: StatusBadge
- **Colors**: High=red, Medium=yellow, Low=green

### 2. **Companies Table**

```typescript
// AI Score Column - NUMBERS = Custom Styling
{
  key: "lead_score",
  label: "AI Score",
  render: (company: Company) => (
    <span className={cn(
      "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border",
      getScoreBadgeClasses(company.lead_score ?? null)
    )}>
      {company.lead_score ?? "-"}
    </span>
  ),
}
```

- **Values**: "0", "36", "50", "82", "100" etc.
- **Component**: Custom span with colored backgrounds
- **Colors**: Based on score ranges (85+=green, 70+=blue, 50+=yellow, <50=red)

### 3. **Jobs Table**

```typescript
// Priority Column - WORDS = StatusBadge
{
  key: "priority",
  label: "Priority",
  render: (job: Job) => (
    <StatusBadge
      status={job.priority || "Medium"}
      size="sm"
    />
  ),
}

// AI Score Column - NUMBERS = Custom Styling
{
  key: "lead_score_job",
  label: "AI Score",
  render: (job: Job) => (
    <span className={cn(
      "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border",
      getScoreBadgeClasses(job.lead_score_job ?? null)
    )}>
      {job.lead_score_job ?? "-"}
    </span>
  ),
}
```

- **Priority Values**: "VERY HIGH", "HIGH", "MEDIUM", "LOW"
- **AI Score Values**: 0, 36, 44, 50, 82, 100 etc.

---

## 🎨 Badge Styling Standards

### StatusBadge Component

```typescript
// Updated styling - MODERATE ROUNDING with DYNAMIC COLORS
const sizeStyles = {
  sm: "h-8 text-xs font-medium rounded-md text-center px-3",
  md: "h-9 text-sm font-medium rounded-md text-center px-3",
  lg: "h-10 text-sm font-medium rounded-md text-center px-4"
};

// Main container - DYNAMIC COLORING based on status value
className={cn(
  "border font-medium justify-center items-center flex rounded-md mx-auto",
  styleClass, // This comes from getUnifiedStatusClass(status)
  sizeStyles[size],
  className
)}
```

### Custom Badge Styling

```typescript
// Standard styling for numeric badges
className =
  'inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border';

// Count columns (gray styling)
className =
  'inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 border border-gray-200';
```

---

## 🎯 Color Scheme

### StatusBadge Colors (Words) - DYNAMIC COLORS

- **VERY HIGH**: `bg-red-50 text-red-700 border-red-200`
- **HIGH**: `bg-orange-50 text-orange-700 border-orange-200`
- **MEDIUM**: `bg-yellow-50 text-yellow-700 border-yellow-200`
- **LOW**: `bg-green-50 text-green-700 border-green-200`
- **Implementation**: Colors are determined by `getUnifiedStatusClass(status)` function

### Custom Badge Colors (Numbers)

- **Score ≥85**: `bg-green-50 text-green-700 border-green-200`
- **Score ≥70**: `bg-blue-50 text-blue-700 border-blue-200`
- **Score ≥50**: `bg-yellow-50 text-yellow-700 border-yellow-200`
- **Score <50**: `bg-red-50 text-red-700 border-red-200`
- **Count Columns**: `bg-gray-50 text-gray-500 border-gray-200`

**Note**: AI Score and Leads columns in tables use `cellType: 'ai-score'` and `cellType: 'lead-score'` respectively, but do NOT have background colors. They are centered numeric values with white backgrounds for clean readability.

---

## 📏 Sizing Standards

### Column Widths

- **StatusBadge Columns**: `width: "120px"` (accommodates fixed width)
- **Custom Badge Columns**: `width: "100px"` (more compact)
- **Count Columns**: `width: "100px"` (consistent with custom badges)

### Badge Dimensions

- **StatusBadge sm**: `h-7` (28px height)
- **Custom Badges**: `px-2 py-1` (8px horizontal, 4px vertical padding)
- **Typography**: `text-xs font-medium` (12px, medium weight)

---

## 🔧 Implementation Rules

### ✅ **Use StatusBadge When:**

- Value contains words/text
- Examples: "VERY HIGH", "HIGH", "MEDIUM", "LOW", "High", "Medium", "Low"
- Status indicators, priority levels, text-based scores

### ✅ **Use Custom Styling When:**

- Value contains numbers
- Examples: 82, 100, 0, 5, 12
- Numeric scores, count columns, statistics

### ✅ **Consistent Styling:**

- All badges use `rounded-md` (moderate rounding)
- All badges use `text-xs font-medium`
- All badges have proper borders and backgrounds
- All badges are centered in their columns

---

## 📋 Current Implementation Status

### ✅ **Completed Tables**

1. **Jobs Table**
   - ✅ STATUS: Custom styling with `rounded-md`
   - ✅ Priority: StatusBadge with `rounded-md`
   - ✅ AI Score: Custom styling with `rounded-md`
   - ✅ Leads Count: Custom styling with `rounded-md`

2. **Leads Table**
   - ✅ Status: StatusBadge with `rounded-md`
   - ✅ AI Score: StatusBadge with `rounded-md`

3. **Companies Table**
   - ✅ AI Score: Custom styling with `rounded-md`
   - ✅ People Count: Custom styling with `rounded-md`
   - ✅ Jobs Count: Custom styling with `rounded-md`

### ✅ **Updated Components**

- ✅ StatusBadge: Changed from `rounded-full` to `rounded-md`
- ✅ All custom badges: Use `rounded-md` styling
- ✅ All count columns: Use `rounded-md` styling

### ✅ **Popup Components**

- ✅ Job Info Card: 3-column layout, consistent typography
- ✅ Company Info Card: 3-column layout, consistent typography
- ✅ Lead Info Card: 3-column layout, consistent typography
- ✅ Popup Modal Header: Consistent typography and capitalization
- ✅ Badge Alignment: All badges use `justify-start` alignment
- ✅ Import Fixes: All required utility functions imported

---

## 🚀 Benefits Achieved

1. **Consistency**: All badges now use the same `rounded-md` styling
2. **Clarity**: Clear distinction between word-based (StatusBadge) and number-based (custom) badges
3. **Maintainability**: Centralized styling through StatusBadge component
4. **User Experience**: Consistent visual language across all tables and popups
5. **Developer Experience**: Clear rules for when to use which badge type
6. **Popup Design**: Unified typography, spacing, and layout across all popup components

---

## 📝 Migration Summary

### What Changed

- **StatusBadge**: Updated from `rounded-full` to `rounded-md`
- **Priority Column**: Uses StatusBadge (words = badges)
- **Leads AI Score**: Uses StatusBadge (words = badges)
- **All Custom Badges**: Use `rounded-md` styling
- **All Count Columns**: Use `rounded-md` styling
- **Popup Design**: Unified typography, 3-column layout, consistent spacing
- **Header Design**: Proper capitalization, consistent badge alignment

### Design Principle Applied

**WORDS = BADGES, NUMBERS = CUSTOM STYLING**

This ensures that:

- Text-based values (Priority, Status, Text AI Scores) use the standardized StatusBadge
- Numeric values (AI Scores, Counts) use custom styling with proper colors
- All badges have consistent `rounded-md` styling for visual harmony
- All popups have consistent typography, spacing, and layout

---

## 🆕 Latest Updates (October 16, 2025)

### ✅ **Status Cell Full-Cell Backgrounds**

**Implementation**: Status columns now use full-cell background colors instead of outlined badges

```typescript
// UnifiedTable component automatically applies status colors
<TableCell
  cellType="status"
  statusValue={status}
  // Automatically gets: bg-blue-50 text-blue-700 border-blue-200
>
  <span>{getStatusDisplayText(status)}</span>
</TableCell>
```

**Benefits**:

- **Cleaner appearance**: No more outlined badge styling
- **Better readability**: Full-cell backgrounds are more prominent
- **Consistent implementation**: All V2 tables use the same system
- **Centralized control**: Colors managed by unified color scheme

### ✅ **Logo Size Optimization**

**Size**: Reduced from 32px to 24px (`w-8 h-8` → `w-6 h-6`)

```typescript
// Updated logo implementation
<div className='w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'>
  <img
    src={getClearbitLogo(company.name)}
    alt={company.name}
    className='w-6 h-6 rounded-lg object-cover'
  />
  <Building2 className='h-3 w-3 text-gray-400' />
</div>
```

**Fallback Icon**: Building2 icon reduced to 12px (`h-4 w-4` → `h-3 w-3`)

### ✅ **Row Height Optimization**

**Height**: Reduced from 48px to 44px for better data density

```css
.table-system {
  --table-row-height: 44px;
  --table-header-height: 44px;
}
```

**Impact**: Slightly more compact tables while maintaining readability

### ✅ **CSS Override Resolution**

**Problem**: CSS specificity conflicts prevented unified colors from showing

**Solution**: Updated CSS selectors to exclude status cells from general rules

```css
/* Before: Applied to all cells */
.table-system td {
  background-color: white !important;
}

/* After: Excludes status cells */
.table-system td:not([data-cell-type='status']) {
  background-color: white !important;
}
```

---

**Last Updated**: October 16, 2025  
**Status**: ✅ Complete - All badges and popups updated to unified design system  
**Build Status**: ✅ Passing - All changes tested and working
