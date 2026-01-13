# ✅ Enrichment UI Integration Complete

The People Data Labs enrichment UI has been successfully integrated into both the Leads and Companies pages.

## What Was Integrated

### 1. Lead Details Slide-Out ([LeadDetailsSlideOut.tsx](../src/components/slide-out/LeadDetailsSlideOut.tsx))

#### Header Actions

- Added **EnrichLeadButton** to the header action buttons (next to Send Message, Add to Campaign, etc.)
- Button automatically detects enrichment status and shows appropriate state:
  - "Enrich with PDL" - for un-enriched leads
  - "Re-enrich" - for leads enriched >90 days ago
  - "Enriching..." - while processing
  - Disabled if no email address

#### Overview Tab

- Added **EnrichmentDataDisplay** component in the overview tab
- Displays after AI Summary section, before Notes
- Shows enrichment data when `enrichment_status === 'completed'`:
  - Confidence score badge
  - Social profiles (LinkedIn, Twitter, GitHub)
  - Current job position with company details
  - Top 15 skills
  - Work history (top 3 positions)
  - Education
  - Enrichment timestamp

#### Data Fetching

- Updated lead query to include:
  - `enrichment_data` (JSONB)
  - `enrichment_status` (text)
  - `enrichment_timestamp` (timestamptz)
  - `linkedin_url` (text)

### 2. Company Details Slide-Out ([CompanyDetailsSlideOut.tsx](../src/components/slide-out/CompanyDetailsSlideOut.tsx))

#### Leads Tab

- Added **EnrichLeadButton** next to each related lead
- Button shows appropriate state based on lead's enrichment status
- Uses `variant='ghost'` and `size='sm'` for compact display
- Clicking enrich button triggers enrichment for that specific lead
- Success callback refreshes company details to show updated lead data

#### Data Fetching

- Updated related leads query to include:
  - `enrichment_status`
  - `enrichment_timestamp`
  - `enrichment_data`
  - `email`, `phone`, `company` (for enrichment)

### 3. Enhanced EnrichLeadButton ([EnrichLeadButton.tsx](../src/components/leads/EnrichLeadButton.tsx))

#### New Props

- `variant?: ButtonProps['variant']` - Customize button style (default, outline, ghost, etc.)
- `size?: ButtonProps['size']` - Customize button size (default: 'sm')

#### Button States

1. **Un-enriched Lead**
   - Shows "Enrich with PDL"
   - Primary button style (or custom variant)
   - Disabled if no email address

2. **Enriching (Pending)**
   - Shows "Enriching..." with animated sparkles icon
   - Disabled state
   - Outline variant

3. **Recently Enriched** (<90 days)
   - Shows "Re-enrich" with refresh icon
   - Outline variant
   - Allows manual re-enrichment

4. **Failed Enrichment**
   - Shows "Enrich with PDL"
   - Outline variant to indicate previous failure
   - Allows retry

#### Success Handling

- Calls `onSuccess()` callback to refresh parent component
- Shows success toast with confidence score
- Falls back to `window.location.reload()` if no callback provided

## How It Works

### Flow Diagram

```
User clicks "Enrich with PDL"
         ↓
POST /api/enrich-lead
    {
      lead_id: "uuid",
      company: "Company Name",
      email: "person@company.com",
      first_name: "John",
      last_name: "Doe"
    }
         ↓
enrichAndStoreLead() service
         ↓
Calls n8n webhook (synchronous)
         ↓
n8n calls People Data Labs API
         ↓
Returns enrichment data
         ↓
App stores in leads.enrichment_data
         ↓
onSuccess() callback refreshes UI
         ↓
EnrichmentDataDisplay shows data
```

## UI Screenshots (Conceptual)

### Lead Details - Header

```
┌─────────────────────────────────────────────────────────┐
│  👤 John Doe                                            │
│     Managing Director at Company Name                    │
│                                                          │
│  [✨ Enrich with PDL] [✉] [➕] [@] [Status ▼]          │
└─────────────────────────────────────────────────────────┘
```

### Lead Details - Enrichment Data

```
┌─────────────────────────────────────────────────────────┐
│  Enrichment Data                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  Confidence: [9/10 ●●●●●●●●●○]                         │
│                                                          │
│  🔗 Social Profiles                                     │
│    • LinkedIn: linkedin.com/in/john-doe                 │
│    • Twitter: @johndoe                                  │
│                                                          │
│  💼 Current Position                                     │
│    Managing Director @ Company Name                      │
│    Industry: Marketing & Advertising                     │
│                                                          │
│  🎯 Skills (15)                                          │
│    [Management] [Marketing] [Strategy] ...              │
│                                                          │
│  📋 Work History                                         │
│    1. Managing Director @ Company Name (2020-Present)   │
│    2. Senior Manager @ Previous Co (2015-2020)          │
│    3. Marketing Manager @ Another Co (2010-2015)        │
│                                                          │
│  🎓 Education                                            │
│    • MBA, Stanford University                           │
│                                                          │
│  Last enriched: 2 hours ago                             │
└─────────────────────────────────────────────────────────┘
```

