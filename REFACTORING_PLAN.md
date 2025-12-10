# LeadFlow Refactoring Plan

## Overview
This document outlines the refactoring plan to align the current Empowr CRM application with the new LeadFlow PDR requirements while reusing existing components and pages.

## Current vs New Structure

### Current Pages (Marked for Review)
```
src/app/
├── page.tsx                    → KEEP (refactor to Overview)
├── contacts/page.tsx           → MOVE to /leads (rename)
├── conversations/page.tsx      → MOVE to /inbox (refactor)
├── pipeline/page.tsx           → (DELETE) - Not in PDR
├── campaigns/page.tsx          → (DELETE) - Replaced by /workflows
├── reporting/page.tsx           → (DELETE) - Not in PDR
├── settings/page.tsx           → KEEP
├── getting-started/page.tsx    → (DELETE) - Not in PDR
├── integrations/page.tsx        → (DELETE) - Not in PDR
└── dashboard/page.tsx          → (DELETE) - Merged into /
```

### New Structure (Next.js 15 Route Groups)
```
src/app/
├── layout.tsx                  → Root layout (keep, update)
├── (mobile)/                   → NEW: Mobile route group
│   ├── layout.tsx             → NEW: Mobile-specific layout
│   └── capture/
│       └── page.tsx           → NEW: Scanner page
├── (app)/                      → NEW: Desktop route group
│   ├── layout.tsx             → NEW: Desktop sidebar layout
│   ├── page.tsx               → Overview (refactored from /)
│   ├── leads/
│   │   └── page.tsx           → Leads Repository (from /contacts)
│   ├── inbox/
│   │   └── page.tsx           → Unified Inbox (from /conversations)
│   ├── workflows/
│   │   └── page.tsx           → NEW: Visual Workflow Builder
│   └── settings/
│       └── page.tsx           → Settings (keep)
└── api/                        → KEEP (all existing routes)
```

## Page Mapping & Status

| Current Path | New Path | Status | Action |
|-------------|----------|--------|--------|
| `/` | `/(app)/` | KEEP | Refactor to Overview with ROI metrics |
| `/contacts` | `/(app)/leads` | MOVE | Rename and refactor to Leads Repository |
| `/conversations` | `/(app)/inbox` | MOVE | Refactor to Unified Inbox with split view |
| `/pipeline` | - | DELETE | Not in PDR |
| `/campaigns` | - | DELETE | Replaced by workflows |
| `/reporting` | - | DELETE | Not in PDR |
| `/settings` | `/(app)/settings` | KEEP | Update navigation |
| `/getting-started` | - | DELETE | Not in PDR |
| `/integrations` | - | DELETE | Not in PDR |
| `/dashboard` | - | DELETE | Merged into Overview |
| - | `/(mobile)/capture` | NEW | Create scanner page |

## Component Reuse Strategy

### Components to Reuse (with updates)
1. **Sidebar Components**
   - `src/components/app-sidebar.tsx` → Update navigation items
   - `src/components/layout/Sidebar.tsx` → Update for new routes

2. **Table Components**
   - `src/components/ui/unified-table.tsx` → Use for Leads Repository
   - `src/components/ui/pagination-controls.tsx` → Keep as-is

3. **Form Components**
   - All shadcn/ui components → Keep as-is
   - `src/components/ui/input.tsx`, `textarea.tsx`, etc.

4. **Layout Components**
   - `src/components/layout/Layout.tsx` → Refactor for route groups
   - `src/app/LayoutWrapper.tsx` → Update to handle route groups

5. **Conversations/Inbox Components**
   - `src/app/conversations/ConversationsClient.tsx` → Refactor to Unified Inbox
   - Message components → Reuse for chat bubbles

### New Components Needed
1. **Mobile Scanner**
   - `src/components/mobile/Scanner.tsx` → Camera interface
   - `src/components/mobile/EnrichmentDrawer.tsx` → Post-scan drawer

2. **Workflow Builder**
   - `src/components/workflows/WorkflowCanvas.tsx` → React Flow canvas
   - `src/components/workflows/WorkflowNodes.tsx` → Custom nodes
   - `src/components/workflows/WorkflowInspector.tsx` → Node editor

3. **Overview Page**
   - `src/components/overview/ROIMetrics.tsx` → Bento grid metrics
   - `src/components/overview/LiveFeed.tsx` → Activity feed

## Design System Updates

### Typography (PDR Section 3)
- **Primary**: Geist Sans (currently Inter - needs update)
- **Data**: Geist Mono (needs addition)
- Update `src/design-system/tokens.ts`

