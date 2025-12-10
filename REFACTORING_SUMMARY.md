# LeadFlow Refactoring Summary

## ✅ Completed Tasks

### 1. Route Groups Structure
- ✅ Created `src/app/(mobile)/` directory with layout
- ✅ Created `src/app/(app)/` directory with layout  
- ✅ Updated `LayoutWrapper.tsx` to handle route groups

### 2. New Pages Created
- ✅ `/(mobile)/capture` - Mobile scanner page with camera interface
- ✅ `/(app)/` - Overview page with ROI metrics and live feed
- ✅ `/(app)/leads` - Leads Repository (moved from /contacts)
- ✅ `/(app)/inbox` - Unified Inbox (moved from /conversations)
- ✅ `/(app)/workflows` - Visual Workflow Builder (placeholder)
- ✅ `/(app)/settings` - Settings (moved from /settings)

### 3. Navigation Updated
- ✅ Updated `src/components/app-sidebar.tsx` with new navigation:
  - Overview (/) - LayoutDashboard icon
  - Leads (/leads) - Users icon
  - Inbox (/inbox) - MessageSquare icon
  - Workflows (/workflows) - GitMerge icon
  - Settings (/settings) - Settings2 icon

### 4. Pages Marked for Deletion
All old pages have been marked with `(DELETE)` comments:
- ✅ `src/app/page.tsx` - Moved to `/(app)/page.tsx`
- ✅ `src/app/contacts/page.tsx` - Moved to `/(app)/leads/page.tsx`
- ✅ `src/app/conversations/page.tsx` - Moved to `/(app)/inbox/page.tsx`
- ✅ `src/app/pipeline/page.tsx` - Not in PDR
- ✅ `src/app/campaigns/page.tsx` - Replaced by workflows
- ✅ `src/app/reporting/page.tsx` - Not in PDR
- ✅ `src/app/getting-started/page.tsx` - Not in PDR
- ✅ `src/app/integrations/page.tsx` - Not in PDR
- ✅ `src/app/dashboard/page.tsx` - Merged into Overview
- ✅ `src/app/settings/page.tsx` - Moved to `/(app)/settings/page.tsx`

## 🚧 Pending Tasks

### 1. Design System Updates
- [ ] Add Geist Sans font (currently using Inter)
- [ ] Add Geist Mono font for data display
- [ ] Update color palette in `tailwind.config.ts`:
  - Canvas: `bg-zinc-50` (App Background), `bg-white` (Cards)
  - Primary: `bg-zinc-950` (Buttons/Text)
  - Accent: `text-indigo-600` (Links/Active)
  - Status: `emerald-500`, `amber-500`, `rose-500`
- [ ] Update spacing/radius tokens:
  - Table rows: `h-14` (56px)
  - Containers: `rounded-xl` (12px)
  - Interactives: `rounded-lg` (8px)
  - Mobile buttons: `min-h-[48px]`

### 2. Mobile Scanner Enhancements
- [ ] Install `react-webcam` package: `npm install react-webcam`
- [ ] Implement AI enrichment API integration
- [ ] Add Web Speech API for voice transcription
- [ ] Connect "Sync & Automate" button to backend

### 3. Overview Page Enhancements
- [ ] Connect ROI metrics to real data
- [ ] Connect Live Feed to real activity data
- [ ] Add proper data fetching hooks

### 4. Leads Page Refactoring
- [ ] Update table to match PDR specs:
  - Row height: `h-16`
  - Columns: Lead (Avatar + Name/Email), Context (Badge + Tooltip), Status, Actions
  - Detail Sheet panel (side="right" w-[600px])
  - Tabs: Profile, Timeline

### 5. Inbox Page Refactoring
- [ ] Implement ResizablePanelGroup split view:
  - Left Panel (30%): Threads list
  - Right Panel (70%): Chat view
- [ ] Add chat bubble UI (bg-zinc-100 incoming, bg-indigo-600 sent)
- [ ] Add composer with Gmail API integration
- [ ] Add "Automation Paused" toggle

### 6. Workflows Page Implementation
- [ ] Install React Flow: `npm install reactflow`
- [ ] Create workflow canvas with:
  - Infinite pan/zoom
  - Dot pattern background
  - Custom nodes (Trigger, Action, Logic, Safety)
  - Inspector panel for node editing

### 7. Database Schema
- [ ] Create `leads` table (if not exists)
- [ ] Create `emails` table (if not exists)
- [ ] Update `profiles` table with API keys (if needed)

### 8. API Routes
- [ ] Create `POST /api/scan` for AI enrichment
- [ ] Verify `POST /api/webhooks/gmail` exists for Reply Guard

## 📝 Notes

### Route Groups
Next.js route groups `(mobile)` and `(app)` don't affect URLs:
- `/(mobile)/capture` → `/mobile/capture` (URL)
- `/(app)/leads` → `/leads` (URL)
- `/(app)/inbox` → `/inbox` (URL)

### Component Reuse
All existing components are being reused:
- Sidebar components
- Table components
- Form components
- Layout components

### Migration Path
1. Test new route groups work correctly
2. Verify all navigation links updated
3. Test mobile scanner on actual device
4. Gradually refactor pages to match PDR specs
5. Remove old pages after confirmation

## 🔍 Files to Review Before Deletion

Before deleting any `(DELETE)` marked files:
1. Test that new routes work correctly
2. Verify all internal links point to new routes
3. Check that API routes still function
4. Confirm no broken dependencies

## 📦 Dependencies to Install

```bash
npm install react-webcam
npm install reactflow  # For workflows page
```

## 🎯 Next Steps

1. Install missing dependencies
2. Update design system tokens
3. Connect Overview page to real data
4. Refactor Leads page to match PDR specs
5. Implement Inbox split view
6. Build Workflows canvas
7. Test mobile scanner on device
8. Remove old pages after testing

