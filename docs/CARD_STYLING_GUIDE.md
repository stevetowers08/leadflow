# 🎨 Empowr CRM Card Styling Guide

**Last Updated**: January 2025  
**Version**: 2.0  
**Maintained by**: Development Team

## 📋 Overview

This document defines the standardized styling for all popup cards in the Empowr CRM system. All cards must follow these guidelines to ensure visual consistency and maintainability.

## 🎯 Design Principles

### Core Principles
- **Consistency**: All cards use the same base styling
- **Hierarchy**: Clear visual hierarchy with proper text sizing
- **Accessibility**: Proper contrast ratios and readable text sizes
- **Responsiveness**: Cards adapt to different screen sizes
- **Performance**: Minimal CSS overhead

## 🏗️ Base Components

### InfoCard Wrapper
```typescript
<InfoCard 
  title="Card Title" 
  contentSpacing="space-y-6 pt-4" 
  showDivider={true}
>
  {/* Card content */}
</InfoCard>
```

**Properties**:
- `title`: Card section title
- `contentSpacing`: `"space-y-6 pt-4"` (standard spacing)
- `showDivider`: `true` for main cards, `false` for sub-cards

### InfoField Component
```typescript
<InfoField 
  label="Field Label" 
  value="Field Value" 
/>
```

**Styling**:
- Label: `text-xs font-medium text-gray-400`
- Value: `text-sm text-gray-900 font-medium`

## 📊 Card Specifications

### 1. LeadInfoCard
**File**: `src/components/popup/LeadInfoCard.tsx`  
**Last Updated**: January 2025  
**Status**: ✅ Current

#### Structure
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

#### Key Styling Rules
- **Logo Size**: `w-16 h-16` (medium)
- **Icon Size**: `w-10 h-10` (medium)
- **Title**: `text-xl font-bold` (large)
- **Subtitle**: `text-sm text-gray-500` (small)
- **Headers**: `text-xs font-medium text-gray-400` (extra small)
- **Values**: `text-sm text-gray-900 font-medium` (small)
- **Spacing**: `space-y-6 pt-4` (standard)
- **Divider**: `showDivider={true}` (enabled)

### 2. CompanyInfoCard
**File**: `src/components/popup/CompanyInfoCard.tsx`  
**Last Updated**: January 2025  
**Status**: ✅ Current

#### Structure
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

#### Key Styling Rules
- **Logo Size**: `w-12 h-12` (aligned with lead card)
- **Icon Size**: `w-8 h-8` (Building2 fallback)
- **Title**: `text-lg font-bold` (aligned with lead name)
- **Subtitle**: `text-sm text-gray-500` (small)
- **Icons**: LinkedIn and Website icons positioned next to company name
- **AI Score Badge**: `h-7 px-2` for consistent height
- **Layout**: Always 3-column grid for header section
- **Spacing**: `pt-1` for minimal top padding
- **Headers**: `text-xs font-medium text-gray-400` (extra small)
- **Values**: `text-sm text-gray-900 font-medium` (small)
- **Spacing**: `space-y-8` (large)
- **Divider**: `showDivider={false}` (disabled)

### 3. JobInfoCard
**File**: `src/components/popup/JobInfoCard.tsx`  
**Last Updated**: January 2025  
**Status**: ✅ Current

#### Structure
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

#### Key Styling Rules
- **Title**: `text-xl font-bold` (large)
- **Company Name**: `text-base text-gray-600` (medium)
- **Headers**: `text-xs font-medium text-gray-400` (extra small)
- **Values**: `text-sm text-gray-900 font-medium` (small)
- **Spacing**: `space-y-6 pt-4` (standard)
- **Divider**: `showDivider={true}` (enabled)

## 🎨 Header Action Buttons

### Standard Styling
```typescript
// Icon Buttons (Star, Message, Activity)
className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50"

// Action Button (Automate)
className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground px-4 py-1.5 h-8 text-sm font-medium flex items-center justify-center rounded-md"
```

### Button Specifications
| Button Type | Padding | Border | Corner Radius | Background | Icon Size |
|-------------|---------|--------|---------------|------------|-----------|
| **Icon Buttons** | `p-1.5` | `border-gray-300` | `rounded-md` | White | `h-4 w-4` |
| **Action Button** | `px-4 py-1.5` | None | `rounded-md` | Blue | `h-4 w-4` |

