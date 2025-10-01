# Popup Design Standards & Guidelines

## Overview
This document outlines the design standards and guidelines for all popup components in the CRM system, ensuring consistency across lead, company, and job popups.

## Last Updated
December 2024

## Header Design Standards

### Header Height
- **Standard Height**: All header elements use `h-8` (32px) for consistent vertical alignment
- **Padding**: Action buttons use `p-2` to achieve the standard height
- **Status Badge**: Matches the `h-8` height standard

### Header Action Buttons

#### Primary Action Buttons (Blue)
These buttons use the sidebar primary color scheme:
- **Automate Button**: `bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground`
- **Notes Button**: `bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground`
- **User Assignment Display**: `h-8` with blue styling

#### Secondary Action Buttons (Gray)
These buttons use neutral gray styling:
- **Favorite Toggle**: `text-gray-500 hover:text-gray-700`
- **Activity Button**: `text-gray-500 hover:text-gray-700`

#### Button Styling
```css
/* Primary Action Buttons */
.className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground transition-colors p-2 border border-sidebar-primary/20 rounded-md hover:border-sidebar-primary/30"

/* Secondary Action Buttons */
.className="text-gray-500 hover:text-gray-700 transition-colors p-2 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50"
```

## Card Design Standards

### InfoCard Wrapper
All popup cards use the `InfoCard` component with consistent settings:
- **Title**: Entity-specific titles (e.g., "Lead Information", "Company Information", "Job Information")
- **Content Spacing**: `space-y-6 pt-4` for consistent vertical spacing
- **Divider**: `showDivider={true}` for visual separation
- **Action Button**: Optional action button in header (e.g., Automate button for leads)

### Lead Info Card
- **Layout**: 3-column grid layout
- **Lead Icon**: `w-16 h-16` with `User` icon
- **Status Alignment**: Horizontal layout with `flex items-center gap-2`
- **Text Sizes**: 
  - Headers: `text-xs font-medium text-gray-400`
  - Values: `text-sm text-gray-900 font-medium`
- **Tags Section**: Person-specific tags with add/remove functionality

### Company Info Card
- **Layout**: 3-column grid layout (header section)
- **Company Logo**: `w-12 h-12` (aligned with lead card)
- **Company Name**: `text-lg font-bold` (aligned with lead name)
- **Website & LinkedIn Icons**: Positioned directly next to company name
- **Logo Source**: Clearbit API with fallback to `Building2` icon
- **AI Score Badge**: `px-2 py-1.5` for consistent height
- **Header Spacing**: `pt-1` for minimal top padding
- **Tags Section**: Company-specific tags

### Job Info Card
- **Layout**: 3-column grid layout
- **Job Title**: `text-xl font-bold` (prominent)
- **Company Name**: `text-base text-gray-600`
- **Key Details**: Salary, Location, Employment Type in first row
- **Additional Details**: Function, Seniority, Posted Date in second row
- **AI Job Summary**: Moved to bottom, renamed from "AI Analysis"

## Button Height Standards

### Standard Height: `h-8` (32px)
All interactive elements in popups must use this height:

#### Header Buttons
- Favorite Toggle: `p-2` (achieves `h-8`)
- Notes Button: `p-2` (achieves `h-8`)
- Activity Button: `p-2` (achieves `h-8`)
- Automate Button: `p-2` (achieves `h-8`)
- User Assignment: `h-8` (explicit height)

#### Content Buttons
- Add Note Button: `h-8 px-3`
- Save Note Button: `h-8`
- Cancel Note Button: `h-8`
- Generate AI Summary: `h-8 px-3 text-xs`
- Show More/Less: `h-8 px-2 text-xs`
- Automate Button (Related Items): `!h-8 min-h-[32px]`

## Typography Standards

### Headers
- **Size**: `text-xs font-medium text-gray-400`
- **Style**: No uppercase, no tracking
- **Examples**: "Status", "Contact", "Location", "Salary Range"

