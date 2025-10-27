# Testing Job Qualification → Company Creation Flow

**Date:** October 22, 2025

## How to Test

### Step 1: Check Current State

```sql
-- You should see 0 entries in client_companies
SELECT COUNT(*) FROM client_companies;

-- You should see jobs available
SELECT id, title, company_id FROM jobs LIMIT 5;
```

### Step 2: Qualify a Job in Frontend

1. Go to Jobs page
2. Click "Qualify" on any job
3. Should create entries in both `client_jobs` and `client_companies`

### Step 3: Verify Database

```sql
-- Check client_jobs was created
SELECT
  cj.*,
  j.title as job_title,
  c.name as company_name
FROM client_jobs cj
JOIN jobs j ON cj.job_id = j.id
LEFT JOIN companies c ON j.company_id = c.id
ORDER BY cj.created_at DESC
LIMIT 5;

-- Check client_companies was created
SELECT
  cc.*,
  c.name as company_name
FROM client_companies cc
JOIN companies c ON cc.company_id = c.id
ORDER BY cc.created_at DESC
LIMIT 5;
```

### Step 4: Check Companies Page

1. Go to Companies page
2. Should only show companies you've qualified
3. Should NOT show all 336 companies

---

## Expected Results

### After Qualifying 3 Jobs

**client_jobs table:**

```
┌─────────────┬────────────┬──────────┐
│ client_id  │ job_id     │ status   │
├─────────────┼────────────┼──────────┤
│ your-id    │ job-1      │ qualify  │
│ your-id    │ job-2      │ qualify  │
│ your-id    │ job-3      │ qualify  │
└─────────────┴────────────┴──────────┘
```

**client_companies table:**

```
┌─────────────┬─────────────┬──────────┐
│ client_id  │ company_id  │ status   │
├─────────────┼─────────────┼──────────┤
│ your-id    │ company-1   │ qualify  │
│ your-id    │ company-2   │ qualify  │
│ your-id    │ company-3   │ qualify  │
└─────────────┴─────────────┴──────────┘
```

**Companies page:**

- Shows 3 companies (the ones you qualified)
- NOT 336 companies

---

## Debugging

### If companies page shows 0 companies:

1. Check if `currentClientId` is being fetched
2. Check console for errors
3. Verify `client_companies` entries exist

### If companies page shows all companies:

1. Check the query is using `client_companies!inner`
2. Verify the join is working correctly
3. Check RLS policies allow the user to see their client_companies

### If qualify button doesn't create client_companies:

1. Check browser console for errors
2. Verify `companyId` is being passed
3. Check if upsert is working without errors