## 📏 Spacing Standards

### Grid Layouts
- **3-Column Grid**: `grid grid-cols-3 gap-3`
- **2-Column Grid**: `grid grid-cols-2 gap-3`
- **Single Column**: `space-y-3`

### Vertical Spacing
- **Card Sections**: `space-y-6` or `space-y-8`
- **Field Groups**: `space-y-3`
- **Individual Fields**: `space-y-1`

### Padding
- **Card Content**: `pt-4` (top padding)
- **Icon Buttons**: `p-1.5`
- **Action Buttons**: `px-4 py-1.5`

## 🎯 Text Hierarchy

### Font Sizes
| Element | Size | Weight | Color | Usage |
|---------|------|--------|-------|-------|
| **Card Title** | `text-xl` | `font-bold` | `text-gray-900` | Main entity name |
| **Subtitle** | `text-base` | Normal | `text-gray-600` | Secondary info |
| **Field Labels** | `text-xs` | `font-medium` | `text-gray-400` | Field headers |
| **Field Values** | `text-sm` | `font-medium` | `text-gray-900` | Field content |
| **Placeholder** | `text-sm` | Normal | `text-gray-500` | Empty states |

### Color Palette
- **Primary Text**: `text-gray-900`
- **Secondary Text**: `text-gray-600`
- **Muted Text**: `text-gray-500`
- **Label Text**: `text-gray-400`
- **Border**: `border-gray-300`
- **Background**: `bg-gray-100`

## 🔧 Component Dependencies

### Required Imports
```typescript
import { InfoCard } from '@/components/shared/InfoCard';
import { InfoField } from '@/components/shared/InfoField';
import { StatusBadge } from '@/components/StatusBadge';
import { TagDisplay } from '@/components/TagDisplay';
import { TagSelector } from '@/components/forms/TagSelector';
```

### Icon Requirements
```typescript
import { User, Building2, Star, MessageSquare, Activity, Zap } from 'lucide-react';
```

## 📋 Implementation Checklist

### Before Creating/Modifying Cards
- [ ] Use `InfoCard` wrapper with proper props
- [ ] Follow text hierarchy (xs labels, sm values)
- [ ] Use consistent spacing (`space-y-6` or `space-y-8`)
- [ ] Include proper divider settings
- [ ] Use `InfoField` for simple label-value pairs
- [ ] Follow grid layout standards
- [ ] Include proper error handling
- [ ] Test responsive behavior

### Code Review Checklist
- [ ] All text sizes follow hierarchy
- [ ] Spacing is consistent with other cards
- [ ] Icons are properly sized (`h-4 w-4` for buttons, `h-10 h-10` for logos)
- [ ] Colors follow the defined palette
- [ ] No hardcoded styles that break consistency
- [ ] Proper TypeScript types
- [ ] Error boundaries and loading states

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This
```typescript
// Wrong: Inconsistent text sizes
<div className="text-lg font-bold">{title}</div>
<div className="text-base">{value}</div>

// Wrong: Hardcoded colors
<div className="text-black">{content}</div>

// Wrong: Inconsistent spacing
<div className="space-y-4">
  <div className="space-y-8">
```

### ✅ Do This Instead
```typescript
// Correct: Follow text hierarchy
<div className="text-xl font-bold text-gray-900">{title}</div>
<div className="text-sm text-gray-900 font-medium">{value}</div>

// Correct: Use design tokens
<div className="text-gray-900">{content}</div>

// Correct: Consistent spacing
<div className="space-y-6">
  <div className="space-y-3">
```

## 📈 Future Updates

### Version History
- **v2.0** (January 2025): Standardized all card styling, removed icons from key fields, consistent text hierarchy
- **v1.0** (December 2024): Initial card designs with basic styling

### Planned Improvements
- [ ] Dark mode support
- [ ] Animation transitions
- [ ] Accessibility improvements
- [ ] Mobile-first responsive design

---

**Remember**: Consistency is key! When in doubt, refer to existing cards and follow the established patterns. When making changes, update this documentation and notify the team.