### Color Palette (PDR Section 3)
```typescript
// Update tailwind.config.ts
colors: {
  canvas: {
    app: 'bg-zinc-50',      // App Background
    card: 'bg-white',       // Cards/Panels
  },
  primary: {
    DEFAULT: 'bg-zinc-950', // Buttons/Text
  },
  accent: {
    DEFAULT: 'text-indigo-600', // Links/Active States
  },
  status: {
    active: 'emerald-500',   // Active
    processing: 'amber-500', // Processing
    paused: 'rose-500',       // Paused
  },
}
```

### Spacing & Radius (PDR Section 3)
- **Density**: Compact
- **Table rows**: `h-14` (56px)
- **Containers**: `rounded-xl` (12px)
- **Interactives**: `rounded-lg` (8px)
- **Mobile buttons**: `min-h-[48px]`

### Update Files
1. `tailwind.config.ts` → Add new color tokens
2. `src/design-system/tokens.ts` → Update spacing/radius
3. `src/app/globals.css` → Add Geist font imports

## Navigation Updates

### Desktop Sidebar (PDR Section 5.1)
```typescript
const navigationItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Inbox', href: '/inbox', icon: MessageSquare },
  { name: 'Workflows', href: '/workflows', icon: GitMerge },
  { name: 'Settings', href: '/settings', icon: Settings2 },
];
```

### Mobile Navigation
- Remove bottom nav for mobile scanner route
- Keep bottom nav for desktop routes (if needed)

## Implementation Steps

### Phase 1: Route Groups Setup
1. Create `src/app/(mobile)/` directory
2. Create `src/app/(app)/` directory
3. Create layout files for each route group
4. Update `LayoutWrapper.tsx` to handle route groups

### Phase 2: Design System
1. Add Geist fonts to `globals.css`
2. Update `tailwind.config.ts` with new colors
3. Update `design-system/tokens.ts` with new spacing/radius
4. Test design tokens across existing components

### Phase 3: Mobile Scanner
1. Create `/(mobile)/capture/page.tsx`
2. Build `Scanner.tsx` component with react-webcam
3. Build `EnrichmentDrawer.tsx` component
4. Implement AI enrichment API integration

### Phase 4: Desktop Pages
1. **Overview** (`/(app)/page.tsx`)
   - Refactor dashboard to Overview
   - Add ROI Metrics Bento Grid
   - Add Live Feed component

2. **Leads** (`/(app)/leads/page.tsx`)
   - Move `/contacts` to `/leads`
   - Update table columns per PDR
   - Add detail Sheet panel

3. **Inbox** (`/(app)/inbox/page.tsx`)
   - Refactor `/conversations` to `/inbox`
   - Implement ResizablePanelGroup split view
   - Add chat bubble UI

4. **Workflows** (`/(app)/workflows/page.tsx`)
   - Create new page
   - Integrate React Flow
   - Build custom nodes

5. **Settings** (`/(app)/settings/page.tsx`)
   - Keep existing, update navigation

### Phase 5: Cleanup
1. Mark old pages with (DELETE) comments
2. Update all internal links
3. Update API routes if needed
4. Test all navigation flows

## Database Schema Updates

### New Tables (PDR Section 7)
```sql
-- Leads table (rename from people if needed)
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  first_name text,
  last_name text,
  email text,
  company text,
  job_title text,
  scan_image_url text,
  quality_rank text CHECK (quality_rank IN ('hot', 'warm', 'cold')),
  ai_summary text,
  ai_icebreaker text,
  status text DEFAULT 'processing', -- processing, active, replied_manual
  gmail_thread_id text,
  created_at timestamptz DEFAULT now()
);

-- Emails table (for inbox)
CREATE TABLE emails (
  id text PRIMARY KEY, -- Gmail Message ID
  thread_id text,
  lead_id uuid REFERENCES leads(id),
  direction text, -- 'inbound' or 'outbound'
  snippet text,
  body_html text,
  sent_at timestamptz
);
```

## API Routes to Update

### New Routes Needed
- `POST /api/scan` → AI enrichment pipeline
- `POST /api/webhooks/gmail` → Gmail watcher (if not exists)

### Existing Routes to Keep
- All `/api/gmail-*` routes → Keep for inbox sync
- `/api/ai-*` routes → Keep for enrichment
- All other existing routes → Keep

## Testing Checklist

- [ ] Route groups work correctly
- [ ] Mobile scanner captures images
- [ ] Enrichment drawer opens after scan
- [ ] Overview page shows ROI metrics
- [ ] Leads table displays correctly
- [ ] Inbox split view works
- [ ] Workflow builder loads
- [ ] Navigation updates correctly
- [ ] Design system tokens applied
- [ ] Mobile vs desktop layouts separate correctly

## Notes

- Keep all existing API routes functional
- Maintain backward compatibility where possible
- Use feature flags if needed for gradual rollout
- All (DELETE) pages should be reviewed before removal
- Database migrations should be created for schema changes

