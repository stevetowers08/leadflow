---
owner: backend-team
last-reviewed: 2025-01-27
status: final
product-area: infrastructure
---

# Database Query Patterns

**Last Updated:** January 2025

## Best Practices

### Always Use Service Functions

```typescript
// ✅ Good
import { getJobs } from '@/services/jobsService';
const jobs = await getJobs({ status: 'qualify' });

// ❌ Bad: Direct queries in components
const { data } = await supabase.from('jobs').select('*');
```

### Explicit Field Selection

```typescript
// ✅ Good: Select only needed fields
const { data } = await supabase
  .from('people')
  .select('id, name, people_stage, company_id')
  .eq('owner_id', userId);

// ❌ Bad: Selecting all fields
const { data } = await supabase.from('people').select('*');
```

### RLS Policies

Always use authenticated queries. RLS policies enforce data isolation:

```typescript
// ✅ Good: Uses authenticated user
const { data } = await supabase
  .from('people')
  .select('*')
  .eq('owner_id', userId); // RLS policy checks this

// ❌ Bad: Bypassing RLS (never do this)
const { data } = await supabase
  .from('people')
  .select('*')
  .eq('owner_id', userId)
  .rpc('bypass_rls'); // DON'T DO THIS
```

## Common Query Patterns

### Get User's Data

```typescript
// Get user's people
const { data } = await supabase
  .from('people')
  .select('id, name, people_stage')
  .eq('owner_id', userId);

// Get user's companies
const { data } = await supabase
  .from('companies')
  .select('id, name, pipeline_stage')
  .eq('owner_id', userId);

// Get user's jobs
const { data } = await supabase
  .from('jobs')
  .select('id, title, qualification_status')
  .eq('owner_id', userId);
```

### Filter by Status

```typescript
// Qualified jobs
const { data } = await supabase
  .from('jobs')
  .select('*')
  .eq('qualification_status', 'qualify')
  .eq('owner_id', userId);

// New leads (people)
const { data } = await supabase
  .from('people')
  .select('*')
  .eq('people_stage', 'new_lead')
  .eq('owner_id', userId);
```

### Joins

```typescript
// Jobs with company info
const { data } = await supabase
  .from('jobs')
  .select(`
    id,
    title,
    qualification_status,
    companies!jobs_company_id_fkey (
      id,
      name,
      logo_url
    )
  `)
  .eq('owner_id', userId);

// People with company info
const { data } = await supabase
  .from('people')
  .select(`
    id,
    name,
    people_stage,
    companies!people_company_id_fkey (
      id,
      name
    )
  `)
  .eq('owner_id', userId);
```

### Updates

```typescript
// Update job qualification status
await supabase
  .from('jobs')
  .update({ qualification_status: 'qualify' })
  .eq('id', jobId)
  .eq('owner_id', userId); // Always check ownership

// Update people stage
await supabase
  .from('people')
  .update({ people_stage: 'message_sent' })
  .eq('id', personId)
  .eq('owner_id', userId);
```

## Error Handling

```typescript
const { data, error } = await supabase
  .from('people')
  .select('*')
  .eq('owner_id', userId);

if (error) {
  console.error('Query failed:', error);
  return { success: false, error };
}

return { success: true, data };
```

## Using Type-Safe Queries

Use `src/utils/databaseQueries.ts` for type-safe queries:

```typescript
import { DatabaseQueries } from '@/utils/databaseQueries';

const person = await DatabaseQueries.getEntity<Person>('people', id);
```

## Common Issues

### Complex Joins Fail (406 Errors)

Use separate queries instead of complex joins:

```typescript
// ❌ Bad: Complex join
.select('*, companies!inner(*)')

// ✅ Good: Separate queries
const { data: person } = await supabase
  .from('people')
  .select('id, company_id')
  .eq('id', personId)
  .single();

if (person?.company_id) {
  const { data: company } = await supabase
    .from('companies')
    .select('id, name')
    .eq('id', person.company_id)
    .single();
}
```

### Field Mismatches

Always verify field names match database schema:

```typescript
// Check schema first
npm run db:schema people

// Then use correct field names
.select('id, name, people_stage') // Not 'stage' or 'status'
```

---

**Related Docs:**
- [Database Schema](schema.md) - Complete schema reference
- [RLS Policies](../../02-architecture/rls-policies.md) - Security policies







