# Adding Enrichment UI to Your App

## Components Created

1. **[EnrichLeadButton.tsx](../src/components/leads/EnrichLeadButton.tsx)** - Button to trigger enrichment
2. **[EnrichmentDataDisplay.tsx](../src/components/leads/EnrichmentDataDisplay.tsx)** - Display enriched data

## Quick Integration

### Add to Lead Detail Page/Slide-out

```tsx
import { EnrichLeadButton } from '@/components/leads/EnrichLeadButton';
import { EnrichmentDataDisplay } from '@/components/leads/EnrichmentDataDisplay';

export function LeadDetailPage({ lead }: { lead: Lead }) {
  return (
    <div>
      {/* Existing lead info */}
      <h1>
        {lead.first_name} {lead.last_name}
      </h1>

      {/* Add enrich button */}
      <EnrichLeadButton lead={lead} />

      {/* Display enrichment data */}
      <EnrichmentDataDisplay lead={lead} />
    </div>
  );
}
```

### Example: Add to PersonDetailsSlideOut

If you have a file like `src/components/slide-out/PersonDetailsSlideOut.tsx`, add:

```tsx
import { EnrichLeadButton } from '@/components/leads/EnrichLeadButton';
import { EnrichmentDataDisplay } from '@/components/leads/EnrichmentDataDisplay';

// Inside your component, add the button near the top actions
<div className="flex gap-2">
  {/* Existing buttons */}
  <EnrichLeadButton lead={lead} onSuccess={() => refetchLead()} />
</div>

// Add enrichment data section
<div className="mt-6">
  <EnrichmentDataDisplay lead={lead} />
</div>
```

### Example: Add to Lead Table Actions

```tsx
import { EnrichLeadButton } from '@/components/leads/EnrichLeadButton';

// In your table row actions
{
  id: "enrich",
  label: "Enrich",
  icon: Sparkles,
  onClick: async (lead) => {
    const response = await fetch('/api/enrich-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: lead.id,
        company: lead.company,
        email: lead.email,
        first_name: lead.first_name,
        last_name: lead.last_name,
      }),
    });
    const result = await response.json();
    if (result.success) {
      toast.success(`Enriched! Confidence: ${result.likelihood}/10`);
      refetchLeads();
    }
  },
}
```

## Features

### EnrichLeadButton

**Props:**

- `lead`: Lead object
- `onSuccess?`: Optional callback when enrichment succeeds

**States:**

- ✓ Shows "Enrich with PDL" for un-enriched leads
- ✓ Shows "Re-enrich" for leads enriched >90 days ago
- ✓ Shows "Enriching..." while processing
- ✓ Disabled if no email (email is most reliable for PDL)
- ✓ Auto-refreshes page or calls onSuccess callback

**Usage:**

```tsx
<EnrichLeadButton
  lead={lead}
  onSuccess={() => {
    // Custom refresh logic
    refetchLead();
  }}
/>
```

### EnrichmentDataDisplay

**Props:**

- `lead`: Lead object with enrichment_data

**Shows:**

- ✅ Confidence score badge
- ✅ Social profiles (LinkedIn, Twitter, GitHub)
- ✅ Current position with company details
- ✅ Top 15 skills
- ✅ Work history (top 3 positions)
- ✅ Education
- ✅ Enrichment timestamp

**Usage:**

```tsx
<EnrichmentDataDisplay lead={lead} />
```

## Styling

Both components use shadcn/ui components:

- `Badge` - For tags and confidence scores
- `Card` - For content sections
- `Button` - For the enrich action
- Icons from `lucide-react`

Customize by modifying the component files or passing className props.

## Real-time Updates

### Option 1: Page Refresh (Simple)

```tsx
<EnrichLeadButton
  lead={lead}
  // Automatically refreshes page on success
/>
```

### Option 2: Custom Refresh (Advanced)

```tsx
<EnrichLeadButton
  lead={lead}
  onSuccess={() => {
    // Use your data fetching method
    mutate(); // SWR
    // or
    queryClient.invalidateQueries(['lead', lead.id]); // React Query
    // or
    refetchLead(); // Custom
  }}
/>
```

## Conditional Display

### Only show for qualified leads

```tsx
{
  lead.quality_rank !== 'cold' && <EnrichLeadButton lead={lead} />;
}
```

### Show enrichment data in expandable section

```tsx
{
  lead.enrichment_data && (
    <Collapsible>
      <CollapsibleTrigger>View Enrichment Data</CollapsibleTrigger>
      <CollapsibleContent>
        <EnrichmentDataDisplay lead={lead} />
      </CollapsibleContent>
    </Collapsible>
  );
}
```

### Add to lead status indicators

```tsx
{
  lead.enrichment_status === 'completed' && (
    <Badge variant='success'>
      <Sparkles className='h-3 w-3 mr-1' />
      Enriched
    </Badge>
  );
}
```

## Testing

1. Find a lead with an email address
2. Click "Enrich with PDL" button
3. Wait 2-3 seconds for enrichment
4. Page refreshes and shows enrichment data
5. LinkedIn profile, skills, and work history appear

## Troubleshooting

### Button disabled

- Check lead has email address
- Email is the most reliable identifier for PDL

### No data showing after enrichment

- Check browser console for errors
- Verify lead.enrichment_data is populated in database
- Check lead.enrichment_status is 'completed'

### Enrichment failed

- Person may not be in PDL database
- Try with different email or more details
- Check n8n workflow is running
- Verify N8N_API_KEY is correct

## Next Steps

1. Add enrichment button to your lead detail pages
2. Add enrichment data display where you show lead info
3. Consider auto-enriching high-value leads on creation
4. Add bulk enrichment action for multiple leads
5. Show enrichment indicators in lead lists

## Cost Optimization

Only show enrich button for:

- Qualified leads (not 'cold')
- Leads with email addresses
- Leads in active workflows

```tsx
const shouldShowEnrich =
  lead.quality_rank !== 'cold' &&
  lead.email &&
  lead.workflow_status === 'active';

{
  shouldShowEnrich && <EnrichLeadButton lead={lead} />;
}
```
