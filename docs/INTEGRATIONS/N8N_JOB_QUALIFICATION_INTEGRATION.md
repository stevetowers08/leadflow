# n8n Integration Guide: Job Qualification to Company Enrichment

This guide explains how to set up n8n workflows to receive job qualification events from Supabase and enrich companies with decision maker data.

## Overview

The integration follows this flow:

1. **Job Qualified** → Supabase Edge Function triggers
2. **Webhook Sent** → n8n receives job and company data
3. **Company Enrichment** → n8n enriches company with decision makers
4. **Leads Returned** → n8n inserts enriched leads back to Supabase

## 1. n8n Webhook Configuration

### Create Webhook Node

1. **Add Webhook Node** to your n8n workflow
2. **Configure Settings**:
   - **HTTP Method**: `POST`
   - **Path**: `/webhook/job-qualified` (or your preferred path)
   - **Authentication**: None (handled by webhook signature)
   - **Response Mode**: `On Received`

### Webhook Payload Structure

The webhook will receive this payload from Supabase:

```json
{
  "job_id": "uuid-123-456-789",
  "company_id": "uuid-987-654-321",
  "company_name": "Acme Corporation",
  "company_website": "https://acme.com",
  "company_linkedin_url": "https://linkedin.com/company/acme-corp",
  "job_title": "Senior Software Engineer",
  "job_location": "San Francisco, CA",
  "job_description": "We are looking for...",
  "qualification_status": "qualify",
  "qualified_at": "2025-01-27T10:00:00Z",
  "qualified_by": "user-uuid",
  "qualification_notes": "Great company, good culture",
  "event_type": "job_qualified",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

## 2. Company Enrichment Workflow

### Recommended n8n Workflow Structure

```
[Webhook] → [Set Company Data] → [Decision Maker Enrichment] → [Format Leads] → [Insert to Supabase]
```

### Step-by-Step Configuration

#### Step 1: Extract Company Data

Add a **Set** node after the webhook to extract company information:

```javascript
// Set node configuration
{
  "company_name": "{{ $json.company_name }}",
  "company_website": "{{ $json.company_website }}",
  "company_linkedin": "{{ $json.company_linkedin_url }}",
  "job_title": "{{ $json.job_title }}",
  "job_location": "{{ $json.job_location }}",
  "job_id": "{{ $json.job_id }}",
  "company_id": "{{ $json.company_id }}"
}
```

#### Step 2: Decision Maker Enrichment

Choose one of these enrichment strategies:

##### Option A: Apollo.io Integration

```javascript
// HTTP Request node to Apollo API
{
  "method": "POST",
  "url": "https://api.apollo.io/v1/mixed_people/search",
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "X-Api-Key": "{{ $vars.APOLLO_API_KEY }}"
  },
  "body": {
    "q_organization_domains": "{{ $json.company_website }}",
    "person_titles": ["CTO", "VP Engineering", "Head of Engineering", "Engineering Manager"],
    "page": 1,
    "per_page": 10
  }
}
```

##### Option B: Clay Integration

```javascript
// HTTP Request node to Clay API
{
  "method": "POST",
  "url": "https://www.clay.com/api/v1/enrichment/bulk",
  "headers": {
    "Authorization": "Bearer {{ $vars.CLAY_API_KEY }}",
    "Content-Type": "application/json"
  },
  "body": {
    "company_domain": "{{ $json.company_website }}",
    "enrichment_type": "decision_makers",
    "job_title": "{{ $json.job_title }}"
  }
}
```

##### Option C: OpenAI-Powered Enrichment

```javascript
// OpenAI node for AI-powered enrichment
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a B2B sales intelligence expert. Analyze company information and suggest potential decision makers."
    },
    {
      "role": "user",
      "content": "Company: {{ $json.company_name }}\nWebsite: {{ $json.company_website }}\nJob Title: {{ $json.job_title }}\n\nSuggest 5 potential decision makers for this role, including their likely titles and contact strategies."
    }
  ],
  "max_tokens": 1000
}
```

#### Step 3: Format Leads Data

Add a **Function** node to format the enriched data:

```javascript
// Function node to format leads
const enrichedData = $input.all();

