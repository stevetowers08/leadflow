# Campaign Sequences Table Error Fix

## 🐛 Issue
Console error: `"Could not find the table 'public.campaign_sequences' in the schema cache"`

This error occurs when:
- The migration for `campaign_sequences` table hasn't been run
- RLS policies are blocking access
- The table doesn't exist in the database

## ✅ Fix Applied

### 1. **PersonDetailsSlideOut.tsx**
- Added error handling for missing table
- Checks for "schema cache" or "does not exist" errors
- Sets empty array instead of breaking UI
- Only logs non-table-missing errors

### 2. **CompanyDetailsSlideOut.tsx**
- Applied same error handling pattern
- Graceful degradation when table doesn't exist

### 3. **Error Handling Pattern**
```typescript
if (error) {
  // Check if table doesn't exist
  if (error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
    console.warn('[Component] campaign_sequences table not found. Migration may not have been run.');
    setCampaigns([]);
    return;
  }
  throw error;
}
```

## 📋 Migration Status

The table should exist if migration `20251022000008_create_campaign_sequences.sql` has been run.

To check if migration is needed:
1. Check Supabase dashboard → Database → Tables
2. Look for `campaign_sequences` table
3. If missing, run the migration

## 🔍 Files Modified

1. `src/components/slide-out/PersonDetailsSlideOut.tsx`
   - Fixed `fetchCampaigns` function
   - Fixed enrolled campaigns query

2. `src/components/slide-out/CompanyDetailsSlideOut.tsx`
   - Fixed `fetchCampaigns` function

## ✅ Result

- No more console errors breaking the UI
- Components gracefully handle missing tables
- Campaign features are hidden when table doesn't exist
- Clear warning messages for debugging

## 🚀 Next Steps

If you want to use campaign features:
1. Run migration: `supabase/migrations/20251022000008_create_campaign_sequences.sql`
2. Verify table exists in Supabase dashboard
3. Check RLS policies are set correctly

