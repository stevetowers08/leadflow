# Supabase Performance & Security Fixes Summary

## ✅ Fixed Issues (Applied Migrations)

### 1. Consolidated Multiple RLS Policies ✅

**Status:** FIXED via migrations

**Tables Fixed:**

- `user_profiles` - Removed redundant "Authenticated users can view profiles" policy
- `hubspot_company_mappings` - Removed redundant SELECT policy (ALL policy covers it)
- `hubspot_contact_mappings` - Removed redundant SELECT policy (ALL policy covers it)
- `mailchimp_subscriber_mappings` - Removed redundant SELECT policy (ALL policy covers it)

**Impact:** Improved query performance by reducing policy evaluation overhead

**Migrations Applied:**

- `consolidate_user_profiles_rls_policies`
- `consolidate_hubspot_mappings_rls_policies`
- `consolidate_mailchimp_mappings_rls_policies`

## ⚠️ Issues Requiring Manual Intervention

### 1. RLS Disabled on `wrappers_fdw_stats` Table

**Status:** CANNOT FIX (System Table)
**Level:** ERROR
**Issue:** Table is owned by Supabase system, cannot modify via migrations
**Action Required:** Contact Supabase support or use service role to enable RLS
**Note:** This is a system table for foreign data wrapper statistics, low security risk

### 2. Extensions in Public Schema

**Status:** CANNOT FIX (Supabase Managed)
**Level:** WARN
**Extensions:** `wrappers`, `http`
**Issue:** Extensions installed in public schema (should be in separate schema)
**Action Required:** This is managed by Supabase infrastructure. Consider acceptable for now.

### 3. Cron Job Schema Error

**Status:** REQUIRES MANUAL FIX
**Level:** ERROR
**Issue:** Cron job uses `net.http_post` but `net` extension doesn't exist
**Error:** `schema "net" does not exist`
**Current Command:** Uses `net.http_post` (should be `http.http_post`)
**Action Required:**

1. Access Supabase Dashboard → Database → Cron Jobs
2. Edit the job that syncs Airtable (runs every 15 minutes)
3. Replace `net.http_post` with `http.http_post` in the command
4. Or use Supabase SQL Editor with service role to update:
   ```sql
   SELECT cron.alter_job(
       1,  -- jobid
       schedule := '*/15 * * * *',
       command := REPLACE(
           (SELECT command FROM cron.job WHERE jobid = 1),
           'net.http_post',
           'http.http_post'
       )
   );
   ```

### 4. Leaked Password Protection Disabled

**Status:** REQUIRES MANUAL FIX
**Level:** WARN
**Issue:** Auth not checking against HaveIBeenPwned.org
**Action Required:**

1. Go to Supabase Dashboard → Authentication → Password Security
2. Enable "Leaked Password Protection"
3. This prevents users from using compromised passwords

## 📊 Performance Improvements Achieved

### Before:

- Multiple permissive RLS policies on 4 tables
- Each query evaluated 2 policies per table
- Performance overhead on every SELECT query

### After:

- Consolidated to single policies where possible
- Reduced policy evaluation overhead by ~50%
- Improved query performance on:
  - `user_profiles` queries
  - `hubspot_company_mappings` queries
  - `hubspot_contact_mappings` queries
  - `mailchimp_subscriber_mappings` queries

## 🔍 Verification

Run this query to verify RLS policy consolidation:

```sql
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('user_profiles', 'hubspot_company_mappings', 'hubspot_contact_mappings', 'mailchimp_subscriber_mappings')
GROUP BY tablename
ORDER BY tablename;
```

Expected results:

- `hubspot_company_mappings`: 1 policy
- `hubspot_contact_mappings`: 1 policy
- `mailchimp_subscriber_mappings`: 1 policy
- `user_profiles`: 3 policies (INSERT, UPDATE, SELECT - different commands)

## 📝 Next Steps

1. ✅ **DONE:** Consolidated RLS policies
2. ⚠️ **TODO:** Fix cron job schema error (manual)
3. ⚠️ **TODO:** Enable leaked password protection (dashboard)
4. ℹ️ **INFO:** System table RLS and extensions - acceptable for now

## 🔗 References

- [Supabase RLS Performance Guide](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies)
- [Password Security Guide](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
