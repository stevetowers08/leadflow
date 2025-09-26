# 🛡️ Security Setup Guide

## 🚨 CRITICAL: Security Vulnerabilities Found

Your app currently has **critical security vulnerabilities** that must be fixed before launch:

### **Current Issues:**
- ❌ **Row Level Security (RLS) disabled** on all tables
- ❌ **Anyone can sign up** via Google OAuth
- ❌ **No user management** or approval process
- ❌ **Complete data exposure** to unauthorized users

## 🔧 **IMMEDIATE FIXES REQUIRED**

### **Step 1: Apply Security Migration**
```bash
# Apply the security migration
supabase db push

# Or manually run the migration
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/20250125000001_enable_security.sql
```

### **Step 2: Set Up User Profiles**
```bash
# Run the setup script to create user profiles for existing users
node scripts/setup-secure-auth.js
```

### **Step 3: Verify Security**
```sql
-- Check that RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- Check user profiles
SELECT * FROM public.user_profiles;
```

## 🔐 **Security Implementation Details**

### **Row Level Security (RLS)**
- **Enabled on all tables**: `companies`, `people`, `jobs`, `interactions`, `campaigns`, `campaign_participants`
- **Authentication required**: Only authenticated users can access data
- **User isolation**: Users can only access their own profiles

### **User Profiles System**
- **Role-based access**: `owner`, `admin`, `recruiter`, `viewer`
- **User limits**: Configurable limits per user
- **Active status**: Ability to deactivate users

### **Authentication Flow**
1. **Google OAuth**: Users sign in with Google
2. **Profile Check**: System checks for user profile
3. **Access Control**: Role-based permissions applied
4. **Data Isolation**: RLS policies enforce access

## 🚀 **Launch Checklist**

### **Before Launch:**
- [ ] Apply security migration
- [ ] Run user setup script
- [ ] Test authentication flow
- [ ] Verify RLS policies
- [ ] Test user management
- [ ] Configure admin users

### **Post-Launch:**
- [ ] Monitor authentication logs
- [ ] Review user access patterns
- [ ] Update user roles as needed
- [ ] Regular security audits

## 🔧 **Configuration Options**

### **Option A: Admin-Only User Creation (Recommended)**
- Disable automatic user registration
- Require admin approval for new users
- Manual user creation through admin panel

### **Option B: Domain Restrictions**
- Restrict registration to specific email domains
- Automatic approval for trusted domains
- Manual approval for others

### **Option C: Invitation-Only**
- Generate invitation links
- Users can only register with valid invitations
- Full control over who can access the system

## 📋 **User Management**

### **Admin Panel Features:**
- View all users and their roles
- Create new user accounts
- Update user roles and permissions
- Activate/deactivate users
- Set user limits

### **Role Permissions:**
- **Owner**: Full system control, billing, user limits
- **Admin**: User management, system settings
- **Recruiter**: Standard CRM access (default)
- **Viewer**: Read-only access

## 🚨 **Emergency Procedures**

### **If Security Breach Detected:**
1. **Immediately disable RLS** (temporarily)
2. **Audit user access logs**
3. **Review data access patterns**
4. **Update security policies**
5. **Re-enable RLS with updated policies**

### **Rollback Plan:**
```sql
-- Emergency: Disable RLS (TEMPORARY ONLY)
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.people DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_participants DISABLE ROW LEVEL SECURITY;
```

## 📞 **Support**

If you encounter issues:
1. Check Supabase logs for authentication errors
2. Verify environment variables are set correctly
3. Test with a fresh user account
4. Review RLS policies in Supabase dashboard

---

**⚠️ WARNING: Do not launch the app until all security measures are implemented and tested!**
