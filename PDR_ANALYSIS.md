# PDR Analysis - What's Missing & What Needs Work

## ✅ Complete Pages (5/5)

All required pages from PDR exist:

1. **Mobile**: `/mobile/capture` - Scanner ✅
2. **Desktop**: 
   - `/` - Overview ✅
   - `/leads` - Leads Repository ✅
   - `/inbox` - Unified Inbox ✅
   - `/workflows` - Workflow Builder ✅
   - `/settings` - Settings ✅

## ❌ Critical Missing: API Route

### `/api/scan` - AI Enrichment Pipeline
**PDR Section 6.2** - **MISSING**

**What it should do:**
1. Accept image from mobile scanner (POST request with image data)
2. Use GPT-4o Vision to extract text (name, email, company, job title)
3. Agent: Search web for "{Company} recent news" and "{Name} LinkedIn"
4. Generate icebreaker variable (e.g., "I saw your post about X...")
5. Save to `leads` table with all PDR fields

**Current Status**: Mobile scanner has placeholder `handleSyncAndAutomate` function that just logs to console.

**Impact**: Mobile scanner **cannot function** without this endpoint.

## ⚠️ Pages Needing Refactoring

### 1. Leads Page (`/leads`)
**Status**: Uses Contacts component - works but not PDR-compliant

**Missing PDR Features:**
- Toolbar with specific layout (h-16, border-b, px-6)
- Search input + Status filter dropdown
- Export CSV button
- Table with h-16 rows (currently different height)
- Status badges: Green dot "In Sequence" / Red dot "Manual Control"
- Detail Sheet (side="right" w-[600px]) with:
  - Tab 1: Profile (editable + card scan)
  - Tab 2: Timeline (audit log)

### 2. Inbox Page (`/inbox`)
**Status**: Uses Conversations component - works but not PDR-compliant

**Missing PDR Features:**
- ResizablePanelGroup split view:
  - Left (30%): Threads list
  - Right (70%): Chat view
- Chat bubble UI (bg-zinc-100 incoming, bg-indigo-600 sent)
- "Automation Paused" toggle in header
- Gmail send integration (check if exists)

### 3. Overview Page (`/`)
**Status**: Structure complete, needs data

**Missing:**
- Real data connection:
  - Pipeline Value calculation
  - Speed to Lead (avg scan → first email time)
  - Active Conversations count
  - Live Feed activity stream

## ✅ Existing Infrastructure

### API Routes (Keep)
- ✅ `/api/webhooks/gmail` - Gmail Watcher (PDR 6.1)
- ✅ `/api/gmail-*` - Gmail sync routes
- ✅ `/api/enrichment-callback` - Enrichment callbacks

### Auth & Integration (Keep)
- ✅ `/auth/*` - Authentication (necessary)
- ✅ `/integrations/callback` - OAuth (necessary)

## 📊 Compliance Score

| Category | Status | Score |
|----------|--------|-------|
| **Pages** | All exist | 5/5 ✅ |
| **API Routes** | Missing /api/scan | 1/2 ⚠️ |
| **PDR Spec Compliance** | Needs refactoring | 3/5 ⚠️ |
| **Navigation** | Complete | 5/5 ✅ |

**Overall**: 14/17 (82%) - Good foundation, needs critical API route and refactoring

## 🎯 Action Items (Priority Order)

### 🔴 Critical (Blocking)
1. **Create `/api/scan` endpoint**
   - Mobile scanner depends on this
   - Required for core LeadFlow functionality

### 🟡 High Priority (PDR Compliance)
2. **Refactor Leads page** to match PDR specs
3. **Refactor Inbox page** to ResizablePanelGroup split view
4. **Connect Overview to real data**

### 🟢 Medium Priority (Enhancement)
5. Consider React Flow visual canvas for workflows (PDR mentions it)
6. Review `/settings/job-filtering` - keep or remove

## 💡 My Thoughts

**Strengths:**
- All required pages exist
- Good foundation with existing components
- Route groups properly structured
- Navigation updated correctly

**Weaknesses:**
- **Critical**: Missing `/api/scan` blocks mobile functionality
- Pages use existing components but don't match PDR specs exactly
- Overview page has placeholder data

**Recommendation:**
1. **Immediate**: Create `/api/scan` endpoint (highest priority)
2. **Next**: Refactor Leads and Inbox to match PDR exactly
3. **Then**: Connect Overview to real data
4. **Optional**: Add React Flow visual canvas to workflows

The app structure is solid, but the mobile scanner won't work without the scan API endpoint. The desktop pages work but need refinement to match PDR specifications exactly.

