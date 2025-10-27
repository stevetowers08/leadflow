# PDR: Client-Scoped Companies Architecture

**Product Requirements Document**  
**Version**: 1.0  
**Date**: January 27, 2025  
**Status**: 📋 **PLANNING**

---

## 📋 Overview

Implement a multi-tenant companies architecture where all qualified companies are stored in a global `companies` table, but each client only sees companies they've explicitly qualified via a `client_companies` association table.

---

## 🎯 Objectives

### Primary Goals

- **Centralized Company Database**: All qualified companies stored in shared `companies` table
- **Client-Specific Access**: Each client sees only companies they've qualified
- **Many-to-Many Relationship**: Companies can belong to multiple clients
- **Data Isolation**: Clients never see other clients' companies
- **Flexible Qualification**: Companies can be qualified by multiple clients independently

### Success Metrics

- **Zero Cross-Client Data Leakage**: Clients only see their qualified companies
- **Performance**: Company feed loads in <2 seconds
- **Scalability**: Support 100+ concurrent clients with 10,000+ companies
- **Automatic Enrichment**: Companies created when jobs are qualified

---

## 🏗️ Architecture

### Current State

```
Job Qualified
    ↓
Companies table (global, all companies)
    ↓
Users see ALL 336 companies
    ↓
No client filtering
```

### Target State

```
Job Qualified by Client A
    ↓
Check: Does company exist globally?
    ↓
If NO: Create company in global companies table
    ↓
Create entry in client_companies (client_id=A, company_id)
    ↓
Client A sees their companies only
```

---

## 📊 Data Flow

### 1. Job Qualification Creates Company

**Trigger**: User qualifies a job

```typescript
async function handleJobQualification(jobId: string, clientId: string) {
  // 1. Get job details
  const job = await getJob(jobId);

  // 2. Find or create company
  const company = await findOrCreateCompany({
    name: job.companies.name,
    website: job.companies.website,
    industry: job.companies.industry,
    source_job_id: jobId, // Track where it came from
  });

  // 3. Link company to client
  await supabase.from('client_companies').insert({
    client_id: clientId,
    company_id: company.id,
    qualified_at: new Date().toISOString(),
    qualification_status: 'qualify',
  });

  // 4. Client can now see this company
}
```

### 2. Company Display (MODIFIED)

**Current Query**:

```typescript
// Shows ALL companies
const { data: companies } = await supabase
  .from('companies')
  .select('*')
  .order('created_at', { ascending: false });
```

**New Query**:

```typescript
// Shows ONLY companies qualified by this client
const { data: companies } = await supabase
  .from('companies')
  .select(
    `
    *,
    client_companies!inner(qualified_at, qualification_status)
  `
  )
  .eq('client_companies.client_id', clientId)
  .order('client_companies.qualified_at', { ascending: false });
```

---

## 🗄️ Database Schema

### Existing Tables (TO MODIFY)

#### **companies** (Global Company Database)

- Contains ALL qualified companies
- Shared across all clients
- Tracks which job created it

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  company_size TEXT,
  linkedin_url TEXT,
  source_job_id UUID REFERENCES jobs(id), -- Track origin
  ai_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### NEW Table Needed

#### **client_companies** (Client-Company Association)

**Purpose**: Many-to-many relationship between clients and companies

```sql
CREATE TABLE IF NOT EXISTS client_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  qualification_status TEXT NOT NULL DEFAULT 'qualify'
    CHECK (qualification_status IN ('qualify', 'skip')),
  qualified_at TIMESTAMPTZ DEFAULT NOW(),
  qualified_by UUID REFERENCES auth.users(id),
  qualification_notes TEXT,
  priority TEXT DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, company_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_companies_client_id
  ON client_companies(client_id);
CREATE INDEX IF NOT EXISTS idx_client_companies_company_id
  ON client_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_client_companies_status
  ON client_companies(qualification_status);

-- RLS Policies
ALTER TABLE client_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view client companies for their clients"
  ON client_companies FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create client companies for their clients"
  ON client_companies FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their client companies"
  ON client_companies FOR UPDATE
  USING (
    client_id IN (
      SELECT client_id FROM client_users WHERE user_id = auth.uid()
    )
  );
```

