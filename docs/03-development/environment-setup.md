---
owner: devops-team
last-reviewed: 2025-01-27
status: final
product-area: infrastructure
---

# Environment Setup

**Last Updated:** January 2025

## Prerequisites

- **Node.js**: 20.9.0 or higher (see `package.json` engines)
- **npm** or **yarn**: Package manager
- **Supabase Account**: [supabase.com](https://supabase.com)
- **Git**: Version control

## Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd Recruitement-01

# 2. Install dependencies
npm install

# 3. Copy environment template
cp env.example .env.local

# 4. Configure environment variables (see below)
# Edit .env.local with your values

# 5. Start development server
npm run dev
```

Server will start on **http://localhost:8086**

## Environment Variables

Empowr CRM uses **Next.js 16**, so environment variables follow Next.js conventions:

- **Client-side (public)**: Must use `NEXT_PUBLIC_` prefix
- **Server-side (private)**: No prefix - only accessible in API routes and Server Components

### Required Variables

#### Supabase Configuration

```bash
# Public (client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Private (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Settings → API
4. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

#### Google OAuth

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Note:** `GOOGLE_CLIENT_SECRET` is server-only (no prefix).

**How to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add your domain to authorized origins

### Optional Variables

#### AI Features

```bash
GEMINI_API_KEY=your-gemini-api-key
```

Server-only - used for AI lead scoring and analysis.

#### Integrations

```bash
# LinkedIn (if using LinkedIn sync)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# n8n webhooks
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-id
```

#### Monitoring & Notifications

```bash
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourcompany.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
ERROR_WEBHOOK_URL=https://your-monitoring-service.com/webhook/errors
```

### Environment File Setup

Create `.env.local` in project root:

```bash
# Copy from template
cp env.example .env.local

# Edit with your values
nano .env.local  # or use your preferred editor
```

**Important:**
- `.env.local` is git-ignored (never commit)
- Use different values for dev/staging/production
- Never expose server-only keys in client code

## Verification

The app validates environment variables on startup. Check browser console:

- ✅ Green checkmarks = properly configured
- ❌ Red X marks = missing or invalid
- ⚠️ Warnings = optional variables not set

## Troubleshooting

### "Cannot access before initialization"

Usually caused by missing Supabase variables:
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after adding variables

### Supabase Connection Failed

- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct project URL
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the anon/public key (not service role)

### Google OAuth Not Working

- Ensure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` includes full `.apps.googleusercontent.com` domain
- Check authorized origins include your domain
- Verify `GOOGLE_CLIENT_SECRET` is set (server-only)

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use different keys** for different environments
3. **Rotate keys regularly**, especially after team changes
4. **Monitor API key usage** for unusual activity
5. **Use least privilege** - only grant necessary permissions

## Next Steps

After environment setup:

1. **Configure database**: See [Database Schema](../06-reference/database/schema.md)
2. **Start development**: See [Local Development](local-development.md)
3. **Review workflows**: See [Workflows](workflows.md)

---

**Related Docs:**
- [Local Development](local-development.md) - Development workflow
- [Deployment Guide](../07-operations/runbooks/deploy.md) - Production deployment
- [Security Reference](../06-reference/security/secrets-management.md) - Security best practices


