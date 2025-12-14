# OAuth Flow Verification

## ✅ Implementation Status

**All components verified and aligned with Supabase best practices:**

- ✅ **Database Trigger**: `on_auth_user_created` is enabled
- ✅ **Function**: `handle_new_user()` is SECURITY DEFINER with fixed search_path
- ✅ **RLS Policies**: All 3 policies active (insert, view, update)
- ✅ **Server Client**: Uses `createServerClient` from `@supabase/ssr` (cookies)
- ✅ **Client Client**: Uses `createBrowserClient` from `@supabase/ssr` (reads cookies)
- ✅ **Middleware**: Session refresh middleware configured
- ✅ **Fallback Layers**: 3 layers of profile creation protection

## What Happens for New OAuth Users

### 1. User Signs In with Google

- User clicks "Sign in with Google"
- Redirects to Google OAuth
- Google authenticates user
- Google redirects to Supabase: `https://isoenbpjhogyokuyeknu.supabase.co/auth/v1/callback`
- Supabase processes OAuth and redirects to your app: `https://leadflow-rho-two.vercel.app/auth/callback?code=...`

### 2. Session Creation (Server-Side)

- `/api/auth/exchange-code` route receives the code
- Server exchanges code for session using `@supabase/ssr` (saves to cookies)
- **Database trigger fires**: `handle_new_user()` automatically creates `user_profiles` record
- **Fallback**: If trigger didn't fire, API route creates profile
- Session is saved to HTTP-only cookies

### 3. Client-Side Session Reading

- Client uses `createBrowserClient` from `@supabase/ssr`
- Automatically reads session from cookies (set by server)
- Session is available immediately after redirect

### 4. Profile Verification

- `AuthCallback` component verifies profile exists
- **Fallback**: If profile missing, creates it client-side
- Refreshes user profile in AuthContext
- Redirects to dashboard

## Verification Checklist

✅ **Database Trigger**

- Trigger `on_auth_user_created` exists and is enabled
- Function `handle_new_user()` is SECURITY DEFINER with fixed search_path
- Function creates profile with: id, email, full_name, role='user', is_active=true

✅ **RLS Policies**

- "Users can insert own profile" - allows INSERT with `auth.uid() = id`
- "Users can view all profiles" - allows SELECT for all authenticated users
- "Users can update own profile" - allows UPDATE with `auth.uid() = id`

✅ **Session Management**

- Server uses `@supabase/ssr` (saves to cookies)
- Client uses `createBrowserClient` from `@supabase/ssr` (reads from cookies)
- Sessions persist across page reloads

✅ **Fallback Mechanisms**

- API route creates profile if trigger fails
- Client callback creates profile if missing
- Multiple layers ensure profile is always created

## Architecture Overview

### Session Flow (PKCE)

1. **Client** → `signInWithOAuth()` → Redirects to Google
2. **Google** → Authenticates → Redirects to Supabase
3. **Supabase** → Processes OAuth → Redirects to app: `/auth/callback?code=...`
4. **Client** → Detects `code` → Calls `/api/auth/exchange-code`
5. **Server** → Exchanges code → Saves session to **cookies** (HTTP-only)
6. **Middleware** → Refreshes session on each request
7. **Client** → `createBrowserClient` reads from **cookies** automatically

### Profile Creation Flow

1. **Database Trigger** → Fires on `INSERT INTO auth.users` → Creates `user_profiles`
2. **API Route Fallback** → Checks profile exists → Creates if missing
3. **Client Fallback** → Verifies profile → Creates if missing

## File Structure

```
├── middleware.ts                          # Session refresh (Supabase best practice)
├── src/
│   ├── integrations/supabase/
│   │   └── client.ts                     # createBrowserClient (reads cookies)
│   ├── utils/supabase/
│   │   └── server.ts                     # createServerClient (writes cookies)
│   ├── app/api/auth/
│   │   └── exchange-code/route.ts        # PKCE code exchange + profile fallback
│   └── components/auth/
│       └── AuthCallback.tsx              # Client-side callback + profile fallback
└── supabase/migrations/
    └── [migration].sql                   # handle_new_user trigger + function
```

## Testing New OAuth User

1. Clear browser cookies and localStorage
2. Sign in with Google using a NEW email address
3. Verify:
   - ✅ Redirects to `/auth/callback` (not root)
   - ✅ Session is created and saved to cookies
   - ✅ `user_profiles` record exists in database
   - ✅ User can access protected routes
   - ✅ Profile data is loaded in AuthContext
   - ✅ Session persists after page reload
