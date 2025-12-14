# TypeScript Error Fix Strategy

## Error Breakdown

- **TS2339** (145): Property does not exist - Database schema mismatches
- **TS2322** (104): Type not assignable - Type mismatches
- **TS2769** (78): No overload matches - Supabase API calls
- **TS2345** (67): Argument type issues
- **TS2304** (47): Cannot find name

## Root Causes (From Old → New App Migration)

1. **Database Schema Mismatch** - Types don't match actual Supabase schema
2. **Table Name Changes** - `people` → `leads`, old tables removed
3. **Missing Type Definitions** - Tables used but not in types.ts
4. **RPC Functions** - Missing from type definitions

## Systematic Fix Approach

### Phase 1: Generate Types from Database (AUTOMATED) ⚡

```bash
# Generate types from Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

### Phase 2: Fix Common Patterns (BULK) ⚡

1. **Replace `people` with `leads`** (if PDR says use leads)
2. **Add missing table types** (email_threads, email_messages, etc.)
3. **Fix import paths** (./useRealtimeSubscriptions → @/hooks/...)
4. **Add RPC function types**

### Phase 3: Type Assertions (TEMPORARY)

Use type assertions for migration period:

```typescript
const data = result.data as ExpectedType;
```

### Phase 4: Individual Fixes

Only after bulk fixes, handle remaining edge cases
