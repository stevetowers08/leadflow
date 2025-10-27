# Deployment Guide

## Deploying to Vercel (Recommended for Internet Access)

### Option 1: Deploy via Vercel CLI (Fastest)

**Current Project:** 4twenty  
**Project ID:** prj_pcLKnJs8zzsUa1WA6C08IMLQHZd3

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Deploy to production:**

   ```bash
   vercel --prod
   ```

3. **Your app will be live at:**
   - Production URL: https://4twenty.vercel.app

### Option 2: Automatic Deployment via GitHub

If you have Vercel connected to your GitHub repo:

1. **Commit and push your changes:**

   ```bash
   git add -A
   git commit -m "feat: add webhook implementation and UI improvements"
   git push origin genspark_ai_developer
   ```

2. **Vercel will automatically deploy**

### Option 3: Deploy to Docker for Local/Docker Desktop

**Build the Docker image:**

```bash
docker build -t recruitedge-platform .
```

**Run with Docker:**

```bash
docker run -p 8080:8080 -e VITE_SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co recruitedge-platform
```

**Use Docker Compose (dev):**

```bash
docker-compose -f docker-compose.dev.yml up
```

Access at: http://localhost:8086

### Option 4: Deploy Docker to Cloud

For sharing on the internet, you can:

1. Push to Docker Hub
2. Deploy to Railway, Render, or Fly.io
3. Use Docker Desktop Port Publishing with ngrok

## Current Environment

### Production Settings (env.production)

- Supabase: jedfundfhzytpnbjkspn
- Auth Bypass: Enabled (public@example.com)
- Webhook URL: https://n8n.srv814433.hstgr.cloud/webhook/recruitment-job-qulified

## What's Deployed

✅ **Webhook System:**

- Edge Function: job-qualification-webhook (v7)
- Status: ACTIVE
- Trigger: When job status changes to "qualify"

✅ **Frontend Updates:**

- Jobs page header with subheading
- Status dropdowns fill entire cells
- Standardized 120px status column width

## Quick Deploy Command

```bash
# Build and deploy to Vercel
npm run build && vercel --prod
```

Your app will be live immediately at your Vercel URL!