### Company Qualification Status

**Fields**:

- `client_id`: Which client qualified this company
- `company_id`: The global company
- `qualification_status`: 'qualify' or 'skip' (to allow "not interested" tracking)
- `qualified_at`: When client qualified it
- `qualified_by`: User who qualified it
- `assigned_to`: Optional team member assignment

---

## 🔧 Implementation Components

### 1. Modify Job Qualification Logic

**Location**: `src/components/jobs/JobQualificationCardButtons.tsx`

**Current**:

```typescript:59:72:src/components/jobs/JobQualificationCardButtons.tsx
// Create or update client_job
const { error } = await supabase.from('client_jobs').upsert({
  client_id: clientUser.client_id,
  job_id: jobId,
  status: status,
  priority_level: 'medium',
  qualified_by: user.id,
  qualified_at: status === 'qualify' ? new Date().toISOString() : null,
});
```

**Add**:

```typescript
if (status === 'qualify') {
  // Get company from job
  const { data: job } = await supabase
    .from('jobs')
    .select('company_id, companies(*)')
    .eq('id', jobId)
    .single();

  if (job?.company_id) {
    // Find or create company
    const company = await findOrCreateCompany(job.companies);

    // Link company to client
    await supabase.from('client_companies').upsert({
      client_id: clientUser.client_id,
      company_id: company.id,
      qualification_status: 'qualify',
      qualified_at: new Date().toISOString(),
      qualified_by: user.id,
    });
  }
}
```

### 2. Modify Companies Query

**Location**: `src/pages/Companies.tsx`

**Change from**:

```typescript
const { data: companies } = await supabase.from('companies').select('*');
```

**To**:

```typescript
const { data: companies } = await supabase
  .from('companies')
  .select(
    `
    *,
    client_companies!inner(qualified_at, qualification_status, priority)
  `
  )
  .eq('client_companies.client_id', clientId);
```

### 3. Helper Function: findOrCreateCompany

**Location**: `src/utils/companyUtils.ts`

```typescript
export async function findOrCreateCompany(
  companyData: CompanyData
): Promise<Company> {
  // Check if company exists by name or website
  let { data: existingCompany } = await supabase
    .from('companies')
    .select('*')
    .or(`name.eq.${companyData.name},website.eq.${companyData.website}`)
    .maybeSingle();

  if (existingCompany) {
    return existingCompany;
  }

  // Create new company
  const { data: newCompany, error } = await supabase
    .from('companies')
    .insert({
      ...companyData,
      source_job_id: companyData.source_job_id,
    })
    .select()
    .single();

  if (error) throw error;
  return newCompany;
}
```

---

## 📅 Implementation Phases

### Phase 1: Database Setup (Week 1)

- [ ] Create `client_companies` table
- [ ] Add RLS policies
- [ ] Create indexes
- [ ] Test with sample data

**Files**:

- `supabase/migrations/YYYYMMDD_client_companies_table.sql`

### Phase 2: Qualification Logic (Week 2)

- [ ] Add company creation to job qualification flow
- [ ] Implement `findOrCreateCompany` helper
- [ ] Update qualification components
- [ ] Test end-to-end flow

**Files**:

- `src/components/jobs/JobQualificationCardButtons.tsx`
- `src/utils/companyUtils.ts`

### Phase 3: Companies Feed (Week 3)

- [ ] Modify Companies.tsx query to use `client_companies`
- [ ] Update company card components
- [ ] Add qualification status badges
- [ ] Remove global company feed

**Files**:

- `src/pages/Companies.tsx`
- `src/services/companiesService.ts`

### Phase 4: Migration & Backfill (Week 4)

- [ ] Create migration script for existing companies
- [ ] Determine which client owns which companies
- [ ] Test migration in staging
- [ ] Deploy to production

**Files**:

- `supabase/migrations/YYYYMMDD_backfill_client_companies.sql`
- `scripts/backfill-client-companies.ts`

---

## 🔄 Migration Strategy

### Challenge

We have 336 existing companies with no `client_id` or `client_companies` entries.

### Options

**Option A: Associate with Default Client**