### Values
- **Size**: `text-sm text-gray-900 font-medium`
- **Style**: Consistent across all info fields
- **Examples**: Lead names, company names, job titles

### Special Cases
- **Job Title**: `text-xl font-bold text-gray-900` (larger for prominence)
- **Company Name**: `text-base text-gray-600` (slightly larger)

## Color Standards

### Primary Colors
- **Sidebar Primary**: `sidebar-primary` (blue)
- **Sidebar Primary Foreground**: `sidebar-primary-foreground` (white)
- **Hover States**: `sidebar-primary/90`, `sidebar-primary/80`

### Neutral Colors
- **Text Primary**: `text-gray-900`
- **Text Secondary**: `text-gray-500`
- **Text Muted**: `text-gray-400`
- **Borders**: `border-gray-300`, `border-gray-200`

### Status Colors
- **Success**: `text-green-700`, `bg-green-50`, `border-green-200`
- **Warning**: `text-yellow-700`, `bg-yellow-50`, `border-yellow-200`
- **Error**: `text-red-700`, `bg-red-50`, `border-red-200`
- **Info**: `text-blue-700`, `bg-blue-50`, `border-blue-200`

## Spacing Standards

### Card Padding
- **Standard**: `p-8` for main card content
- **Compact**: `p-6` for smaller cards
- **Minimal**: `p-4` for tight layouts

### Grid Spacing
- **Column Gap**: `gap-3` for 3-column layouts
- **Row Spacing**: `space-y-6` for vertical spacing
- **Button Spacing**: `gap-2` for button groups

### Section Spacing
- **Between Sections**: `space-y-6 pt-4`
- **Within Sections**: `space-y-1` for label-value pairs
- **Tag Spacing**: `space-y-2` for tag lists

## Icon Standards

### Icon Sizes
- **Header Icons**: `h-4 w-4`
- **Card Icons**: `h-4 w-4` for inline icons
- **Large Icons**: `h-10 w-10` for entity avatars
- **Small Icons**: `h-3 w-3` for buttons and tags

### Icon Usage
- **User**: Lead avatars and user assignments
- **Building2**: Company logos (fallback)
- **Briefcase**: Job icons
- **Star**: Favorite toggle
- **MessageSquare**: Notes button
- **Activity**: Activity button
- **Zap**: Automate button
- **Plus**: Add buttons

## Component Architecture

### Main Components
- **EntityDetailPopup**: Main popup container
- **PopupModal**: Generic modal wrapper
- **LeadInfoCard**: Lead-specific information
- **CompanyInfoCard**: Company-specific information
- **JobInfoCard**: Job-specific information
- **InfoCard**: Reusable card wrapper
- **InfoField**: Reusable field component

### Data Management
- **useEntityData**: Unified data fetching hook
- **useEntityTags**: Tag management hook
- **useAssignmentState**: Assignment state management
- **usePopupNavigation**: Navigation context

## Implementation Checklist

When implementing or updating popup components:

- [ ] Use `InfoCard` wrapper with consistent props
- [ ] Apply `h-8` height to all interactive elements
- [ ] Use sidebar primary colors for primary actions
- [ ] Use gray colors for secondary actions
- [ ] Apply consistent typography standards
- [ ] Use proper spacing (`space-y-6 pt-4`)
- [ ] Include divider lines where appropriate
- [ ] Test responsive behavior
- [ ] Verify accessibility compliance

## Migration Notes

### Removed Components
- `OptimizedPopup.tsx` - Replaced by `EntityDetailPopup`
- `SimplePopupManager.tsx` - Functionality moved to unified system

### Updated Components
- All popup cards now use `InfoCard` wrapper
- Header buttons standardized to `h-8` height
- Color scheme updated to use sidebar primary
- Typography standardized across all cards

## Future Considerations

- Consider adding animation standards
- Implement dark mode color variants
- Add mobile-specific layout adjustments
- Consider accessibility improvements
- Add keyboard navigation standards
