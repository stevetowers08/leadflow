# PDR Compliance Check

## ✅ Pages Implemented

### Mobile (app/(mobile))
- ✅ `/mobile/capture` - Scanner page (PDR Section 4.1)
  - Full viewport camera interface
  - Guide frame overlay
  - Header with logo and online status
  - Footer with shutter button
  - Enrichment drawer (PDR Section 4.2)

### Desktop (app/(app))
- ✅ `/` - Overview (PDR Section 5.2)
  - ROI Metrics Bento Grid (3 cards)
  - Live Feed component
  - TODO: Connect to real data

- ✅ `/leads` - Leads Repository (PDR Section 5.3)
  - Uses existing Contacts component
  - TODO: Refactor to match PDR specs:
    - Toolbar with search + status filter + Export CSV
    - Table with h-16 rows
    - Detail Sheet (side="right" w-[600px])
    - Tabs: Profile, Timeline

- ✅ `/inbox` - Unified Inbox (PDR Section 5.4)
  - Uses existing Conversations component
  - TODO: Refactor to ResizablePanelGroup:
    - Left: Threads (30%)
    - Right: Chat (70%)
    - Chat bubbles UI
    - Automation Paused toggle

- ✅ `/workflows` - Visual Workflow Builder (PDR Section 5.5)
  - Uses existing Campaigns component
  - Full sequence builder functionality
  - TODO: Consider React Flow visual canvas (PDR mentions it)

- ✅ `/settings` - Settings (PDR Section 5.1)
  - Uses existing Settings component

## ❌ Missing API Routes

### Critical Missing Route
- ❌ **`POST /api/scan`** - AI Enrichment Pipeline (PDR Section 6.2)
  - Required for mobile scanner
  - Should:
    - Accept image from mobile capture
    - Use GPT-4o Vision to extract text
    - Search web for company/news
    - Generate icebreaker variable
    - Save to leads table
  - **Status**: NOT FOUND - Needs to be created

### Existing Routes
- ✅ `/api/webhooks/gmail` - Gmail Watcher (PDR Section 6.1)
  - Exists and handles Reply Guard logic

## ⚠️ Additional Pages (Not in PDR but Necessary)

### Auth & Integration Pages (Keep)
- `/auth/*` - Authentication flows (necessary for app)
- `/integrations/callback` - OAuth callbacks (necessary for Gmail/Lemlist)

### Settings Sub-pages (Review)
- `/settings/job-filtering` - Not in PDR, but might be useful
  - **Decision**: Keep for now, can remove if not needed

## 📋 Implementation Status Summary

### Pages: 5/5 ✅
- All required pages exist
- Some need refactoring to match PDR specs exactly

### API Routes: 1/2 ⚠️
- ✅ Gmail webhook exists
- ❌ **Missing: `/api/scan` endpoint**

### Navigation: ✅
- All 5 navigation items implemented
- Sidebar updated correctly

## 🚨 Critical Missing Item

**`POST /api/scan`** - This is REQUIRED for the mobile scanner to work. Without it:
- Mobile capture page can't process images
- AI enrichment won't happen
- Leads won't be created from scans

## Recommendations

1. **Create `/api/scan` endpoint** - High priority
   - Accept image upload
   - Use GPT-4o Vision API
   - Implement web search for company/news
   - Generate icebreaker
   - Save to leads table

2. **Refactor existing pages** to match PDR specs exactly:
   - Leads page: Add toolbar, detail Sheet, Timeline tab
   - Inbox page: Add ResizablePanelGroup split view
   - Overview: Connect to real data

3. **Consider React Flow** for workflows:
   - PDR mentions React Flow visual canvas
   - Current implementation uses vertical timeline
   - Could add visual canvas as alternative view

4. **Review settings sub-pages**:
   - Keep `/settings/job-filtering` if useful
   - Remove if not needed for LeadFlow

