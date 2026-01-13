# How to Enrich Leads in Your App

## ✅ Setup Complete

The enrichment integration is fully configured:

- ✅ n8n webhook returns PDL enrichment data
- ✅ App service calls n8n and stores data in database
- ✅ All required fields are populated automatically

## 🎯 Simple Usage

### Option 1: From TypeScript/Server Component

```typescript
import { enrichAndStoreLead } from '@/services/enrichAndStoreLead';

async function handleEnrichLead(leadId: string, leadData: any) {
  const result = await enrichAndStoreLead({
    lead_id: leadId,
    company: leadData.company,
    email: leadData.email,
    first_name: leadData.first_name,
    last_name: leadData.last_name,
  });

  if (result.success) {
    console.log('✓ Lead enriched!');
    console.log('Confidence:', result.likelihood);
    console.log('LinkedIn:', result.enriched_data?.linkedin_url);
  } else {
    console.error('✗ Enrichment failed:', result.message);
  }
}
```

### Option 2: From Client Component (API Route)

```typescript
'use client';

async function enrichLead(leadId: string) {
  const response = await fetch('/api/enrich-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lead_id: leadId,
      company: 'Company Name',
      email: 'person@company.com',
      first_name: 'John',
      last_name: 'Doe',
    }),
  });

  const result = await response.json();

  if (result.success) {
    console.log('Lead enriched!', result);
  }
}
```

## 📊 What Gets Stored in Database

After enrichment, these fields are automatically populated:

### `enrichment_data` (JSONB)

```json
{
  "pdl_id": "person-unique-id",
  "likelihood": 9,
  "linkedin_url": "linkedin.com/in/username",
  "twitter_url": "twitter.com/username",
  "job_title": "Managing Director",
  "job_company": "Company Name",
  "job_company_website": "company.com",
  "job_company_size": "1-10",
  "job_company_industry": "industry",
  "location": "City, State, Country",
  "skills": ["skill1", "skill2", ...],
  "experience": [...],
  "education": [...],
  "enriched_at": "2026-01-13T06:00:00Z"
}
```

### Other Fields

- `enrichment_status`: `'completed'` or `'failed'`
- `enrichment_timestamp`: ISO timestamp
- `linkedin_url`: LinkedIn profile URL

