# PDR 12: Breadcrumb Links for Company Slide-Out

**Product Requirements Document**  
**Version**: 1.0  
**Date**: February 2025  
**Status**: 📋 **PENDING**  
**Priority**: P1 (High)  
**Estimated Effort**: 4-6 hours

---

## 📋 Overview

Add breadcrumb navigation to the company slide-out panel to improve navigation context and allow users to quickly return to previous pages. Breadcrumbs will display the navigation path from the current company detail view back to the root pages.

---

## 🎯 Objectives

### Primary Goals

- **Navigation Context**: Users always know their current location in the app
- **Quick Navigation**: Enable one-click navigation to parent pages
- **Visual Hierarchy**: Show clear path from root to current page
- **Accessibility**: Screen reader friendly breadcrumb implementation
- **Consistent UX**: Match breadcrumb patterns from other parts of the application

### Success Metrics

- **Navigation Efficiency**: 50% reduction in clicks to return to parent pages
- **User Understanding**: >90% of users can identify their current location
- **Accessibility Score**: WCAG 2.1 AA compliant
- **Time to Navigate**: <1 second to navigate to parent page via breadcrumb

---

## 🏗️ Design Requirements

### Breadcrumb Placement

**Location**: Top of company slide-out header, above or integrated with navigation controls

**Layout Options**:

1. **Above Header** (Preferred):

   ```
   ┌─────────────────────────────────────────────────┐
   │ Companies > Tech Corp > Details              │ ← Breadcrumb
   ├─────────────────────────────────────────────────┤
   │ [← →] 1/56  [Logo] Company Name  [Actions] [X] │ ← Header
   ```

2. **Integrated with Navigation**:
   ```
   ┌─────────────────────────────────────────────────┐
   │ Companies > Tech Corp  [← →] 1/56  [Logo]...  │
   ```

### Breadcrumb Structure

**Typical Paths**:

- From Companies Page: `Companies > [Company Name]`
- From Pipeline Page: `Pipeline > Companies > [Company Name]`
- From Jobs Page: `Jobs > [Job Title] > Company > [Company Name]`
- From People Page: `People > [Person Name] > Company > [Company Name]`
- From Dashboard: `Dashboard > Companies > [Company Name]`

**Breadcrumb Items**:

- **Home/Root**: Optional "Home" or "Dashboard" link
- **Parent Pages**: Clickable links to parent pages (Companies, Pipeline, etc.)
- **Current Page**: Non-clickable text showing current company name
- **Separator**: Chevron icon (`>`) or forward slash (`/`)

### Visual Design

**Styling**:

- Font size: `text-sm` (14px)
- Text color:
  - Links: `text-blue-600 hover:text-blue-800`
  - Current page: `text-gray-900 font-medium`
  - Separators: `text-gray-400`
- Spacing: `gap-2` between items
- Icons: `ChevronRight` from lucide-react, size `h-4 w-4`

**Responsive Behavior**:

- Desktop: Full breadcrumb displayed
- Tablet: Full breadcrumb with slight truncation if needed
- Mobile: Truncate middle items, show first and last (e.g., `Companies > ... > Tech Corp`)

### Interactive Behavior

**Clickable Links**:

- Navigate to parent page when clicked
- Preserve filters/search state if applicable
- Update URL to reflect navigation
- Close slide-out when navigating away

**Hover States**:

- Links show underline on hover
- Color changes to darker blue
- Cursor changes to pointer

**Active/Current Item**:

- Last item (company name) is not clickable
- Displayed with stronger font weight
- Different color to indicate current location

---

## 📊 Implementation Details

### Component Structure

```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CompanySlideOutBreadcrumbsProps {
  companyId: string;
  companyName: string;
  sourcePage?: 'companies' | 'pipeline' | 'jobs' | 'people' | 'dashboard';
  onNavigate?: (href: string) => void;
}

// Usage in CompanyDetailsSlideOut:
<CompanySlideOutBreadcrumbs
  companyId={company.id}
  companyName={company.name}
  sourcePage={currentPage}
  onNavigate={handleBreadcrumbNavigation}
/>
```

### Breadcrumb Generation Logic

```typescript
function generateBreadcrumbs(
  sourcePage: string,
  companyName: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];

  // Add home/dashboard based on context
  switch (sourcePage) {
    case 'companies':
      breadcrumbs.push({ label: 'Companies', href: '/companies' });
      break;
    case 'pipeline':
      breadcrumbs.push({ label: 'Pipeline', href: '/pipeline' });
      breadcrumbs.push({ label: 'Companies', href: '/pipeline?tab=companies' });
      break;
    case 'jobs':
      breadcrumbs.push({ label: 'Jobs', href: '/jobs' });
      breadcrumbs.push({ label: 'Companies', href: '/companies' });
      break;
    case 'people':
      breadcrumbs.push({ label: 'People', href: '/people' });
      breadcrumbs.push({ label: 'Companies', href: '/companies' });
      break;
    case 'dashboard':
      breadcrumbs.push({ label: 'Dashboard', href: '/' });
      breadcrumbs.push({ label: 'Companies', href: '/companies' });
      break;
    default:
      breadcrumbs.push({ label: 'Companies', href: '/companies' });
  }

  // Add current company (non-clickable)
  breadcrumbs.push({ label: companyName });

  return breadcrumbs;
}
```

### Navigation Handler

```typescript
const handleBreadcrumbNavigation = (href: string) => {
  // Close slide-out
  onClose();

  // Navigate to destination
  navigate(href);

  // Optionally preserve filters/state via URL params or state
};
```

---

## 🔧 Technical Implementation

