# Company Qualification Logic

**Date:** October 22, 2025

## How It Works

When a user qualifies a job, we:

1. ✅ Create/update entry in `client_jobs` (track which jobs the client qualified)
2. ❌ **Currently missing**: Create/update entry in `client_companies` (track which companies the client qualified)

---

## Current Flow (Incomplete)

### Step 1: User Clicks "Qualify" on a Job

```typescript
// In JobQualificationCardButtons.tsx
const handleQualification = async (status: 'qualify' | 'skip') => {
  // Get user's client_id
  const { data: clientUser } = await supabase
    .from('client_users')
    .select('client_id')
    .eq('user_id', user.id)
    .single();

  // ✅ Create client_jobs entry
  await supabase.from('client_jobs').upsert({
    client_id: clientUser.client_id,
    job_id: jobId,
    status: status,
    qualified_by: user.id,
    qualified_at: status === 'qualify' ? new Date().toISOString() : null,
  });

  // ❌ MISSING: Link company to client!
  // Need to also create client_companies entry
};
```

---

## What Should Happen

### Step 1: Find or Create Company (Global)

```typescript
// Company might already exist globally (from job scraping)
const company = await findOrCreateCompany({
  name: 'Microsoft',
  website: 'microsoft.com',
  industry: 'Technology',
  // ... other company data from job
});

// If company doesn't exist yet, create it in global companies table
if (!company) {
  const { data: newCompany } = await supabase
    .from('companies')
    .insert({
      name: job.company_name,
      website: job.company_website,
      industry: job.company_industry,
      source_job_id: jobId,
    })
    .select()
    .single();

  company = newCompany;
}
```

### Step 2: Link Company to Client

```typescript
// Create entry in client_companies (association table)
await supabase.from('client_companies').upsert(
  {
    client_id: clientUser.client_id,
    company_id: company.id,
    qualification_status: 'qualify',
    qualified_at: new Date().toISOString(),
    qualified_by: user.id,
  },
  {
    onConflict: 'client_id,company_id',
  }
);
```

---

## Complete Flow

### When User Qualifies a Job

```typescript
async function handleJobQualification(
  jobId: string,
  status: 'qualify' | 'skip'
) {
  const user = await getCurrentUser();
  const clientUser = await getClientUser(user.id);

  // 1. Link job to client
  await supabase.from('client_jobs').upsert({
    client_id: clientUser.client_id,
    job_id: jobId,
    status: status,
    qualified_at: status === 'qualify' ? new Date() : null,
  });

  // 2. If qualifying, also link company to client
  if (status === 'qualify') {
    // Get company from job
    const { data: job } = await supabase
      .from('jobs')
      .select('company_id, companies(*)')
      .eq('id', jobId)
      .single();

    if (job?.company_id) {
      // Find or create company globally
      const company = await findOrCreateCompany(job.companies);

      // Link company to client
      await supabase.from('client_companies').upsert({
        client_id: clientUser.client_id,
        company_id: company.id,
        qualification_status: 'qualify',
        qualified_at: new Date(),
        qualified_by: user.id,
      });
    }
  }
}
```

---

## What Goes in Each Table

### `companies` (Global)

```sql
-- Microsoft exists once globally
INSERT INTO companies (
  id,
  name,
  website,
  industry,
  source_job_id
) VALUES (
  'company-uuid',
  'Microsoft',
  'microsoft.com',
  'Technology',
  'job-uuid'
);
```

### `client_companies` (Association)

```sql
-- Client A qualified Microsoft
INSERT INTO client_companies (
  client_id,
  company_id,
  qualification_status,
  qualified_at
) VALUES (
  'client-a',
  'company-uuid',  -- Same company!
  'qualify',
  NOW()
);

-- Client B also qualified Microsoft (same company)
INSERT INTO client_companies (
  client_id,
  company_id,
  qualification_status,
  qualified_at
) VALUES (
  'client-b',
  'company-uuid',  -- Same company UUID!
  'qualify',
  NOW()
);
```

---

## The Database State

### After Client A Qualifies Microsoft Job

```
companies table (global):
┌─────────────┬────────────┬─────────────────────────┐
│ id          │ name       │ website                 │
├─────────────┼────────────┼─────────────────────────┤
│ abc-123     │ Microsoft  │ microsoft.com           │
└─────────────┴────────────┴─────────────────────────┘

client_companies table (association):
┌─────────────┬─────────────┬──────────────┬────────────┐
│ client_id   │ company_id  │ status       │ qualified_at │
├─────────────┼─────────────┼──────────────┼────────────┤
│ client-a    │ abc-123     │ qualify      │ 2025-01-20  │
└─────────────┴─────────────┴──────────────┴────────────┘
```

### After Client B Also Qualifies Same Microsoft Job

```
companies table (global):
┌─────────────┬────────────┬─────────────────────────┐
│ id          │ name       │ website                 │
├─────────────┼────────────┼─────────────────────────┤
│ abc-123     │ Microsoft  │ microsoft.com           │ ← Same!
└─────────────┴────────────┴─────────────────────────┘

client_companies table (association):
┌─────────────┬─────────────┬──────────────┬────────────┐
│ client_id   │ company_id  │ status       │ qualified_at │
├─────────────┼─────────────┼──────────────┼────────────┤
│ client-a    │ abc-123     │ qualify      │ 2025-01-20  │ ← New row
│ client-b    │ abc-123     │ qualify      │ 2025-01-25  │ ← New row
└─────────────┴─────────────┴──────────────┴────────────┘
```

**Result**: Microsoft exists once globally, but both clients link to it!

---

## Summary

**Two tables, two purposes:**

1. **`companies` table**: Stores the company data globally (Microsoft once)
2. **`client_companies` table**: Links which clients qualified which companies (many-to-many)

**When qualifying a job:**

- Create `client_jobs` entry (job qualified)
- If qualifying, also create `client_companies` entry (company qualified)
- Company might already exist in global table (deduplicated)
