# Setting Up Invitation-Only Authentication

This guide walks you through configuring your LeadFlow app for invitation-only sign-ups (admin-controlled authentication).

## Step 1: Disable Public Sign-Ups in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Under **Email Auth**, find **"Enable email signup"**
4. **Disable** this option
5. Click **Save**

This prevents users from creating accounts without an invitation.

## Step 2: Configure Custom SMTP (Recommended)

Supabase's default SMTP has rate limits. For production, use a custom SMTP service.

### Option A: Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. In Supabase Dashboard → **Authentication** → **SMTP Settings**:
   - **SMTP Host**: `smtp.resend.com`
   - **SMTP Port**: `465` (SSL) or `587` (TLS)
   - **SMTP User**: `resend`
   - **SMTP Password**: Your Resend API key
   - **Sender Email**: Your verified domain email (e.g., `noreply@yourdomain.com`)
   - **Sender Name**: Your app name (e.g., "LeadFlow")

### Option B: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key with "Mail Send" permissions
3. In Supabase Dashboard → **Authentication** → **SMTP Settings**:
   - **SMTP Host**: `smtp.sendgrid.net`
   - **SMTP Port**: `587`
   - **SMTP User**: `apikey`
   - **SMTP Password**: Your SendGrid API key
   - **Sender Email**: Your verified sender email
   - **Sender Name**: Your app name

### Option C: AWS SES

1. Set up AWS SES in your AWS account
2. Verify your domain/email
3. Create SMTP credentials
4. In Supabase Dashboard → **Authentication** → **SMTP Settings**:
   - **SMTP Host**: Your SES SMTP endpoint (e.g., `email-smtp.us-east-1.amazonaws.com`)
   - **SMTP Port**: `587`
   - **SMTP User**: Your SES SMTP username
   - **SMTP Password**: Your SES SMTP password
   - **Sender Email**: Your verified SES email
   - **Sender Name**: Your app name

## Step 3: Customize Email Templates

1. In Supabase Dashboard → **Authentication** → **Email Templates**
2. Select **"Invite user"** template
3. Customize the template with:
   - Your branding/logo
   - Clear instructions
   - Invitation expiration notice
   - Support contact information

**Example Template:**

```html
<h2>You've been invited to {{ .SiteName }}</h2>
<p>Click the link below to accept your invitation and create your account:</p>
<p><a href="{{ .ConfirmationURL }}">Accept Invitation</a></p>
<p><small>This invitation expires in 7 days.</small></p>
<p>If you didn't expect this invitation, you can safely ignore this email.</p>
```

## Step 4: Verify Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Important:** `NEXT_PUBLIC_SITE_URL` must match your production domain for magic links to work correctly.

## Step 5: Test the Flow

1. **As an Admin:**
   - Go to Settings → User Invitations
   - Click "Invite User"
   - Enter email and select role
   - Click "Send Invitation"

2. **As the Invited User:**
   - Check email for invitation
   - Click the magic link
   - You'll be redirected to `/auth/accept-invite`
   - Set your password and full name
   - Account is created and you're logged in

## Troubleshooting

### Invitation emails not sending

- Check SMTP configuration in Supabase Dashboard
- Verify sender email is verified/authenticated
- Check Supabase logs for SMTP errors
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly

### Magic link not working

- Verify `NEXT_PUBLIC_SITE_URL` matches your domain
- Check that redirect URL in invitation matches your site URL
- Ensure cookies are enabled in browser
- Check browser console for errors

### Users can still sign up without invitation

- Verify "Enable email signup" is disabled in Supabase
- Check that `AuthModal` component checks for invitation
- Ensure middleware is protecting routes

## Security Best Practices

1. ✅ **Disable public sign-ups** - Only allow invitation-based registration
2. ✅ **Use custom SMTP** - Better deliverability and no rate limits
3. ✅ **Set token expiration** - Currently 7 days (configurable in migration)
4. ✅ **Monitor invitations** - Use admin dashboard to track status
5. ✅ **Enforce role-based access** - Only admins/owners can invite
6. ✅ **Use HTTPS** - Required for secure magic links

## Next Steps

- [ ] Set up custom SMTP
- [ ] Customize email templates
- [ ] Test invitation flow end-to-end
- [ ] Train admins on invitation management
- [ ] Set up monitoring/alerts for failed invitations