```sql
-- Assign all existing companies to default client
INSERT INTO client_companies (client_id, company_id, qualification_status)
SELECT
  (SELECT id FROM clients LIMIT 1), -- Default client
  id as company_id,
  'qualify' as qualification_status
FROM companies
ON CONFLICT (client_id, company_id) DO NOTHING;
```

**Option B: Associate Based on Source**

```sql
-- Link companies via their source jobs
INSERT INTO client_companies (client_id, company_id, qualification_status)
SELECT DISTINCT
  cj.client_id,
  c.id as company_id,
  'qualify' as qualification_status
FROM companies c
INNER JOIN jobs j ON c.id = j.company_id
INNER JOIN client_jobs cj ON j.id = cj.job_id
WHERE cj.status = 'qualify'
ON CONFLICT (client_id, company_id) DO NOTHING;
```

**Recommended**: Option B - more accurate, uses existing `client_jobs` data

---

## ⚠️ Edge Cases & Considerations

### 1. Company Deduplication

**Scenario**: Same company qualified by multiple clients

**Solution**: Single company in global table, multiple `client_companies` entries

```sql
-- Multiple clients can qualify same company
Company ID: 123
├── client_companies (client_id=A, company_id=123)
├── client_companies (client_id=B, company_id=123)
└── client_companies (client_id=C, company_id=123)
```

### 2. Job Updates Company

**Scenario**: User qualifies job → company enriched with more data

**Solution**: Update global company, keep `client_companies` entry

```typescript
// When enriching company
await supabase
  .from('companies')
  .update({ industry, company_size, ai_info })
  .eq('id', companyId);
```

### 3. Client Unqualifies Company

**Scenario**: User changes mind, wants to remove company

**Solution**: Update `client_companies` status to 'skip', or delete entry

```typescript
await supabase
  .from('client_companies')
  .update({ qualification_status: 'skip' })
  .eq('client_id', clientId)
  .eq('company_id', companyId);
```

### 4. Performance at Scale

**Concern**: With 1000+ companies per client, query could be slow

**Solution**:

- Add composite index on `(client_id, qualification_status)`
- Use pagination
- Consider materialized views for common queries

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] Test `findOrCreateCompany` with existing companies
- [ ] Test `findOrCreateCompany` with new companies
- [ ] Test company-qualification association

### Integration Tests

- [ ] Test end-to-end: qualify job → company appears in feed
- [ ] Test multiple clients qualifying same company
- [ ] Test RLS policies prevent cross-client access

### Manual Testing

- [ ] Verify companies feed shows only qualified companies
- [ ] Verify company created when job qualified
- [ ] Verify company still accessible after job updates

---

## 🎯 Success Criteria

**Implementation is successful when**:

1. ✅ Clients only see companies they've qualified
2. ✅ Companies created automatically when jobs qualified
3. ✅ No cross-client data leakage
4. ✅ Performance <2 seconds load time
5. ✅ Multiple clients can access same global company independently
6. ✅ Company enrichment works seamlessly

---

## 📚 Related Documentation

- [Client-Scoped Job Feed](./client-scoped-job-feed.md)
- [Database Schema](../DATABASE/DATABASE_SCHEMA.md)
- [User Flow](../APP-INFO/USER-FLOW)

---

## ✅ Verification: This IS Best Practice

**Why this approach is industry standard:**

1. **Junction/Association Tables** - Standard pattern for many-to-many relationships
2. **RLS for Security** - PostgreSQL best practice for multi-tenant isolation
3. **Data Deduplication** - Single global company, multiple client associations
4. **Flexibility** - One company can belong to multiple clients
5. **Performance** - Indexed queries, optimized joins
6. **Scalability** - Handles thousands of companies across hundreds of clients

**Used by major SaaS platforms:**

- Salesforce (objects shared across orgs)
- HubSpot (companies with multiple deals/contacts)
- Slack (workspace-member associations)

**Already implemented in your codebase:**

- ✅ `client_jobs` table uses this exact pattern
- ✅ `client_users` table uses this exact pattern
- ✅ Just need to add `client_companies` following same pattern

---

**Last Updated**: January 27, 2025  
**Status**: 📋 Best practice confirmed - ready to implement
