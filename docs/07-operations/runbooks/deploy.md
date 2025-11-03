---
owner: devops-team
last-reviewed: 2025-01-27
status: final
product-area: infrastructure
---

# Deployment Runbook

**Last Updated:** January 2025

## Overview

Empowr CRM is deployed to **Vercel**, optimized for Next.js 16.

## Prerequisites

- Vercel account connected to repository
- Environment variables configured in Vercel
- Access to production deployment settings

## Deployment Process

### 1. Pre-Deployment Checks

```bash
# Run locally before deploying
npm run type-check  # Check TypeScript
npm run lint        # Check linting
npm run build       # Verify build succeeds
```

### 2. Deploy to Production

**Automatic Deployment:**
- Push to `main` branch triggers automatic deployment
- Vercel builds and deploys automatically

**Manual Deployment:**
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Select project
- Click "Deploy" → Choose branch
- Wait for build (typically 2-5 minutes)

### 3. Verify Deployment

1. Check deployment URL (e.g., `https://your-app.vercel.app`)
2. Verify environment variables are set
3. Test critical paths:
   - Authentication
   - Database queries
   - API routes

## Environment Variables

All environment variables must be configured in Vercel Dashboard:

**Settings → Environment Variables**

### Required Variables

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

### Mark as Sensitive

- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLIENT_SECRET`
- `GEMINI_API_KEY`
- Any API keys or secrets

## Rollback

See [Rollback Runbook](rollback.md) for detailed rollback procedures.

Quick rollback:
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Monitoring

- Check Vercel deployment logs
- Monitor error tracking (if configured)
- Verify database connections
- Test critical user flows

## Troubleshooting

### Build Fails

1. Check build logs in Vercel
2. Verify all environment variables are set
3. Check TypeScript errors: `npm run type-check`
4. Verify Node.js version matches `package.json` engines

### Deployment Succeeds but App Fails

1. Check environment variables
2. Verify Supabase connection
3. Check browser console for errors
4. Review Vercel function logs

---

**Related Docs:**
- [Rollback Runbook](rollback.md) - Rolling back deployments
- [Environment Setup](../../03-development/environment-setup.md) - Environment configuration


