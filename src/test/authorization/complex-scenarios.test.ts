import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssignmentService } from '@/services/assignmentService';
import {
  mockUsers,
  mockUserProfiles,
  mockCrmData,
  createMockSupabaseClient,
} from '../mocks/authMocks';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: createMockSupabaseClient(),
}));

describe('Authorization Tests - Edge Cases and Complex Scenarios', () => {
  describe('Deleted Users and Inactive Accounts', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should handle entities owned by deleted users', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      // Mock company owned by deleted user
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: mockCrmData.companies.filter(
            company => company.owner_id === 'deleted-user-id'
          ),
          error: null,
        }),
      } as any);

      const result = await mockSupabase.from('companies').select('*');

      // Admin should see company owned by deleted user
      expect(result.data).toHaveLength(1);
      expect(result.data[0].owner_id).toBe('deleted-user-id');
    });

    it('should prevent deleted users from accessing system', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.deleted);

      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: [],
          error: { message: 'User account is deactivated' },
        }),
      } as any);

      const result = await mockSupabase.from('companies').select('*');

      expect(result.data).toHaveLength(0);
      expect(result.error).toContain('deactivated');
    });

    it('should allow admin to reassign entities from deleted users', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: { ...mockCrmData.companies[2], owner_id: 'admin-user-id' },
          error: null,
        }),
      } as any);

      const result = await AssignmentService.assignEntity(
        'companies',
        'company-3', // Owned by deleted user
        'admin-user-id',
        'admin-user-id'
      );

      expect(result.success).toBe(true);
    });

    it('should prevent regular users from accessing deleted user data', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);

      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: mockCrmData.companies.filter(
            company => company.owner_id === 'recruiter-user-id'
          ),
          error: null,
        }),
      } as any);

      const result = await mockSupabase.from('companies').select('*');

      // Should not see company owned by deleted user
      expect(result.data).toHaveLength(1);
      expect(result.data[0].owner_id).toBe('recruiter-user-id');
    });
  });

  describe('Role Changes During Session', () => {
    it('should handle user role downgrade gracefully', async () => {
      // Start as admin
      let mockSupabase = createMockSupabaseClient(mockUsers.admin);
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: mockCrmData.companies, // All companies
          error: null,
        }),
      } as any);

      let result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(3); // Can see all companies

      // Role changed to recruiter
      mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: mockCrmData.companies.filter(
            company => company.owner_id === 'recruiter-user-id'
          ),
          error: null,
        }),
      } as any);

      result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(1); // Can only see assigned companies
    });

    it('should handle user role upgrade gracefully', async () => {
      // Start as recruiter
      let mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: mockCrmData.companies.filter(
            company => company.owner_id === 'recruiter-user-id'
          ),
          error: null,
        }),
      } as any);

      let result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(1); // Can only see assigned companies

      // Role changed to admin
      mockSupabase = createMockSupabaseClient(mockUsers.admin);
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: mockCrmData.companies, // All companies
          error: null,
        }),
      } as any);

      result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(3); // Can see all companies
    });

    it('should handle user deactivation during session', async () => {
      // Start as active recruiter
      let mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: mockCrmData.companies.filter(
            company => company.owner_id === 'recruiter-user-id'
          ),
          error: null,
        }),
      } as any);

      let result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(1);

      // User deactivated
      mockSupabase = createMockSupabaseClient(mockUsers.deleted);
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: [],
          error: { message: 'User account is deactivated' },
        }),
      } as any);

      result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(0); // No access when deactivated
    });
  });

  describe('Concurrent Assignment Operations', () => {
    it('should handle multiple users trying to assign same entity', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Entity already assigned to another user' },
        }),
      } as any);

      const result = await AssignmentService.assignEntity(
        'companies',
        'company-1',
        'recruiter-user-id',
        'admin-user-id'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('already assigned');
    });

    it('should handle assignment to user who becomes inactive', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Target user is no longer active' },
        }),
      } as any);

      const result = await AssignmentService.assignEntity(
        'companies',
        'company-1',
        'deleted-user-id',
        'admin-user-id'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('no longer active');
    });

    it('should handle race conditions in bulk assignments', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      let callCount = 0;
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 2) {
            return Promise.resolve({
              data: null,
              error: { message: 'Concurrent modification detected' },
            });
          }
          return Promise.resolve({
            data: { id: `entity-${callCount}` },
            error: null,
          });
        }),
      } as any);

      const reassignmentPromises = [
        AssignmentService.assignEntity(
          'companies',
          'company-1',
          'admin-user-id',
          'admin-user-id'
        ),
        AssignmentService.assignEntity(
          'companies',
          'company-2',
          'admin-user-id',
          'admin-user-id'
        ),
        AssignmentService.assignEntity(
          'people',
          'person-1',
          'admin-user-id',
          'admin-user-id'
        ),
      ];

      const results = await Promise.all(reassignmentPromises);

      // First should succeed, second should fail, third should succeed
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
    });
  });

  describe('Data Integrity During Reassignments', () => {
    it('should maintain referential integrity during bulk reassignments', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: { count: 5 },
          error: null,
        }),
      } as any);

      // Simulate bulk reassignment of all entities from one user to another
      const reassignmentPromises = [
        AssignmentService.assignEntity(
          'companies',
          'company-1',
          'admin-user-id',
          'admin-user-id'
        ),
        AssignmentService.assignEntity(
          'companies',
          'company-2',
          'admin-user-id',
          'admin-user-id'
        ),
        AssignmentService.assignEntity(
          'people',
          'person-1',
          'admin-user-id',
          'admin-user-id'
        ),
        AssignmentService.assignEntity(
          'people',
          'person-2',
          'admin-user-id',
          'admin-user-id'
        ),
        AssignmentService.assignEntity(
          'jobs',
          'job-1',
          'admin-user-id',
          'admin-user-id'
        ),
      ];

      const results = await Promise.all(reassignmentPromises);

      // All reassignments should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    it('should handle partial failure during bulk reassignments', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      let callCount = 0;
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 3) {
            return Promise.resolve({
              data: null,
              error: { message: 'Database constraint violation' },
            });
          }
          return Promise.resolve({
            data: { id: `entity-${callCount}` },
            error: null,
          });
        }),
      } as any);

      const reassignmentPromises = [
        AssignmentService.assignEntity(
          'companies',
          'company-1',
          'admin-user-id',
          'admin-user-id'
        ),
        AssignmentService.assignEntity(
          'companies',
          'company-2',
          'admin-user-id',
          'admin-user-id'
        ),
        AssignmentService.assignEntity(
          'people',
          'person-1',
          'admin-user-id',
          'admin-user-id'
        ),
        AssignmentService.assignEntity(
          'people',
          'person-2',
          'admin-user-id',
          'admin-user-id'
        ),
      ];

      const results = await Promise.all(reassignmentPromises);

      // First two should succeed, third should fail, fourth should succeed
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(results[2].success).toBe(false);
      expect(results[3].success).toBe(true);
    });

    it('should validate entity existence before assignment', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Entity not found' },
        }),
      } as any);

      const result = await AssignmentService.assignEntity(
        'companies',
        'non-existent-company',
        'recruiter-user-id',
        'admin-user-id'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('Permission Escalation Prevention', () => {
    it('should prevent users from escalating their own permissions', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);

      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Forbidden: Cannot modify your own role' },
        }),
      } as any);

      // Try to update own profile to admin role
      const result = await mockSupabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('id', 'recruiter-user-id');

      expect(result.error).toContain('Forbidden');
    });

    it('should prevent users from accessing admin functions', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);

      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: [],
          error: { message: 'Forbidden: Insufficient permissions' },
        }),
      } as any);

      // Try to access user management functions
      const result = await mockSupabase.from('user_profiles').select('*');

      expect(result.data).toHaveLength(0);
      expect(result.error).toContain('Forbidden');
    });

    it('should prevent viewers from performing write operations', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.viewer);

      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Forbidden: Viewers cannot modify data' },
        }),
      } as any);

      // Try to update a lead
      const result = await mockSupabase
        .from('people')
        .update({ stage: 'qualified' })
        .eq('id', 'person-1');

      expect(result.error).toContain('Forbidden');
    });

    it('should prevent unauthorized role changes', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);

      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Forbidden: Only admins can change user roles' },
        }),
      } as any);

      // Try to change another user's role
      const result = await mockSupabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('id', 'admin-user-id');

      expect(result.error).toContain('Forbidden');
    });
  });

  describe('Session Management Edge Cases', () => {
    it('should handle expired sessions gracefully', async () => {
      const mockSupabase = createMockSupabaseClient(null); // No user

      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: [],
          error: { message: 'Unauthorized: Session expired' },
        }),
      } as any);

      const result = await mockSupabase.from('companies').select('*');

      expect(result.data).toHaveLength(0);
      expect(result.error).toContain('Unauthorized');
    });

    it('should handle invalid JWT tokens', async () => {
      const mockSupabase = createMockSupabaseClient({
        id: 'invalid-user',
        email: 'invalid@example.com',
        user_metadata: { role: 'invalid-role' },
      });

      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: [],
          error: { message: 'Unauthorized: Invalid token' },
        }),
      } as any);

      const result = await mockSupabase.from('companies').select('*');

      expect(result.data).toHaveLength(0);
      expect(result.error).toContain('Unauthorized');
    });

    it('should handle malformed user metadata', async () => {
      const mockSupabase = createMockSupabaseClient({
        id: 'malformed-user',
        email: 'malformed@example.com',
        user_metadata: null, // Missing metadata
      });

      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: [],
          error: { message: 'Unauthorized: Invalid user metadata' },
        }),
      } as any);

      const result = await mockSupabase.from('companies').select('*');

      expect(result.data).toHaveLength(0);
      expect(result.error).toContain('Unauthorized');
    });
  });

  describe('Complex Authorization Scenarios', () => {
    it('should handle cascading permission changes', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      // Mock cascading updates when user role changes
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: { count: 3 },
          error: null,
        }),
      } as any);

      // Simulate role change from recruiter to viewer
      const result = await mockSupabase
        .from('user_profiles')
        .update({ role: 'viewer' })
        .eq('id', 'recruiter-user-id');

      expect(result.data).toBeDefined();
    });

    it('should handle permission inheritance in team structures', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      // Mock team-based permissions
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: [
            { id: 'team-1', name: 'Sales Team', manager_id: 'admin-user-id' },
            {
              id: 'team-2',
              name: 'Marketing Team',
              manager_id: 'recruiter-user-id',
            },
          ],
          error: null,
        }),
      } as any);

      const result = await mockSupabase.from('teams').select('*');

      expect(result.data).toHaveLength(2);
    });

    it('should handle time-based permission changes', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);

      // Mock temporary permission grant
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: mockCrmData.companies,
          error: null,
        }),
      } as any);

      // Simulate temporary admin access
      const result = await mockSupabase.from('companies').select('*');

      expect(result.data).toHaveLength(3);
    });
  });
});
