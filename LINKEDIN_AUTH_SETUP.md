# LinkedIn Authentication Setup Guide

## Overview

This guide will help you set up LinkedIn authentication alongside Google authentication for your 4Twenty CRM application. The implementation uses Supabase's built-in LinkedIn OIDC provider for secure authentication.

## Prerequisites

- LinkedIn Developer account
- Supabase project with authentication enabled
- Access to your Supabase dashboard

## Step 1: Create LinkedIn OAuth Application

### 1.1 Access LinkedIn Developer Dashboard

1. Go to [LinkedIn Developer Dashboard](https://www.linkedin.com/developers/apps)
2. Log in with your LinkedIn account
3. Click "Create App" in the top right

### 1.2 Configure Your App

1. **App Information:**
   - App name: "4Twenty CRM"
   - LinkedIn Page: Select your company page (or create one if needed)
   - App Logo: Upload your company logo
   - Legal Agreement: Accept LinkedIn's terms

2. **Create the App:**
   - Click "Create App"
   - You'll be redirected to your app dashboard

### 1.3 Enable LinkedIn OIDC Product

1. In your app dashboard, click on the **"Products"** tab
2. Find **"Sign In with LinkedIn using OpenID Connect"**
3. Click **"Request Access"**
4. Wait for approval (usually instant for basic access)

### 1.4 Configure OAuth Settings

1. Click on the **"Auth"** tab
2. In the **"Authorized Redirect URLs for your app"** section, add:
   ```
   https://jedfundfhzytpnbjkspn.supabase.co/auth/v1/callback
   ```
3. **Copy and save:**
   - Client ID
   - Client Secret (click "Show" to reveal)

## Step 2: Configure Supabase

### 2.1 Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `jedfundfhzytpnbjkspn`

### 2.2 Enable LinkedIn OIDC Provider

1. Navigate to **Authentication** → **Providers**
2. Find **LinkedIn (OIDC)** in the list
3. Toggle **LinkedIn (OIDC) Enabled** to **ON**
4. Enter your credentials:
   - **LinkedIn (OIDC) Client ID**: Paste your Client ID from LinkedIn
   - **LinkedIn (OIDC) Client Secret**: Paste your Client Secret from LinkedIn
5. Click **Save**

## Step 3: Test the Implementation

### 3.1 Start Your Development Server

```bash
npm run dev
```

### 3.2 Test LinkedIn Authentication

1. Open your application in the browser
2. You should see both "Sign in with Google" and "Sign in with LinkedIn" buttons
3. Click "Sign in with LinkedIn"
4. You'll be redirected to LinkedIn's OAuth page
5. After authorizing, you'll be redirected back to your app

## Step 4: Troubleshooting

### Common Issues

#### Issue: "LinkedIn OAuth provider is not enabled"
**Solution:** Make sure you've enabled LinkedIn (OIDC) in Supabase and entered the correct credentials.

#### Issue: "Invalid redirect URI"
**Solution:** Ensure the redirect URI in LinkedIn matches exactly:
```
https://jedfundfhzytpnbjkspn.supabase.co/auth/v1/callback
```

#### Issue: LinkedIn app not approved
**Solution:** 
- Make sure you've requested access to "Sign In with LinkedIn using OpenID Connect"
- Check that your LinkedIn app is not in "Development" mode restrictions
- Verify your app information is complete

#### Issue: Authentication works but user profile not created
**Solution:** This is handled automatically by the AuthContext. Check the browser console for any errors.

### Debug Steps

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Look for authentication-related errors

2. **Check Browser Console:**
   - Open Developer Tools
   - Look for JavaScript errors during authentication

3. **Verify LinkedIn App Status:**
   - Check LinkedIn Developer Dashboard
   - Ensure app is active and approved

## Step 5: Production Considerations

### 5.1 LinkedIn App Review

For production use, you may need to submit your LinkedIn app for review:

1. Complete all required app information
2. Add privacy policy and terms of service URLs
3. Submit for LinkedIn App Review if required

### 5.2 Environment Variables

Make sure your production environment has the correct Supabase configuration:

```env
VITE_SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 5.3 Security Best Practices

- Never expose your LinkedIn Client Secret in client-side code
- Use HTTPS in production
- Regularly rotate your OAuth credentials
- Monitor authentication logs for suspicious activity

## Implementation Details

### Code Changes Made

1. **AuthContext.tsx**: Added `signInWithLinkedIn` method
2. **FallbackAuth.tsx**: Added LinkedIn sign-in button and handler
3. **LinkedInLogin.tsx**: Created standalone LinkedIn login component
4. **SocialLogin.tsx**: Created combined social login component

### Authentication Flow

1. User clicks "Sign in with LinkedIn"
2. App calls `supabase.auth.signInWithOAuth({ provider: 'linkedin_oidc' })`
3. User is redirected to LinkedIn OAuth page
4. User authorizes the application
5. LinkedIn redirects back to Supabase callback URL
6. Supabase processes the OAuth response
7. User is redirected back to your application
8. AuthContext automatically creates user profile

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase and LinkedIn documentation
3. Check browser console and Supabase logs
4. Ensure all configuration steps were completed correctly

## Next Steps

Once LinkedIn authentication is working:

1. Test with multiple LinkedIn accounts
2. Verify user profile creation
3. Test sign-out functionality
4. Consider adding additional OAuth providers if needed
5. Implement proper error handling for edge cases
