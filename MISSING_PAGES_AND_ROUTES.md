# Missing Pages & Routes - PDR Compliance

## ❌ Critical Missing: API Route

### `/api/scan` - AI Enrichment Pipeline (PDR Section 6.2)
**Status**: NOT FOUND - **MUST CREATE**

**Required Functionality:**
- Accept image upload from mobile scanner
- Use GPT-4o Vision to extract text from business card
- Agent: Search web for "{Company} recent news" and "{Name} LinkedIn"
- Synthesis: Generate icebreaker variable (e.g., "I saw your post about X...")
- Save to `leads` table with:
  - `first_name`, `last_name`, `email`, `company`, `job_title`
  - `scan_image_url` (uploaded image)
  - `quality_rank` (from mobile form: hot/warm/cold)
  - `ai_summary` (from web search)
  - `ai_icebreaker` (generated icebreaker)
  - `status` = 'processing' initially

**Implementation Notes:**
- Should use Vercel AI SDK with OpenAI gpt-4o for vision
- Need image upload handling (base64 or multipart)
- Web search integration (could use Google Search API or similar)
- Should return enriched lead data to mobile app

## ✅ Pages Status

### Mobile Pages
- ✅ `/mobile/capture` - Scanner (PDR 4.1) - **COMPLETE**

### Desktop Pages  
- ✅ `/` - Overview (PDR 5.2) - **CREATED** (needs data connection)
- ✅ `/leads` - Leads Repository (PDR 5.3) - **CREATED** (needs PDR refactor)
- ✅ `/inbox` - Unified Inbox (PDR 5.4) - **CREATED** (needs split view refactor)
- ✅ `/workflows` - Workflow Builder (PDR 5.5) - **COMPLETE** (using existing)
- ✅ `/settings` - Settings (PDR 5.1) - **COMPLETE**

## ⚠️ Pages Needing Refactoring

### 1. Leads Page (`/leads`)
**Current**: Uses Contacts component (works but not PDR-compliant)

**PDR Requirements Missing:**
- [ ] Toolbar: h-16, border-b, px-6
  - Left: Input ("Search leads...") + Select (Status Filter)
  - Right: Button (Variant: Outline, "Export CSV")
- [ ] Data Table: @tanstack/react-table
  - Row Height: h-16 (currently different)
  - Columns: Lead (Avatar + Name/Email), Context (Badge + Tooltip), Status, Actions
  - Status badges: Green Dot + "In Sequence" (active), Red Dot + "Manual Control" (replied)
  - Actions: DropdownMenu ("Pause", "View Details", "Delete")
- [ ] Detail Sheet: side="right" w-[600px]
  - Tab 1: Profile (Editable Forms + Original Card Scan)
  - Tab 2: Timeline (Vertical Audit Log: Scan -> Enrichment -> Email 1 -> Reply)

### 2. Inbox Page (`/inbox`)
**Current**: Uses Conversations component (works but not PDR-compliant)

**PDR Requirements Missing:**
- [ ] ResizablePanelGroup (Split View)
  - Left Panel (30%): Threads list
    - Bold text for Unread
    - Blue badge for "Lead Replied"
  - Right Panel (70%): Chat view
    - Header: Prospect Name + Toggle Switch ("Automation Paused")
    - Message Stream: Chat bubbles
      - Incoming: bg-zinc-100
      - Sent: bg-indigo-600 text-white
    - Composer: Textarea + Button ("Send Reply")
- [ ] Backend: Uses gmail.users.messages.send API (check if implemented)

### 3. Overview Page (`/`)
**Current**: Basic structure with placeholder data

**PDR Requirements:**
- [x] Layout: max-w-7xl mx-auto p-8 space-y-8
- [x] ROI Metrics Bento Grid (3 cards)
- [x] Live Feed with ScrollArea
- [ ] **TODO**: Connect to real data
  - Pipeline Value: Calculate from leads
  - Speed to Lead: Average time from scan to first email
  - Active Conversations: Count from inbox
  - Live Feed: Real activity stream

## ✅ Existing API Routes (Keep)

- ✅ `/api/webhooks/gmail` - Gmail Watcher (PDR 6.1)
- ✅ `/api/gmail-*` - Gmail integration routes
- ✅ `/api/enrichment-callback` - Enrichment callbacks (might be related)

## 📋 Additional Pages (Not in PDR but Keep)

### Necessary for App Function
- ✅ `/auth/*` - Authentication (required)
- ✅ `/integrations/callback` - OAuth callbacks (required for Gmail/Lemlist)

### Settings Sub-pages
- ⚠️ `/settings/job-filtering` - Not in PDR
  - **Decision**: Review if needed for LeadFlow
  - Could keep if useful, or remove if not

## 🎯 Priority Actions

### High Priority (Blocking Mobile Scanner)
1. **Create `/api/scan` endpoint** - Required for mobile capture to work
   - Image upload handling
   - GPT-4o Vision integration
   - Web search for company/news
   - Icebreaker generation
   - Lead creation

### Medium Priority (PDR Compliance)
2. **Refactor Leads page** - Match PDR specs exactly
3. **Refactor Inbox page** - Add ResizablePanelGroup split view
4. **Connect Overview to real data** - Replace placeholders

### Low Priority (Enhancement)
5. **Consider React Flow** for workflows visual canvas (PDR mentions it)
6. **Review settings sub-pages** - Keep or remove based on needs

## Summary

**Pages**: 5/5 ✅ (All required pages exist)
**API Routes**: 1/2 ⚠️ (Missing `/api/scan` - CRITICAL)
**Refactoring Needed**: 3 pages need updates to match PDR exactly

**Most Critical**: Create `/api/scan` endpoint for mobile scanner functionality.

