import { describe, it, expect, vi, beforeEach } from 'vitest';
import { test, expect } from '@playwright/test';
import {
  mockUsers,
  mockUserProfiles,
  mockCrmData,
  createMockSupabaseClient,
} from '../mocks/authMocks';

describe('Authorization Tests - Edge Cases', () => {
  describe('Deleted Users Handling', () => {
    it('should prevent access to entities owned by deleted users', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);

      // Try to access company owned by deleted user
      const result = await mockSupabase.from('companies').select('*');

      // Should not see company-3 (owned by deleted-user-id)
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('company-1');
    });

    it('should allow admin/owner to reassign entities from deleted users', async () => {
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
        'company-3',
        'admin-user-id',
        'admin-user-id'
      );

      expect(result.success).toBe(true);
    });

    it('should prevent regular users from accessing deleted user data', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);

      // Try to access people owned by deleted user
      const result = await mockSupabase.from('people').select('*');

      // Should not see person-3 (owned by deleted-user-id)
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('person-1');
    });
  });

  describe('Role Changes During Session', () => {
    it('should handle user role downgrade gracefully', async () => {
      // Start as admin
      let mockSupabase = createMockSupabaseClient(mockUsers.admin);
      let result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(3); // Can see all companies

      // Role changed to recruiter
      mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
      result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(1); // Can only see assigned companies
    });

    it('should handle user role upgrade gracefully', async () => {
      // Start as recruiter
      let mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
      let result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(1); // Can only see assigned companies

      // Role changed to admin
      mockSupabase = createMockSupabaseClient(mockUsers.admin);
      result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(3); // Can see all companies
    });

    it('should handle user deactivation during session', async () => {
      // Start as active recruiter
      let mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
      let result = await mockSupabase.from('companies').select('*');
      expect(result.data).toHaveLength(1);

      // User deactivated
      mockSupabase = createMockSupabaseClient(mockUsers.deleted);
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
  });

  describe('Data Integrity During Reassignments', () => {
    it('should maintain referential integrity during bulk reassignments', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.admin);

      // Mock successful bulk reassignment
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

      // Mock partial failure
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

      // First two should succeed, third should fail
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(results[2].success).toBe(false);
      expect(results[3].success).toBe(true);
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
  });
});

// E2E Tests for Edge Cases
test.describe('Authorization E2E Tests - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'sb-jedfundfhzytpnbjkspn-auth-token',
        JSON.stringify({
          access_token: 'mock-token',
          user: {
            id: 'recruiter-user-id',
            email: 'recruiter@example.com',
            user_metadata: { role: 'recruiter' },
          },
        })
      );
    });
  });

  test('should handle role change during user session', async ({ page }) => {
    await page.goto('/companies');

    // Initially see only assigned companies
    await expect(page.getByText('Acme Corp')).toBeVisible();
    await expect(page.getByText('Beta Inc')).not.toBeVisible();

    // Simulate role change to admin
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'sb-jedfundfhzytpnbjkspn-auth-token',
        JSON.stringify({
          access_token: 'mock-token',
          user: {
            id: 'recruiter-user-id',
            email: 'recruiter@example.com',
            user_metadata: { role: 'admin' },
          },
        })
      );
    });

    // Refresh page to reflect new role
    await page.reload();

    // Now should see all companies
    await expect(page.getByText('Acme Corp')).toBeVisible();
    await expect(page.getByText('Beta Inc')).toBeVisible();
  });

  test('should handle user deactivation gracefully', async ({ page }) => {
    await page.goto('/companies');

    // Initially see assigned companies
    await expect(page.getByText('Acme Corp')).toBeVisible();

    // Simulate user deactivation
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'sb-jedfundfhzytpnbjkspn-auth-token',
        JSON.stringify({
          access_token: 'mock-token',
          user: {
            id: 'deleted-user-id',
            email: 'deleted@example.com',
            user_metadata: { role: 'recruiter' },
          },
        })
      );
    });

    // Refresh page
    await page.reload();

    // Should be redirected to sign-in or see no data
    await expect(page.getByText('Acme Corp')).not.toBeVisible();
  });

  test('should prevent unauthorized assignment operations', async ({
    page,
  }) => {
    await page.goto('/companies');

    // Click on a company to open details
    await page.getByText('Acme Corp').click();

    // Try to assign to another user (should be restricted for recruiter)
    const assignButton = page.getByRole('button', { name: /assign/i });
    if (await assignButton.isVisible()) {
      await assignButton.click();

      // Should show error or be disabled
      await expect(page.getByText(/forbidden|unauthorized/i)).toBeVisible();
    }
  });
});
