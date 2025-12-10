# Database Migration Notes - LeadFlow PDR Schema

## Migration Created
`supabase/migrations/20250127000000_leadflow_pdr_schema.sql`

## What This Migration Does

### 1. Profiles Table
- Creates `profiles` table for storing encrypted API keys
- Links to `auth.users` via `id`
- Stores: `lemlist_api_key`, `gmail_access_token`, `gmail_refresh_token`
- RLS policies: Users can only access their own profile

### 2. Leads Table
- **Smart Migration**: Checks if `leads` table exists
  - If exists: Adds missing PDR columns to existing table
  - If not: Creates new table per PDR specs
- **PDR Required Fields**:
  - `first_name`, `last_name`, `email`, `company`, `job_title`
  - `scan_image_url` (business card image)
  - `quality_rank` ('hot', 'warm', 'cold')
  - `ai_summary`, `ai_icebreaker` (AI enrichment data)
  - `status` ('processing', 'active', 'replied_manual')
  - `gmail_thread_id` (for 2-way sync)
- **Name Migration**: If existing `leads` table has `name` column, splits it into `first_name` and `last_name`

### 3. Emails Table
- Creates `emails` table for inbox view
- Stores Gmail message data
- Links to `leads` via `lead_id`
- Fields: `id` (Gmail Message ID), `thread_id`, `direction`, `snippet`, `body_html`, `sent_at`
- RLS policies: Users can only see emails for their leads

### 4. Indexes
- Performance indexes on frequently queried columns
- `leads`: user_id, status, quality_rank, email, gmail_thread_id
- `emails`: lead_id, thread_id, sent_at

### 5. RLS (Row Level Security)
- All tables have RLS enabled
- Policies ensure users can only access their own data
- Follows Supabase security best practices

## Migration Strategy

### Existing Data
- If `leads` table exists, migration adds missing columns
- Existing data is preserved
- Name field is split into first_name/last_name if possible

### New Installations
- Creates all tables from scratch per PDR specs
- No data migration needed

## Running the Migration

### Local Development
```bash
# Using Supabase CLI
supabase migration up

# Or apply directly
psql -h localhost -U postgres -d postgres -f supabase/migrations/20250127000000_leadflow_pdr_schema.sql
```

### Production
- Apply via Supabase Dashboard → Database → Migrations
- Or use Supabase CLI: `supabase db push`

## Verification

After migration, verify:
1. `profiles` table exists with correct columns
2. `leads` table has all PDR-required columns
3. `emails` table exists
4. RLS policies are active
5. Indexes are created
6. Triggers work (updated_at auto-update)

## Notes

- Migration is idempotent (safe to run multiple times)
- Uses `IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS` for safety
- Preserves existing data when possible
- Follows PDR Section 7 requirements exactly

## Next Steps

1. Run migration in development
2. Test with sample data
3. Update TypeScript types in `src/types/database.ts`
4. Update services to use new schema
5. Test RLS policies
6. Deploy to production

