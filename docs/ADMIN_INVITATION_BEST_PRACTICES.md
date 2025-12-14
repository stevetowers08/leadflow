# Admin-Controlled Authentication Best Practices (2025)

## Overview

This document outlines the recommended approach for admin-controlled user sign-ups based on 2025 best practices.

## ✅ Implementation Status

- ✅ Database schema (`invitations` table) - **DONE**
- ✅ API route for sending invitations - **DONE** (`/api/admin/invite`)
- ✅ API route for resending invitations - **DONE** (`/api/admin/invite/resend`)
- ✅ API route for cancelling invitations - **DONE** (`/api/admin/invite/cancel`)
- ✅ Accept invitation page - **DONE** (`/auth/accept-invite`)
- ✅ Admin UI component - **DONE** (`/settings/invitations`)
- ✅ Sign-up flow checks for invitation - **DONE**
- ⚠️ Disable public sign-ups in Supabase Dashboard - **MANUAL STEP REQUIRED**
- ⚠️ Custom SMTP configuration - **MANUAL STEP REQUIRED** (see SETUP_INVITATION_ONLY.md)

## Best Practices (2025)

### 1. **Disable Public Sign-Ups**

**Action Required:**

- Remove or hide public sign-up forms
- Only allow sign-ups via admin invitations

**Implementation:**

```typescript
// In Supabase Dashboard:
// Settings → Authentication → Disable "Enable email signup"
```

Or in code, check for invitation token before allowing sign-up.

### 2. **Use Supabase's Built-in Invitation System**

✅ **Already Implemented:**

- Using `supabase.auth.admin.inviteUserByEmail()` in `/api/admin/invite`
- Generates secure magic links automatically
- Handles token expiration and security

### 3. **Custom SMTP Configuration**

**Why:** Supabase's default SMTP has rate limits and restrictions.

**Action Required:**

1. Set up custom SMTP (SendGrid, AWS SES, Resend, etc.)
2. Configure in Supabase Dashboard:
   - Settings → Authentication → SMTP Settings
   - Enter SMTP credentials

**Recommended Services:**

- **Resend** (modern, developer-friendly)
- **SendGrid** (reliable, good deliverability)
- **AWS SES** (cost-effective at scale)

### 4. **Customize Email Templates**

**Action Required:**

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize "Invite user" template
3. Include:
   - Your branding
   - Clear instructions
   - Invitation expiration notice
   - Support contact info

### 5. **Set Token Expiration**

**Current:** 7 days (configured in migration)

**Best Practice:**

- 3-7 days for most use cases
- 24 hours for high-security environments
- Configurable per invitation type

### 6. **Monitor Invitations**

**Action Required:**

- Create admin dashboard to view:
  - Pending invitations
  - Accepted invitations
  - Expired invitations
  - Resend capability

### 7. **Implement MFA (Multi-Factor Authentication)**

**Future Enhancement:**

- Enforce MFA after invitation acceptance
- Use Supabase's built-in MFA support
- Support TOTP (Authenticator apps) and Passkeys

## Implementation Checklist

### Phase 1: Core Functionality ✅

- [x] Database schema for invitations
- [x] API route for sending invitations
- [x] API route for resending invitations
- [x] API route for cancelling invitations
- [x] Accept invitation page
- [x] Role-based access control (admin/owner only)
- [x] Sign-up flow checks for invitation requirement

### Phase 2: Configuration ⚠️

- [ ] Disable public sign-ups in Supabase Dashboard (manual step)
- [ ] Configure custom SMTP (manual step - see SETUP_INVITATION_ONLY.md)
- [ ] Customize email templates (manual step - see SETUP_INVITATION_ONLY.md)
- [x] Set appropriate token expiration (7 days - configured in migration)

### Phase 3: Admin UI 📋

- [x] Create admin invitation management page (`/settings/invitations`)
- [x] List pending/accepted/expired invitations
- [x] Resend invitation functionality
- [x] Cancel invitation functionality
- [x] Invite user dialog with role selection
- [ ] Bulk invitation support (future enhancement)

### Phase 4: Security Enhancements 🔒

- [ ] Implement MFA requirement
- [ ] Add invitation rate limiting
- [ ] Audit log for invitations
- [ ] Email verification before account activation

## Usage

### Admin Sends Invitation

```typescript
// From admin UI or API
const response = await fetch('/api/admin/invite', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    role: 'user', // or 'admin', 'manager', etc.
  }),
});
```

### User Accepts Invitation

1. User receives email with magic link
2. Clicks link → redirected to `/auth/accept-invite?token=...`
3. Sets password and full name
4. Account created automatically
5. Redirected to dashboard

## Security Considerations

1. **Token Security:**
   - Tokens are unique, random, and stored securely
   - Expire after 7 days
   - One-time use (status changes to 'accepted')

2. **Access Control:**
   - Only admins/owners can send invitations
   - RLS policies enforce permissions
   - User limits enforced via database triggers

3. **Email Security:**
   - Magic links use HTTPS
   - Tokens are cryptographically secure
   - No passwords sent via email

## Next Steps

1. **Immediate:**
   - Test invitation flow end-to-end
   - Configure custom SMTP
   - Disable public sign-ups

2. **Short-term:**
   - Build admin UI for invitation management
   - Add email template customization
   - Implement invitation monitoring

3. **Long-term:**
   - Add MFA requirement
   - Implement invitation analytics
   - Add bulk invitation support
