# Campaign Executor

Simple, efficient campaign automation execution engine.

## Overview

Processes campaign sequences automatically:

- **Email Steps**: Sends emails via Gmail API
- **Wait Steps**: Schedules next step with delay
- **Condition Steps**: Branches based on conditions (e.g., replied)

## How It Works

1. **Trigger**: Runs every 5 minutes via Supabase Cron (`*/5 * * * *`)
2. **Fetch**: Gets pending executions (max 50 per run)
3. **Process**: Handles each step type appropriately
4. **Schedule**: Creates next execution record
5. **Track**: Records all sends in `email_sends` table

## Best Practices

✅ **Queue-Based**: Uses database queue for reliable execution  
✅ **Rate Limiting**: Max 50 emails per 5-minute window  
✅ **Auto-Pause**: Stops sequences when leads reply  
✅ **Simple**: No complex orchestration, just process and schedule  
✅ **Reliable**: Database transactions ensure consistency

## Database Schema

Uses these tables:

- `campaign_sequences` - Campaign definitions
- `campaign_sequence_steps` - Individual steps (email/wait/condition)
- `campaign_sequence_leads` - People enrolled in campaigns
- `campaign_sequence_executions` - Execution queue
- `email_accounts` - Gmail OAuth accounts
- `email_sends` - Email tracking
- `interactions` - Activity logging

## Setup Cron Job

Add to Supabase SQL:

```sql
-- Run every 5 minutes
SELECT cron.schedule(
  'campaign-executor',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/campaign-executor',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := '{}'
  );
  $$
);
```

## Logs

Check Supabase Edge Function logs for execution details:

- Execution started
- Step type being processed
- Email send status
- Errors (if any)
