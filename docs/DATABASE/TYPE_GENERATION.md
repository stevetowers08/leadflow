# TypeScript Type Generation Guide

## Overview

This project uses **automated type generation** from the Supabase database schema to keep TypeScript types in sync with the actual database structure.

## Quick Start

### Generate Types

```bash
# Generate types from Supabase schema
npm run types:generate

# Check for type errors after generation
npm run types:check
```

## When to Generate Types

**Always generate types after:**
1. ✅ Creating a new table
2. ✅ Adding/modifying columns
3. ✅ Running database migrations
4. ✅ Before deploying to production

## Methods

### Method 1: Supabase CLI (Recommended)

```bash
# Install Supabase CLI globally
npm install -g supabase

# Generate types
npm run types:generate
```

This uses the `supabase gen types typescript` command which reads from your local Supabase instance or remote project.

### Method 2: Supabase MCP Server

If you have the Supabase MCP server configured, you can use it to:
- List all tables
- Get table schemas
- Generate types programmatically

### Method 3: Manual (Not Recommended)

Only use manual type updates for:
- Quick fixes during development
- Temporary workarounds
- When CLI is unavailable

**Always regenerate types after manual changes!**

## Type File Location

Types are generated to:
```
src/integrations/supabase/types.ts
```

## Workflow

### Development Workflow

1. **Create migration** → `supabase/migrations/YYYYMMDD_description.sql`
2. **Apply migration** → `supabase migration up` (or via Supabase dashboard)
3. **Generate types** → `npm run types:generate`
4. **Verify types** → `npm run types:check`
5. **Commit changes** → Include both migration and types file

### CI/CD Integration

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Generate Types
  run: npm run types:generate
  
- name: Check Types
  run: npm run types:check
```

## Troubleshooting

### Types Out of Sync

**Symptoms:**
- TypeScript errors about missing tables
- `as any` workarounds in code
- Build failures

**Solution:**
```bash
npm run types:generate
```

### Supabase CLI Not Found

**Error:** `supabase: command not found`

**Solution:**
```bash
npm install -g supabase
```

Or use the Supabase MCP server for type generation.

### Type Generation Fails

**Check:**
1. Supabase is running locally (if using `--local`)
2. Database connection is configured
3. Migrations are up to date

## Best Practices

1. **Never manually edit types** - Always regenerate from schema
2. **Commit types file** - Keep it in version control
3. **Generate before PR** - Ensure types are current
4. **Document custom types** - If you need additional type definitions, add them in separate files
5. **Review generated types** - Check for any unexpected changes

## Related Files

- `src/integrations/supabase/types.ts` - Generated types file
- `scripts/database/generate-types.ts` - Type generation script
- `supabase/config.toml` - Supabase configuration
- `supabase/migrations/` - Database migrations

## Migration Checklist

When adding/modifying database schema:

- [ ] Create migration file
- [ ] Apply migration to database
- [ ] Run `npm run types:generate`
- [ ] Run `npm run types:check`
- [ ] Review generated types
- [ ] Update code if needed
- [ ] Test changes
- [ ] Commit migration + types

