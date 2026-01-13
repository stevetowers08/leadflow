# Lemlist Webhook Integration

## Overview

This integration enables real-time synchronization of lead activity and campaign events from Lemlist to LeadFlow.

## Features

- ✅ Real-time lead status updates
- ✅ Email activity tracking (sent, opened, clicked, replied, bounced)
- ✅ LinkedIn activity tracking
- ✅ Campaign completion events
- ✅ Automatic lead and company status updates
- ✅ Full audit trail of all webhook deliveries

## Setup

### 1. Configure Lemlist Integration

First, ensure you have Lemlist connected in Settings with your API key and email.

### 2. Create Webhook

Navigate to Settings > Integrations > Lemlist and click "Create Default Webhook". This will:

- Subscribe to key email and status events
- Set up the webhook receiver endpoint
- Enable real-time sync for all campaigns

### 3. Verify Webhook

Check the webhook list to confirm it's active. You should see:

- Status: Active
- Event types: 7 events subscribed
- Webhook URL pointing to your deployment

## Event Mappings

### Email Events

| Lemlist Event        | Activity Type        | Lead Status      | Workflow Status |
| -------------------- | -------------------- | ---------------- | --------------- |
| `emailsSent`         | `email_sent`         | `message_sent`   | `active`        |
| `emailsOpened`       | `email_opened`       | `active`         | -               |
| `emailsClicked`      | `email_clicked`      | `active`         | -               |
| `emailsReplied`      | `email_replied`      | `replied_manual` | `paused`        |
| `emailsBounced`      | `email_bounced`      | -                | `paused`        |
| `emailsUnsubscribed` | `email_unsubscribed` | -                | `completed`     |

### Status Events

| Lemlist Event      | Activity Type        | Lead Status      | Workflow Status |
| ------------------ | -------------------- | ---------------- | --------------- |
| `interested`       | `lead_updated`       | `interested`     | -               |
| `notInterested`    | `lead_updated`       | `not_interested` | `completed`     |
| `campaignComplete` | `workflow_completed` | `completed`      | `completed`     |

### LinkedIn Events

| Lemlist Event            | Activity Type       | Lead Status |
| ------------------------ | ------------------- | ----------- |
| `linkedinInviteAccepted` | `linkedin_activity` | `active`    |
| `linkedinReplied`        | `linkedin_activity` | `active`    |

## Testing

### Local Testing

1. Start the dev server: `npm run dev`
2. Use ngrok to expose local endpoint:
   ```bash
   ngrok http 3000
   ```
3. Update webhook URL in database to ngrok URL
4. Trigger events in Lemlist
5. Monitor webhook deliveries in database

### Manual Testing

Test webhook endpoint directly:

```bash
curl -X POST http://localhost:3000/api/lemlist/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "emailsSent",
    "email": "test@example.com",
    "campaignId": "your-campaign-id",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Monitoring

View webhook deliveries:

```sql
SELECT
  id,
  event_type,
  lead_email,
  processed,
  processing_error,
  received_at,
  processed_at
FROM lemlist_webhook_deliveries
ORDER BY received_at DESC
LIMIT 50;
```

Check for errors:

```sql
SELECT *
FROM lemlist_webhook_deliveries
WHERE processed = false OR processing_error IS NOT NULL
ORDER BY received_at DESC;
```

## Troubleshooting

### Webhook not receiving events

1. Check webhook is active in database
2. Verify Lemlist webhook ID is stored correctly
3. Check Lemlist dashboard for webhook delivery status
4. Ensure public URL is accessible from internet

### Events received but not processed

1. Check `lemlist_webhook_deliveries` table for errors
2. Verify lead exists in database with matching email
3. Check logs for processing errors
4. Ensure campaign ID matches

### Lead status not updating

1. Verify event type mapping in `lemlistWebhookService.ts`
2. Check lead status values match database enum
3. Ensure RLS policies allow updates

## Security

- Webhook endpoint is public (POST only)
- Events are matched to users via campaign ID
- All deliveries logged for audit trail
- Invalid payloads return 200 to prevent retries
- Service role key used for database access

## Performance

- Webhook processing is asynchronous
- Each delivery logged before processing
- Failed processing doesn't block receipt
- No rate limiting on webhook endpoint

## Future Enhancements

- [ ] Webhook signature verification
- [ ] User-specific webhook URLs with tokens
- [ ] Retry failed processing
- [ ] Webhook analytics dashboard
- [ ] Email notifications for errors
- [ ] Batch webhook processing
