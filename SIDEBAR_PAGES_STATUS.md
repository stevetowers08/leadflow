# Sidebar Pages Status

## Main Sidebar (✅ Updated)
- **File**: `src/components/app-sidebar.tsx`
- **Status**: ✅ Updated with new PDR routes
- **Routes**: Overview (/), Leads (/leads), Inbox (/inbox), Workflows (/workflows), Settings (/settings)

## Other Sidebar Components (❌ Need Update)

### 1. Layout Sidebar
- **File**: `src/components/layout/Sidebar.tsx`
- **Status**: ❌ Still has old routes
- **Old Routes**: /contacts, /conversations, /pipeline, /campaigns, /reporting, /getting-started
- **Action Needed**: Update to match PDR routes

### 2. Dashboard-01 Sidebar
- **File**: `src/components/dashboard-01/app-sidebar.tsx`
- **Status**: ❌ Still has old routes
- **Old Routes**: /getting-started, /contacts, /conversations, /pipeline, /campaigns, /reporting
- **Action Needed**: Update to match PDR routes (or remove if unused)

### 3. Mobile Navigation
- **File**: `src/components/mobile/MobileNav.tsx`
- **Status**: ❌ Still has old routes
- **Old Routes**: /getting-started, /people, /pipeline, /conversations, /campaigns, /reporting
- **Action Needed**: Update to match PDR routes

### 4. Mobile Sidebar
- **File**: `src/components/mobile/MobileSidebar.tsx`
- **Status**: ❌ Still has old routes
- **Action Needed**: Update to match PDR routes

## Old Pages Still Present (Redirect Pages)

These pages redirect to new routes but could be removed:

1. **`src/app/contacts/page.tsx`** → Redirects to `/leads`
2. **`src/app/conversations/page.tsx`** → Redirects to `/inbox`

## Pages Marked for Deletion

These pages are marked with (DELETE) but still exist:
- `src/app/pipeline/page.tsx` - Not in PDR
- `src/app/campaigns/page.tsx` - Replaced by workflows
- `src/app/reporting/page.tsx` - Not in PDR
- `src/app/getting-started/page.tsx` - Not in PDR
- `src/app/integrations/page.tsx` - Not in PDR
- `src/app/dashboard/page.tsx` - Merged into Overview

## Recommendation

1. **Update all sidebar components** to use new PDR routes
2. **Remove redirect pages** (`/contacts`, `/conversations`) after confirming new routes work
3. **Remove or keep** old pages based on whether they're still referenced elsewhere

