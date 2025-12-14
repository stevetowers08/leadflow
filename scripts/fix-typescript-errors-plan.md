# TypeScript Error Fix Plan

## ✅ Verified: Generated Types Match Database

All 19 tables in generated types exist in database:

- activity*log, campaign_sequence*\_, clients, client\_\_, companies, email_replies, email_sends, jobs, leadflow_leads, leads, people, user_profiles, user_settings, workflows

## ❌ Code References Non-Existent Tables

These tables are used in code but DON'T exist in database:

1. `email_threads` - Used in Conversations.tsx, gmailService.ts
2. `email_messages` - Used in Conversations.tsx, gmailService.ts
3. `email_templates` - Used in secureGmailService.ts
4. `interactions` - Used in multiple components
5. `conversations` - Used in PersonMessagingPanel.tsx

## Fix Strategy

### Phase 1: Update Types (5 min)

- Replace types.ts with generated types from Supabase MCP
- This fixes ~200-300 errors automatically

### Phase 2: Remove/Fix Non-Existent Table References (30 min)

- Comment out or remove code using email_threads, email_messages, email_templates
- Replace with correct tables (email_sends, email_replies, activity_log)
- Or create migration to add missing tables if needed

### Phase 3: Fix Remaining Type Errors (1-2 hours)

- Fix property access errors (TS2339)
- Fix type assignment errors (TS2322)
- Fix overload errors (TS2769)

## Quick Win: Update Types First

This will immediately fix most errors related to existing tables.
