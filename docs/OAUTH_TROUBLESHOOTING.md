# OAuth Callback Troubleshooting Guide

## Issues Fixed

### 1. Missing User Profile Creation

**Problem:** When users sign up via OAuth, a `user_profiles` record wasn't automatically created, causing the app to redirect back to login.

**Solution:**

- ✅ Created database trigger `handle_new_user()` that auto-creates `user_profiles` when a new user signs up
- ✅ Added fallback profile creation in `/api/auth/exchange-code` route (server-side)
- ✅ Added fallback profile creation in `AuthCallback` component (client-side)

### 2. OAuth Redirect to Root URL

**Problem:** Supabase was redirecting to root URL (`/`) with hash fragments instead of `/auth/callback`.

**Solution:**

- ✅ Added immediate hash detection script in `<head>` (runs before React)
- ✅ Added `OAuthRedirectHandler` component as backup
- ✅ Explicitly set `flowType: 'pkce'` in Supabase client config

### 3. Session Not Persisting

**Problem:** Session might not be saved properly after OAuth callback.

**Solution:**

- ✅ Using `@supabase/ssr` for server-side session management (saves to cookies)
- ✅ Client-side client configured with `persistSession: true` and `detectSessionInUrl: true`

## What to Check If Still Having Issues

### 1. Verify Database Trigger

```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check if function exists
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
```

### 2. Check RLS Policies

The `user_profiles` table should have:

- ✅ "Users can insert own profile" policy (allows `INSERT` with `auth.uid() = id`)
- ✅ "Users can view all profiles" policy (allows `SELECT` for all authenticated users)

### 3. Verify Environment Variables

In Vercel, ensure:

- `NEXT_PUBLIC_SITE_URL` = `https://leadflow-rho-two.vercel.app` (no trailing slash)
- `NEXT_PUBLIC_SUPABASE_URL` = `https://isoenbpjhogyokuyeknu.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)

### 4. Check Browser Console

After OAuth redirect, check for:

- ✅ "✅ Session created successfully via PKCE flow"
- ✅ "✅ Session set from hash fragment (fallback)" (if using implicit flow)
- ❌ Any error messages about profile creation
- ❌ Any RLS policy errors

### 5. Verify Supabase Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

- ✅ `https://leadflow-rho-two.vercel.app/auth/callback`
- ✅ `http://localhost:3000/auth/callback` (for local dev)

### 6. Verify Google Cloud Console

In Google Cloud Console → OAuth 2.0 Client ID:

- ✅ Authorized redirect URI: `https://isoenbpjhogyokuyeknu.supabase.co/auth/v1/callback`

## Common Issues

### Issue: User gets redirected to login after OAuth

**Possible causes:**

1. User profile not created → Check trigger and fallback creation
2. RLS policy blocking profile access → Check policies
3. Session not saved → Check cookies in browser dev tools
4. Redirect URL mismatch → Verify in Supabase dashboard

### Issue: Hash fragments in URL but not processing

**Possible causes:**

1. Immediate script not running → Check browser console
2. OAuthRedirectHandler not mounted → Check if it's in providers
3. Pathname check failing → Verify pathname logic

### Issue: Code exchange fails

**Possible causes:**

1. Code expired (10 minute limit) → User needs to retry
2. Code already used → User needs to retry
3. PKCE verifier mismatch → Shouldn't happen with explicit PKCE config

## Testing Checklist

1. ✅ Clear browser cookies and localStorage
2. ✅ Sign in with Google
3. ✅ Verify redirect to `/auth/callback` (not root)
4. ✅ Check browser console for success messages
5. ✅ Verify user is authenticated (check auth context)
6. ✅ Verify `user_profiles` record exists in database
7. ✅ Verify user can access protected routes
