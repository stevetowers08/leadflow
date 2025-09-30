# Error Logging & Email Notification Setup Guide

This guide explains how to set up comprehensive error logging with email notifications for the Empowr CRM application.

## 🚀 Quick Setup

### 1. Database Migration

First, apply the database migration to create the error logging tables:

```bash
# Run the migration
supabase db push
```

This creates three new tables:
- `error_logs` - Stores all application errors
- `error_notifications` - Tracks notification attempts
- `error_settings` - User notification preferences

### 2. Environment Variables

Add these variables to your `.env` file:

```bash
# Required: Admin email for critical error notifications
VITE_ADMIN_EMAIL=admin@yourcompany.com

# Optional: Dedicated error notification email
VITE_ERROR_NOTIFICATION_EMAIL=errors@yourcompany.com

# Optional: Slack webhook for team notifications
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Optional: Custom webhook for external monitoring
VITE_ERROR_WEBHOOK_URL=https://your-monitoring-service.com/webhook/errors
```

### 3. Gmail Integration

The system uses your existing Gmail service to send error notifications. Ensure your Gmail integration is properly configured with:

- Valid Google OAuth credentials
- Gmail API access enabled
- Proper authentication flow

## 📧 Email Notification Features

### Automatic Notifications

The system automatically sends email notifications for errors based on severity:

- **CRITICAL** (🚨) - Always sends email
- **HIGH** (🔴) - Sends email by default
- **MEDIUM** (🟠) - Configurable threshold
- **LOW** (🟡) - Usually not emailed

### Email Content

Each error notification includes:

- **Error severity and category**
- **Complete error message and stack trace**
- **User context** (user ID, session, component)
- **Browser and URL information**
- **Additional metadata**
- **Error ID for tracking**

### HTML Email Template

Notifications are sent as professional HTML emails with:
- Color-coded severity indicators
- Structured error details table
- Collapsible stack traces
- Actionable next steps
- Error tracking ID

## 🔧 Configuration Options

### User-Level Settings

Users can configure their notification preferences in the database:

```sql
-- Update notification settings for a user
UPDATE error_settings 
SET 
  email_notifications = true,
  notification_severity = 'high',
  notification_email = 'user@company.com'
WHERE user_id = 'user-uuid';
```

### Severity Thresholds

Configure when notifications are sent:

- `low` - Only LOW severity errors
- `medium` - MEDIUM and above
- `high` - HIGH and CRITICAL only
- `critical` - CRITICAL only

## 📊 Error Monitoring

### Viewing Error Logs

Access error logs through the Supabase dashboard or create a custom admin interface:

```sql
-- Get recent critical errors
SELECT * FROM error_logs 
WHERE severity = 'critical' 
ORDER BY created_at DESC 
LIMIT 10;

-- Get unresolved errors
SELECT * FROM error_logs 
WHERE resolved = false 
ORDER BY created_at DESC;
```

### Error Statistics

```sql
-- Error counts by severity
SELECT severity, COUNT(*) as count 
FROM error_logs 
GROUP BY severity;

-- Error counts by category
SELECT category, COUNT(*) as count 
FROM error_logs 
GROUP BY category;
```

## 🛠️ Integration Examples

### Manual Error Logging

```typescript
import { enhancedErrorLogger } from '@/services/supabaseErrorService';

// Log a critical error
await enhancedErrorLogger.logCriticalError(
  new Error('Database connection failed'),
  {
    component: 'database',
    action: 'connection_attempt',
    metadata: { retryCount: 3 }
  }
);

// Log an authentication error
await enhancedErrorLogger.logAuthError(
  'Invalid credentials provided',
  {
    component: 'auth',
    action: 'login_attempt',
    metadata: { username: 'user@example.com' }
  }
);
```

### API Error Handling

```typescript
import { handleApiError } from '@/utils/globalErrorHandlers';

try {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
} catch (error) {
  await handleApiError(error, 'fetch_user_data', '/api/data');
}
```

### Supabase Error Handling

