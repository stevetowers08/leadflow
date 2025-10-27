# PDR: Client-Scoped Job Feed System

**Product Requirements Document**  
**Version**: 1.0  
**Date**: January 27, 2025  
**Status**: ✅ **COMPLETE**

---

## 📋 Overview

Implement a multi-tenant job feed system where all jobs are scraped into a global table, but each client only sees jobs that match their custom filter configurations. This ensures clients focus on relevant opportunities while maintaining a shared job database.

---

## 🎯 Objectives

### Primary Goals

- **Centralized Job Database**: All scraped jobs stored in one shared `jobs` table
- **Client-Specific Filtering**: Each client sees only jobs matching their `job_filter_configs`
- **Automatic Job Assignment**: When new jobs are scraped, auto-assign to matching clients via `client_jobs` table
- **Data Isolation**: Clients never see jobs outside their filter criteria

### Success Metrics

- **Filter Accuracy**: 100% of jobs shown match client's filter config
- **Performance**: Job feed loads in <2 seconds
- **Scalability**: Support 100+ concurrent clients
- **Coverage**: Jobs assigned to relevant clients within 5 minutes of scraping

---

## 🏗️ Architecture

### Current State

```
Job Scraping
    ↓
jobs table (global, all jobs)
    ↓
Users see ALL jobs
    ↓
Runtime filtering in frontend (applyJobFilters)
    ↓
Shows subset of jobs
```

### Target State

```
Job Scraping
    ↓
jobs table (global, all jobs)
    ↓
Auto-Assignment Engine
    ↓
Check each job against ALL client filter configs
    ↓
For each match: INSERT INTO client_jobs (client_id, job_id, status='new')
    ↓
User only sees jobs in their client_jobs table
```

---

## 📊 Data Flow

### 1. Job Scraping (Existing)

**Source**: LinkedIn, Indeed, etc. (n8n workflows)  
**Target**: `jobs` table

```typescript
// When job is scraped from LinkedIn
{
  id: "uuid",
  title: "Senior Account Executive",
  company_id: "company-uuid",
  location: "San Francisco, CA",
  description: "...",
  posted_date: "2025-01-27",
  // ... other fields
}
```

### 2. Auto-Assignment (NEW)

**Trigger**: After job inserted into `jobs` table  
**Process**: Check all active filter configs

```typescript
// Pseudo-code for auto-assignment
async function assignJobToClients(jobId: string) {
  // 1. Get the new job
  const job = await getJob(jobId);

  // 2. Get all active filter configs
  const configs = await supabase
    .from('job_filter_configs')
    .select('*')
    .eq('is_active', true);

  // 3. For each config, check if job matches
  for (const config of configs) {
    if (matchesFilterConfig(job, config)) {
      // 4. Create client_jobs entry
      await supabase.from('client_jobs').insert({
        client_id: config.client_id,
        job_id: jobId,
        status: 'new',
        created_at: new Date().toISOString(),
      });
    }
  }
}
```

### 3. Job Display (MODIFIED)

**Current Query**:

```typescript
// Shows ALL jobs, filters in frontend
const { data: jobs } = await supabase
  .from('jobs')
  .select('*')
  .order('created_at', { ascending: false });
```

**New Query**:

```typescript
// Shows ONLY jobs assigned to this client
const { data: jobs } = await supabase
  .from('jobs')
  .select(
    `
    *,
    companies!inner(id, name, website, industry),
    client_jobs!inner(status, qualified_at)
  `
  )
  .eq('client_jobs.client_id', clientId)
  .order('created_at', { ascending: false });
```

---

## 🗄️ Database Schema

### Existing Tables

#### **jobs** (Global Job Database)

- Contains ALL scraped jobs
- Shared across all clients
- No client-specific data

#### **job_filter_configs** (Client Filter Configs)

- One per client
- Defines what types of jobs client wants to see
- Fields: location, job_titles, keywords, industries, etc.

#### **client_jobs** (NEW - Job Assignment Table)

- Links jobs to clients
- Created when job matches client's filters
- Tracks qualification status

