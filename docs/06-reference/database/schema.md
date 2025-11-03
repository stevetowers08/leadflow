---
owner: backend-team
last-reviewed: 2025-01-27
status: final
product-area: infrastructure
---

# Database Schema Reference

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
  people_stage text, -- See status-campaigns.md
  lead_score integer,
  email_address text,
  phone_number text,
  linkedin_url text,
  owner_id uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Key Fields:**
- `people_stage`: `new_lead` | `message_sent` | `replied` | `interested` | `meeting_scheduled` | `meeting_completed` | `follow_up` | `not_interested`

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

**Key Fields:**
- `pipeline_stage`: `new_lead` | `qualified` | `message_sent` | `replied` | `meeting_scheduled` | `proposal_sent` | `negotiation` | `closed_won` | `closed_lost` | `on_hold`

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

**Key Fields:**
- `qualification_status`: `new` | `qualify` | `skip`

## Status Enums

See [Status Campaigns](../../01-overview/status-campaigns.md) for complete enum definitions.

## Relationships

```
people → companies (many-to-one)
jobs → companies (many-to-one)
companies → user_profiles (many-to-one via owner_id)
```

## RLS Policies

All tables have RLS enabled. Users can only access data where `owner_id` matches their user ID.

```sql
-- Example RLS policy
CREATE POLICY "Users can only see their own data"
ON people FOR SELECT
USING (owner_id = auth.uid());
```

## Query Patterns

### Get User's People

```typescript
const { data } = await supabase
  .from('people')
  .select('id, name, people_stage')
  .eq('owner_id', userId);
```

### Get Qualified Jobs

```typescript
const { data } = await supabase
  .from('jobs')
  .select('id, title, qualification_status')
  .eq('qualification_status', 'qualify')
  .eq('owner_id', userId);
```

### Join Companies with Jobs

```typescript
const { data } = await supabase
  .from('jobs')
  .select(`
    id,
    title,
    companies!jobs_company_id_fkey (
      id,
      name,
      logo_url
    )
  `)
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

---

**Related Docs:**
- [Status Campaigns](../../01-overview/status-campaigns.md) - Status enum definitions
- [Database Queries](queries.md) - Query patterns and best practices
- [RLS Policies](../../02-architecture/rls-policies.md) - Security policies

