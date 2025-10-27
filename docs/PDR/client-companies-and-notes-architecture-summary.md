# Client Companies & Notes Architecture Summary

**Date:** October 22, 2025  
**Status:** ✅ Confirmed

## Architecture Overview

### ✅ **Companies: Global + Association Table**

- **Companies table**: Global/shared across all clients
- **client_companies table**: Links companies to clients (many-to-many)
- Same company can be qualified by multiple clients
- Companies are created when jobs are qualified

### ✅ **Notes: Client-Scoped with Optional Lead Association**

- **Notes table**: Contains `client_id` column for client scoping
- **related_lead_id**: Optional column to link notes to specific leads
- Notes are client-specific (not shared between clients)

---

## Data Flow

### When Client A Qualifies a Job

```typescript
// 1. Create client_jobs entry
await supabase.from('client_jobs').insert({
  client_id: 'client-a-id',
  job_id: 'microsoft-job-id',
  status: 'qualify',
  qualified_at: new Date(),
});

// 2. Get company from job
const job = await supabase
  .from('jobs')
  .select('company_id')
  .eq('id', 'microsoft-job-id')
  .single();

// 3. Create/Find company globally (shared)
const company = await findOrCreateCompany({
  id: job.company_id,
  name: 'Microsoft',
  // ... other company data
});

// 4. Link company to Client A
await supabase.from('client_companies').insert({
  client_id: 'client-a-id',
  company_id: company.id,
  qualification_status: 'qualify',
  qualified_at: new Date(),
});
```

### When Client B Qualifies Same Job

```typescript
// 1. Create client_jobs entry for Client B
await supabase.from('client_jobs').insert({
  client_id: 'client-b-id',
  job_id: 'microsoft-job-id', // Same job!
  status: 'qualify',
  qualified_at: new Date(),
});

// 2. Company already exists globally
const company = await getCompany(job.company_id);

// 3. Link same company to Client B
await supabase.from('client_companies').insert({
  client_id: 'client-b-id',
  company_id: company.id, // Same company!
  qualification_status: 'qualify',
  qualified_at: new Date(),
});
```

**Result**: Microsoft exists once globally, but appears in both Client A's and Client B's feed.

---

## Notes Architecture

### Client A Creates Note on Microsoft

```typescript
// Create note with client scoping
await supabase.from('notes').insert({
  entity_id: 'microsoft-company-id',
  entity_type: 'company',
  content: 'Budget confirmed for Q4',
  author_id: user.id,
  client_id: 'client-a-id', // ← Client scoping
  related_lead_id: 'decision-maker-id', // ← Optional lead
});
```

### Client B Creates Note on Microsoft

```typescript
await supabase.from('notes').insert({
  entity_id: 'microsoft-company-id', // Same company
  entity_type: 'company',
  content: 'Interested in enterprise tier',
  author_id: user.id,
  client_id: 'client-b-id', // ← Different client
});
```

**Result**:

- Microsoft has 2 separate notes (one per client)
- Client A only sees their note
- Client B only sees their note

---

## Database Tables

### **companies** (Global/Shared)

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name TEXT,
  website TEXT,
  industry TEXT,
  -- ... other fields
  -- ❌ NO client_id (global/shared)
);
```

### **client_companies** (Association)

```sql
CREATE TABLE client_companies (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  company_id UUID REFERENCES companies(id),
  qualification_status TEXT,  -- 'qualify' or 'skip'
  qualified_at TIMESTAMPTZ,
  qualified_by UUID,
  UNIQUE(client_id, company_id)
);
```

### **notes** (Client-Scoped)

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  entity_id UUID,  -- Company ID
  entity_type TEXT,  -- 'company'
  content TEXT,
  author_id UUID,
  client_id UUID REFERENCES clients(id),  -- ← Client scoping
  related_lead_id UUID REFERENCES people(id),  -- ← Optional lead
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

---

## Key Insights

1. **Companies**: Global + association = efficient, deduplicated
2. **Notes**: Client-scoped = proper isolation
3. **Many-to-Many**: Same company can belong to multiple clients
4. **No Cross-Client Leakage**: RLS enforces client isolation

---

## Next Steps

1. ✅ Create `client_companies` table (already exists in migration)
2. ✅ Add `client_id` and `related_lead_id` to `notes` table
3. ⏳ Update job qualification logic to create `client_companies` entries
4. ⏳ Update companies query to join with `client_companies`
5. ⏳ Update notes creation to include `client_id`
