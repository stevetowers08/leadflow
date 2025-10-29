# OAuth Callback URLs Setup Guide

## Your Current Setup

**Production URL:** https://recruitment-01.vercel.app/  
**Local Dev Port:** 8086  
**Local Dev URL:** http://localhost:8086

## Required Callback URLs

Based on your `src/App.tsx`, you need these OAuth callback URLs:

### For Gmail Integration

- **Production:** `https://recruitment-01.vercel.app/auth/gmail-callback`
- **Local:** You need a tunnel (see below)

### For General Integrations

- **Production:** `https://recruitment-01.vercel.app/integrations/callback`
- **Local:** You need a tunnel (see below)

### For Supabase Auth

- **Production:** `https://recruitment-01.vercel.app/auth/callback`
- **Local:** `http://localhost:8086/auth/callback`

## Testing Locally (Two Options)

### Option 1: Use ngrok (Recommended)

1. Install ngrok:

   ```bash
   # Windows
   choco install ngrok

   # Or download from https://ngrok.com/download
   ```

2. Start tunnel to your local server:

   ```bash
   ngrok http 8086
   ```

3. You'll get a URL like: `https://abc123.ngrok.io`

4. Add these callback URLs to Google Cloud Console:
   - `https://abc123.ngrok.io/auth/gmail-callback`
   - `https://abc123.ngrok.io/integrations/callback`

### Option 2: Test on Production

Just use the production URLs directly in Google Cloud Console:

- `https://recruitment-01.vercel.app/auth/gmail-callback`
- `https://recruitment-01.vercel.app/integrations/callback`

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Create or edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://recruitment-01.vercel.app/auth/gmail-callback
   https://recruitment-01.vercel.app/integrations/callback
   http://localhost:8086/auth/callback
   ```
5. For ngrok (if using locally):
   ```
   https://your-ngrok-id.ngrok.io/auth/gmail-callback
   https://your-ngrok-id.ngrok.io/integrations/callback
   ```

## HubSpot Callback URL

If integrating HubSpot:

- **Production:** `https://recruitment-01.vercel.app/integrations/callback`
- Add to HubSpot App Settings under "Redirect URL"

## Mailchimp Callback URL

If integrating Mailchimp:

- **Production:** `https://recruitment-01.vercel.app/integrations/callback`
- Add to Mailchimp App Settings under "Redirect URL"

## Important Notes

- **HTTPS Required:** Google requires HTTPS for OAuth callbacks (except localhost)
- **Exact Match:** URLs must match exactly (including trailing slashes)
- **Localhost:** Only works if Google allows it (tested to see if it works)
- **ngrok URL Changes:** Free ngrok gives different URLs each time - update Google Cloud Console each time

## Testing the Connection

1. Start your dev server: `npm run dev`
2. Navigate to Integrations page
3. Click "Connect" on Gmail
4. You should be redirected to Google OAuth
5. After authorization, you'll be redirected back to your callback URL