### New Columns Needed

```sql
-- Add to client_jobs table (if doesn't exist)
ALTER TABLE client_jobs ADD COLUMN IF NOT EXISTS auto_assigned BOOLEAN DEFAULT true;
ALTER TABLE client_jobs ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP DEFAULT now();
```

---

## 🔧 Implementation Components

### 1. Auto-Assignment Edge Function

**Location**: `supabase/functions/auto-assign-jobs-to-clients`

**Trigger**: After job inserted in `jobs` table

**Logic**:

```typescript
// Edge function: auto-assign-jobs-to-clients/index.ts

export default async function handleJobCreated(req) {
  const { new: job } = req.body;

  // Get all active filter configs
  const { data: configs } = await supabase
    .from('job_filter_configs')
    .select('*')
    .eq('is_active', true);

  // Check each config
  for (const config of configs) {
    if (matchesFilter(job, config)) {
      await supabase.from('client_jobs').insert({
        client_id: config.client_id,
        job_id: job.id,
        status: 'new',
        auto_assigned: true,
        assigned_at: new Date().toISOString(),
      });
    }
  }
}
```

### 2. Modified Jobs Query

**Location**: `src/pages/Jobs.tsx`

**Current**:

```typescript:260:308:src/pages/Jobs.tsx
const [jobsResult, usersResult, filterConfigResult] = await Promise.all([
  supabase
    .from('jobs')
    .select(`*`)
    .order('created_at', { ascending: false }),
  // ...
]);

// Apply client's job filter config if available
if (filterConfigResult.data) {
  allJobs = allJobs.filter(job => applyJobFilters(job, filterConfig));
}
```

**New**:

```typescript
const { data: jobs } = await supabase
  .from('jobs')
  .select(
    `
    *,
    companies!inner(id, name, website, industry),
    client_jobs!inner(status, qualified_at, auto_assigned)
  `
  )
  .eq('client_jobs.client_id', clientId)
  .order('client_jobs.created_at', { ascending: false });
```

### 3. Database Trigger (Alternative)

**Option**: Use Supabase database trigger instead of edge function

```sql
-- Trigger function
CREATE OR REPLACE FUNCTION auto_assign_job_to_clients()
RETURNS TRIGGER AS $$
DECLARE
  config RECORD;
  job_data RECORD;
BEGIN
  -- Get the inserted job
  SELECT * INTO job_data FROM jobs WHERE id = NEW.id;

  -- Loop through all active configs
  FOR config IN
    SELECT * FROM job_filter_configs WHERE is_active = true
  LOOP
    -- Check if job matches filter (psuedo-code)
    IF matches_filter(job_data, config) THEN
      INSERT INTO client_jobs (client_id, job_id, status, auto_assigned)
      VALUES (config.client_id, NEW.id, 'new', true)
      ON CONFLICT (client_id, job_id) DO NOTHING;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER on_job_inserted
AFTER INSERT ON jobs
FOR EACH ROW
EXECUTE FUNCTION auto_assign_job_to_clients();
```

---

## 📅 Implementation Phases

### Phase 1: Database Setup (Week 1)

- [ ] Add `auto_assigned` column to `client_jobs`
- [ ] Create RLS policies for `client_jobs`
- [ ] Create indexes for performance
- [ ] Test with sample data

**Files**:

- `supabase/migrations/YYYYMMDD_client_scoped_jobs.sql`

### Phase 2: Auto-Assignment Logic (Week 2)

- [ ] Create edge function or database trigger
- [ ] Implement `matchesFilterConfig` function
- [ ] Test with real job data
- [ ] Monitor performance

**Files**:

- `supabase/functions/auto-assign-jobs/index.ts` OR
- `supabase/migrations/YYYYMMDD_auto_assign_trigger.sql`

### Phase 3: Frontend Updates (Week 3)

- [ ] Modify Jobs.tsx query to use `client_jobs`
- [ ] Update job fetching logic
- [ ] Update job card components
- [ ] Remove runtime filtering (no longer needed)

**Files**:

- `src/pages/Jobs.tsx`
- `src/services/jobsService.ts`

