# Environment Variables Setup Guide

This guide explains how to configure all required environment variables for the Empowr CRM application.

## Required Environment Variables

### Supabase Configuration
These are **required** for the application to function:

```bash
# Supabase Project URL
VITE_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (public key)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (for Edge Functions)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Optional Integration Variables

### Google OAuth (Gmail Integration)
Required for Gmail sync and email functionality:

```bash
# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Google OAuth Client Secret (server-side only)
GOOGLE_CLIENT_SECRET=your-client-secret
```

### LinkedIn Integration
Required for LinkedIn automation:

```bash
# LinkedIn OAuth Client ID
LINKEDIN_CLIENT_ID=your-linkedin-client-id

# LinkedIn OAuth Client Secret
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# LinkedIn OAuth Redirect URI
LINKEDIN_REDIRECT_URI=https://your-domain.com/auth/linkedin-callback
```

### N8N Integration
For AI chat functionality:

```bash
# N8N Webhook URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

## Environment Setup Instructions

### 1. Copy Environment Template
```bash
cp env.example .env.local
```

### 2. Configure Supabase
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon key
4. Update `.env.local` with these values

### 3. Configure Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5173/auth/gmail-callback` (development)
   - `https://your-domain.com/auth/gmail-callback` (production)

### 4. Configure LinkedIn Integration (Optional)
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Add OAuth 2.0 redirect URLs
4. Copy client ID and secret

### 5. Configure N8N (Optional)
1. Set up your N8N instance
2. Create a webhook node
3. Copy the webhook URL

## Environment Validation

The application includes automatic environment validation:

- **Required variables**: Application will fail to start if missing
- **Optional variables**: Application will show warnings but continue
- **Invalid values**: Application will show specific error messages

## Development vs Production

### Development
```bash
# Use local Supabase instance
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

### Production
```bash
# Use production Supabase instance
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use different keys** for development and production
3. **Rotate keys regularly** for security
4. **Use environment-specific** Supabase projects
5. **Limit OAuth scopes** to minimum required permissions

## Troubleshooting

### Common Issues

**"Environment variable is required"**
- Check that the variable is set in `.env.local`
- Restart the development server after changes
- Verify variable name spelling (case-sensitive)

**"Supabase configuration error"**
- Verify URL format: `https://your-project.supabase.co`
- Check that anon key is valid JWT format
- Ensure project is active in Supabase dashboard

**"Google OAuth not configured"**
- Set `VITE_GOOGLE_CLIENT_ID` in environment
- Verify redirect URI matches your domain
- Check Google Cloud Console for API enablement

**"LinkedIn integration disabled"**
- Set `LINKEDIN_CLIENT_ID` and `LINKEDIN_REDIRECT_URI`
- Verify LinkedIn app is approved for required scopes
- Check redirect URI format

### Validation Commands

Check environment status in browser console:
```javascript
// The application automatically logs environment status on startup
// Look for ✅ or ❌ messages in the console
```

## Edge Function Environment Variables

Edge Functions require additional environment variables:

```bash
# Set in Supabase Dashboard > Settings > Edge Functions
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_REDIRECT_URI=https://your-domain.com/auth/linkedin-callback
```

## Support

If you encounter issues with environment setup:

1. Check the browser console for validation messages
2. Verify all required variables are set
3. Ensure Supabase project is active
4. Check OAuth app configurations
5. Review this documentation for common solutions
