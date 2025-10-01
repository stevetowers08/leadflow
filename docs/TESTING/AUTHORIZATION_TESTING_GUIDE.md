# Authorization Testing Suite

This comprehensive authorization testing suite ensures that your CRM system properly enforces user permissions and data access controls.

## Overview

The authorization system implements:
- **Role-based access control** (Owner, Admin, Recruiter, Viewer)
- **Ownership-based data access** (users can only see/edit their assigned entities)
- **API-level authorization middleware** 
- **Frontend permission guards**
- **Database-level RLS policies**

## Test Structure

### 1. Frontend Authorization Tests (`src/test/authorization/frontend-authorization.test.tsx`)
Tests React components and UI permission handling:

- **PermissionGuard Component**: Tests role and permission-based UI rendering
- **Navigation Components**: Tests sidebar and mobile nav permission filtering
- **Role-based Access Control**: Tests different user roles and their permissions
- **Edge Cases**: Tests deleted users, missing roles, null users

### 2. Backend Authorization Tests (`src/test/authorization/backend-authorization.test.ts`)
Tests service layer authorization:

- **AssignmentService**: Tests user validation and entity assignment permissions
- **Data Access Authorization**: Tests ownership-based data filtering
- **Edge Cases**: Tests deleted users, role changes, concurrent operations

### 3. Edge Cases Tests (`src/test/authorization/edge-cases.test.ts`)
Tests complex authorization scenarios:

- **Deleted Users**: Tests handling of inactive/deleted user assignments
- **Role Changes**: Tests permission changes during user sessions
- **Concurrent Operations**: Tests assignment conflicts and race conditions
- **Permission Escalation**: Tests prevention of unauthorized permission changes
- **Session Management**: Tests expired sessions and invalid tokens

### 4. E2E Authorization Tests (`e2e/authorization.spec.ts`)
Tests complete user workflows:

- **Owner Role**: Tests full system access
- **Admin Role**: Tests administrative permissions
- **Recruiter Role**: Tests CRM functionality with ownership restrictions
- **Viewer Role**: Tests read-only access
- **Cross-Role Tests**: Tests unauthorized access prevention
- **Edge Cases**: Tests real-world scenarios

## Running the Tests

### Unit Tests
```bash
# Run all authorization tests
npm run test src/test/authorization/

# Run specific test files
npm run test src/test/authorization/frontend-authorization.test.tsx
npm run test src/test/authorization/backend-authorization.test.ts
npm run test src/test/authorization/edge-cases.test.ts

# Run with coverage
npm run test:coverage src/test/authorization/
```

### E2E Tests
```bash
# Run authorization E2E tests
npx playwright test e2e/authorization.spec.ts

# Run with UI mode
npx playwright test e2e/authorization.spec.ts --ui

# Run specific test suites
npx playwright test e2e/authorization.spec.ts --grep "Owner Role Tests"
npx playwright test e2e/authorization.spec.ts --grep "Edge Cases"
```

## Test Data

### User Roles
- **Owner**: Full system control, can access all data and manage users
- **Admin**: Can access all data and manage users (except billing)
- **Recruiter**: Can access only assigned entities, can create/edit CRM data
- **Viewer**: Read-only access to assigned entities only

### Test Entities
- **Companies**: 3 companies with different owners
- **People**: 3 people with different owners
- **Jobs**: 2 jobs with different owners
- **User Profiles**: 4 users with different roles

## Key Test Scenarios

### 1. Data Access Control
- ✅ Users can only view entities assigned to them
- ✅ Admin/Owner can view all entities
- ✅ RLS policies enforce database-level restrictions

### 2. Assignment Operations
- ✅ Users can assign entities they own
- ✅ Admin/Owner can assign any entity
- ✅ Viewers cannot perform assignments
- ✅ Assignment validation prevents invalid operations

### 3. Role-based Permissions
- ✅ Owner has full permissions
- ✅ Admin has most permissions (no billing)
- ✅ Recruiter has CRM permissions only
- ✅ Viewer has read-only permissions

