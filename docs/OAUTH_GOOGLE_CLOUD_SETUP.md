# Google Cloud Console OAuth Setup

## Required Redirect URIs

When using Supabase Auth with Google OAuth, you need to configure redirect URIs in **Google Cloud Console**, not your app's callback URL.

### In Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID (Web application type)
3. Under **Authorized redirect URIs**, add:

```
https://isoenbpjhogyokuyeknu.supabase.co/auth/v1/callback
```

**Important:** This is the Supabase callback URL, NOT your app's callback URL. Supabase handles the OAuth flow with Google and then redirects to your app.

### In Supabase Dashboard

1. Go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add your app's callback URL:

```
https://leadflow-rho-two.vercel.app/auth/callback
```

For local development, also add:

```
http://localhost:3000/auth/callback
```

## Summary

- **Google Cloud Console**: `https://isoenbpjhogyokuyeknu.supabase.co/auth/v1/callback`
- **Supabase Dashboard**: `https://leadflow-rho-two.vercel.app/auth/callback`

The flow works like this:

1. User clicks "Sign in with Google" → Redirects to Google
2. Google authenticates → Redirects to Supabase (`/auth/v1/callback`)
3. Supabase processes OAuth → Redirects to your app (`/auth/callback`)
4. Your app exchanges code for session → User is authenticated
