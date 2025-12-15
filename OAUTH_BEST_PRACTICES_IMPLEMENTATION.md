# Supabase OAuth Best Practices Implementation

## Current Implementation Status

### ✅ Server-Side Callback Handler (route.ts)

**File:** `src/app/auth/callback/route.ts`

**Best Practice:** Handle OAuth callbacks entirely server-side for proper cookie management.

**Implementation:**

- ✅ Uses `createServerClient` from `@supabase/ssr`
- ✅ Exchanges authorization code for session server-side
- ✅ Sets cookies automatically via `@supabase/ssr`
- ✅ Creates user profile if missing
- ✅ Redirects to home page on success
- ✅ Handles errors by passing to page component

**Flow:**

1. Supabase redirects to `/auth/callback?code=...`
2. Route handler intercepts request
3. Exchanges code for session (sets cookies)
4. Creates/verifies user profile
5. Redirects to `/` (home page)

### ⚠️ Client-Side Fallback (page.tsx + AuthCallback.tsx)

**Files:**

- `src/app/auth/callback/page.tsx`
- `src/components/auth/AuthCallback.tsx`

**Status:** Currently acts as fallback, but should only handle errors

**Issue:** Client component tries to exchange codes that should be handled server-side

## Best Practices from Supabase Documentation

### 1. Server-Side Callback Handling ✅

- **Why:** Ensures cookies are set correctly before redirect
- **How:** Use route handler (route.ts) to exchange code server-side
- **Status:** Implemented

### 2. Proper Cookie Management ✅

- **Why:** Cookies must be accessible to both client and server
- **How:** Use `@supabase/ssr` with `createServerClient`
- **Status:** Implemented

### 3. Redirect URL Configuration ⚠️

- **Required:** Add redirect URLs in Supabase Dashboard
- **URL:** `https://leadflow-rho-two.vercel.app/auth/callback`
- **Status:** Needs verification

### 4. Error Handling ✅

- **Why:** Provide user-friendly error messages
- **How:** Route handler passes errors to page component
- **Status:** Implemented

## Current Issue: Redirect Loop

**Problem:** After OAuth callback, user is redirected back to login page.

**Root Cause Analysis:**

1. ✅ OAuth login succeeds (Supabase logs confirm)
2. ✅ Code exchange succeeds (route handler processes it)
3. ✅ Cookies are set (server-side)
4. ❌ When redirecting to `/`, PermissionsWrapper doesn't see session
5. ❌ PermissionsWrapper redirects to sign-in page

**Why PermissionsWrapper doesn't see session:**

- Race condition: Cookies may not be immediately readable after redirect
- Context not updated: AuthContext may not have refreshed yet
- Timing issue: Full page reload happens before cookies are read

## Solution: Enhanced Session Check

**Implementation:**

1. ✅ Route handler sets cookies server-side (already done)
2. ✅ PermissionsWrapper checks session directly from Supabase (already done)
3. ✅ Added polling for session if context doesn't have user (already done)
4. ✅ Added logging for debugging (already done)

**Next Steps:**

- Test with enhanced logging to see what's happening
- Verify cookies are actually being set
- Check if there's a cookie domain/path issue

## Verification Checklist

- [ ] Verify redirect URL in Supabase Dashboard
- [ ] Check browser cookies after OAuth callback
- [ ] Verify `NEXT_PUBLIC_SITE_URL` is set in Vercel
- [ ] Test OAuth flow and check console logs
- [ ] Verify session exists in cookies after redirect
- [ ] Check if PermissionsWrapper is checking too early

## Debugging Steps

1. **Check Browser Console:**
   - Look for "✅ OAuth callback successful" message
   - Look for "🔍 PermissionsWrapper: Session check" messages
   - Look for any error messages

2. **Check Browser Cookies:**
   - Open DevTools → Application → Cookies
   - Look for Supabase session cookies after callback
   - Verify cookies are set with correct domain/path

3. **Check Vercel Function Logs:**
   - Look for route handler execution
   - Verify code exchange succeeds
   - Check for any errors

4. **Check Supabase Logs:**
   - Verify login events
   - Check for any errors in callback processing
