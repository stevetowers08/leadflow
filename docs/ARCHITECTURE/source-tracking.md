# Source Tracking Architecture

**Date:** October 22, 2025

## Current Source Fields in Companies Table

```sql
companies (
  id UUID,
  name TEXT,

  -- Source tracking
  lead_source TEXT,              -- 'linkedin', 'indeed', 'manual', etc.
  source_job_id UUID,            -- Links to job if came from job
  source_details TEXT,            -- Additional source information
  source_date TIMESTAMPTZ,       -- When company was discovered
  added_manually BOOLEAN,        -- True if manually added
  added_by_client_id UUID,       -- Which client added it
  ...
)
```

---

## How Source Tracking Works

### 1. Company from LinkedIn Job

```typescript
// Job scraped from LinkedIn
{
  id: 'job-123',
  title: 'Senior Engineer',
  company_id: 'microsoft-123',
  platform: 'linkedin'  // Or stored in source
}

// Company created from job
{
  id: 'microsoft-123',
  name: 'Microsoft',
  lead_source: 'linkedin',     // ← Source!
  source_job_id: 'job-123',    // ← Which job
  added_manually: false,
  added_by_client_id: null,    // Created from scraping, not client
}
```

### 2. Company from Manual Entry

```typescript
// User manually adds company
{
  id: 'company-456',
  name: 'Acme Corp',
  lead_source: 'manual',        // ← Source!
  source_job_id: null,          // No linked job
  added_manually: true,         // ← Manual entry
  added_by_client_id: 'client-a', // Which client added it
}
```

### 3. Company from Indeed Job

```typescript
// Job scraped from Indeed
{
  id: 'job-789',
  platform: 'indeed'
}

// Company created
{
  lead_source: 'indeed',         // ← Source!
  source_job_id: 'job-789',
}
```

---

## Recommended Implementation

### Add Explicit Source Field

```sql
ALTER TABLE companies ADD COLUMN IF NOT EXISTS source TEXT;
-- Values: 'linkedin', 'indeed', 'seek', 'manual', 'referral', etc.
```

### Or Use Existing Fields

```sql
-- Current approach
lead_source TEXT,           -- Platform/job board
source_job_id UUID,         -- Specific job
added_manually BOOLEAN,     -- Manual vs scraped
```

---

## Query Examples

### Get Companies by Source

```typescript
// Get all LinkedIn companies
const { data } = await supabase
  .from('companies')
  .select('*')
  .eq('lead_source', 'linkedin');

// Get manually added companies
const { data } = await supabase
  .from('companies')
  .select('*')
  .eq('added_manually', true);
```

---

## Recommendation

**Use existing `lead_source` field** - It already tracks where the company came from!
