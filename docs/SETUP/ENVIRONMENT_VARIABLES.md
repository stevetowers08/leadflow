# Environment Variables Guide

This document outlines all required and optional environment variables for the Empowr CRM application.

## Overview

The Empowr CRM uses **Next.js 16.0.1** as the framework. Environment variables follow Next.js conventions:
- **Client-side (public):** Must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- **Server-side (private):** No prefix required - these are secure and only accessible in API routes and Server Components

## Required Environment Variables

### Supabase Configuration (Essential)

These are **required** for the application to function:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these values:**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API keys** → `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (server-only, no prefix)

### Google OAuth (For Authentication)

Required for Google sign-in functionality:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Note:** `GOOGLE_CLIENT_SECRET` is server-only (no `NEXT_PUBLIC_` prefix) and should only be used in API routes or Server Components.

**How to get these:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add your domain to authorized origins

## Optional Environment Variables

### LinkedIn Integration

For LinkedIn automation features:

```bash
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://your-domain.com/auth/linkedin-callback
```

### GitHub Integration

For GitHub MCP and CSL features:

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=your-github-personal-access-token
```

### AI Features

For AI-powered lead scoring and automation:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

**Security Note:** Both of these are **server-only** variables (no `NEXT_PUBLIC_` prefix). They should only be accessed in API routes or Server Components, never in client-side code.

### Error Monitoring & Notifications

```bash
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourcompany.com
NEXT_PUBLIC_ERROR_NOTIFICATION_EMAIL=errors@yourcompany.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
ERROR_WEBHOOK_URL=https://your-monitoring-service.com/webhook/errors
```

**Security Note:** Email addresses can be public (using `NEXT_PUBLIC_` prefix), but webhook URLs containing secrets should be server-only (no prefix).

### Development Configuration

```bash
PORT=3000
NODE_ENV=production
```

## Environment-Specific Setup

### Local Development (.env.local)

Create a `.env.local` file in the project root:

```bash
# Copy from env.example and fill in your values
cp env.example .env.local
```

### Vercel Production

Environment variables are configured in Vercel Dashboard:

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate environment scope:
   - **Production**: Live application
   - **Preview**: Branch deployments
   - **Development**: Local development

### Variable Sensitivity

Mark these as **Sensitive** in Vercel:

- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLIENT_SECRET`
- `LINKEDIN_CLIENT_SECRET`
- `GITHUB_PERSONAL_ACCESS_TOKEN`
- `VITE_GEMINI_API_KEY`

## Troubleshooting

### Common Issues

1. **"Cannot access 'm' before initialization" Error**
   - Usually caused by missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`
   - Verify variables are set in Vercel and start with `VITE_` prefix

2. **Supabase Connection Failed**
   - Check that `VITE_SUPABASE_URL` is the correct project URL
   - Verify `VITE_SUPABASE_ANON_KEY` is the anon/public key (not service role)

3. **Google OAuth Not Working**
   - Ensure `VITE_GOOGLE_CLIENT_ID` includes the full `.apps.googleusercontent.com` domain
   - Check that authorized origins include your domain

### Validation

The app automatically validates environment variables on startup. Check the browser console for validation messages:

- ✅ Green checkmarks indicate properly configured variables
- ❌ Red X marks indicate missing or invalid variables
- ⚠️ Warnings indicate optional variables that aren't set

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use different keys** for different environments
3. **Rotate keys regularly**, especially after team member changes
4. **Monitor usage** of API keys for unusual activity
5. **Use least privilege** - only grant necessary permissions

## Vite vs Next.js

**Important:** This app uses Vite, not Next.js. Key differences:

| Framework | Client-side Prefix | Example                    |
| --------- | ------------------ | -------------------------- |
| **Vite**  | `VITE_`            | `VITE_SUPABASE_URL`        |
| Next.js   | `NEXT_PUBLIC_`     | `NEXT_PUBLIC_SUPABASE_URL` |

Always use `VITE_` prefix for client-side variables in this application.
