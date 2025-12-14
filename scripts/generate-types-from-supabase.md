# Generate Types from Supabase

## Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Generate types
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

## Option 2: Using Supabase MCP (If configured)

The Supabase MCP server can generate types programmatically.

## Option 3: Manual Type Addition

For missing tables, add them to `src/integrations/supabase/types.ts`:

```typescript
email_threads: {
  Row: {
    id: string;
    thread_id: string;
    lead_id: string | null;
    // ... other columns
  }
  Insert: {
    /* ... */
  }
  Update: {
    /* ... */
  }
}
```

## Missing Tables to Add

Based on codebase analysis:

- `email_threads`
- `email_messages`
- `email_templates`
- `interactions`
- `conversations`
- `client_users`
- `client_jobs`
- `client_companies`
