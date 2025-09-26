# How to Set Yourself as Owner

## Current Status
You currently have a **temporary Owner assignment** system for testing. Here's how to set yourself as Owner permanently:

## Method 1: Temporary Assignment (Current)
1. Go to `/admin` page
2. Look for "Owner Role Assignment" section
3. Click "Make Me Owner (Temporary)" button
4. Page will refresh and you'll have Owner permissions

## Method 2: Permanent Assignment (Recommended)

### Option A: Via Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `jedfundfhzytpnbjkspn`
3. Go to **Authentication** → **Users**
4. Find your user account
5. Click **Edit** on your user
6. In **User Metadata**, add:
   ```json
   {
     "role": "owner"
   }
   ```
7. Click **Save**

### Option B: Via Script (Requires Service Role Key)
1. Create `.env.local` file with:
   ```
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
2. Run the promotion script:
   ```bash
   node scripts/promote-user-to-owner.js your-email@domain.com
   ```

## What Owner Gets You

### Extra Tab in Admin Page
- **Owner Tab**: Only visible to Owners
- **User Limits**: Control maximum users
- **System Status**: View system health
- **Billing Info**: View current plan

### Role Management
- **Change User Roles**: Only Owner can change other users' roles
- **Self-Protection**: Owner cannot change their own role
- **Admin Restrictions**: Admins can only see roles, not change them

### User Invitation Control
- **Set User Limits**: Control how many users can be invited
- **Enforce Limits**: System prevents over-invitation
- **Admin Can Still Invite**: Admins can invite users within the limit

## Current Features

✅ **Owner Tab**: Extra tab in Admin page (only for Owners)
✅ **Role Restrictions**: Only Owner can change user roles  
✅ **User Limits**: Owner controls max users
✅ **Admin Invites**: Admins can still invite users
✅ **Self-Protection**: Owner cannot change own role
✅ **Visual Indicators**: Clear role badges and permissions

## Testing
- Use the temporary assignment to test Owner functionality
- Once confirmed working, set permanent role via Supabase Dashboard
- Remove temporary assignment components when ready for production

