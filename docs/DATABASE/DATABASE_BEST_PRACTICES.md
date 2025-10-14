# Database Best Practices & Query Guidelines

## 🚨 Common Issues & Solutions

### 1. **Complex Joins Fail (406 Errors)**
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
  .select('id, name, company_id, email_address') // Explicit fields
  .eq('id', leadId);
```

### 3. **Inconsistent Query Patterns**
❌ **BAD**: Different components use different patterns
✅ **GOOD**: Use centralized query utilities

## 📋 Database Schema Reference

### Tables & Key Fields

#### `people` (Leads)
```sql
- id (uuid, primary key)
- name (text)
- company_id (uuid, foreign key to companies)
- email_address (text)
- employee_location (text)
- company_role (text)
- stage (text)
- lead_score (text)
- linkedin_url (text)
- linkedin_request_message (text)
- linkedin_connected_message (text)
- linkedin_follow_up_message (text)
- automation_started_at (timestamp)
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
- lead_score (text)
- automation_active (boolean)
- confidence_level (text)
- linkedin_url (text)
- score_reason (text)
- created_at (timestamp)
- lead_source (text)
- logo_url (text)
- pipeline_stage (text)
- owner_id (uuid, foreign key to user_profiles)
```

#### `jobs`
```sql
- id (uuid, primary key)
- title (text)
- location (text)
- function (text)
- employment_type (text)
- seniority_level (text)
- salary (text)
- company_id (uuid, foreign key to companies)
- created_at (timestamp)
```

#### `user_profiles`
```sql
- id (uuid, primary key)
- full_name (text)
- email (text)
- role (text)
- is_active (boolean)
- created_at (timestamp)
```

## 🛠️ Query Utilities

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

1. ✅ **Verify field names** exist in database schema
2. ✅ **Use explicit field selection** instead of `select('*')`
3. ✅ **Avoid complex joins** - use separate queries or views
4. ✅ **Add proper error handling** with meaningful messages
5. ✅ **Test queries** in Supabase dashboard first
6. ✅ **Use centralized utilities** when available
7. ✅ **Add TypeScript types** for query results

## 🚀 Performance Tips

1. **Use indexes** on frequently queried fields
2. **Limit results** with `.limit()` for large datasets
3. **Use pagination** for large lists
4. **Cache frequently accessed data** with React Query
5. **Batch related queries** instead of individual calls

## 🐛 Debugging Database Issues

### Common Error Codes
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

## 📚 Resources

- [Supabase Query Documentation](https://supabase.com/docs/guides/database/querying)
- [PostgreSQL Query Syntax](https://www.postgresql.org/docs/current/sql-select.html)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/best-practices)
