# Google OAuth Setup Instructions

## Your Credentials

**Client ID:** `431821374966-30na80s3je34nhvt1mes87ct7n9tpdgt.apps.googleusercontent.com`  
**Client Secret:** `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`

## Next Steps

### 1. Add to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Find your OAuth 2.0 Client ID
4. Click **Edit** or the pencil icon
5. Under **Authorized redirect URIs**, add:
   ```
   https://recruitment-01.vercel.app/auth/gmail-callback
   https://recruitment-01.vercel.app/integrations/callback
   ```
6. Click **Save**

### 2. Add Environment Variables to Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your `recruitment-01` project
3. Go to **Settings > Environment Variables**
4. Add these variables:

   **Name:** `VITE_GOOGLE_CLIENT_ID`  
   **Value:** `431821374966-30na80s3je34nhvt1mes87ct7n9tpdgt.apps.googleusercontent.com`  
   **Environment:** Production, Preview, Development

   **Name:** `GOOGLE_CLIENT_SECRET`  
   **Value:** `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`  
   **Environment:** Production, Preview, Development

   **Name:** `GMAIL_REDIRECT_URI`  
   **Value:** `https://recruitment-01.vercel.app/auth/gmail-callback`  
   **Environment:** Production, Preview, Development

5. Click **Save**

### 3. Redeploy to Apply Changes

After adding the environment variables:

```bash
# Trigger a new deployment
git commit --allow-empty -m "trigger rebuild with OAuth credentials" && git push
```

### 4. Local Development Setup

Create `.env.local` file in your project root:

```env
VITE_GOOGLE_CLIENT_ID=431821374966-30na80s3je34nhvt1mes87ct7n9tpdgt.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GMAIL_REDIRECT_URI=http://localhost:8086/auth/gmail-callback
```

**Important:** For local testing, you also need to add `http://localhost:8086/auth/gmail-callback` to your Google Cloud Console redirect URIs (see step 1).

### 5. Test the Integration

1. Deploy the changes
2. Go to https://recruitment-01.vercel.app/
3. Navigate to Settings > Integrations
4. Click "Connect" on Gmail
5. Complete the OAuth flow

## Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- The client secret should NOT be exposed to the browser
- Use Supabase Edge Functions for server-side OAuth token exchange
- Store encrypted refresh tokens in Supabase `email_accounts` table

## Troubleshooting

If you get "redirect_uri_mismatch":

- Verify the exact URL in Google Cloud Console
- Check for trailing slashes or extra characters
- Wait a few minutes for Google's changes to propagate

If you get "invalid_client":

- Check that the Client ID is correct
- Ensure you copied the full ID including `.apps.googleusercontent.com`
