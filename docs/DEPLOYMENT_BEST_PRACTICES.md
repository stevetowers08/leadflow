# Deployment Best Practices (2025)

## Problem: Iterative Fix-Deploy-Fail Cycle

Previously, we were making small fixes, deploying to Vercel, seeing failures, then fixing again. This is inefficient and wastes time.

## Solution: Comprehensive Pre-Deployment Validation

### New Workflow

**Before deploying, always run:**

```bash
npm run pre-deploy
```

This script runs:

1. ✅ **TypeScript Type Checking** - Catches all type errors
2. ✅ **ESLint Code Quality** - Catches linting issues
3. ✅ **Common Issues Check** - Detects:
   - References to non-existent tables (`email_sync_logs`, `error_logs`, `email_domains`)
   - References to deprecated `people` table (should use `leads`)
   - Excessive use of `any` types
4. ✅ **Local Build** - Simulates exact Vercel build process

**Only deploy if all checks pass!**

### Deployment Commands

```bash
# Run pre-deployment checks (recommended)
npm run pre-deploy

# Deploy to Vercel (includes pre-deploy check)
npm run deploy

# Or deploy directly (if you're confident)
vercel --prod
```

## Best Practices (2025)

### 1. **Always Test Locally First**

- Run `npm run build` locally before deploying
- Fix errors locally, not on Vercel
- Use `npm run pre-deploy` for comprehensive validation

### 2. **Fix All TypeScript Errors**

- TypeScript errors will block builds
- Run `npm run type-check` before building
- Never use `ignoreBuildErrors: true` in production

### 3. **Check for Schema Mismatches**

- Verify table names match Supabase schema
- Check column names (`email_address` vs `email`, `stage` vs `status`)
- Use Supabase MCP to verify schema before coding

### 4. **Handle Json Types Correctly**

- Use `as unknown as Json` for metadata casting
- Never use `Record<string, unknown>` directly for Supabase `jsonb` columns
- Import `Json` type from `@/integrations/supabase/types`

### 5. **Monitor Build Logs**

- Check Vercel build logs for specific errors
- Fix root causes, not symptoms
- Use `mcp_vercel_get_deployment_build_logs` to see detailed errors

## Common Issues & Fixes

### Issue: `Type error: No overload matches this call`

**Cause:** Json type mismatch in Supabase inserts
**Fix:** Use `as unknown as Json` for metadata fields

### Issue: `column 'X' does not exist on 'Y'`

**Cause:** Schema mismatch - table/column names changed
**Fix:**

1. Check Supabase schema using MCP
2. Update all references to match current schema
3. Use `leads` table instead of `people`

### Issue: `Table 'X' does not exist`

**Cause:** References to removed/non-existent tables
**Fix:**

- Replace `email_sync_logs` → `activity_log`
- Replace `error_logs` → `activity_log`
- Remove `email_domains` references

## Pre-Deployment Checklist

- [ ] Run `npm run type-check` - No errors
- [ ] Run `npm run lint` - No critical errors
- [ ] Run `npm run build` - Build succeeds
- [ ] Check for `people` table references (should use `leads`)
- [ ] Check for non-existent table references
- [ ] Verify Json type casting is correct
- [ ] Test critical API routes locally
- [ ] Check environment variables are set in Vercel

## Quick Reference

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build (simulates Vercel)
npm run build

# Full pre-deployment check
npm run pre-deploy

# Deploy (with pre-check)
npm run deploy
```

## Why This Approach Works

1. **Catches errors early** - Before wasting time on Vercel
2. **Fixes all issues at once** - No iterative cycle
3. **Simulates production** - Local build matches Vercel exactly
4. **Comprehensive validation** - Checks types, linting, schema, and build
5. **Faster feedback** - See all errors immediately

## Next Steps

After implementing this workflow:

1. Always run `npm run pre-deploy` before deploying
2. Fix all errors locally
3. Only deploy when all checks pass
4. Monitor Vercel build logs for any edge cases
