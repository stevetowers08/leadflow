---
owner: dev-team
last-reviewed: 2025-01-27
status: final
product-area: core
---

# Coding Standards

**Last Updated:** January 2025

## TypeScript

### Strict Mode

Always use TypeScript strict mode. Configured in `tsconfig.json`.

### Type Definitions

```typescript
// ✅ Good: Explicit interfaces
interface PersonCardProps {
  person: Person;
  onSelect: (id: string) => void;
}

// ❌ Bad: Using any
function process(data: any) { ... }
```

### Avoid `any`

Use proper types or `unknown` when necessary:

```typescript
// ✅ Good
function process<T>(data: T): T { ... }

// ❌ Bad
function process(data: any) { ... }
```

## React

### Functional Components

Always use functional components with hooks:

```typescript
// ✅ Good
export const PersonCard: React.FC<PersonCardProps> = ({ person, onSelect }) => {
  return <div>...</div>;
};

// ❌ Bad
export class PersonCard extends React.Component { ... }
```

### Hooks

- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed to children
- Use `React.memo` for components that receive same props frequently

```typescript
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processed = useMemo(() => heavyProcessing(data), [data]);
  const handleClick = useCallback(() => doSomething(), []);
});
```

## Naming Conventions

- **Components**: PascalCase (`PersonCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useBulkSelection.ts`)
- **Utilities**: camelCase (`statusUtils.ts`)
- **Services**: camelCase (`jobsService.ts`)
- **Types**: PascalCase (`Job`, `Person`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Props**: `ComponentNameProps` (`PersonCardProps`)

## Database Access

### Always Use Service Functions

```typescript
// ✅ Good
import { getJobs } from '@/services/jobsService';
const jobs = await getJobs({ status: 'new' });

// ❌ Bad: Direct Supabase queries in components
const { data } = await supabase.from('jobs').select('*');
```

### Type-Safe Queries

Use type-safe utilities from `src/utils/databaseQueries.ts`:

```typescript
import { DatabaseQueries } from '@/utils/databaseQueries';
const person = await DatabaseQueries.getEntity<Person>('people', id);
```

### RLS Policies

- Always enforce RLS - never bypass security
- Query only needed fields, avoid `SELECT *`
- Use authenticated queries only

## Status Handling

### Use Status Utilities

```typescript
import { getStatusDisplayText, normalizePeopleStage } from '@/utils/statusUtils';

const displayText = getStatusDisplayText('new_lead'); // "New Lead"
const normalized = normalizePeopleStage('NEW'); // "new_lead"
```

### Enum Values

Always use enum values, never create custom statuses:

```typescript
// ✅ Good
.eq('qualification_status', 'qualify')

// ❌ Bad
.eq('qualification_status', 'qualified') // Wrong enum value
```

## File Organization

```
src/
├── components/     # React components
├── services/        # API services
├── hooks/           # Custom hooks
├── utils/           # Utilities
├── types/           # TypeScript types
└── contexts/        # React contexts
```

## Code Quality

### Functions

- Keep functions under 20 lines when possible
- Single responsibility principle
- Clear, descriptive names

### Error Handling

```typescript
// ✅ Good: Explicit error handling
try {
  const result = await someOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return { success: false, error: error.message };
}

// ❌ Bad: Ignoring errors
const result = await someOperation(); // No error handling
```

## Best Practices

1. **Follow DRY** - Don't repeat yourself
2. **Keep it simple** - Avoid over-engineering
3. **Write self-documenting code** - Clear names over comments
4. **Test your changes** - Run `npm run type-check` before committing
5. **Use existing patterns** - Don't reinvent the wheel

---

**Related Docs:**
- [Local Development](local-development.md) - Development workflow
- [Project Structure](../01-overview/project-structure.md) - File organization

