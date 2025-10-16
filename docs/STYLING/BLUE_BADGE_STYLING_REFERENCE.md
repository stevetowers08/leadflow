# Blue Badge Styling Reference

## Overview

This document records the exact styling used for status badges on People, Companies, and Jobs pages before implementing the unified system.

## Current Blue Badge Styling

### CSS Classes

```css
border justify-center items-center flex mx-auto bg-blue-50 text-blue-700 border-blue-200 h-8 text-xs font-medium rounded-full text-center px-3
```

### Breakdown

- **Container**: `border justify-center items-center flex mx-auto`
- **Colors**: `bg-blue-50 text-blue-700 border-blue-200`
- **Size**: `h-8 text-xs font-medium`
- **Shape**: `rounded-full`
- **Spacing**: `text-center px-3`

### Visual Appearance

- **Background**: Light blue (`bg-blue-50`)
- **Text**: Dark blue (`text-blue-700`)
- **Border**: Medium blue (`border-blue-200`)
- **Shape**: Fully rounded/pill-shaped (`rounded-full`)
- **Height**: 32px (`h-8`)
- **Text Size**: Extra small (`text-xs`)
- **Font Weight**: Medium (`font-medium`)
- **Padding**: Horizontal 12px (`px-3`)

## Implementation Examples

### People Page

```typescript
<div className='border justify-center items-center flex mx-auto bg-blue-50 text-blue-700 border-blue-200 h-8 text-xs font-medium rounded-full text-center px-3'>
  {getStatusDisplayText(lead.stage || 'new')}
</div>
```

### Companies Page

```typescript
<div className='border justify-center items-center flex mx-auto bg-blue-50 text-blue-700 border-blue-200 h-8 text-xs font-medium rounded-full text-center px-3 min-w-[80px]'>
  {getStatusDisplayText(v || 'new_lead')}
</div>
```

### Jobs Page

```typescript
<div className='border justify-center items-center flex mx-auto bg-blue-50 text-blue-700 border-blue-200 h-8 text-xs font-medium rounded-full text-center px-3 min-w-[80px]'>
  {getStatusDisplayText(getJobStatusFromCompany(job))}
</div>
```

## Key Characteristics

- **Consistent blue color scheme** regardless of status value
- **Pill-shaped appearance** (`rounded-full`)
- **Fixed height** of 32px
- **Centered text** with horizontal padding
- **Medium font weight** for readability
- **Blue border** matching the text color

## Notes

- All status badges use the same blue styling regardless of their actual status value
- The styling creates a uniform, professional appearance
- The `min-w-[80px]` is used on Companies and Jobs pages for consistent column width
- This styling will be preserved when implementing the unified StatusBadge system
