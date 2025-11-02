# 🚀 Next.js Deployment Guide - Vercel

## Overview

Empowr CRM is built with **Next.js 16.0.1** and is optimized for deployment on **Vercel**, the recommended platform for Next.js applications.

## Prerequisites

- **Node.js**: 20.9.0 or higher (specified in `package.json`)
- **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
- **Git Repository**: GitHub, GitLab, or Bitbucket

## Deployment Steps

### Step 1: Connect Repository to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js configuration

### Step 2: Configure Build Settings

Vercel auto-detects Next.js, but verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default, handled automatically)
- **Install Command**: `npm install` (default)
- **Node Version**: 20.x (or match `package.json` engines)

### Step 3: Environment Variables

Add all environment variables in Vercel dashboard:

**Client-side (Public):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Server-side (Private):**
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-key
GOOGLE_CLIENT_SECRET=your-client-secret
HUBSPOT_CLIENT_SECRET=your-hubspot-secret
MAILCHIMP_API_KEY=your-mailchimp-key
TOKEN_ENCRYPTION_KEY=your-encryption-key
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
ERROR_WEBHOOK_URL=https://your-monitoring-service.com/...
```

**Important:** Server-side variables (no `NEXT_PUBLIC_` prefix) are only accessible in API routes and Server Components.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (typically 2-5 minutes)
3. Get your deployment URL (e.g., `https://your-app.vercel.app`)

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Vercel handles SSL automatically

## Environment-Specific Deployments

### Production

- **Branch**: `main` (or your production branch)
- **Auto-deploy**: Enabled (deploys on every push)

### Preview

- **Auto-deploy**: Enabled for all branches
- **URL**: `https://your-app-git-branch.vercel.app`
- **Environment**: Uses same environment variables as Production

### Development

- **Local**: `npm run dev` (port 8086)
- **Environment**: Uses `.env.local` file (not committed)

## Build Configuration

The project includes:

```json
{
  "scripts": {
    "dev": "next dev -p 8086",
    "build": "next build",
    "start": "next start -p 8086",
    "vercel-build": "next build"
  }
}
```

Vercel automatically runs `vercel-build` during deployment.

## API Routes

All API routes are deployed automatically at:
- `/api/*` - Next.js API routes (replacing Supabase Edge Functions)

Example:
- `https://your-app.vercel.app/api/ai-job-summary`
- `https://your-app.vercel.app/api/gmail-auth`

## Webhook Configuration

Update external webhook URLs to point to your Vercel deployment:

- **Gmail Watch**: `https://your-app.vercel.app/api/gmail-webhook`
- **Job Qualification**: `https://your-app.vercel.app/api/job-qualification-webhook`
- **Resend**: `https://your-app.vercel.app/api/resend-webhook`

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure Node.js version matches (`>=20.9.0`)
4. Check for TypeScript errors: `npm run lint`

### API Routes Not Working

1. Verify server-side environment variables are set
2. Check API route files in `src/app/api/*`
3. Review server logs in Vercel dashboard
4. Test locally: `npm run dev`

### Environment Variables Not Working

1. **Client-side**: Must use `NEXT_PUBLIC_*` prefix
2. **Server-side**: No prefix required (server-only)
3. Restart deployment after adding variables
4. Verify variable names match exactly

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] API routes tested
- [ ] Authentication working
- [ ] Database connections verified
- [ ] External webhooks updated
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active
- [ ] Monitoring set up

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel Documentation](https://vercel.com/docs)
- [Environment Variables Guide](../SETUP/ENVIRONMENT_VARIABLES.md)