### Files to Modify

**Primary Components**:

1. **`src/components/slide-out/CompanyDetailsSlideOut.tsx`**
   - Add breadcrumb component above header
   - Pass source page information
   - Handle navigation callbacks

2. **`src/components/slide-out/SlideOutPanel.tsx`** (if needed)
   - Support breadcrumb slot/area
   - Adjust header spacing

**New Components**:

3. **`src/components/slide-out/CompanySlideOutBreadcrumbs.tsx`** (NEW)
   - Breadcrumb rendering
   - Navigation logic
   - Responsive truncation

**Pages Using Slide-Out**:

4. **`src/pages/Companies.tsx`**
   - Pass `sourcePage='companies'` prop

5. **`src/pages/Pipeline.tsx`**
   - Pass `sourcePage='pipeline'` prop

6. **`src/pages/Jobs.tsx`** (if applicable)
   - Pass `sourcePage='jobs'` prop

7. **`src/pages/People.tsx`** (if applicable)
   - Pass `sourcePage='people'` prop

### Props Interface

```typescript
interface CompanyDetailsSlideOutProps {
  companyId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  onPersonClick?: (personId: string) => void;
  initialTab?: 'overview' | 'people' | 'jobs' | 'activity' | 'notes';
  sourcePage?: 'companies' | 'pipeline' | 'jobs' | 'people' | 'dashboard'; // NEW
}
```

### Source Page Detection (Alternative)

If source page cannot be passed as prop, detect from:

1. **URL Referrer**: Check `document.referrer`
2. **Route History**: Check React Router history
3. **Context/State**: Store source page in context or state management
4. **Default**: Default to 'companies' if unknown

---

## 🎨 Design Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ Companies > Tech Corporation                                │ ← Breadcrumb
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [← →] 1/56  [Logo] Tech Corporation [Active] [Actions] [X] │ ← Header
│              Origin: LinkedIn • Added: Oct 15, 2024        │
│                                                             │
│  [Tabs: Overview | People | Jobs | Activity | Notes]        │
│                                                             │
│  [Content Area]                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Truncation

**Desktop** (full width):

```
Companies > Pipeline > Tech Corporation
```

**Mobile** (truncated):

```
Companies > ... > Tech Corp
```

---

## 📅 Implementation Phases

### Phase 1: Component Creation (2 hours)

- [ ] Create `CompanySlideOutBreadcrumbs.tsx` component
- [ ] Implement breadcrumb generation logic
- [ ] Add responsive truncation for mobile
- [ ] Style breadcrumb with proper colors and spacing

### Phase 2: Integration (2 hours)

- [ ] Integrate breadcrumb into `CompanyDetailsSlideOut.tsx`
- [ ] Add `sourcePage` prop to component interface
- [ ] Update all pages that open company slide-out
- [ ] Test navigation from different source pages

### Phase 3: Navigation Logic (1-2 hours)

- [ ] Implement navigation handler
- [ ] Close slide-out on breadcrumb click
- [ ] Preserve URL state/filters if applicable
- [ ] Test navigation with React Router

### Phase 4: Testing & Polish (1 hour)

- [ ] Test responsive truncation
- [ ] Verify accessibility (screen readers)
- [ ] Test on all source pages
- [ ] Fix any styling issues
- [ ] Verify TypeScript types

---

## ✅ Acceptance Criteria

**Functional Requirements**:

- [ ] Breadcrumb displays correct path based on source page
- [ ] Clicking breadcrumb items navigates to correct page
- [ ] Current page (company name) is not clickable
- [ ] Slide-out closes when navigating via breadcrumb
- [ ] Breadcrumb updates when company changes

**Visual Requirements**:

- [ ] Breadcrumb matches design specifications
- [ ] Proper spacing and alignment
- [ ] Responsive truncation on mobile
- [ ] Hover states work correctly
- [ ] Separators (chevrons) display properly

**Accessibility Requirements**:

- [ ] Screen reader announces breadcrumb navigation
- [ ] Keyboard navigation works (Tab through links)
- [ ] ARIA labels on breadcrumb items
- [ ] Proper semantic HTML (`nav`, `ol`, `li`)

**Integration Requirements**:

- [ ] Works from all source pages (Companies, Pipeline, Jobs, People, Dashboard)
- [ ] No breaking changes to existing functionality
- [ ] TypeScript types correct
- [ ] No linter errors
- [ ] Performance impact minimal

---

## 🔍 Edge Cases

### Unknown Source Page

- Default to `Companies > [Company Name]`
- Log warning in development mode

### Company Name Changes

- Breadcrumb updates when company name is edited
- Handle async name loading

### Navigation State Preservation

- Consider preserving filters when navigating back
- Use URL params or React Router state

### Mobile Truncation

- Truncate middle items, keep first and last
- Show tooltip with full path on hover/long-press

---

## 🚀 Future Enhancements (Out of Scope)

- Add dropdown menus for collapsed items
- Show page icons in breadcrumbs
- Add recent pages/history
- Breadcrumb animation on navigation
- Breadcrumb sharing (copy link)

---

## 📚 Related Documentation

- [Company Slide-Out Design Improvement PDR](./11-company-slide-out-design-improvement.md)
- [Settings Pages Improvement PDR](./13-settings-pages-improvement.md)
- [Company Detail Enhancement PDR](./09-company-detail-enhancement.md)

---

## 👥 Stakeholders

**Product Owner**: [To be assigned]  
**Design Lead**: [To be assigned]  
**Engineering Lead**: [To be assigned]

---

**Last Updated**: February 2025  
**Status**: 📋 Awaiting approval to proceed