### 4. Edge Cases
- ✅ Deleted users cannot access system
- ✅ Role changes are handled gracefully
- ✅ Concurrent assignments are prevented
- ✅ Session expiration is handled properly

## Mock Data Structure

### Users
```typescript
const mockUsers = {
  owner: { id: 'owner-user-id', email: 'owner@example.com', role: 'owner' },
  admin: { id: 'admin-user-id', email: 'admin@example.com', role: 'admin' },
  recruiter: { id: 'recruiter-user-id', email: 'recruiter@example.com', role: 'recruiter' },
  viewer: { id: 'viewer-user-id', email: 'viewer@example.com', role: 'viewer' },
  deleted: { id: 'deleted-user-id', email: 'deleted@example.com', role: 'recruiter', isActive: false }
};
```

### CRM Data
```typescript
const mockCrmData = {
  companies: [
    { id: 'company-1', name: 'Acme Corp', owner_id: 'recruiter-user-id' },
    { id: 'company-2', name: 'Beta Inc', owner_id: 'admin-user-id' },
    { id: 'company-3', name: 'Gamma LLC', owner_id: 'owner-user-id' }
  ],
  people: [
    { id: 'person-1', name: 'John Doe', owner_id: 'recruiter-user-id' },
    { id: 'person-2', name: 'Jane Smith', owner_id: 'admin-user-id' },
    { id: 'person-3', name: 'Bob Wilson', owner_id: 'owner-user-id' }
  ],
  jobs: [
    { id: 'job-1', title: 'Software Engineer', owner_id: 'recruiter-user-id' },
    { id: 'job-2', title: 'Product Manager', owner_id: 'admin-user-id' }
  ]
};
```

## Database Policies

The enhanced RLS policies implement:

1. **Ownership-based SELECT**: Users can only view entities they own (unless admin/owner)
2. **Ownership-based INSERT**: Users can only assign entities to themselves (unless admin/owner)
3. **Ownership-based UPDATE**: Users can only update entities they own (unless admin/owner)
4. **Role-based DELETE**: Only admin/owner can delete entities
5. **Active user validation**: Only active users can perform operations

## API Middleware

The authorization middleware provides:

1. **JWT Token Validation**: Verifies user authentication
2. **Role-based Authorization**: Checks user roles and permissions
3. **Resource Access Control**: Validates entity ownership
4. **Assignment Permissions**: Controls entity reassignment
5. **Data Filtering**: Applies permission-based data filtering

## Security Considerations

### What's Protected
- ✅ Database access via RLS policies
- ✅ API endpoints via authorization middleware
- ✅ Frontend UI via permission guards
- ✅ Entity assignments and ownership
- ✅ User role changes and deactivation

### What's Tested
- ✅ Unauthorized access attempts
- ✅ Permission escalation prevention
- ✅ Data leakage prevention
- ✅ Session management
- ✅ Edge cases and error handling

## Continuous Integration

The authorization tests are integrated into the CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
- name: Run Authorization Tests
  run: |
    npm run test src/test/authorization/
    npx playwright test e2e/authorization.spec.ts
```

## Monitoring and Alerts

Consider implementing:
- **Authorization failure monitoring**: Track failed permission checks
- **Suspicious activity detection**: Monitor unusual access patterns
- **Role change auditing**: Log all role modifications
- **Data access logging**: Track entity access patterns

## Troubleshooting

### Common Issues
1. **RLS Policy Conflicts**: Check for circular dependencies in policies
2. **Permission Cache Issues**: Clear browser cache and refresh user session
3. **Token Expiration**: Implement proper token refresh handling
4. **Race Conditions**: Use database transactions for critical operations

### Debug Commands
```bash
# Check RLS policies
npx supabase db inspect --schema public

# Test specific permissions
npm run test -- --grep "PermissionGuard"

# Debug E2E tests
npx playwright test e2e/authorization.spec.ts --debug
```

## Future Enhancements

Consider adding:
- **Audit logging**: Track all authorization decisions
- **Dynamic permissions**: Runtime permission changes
- **Multi-tenant support**: Organization-level isolation
- **API rate limiting**: Prevent abuse of authorization checks
- **Permission inheritance**: Hierarchical permission structures
