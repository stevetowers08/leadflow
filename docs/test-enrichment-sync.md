# Testing People Data Labs Enrichment (Synchronous Response)

## Overview

The enrichment integration now uses n8n's **"Respond When Last Node Finishes"** feature, which means:

- The n8n workflow receives the enrichment request
- Calls People Data Labs API
- Returns the enriched data directly in the webhook response (synchronous)
- The app receives and stores the enriched data immediately

## Architecture Flow

```
┌──────────────────┐
│  LeadFlow App    │
│  POST /api/      │
│  enrich-lead     │
└────────┬─────────┘
         │
         │ 1. Send lead data
         │
         v
┌──────────────────┐
│  n8n Webhook     │
│  (responds when  │
│  last node done) │
└────────┬─────────┘
         │
         │ 2. Call PDL API
         │
         v
┌──────────────────┐
│  People Data     │
│  Labs API        │
└────────┬─────────┘
         │
         │ 3. Return enriched data
         │
         v
┌──────────────────┐
│  n8n Workflow    │
│  Returns data    │
└────────┬─────────┘
         │
         │ 4. Enriched data in response
         │
         v
┌──────────────────┐
│  LeadFlow App    │
│  Updates DB      │
│  - enrichment_   │
│    data          │
│  - enrichment_   │
│    status        │
│  - linkedin_url  │
└──────────────────┘
```

## Files Created

1. **[src/services/enrichLeadService.ts](../src/services/enrichLeadService.ts)**
   - Main enrichment service
   - Handles n8n webhook call and response processing
   - Updates lead records in database

2. **[src/app/api/enrich-lead/route.ts](../src/app/api/enrich-lead/route.ts)**
   - API endpoint to trigger enrichment
   - Accepts lead data and returns enriched result

## n8n Workflow Configuration

Your n8n workflow should be configured with these nodes:

### 1. Webhook Trigger Node

- **URL**: `/webhook/leaflow-enrichment`
- **Method**: POST
- **Authentication**: Header Auth
  - Header Name: `X-API-Key`
  - Header Value: `cAag2haO8d++8Ya5h+ECz/5U9e7/a8cx+F8pBlUdWjY=`
- **Respond**: When Last Node Finishes ✓ (Important!)

### 2. HTTP Request Node (Call PDL API)

- **URL**: `https://api.peopledatalabs.com/v5/person/enrich`
- **Method**: GET
- **Authentication**: Header Auth
  - Header Name: `X-Api-Key`
  - Header Value: `YOUR_PDL_API_KEY`
- **Query Parameters**:
  ```
  email: {{$json.email}}
  first_name: {{$json.first_name}}
  last_name: {{$json.last_name}}
  company: {{$json.company}}
  min_likelihood: 6
  ```

### 3. Respond to Webhook Node

- **Response Data**: `{{$json}}` (returns the PDL API response)
- This will return the enriched data to the caller

## API Usage

### Endpoint: POST /api/enrich-lead

**Request:**

```bash
curl -X POST http://localhost:8086/api/enrich-lead \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "uuid-of-lead",
    "company": "Company Name",
    "email": "person@company.com",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Lead enriched successfully",
  "likelihood": 9,
  "enriched_data": {
    "pdl_id": "person-id",
    "likelihood": 9,
    "linkedin_url": "linkedin.com/in/johndoe",
    "job_title": "CEO",
    "job_company": "Company Name",
    "job_company_website": "company.com",
    "skills": ["skill1", "skill2"],
    "experience": [...],
    "education": [...]
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "No enrichment data found for this lead"
}
```

## Testing Scenarios

### Test 1: Direct n8n Webhook (Basic Test)

Test that n8n returns enriched data:

```bash
curl -X POST https://aligreenwood.app.n8n.cloud/webhook/leaflow-enrichment \
  -H "Content-Type: application/json" \
  -H "X-API-Key: cAag2haO8d++8Ya5h+ECz/5U9e7/a8cx+F8pBlUdWjY=" \
  -d '{
    "lead_id": "test-123",
    "company": "Darling Crackles",
    "email": "craig@darlingcrackles.com.au",
    "first_name": "Craig",
    "last_name": "MacIndoe"
  }'
```

**Expected**: Should return PDL enrichment data array

### Test 2: Via App API (Full Integration Test)

Test the complete flow through the app:

```bash
# Start dev server first
npm run dev

# Then in another terminal:
curl -X POST http://localhost:8086/api/enrich-lead \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "existing-lead-uuid",
    "company": "Test Company",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Test 3: Verify Database Update

After enrichment, check the database:

```sql
SELECT
  id,
  first_name,
  last_name,
  email,
  company,
  enrichment_status,
  enrichment_timestamp,
  linkedin_url,
  (enrichment_data->>'likelihood')::int as confidence,
  enrichment_data->>'job_title' as pdl_job_title,
  enrichment_data->>'job_company' as pdl_company
FROM leads
WHERE id = 'your-lead-uuid';
```

## Database Fields Updated

When enrichment completes successfully:

| Field                  | Type        | Description                 |
| ---------------------- | ----------- | --------------------------- |
| `enrichment_data`      | JSONB       | Full enriched data from PDL |
| `enrichment_status`    | text        | `'completed'` or `'failed'` |
| `enrichment_timestamp` | timestamptz | When enrichment finished    |
| `linkedin_url`         | text        | LinkedIn profile URL        |

### Sample enrichment_data structure:

```json
{
  "pdl_id": "person-id",
  "likelihood": 9,
  "linkedin_url": "linkedin.com/in/craig-macindoe",
  "linkedin_username": "craig-macindoe-3a166a19",
  "twitter_url": "twitter.com/chefmumu",
  "job_title": "managing director",
  "job_company": "darling crackles",
  "job_company_website": "darlingcrackles.com.au",
  "job_company_size": "1-10",
  "job_company_industry": "marketing and advertising",
  "job_company_linkedin_url": "linkedin.com/company/darling-crackles",
  "location": "sydney, new south wales, australia",
  "skills": [
    "hospitality",
    "management",
    "food industry"
  ],
  "experience": [...],
  "education": [...],
  "enriched_at": "2026-01-13T05:50:00.000Z"
}
```

## Integration with App

### Trigger Enrichment from TypeScript

```typescript
import { enrichLead } from '@/services/enrichLeadService';

async function enrichLeadData(leadId: string, leadData: any) {
  const result = await enrichLead({
    lead_id: leadId,
    company: leadData.company,
    email: leadData.email,
    first_name: leadData.first_name,
    last_name: leadData.last_name,
  });

  if (result.success) {
    console.log('Enrichment successful:', result.enriched_data);
    console.log('Confidence:', result.likelihood);
  } else {
    console.error('Enrichment failed:', result.message);
  }

  return result;
}
```

### Trigger Enrichment from API Route

```typescript
// From any API route or server component
const response = await fetch('/api/enrich-lead', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lead_id: 'uuid',
    company: 'Company Name',
    email: 'person@company.com',
    first_name: 'John',
    last_name: 'Doe',
  }),
});

const result = await response.json();
```

## Monitoring and Debugging

### Check Enrichment Status

```sql
-- Get enrichment statistics
SELECT
  enrichment_status,
  COUNT(*) as count
FROM leads
WHERE enrichment_timestamp IS NOT NULL
GROUP BY enrichment_status;

-- Get recent enrichments
SELECT
  id,
  first_name,
  last_name,
  company,
  enrichment_status,
  (enrichment_data->>'likelihood')::int as confidence,
  enrichment_timestamp
FROM leads
WHERE enrichment_timestamp > NOW() - INTERVAL '1 day'
ORDER BY enrichment_timestamp DESC;
```

### n8n Workflow Debugging

1. Check n8n execution logs
2. Verify PDL API key is correct
3. Check webhook authentication header
4. Ensure "Respond When Last Node Finishes" is enabled
5. Test PDL API directly to verify credits/access

## Troubleshooting

### Issue: 405 Method Not Allowed

- **Cause**: Route not deployed to production
- **Solution**: Deploy the app or test locally with `npm run dev`

### Issue: n8n returns "Authorization data is wrong"

- **Cause**: X-API-Key header missing or incorrect
- **Solution**: Verify header value matches `N8N_API_KEY` in env

### Issue: No enrichment data returned

- **Cause**: PDL couldn't find the person
- **Solution**: Try with more specific data (email is most reliable)

### Issue: enrichment_status = 'failed'

- **Causes**:
  - PDL API returned no results
  - n8n workflow error
  - Network timeout
- **Solution**: Check n8n execution logs for details

## Next Steps

1. ✅ Deploy the new API routes to production
2. ✅ Configure n8n workflow with PDL API key
3. ✅ Test with a real lead
4. Add UI button to trigger enrichment manually
5. Add automatic enrichment on lead creation
6. Display enrichment data in lead detail view
7. Add bulk enrichment for existing leads

## Cost Considerations

- **People Data Labs**: ~$0.01-0.05 per enrichment
- **n8n Cloud**: Counts as workflow execution
- **Recommendation**: Only enrich high-value leads or leads that enter workflows
