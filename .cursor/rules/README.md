# Cursor Rules Configuration

✅ **Status:** All rules configured and ready to use

## Available Rules

### Always Active (2 rules)

- `project-overview.mdc` - Project overview and workflows
- `tech-stack.mdc` - Dependencies and frameworks

### Auto-Attached by File Type (3 rules)

- `coding-standards.mdc` - Triggers on: `**/*.ts`, `**/*.tsx`
- `database.mdc` - Triggers on: `**/services/**`, `**/utils/databaseQueries.ts`, `**/integrations/supabase/**`
- `ui-components.mdc` - Triggers on: `**/components/**`, `**/pages/**`
- `services-and-api.mdc` - Triggers on: `**/services/**`, `**/hooks/*.ts`

### Manual Only (2 rules)

- `project-structure.mdc` - Use with `@project-structure`
- `workflows.mdc` - Use with `@workflows`

## How to Use

### Automatic Rules

When you open/edit files, rules automatically attach based on file paths:

- Edit `src/services/jobsService.ts` → Gets `coding-standards`, `database`, `services-and-api`
- Edit `src/components/ui/button.tsx` → Gets `coding-standards`, `ui-components`
- Edit `src/pages/Dashboard.tsx` → Gets `coding-standards`, `ui-components`

### Manual Rules

Type `@` in Cursor chat to mention specific rules:

- `@database` - Database patterns and RLS
- `@coding-standards` - Coding standards
- `@ui-components` - UI guidelines
- `@project-structure` - Project structure
- `@workflows` - Workflow commands

## Updating Rules

### To change globs:

1. Open any `.mdc` file in this directory
2. Edit the `globs:` line in the frontmatter
3. Save the file
4. Rule will apply on next file open

### Example:

```yaml
# Before
globs: ['**/services/**']

# After - Also include contexts
globs: ['**/services/**', '**/contexts/**']
```

## Files Location

- Rules directory: `.cursor/rules/`
- Old format (still works): `.cursorrules` (root directory)

## Documentation

- See individual `.mdc` files for detailed content
- Each file contains specific guidelines for that domain
