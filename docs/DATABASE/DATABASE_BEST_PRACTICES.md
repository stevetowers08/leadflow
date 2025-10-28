# Database Best Practices & Query Guidelines

**Last Updated:** January 27, 2025  
**Version:** Post-LinkedIn Automation Removal & Simplified Status Workflow

## 🚨 Common Issues & Solutions

### 1. **RLS (Row Level Security) Issues in Development**

❌ **PROBLEM**: HTTP 500 errors and infinite retry loops when RLS policies conflict with unauthenticated users

✅ **SOLUTION**: Temporarily disable RLS for development tables

```sql
-- For early development stages, disable RLS to allow unrestricted access
ALTER TABLE job_filter_configs DISABLE ROW LEVEL SECURITY;

-- IMPORTANT: Re-enable before production
ALTER TABLE job_filter_configs ENABLE ROW LEVEL SECURITY;
```

**When to Use This Approach:**

- ✅ Early development stages where you need unrestricted access
- ✅ Testing and iteration phases
- ✅ When RLS policies are causing query failures

**When NOT to Use:**

- ❌ Production environments
- ❌ When handling sensitive user data
- ❌ When you have proper authentication in place

**Best Practices:**

1. **Document which tables have RLS disabled** for development
2. **Create a migration checklist** to re-enable RLS before production
3. **Use service keys** for admin operations instead of disabling RLS
4. **Test RLS policies** in staging environment before production

### 2. **Complex Joins Fail (406 Errors)**

❌ **BAD**: `user_profiles!inner(id, full_name, email, role)`  
✅ **GOOD**: Separate queries or use views

```typescript
// Instead of complex joins, use separate queries:
const { data: assignment } = await supabase
  .from('companies')
  .select('owner_id')
  .eq('id', companyId)
  .single();

if (assignment?.owner_id) {
  const { data: user } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', assignment.owner_id)
    .single();
}
```

### 2. **Field Mismatches**

❌ **BAD**: Selecting fields that don't exist  
✅ **GOOD**: Always verify field names in database

```typescript
// Check actual database schema before writing queries
// Use explicit field selection instead of select('*')
const { data } = await supabase
  .from('people')
  .select('id, name, company_id, email_address, stage') // Explicit fields
  .eq('id', leadId);
```

### 3. **Inconsistent Query Patterns**

❌ **BAD**: Different components use different patterns  
✅ **GOOD**: Use centralized query utilities

### 4. **Using Old Status Values**

❌ **BAD**: Using old LinkedIn automation statuses  
✅ **GOOD**: Use new simplified status workflow

```typescript
// OLD (removed): 'connection_requested', 'connected', 'messaged', etc.
// NEW (simplified): 'new', 'qualified', 'proceed', 'skip'

const { data } = await supabase
  .from('people')
  .select('id, name, stage')
  .in('stage', ['new', 'qualified', 'proceed', 'skip']); // Use new values
```

## 📋 Database Schema Reference

### Tables & Key Fields

#### `people` (Leads) - Simplified Structure

```sql
- id (uuid, primary key)
- name (text)
- company_id (uuid, foreign key to companies)
- email_address (text)
- employee_location (text)
- company_role (text)
- stage (stage_enum: 'new', 'qualified', 'proceed', 'skip')
- lead_score (text)
- linkedin_url (text) -- Restored after cleanup
- confidence_level (text: 'low', 'medium', 'high')
- email_draft (text)
- last_reply_at (timestamp)
- last_reply_channel (text)
- last_reply_message (text)
- last_interaction_at (timestamp)
- reply_type (reply_type_enum: 'interested', 'not_interested', 'maybe')
- is_favourite (boolean)
- favourite (boolean)
- jobs (text)
- lead_source (text)
- owner_id (uuid, foreign key to user_profiles)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `companies`

```sql
- id (uuid, primary key)
- name (text)
- industry (text)
- head_office (text)
- company_size (text)
- website (text)
- linkedin_url (text)
- lead_score (text)
- automation_active (boolean)
- confidence_level (confidence_level_enum: 'low', 'medium', 'high')
- score_reason (text)
- priority (text)
- is_favourite (boolean)
- pipeline_stage (company_pipeline_stage_enum)
- logo_url (text)
- owner_id (uuid, foreign key to user_profiles)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `jobs` - With Qualification Workflow

