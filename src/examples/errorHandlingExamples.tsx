/**
 * Enhanced Error Handling Usage Examples
 * Demonstrates how to use the new error handling patterns
 */

import { EnhancedErrorBoundary, FeatureErrorBoundary } from '@/components/EnhancedErrorBoundary';
import { useAsyncData, useAsyncMutation, useAsyncOperation } from '@/hooks/useEnhancedAsyncOperation';
import { EnhancedAssignmentService } from '@/services/enhancedAssignmentService';
import {
    ErrorSeverity,
    isSuccess
} from '@/types/errors';
import { circuitBreakerManager } from '@/utils/circuitBreaker';
import React from 'react';

// Example 1: Using Result pattern in a service
export async function exampleServiceUsage() {
  // Using the enhanced assignment service
  const result = await EnhancedAssignmentService.assignEntity(
    'people',
    'user-123',
    'owner-456',
    'current-user'
  );

  if (isSuccess(result)) {
    console.log('Assignment successful:', result.data);
    // Handle success case
  } else {
    console.error('Assignment failed:', result.error.userMessage);
    // Handle error case with proper error information
  }
}

// Example 2: Using enhanced async operation hook
export function ExampleComponent() {
  const {
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    execute,
    retry,
    canRetry
  } = useAsyncOperation(
    async (entityId: string) => {
      const result = await EnhancedAssignmentService.assignEntity(
        'people',
        entityId,
        'new-owner',
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
      showErrorToast: true,
      onSuccess: (data) => {
        console.log('Assignment completed:', data);
      },
      onError: (error) => {
        console.error('Assignment failed:', error.userMessage);
      }
    }
  );

  const handleAssignment = async () => {
    await execute('entity-123');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error) {
    return (
      <div className="error-container">
        <p className="error-message">{error.userMessage}</p>
        {canRetry && (
          <button onClick={() => retry('entity-123')}>
            Retry Assignment
          </button>
        )}
      </div>
    );
  }

  if (isSuccess && data) {
    return (
      <div className="success-container">
        <p className="success-message">{data.message}</p>
      </div>
    );
  }

  return (
    <button onClick={handleAssignment}>
      Assign Entity
    </button>
  );
}

// Example 3: Using data fetching hook
export function DataFetchingExample() {
  const {
    data: teamMembers,
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
      showErrorToast: true,
      onSuccess: (members) => {
        console.log(`Loaded ${members.length} team members`);
      }
    }
  );

  if (isLoading) {
    return <div>Loading team members...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error.userMessage}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h3>Team Members ({teamMembers?.length || 0})</h3>
      {teamMembers?.map(member => (
        <div key={member.id}>
          {member.full_name} - {member.email}
        </div>
      ))}
    </div>
  );
}

// Example 4: Using mutation hook
export function MutationExample() {
  const {
    execute: createAssignment,
    isLoading,
    error,
    isSuccess
  } = useAsyncMutation(
    async (assignmentData: { entityId: string; ownerId: string }) => {
      const result = await EnhancedAssignmentService.assignEntity(
        'people',
        assignmentData.entityId,
        assignmentData.ownerId,
        'current-user'
      );
      
      if (isSuccess(result)) {
        return result.data;
      } else {
        throw result.error;
      }
    },
    {
      onSuccess: (data) => {
        console.log('Assignment created:', data);
      },
      onError: (error) => {
        console.error('Failed to create assignment:', error.userMessage);
      }
    }
  );

  const handleSubmit = async () => {
    await createAssignment({
      entityId: 'entity-123',
      ownerId: 'owner-456'
    });
  };

  return (
    <div>
      <button 
        onClick={handleSubmit} 
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Assignment'}
      </button>
      
      {error && (
        <div className="error-message">
          {error.userMessage}
        </div>
      )}
      
      {isSuccess && (
        <div className="success-message">
          Assignment created successfully!
        </div>
      )}
    </div>
  );
}

// Example 5: Using circuit breaker
export async function circuitBreakerExample() {
  const result = await circuitBreakerManager.executeWithBreaker(
    'external-api',
    async () => {
      // Simulate external API call
      const response = await fetch('/api/external-service');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    'fetch-external-data',
    {
      failureThreshold: 5,
      timeout: 60000,
      monitoringPeriod: 300000
    }
  );

  if (isSuccess(result)) {
    console.log('External API call successful:', result.data);
  } else {
    console.error('External API call failed:', result.error.userMessage);
  }
}

// Example 6: Using error boundaries
export function AppWithErrorBoundaries() {
  return (
    <EnhancedErrorBoundary
      componentName="App"
      severity={ErrorSeverity.CRITICAL}
      maxRetries={1}
      recoverable={false}
      onError={(error, errorInfo) => {
        console.error('App-level error:', error, errorInfo);
      }}
    >
      <div className="app">
        <FeatureErrorBoundary feature="Assignment">
          <AssignmentComponent />
        </FeatureErrorBoundary>
        
        <FeatureErrorBoundary feature="Reporting">
          <ReportingComponent />
        </FeatureErrorBoundary>
        
        <FeatureErrorBoundary feature="User Management">
          <UserManagementComponent />
        </FeatureErrorBoundary>
      </div>
    </EnhancedErrorBoundary>
  );
}

// Example components (simplified)
function AssignmentComponent() {
  return <div>Assignment functionality</div>;
}

function ReportingComponent() {
  return <div>Reporting functionality</div>;
}

function UserManagementComponent() {
  return <div>User management functionality</div>;
}

// Example 7: Error handling in forms
export function FormWithErrorHandling() {
  const {
    execute: submitForm,
    isLoading,
    error,
    isSuccess
  } = useAsyncOperation(
    async (formData: any) => {
      // Simulate form submission
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Form submission failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      enableRetry: false // Don't retry form submissions
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    await submitForm(Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
      
      {error && (
        <div className="form-error">
          {error.userMessage}
        </div>
      )}
      
      {isSuccess && (
        <div className="form-success">
          Form submitted successfully!
        </div>
      )}
    </form>
  );
}

// Example 8: Batch operations with error handling
export async function batchOperationExample() {
  const entityIds = ['entity-1', 'entity-2', 'entity-3'];
  
  const result = await EnhancedAssignmentService.bulkAssignEntities(
    entityIds,
    'people',
    'new-owner-id',
    'current-user'
  );

  if (isSuccess(result)) {
    const { data } = result;
    console.log(`Successfully assigned ${data.updated_count} out of ${data.total_requested} entities`);
    
    if (data.invalid_entities.length > 0) {
      console.warn('Invalid entities:', data.invalid_entities);
    }
    
    if (data.errors && data.errors.length > 0) {
      console.warn('Errors:', data.errors);
    }
  } else {
    console.error('Batch assignment failed:', result.error.userMessage);
  }
}
