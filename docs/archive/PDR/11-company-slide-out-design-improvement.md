# PDR 11: Company Slide-Out Design Improvement

**Product Requirements Document**  
**Version**: 1.0  
**Date**: February 2025  
**Status**: 📋 **PENDING**  
**Priority**: P1 (High)  
**Estimated Effort**: 12-16 hours

---

## 📋 Overview

Redesign the company slide-out panel to match modern recruitment platform design patterns, with improved information hierarchy, action buttons, and card-based content organization. The new design will provide quick access to key information in the top bar, distinct sections on the right sidebar, and consistent styling for cards under tabs.

---

## 🎯 Objectives

### Primary Goals

- **Enhanced Information Architecture**: Restructure layout to match reference design with distinct sections
- **Quick Access Bar**: Add comprehensive information in top header for rapid scanning
- **Action Buttons**: Prominent action buttons in top right (Send Email, More Options, Navigation)
- **Right Sidebar Sections**: Create distinct information blocks on the right (Personal/Company Information, Additional Details)
- **Consistent Card Styling**: Improve card design under tabs with consistent styling and visual hierarchy
- **Better Visual Hierarchy**: Improve readability and scannability of company information

### Success Metrics

- **Time to Key Information**: Users can find critical company details in <3 seconds
- **Visual Consistency**: Cards match design patterns from reference screenshot
- **User Satisfaction**: >4.5/5 rating for improved information access
- **Reduced Clicks**: 40% reduction in clicks needed to access common actions

---

## 🏗️ Design Requirements

### 1. Top Bar / Header Enhancement

**Location**: Top of slide-out panel

**Required Elements**:

- **Navigation Controls** (Left):
  - Previous/Next navigation arrows (`< >`)
  - Current position indicator (e.g., "1 out of 56")
  - Breadcrumb navigation (separate PDR 12)

- **Company Profile Section** (Center-Left):
  - Company logo (circular or rounded square, 48x48px)
  - Company name (large, prominent)
  - Status badge/pill (e.g., "Active", "Qualified", color-coded)
  - Key quick-access information below name:
    - "Origin: [source]" (e.g., "Career Site", "LinkedIn")
    - "Added at: [date]" (formatted date)
    - "Pipeline Stage: [stage]"

- **Action Buttons** (Top Right):
  - Primary action button: "Send Email" (green/primary color)
  - More options menu (ellipsis icon `...`)
  - Close button (`X` icon, top right corner)

**Design Specifications**:

```typescript
interface TopBarDesign {
  logo: {
    size: '48x48px';
    shape: 'rounded-lg' | 'circle';
    fallback: 'Building2 icon';
  };
  name: {
    fontSize: 'text-xl font-semibold';
    color: 'text-gray-900';
  };
  statusBadge: {
    style: 'pill-shaped';
    colors: {
      active: 'bg-green-100 text-green-800';
      qualified: 'bg-blue-100 text-blue-800';
      // ... other status colors
    };
  };
  actionButtons: {
    primary: 'Send Email (green button)';
    secondary: 'More options menu';
  };
}
```

### 2. Right Sidebar Sections

**Location**: Right side of main content area (vertical layout)

**Required Sections**:

#### Section 1: Company Information

- Company logo or icon
- Website URL (clickable pill-shaped button, blue)
- Phone number (clickable pill-shaped button, blue)
- Industry
- Company size
- Head office location
- Founded year
- Revenue (if available)

#### Section 2: Key Metrics

- Total people count
- Total jobs count
- Last interaction date
- Pipeline stage
- Lead score
- Qualification date

#### Section 3: Additional Details

- Tags/Labels
- Custom fields
- Notes section (textarea with emoji, hashtag, attachment icons)
- Created by / Last modified by

**Design Specifications**:

- Each section clearly separated with subtle borders or spacing
- Icons for each information type (consistent icon set)
- Clickable elements styled as pill-shaped buttons (email, phone, website)
- Readable typography with proper hierarchy

### 3. Tabs with Improved Card Styling

**Current Tabs**: Overview, People, Jobs, Activity, Notes

**Card Design Requirements**:

- **Consistent Card Structure**:
  - Vertical timeline indicator on left (date badge)
  - Title/Heading prominent
  - Metadata line (time, interviewer, location, etc.)
  - Status indicator with colored dot
  - "Created by" information
  - Action button on right ("View Details", etc.)