### Phase 4: Migration & Backfill (Week 4)

- [ ] Create migration script to backfill existing jobs
- [ ] Test with production data
- [ ] Deploy to production
- [ ] Monitor for issues

**Files**:

- `supabase/migrations/YYYYMMDD_backfill_client_jobs.sql`
- `scripts/backfill-client-jobs.ts`

---

## 🔄 Migration Strategy

### Backfill Existing Jobs

**Challenge**: We have 338 existing jobs that need to be assigned to clients

**Solution**:

```sql
-- Migration script to backfill client_jobs
INSERT INTO client_jobs (client_id, job_id, status, auto_assigned)
SELECT
  config.client_id,
  job.id as job_id,
  'new' as status,
  true as auto_assigned
FROM jobs job
CROSS JOIN job_filter_configs config
WHERE config.is_active = true
  AND applyJobFilters(job, config) = true
ON CONFLICT (client_id, job_id) DO NOTHING;
```

**Note**: We'll need to implement `applyJobFilters` as a PostgreSQL function for this migration.

---

## ⚠️ Edge Cases & Considerations

### 1. Multiple Configs Per Client

**Scenario**: Client has multiple active filter configs

**Solution**: Job assigned to client if it matches ANY config

**Implementation**:

```sql
-- Check all configs for client
SELECT EXISTS (
  SELECT 1 FROM job_filter_configs
  WHERE client_id = $client_id
    AND is_active = true
    AND matches_filter(job, config)
)
```

### 2. Filter Config Changes

**Scenario**: Client updates filter config, wants to re-run on existing jobs

**Solution**: Add "Re-run Filters" button that:

1. Deletes all `client_jobs` for this client
2. Re-runs auto-assignment on all jobs
3. Shows progress bar

### 3. Job Updates

**Scenario**: Job details change after assignment

**Solution**: Trigger re-evaluation of job assignments

```sql
-- When job updated
CREATE TRIGGER on_job_updated
AFTER UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION re_evaluate_job_assignments();
```

### 4. Performance at Scale

**Concern**: With 100+ clients and 1000s of jobs, auto-assignment could be slow

**Solution**:

- Use database indexes
- Batch process in background
- Cache filter configs
- Async processing via queue

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] Test `matchesFilterConfig` function
- [ ] Test auto-assignment with various configs
- [ ] Test edge cases (no matches, all matches)

### Integration Tests

- [ ] Test end-to-end: scrape job → auto-assign → display in feed
- [ ] Test filter config changes
- [ ] Test performance with large datasets

### Manual Testing

- [ ] Test with existing filter config
- [ ] Verify jobs only shown to matching clients
- [ ] Test qualification workflow still works

---

## 📊 Rollout Plan

### Week 1: Setup & Testing

- Deploy to development environment
- Test with real data
- Fix bugs

### Week 2: Staged Rollout

- Deploy to staging
- Test with small user group
- Monitor performance

### Week 3: Production

- Deploy to production
- Monitor errors and performance
- Gather user feedback

### Week 4: Optimization

- Address performance issues
- Fine-tune filter matching
- Document learnings

---

## 🎯 Success Criteria

**Implementation is successful when**:

1. ✅ Client A with "Sales" filter only sees sales jobs
2. ✅ Client B with "Engineering" filter only sees engineering jobs
3. ✅ New jobs automatically assigned within 5 minutes
4. ✅ No jobs shown outside filter criteria
5. ✅ Performance <2 seconds load time
6. ✅ Zero data leaks between clients

---

## 📚 Related Documentation

- [Job Filtering Analysis](../JOB-FILTERING-ANALYSIS.md)
- [Database Schema](../DATABASE/DATABASE_SCHEMA.md)
- [User Flow](../APP-INFO/USER-FLOW)

---

## 👥 Stakeholders

**Product Owner**: [To be assigned]  
**Engineering Lead**: [To be assigned]  
**QA Lead**: [To be assigned]

---

**Last Updated**: January 27, 2025  
**Status**: 📋 Awaiting approval to proceed
