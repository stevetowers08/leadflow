# Environment Variables Setup

## Required Environment Variables

To enable admin functionality, you need to set up the following environment variables:

### 1. Create `.env.local` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjE5NDIsImV4cCI6MjA3MzkzNzk0Mn0.K5PFr9NdDav7SLk5pguj5tawj-10j-yhlUfFa_Fkvqg

# Admin Functionality (REQUIRED for User Management)
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Get Your Service Role Key:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `jedfundfhzytpnbjkspn`
3. Go to **Settings** → **API**
4. Copy the **service_role** key (NOT the anon key)
5. Paste it as `VITE_SUPABASE_SERVICE_ROLE_KEY` in your `.env.local` file

### 3. Restart Development Server:

```bash
npm run dev
```

## ⚠️ Security Warning

- **NEVER** commit the service role key to version control
- **NEVER** expose the service role key in client-side code
- The service role key bypasses Row Level Security (RLS)
- Only use it for admin operations that require elevated privileges

## What This Enables

With the service role key configured, you can:

- ✅ View all users in the system
- ✅ Create new users
- ✅ Update user roles and permissions
- ✅ Activate/deactivate users
- ✅ Access admin settings

Without it, you'll see error messages about missing configuration.

## Troubleshooting

### Error: "Service role key not configured"
- Make sure you've created `.env.local` file
- Verify the key name is exactly `VITE_SUPABASE_SERVICE_ROLE_KEY`
- Restart the development server after adding the variable

### Error: "Invalid API key"
- Double-check you copied the **service_role** key, not the **anon** key
- Make sure there are no extra spaces or characters

### Still having issues?
- Check the browser console for detailed error messages
- Verify your Supabase project is active and accessible
