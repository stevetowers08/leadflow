# Supabase Edge Functions & Webhooks

This document contains all external webhooks and Edge Functions available for integration with external services like n8n, Clay, and other automation tools.

## Table of Contents

- [Overview](#overview)
- [Job Qualification Webhook](#job-qualification-webhook)
- [Duplicate Company Prevention](#duplicate-company-prevention)
- [Gmail Reply Detection](#gmail-reply-detection)
- [Webhook Security](#webhook-security)
- [Testing Webhooks](#testing-webhooks)

## Overview

Supabase Edge Functions provide HTTP endpoints that external services can call to interact with the RecruitEdge platform. These functions handle:

- **Data validation** and sanitization
- **Authentication** and authorization
- **Database operations** with proper error handling
- **CORS** configuration for cross-origin requests

### Base Configuration

All Edge Functions are deployed to:

```
https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/
```

### Authentication

Most functions require the Supabase Service Role Key for authentication:

```bash
Authorization: Bearer [SUPABASE_SERVICE_ROLE_KEY]
```

---

## Job Qualification Webhook

**Function**: `job-qualification-webhook`  
**Purpose**: Trigger company enrichment when a job is qualified  
**Status**: ✅ **ACTIVE**

### Endpoint Details

```bash
POST https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/job-qualification-webhook
```

### Request Headers

```json
{
  "Authorization": "Bearer [SUPABASE_SERVICE_ROLE_KEY]",
  "Content-Type": "application/json"
}
```

### Request Body

```json
{
  "job_id": "uuid-123-456-789",
  "qualification_status": "qualify"
}
```

### Response Format

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Webhook sent successfully",
  "job_id": "uuid-123-456-789",
  "company_name": "Acme Corporation"
}
```

**Error Response (400/500)**:

```json
{
  "error": "Error message description",
  "message": "Detailed error information"
}
```

### Webhook Payload Sent to n8n

When triggered, this function sends a comprehensive payload to your n8n webhook:

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

### Usage in n8n

#### 1. Webhook Node Configuration

**Node Type**: Webhook  
**HTTP Method**: POST  
**Path**: `/webhook/job-qualified`

**Headers** (Optional):

```json
{
  "X-Webhook-Signature": "{{ $vars.N8N_WEBHOOK_SECRET }}"
}
```

#### 2. Processing the Webhook

The webhook payload contains all necessary information for company enrichment:

- **Company Data**: Name, website, LinkedIn URL
- **Job Context**: Title, location, description
- **Qualification Details**: Notes, timestamp, qualified by

#### 3. Example n8n Workflow

```
[Webhook] → [Extract Data] → [Apollo/Clay Enrichment] → [Format Leads] → [Insert to Supabase]
```

For detailed n8n workflow setup, see: [N8N Job Qualification Integration Guide](./N8N_JOB_QUALIFICATION_INTEGRATION.md)

### Testing

#### Test with curl

```bash
curl -X POST https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/job-qualification-webhook \
  -H "Authorization: Bearer [SERVICE_ROLE_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "test-job-id",
    "qualification_status": "qualify"
  }'
```

#### Test with Real Job

1. Find a job in your database:

```sql
SELECT id, title, company_id FROM jobs WHERE qualification_status = 'new' LIMIT 1;
```

2. Trigger the webhook with the job ID
3. Check webhook logs for success/failure

### Environment Variables

Required environment variables for the job qualification webhook:

```bash
# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/job-qualified
N8N_WEBHOOK_SECRET=your-webhook-secret

# Supabase Configuration
SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Monitoring

Monitor webhook events in the `webhook_logs` table:

```sql
SELECT
  event_type,
  entity_id,
  response_status,
  created_at,
  payload->>'company_name' as company_name
FROM webhook_logs
WHERE event_type = 'job_qualification'
ORDER BY created_at DESC
LIMIT 10;
```

---

## Duplicate Company Prevention

**Function**: `check-company-duplicate`  
**Purpose**: Check if a company already exists before Clay enrichment  
**Status**: ✅ **ACTIVE**

### Endpoint Details

```bash
POST https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/check-company-duplicate
```

### Request Headers

```json
{
  "Authorization": "Bearer [SUPABASE_SERVICE_ROLE_KEY]",
  "Content-Type": "application/json"
}
```

### Request Body

```json
{
  "domain": "example.com",
  "linkedin_url": "https://linkedin.com/company/example" // optional
}
```

### Response Format

**Success Response (200)**:

```json
{
  "company_id": "uuid-123-456-789",
  "exists": true,
  "message": "Company already exists in database"
}
```

**New Company Response (200)**:

```json
{
  "company_id": "uuid-987-654-321",
  "exists": false,
  "message": "Company not found, proceed with enrichment"
}
```

**Error Response (400/500)**:

```json
{
  "error": "Error message description"
}
```

### Usage in n8n

#### 1. HTTP Request Node Configuration

**Node Type**: HTTP Request  
**Method**: POST  
**URL**: `https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/check-company-duplicate`

**Headers**:

```json
{
  "Authorization": "Bearer {{ $vars.SUPABASE_SERVICE_ROLE_KEY }}",
  "Content-Type": "application/json"
}
```

**Body**:

```json
{
  "domain": "{{ $json.company_domain }}",
  "linkedin_url": "{{ $json.company_linkedin_url }}"
}
```

#### 2. Conditional Logic

**Node Type**: IF  
**Condition**: `{{ $json.exists }} === true`

**TRUE Branch** (Company Exists):

- Skip Clay enrichment
- Use existing `company_id` from response
- Proceed to insert job

**FALSE Branch** (New Company):

- Proceed with Clay API enrichment
- Insert new company record
- Use new `company_id` from response

#### 3. Example n8n Workflow

```
[LinkedIn Job Scraper]
    ↓
[Extract Company Data]
    ↓
[Check Duplicate → POST /check-company-duplicate]
    ↓
[IF exists === true]
    ├─ TRUE → [Skip Clay] → [Insert Job with existing company_id]
    └─ FALSE → [Call Clay API] → [Insert Company] → [Insert Job]
```

### Testing

#### Test with Existing Company

```bash
curl -X POST https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/check-company-duplicate \
  -H "Authorization: Bearer [SERVICE_ROLE_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "litmos.com"
  }'
```

**Expected Response**:

```json
{
  "company_id": "25d564f0-3183-4ef9-8cb5-b5e428d0c85e",
  "exists": true,
  "message": "Company already exists in database"
}
```

#### Test with New Company

```bash
curl -X POST https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/check-company-duplicate \
  -H "Authorization: Bearer [SERVICE_ROLE_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "new-company-example.com"
  }'
```

**Expected Response**:

```json
{
  "company_id": "generated-uuid-here",
  "exists": false,
  "message": "Company not found, proceed with enrichment"
}
```

---

## Gmail Reply Detection

**Function**: `gmail-webhook`  
**Purpose**: Process Gmail Pub/Sub notifications for reply detection  
**Status**: ✅ **ACTIVE**

### Endpoint Details

```bash
POST https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/gmail-webhook
```

### Request Headers

```json
{
  "Authorization": "Bearer [SUPABASE_SERVICE_ROLE_KEY]",
  "Content-Type": "application/json"
}
```

### Request Body (Gmail Pub/Sub Format)

```json
{
  "message": {
    "data": "base64-encoded-gmail-notification",
    "messageId": "message-id",
    "publishTime": "2025-01-27T10:00:00Z"
  },
  "subscription": "projects/project-id/subscriptions/gmail-replies"
}
```

### Response Format

**Success Response (200)**:

```json
{
  "status": "processed",
  "message": "Gmail notification processed successfully"
}
```

### Usage

This webhook is automatically configured with Google Cloud Pub/Sub for Gmail notifications. No manual integration required.

---

## Webhook Security

### Authentication

All webhooks require proper authentication:

1. **Service Role Key**: For system-to-system communication
2. **API Key**: For external service integration
3. **CORS**: Configured for specific origins

### Rate Limiting

- **Default**: 100 requests per minute per IP
- **Burst**: 200 requests per minute
- **Timeout**: 30 seconds per request

### Error Handling

All webhooks implement consistent error handling:

```json
{
  "error": "Error type",
  "message": "Human readable error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

### Logging

All webhook requests are logged with:

- Request headers (sanitized)
- Request body (sanitized)
- Response status
- Processing time
- Error details (if any)

---

## Testing Webhooks

### Local Testing

Use ngrok or similar tool to expose local endpoints:

```bash
# Install ngrok
npm install -g ngrok

# Expose local Supabase functions
ngrok http 54321
```

### Production Testing

Use curl or Postman to test production endpoints:

```bash
# Test duplicate company check
curl -X POST https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/check-company-duplicate \
  -H "Authorization: Bearer [SERVICE_ROLE_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"domain": "test.com"}'
```

### Monitoring

Monitor webhook performance in:

- **Supabase Dashboard** → Functions → Logs
- **Google Cloud Console** → Pub/Sub → Subscriptions (for Gmail)
- **Application Logs** → Custom error tracking

---

## Environment Variables

Required environment variables for webhook functions:

```bash
# Supabase Configuration
SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gmail Configuration (for Gmail webhook)
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token

# AI Configuration (for sentiment analysis)
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure proper CORS headers in function
2. **Authentication Failures**: Verify Service Role Key
3. **Timeout Errors**: Check function execution time
4. **Rate Limiting**: Implement exponential backoff

### Debug Steps

1. Check Supabase function logs
2. Verify request format and headers
3. Test with curl/Postman
4. Check environment variables
5. Review function code for errors

### Support

For webhook issues:

- Check [TROUBLESHOOTING_GUIDE.md](../DEBUGGING/TROUBLESHOOTING_GUIDE.md)
- Review Supabase function logs
- Contact development team with error details

---

_Last Updated: January 27, 2025_  
_Status: All webhooks active and tested_