```sql
- id (uuid, primary key)
- title (text)
- location (text)
- function (text)
- employment_type (text)
- seniority_level (text)
- salary (text)
- company_id (uuid, foreign key to companies)
- qualification_status (text: 'new', 'qualify', 'skip')
- lead_score_job (integer)
- priority (text)
- automation_active (boolean)
- owner_id (uuid, foreign key to user_profiles)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `email_replies` - Gmail Integration

```sql
- id (uuid, primary key)
- person_id (uuid, foreign key to people)
- company_id (uuid, foreign key to companies)
- interaction_id (uuid, foreign key to interactions)
- gmail_message_id (text)
- gmail_thread_id (text)
- from_email (text)
- reply_subject (text)
- reply_body_plain (text)
- reply_body_html (text)
- received_at (timestamp)
- sentiment (text: 'positive', 'negative', 'neutral', 'out_of_office')
- sentiment_confidence (numeric)
- sentiment_reasoning (text)
- triggered_stage_change (boolean)
- previous_stage (text)
- new_stage (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `interactions` - Activity Tracking

```sql
- id (uuid, primary key)
- person_id (uuid, foreign key to people)
- interaction_type (interaction_type_enum)
- occurred_at (timestamp)
- subject (text)
- content (text)
- template_id (uuid)
- metadata (jsonb)
- owner_id (uuid, foreign key to user_profiles)
- created_at (timestamp)
```

## 🔄 Status Workflow Guidelines

### People Status Workflow (Simplified)

**Status Enum:** `new | qualified | proceed | skip`

```typescript
// ✅ CORRECT: Use new simplified status values
const { data } = await supabase
  .from('people')
  .select('id, name, stage')
  .in('stage', ['new', 'qualified', 'proceed', 'skip']);

// ❌ WRONG: Don't use old LinkedIn automation statuses
// These have been removed: 'connection_requested', 'connected', 'messaged', etc.
```

**Status Meanings:**

- `new`: Newly discovered leads awaiting review
- `qualified`: Leads that meet criteria and should be pursued
- `proceed`: Ready for CRM integration or email outreach
- `skip`: Not pursuing at this time

### Job Qualification Workflow

**Status Enum:** `new | qualify | skip`

```typescript
// ✅ CORRECT: Use qualification status
const { data } = await supabase
  .from('jobs')
  .select('id, title, qualification_status')
  .eq('qualification_status', 'qualify');
```

**Status Meanings:**

- `new`: Newly discovered jobs awaiting review
- `qualify`: Jobs that meet criteria and should be pursued
- `skip`: Jobs to skip for now

### Email Reply Sentiment Analysis

**Sentiment Values:** `positive | negative | neutral | out_of_office`

```typescript
// ✅ CORRECT: Query by sentiment
const { data } = await supabase
  .from('email_replies')
  .select('id, from_email, sentiment, sentiment_confidence')
  .eq('sentiment', 'positive')
  .gte('sentiment_confidence', 0.8);
```

### Centralized Query Functions

```typescript
// Use these instead of writing queries directly
import { DatabaseQueries } from '@/utils/databaseQueries';

// Get entity with proper field selection
const lead = await DatabaseQueries.getLead(leadId);
const company = await DatabaseQueries.getCompany(companyId);

// Get assignments safely
const assignment = await DatabaseQueries.getAssignment('companies', companyId);
```

### Error Handling Pattern

```typescript
try {
  const { data, error } = await supabase
    .from('table')
    .select('field1, field2')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to fetch: ${error.message}`);
  }

  return data;
} catch (error) {
  console.error('Query failed:', error);
  throw error;
}
```

## 🔧 Migration Checklist

When adding new database queries:

1. ✅ **Verify field names** exist in current database schema
2. ✅ **Use explicit field selection** instead of `select('*')`
3. ✅ **Avoid complex joins** - use separate queries or views
4. ✅ **Add proper error handling** with meaningful messages
5. ✅ **Test queries** in Supabase dashboard first
6. ✅ **Use centralized utilities** when available
7. ✅ **Add TypeScript types** for query results
8. ✅ **Use new status values** (new/qualified/proceed/skip for people)
9. ✅ **Check for removed fields** (LinkedIn automation fields are gone)
10. ✅ **Verify enum values** match current database enums
11. ✅ **Check RLS policies** - disable for development if needed
12. ✅ **Document RLS changes** for production deployment

## 🚀 Performance Tips

1. **Use indexes** on frequently queried fields
2. **Limit results** with `.limit()` for large datasets
3. **Use pagination** for large lists
4. **Cache frequently accessed data** with React Query
5. **Batch related queries** instead of individual calls

## 📊 Status Dropdown Optimizations (Jan 2025)

### Issue: Redundant `client_id` Fetches

**Problem:** Status updates were fetching `client_id` on every API call (2-3 calls per update)

**Solution:** Use cached `client_id` via `useClientId()` hook (5-minute cache)

```typescript
// ❌ BEFORE: Fetching client_id on every update
const { data: clientUser } = await supabase
  .from('client_users')
  .select('client_id')
  .eq('user_id', user.id)
  .maybeSingle();