## 🎨 Example: Add Enrich Button to Lead Page

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function EnrichLeadButton({ lead }: { lead: Lead }) {
  const [enriching, setEnriching] = useState(false);

  async function handleEnrich() {
    setEnriching(true);
    try {
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
        toast.success(`Lead enriched! Confidence: ${result.likelihood}/10`);
        // Refresh the page to show new data
        window.location.reload();
      } else {
        toast.error(result.message || 'Enrichment failed');
      }
    } catch (error) {
      toast.error('Failed to enrich lead');
    } finally {
      setEnriching(false);
    }
  }

  // Don't show if already enriched recently
  const isEnriched = lead.enrichment_status === 'completed';
  const enrichedRecently =
    lead.enrichment_timestamp &&
    new Date(lead.enrichment_timestamp) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  if (isEnriched && enrichedRecently) {
    return (
      <Button variant='outline' size='sm' disabled>
        ✓ Enriched
      </Button>
    );
  }

  return (
    <Button onClick={handleEnrich} disabled={enriching} size='sm'>
      {enriching ? 'Enriching...' : 'Enrich with PDL'}
    </Button>
  );
}
```

## 🔍 Display Enrichment Data

```tsx
export function LeadEnrichmentData({ lead }: { lead: Lead }) {
  if (!lead.enrichment_data) {
    return null;
  }

  const data = lead.enrichment_data as any;

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='font-semibold'>Enrichment Data</h3>
        <p className='text-sm text-muted-foreground'>
          Confidence: {data.likelihood}/10
        </p>
      </div>

      {data.linkedin_url && (
        <div>
          <label className='text-sm font-medium'>LinkedIn</label>
          <a
            href={`https://${data.linkedin_url}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            {data.linkedin_url}
          </a>
        </div>
      )}

      {data.job_title && (
        <div>
          <label className='text-sm font-medium'>Job Title</label>
          <p>{data.job_title}</p>
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div>
          <label className='text-sm font-medium'>Skills</label>
          <div className='flex flex-wrap gap-2 mt-2'>
            {data.skills.slice(0, 10).map((skill: string) => (
              <span
                key={skill}
                className='px-2 py-1 bg-gray-100 rounded text-xs'
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div>
          <label className='text-sm font-medium'>Work History</label>
          <div className='space-y-2 mt-2'>
            {data.experience.slice(0, 3).map((exp: any, i: number) => (
              <div key={i} className='border-l-2 pl-3'>
                <p className='font-medium'>{exp.title.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {exp.company.name}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {exp.start_date} - {exp.end_date || 'Present'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🚀 Auto-Enrich on Lead Creation

Add this to your lead creation flow:

```typescript
// After creating a lead
const lead = await createLead(leadData);

// Automatically enrich if we have enough data
if (lead.email || (lead.first_name && lead.last_name && lead.company)) {
  // Enrich in background (don't await)
  enrichAndStoreLead({
    lead_id: lead.id,
    company: lead.company,
    email: lead.email,
    first_name: lead.first_name,
    last_name: lead.last_name,
  }).catch(console.error);
}

return lead;
```

## 💰 Cost Management

```typescript
// Check if enrichment is needed before calling
async function shouldEnrich(lead: Lead): Promise<boolean> {
  // Already enriched recently?
  if (lead.enrichment_status === 'completed' && lead.enrichment_timestamp) {
    const daysSinceEnriched =
      (Date.now() - new Date(lead.enrichment_timestamp).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysSinceEnriched < 90) {
      return false; // Don't re-enrich for 90 days
    }
  }

  // Only enrich qualified leads
  if (lead.quality_rank === 'cold') {
    return false;
  }

  // Need at least email or full name + company
  const hasEmail = !!lead.email;
  const hasFullDetails = !!(lead.first_name && lead.last_name && lead.company);

  return hasEmail || hasFullDetails;
}
```

## 📊 Query Enriched Leads

```sql
-- Get all enriched leads
SELECT
  id,
  first_name,
  last_name,
  email,
  company,
  enrichment_status,
  (enrichment_data->>'likelihood')::int as confidence,
  enrichment_data->>'linkedin_url' as linkedin,
  enrichment_data->>'job_title' as pdl_job_title
FROM leads
WHERE enrichment_status = 'completed'
ORDER BY enrichment_timestamp DESC;

-- Get high-confidence enriched leads
SELECT *
FROM leads
WHERE enrichment_status = 'completed'
  AND (enrichment_data->>'likelihood')::int >= 8;

-- Get leads needing re-enrichment
SELECT *
FROM leads
WHERE enrichment_status = 'completed'
  AND enrichment_timestamp < NOW() - INTERVAL '90 days';
```

## ✅ Testing

Test the complete flow:

```bash
# 1. Start your dev server
npm run dev

# 2. Call the API
curl -X POST http://localhost:8086/api/enrich-lead \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "your-real-lead-uuid",
    "company": "Darling Crackles",
    "email": "craig@darlingcrackles.com.au",
    "first_name": "Craig",
    "last_name": "MacIndoe"
  }'

# 3. Check the database
psql -d your_db -c "SELECT enrichment_status, enrichment_data FROM leads WHERE id = 'your-lead-uuid';"
```

## 🎯 Summary

**To enrich a lead:**

1. Call `enrichAndStoreLead()` from server code, OR
2. Call `/api/enrich-lead` from client code
3. Data automatically stored in database
4. Access via `lead.enrichment_data`

That's it! The n8n workflow handles all the PDL API calls, and your app just stores the results.
