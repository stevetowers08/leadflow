# Multi-User Assignment Test Suite

This comprehensive test suite covers all aspects of multi-user functionality in the Empowr CRM system, including user assignment business logic, database operations, API endpoints, frontend components, end-to-end workflows, and performance testing.

## Test Structure

### 1. Unit Tests (`src/test/services/assignmentService.test.ts`)
Tests the core business logic of the AssignmentService class:
- User validation
- Team member retrieval
- Single entity assignment
- Bulk entity assignment
- Orphaned record reassignment
- Assignment history tracking
- Assignment statistics calculation

**Coverage**: Happy paths, edge cases, error handling, and validation scenarios.

### 2. Integration Tests (`src/test/integration/assignmentService.integration.test.ts`)
Tests database operations with real Supabase connections:
- User validation with database
- Team member queries
- Entity assignment operations
- Bulk assignment with database functions
- Assignment history persistence
- Data integrity and referential constraints
- Concurrent assignment handling

**Coverage**: Real database interactions, data consistency, and transaction handling.

### 3. API Endpoint Tests (`src/test/api/assignmentEndpoints.test.ts`)
Tests all REST API endpoints for assignment operations:
- `GET /api/assignments/team-members` - Retrieve active team members
- `POST /api/assignments/assign` - Single entity assignment
- `POST /api/assignments/bulk-assign` - Bulk entity assignment
- `GET /api/assignments/history/{entityType}/{entityId}` - Assignment history
- `GET /api/assignments/stats` - Assignment statistics
- `POST /api/assignments/reassign-orphaned` - Orphaned record reassignment

**Coverage**: HTTP status codes, request/response validation, authentication, authorization, and error handling.

### 4. Frontend Component Tests (`src/test/components/assignmentComponents.test.tsx`)
Tests React components for user assignment UI:
- `BulkAssignmentDialog` - Bulk assignment interface
- `AssignmentManagementPanel` - Admin assignment management
- `LeadAssignment` - Lead assignment component
- `CompanyAssignment` - Company assignment component

**Coverage**: User interactions, state management, error handling, loading states, and permission checks.

### 5. End-to-End Tests (`e2e/assignment-workflows.spec.ts`)
Tests complete user workflows using Playwright:
- Single lead assignment workflow
- Bulk lead assignment workflow
- Company assignment workflow
- Assignment management panel operations
- Full assignment workflow integration
- Concurrent user scenarios
- Mobile device compatibility

**Coverage**: Complete user journeys, cross-browser compatibility, and real-world usage scenarios.

### 6. Performance Tests (`src/test/performance/assignmentPerformance.test.ts`)
Tests system performance under various loads:
- Single assignment performance
- Bulk assignment performance (10, 100, 1000 entities)
- Query performance (team members, stats, history)
- Concurrent operations performance
- Memory usage and scalability
- Database connection pooling
- Error handling performance

**Coverage**: Performance thresholds, memory usage, scalability, and stress testing.

## Test Data Management

### Test Users
- 10 performance test users with different roles
- 1 admin user for administrative operations
- Users with various permission levels

### Test Entities
- 1000 test leads for bulk operations
- 100 test companies for company assignment
- 100 test jobs for job assignment
- Mixed entity types for comprehensive testing

### Test Scenarios
- Happy path scenarios
- Edge cases and error conditions
- Concurrent operations
- Large dataset operations
- Permission-based access control

## Performance Thresholds

| Operation | Threshold | Description |
|-----------|-----------|-------------|
| Single Assignment | 1 second | Assign one entity to a user |
| Bulk Assignment (10) | 2 seconds | Assign 10 entities |
| Bulk Assignment (100) | 5 seconds | Assign 100 entities |
| Bulk Assignment (1000) | 15 seconds | Assign 1000 entities |
| Team Members Query | 500ms | Fetch active team members |
| Assignment Stats | 2 seconds | Calculate assignment statistics |
| Assignment History | 1 second | Fetch assignment history |
| Concurrent Requests | 3 seconds | Handle 10 concurrent operations |

## Running the Tests

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### API Tests
```bash
npm run test:api
```

### Component Tests
```bash
npm run test:components
```

### E2E Tests
```bash
npm run test:e2e
```

### Performance Tests
```bash
npm run test:performance
```

### All Tests
```bash
npm run test:all
```

## Test Configuration

### Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `PLAYWRIGHT_BASE_URL` - Base URL for E2E tests
- `NODE_ENV` - Environment (test/production)

### Test Database
- Separate test database instance
- Automatic cleanup between tests
- Isolated test data
- No impact on production data

## Coverage Goals

- **Unit Tests**: 95%+ code coverage
- **Integration Tests**: 90%+ database operation coverage
- **API Tests**: 100% endpoint coverage
- **Component Tests**: 90%+ component interaction coverage
- **E2E Tests**: 100% critical user journey coverage
- **Performance Tests**: All performance thresholds validated

## Continuous Integration

The test suite is designed to run in CI/CD pipelines with:
- Parallel test execution
- Test result reporting
- Performance regression detection
- Coverage reporting
- Test artifact collection

## Maintenance

### Adding New Tests
1. Follow existing test patterns
2. Include both happy path and edge cases
3. Add appropriate performance thresholds
4. Update documentation

### Updating Tests
1. Maintain backward compatibility
2. Update thresholds as needed
3. Keep test data current
4. Review and update coverage goals

This comprehensive test suite ensures the multi-user assignment functionality is robust, performant, and reliable across all system layers.
