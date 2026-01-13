# People Data Labs Enrichment Integration

## Overview

This integration enables automatic enrichment of lead data using People Data Labs API. Two methods are supported:

1. **n8n Webhook (Recommended)**: Asynchronous enrichment via n8n workflow with callback
2. **Direct API**: Synchronous enrichment directly from the application

## Setup Complete ✓

### 1. Environment Variables

Added to `.env.local`:

```bash
# N8N Webhook Configuration
N8N_ENRICHMENT_WEBHOOK_URL=https://aligreenwood.app.n8n.cloud/webhook/leaflow-enrichment
N8N_API_KEY=cAag2haO8d++8Ya5h+ECz/5U9e7/a8cx+F8pBlUdWjY=

# People Data Labs API (for direct integration)
PEOPLE_DATA_LABS_API_KEY=your_pdl_api_key_here
PEOPLE_DATA_LABS_API_URL=https://api.peopledatalabs.com/v5/person/enrich
```

### 2. Files Created

- **[src/types/peopleDataLabs.ts](src/types/peopleDataLabs.ts)**: TypeScript types for PDL API
- **[src/services/peopleDataLabsService.ts](src/services/peopleDataLabsService.ts)**: Enrichment service with both methods
- **[src/app/api/enrichment-callback/route.ts](src/app/api/enrichment-callback/route.ts)**: Callback endpoint for n8n

## Architecture

### Method 1: n8n Webhook (Asynchronous)

```
┌──────────────┐
│  LeadFlow    │
│  Application │
└──────┬───────┘
       │
       │ 1. POST /webhook/leaflow-enrichment
       │    {lead_id, company, email, first_name, last_name}
       │
       v
┌──────────────┐
│  n8n Cloud   │
│  Workflow    │
└──────┬───────┘
       │
       │ 2. GET /v5/person/enrich (PDL API)
       │
       v
┌──────────────┐
│ People Data  │
│    Labs      │
└──────┬───────┘
       │
       │ 3. Returns enriched data
       │
       v
┌──────────────┐
│  n8n Cloud   │
│  Workflow    │
└──────┬───────┘
       │
       │ 4. POST /api/enrichment-callback
       │    {lead_id, enrichment_data}
       │
       v
┌──────────────┐
│  LeadFlow    │
│  Updates DB  │
└──────────────┘
```

### Method 2: Direct API (Synchronous)

```
┌──────────────┐
│  LeadFlow    │
│  Application │
└──────┬───────┘
       │
       │ GET /v5/person/enrich
       │ Headers: X-Api-Key
       │
       v
┌──────────────┐
│ People Data  │
│    Labs      │
└──────┬───────┘
       │
       │ Returns enriched data
       │
       v
┌──────────────┐
│  LeadFlow    │
│  Updates DB  │
└──────────────┘
```

## API Endpoints

### 1. n8n Enrichment Webhook

**URL**: `https://aligreenwood.app.n8n.cloud/webhook/leaflow-enrichment`

**Method**: POST

**Headers**:

- `Content-Type: application/json`
- `X-API-Key: cAag2haO8d++8Ya5h+ECz/5U9e7/a8cx+F8pBlUdWjY=`

**Request Body**:

```json
{
  "lead_id": "uuid-of-lead",
  "company": "Company Name",
  "email": "person@company.com",
  "first_name": "John",
  "last_name": "Doe",
  "callback_url": "https://leadflow-rho-two.vercel.app/api/enrichment-callback",
  "timestamp": "2026-01-13T05:45:00Z"
}
```

**Response**:

```json
{
  "message": "Workflow was started"
}
```

### 2. Enrichment Callback (from n8n)

**URL**: `https://leadflow-rho-two.vercel.app/api/enrichment-callback`

**Method**: POST

**Headers**:

- `Content-Type: application/json`
- `X-API-Key: cAag2haO8d++8Ya5h+ECz/5U9e7/a8cx+F8pBlUdWjY=`

**Request Body** (from n8n):

```json
{
  "lead_id": "uuid-of-lead",
  "enrichment_data": [
    {
      "status": 200,
      "likelihood": 9,
      "data": {
        "id": "pdl-person-id",
        "full_name": "John Doe",
        "first_name": "john",
        "last_name": "doe",
        "linkedin_url": "linkedin.com/in/johndoe",
        "job_title": "CEO",
        "job_company_name": "Company Name",
        "skills": ["skill1", "skill2"],
        ...
      }
    }
  ]
}
```

## Testing

### Test 1: Send Enrichment Request to n8n

```bash
curl -X POST https://aligreenwood.app.n8n.cloud/webhook/leaflow-enrichment \
  -H "Content-Type: application/json" \
  -H "X-API-Key: cAag2haO8d++8Ya5h+ECz/5U9e7/a8cx+F8pBlUdWjY=" \
  -d '{
    "lead_id": "test-lead-456",
    "company": "Darling Crackles",
    "email": "craig@darlingcrackles.com.au",
    "first_name": "Craig",
    "last_name": "MacIndoe",
    "callback_url": "https://leadflow-rho-two.vercel.app/api/enrichment-callback",
    "timestamp": "2026-01-13T05:45:00Z"
  }'
```

**Expected Response**:

```json
{ "message": "Workflow was started" }
```

### Test 2: Simulate Callback from n8n