- **Card Styling**:
  - White background with subtle border
  - Rounded corners (`rounded-lg` or `rounded-xl`)
  - Hover state with shadow elevation
  - Spacing between cards (16px gap)
  - Consistent padding (16px or 24px)

**Example Card Structure** (for Activity/Interview tabs):

```
┌─────────────────────────────────────────────────────┐
│ [01 Oct]  Aptitude Test                    [View]  │
│           11:00AM - 12:00AM with Bagus Fikri        │
│           Location: Online                           │
│           Status: Completed ●                        │
│           Created by: Raihan Fikri                   │
└─────────────────────────────────────────────────────┘
```

### 4. Better Information Layout

**Main Content Area** (Left):

- Cards organized in vertical list
- Consistent spacing and alignment
- Date/timeline indicators
- Status badges with visual indicators (colored dots)
- Action buttons consistently positioned

**Right Sidebar** (Fixed width ~280px):

- Sticky positioning (scrolls independently)
- Distinct sections with headers
- Icons + text format for all information
- Clickable elements clearly indicated

---

## 📊 Component Structure

### Enhanced Header Component

```typescript
interface EnhancedCompanyHeaderProps {
  company: Company;
  currentIndex?: number;
  totalCount?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onSendEmail?: () => void;
  onMoreOptions?: () => void;
}

// Elements:
// - Navigation arrows and counter
// - Company logo + name + status
// - Quick info (Origin, Added at, Stage)
// - Action buttons (Send Email, More, Close)
```

### Right Sidebar Component

```typescript
interface CompanySidebarProps {
  company: Company;
  peopleCount: number;
  jobsCount: number;
  interactions: Interaction[];
}

// Sections:
// - Company Information
// - Key Metrics
// - Additional Details
// - Notes
```

### Enhanced Card Components

```typescript
interface ActivityCardProps {
  date: string;
  title: string;
  metadata: string;
  location?: string;
  status: 'completed' | 'pending' | 'scheduled';
  createdBy: string;
  onViewDetails?: () => void;
}

interface PeopleCardProps {
  person: Person;
  // Enhanced styling with consistent layout
}

interface JobCardProps {
  job: Job;
  // Enhanced styling with consistent layout
}
```

---

## 🔧 Technical Implementation

### Files to Modify

**Primary Components**:

1. **`src/components/slide-out/CompanyDetailsSlideOut.tsx`**
   - Redesign header with enhanced information
   - Add right sidebar component
   - Update card styling for all tabs
   - Add navigation controls

2. **`src/components/slide-out/SlideOutPanel.tsx`**
   - Support for enhanced header layout
   - Right sidebar positioning
   - Layout grid adjustments

**New Components**:

3. **`src/components/slide-out/CompanyInfoSidebar.tsx`** (NEW)
   - Company information section
   - Key metrics section
   - Additional details section
   - Notes section

4. **`src/components/slide-out/EnhancedCompanyHeader.tsx`** (NEW)
   - Navigation controls
   - Company profile display
   - Quick info display
   - Action buttons

5. **`src/components/slide-out/ActivityCard.tsx`** (NEW)
   - Timeline card component
   - Status indicators
   - Consistent styling

### Styling Updates

**Tailwind Classes**:

- Header: `flex items-center justify-between px-6 py-4 border-b`
- Right sidebar: `w-80 border-l pl-6 pr-6 sticky top-0`
- Cards: `bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md`
- Status dots: `w-2 h-2 rounded-full bg-green-500`
- Action buttons: `px-4 py-2 bg-primary text-white rounded-lg`

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ [← →] 1/56  [Logo] Company Name [Status]  [Actions] [X] │ ← Header
├──────────────────────┬──────────────────────────────────┤
│                      │                                  │
│  [Tabs]              │  Company Information             │
│                      │  ┌─────────────────────────┐     │
│  [Cards]             │  │ Website: example.com    │     │
│  ┌──────────────┐    │  │ Phone: +1-234-567-8900  │     │
│  │ Activity Card│    │  │ Industry: Tech          │     │
│  └──────────────┘    │  └─────────────────────────┘     │
│                      │                                  │
│  ┌──────────────┐    │  Key Metrics                    │
│  │ Activity Card│    │  ┌─────────────────────────┐     │
│  └──────────────┘    │  │ People: 12              │     │
│                      │  │ Jobs: 3                  │     │
│                      │  └─────────────────────────┘     │
│                      │                                  │
│                      │  Notes                           │
│                      │  ┌─────────────────────────┐     │
│                      │  │ [Text area]             │     │
│                      │  └─────────────────────────┘     │
└──────────────────────┴──────────────────────────────────┘
```

---

## 📅 Implementation Phases

### Phase 1: Header Enhancement (3-4 hours)

- [ ] Add navigation controls (previous/next, counter)
- [ ] Enhance company profile display with logo and status
- [ ] Add quick info section (Origin, Added at, Stage)
- [ ] Implement action buttons (Send Email, More, Close)
- [ ] Style header with proper spacing and alignment

### Phase 2: Right Sidebar (4-5 hours)

- [ ] Create CompanyInfoSidebar component
- [ ] Implement Company Information section
- [ ] Implement Key Metrics section
- [ ] Implement Additional Details section
- [ ] Implement Notes section with icons
- [ ] Style sidebar with sticky positioning

### Phase 3: Card Styling Improvements (3-4 hours)

- [ ] Create ActivityCard component with timeline design
- [ ] Update People card styling for consistency
- [ ] Update Jobs card styling for consistency
- [ ] Update Overview tab cards
- [ ] Add hover states and transitions
- [ ] Ensure consistent spacing and alignment

### Phase 4: Integration & Testing (2-3 hours)

- [ ] Integrate all components into CompanyDetailsSlideOut
- [ ] Test responsive behavior
- [ ] Test navigation controls
- [ ] Verify information accuracy
- [ ] Test on different screen sizes
- [ ] Fix any styling inconsistencies

---

## 🎨 Design Reference

Based on the provided screenshot reference, the design should include:

1. **Top Bar**: Navigation, profile, status, actions
2. **Right Sidebar**: Distinct sections with icons and clear typography
3. **Cards**: Timeline-style with date badges, metadata, status dots
4. **Consistent Spacing**: Proper gaps and padding throughout
5. **Color Palette**: Green for active/completed, blue for links, gray for text
6. **Typography**: Clear hierarchy with proper font weights and sizes

---

## ✅ Acceptance Criteria

**Header Enhancement**:

- [ ] Navigation arrows and position counter displayed
- [ ] Company logo, name, and status prominently displayed
- [ ] Quick info (Origin, Added at, Stage) visible
- [ ] Action buttons (Send Email, More, Close) functional
- [ ] Header responsive on mobile devices

**Right Sidebar**:

- [ ] Company Information section displays correctly
- [ ] Key Metrics section shows accurate counts
- [ ] Additional Details section visible
- [ ] Notes section with icons functional
- [ ] Sidebar sticky positioning works
- [ ] Clickable elements (email, phone, website) styled as pills

**Card Styling**:

- [ ] All cards use consistent styling
- [ ] Timeline indicators (date badges) on left
- [ ] Status dots with appropriate colors
- [ ] Action buttons positioned consistently
- [ ] Hover states work properly
- [ ] Cards align properly in grid/list

**Overall**:

- [ ] Design matches reference screenshot structure
- [ ] All information accessible in <3 seconds
- [ ] No visual inconsistencies
- [ ] Responsive on mobile/tablet
- [ ] Performance remains optimal
- [ ] TypeScript types correct
- [ ] No linter errors

---

## 🚀 Future Enhancements (Out of Scope)

- Add search within tabs
- Add filtering within Activity timeline
- Add export functionality
- Add bulk actions on cards
- Add drag-and-drop reordering
- Add custom field configuration

---

## 📚 Related Documentation

- [Company Detail Enhancement PDR](./09-company-detail-enhancement.md)
- [Breadcrumb Links PDR](./12-company-slide-out-breadcrumbs.md)
- [Settings Pages Improvement PDR](./13-settings-pages-improvement.md)
- [Design System Documentation](../../STYLING/DESIGN_SYSTEM.md)

---

## 👥 Stakeholders

**Product Owner**: [To be assigned]  
**Design Lead**: [To be assigned]  
**Engineering Lead**: [To be assigned]

---

**Last Updated**: February 2025  
**Status**: 📋 Awaiting approval to proceed
