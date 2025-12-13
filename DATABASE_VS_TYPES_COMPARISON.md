# Database vs TypeScript Types Comparison

## Tables in Database (from Supabase MCP)

### ✅ Tables in BOTH Database AND Types (13)

1. `activity_log` ✅
2. `campaign_sequence_executions` ✅
3. `campaign_sequence_leads` ✅
4. `campaign_sequence_steps` ✅
5. `campaign_sequences` ✅
6. `companies` ✅
7. `jobs` ✅
8. `leadflow_leads` ✅
9. `leads` ✅
10. `people` ✅
11. `user_profiles` ✅
12. `user_settings` ✅
13. `workflows` ✅

### ❌ Tables in Database BUT Missing from Types (4)

1. **`client_job_deals`** - Tracks which jobs each client is actively pursuing
   - Columns: id, client_id, job_id, status, priority, notes, added_by, added_at, updated_at
   - Used in: `dashboardDataService.ts`, `UnifiedStatusDropdown.tsx`

2. **`client_decision_maker_outreach`** - Tracks which decision makers each client is contacting
   - Columns: id, client_id, decision_maker_id, job_id, status, outreach_method, first_contact_at, last_contact_at, next_action_at, notes, created_at, updated_at
   - Not directly used in codebase (yet)

3. **`clients`** - Multi-tenant client organizations using the platform
   - Columns: id, name, company_name, industry, contact_email, contact_phone, subscription_tier, subscription_status, monthly_budget, settings, is_active, created_at, updated_at
   - Referenced via foreign keys but not directly queried

4. **`client_users`** - Maps users to their client organizations with roles
   - Columns: id, client_id, user_id, role, is_primary_contact, joined_at
   - Used in: `OrganizationContext.tsx`, `useClientId.ts`, `clientRegistrationService.ts`, `UnifiedStatusDropdown.tsx`, `useNotificationTriggers.ts`

### ❓ Tables Used in Code BUT Not in Database (May be in different schema or not yet created)

1. **`email_threads`** - Used in: `Conversations.tsx`, `gmailService.ts`, `PersonMessagingPanel.tsx`, `ActivityTimeline.tsx`
2. **`email_messages`** - Used in: `Conversations.tsx`, `gmailService.ts`, `PersonMessagingPanel.tsx`, `ActivityTimeline.tsx`
3. **`email_templates`** - Used in: `secureGmailService.ts`, `secureGmailServiceFixed.ts`, `gmailService.ts`
4. **`email_domains`** - Used in: `resend-api/route.ts` (with `as any` workaround)
5. **`interactions`** - Used in: `PersonDetailsSlideOut.tsx`, `CompanyDetailsSlideOut.tsx`, `gmailService.ts`, `useNotificationTriggers.ts`, `RecentActivityButton.tsx`
6. **`conversations`** - Used in: `PersonMessagingPanel.tsx`, `ActivityTimeline.tsx`, `conversationService.ts` (commented out)

### ✅ Recently Added to Types (3)

1. **`email_accounts`** ✅ - Just added
2. **`email_sends`** ✅ - Just added
3. **`email_replies`** ✅ - Just added

## Summary Statistics

- **Total tables in database**: 17
- **Tables in TypeScript types**: 16 (13 original + 3 recently added)
- **Missing from types**: 4 confirmed in database
- **Used in code but not in database**: 6 (may need to check if they exist or are planned)

## Priority Fix List

### High Priority (In Database, Used in Code)

1. **`client_users`** - Actively used, missing from types
2. **`client_job_deals`** - Actively used, missing from types

### Medium Priority (In Database, Not Yet Used)

3. **`clients`** - Exists in DB, referenced via FKs
4. **`client_decision_maker_outreach`** - Exists in DB, not yet used

### Low Priority (Used in Code, Need to Verify Existence)

5. **`email_threads`** - Check if exists or needs migration
6. **`email_messages`** - Check if exists or needs migration
7. **`email_templates`** - Check if exists or needs migration
8. **`email_domains`** - Check if exists or needs migration
9. **`interactions`** - Check if exists or needs migration
10. **`conversations`** - Check if exists or needs migration

## Action Items

1. **Immediate**: Add `client_users` and `client_job_deals` to types
2. **This Week**: Verify existence of email/interaction tables, add if they exist
3. **This Month**: Set up automated type generation from Supabase schema