return enrichedData.map(item => {
  const companyData = item.json;

  return {
    name: companyData.name || 'Unknown',
    email_address: companyData.email || null,
    company_id: companyData.company_id,
    company_role: companyData.title || companyData.job_title,
    employee_location: companyData.location || companyData.job_location,
    lead_score: companyData.lead_score || 'medium',
    confidence_level: companyData.confidence || 'medium',
    linkedin_url: companyData.linkedin_url || null,
    stage: 'new',
    lead_source: 'n8n_enrichment',
    source_details: `Enriched via ${companyData.enrichment_source || 'n8n'} for job: ${companyData.job_title}`,
    source_date: new Date().toISOString(),
    owner_id: companyData.qualified_by || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
});
```

#### Step 4: Insert Leads to Supabase

Add a **Supabase** node to insert the enriched leads:

**Supabase Node Configuration**:

- **Operation**: `Insert`
- **Table**: `people`
- **Data**: Use the formatted data from the previous step

```javascript
// Supabase node configuration
{
  "name": "{{ $json.name }}",
  "email_address": "{{ $json.email_address }}",
  "company_id": "{{ $json.company_id }}",
  "company_role": "{{ $json.company_role }}",
  "employee_location": "{{ $json.employee_location }}",
  "lead_score": "{{ $json.lead_score }}",
  "confidence_level": "{{ $json.confidence_level }}",
  "linkedin_url": "{{ $json.linkedin_url }}",
  "stage": "{{ $json.stage }}",
  "lead_source": "{{ $json.lead_source }}",
  "source_details": "{{ $json.source_details }}",
  "source_date": "{{ $json.source_date }}",
  "owner_id": "{{ $json.owner_id }}"
}
```

## 3. Environment Variables

Set these environment variables in your n8n instance:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Enrichment API Keys
APOLLO_API_KEY=your-apollo-api-key
CLAY_API_KEY=your-clay-api-key
OPENAI_API_KEY=your-openai-api-key

# Webhook Security
N8N_WEBHOOK_SECRET=your-webhook-secret
```

## 4. Error Handling and Monitoring

### Add Error Handling Nodes

1. **Try-Catch Node**: Wrap enrichment steps
2. **Error Logging**: Log failed enrichments
3. **Retry Logic**: Retry failed API calls
4. **Fallback**: Use alternative enrichment sources

### Monitoring Setup

```javascript
// Add monitoring/logging node
{
  "event_type": "enrichment_completed",
  "job_id": "{{ $json.job_id }}",
  "company_name": "{{ $json.company_name }}",
  "leads_found": "{{ $json.leads.length }}",
  "enrichment_source": "{{ $json.enrichment_source }}",
  "processing_time": "{{ $json.processing_time }}",
  "timestamp": "{{ new Date().toISOString() }}"
}
```

## 5. Testing the Integration

### Test Webhook Endpoint

```bash
curl -X POST https://your-n8n-instance.com/webhook/job-qualified \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: your-signature" \
  -d '{
    "job_id": "test-job-id",
    "company_name": "Test Company",
    "company_website": "https://testcompany.com",
    "job_title": "Software Engineer",
    "qualification_status": "qualify",
    "event_type": "job_qualified"
  }'
```

### Monitor Webhook Logs

Check Supabase webhook logs:

```sql
SELECT * FROM webhook_logs
WHERE event_type = 'job_qualification'
ORDER BY created_at DESC
LIMIT 10;
```

## 6. Advanced Features

### Batch Processing

For high-volume scenarios, implement batch processing:

```javascript
// Batch multiple companies for enrichment
const batchSize = 10;
const batches = [];

for (let i = 0; i < companies.length; i += batchSize) {
  batches.push(companies.slice(i, i + batchSize));
}

return batches.map(batch => ({ companies: batch }));
```

### Rate Limiting

Implement rate limiting for API calls:

```javascript
// Add delay between API calls
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Use in enrichment loop
for (const company of companies) {
  await enrichCompany(company);
  await delay(1000); // 1 second delay
}
```

### Data Quality Validation

Add validation before inserting leads:

```javascript
// Validate lead data
const validateLead = lead => {
  const errors = [];

  if (!lead.name || lead.name.trim() === '') {
    errors.push('Name is required');
  }

  if (lead.email_address && !isValidEmail(lead.email_address)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};
```

## 7. Troubleshooting

### Common Issues

1. **Webhook Not Triggering**
   - Check Supabase Edge Function logs
   - Verify n8n webhook URL is accessible
   - Check webhook signature validation

2. **Enrichment API Failures**
   - Verify API keys are valid
   - Check rate limits
   - Implement retry logic

3. **Supabase Insert Failures**
   - Check RLS policies
   - Verify data format matches schema
   - Check for duplicate entries

### Debug Steps

1. Enable n8n execution logs
2. Check Supabase function logs
3. Monitor webhook_logs table
4. Test individual workflow steps
5. Verify environment variables

## 8. Performance Optimization

### Recommendations

1. **Parallel Processing**: Process multiple companies simultaneously
2. **Caching**: Cache enrichment results to avoid duplicate API calls
3. **Filtering**: Only enrich companies that meet specific criteria
4. **Batching**: Group multiple enrichments into single API calls

### Example Optimized Workflow

```
[Webhook] → [Filter Criteria] → [Check Cache] → [Parallel Enrichment] → [Deduplicate] → [Batch Insert]
```

This integration provides a robust foundation for automating company enrichment when jobs are qualified, ensuring your lead database stays current with high-quality decision maker data.
