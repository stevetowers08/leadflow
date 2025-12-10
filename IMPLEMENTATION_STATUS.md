# LeadFlow Refactoring - Implementation Status

## ✅ Completed Implementation

### Route Groups Structure
- ✅ Created `src/app/(mobile)/layout.tsx` - Full viewport mobile layout
- ✅ Created `src/app/(app)/layout.tsx` - Desktop sidebar layout
- ✅ Updated `src/app/LayoutWrapper.tsx` - Handles route groups
- ✅ Updated `src/app/layout.tsx` - Updated metadata for LeadFlow

### New Pages Created

#### Mobile
- ✅ `src/app/(mobile)/capture/page.tsx`
  - Full viewport camera interface
  - Guide frame overlay (3.5:2 aspect ratio)
  - Header with logo and online status
  - Footer with shutter button
  - Enrichment drawer (auto-opens after capture)
  - Form with identity fields, quality rank toggle, notes with voice button
  - "Sync & Automate" action button

#### Desktop
- ✅ `src/app/(app)/page.tsx` - Overview
  - ROI Metrics Bento Grid (3 cards)
  - Live Feed with ScrollArea
  - Ready for data integration

- ✅ `src/app/(app)/leads/page.tsx` - Leads Repository
  - Moved from `/contacts`
  - Uses existing Contacts component
  - TODO: Refactor to match PDR specs

- ✅ `src/app/(app)/inbox/page.tsx` - Unified Inbox
  - Moved from `/conversations`
  - Uses existing ConversationsClient
  - TODO: Refactor to split view

- ✅ `src/app/(app)/workflows/page.tsx` - Workflow Builder
  - Placeholder created
  - TODO: Implement React Flow canvas

- ✅ `src/app/(app)/settings/page.tsx` - Settings
  - Moved from `/settings`
  - Uses existing Settings component

### Navigation
- ✅ Updated `src/components/app-sidebar.tsx`
  - New navigation items per PDR:
    - Overview (/) - LayoutDashboard
    - Leads (/leads) - Users
    - Inbox (/inbox) - MessageSquare
    - Workflows (/workflows) - GitMerge
    - Settings (/settings) - Settings2

### Pages Marked for Deletion
All old pages marked with `(DELETE)` comments:
- `src/app/page.tsx` → Redirects to new Overview
- `src/app/contacts/page.tsx` → Redirects to /leads
- `src/app/conversations/page.tsx` → Redirects to /inbox
- `src/app/pipeline/page.tsx` → Not in PDR
- `src/app/campaigns/page.tsx` → Replaced by workflows
- `src/app/reporting/page.tsx` → Not in PDR
- `src/app/getting-started/page.tsx` → Not in PDR
- `src/app/integrations/page.tsx` → Not in PDR
- `src/app/dashboard/page.tsx` → Merged into Overview
- `src/app/settings/page.tsx` → Moved to route group

## 🚧 Pending Implementation

### 1. Dependencies
```bash
npm install react-webcam
npm install reactflow  # For workflows page
```

### 2. Design System Updates
- [ ] Add Geist Sans font (replace Inter in `layout.tsx`)
- [ ] Add Geist Mono font for data display
- [ ] Update `tailwind.config.ts` with PDR colors:
  ```typescript
  canvas: { app: 'bg-zinc-50', card: 'bg-white' }
  primary: 'bg-zinc-950'
  accent: 'text-indigo-600'
  status: { active: 'emerald-500', processing: 'amber-500', paused: 'rose-500' }
  ```
- [ ] Update spacing tokens:
  - Table rows: `h-14`
  - Containers: `rounded-xl`
  - Interactives: `rounded-lg`
  - Mobile buttons: `min-h-[48px]`

### 3. Mobile Scanner
- [ ] Install `react-webcam`
- [ ] Connect to `POST /api/scan` for AI enrichment
- [ ] Implement Web Speech API for voice transcription
- [ ] Connect "Sync & Automate" to backend

### 4. Overview Page
- [ ] Connect ROI metrics to real data API
- [ ] Connect Live Feed to activity stream
- [ ] Add proper loading states

### 5. Leads Page
- [ ] Refactor table to match PDR:
  - Row height: `h-16`
  - Columns: Lead, Context, Status, Actions
  - Detail Sheet (side="right" w-[600px])
  - Tabs: Profile, Timeline

### 6. Inbox Page
- [ ] Implement ResizablePanelGroup:
  - Left: Threads (30%)
  - Right: Chat (70%)
- [ ] Chat bubble UI
- [ ] Composer with Gmail API
- [ ] "Automation Paused" toggle

### 7. Workflows Page
- [ ] Install React Flow
- [ ] Create canvas with pan/zoom
- [ ] Custom nodes (Trigger, Action, Logic, Safety)
- [ ] Inspector panel

### 8. Database
- [ ] Create `leads` table (if needed)
- [ ] Create `emails` table (if needed)
- [ ] Update `profiles` table

### 9. API Routes
- [ ] Create `POST /api/scan`
- [ ] Verify `POST /api/webhooks/gmail`

## 📋 Testing Checklist

- [ ] Route groups work correctly
- [ ] Mobile scanner captures images
- [ ] Enrichment drawer opens after scan
- [ ] Overview page displays correctly
- [ ] Leads page loads existing data
- [ ] Inbox page loads conversations
- [ ] Workflows page placeholder works
- [ ] Settings page works
- [ ] Navigation updates correctly
- [ ] Old pages redirect properly

## 📝 Notes

### Route Groups
Next.js route groups `(mobile)` and `(app)` are organizational only - they don't affect URLs:
- `/(mobile)/capture` → `/mobile/capture` in browser
- `/(app)/leads` → `/leads` in browser

### Component Reuse
All existing components are reused:
- ✅ Drawer, ToggleGroup, Skeleton, ScrollArea, Avatar
- ✅ All shadcn/ui components
- ✅ Existing page components (Contacts, Conversations, Settings)

### Migration Strategy
1. ✅ Created new structure
2. ✅ Marked old pages for deletion
3. ⏳ Test new routes
4. ⏳ Refactor pages to match PDR
5. ⏳ Remove old pages

## 🎯 Next Priority Actions

1. **Install dependencies**: `react-webcam`, `reactflow`
2. **Test route groups**: Verify all new routes work
3. **Update design system**: Add Geist fonts, update colors
4. **Connect Overview to data**: Real ROI metrics and live feed
5. **Refactor Leads page**: Match PDR table specs
6. **Implement Inbox split view**: ResizablePanelGroup