```bash
curl -X POST https://leadflow-rho-two.vercel.app/api/enrichment-callback \
  -H "Content-Type: application/json" \
  -H "X-API-Key: cAag2haO8d++8Ya5h+ECz/5U9e7/a8cx+F8pBlUdWjY=" \
  -d '{
    "lead_id": "test-lead-id-123",
    "enrichment_data": [{
      "status": 200,
      "likelihood": 9,
      "data": {
        "id": "test-pdl-id",
        "full_name": "craig macindoe",
        "linkedin_url": "linkedin.com/in/craig-macindoe",
        "job_title": "managing director",
        "job_company_name": "darling crackles"
      }
    }]
  }'
```

## n8n Workflow Configuration

Your n8n workflow should:

1. **Webhook Trigger**: Receive POST requests with lead data
2. **HTTP Request Node**: Call PDL API
   - URL: `https://api.peopledatalabs.com/v5/person/enrich`
   - Method: GET
   - Headers: `X-Api-Key: YOUR_PDL_API_KEY`
   - Query Parameters: `email`, `first_name`, `last_name`, `company`
3. **HTTP Request Node**: Send enriched data back to callback
   - URL: `https://leadflow-rho-two.vercel.app/api/enrichment-callback`
   - Method: POST
   - Headers: `X-API-Key: cAag2haO8d++8Ya5h+ECz/5U9e7/a8cx+F8pBlUdWjY=`
   - Body: `{"lead_id": "{{$json.lead_id}}", "enrichment_data": {{$json.data}}}`
4. **Respond to Webhook**: Set to "Respond When Last Node Finishes"

## Database Schema

The enrichment data is stored in the `leads` table:

```sql
-- enrichment_data column (JSONB)
{
  "pdl_id": "string",
  "likelihood": 9,
  "linkedin_url": "string",
  "job_title": "string",
  "job_company": "string",
  "skills": ["string"],
  "experience": [...],
  "education": [...]
}

-- enrichment_status column (text)
-- Values: 'pending' | 'completed' | 'not_found' | 'failed'

-- enrichment_timestamp column (timestamptz)
-- When the enrichment was completed
```

## Usage in Application

### Trigger Enrichment for a Lead

```typescript
import { triggerEnrichmentViaWebhook } from '@/services/peopleDataLabsService';

// Trigger enrichment
const result = await triggerEnrichmentViaWebhook(leadId, {
  company: 'Acme Corp',
  email: 'john@acme.com',
  first_name: 'John',
  last_name: 'Doe',
});

// Result: { success: true, message: "Workflow was started" }
```

### Check Enrichment Status

```typescript
// Query the lead
const { data: lead } = await supabase
  .from('leads')
  .select('enrichment_status, enrichment_data, enrichment_timestamp')
  .eq('id', leadId)
  .single();

// enrichment_status values:
// - 'pending': Enrichment in progress
// - 'completed': Enrichment successful
// - 'not_found': No PDL data found
// - 'failed': Enrichment failed
```

## Enriched Data Fields

From PDL, we store:

- `pdl_id`: Person ID from PDL
- `likelihood`: Confidence score (0-10)
- `linkedin_url`: LinkedIn profile URL
- `twitter_url`: Twitter profile URL
- `github_url`: GitHub profile URL
- `mobile_phone`: Mobile phone number
- `work_email`: Work email address
- `job_title`: Current job title
- `job_company`: Current company name
- `job_company_website`: Company website
- `job_company_size`: Company size range
- `job_company_industry`: Company industry
- `location`: Current location
- `skills`: Array of skills
- `experience`: Work history array
- `education`: Education history array

## Security

- **API Key Authentication**: All requests use `X-API-Key` header
- **Service Role Key**: Callback endpoint uses Supabase service role for database access
- **CORS**: Callback endpoint has proper CORS headers
- **Validation**: All inputs are validated before processing

## Monitoring

### Check Recent Enrichments

```sql
SELECT
  id,
  first_name,
  last_name,
  company,
  enrichment_status,
  enrichment_timestamp,
  (enrichment_data->>'likelihood')::int as confidence
FROM leads
WHERE enrichment_timestamp IS NOT NULL
ORDER BY enrichment_timestamp DESC
LIMIT 20;
```

### Check Failed Enrichments

```sql
SELECT
  id,
  first_name,
  last_name,
  email,
  company,
  enrichment_status
FROM leads
WHERE enrichment_status IN ('not_found', 'failed')
ORDER BY created_at DESC;
```

## Next Steps

1. **Add PDL API Key**: Update `PEOPLE_DATA_LABS_API_KEY` in production environment
2. **Test End-to-End**: Create a real lead and trigger enrichment
3. **Monitor n8n Workflow**: Check n8n execution logs for any errors
4. **Add UI Indicators**: Show enrichment status in lead details
5. **Bulk Enrichment**: Create batch enrichment for existing leads

## Cost Considerations

- **People Data Labs**: Pay per API call (~$0.01-0.05 per record depending on plan)
- **n8n Cloud**: Workflow executions count towards your n8n plan
- **Recommendation**: Use enrichment strategically for high-value leads

## Troubleshooting

### Workflow not triggering

- Check n8n webhook URL is correct
- Verify X-API-Key matches in both webhook and n8n
- Check n8n workflow is active

### Callback not received

- Verify callback URL in n8n is correct
- Check n8n has X-API-Key configured for callback
- Review n8n execution logs

### No data returned from PDL

- Check PDL API key is valid
- Verify input data quality (email, name, company)
- Check PDL credit balance
- Review likelihood score (lower = less confident match)