// ✅ AFTER: Use cached client_id
const { data: clientId } = useClientId(); // Cached for 5 minutes
const { error } = await supabase.from('client_jobs').upsert({
  client_id: clientId, // Use cached value
  job_id: entityId,
  status: newStatus,
});
```

**Impact:** 50% reduction in API calls for job status updates

### Row Updates in Filtered Views

**Best Practice:** Update only the affected row, not the entire table

```typescript
// ✅ OPTIMAL: Update single row in filtered view
// Option 1: Optimistic update with rollback
const mutation = useMutation({
  mutationFn: async newStatus => {
    const { error } = await supabase
      .from('people')
      .update({ people_stage: newStatus })
      .eq('id', personId)
      .select();
    if (error) throw error;
  },
  onMutate: async newStatus => {
    // Cancel outgoing queries
    await queryClient.cancelQueries(['people']);
    // Get previous value
    const previous = queryClient.getQueryData(['people']);
    // Optimistically update
    queryClient.setQueryData(['people'], old =>
      old.map(p => (p.id === personId ? { ...p, people_stage: newStatus } : p))
    );
    return { previous };
  },
  onError: (err, newStatus, context) => {
    // Rollback on error
    queryClient.setQueryData(['people'], context.previous);
  },
});
```

**Modern Pattern:**

1. **Optimistic update** - Show change immediately
2. **Send API request** - Update server
3. **Rollback on error** - Revert if fails
4. **Real-time sync** - Use Supabase real-time for multi-user

### Reduce Data Transfer

```typescript
// ❌ BAD: Selecting all columns unnecessarily
const { data } = await supabase
  .from('companies')
  .select('*') // Too much data!
  .order('created_at', { ascending: false });

// ✅ GOOD: Select only needed columns
const { data } = await supabase
  .from('companies')
  .select('id, name, website, pipeline_stage')
  .order('created_at', { ascending: false });
```

**Impact:** 30-40% reduction in data transfer for table refetches

## 🐛 Debugging Database Issues

### Common Error Codes

- **500**: Server error (often RLS policy conflicts in development)
- **406**: Invalid query syntax (usually joins)
- **404**: Table or field doesn't exist
- **401**: Permission denied
- **400**: Bad request (usually malformed query)

### Debug Steps

1. Check the actual query in Network tab
2. Test query in Supabase dashboard
3. Verify field names match database schema
4. Check RLS policies if getting permission errors
5. Use browser dev tools to inspect the exact error
6. **For 500 errors**: Check if RLS policies conflict with auth state
7. **For infinite retry loops**: Disable RLS temporarily for development
8. **Check Supabase logs** for detailed error messages

## 📚 Resources

- [Supabase Query Documentation](https://supabase.com/docs/guides/database/querying)
- [PostgreSQL Query Syntax](https://www.postgresql.org/docs/current/sql-select.html)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/best-practices)
