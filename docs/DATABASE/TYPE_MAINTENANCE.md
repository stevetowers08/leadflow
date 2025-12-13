# Type Maintenance Best Practices

## Problem Statement

Previously, TypeScript types were **manually maintained**, leading to:

- ❌ Types out of sync with database
- ❌ Build failures when new tables added
- ❌ `as any` workarounds reducing type safety
- ❌ No autocomplete for missing tables

## Solution: Automated Type Generation

We now use **automated type generation** from Supabase schema.

## Current Status

### ✅ Fixed Issues

- Added missing tables: `email_accounts`, `email_sends`, `email_replies`
- Added client tables: `clients`, `client_users`, `client_job_deals`, `client_decision_maker_outreach`
- Created type generation script
- Added npm scripts for type management
- Created documentation

### 📋 Tables Status

**In Database (17):**

- ✅ All 17 tables now have TypeScript types

**Used in Code (6+):**

- ⚠️ Some tables referenced in code may not exist yet:
  - `email_threads`, `email_messages`, `email_templates`, `email_domains`
  - `interactions`, `conversations`
  - These may need migrations or are planned features

## Workflow

### When Adding a New Table

1. **Create migration:**

   ```sql
   -- supabase/migrations/YYYYMMDD_add_table_name.sql
   CREATE TABLE public.table_name (...);
   ```

2. **Apply migration:**

   ```bash
   supabase migration up
   # or via Supabase dashboard
   ```

3. **Generate types:**

   ```bash
   npm run types:generate
   ```

4. **Verify:**

   ```bash
   npm run types:check
   ```

5. **Commit:**
   ```bash
   git add supabase/migrations/ src/integrations/supabase/types.ts
   git commit -m "feat: add table_name table with types"
   ```

### When Modifying a Table

Same workflow as above - always regenerate types after schema changes.

## Preventing Future Issues

### Pre-commit Hook (Recommended)

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
# Generate types before commit
npm run types:generate
npm run types:check
```

### CI/CD Check

Add to your CI pipeline:

```yaml
- name: Verify Types are Current
  run: |
    npm run types:generate
    git diff --exit-code src/integrations/supabase/types.ts || \
      (echo "Types are out of sync! Run: npm run types:generate" && exit 1)
```

## Common Issues

### Issue: Types Out of Sync

**Symptom:** TypeScript errors about missing tables

**Fix:**

```bash
npm run types:generate
```

### Issue: Build Fails with Type Errors

**Symptom:** `Type error: No overload matches this call`

**Fix:**

1. Check if table exists in database
2. Run `npm run types:generate`
3. If table doesn't exist, create migration first

### Issue: Using `as any` Workarounds

**Symptom:** Code has `(supabase.from('table') as any)`

**Fix:**

1. Add table to database (if missing)
2. Run `npm run types:generate`
3. Remove `as any` workaround
4. Verify type safety

## Migration from Manual to Automated

### Before (Manual)

```typescript
// ❌ Had to manually add each table
email_accounts: {
  Row: { ... },
  Insert: { ... },
  Update: { ... }
}
```

### After (Automated)

```bash
# ✅ Just run command after migration
npm run types:generate
```

## Files Changed

- ✅ `src/integrations/supabase/types.ts` - Now includes all database tables
- ✅ `scripts/database/generate-types.ts` - Type generation script
- ✅ `package.json` - Added `types:generate` and `types:check` scripts
- ✅ `docs/DATABASE/TYPE_GENERATION.md` - Complete guide
- ✅ `.gitattributes` - Mark types as generated

## Next Steps

1. ✅ **Immediate:** All missing tables added
2. ✅ **Short-term:** Type generation script created
3. 🔄 **Ongoing:** Run `npm run types:generate` after each migration
4. 📋 **Future:** Set up pre-commit hook for automatic type generation

## Resources

- [Type Generation Guide](./TYPE_GENERATION.md)
- [Database Best Practices](../DATABASE_BEST_PRACTICES.md)
- [Supabase CLI Docs](https://supabase.com/docs/reference/cli)
