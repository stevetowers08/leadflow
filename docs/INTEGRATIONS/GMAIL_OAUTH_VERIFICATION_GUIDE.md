# Gmail OAuth Verification Guide

## Overview
This guide outlines the steps needed to resolve Google OAuth verification warnings for Gmail integration and implement proper 2-way email sync.

## Current Status
- ✅ Gmail integration button is working
- ✅ OAuth flow redirects correctly
- ❌ Google shows "unverified app" warning
- ❌ Users see "n8n's request is invalid" error

## Problem Analysis
The current Google OAuth app (`431821374966-6g222eg7q4hsish5e8ln7mmh7t72dgc2`) is configured for "n8n" instead of the CRM app, causing verification warnings.

## Solution: Dual OAuth Architecture

### Architecture Overview
- **User Authentication**: Supabase Google OAuth (verified, for login)
- **Gmail API Access**: Custom Google OAuth (for 2-way email sync)

### Why Dual OAuth?
- Supabase Google OAuth: Handles user login (already verified)
- Custom Google OAuth: Provides Gmail API tokens for email sync
- Separation of concerns: Auth vs API access

## Implementation Steps

### Phase 1: Fix Current Google OAuth App (Immediate)

#### Step 1: Add Test Users
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Find project with Client ID `431821374966-6g222eg7q4hsish5e8ln7mmh7t72dgc2`
3. Navigate to "APIs & Services" → "OAuth consent screen"
4. Click "Edit App"
5. Scroll to "Test users" section
6. Add emails:
   - `stevetowers08@gmail.com`
   - `team@polarislabs.io`
   - Any other team members
7. Save changes

#### Step 2: Update App Branding
1. In OAuth consent screen, update:
   - **App name**: Change from "n8n" to "Empowr CRM"
   - **App logo**: Upload company logo
   - **Support email**: `steve@polarislabs.io`
   - **App domain**: Your domain (if applicable)
2. Save changes

#### Step 3: Verify Redirect URIs
1. Go to "APIs & Services" → "Credentials"
2. Click on OAuth 2.0 Client ID
3. Ensure these redirect URIs are present:
   ```
   http://localhost:8081/auth/gmail-callback
   https://your-domain.com/auth/gmail-callback
   ```

### Phase 2: Long-term Verification (Production)

#### Step 1: Prepare for Google Verification
1. **Create Privacy Policy**:
   - Explain Gmail access purpose
   - Detail data usage
   - Host at `/privacy-policy`

2. **Create Terms of Service**:
   - App usage terms
   - Gmail integration terms
   - Host at `/terms-of-service`

3. **App Description**:
   - Clear explanation of Gmail access
   - Business purpose
   - Data handling practices

#### Step 2: Submit for Verification
1. Go to OAuth consent screen
2. Click "Publish App"
3. Fill out verification form
4. Submit for Google review
5. Wait for approval (can take weeks)

## Technical Implementation

### Current Gmail Service Structure
```typescript
// src/services/gmailService.ts
class GmailService {
  async authenticateWithGmail(): Promise<string> {
    // Uses custom Google OAuth for Gmail API access
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    // ... OAuth flow
  }
  
  async handleGmailCallback(code: string): Promise<void> {
    // Processes Gmail OAuth callback
  }
}
```

### Dual OAuth Flow
1. **User Login**: Supabase Google OAuth → User authenticated
2. **Gmail Connect**: Custom Google OAuth → Gmail API tokens
3. **Email Sync**: Use Gmail tokens for 2-way sync

## Environment Variables Required

```env
# Supabase Configuration (for user auth)
VITE_SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google OAuth Configuration (for Gmail API)
VITE_GOOGLE_CLIENT_ID=431821374966-6g222eg7q4hsish5e8ln7mmh7t72dgc2.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## Testing Checklist

### Development Testing
- [ ] Add test users to Google OAuth app
- [ ] Update app branding
- [ ] Test Gmail connection flow
- [ ] Verify no verification warnings for test users
- [ ] Test 2-way email sync functionality

### Production Readiness
- [ ] Create privacy policy page
- [ ] Create terms of service page
- [ ] Update app description in Google Console
- [ ] Submit for Google verification
- [ ] Monitor verification status

## Alternative Approaches Considered

### Option A: Supabase-Only OAuth
- **Pros**: No verification needed
- **Cons**: Limited Gmail API access, complex token extraction

### Option B: Custom OAuth Only
- **Pros**: Full control, direct Gmail API access
- **Cons**: Requires verification for production

### Option C: Dual OAuth (Chosen)
- **Pros**: Best of both worlds, separation of concerns
- **Cons**: More complex setup

## Success Metrics

### Short-term (Development)
- No verification warnings for team members
- Successful Gmail connection flow
- Working 2-way email sync

### Long-term (Production)
- Google-verified app
- No warnings for end users
- Seamless Gmail integration experience

## Next Steps

1. **Immediate**: Add test users to remove warnings
2. **This week**: Update app branding
3. **Next week**: Create legal pages (privacy policy, terms)
4. **Future**: Submit for Google verification

## Related Documentation

- [Google OAuth Setup Guide](./GOOGLE_OAUTH_SETUP.md)
- [Gmail Integration Guide](./GMAIL_INTEGRATION_SETUP.md)
- [Environment Variables Setup](../SETUP/ENVIRONMENT_VARIABLES.md)

## Support

For issues with this implementation:
- Check Google Cloud Console logs
- Verify environment variables
- Test with different user accounts
- Contact: steve@polarislabs.io
