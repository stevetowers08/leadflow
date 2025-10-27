# Companies Architecture Options - Explained

**Date:** October 22, 2025

## The Core Question

Should companies be:

1. **Global/Shared** with a separate `client_companies` table?
2. **Client-Specific** with `client_id` directly on `companies` table?

---

## Real-World Scenario

Let's say **Microsoft** is hiring:

- Client A (Recruiting Agency 1) finds Microsoft job → qualifies it
- Client B (Recruiting Agency 2) finds the SAME Microsoft job → qualifies it

What should happen to the company "Microsoft"?

---

## Option 1: Global Companies + Association Table (Like Jobs)

### Architecture

```
companies table (global/shared)
├── Microsoft (one row)
├── Google (one row)
└── Apple (one row)

client_companies table (links client to company)
├── Client A → Microsoft
├── Client B → Microsoft
└── Client A → Google
```

### What Happens

**Step 1: Client A qualifies Microsoft job**

```sql
-- Company already exists globally
INSERT INTO client_companies (client_id, company_id, qualified_at)
VALUES ('client-a', 'microsoft-id', NOW());
```

**Step 2: Client B qualifies same Microsoft job**

```sql
-- Same company, just link Client B to it
INSERT INTO client_companies (client_id, company_id, qualified_at)
VALUES ('client-b', 'microsoft-id', NOW());  -- Same microsoft-id!
```

### Result

- **Microsoft exists once** (deduplicated)
- **Client A sees Microsoft** (via client_companies)
- **Client B sees Microsoft** (via client_companies)
- **No data duplication**

### Query Example

```typescript
// Get all companies Client A qualified
SELECT companies.*
FROM companies
JOIN client_companies ON companies.id = client_companies.company_id
WHERE client_companies.client_id = 'client-a';
```

---

## Option 2: Client-Specific Companies (Simpler)

### Architecture

```
companies table (client-scoped)
├── Microsoft (owned by Client A)
├── Microsoft (owned by Client B)  ← DUPLICATE!
├── Google (owned by Client A)
└── Apple (owned by Client B)
```

### What Happens

**Step 1: Client A qualifies Microsoft job**

```sql
INSERT INTO companies (name, client_id)
VALUES ('Microsoft', 'client-a');
```

**Step 2: Client B qualifies same Microsoft job**

```sql
INSERT INTO companies (name, client_id)
VALUES ('Microsoft', 'client-b');  -- DUPLICATE ROW!
```

### Result

- **Microsoft exists twice** (duplicated)
- **Client A sees their Microsoft**
- **Client B sees their Microsoft**
- **Data duplication**

### Query Example

```typescript
// Get all companies for Client A (simple!)
SELECT * FROM companies WHERE client_id = 'client-a';
```

---

## Which Should You Use?

### Use Option 1 (Global + Association) IF:

- ✅ Companies are **shared/canonical data** (like jobs)
- ✅ You want **deduplication** (Microsoft once, not per-client)
- ✅ You want **consistency** with how `client_jobs` works
- ✅ Multiple clients will qualify the same companies
- ✅ You want to track company-level data globally (website, industry, etc.)

### Use Option 2 (Client-Specific) IF:

- ✅ Each client's companies are **completely separate**
- ✅ You **don't care about deduplication**
- ✅ Companies are **not shared** between clients
- ✅ You want **simpler queries** (no joins)
- ✅ Each client qualifies independently (never overlap)

---

## Your Use Case

Based on your requirement:

> "i want to make it so companies have no association at the moment, and for the app i can only see the companies ive qualified"

This sounds like you want:

**Option 2: Client-Specific Companies**

### Why?

1. **"no association at the moment"** → No separate `client_companies` table needed
2. **"companies ive qualified"** → Companies are per-client, not shared
3. **Simpler queries** → Just `WHERE client_id = ?`

### Implementation

```sql
-- Add client_id to companies table
ALTER TABLE companies ADD COLUMN client_id UUID REFERENCES clients(id);

-- Query becomes simple
SELECT * FROM companies WHERE client_id = 'client-a';
```

---

## Comparison Table

| Aspect               | Global + Association  | Client-Specific        |
| -------------------- | --------------------- | ---------------------- |
| **Deduplication**    | ✅ Yes                | ❌ No                  |
| **Data Sharing**     | ✅ Companies shared   | ❌ Companies isolated  |
| **Query Complexity** | More complex (JOIN)   | Simple (direct filter) |
| **Consistency**      | Matches `client_jobs` | Different pattern      |
| **Notes Strategy**   | Client-specific       | Client-specific        |
| **Best For**         | Multi-tenant SaaS     | Client-isolated data   |

---

## Recommendation

Based on your requirements, use **Option 2 (Client-Specific)**:

1. Companies table has `client_id` column
2. No `client_companies` table needed
3. Simple filtering: `WHERE client_id = ?`
4. Notes already have `client_id`

### Migration

```sql
-- Add client_id to companies
ALTER TABLE companies ADD COLUMN client_id UUID REFERENCES clients(id);

-- Index for performance
CREATE INDEX idx_companies_client_id ON companies(client_id);

-- Query companies for current client
SELECT * FROM companies WHERE client_id = ?
```

This is **simpler** and matches your requirement of "companies I've qualified".
