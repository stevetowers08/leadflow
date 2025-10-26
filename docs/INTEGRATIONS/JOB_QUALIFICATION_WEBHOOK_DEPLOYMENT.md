# Job Qualification Webhook Deployment Guide

This guide walks you through deploying the job qualification webhook system for n8n integration.

## Prerequisites

- Supabase project with Edge Functions enabled
- n8n instance (cloud or self-hosted)
- Decision maker enrichment API access (Apollo, Clay, etc.)

## Step 1: Deploy Supabase Edge Function

### 1.1 Deploy the Edge Function

```bash
# Navigate to your project directory
cd supabase/functions/job-qualification-webhook

# Deploy the function
supabase functions deploy job-qualification-webhook
```

### 1.2 Set Environment Variables

In your Supabase dashboard, go to **Settings** → **Edge Functions** and add:

```bash
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/job-qualified
N8N_WEBHOOK_SECRET=your-secure-webhook-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 1.3 Apply Database Migration

```bash
# Apply the webhook migration
supabase db push
```

This creates:

- `webhook_logs` table for monitoring
- Database trigger for qualification events
- RLS policies for security

## Step 2: Configure n8n Workflow

### 2.1 Import Workflow Template

1. Open your n8n instance
2. Go to **Workflows** → **Import from File**
3. Upload `docs/INTEGRATIONS/n8n-job-qualification-workflow.json`

### 2.2 Configure Webhook Node

1. Open the **Job Qualification Webhook** node
2. Set the webhook path: `/webhook/job-qualified`
3. Copy the webhook URL (you'll need this for Supabase)

### 2.3 Set Environment Variables

In n8n, go to **Settings** → **Environment Variables** and add:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Enrichment API Keys
APOLLO_API_KEY=your-apollo-api-key
CLAY_API_KEY=your-clay-api-key
OPENAI_API_KEY=your-openai-api-key

# Webhook Security
N8N_WEBHOOK_SECRET=your-secure-webhook-secret
```

### 2.4 Configure Supabase Node

1. Open the **Insert Leads to Supabase** node
2. Click **Create New Credential**
3. Enter your Supabase URL and Service Role Key
4. Test the connection

## Step 3: Test the Integration

### 3.1 Test Webhook Endpoint

```bash
curl -X POST https://your-project.supabase.co/functions/v1/job-qualification-webhook \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "test-job-id",
    "qualification_status": "qualify"
  }'
```

### 3.2 Test with Real Job

1. Find a job in your database:

```sql
SELECT id, title, company_id FROM jobs WHERE qualification_status = 'new' LIMIT 1;
```

2. Update the job qualification status:

```sql
UPDATE jobs
SET qualification_status = 'qualify',
    qualified_at = NOW(),
    qualified_by = 'your-user-id'
WHERE id = 'your-job-id';
```

3. Check n8n execution logs for the webhook trigger

### 3.3 Monitor Webhook Logs

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

## Step 4: Configure Frontend Integration

### 4.1 Update Job Qualification Modal

The `JobQualificationModal.tsx` has been updated to automatically trigger the webhook when a job is qualified. No additional configuration needed.

### 4.2 Test Frontend Integration

1. Open your application
2. Navigate to a job with `qualification_status = 'new'`
3. Click "Qualify Job"
4. Select "Qualify" status
5. Add notes and save
6. Check n8n logs for the webhook trigger

## Step 5: Production Deployment

### 5.1 Security Checklist

- [ ] Webhook secret is set and secure
- [ ] RLS policies are enabled
- [ ] API keys are properly secured
- [ ] CORS is configured correctly
- [ ] Rate limiting is implemented

### 5.2 Monitoring Setup

1. **Supabase Logs**: Monitor Edge Function logs
2. **n8n Logs**: Monitor workflow executions
3. **Database Logs**: Monitor webhook_logs table
4. **Error Alerts**: Set up alerts for failed webhooks

### 5.3 Performance Optimization

1. **Batch Processing**: For high-volume scenarios
2. **Caching**: Cache enrichment results
3. **Rate Limiting**: Respect API limits
4. **Error Handling**: Implement retry logic

## Troubleshooting

### Common Issues

#### Webhook Not Triggering

- Check Supabase Edge Function logs
- Verify n8n webhook URL is accessible
- Check webhook signature validation

#### Enrichment API Failures

- Verify API keys are valid
- Check rate limits
- Implement retry logic

#### Supabase Insert Failures

- Check RLS policies
- Verify data format matches schema
- Check for duplicate entries

### Debug Steps

1. **Check Supabase Function Logs**:

```bash
supabase functions logs job-qualification-webhook
```

2. **Check n8n Execution Logs**:

- Go to n8n → Executions
- Look for failed webhook executions

3. **Check Database Logs**:

```sql
SELECT * FROM webhook_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

4. **Test Individual Components**:

- Test webhook endpoint directly
- Test n8n workflow with sample data
- Test Supabase insert manually

## Environment Variables Reference

### Supabase Edge Function

```bash
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/job-qualified
N8N_WEBHOOK_SECRET=your-secure-webhook-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### n8n Workflow

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
APOLLO_API_KEY=your-apollo-api-key
CLAY_API_KEY=your-clay-api-key
OPENAI_API_KEY=your-openai-api-key
N8N_WEBHOOK_SECRET=your-secure-webhook-secret
```

## API Endpoints

### Job Qualification Webhook

- **URL**: `https://your-project.supabase.co/functions/v1/job-qualification-webhook`
- **Method**: POST
- **Auth**: Bearer token (Service Role Key)

### n8n Webhook

- **URL**: `https://your-n8n-instance.com/webhook/job-qualified`
- **Method**: POST
- **Auth**: Optional webhook signature

## Support

For issues with this integration:

1. Check the troubleshooting section above
2. Review Supabase Edge Function logs
3. Check n8n execution logs
4. Verify environment variables
5. Test individual components

## Next Steps

After successful deployment:

1. **Monitor Performance**: Track webhook success rates
2. **Optimize Enrichment**: Fine-tune decision maker criteria
3. **Scale Processing**: Implement batch processing for high volume
4. **Add More Sources**: Integrate additional enrichment APIs
5. **Enhance Analytics**: Track enrichment quality and ROI

This webhook system provides a robust foundation for automating company enrichment when jobs are qualified, ensuring your lead database stays current with high-quality decision maker data.
