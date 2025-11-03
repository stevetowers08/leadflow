---
owner: backend-team
last-reviewed: 2025-01-27
status: final
---

# Database Reference

**Last Updated:** January 2025

## Overview

Empowr CRM uses Supabase (PostgreSQL) with Row Level Security (RLS) enabled on all tables.

## Core Tables

### `people` (Leads/Contacts)

```sql
CREATE TABLE people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_id uuid REFERENCES companies(id),
  people_stage text, -- See product.md for status definitions
  lead_score integer,
  email_address text,
  phone_number text,
  linkedin_url text,
  owner_id uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Status Field:** `people_stage`

- Values: `new_lead` | `message_sent` | `replied` | `interested` | `meeting_scheduled` | `meeting_completed` | `follow_up` | `not_interested`

### `companies` (Client Prospects)

```sql
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  pipeline_stage text, -- Business pipeline stage
  logo_url text,
  website text,
  owner_id uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Status Field:** `pipeline_stage`

- Values: `new_lead` | `qualified` | `message_sent` | `replied` | `meeting_scheduled` | `proposal_sent` | `negotiation` | `closed_won` | `closed_lost` | `on_hold`

### `jobs` (Job Postings)

```sql
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_id uuid REFERENCES companies(id),
  qualification_status text, -- 'new' | 'qualify' | 'skip'
  location text,
  function text,
  employment_type text,
  seniority_level text,
  job_url text,
  posted_date date,
  owner_id uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Status Field:** `qualification_status`

- Values: `new` | `qualify` | `skip`

## Query Patterns

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
```

## Common Queries

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

## Database Commands

```bash
# Show all tables
npm run db:schema

# Show specific table
npm run db:schema people

# Show specific field
npm run db:schema companies name
```

## Best Practices

1. **Always use service functions** from `src/services/`
2. **Select explicit fields** - avoid `SELECT *`
3. **Always check ownership** - use `.eq('owner_id', userId)`
4. **Use type-safe queries** from `src/utils/databaseQueries.ts`
5. **Never bypass RLS** - always use authenticated queries

---

**Related:** [Product Overview](product.md) | [Development Guide](development.md)
