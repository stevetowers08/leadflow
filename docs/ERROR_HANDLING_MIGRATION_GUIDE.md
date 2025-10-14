# Enhanced Error Handling Migration Guide

## Overview

This guide helps you migrate from the existing error handling patterns to the new enhanced error handling system that implements 2025 best practices.

## Key Benefits

- **Type Safety**: Result pattern provides compile-time error handling
- **Better UX**: User-friendly error messages with actionable guidance
- **Comprehensive Logging**: Structured error information with context
- **Fault Tolerance**: Circuit breakers and retry mechanisms
- **Consistent Patterns**: Standardized error handling across the app

## Migration Steps

### 1. Update Imports

Replace existing error handling imports:

```typescript
// Old
import { useErrorHandler } from '@/hooks/useErrorHandler';

// New
import { 
  Result, 
  ResultBuilder, 
  isSuccess, 
  isFailure,
  AppError 
} from '@/types/errors';
import { useAsyncOperation } from '@/hooks/useEnhancedAsyncOperation';
import { enhancedErrorHandler } from '@/utils/enhancedErrorHandler';
```

### 2. Service Layer Migration

#### Before (Old Pattern)
```typescript
export class AssignmentService {
  static async assignEntity(entityType: string, entityId: string, newOwnerId: string): Promise<AssignmentResult> {
    try {
      const { data, error } = await supabase
        .from(entityType)
        .update({ owner_id: newOwnerId })
        .eq('id', entityId);

      if (error) {
        return {
          success: false,
          message: 'Assignment failed',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Assignment successful',
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Assignment failed',
        error: error.message
      };
    }
  }
}
```

#### After (New Pattern)
```typescript
import { EnhancedAssignmentService } from '@/services/enhancedAssignmentService';

// Usage
const result = await EnhancedAssignmentService.assignEntity(
  'people',
  'entity-123',
  'owner-456',
  'current-user'
);

if (isSuccess(result)) {
  console.log('Success:', result.data);
} else {
  console.error('Error:', result.error.userMessage);
}
```

### 3. React Component Migration

#### Before (Old Pattern)
```typescript
function AssignmentComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logError } = useErrorHandler();

  const handleAssignment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AssignmentService.assignEntity('people', '123', '456');
      if (result.success) {
        // Handle success
      } else {
        setError(result.error);
        logError(result.error);
      }
    } catch (err) {
      setError(err.message);
      logError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleAssignment} disabled={loading}>
        {loading ? 'Loading...' : 'Assign'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

#### After (New Pattern)
```typescript
function AssignmentComponent() {
  const {
    data,
    error,
    isLoading,
    execute,
    retry,
    canRetry
  } = useAsyncOperation(
    async (entityId: string, ownerId: string) => {
      const result = await EnhancedAssignmentService.assignEntity(
        'people',
        entityId,
        ownerId,
        'current-user'
      );
      
      if (isSuccess(result)) {
        return result.data;
      } else {
        throw result.error;
      }
    },
    {
      enableRetry: true,
      maxRetries: 3,
      showSuccessToast: true,
      showErrorToast: true
    }
  );

  const handleAssignment = () => {
    execute('entity-123', 'owner-456');
  };

  return (
    <div>
      <button onClick={handleAssignment} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Assign'}
      </button>
      
      {error && (
        <div className="error">
          <p>{error.userMessage}</p>
          {canRetry && (
            <button onClick={() => retry('entity-123', 'owner-456')}>
              Retry
            </button>
          )}
        </div>
      )}
      
      {data && (
        <div className="success">
          {data.message}
        </div>
      )}
    </div>
  );
}
```

### 4. Error Boundary Migration

#### Before (Old Pattern)
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

#### After (New Pattern)
```typescript
import { 
  EnhancedErrorBoundary, 
  FeatureErrorBoundary,
  ErrorBoundaryProvider 
} from '@/components/EnhancedErrorBoundary';

