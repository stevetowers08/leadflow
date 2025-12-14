# Complete Cleanup Plan: Remove Non-PDR Tables & Code

## PDR Tables (KEEP)

According to `docs/PDR`, these are the ONLY tables that should exist:

1. ✅ `leads` - Main lead table
2. ✅ `workflows` - Email automation
3. ✅ `activity_log` - Activity tracking
4. ✅ `user_profiles` - Authentication
5. ✅ `user_settings` - User preferences

## Tables to Remove from Database

### Recruitment Tables

- ❌ `jobs`
- ❌ `client_job_deals`
- ❌ `client_decision_maker_outreach`

### Multi-Tenant Tables (Not in PDR)

- ❌ `clients`
- ❌ `client_users`

### Legacy/Duplicate Tables

- ❌ `people` (legacy, use `leads`)
- ❌ `leadflow_leads` (duplicate of `leads`)

### Campaign Tables (Not in PDR - PDR uses `workflows`)

- ❌ `campaign_sequences`
- ❌ `campaign_sequence_steps`
- ❌ `campaign_sequence_leads`
- ❌ `campaign_sequence_executions`

### Other Tables (Need Review)

- ⚠️ `companies` - Not explicitly in PDR schema, but might be needed for enrichment
- ⚠️ `email_sends` - Not explicitly in PDR, but needed for workflow tracking
- ⚠️ `email_replies` - Not explicitly in PDR, but needed for reply detection

## Migration Steps

1. **Apply Database Migration**

   ```bash
   # Review migration file
   supabase/migrations/20250220000000_remove_non_pdr_tables.sql

   # Apply via Supabase dashboard or CLI
   ```

2. **Remove Code References**
   - Remove all imports/references to removed tables
   - Update services to use PDR tables only
   - Remove recruitment-related components

3. **Update TypeScript Types**

   ```bash
   npm run types:generate
   ```

4. **Test & Verify**
   ```bash
   npm run type-check
   npm run build
   ```

## Files to Update

### Services

- `src/services/clientRegistrationService.ts` - Remove clients references
- `src/services/enhancedDataService.ts` - Remove jobs references
- `src/hooks/useEnhancedServices.ts` - Remove useJobsService
- `src/hooks/useNotificationTriggers.ts` - Remove client_users references

### Hooks

- `src/hooks/useSupabaseData.ts` - Remove jobs_count
- `src/hooks/useRealtimeSubscriptions.ts` - Remove JOBS
- `src/hooks/useOptimizedAssignment.ts` - Remove jobs entity type
- `src/hooks/useAssignmentState.ts` - Remove jobs queries
- `src/hooks/useDatabaseDropdowns.ts` - Remove useJobStatusDropdown
- `src/hooks/useCompanies.ts` - Remove jobs_count

### Components

- Search for components using removed tables
- Update to use PDR tables only

## Next Steps

1. Review migration file
2. Apply migration to database
3. Remove code references
4. Regenerate types
5. Test application