```typescript
import { handleSupabaseError } from '@/utils/globalErrorHandlers';

try {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
} catch (error) {
  await handleSupabaseError(error, 'fetch_users');
}
```

## 🔔 Notification Channels

### Email Notifications

- Uses existing Gmail service
- Professional HTML templates
- Configurable recipients
- Severity-based filtering

### Slack Notifications

Set up a Slack webhook:

1. Go to your Slack workspace
2. Create a new app or use existing
3. Add Incoming Webhooks
4. Copy the webhook URL
5. Add to `VITE_SLACK_WEBHOOK_URL`

### Custom Webhooks

Send errors to external monitoring services:

```typescript
// Webhook payload example
{
  "type": "error_notification",
  "error": {
    "id": "err_1234567890_abc123",
    "message": "Database connection failed",
    "severity": "critical",
    "category": "database",
    "user_id": "user-uuid",
    "url": "https://app.com/pipeline",
    "timestamp": "2024-01-25T10:30:00Z"
  }
}
```

## 🚨 Critical Error Handling

### Automatic Escalation

Critical errors are automatically:
- Logged to database
- Sent via email to admin
- Posted to Slack (if configured)
- Sent to webhook (if configured)

### Error Resolution

Mark errors as resolved:

```typescript
import { supabaseErrorService } from '@/services/supabaseErrorService';

// Resolve an error
await supabaseErrorService.resolveError('err_1234567890_abc123');
```

## 📈 Performance Considerations

### Database Indexes

The migration includes optimized indexes for:
- User-based queries
- Severity filtering
- Date range queries
- Resolution status

### Rate Limiting

Consider implementing rate limiting for:
- Email notifications (max 1 per minute per error type)
- Slack notifications (max 5 per minute)
- Webhook calls (max 10 per minute)

### Error Deduplication

The system includes error deduplication to prevent spam:
- Same error message within 5 minutes = single notification
- Different users experiencing same error = separate logs, single notification

## 🔒 Security & Privacy

### Data Protection

- Error logs include user IDs but not sensitive data
- Stack traces may contain file paths (sanitize in production)
- Email addresses are stored for notifications only

### Access Control

- Users can only see their own error logs
- Admin users can see all error logs
- Service role can manage all error data

## 🐛 Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check Gmail OAuth configuration
   - Verify email addresses are valid
   - Check notification settings

2. **Database errors**
   - Ensure migration was applied
   - Check RLS policies
   - Verify service role permissions

3. **Slack notifications failing**
   - Verify webhook URL format
   - Check Slack app permissions
   - Test webhook manually

### Debug Mode

Enable debug logging:

```typescript
// In development
console.log('Error logged:', errorId);
console.log('Notification sent:', notificationId);
```

## 📚 API Reference

### Enhanced Error Logger

```typescript
class EnhancedErrorLogger {
  async logError(error, severity, category, context): Promise<string>
  async logAuthError(error, context): Promise<string>
  async logDatabaseError(error, context): Promise<string>
  async logNetworkError(error, context): Promise<string>
  async logUIError(error, context): Promise<string>
  async logCriticalError(error, context): Promise<string>
}
```

### Supabase Error Service

```typescript
class SupabaseErrorService {
  async initialize(adminEmail?: string): Promise<void>
  async getErrorLogs(page, limit, severity?, category?, resolved?): Promise<{data, count}>
  async resolveError(errorId): Promise<boolean>
  async updateNotificationSettings(settings): Promise<boolean>
}
```

## 🎯 Best Practices

1. **Use appropriate severity levels**
   - CRITICAL: System-breaking errors
   - HIGH: User-impacting errors
   - MEDIUM: Minor functionality issues
   - LOW: Cosmetic or non-critical issues

2. **Include relevant context**
   - Component name
   - User action
   - Additional metadata

3. **Monitor error trends**
   - Set up dashboards
   - Track resolution times
   - Identify recurring issues

4. **Regular maintenance**
   - Resolve old errors
   - Clean up resolved errors
   - Update notification settings

This comprehensive error logging system ensures you're always informed about issues in your application and can respond quickly to critical problems.