function App() {
  return (
    <ErrorBoundaryProvider>
      <FeatureErrorBoundary feature="Assignment">
        <AssignmentComponent />
      </FeatureErrorBoundary>
      
      <FeatureErrorBoundary feature="Reporting">
        <ReportingComponent />
      </FeatureErrorBoundary>
    </ErrorBoundaryProvider>
  );
}
```

### 5. Data Fetching Migration

#### Before (Old Pattern)
```typescript
function TeamMembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const result = await AssignmentService.getTeamMembers();
        if (result.success) {
          setMembers(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMembers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {members.map(member => (
        <div key={member.id}>{member.full_name}</div>
      ))}
    </div>
  );
}
```

#### After (New Pattern)
```typescript
function TeamMembersList() {
  const {
    data: members,
    error,
    isLoading,
    refetch
  } = useAsyncData(
    async () => {
      const result = await EnhancedAssignmentService.getTeamMembers();
      if (isSuccess(result)) {
        return result.data;
      } else {
        throw result.error;
      }
    },
    {
      autoExecute: true,
      showErrorToast: true
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return (
    <div>
      <p>Error: {error.userMessage}</p>
      <button onClick={refetch}>Retry</button>
    </div>
  );
  
  return (
    <div>
      {members?.map(member => (
        <div key={member.id}>{member.full_name}</div>
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Always Use Result Pattern for Services
```typescript
// Good
const result = await service.method();
if (isSuccess(result)) {
  // Handle success
} else {
  // Handle error with proper typing
}

// Avoid
try {
  const data = await service.method();
  // Handle success
} catch (error) {
  // Handle error
}
```

### 2. Use Appropriate Error Boundaries
```typescript
// App-level boundary for critical errors
<ErrorBoundaryProvider>
  {/* Feature-level boundaries for specific features */}
  <FeatureErrorBoundary feature="Assignment">
    <AssignmentFeature />
  </FeatureErrorBoundary>
</ErrorBoundaryProvider>
```

### 3. Leverage Circuit Breakers for External Services
```typescript
const result = await circuitBreakerManager.executeWithBreaker(
  'external-api',
  async () => {
    return await fetchExternalData();
  },
  'fetch-data'
);
```

### 4. Use Specialized Hooks
```typescript
// For data fetching
const { data, error, isLoading } = useAsyncData(fetchFunction);

// For mutations
const { execute, isLoading, error } = useAsyncMutation(mutationFunction);

// For form submissions
const { execute, isLoading, error } = useFormSubmission(submitFunction);
```

## Common Patterns

### Error Handling in Forms
```typescript
const { execute: submitForm, isLoading, error } = useFormSubmission(
  async (formData) => {
    const result = await api.submitForm(formData);
    if (isSuccess(result)) {
      return result.data;
    } else {
      throw result.error;
    }
  }
);
```

### Batch Operations
```typescript
const result = await EnhancedAssignmentService.bulkAssignEntities(
  entityIds,
  'people',
  'owner-id',
  'current-user'
);

if (isSuccess(result)) {
  console.log(`Assigned ${result.data.updated_count} entities`);
} else {
  console.error('Batch assignment failed:', result.error.userMessage);
}
```

### Retry Logic
```typescript
const { execute, retry, canRetry, retryCount } = useAsyncOperation(
  asyncOperation,
  {
    enableRetry: true,
    maxRetries: 3,
    onRetry: (attempt) => console.log(`Retry attempt ${attempt}`)
  }
);
```

## Testing

### Testing Result Patterns
```typescript
describe('AssignmentService', () => {
  it('should return success result for valid assignment', async () => {
    const result = await EnhancedAssignmentService.assignEntity(
      'people',
      'valid-id',
      'owner-id',
      'current-user'
    );
    
    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.data.success).toBe(true);
    }
  });
  
  it('should return error result for invalid input', async () => {
    const result = await EnhancedAssignmentService.assignEntity(
      'people',
      '',
      'owner-id',
      'current-user'
    );
    
    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.type).toBe(ErrorType.VALIDATION_ERROR);
    }
  });
});
```

## Rollback Plan

If you need to rollback:

1. Keep the old services alongside new ones
2. Gradually migrate components one by one
3. Use feature flags to toggle between old and new error handling
4. Monitor error rates and user feedback during migration

## Support

For questions or issues with the migration:
- Check the examples in `src/examples/errorHandlingExamples.tsx`
- Review the type definitions in `src/types/errors.ts`
- Test with the provided examples before implementing in production
