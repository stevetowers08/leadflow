# Gmail Integration Setup Guide

## Overview

This guide will help you set up two-way email synchronization between your CRM and Gmail. The integration includes:

- **Inbound Sync**: Emails received in Gmail sync to CRM
- **Outbound Sync**: Emails sent from CRM sync to Gmail  
- **Thread Tracking**: Maintains conversation continuity
- **Real-time Status**: Read/unread status synchronization
- **Email Automation**: Automated outreach campaigns
- **Template System**: Reusable email templates

## Prerequisites

- Google Cloud Platform account
- Supabase project with Edge Functions enabled
- Gmail account with API access

## Step 1: Google Cloud Platform Setup

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "4Twenty CRM Gmail Integration")
4. Click "Create"

### 1.2 Enable Gmail API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Gmail API" and click on it
3. Click "Enable"
4. Also enable "Google Identity" API

### 1.3 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set **Authorized redirect URIs** to:
   ```
   https://your-supabase-project.supabase.co/auth/v1/callback
   https://your-domain.com/auth/gmail-callback
   ```
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

### 1.4 Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "4Twenty CRM"
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.modify`
5. Add test users (your Gmail accounts)
6. Save and continue

## Step 2: Supabase Configuration

### 2.1 Environment Variables

Add these environment variables to your Supabase project:

```bash
# In Supabase Dashboard → Settings → Environment Variables
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2.2 Deploy Edge Functions

Deploy the Gmail integration Edge Functions:

```bash
# Deploy Gmail authentication function
supabase functions deploy gmail-auth

# Deploy Gmail sync function  
supabase functions deploy gmail-sync
```

### 2.3 Apply Database Migration

Apply the email integration database migration:

```bash
supabase db push
```

Or manually run the migration:
```sql
-- Run the contents of supabase/migrations/20250125000002_add_email_integration_tables.sql
```

## Step 3: Frontend Configuration

### 3.1 Environment Variables

Add to your `.env` file:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3.2 Update API Routes

Update your API routes to proxy Gmail Edge Functions:

```javascript
// In your API configuration
'/api/gmail-auth': 'https://your-project.supabase.co/functions/v1/gmail-auth',
'/api/gmail-sync': 'https://your-project.supabase.co/functions/v1/gmail-sync',
```

## Step 4: Testing the Integration

### 4.1 Connect Gmail Account

1. Navigate to `/email` in your CRM
2. Click "Connect Gmail"
3. Complete OAuth flow
4. Verify connection status

### 4.2 Test Email Sync

1. Send a test email from Gmail
2. Click "Sync Inbox" in CRM
3. Verify email appears in CRM
4. Send email from CRM
5. Verify email appears in Gmail

### 4.3 Test Automation

1. Select leads in CRM
2. Click "Email Automation"
3. Configure automation settings
4. Start automation
5. Monitor webhook logs

## Step 5: Automation Setup (n8n)

### 5.1 Create Email Automation Workflow

Create a new n8n workflow with these nodes:

1. **Webhook Trigger**: `/webhook/email-automation`
2. **Gmail Node**: Send email
3. **Database Node**: Update CRM records
4. **Delay Node**: For follow-up emails
5. **Condition Node**: Check for responses

### 5.2 Webhook Configuration

Configure the webhook to receive:
```json
{
  "timestamp": "2025-01-25T10:00:00Z",
  "source": "crm_email_automation",
  "action": "email_automation_trigger",
  "leads": [...],
  "automation": {
    "type": "email",
    "templateId": "uuid",
    "subject": "Subject",
    "body": "Body",
    "delayMinutes": 0,
    "followUpEnabled": true,
    "followUpDelayDays": 7
  }
}
```

## Features Overview

### Email Sync Manager
- **Connection Status**: Real-time Gmail connection status
- **Manual Sync**: Sync inbox and sent emails on demand
- **Auto-sync**: Automatic sync every 5 minutes
- **Error Handling**: Comprehensive error logging and recovery

### Email Composer
- **Rich Text**: HTML email composition
- **Templates**: Pre-built email templates
- **Attachments**: File attachment support
- **Recipients**: To, CC, BCC support
- **Person Linking**: Automatic lead association

### Email Thread Viewer
- **Conversation View**: Thread-based email display
- **Read Status**: Real-time read/unread status
- **Message History**: Complete conversation history
- **Participant Tracking**: Multi-participant conversations

### Email Automation
- **Bulk Outreach**: Send to multiple leads
- **Template System**: Reusable email templates
- **Delay Settings**: Configurable send delays
- **Follow-up**: Automated follow-up sequences
- **Webhook Integration**: n8n automation support

## Troubleshooting

### Common Issues

1. **"Access blocked" Error**
   - Ensure OAuth consent screen is configured
   - Add your email to test users
   - Verify redirect URIs match exactly

2. **"Invalid client" Error**
   - Check Client ID and Secret are correct
   - Verify environment variables are set
   - Ensure Gmail API is enabled

3. **Sync Failures**
   - Check Edge Function logs in Supabase
   - Verify Gmail API quotas
   - Ensure proper authentication tokens

4. **Webhook Failures**
   - Verify n8n webhook URL is correct
   - Check webhook payload format
   - Monitor n8n workflow execution

### Debugging Steps

1. **Check Supabase Logs**
   ```bash
   supabase functions logs gmail-auth
   supabase functions logs gmail-sync
   ```

2. **Verify Database Tables**
   ```sql
   SELECT * FROM email_threads;
   SELECT * FROM email_messages;
   SELECT * FROM email_sync_logs;
   ```

3. **Test API Endpoints**
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/gmail-auth \
     -H "Content-Type: application/json" \
     -d '{"code":"test_code"}'
   ```

## Security Considerations

- **Token Storage**: Access tokens stored securely in localStorage
- **HTTPS Only**: All API calls use HTTPS
- **Scope Limitation**: Minimal required Gmail API scopes
- **RLS Policies**: Row-level security on all email tables
- **Rate Limiting**: Respect Gmail API rate limits

## Performance Optimization

- **Batch Operations**: Group multiple operations
- **Incremental Sync**: Only sync new/changed emails
- **Caching**: Cache frequently accessed data
- **Pagination**: Handle large email volumes
- **Background Processing**: Use Edge Functions for heavy operations

## Monitoring

### Key Metrics to Monitor

- **Sync Success Rate**: Percentage of successful syncs
- **API Quota Usage**: Gmail API quota consumption
- **Response Times**: API response times
- **Error Rates**: Failed operations per hour
- **User Engagement**: Email feature usage

### Alerts to Set Up

- Sync failure rate > 5%
- API quota usage > 80%
- Response time > 5 seconds
- Authentication failures
- Webhook delivery failures

## Support

For additional support:

1. Check Supabase Edge Function logs
2. Review Gmail API documentation
3. Monitor n8n workflow execution
4. Check browser console for frontend errors
5. Verify environment variables and configuration

---

**Note**: This integration requires ongoing maintenance and monitoring. Regular updates to Gmail API quotas, OAuth tokens, and webhook configurations may be necessary.








