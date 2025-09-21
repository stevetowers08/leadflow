# Google OAuth Setup Guide

## Error: "Access blocked: n8n can only be used within its organization"

This error occurs when the Google OAuth application has organization restrictions enabled. Here's how to fix it:

## Solution 1: Create Your Own Google OAuth App (Recommended)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "4Twenty CRM")
4. Click "Create"

### Step 2: Enable Google+ API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" API

### Step 3: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set **Authorized redirect URIs** to:
   ```
   https://jedfundfhzytpnbjkspn.supabase.co/auth/v1/callback
   ```
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

### Step 4: Configure Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `jedfundfhzytpnbjkspn`
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click **Enable**
5. Paste your **Client ID** and **Client Secret**
6. Click **Save**

## Solution 2: Configure Organization Settings (If you own the n8n app)

If you have access to the n8n Google OAuth application:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select the n8n project
3. Go to "APIs & Services" → "OAuth consent screen"
4. Click "Edit App"
5. Under "User Type", change from "Internal" to "External"
6. Add your email (`stevetowers08@gmail.com`) to test users
7. Save changes

## Solution 3: Use Email Authentication (Temporary)

If you can't configure Google OAuth immediately, you can enable email authentication:

### Enable Email Auth in Supabase
1. Go to Supabase Dashboard → Authentication → Settings
2. Under "Auth Providers", enable "Email"
3. Configure email settings if needed

### Update the App
The app already has fallback email authentication built-in, but you'll need to enable it in Supabase first.

## Testing Your Setup

1. Try signing in with Google
2. If successful, you should be redirected back to the app
3. If you still get errors, check:
   - Redirect URI matches exactly
   - Client ID/Secret are correct
   - Google APIs are enabled
   - Supabase provider is enabled

## Common Issues

- **403 org_internal**: Organization restrictions enabled
- **400 validation_failed**: Provider not enabled in Supabase
- **redirect_uri_mismatch**: Redirect URI doesn't match exactly
- **invalid_client**: Wrong Client ID or Secret

## Need Help?

If you're still having issues:
1. Check the Supabase logs in the Dashboard
2. Verify all URLs match exactly (including https/http)
3. Make sure the Google Cloud project is active
4. Contact support if needed

---

**Note**: The app is designed to work with Google OAuth once properly configured. The fallback authentication provides a temporary solution while you set up OAuth.