### Company Details - Leads Tab

```
┌─────────────────────────────────────────────────────────┐
│  [Overview] [Leads (5)]                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ John Doe                    [✨ Enrich] [Active] │   │
│  │ Managing Director                                 │   │
│  │ john@company.com                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Jane Smith                  [✨ Enrich] [Active] │   │
│  │ Marketing Manager                                 │   │
│  │ jane@company.com                                  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Testing

### Test Lead Enrichment

1. Open a lead in the Leads page (click any row)
2. Lead Details slide-out opens
3. Click "Enrich with PDL" button in the header
4. Wait 2-3 seconds
5. Success toast appears with confidence score
6. Enrichment Data section appears below AI Summary
7. View LinkedIn profile, skills, work history, etc.

### Test Company Leads Enrichment

1. Open a company in the Companies page
2. Company Details slide-out opens
3. Click "Leads" tab
4. Each lead has an "Enrich" button
5. Click enrich for a specific lead
6. Success toast appears
7. Lead data refreshes (button changes to "Re-enrich")

### Test Re-enrichment

1. Open a lead that was enriched >90 days ago
2. Button shows "Re-enrich" with refresh icon
3. Click to trigger new enrichment
4. Data updates with fresh information

## Configuration

### Environment Variables Required

```bash
# n8n Configuration
N8N_ENRICHMENT_WEBHOOK_URL=https://aligreenwood.app.n8n.cloud/webhook/leaflow-enrichment
N8N_API_KEY=cAag2haO8d++8Ya5h+ECz/5U9e7/a8cx+F8pBlUdWjY=

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Files Modified

1. **[src/components/slide-out/LeadDetailsSlideOut.tsx](../src/components/slide-out/LeadDetailsSlideOut.tsx)**
   - Added imports for EnrichLeadButton and EnrichmentDataDisplay
   - Added EnrichLeadButton to header actions
   - Added EnrichmentDataDisplay to overview tab
   - Updated lead query to fetch enrichment fields

2. **[src/components/slide-out/CompanyDetailsSlideOut.tsx](../src/components/slide-out/CompanyDetailsSlideOut.tsx)**
   - Added import for EnrichLeadButton
   - Added EnrichLeadButton to each lead in the Leads tab
   - Updated related leads query to fetch enrichment fields

3. **[src/components/leads/EnrichLeadButton.tsx](../src/components/leads/EnrichLeadButton.tsx)**
   - Added `variant` and `size` props for customization
   - Applied props to all button states
   - Maintains backward compatibility (defaults work as before)

## Next Steps (Optional Enhancements)

### Bulk Enrichment

- Add "Enrich All" button in Companies Leads tab
- Enrich all related leads at once
- Show progress indicator

### Enrichment Indicators

- Add sparkles icon to enriched leads in tables
- Show confidence score badge in table cells
- Filter leads by enrichment status

### Auto-Enrichment

- Automatically enrich high-value leads on creation
- Trigger enrichment when lead enters specific workflow
- Schedule periodic re-enrichment for active leads

### Enrichment Analytics

- Track enrichment success rate
- Monitor PDL credit usage
- Show enrichment coverage percentage

### Cost Optimization

- Only show enrich button for qualified leads (not 'cold')
- Require email address for enrichment
- Warn before re-enriching recently enriched leads

## Troubleshooting

### Button is Disabled

- Check that lead has an email address
- Email is the most reliable identifier for PDL API

### No Data Showing After Enrichment

- Check browser console for errors
- Verify `enrichment_data` is populated in database
- Verify `enrichment_status === 'completed'`
- Try clicking "Re-enrich" to retry

### Enrichment Failed

- Person may not be in PDL database
- Try with more complete data (email + name + company)
- Check n8n workflow is running
- Verify N8N_API_KEY is correct

## Support

- **Backend Integration**: See [ENRICHMENT_SETUP_COMPLETE.md](./ENRICHMENT_SETUP_COMPLETE.md)
- **Usage Guide**: See [how-to-enrich-leads.md](./how-to-enrich-leads.md)
- **UI Components**: See [add-enrichment-ui.md](./add-enrichment-ui.md)

---

**Integration Complete! 🎉**

The enrichment UI is now fully integrated into your app. Users can enrich leads directly from the Lead Details and Company Details slide-outs.
