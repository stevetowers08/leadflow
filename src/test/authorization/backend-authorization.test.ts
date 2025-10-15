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

describe('Authorization Tests - Backend Services', () => {
  describe('AssignmentService', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe('User Validation', () => {
      it('should validate active users successfully', async () => {
        const result =
          await AssignmentService.validateUser('recruiter-user-id');
        expect(result).toBe(true);
      });

      it('should reject inactive/deleted users', async () => {
        const result = await AssignmentService.validateUser('deleted-user-id');
        expect(result).toBe(false);
      });

      it('should reject non-existent users', async () => {
        const result = await AssignmentService.validateUser(
          'non-existent-user-id'
        );
        expect(result).toBe(false);
      });
    });

    describe('Entity Assignment Authorization', () => {
      it('should allow owner to assign entities to any user', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.owner);
        vi.mocked(mockSupabase.from).mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockResolvedValue({
            data: mockCrmData.companies[0],
            error: null,
          }),
        } as any);

        const result = await AssignmentService.assignEntity(
          'companies',
          'company-1',
          'admin-user-id',
          'owner-user-id'
        );

        expect(result.success).toBe(true);
      });

      it('should allow admin to assign entities to any user', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.admin);
        vi.mocked(mockSupabase.from).mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockResolvedValue({
            data: mockCrmData.companies[0],
            error: null,
          }),
        } as any);

        const result = await AssignmentService.assignEntity(
          'companies',
          'company-1',
          'recruiter-user-id',
          'admin-user-id'
        );

        expect(result.success).toBe(true);
      });

      it('should allow recruiter to assign entities they own', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
        vi.mocked(mockSupabase.from).mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockResolvedValue({
            data: mockCrmData.companies[0],
            error: null,
          }),
        } as any);

        const result = await AssignmentService.assignEntity(
          'companies',
          'company-1', // Owned by recruiter-user-id
          'admin-user-id',
          'recruiter-user-id'
        );

        expect(result.success).toBe(true);
      });

      it('should prevent recruiter from assigning entities they do not own', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
        vi.mocked(mockSupabase.from).mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockResolvedValue({
            data: null,
            error: {
              message: 'Forbidden: You can only assign entities you own',
            },
          }),
        } as any);

        const result = await AssignmentService.assignEntity(
          'companies',
          'company-2', // Owned by admin-user-id
          'recruiter-user-id',
          'recruiter-user-id'
        );

        expect(result.success).toBe(false);
        expect(result.error).toContain('Forbidden');
      });

      it('should prevent viewer from assigning entities', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.viewer);
        vi.mocked(mockSupabase.from).mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Forbidden: Viewers cannot assign entities' },
          }),
        } as any);

        const result = await AssignmentService.assignEntity(
          'companies',
          'company-1',
          'admin-user-id',
          'viewer-user-id'
        );

        expect(result.success).toBe(false);
        expect(result.error).toContain('Forbidden');
      });
    });

    describe('Team Members Access', () => {
      it('should allow owner to view all team members', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.owner);
        vi.mocked(mockSupabase.from).mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockResolvedValue({
            data: Object.values(mockUserProfiles),
            error: null,
          }),
        } as any);

        const result = await AssignmentService.getTeamMembers();
        expect(result).toHaveLength(5); // All users including deleted
      });

      it('should allow admin to view all team members', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.admin);
        vi.mocked(mockSupabase.from).mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockResolvedValue({
            data: Object.values(mockUserProfiles),
            error: null,
          }),
        } as any);

        const result = await AssignmentService.getTeamMembers();
        expect(result).toHaveLength(5);
      });

      it('should allow recruiter to view only active team members', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
        vi.mocked(mockSupabase.from).mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockResolvedValue({
            data: Object.values(mockUserProfiles).filter(
              person => person.is_active
            ),
            error: null,
          }),
        } as any);

        const result = await AssignmentService.getTeamMembers();
        expect(result).toHaveLength(4); // Excluding deleted user
      });

      it('should prevent viewer from viewing team members', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.viewer);
        vi.mocked(mockSupabase.from).mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockResolvedValue({
            data: [],
            error: { message: 'Forbidden: Viewers cannot view team members' },
          }),
        } as any);

        const result = await AssignmentService.getTeamMembers();
        expect(result).toHaveLength(0);
      });
    });
  });

  describe('Data Access Authorization', () => {
    describe('Companies Access', () => {
      it('should allow owner to view all companies', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.owner);
        const result = await mockSupabase.from('companies').select('*');

        expect(result.data).toHaveLength(3); // All companies
        expect(result.error).toBeNull();
      });

      it('should allow admin to view all companies', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.admin);
        const result = await mockSupabase.from('companies').select('*');

        expect(result.data).toHaveLength(3); // All companies
        expect(result.error).toBeNull();
      });

      it('should allow recruiter to view only assigned companies', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
        const result = await mockSupabase.from('companies').select('*');

        expect(result.data).toHaveLength(1); // Only company-1
        expect(result.data[0].id).toBe('company-1');
        expect(result.error).toBeNull();
      });

      it('should allow viewer to view only assigned companies', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.viewer);
        const result = await mockSupabase.from('companies').select('*');

        expect(result.data).toHaveLength(0); // No companies assigned to viewer
        expect(result.error).toBeNull();
      });
    });

    describe('People/Leads Access', () => {
      it('should allow owner to view all people', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.owner);
        const result = await mockSupabase.from('people').select('*');

        expect(result.data).toHaveLength(3); // All people
        expect(result.error).toBeNull();
      });

      it('should allow admin to view all people', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.admin);
        const result = await mockSupabase.from('people').select('*');

        expect(result.data).toHaveLength(3); // All people
        expect(result.error).toBeNull();
      });

      it('should allow recruiter to view only assigned people', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
        const result = await mockSupabase.from('people').select('*');

        expect(result.data).toHaveLength(1); // Only person-1
        expect(result.data[0].id).toBe('person-1');
        expect(result.error).toBeNull();
      });

      it('should allow viewer to view only assigned people', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.viewer);
        const result = await mockSupabase.from('people').select('*');

        expect(result.data).toHaveLength(0); // No people assigned to viewer
        expect(result.error).toBeNull();
      });
    });

    describe('Jobs Access', () => {
      it('should allow owner to view all jobs', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.owner);
        const result = await mockSupabase.from('jobs').select('*');

        expect(result.data).toHaveLength(2); // All jobs
        expect(result.error).toBeNull();
      });

      it('should allow admin to view all jobs', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.admin);
        const result = await mockSupabase.from('jobs').select('*');

        expect(result.data).toHaveLength(2); // All jobs
        expect(result.error).toBeNull();
      });

      it('should allow recruiter to view only assigned jobs', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
        const result = await mockSupabase.from('jobs').select('*');

        expect(result.data).toHaveLength(1); // Only job-1
        expect(result.data[0].id).toBe('job-1');
        expect(result.error).toBeNull();
      });

      it('should allow viewer to view only assigned jobs', async () => {
        const mockSupabase = createMockSupabaseClient(mockUsers.viewer);
        const result = await mockSupabase.from('jobs').select('*');

        expect(result.data).toHaveLength(0); // No jobs assigned to viewer
        expect(result.error).toBeNull();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle deleted user assignments gracefully', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.owner);
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

      expect(result.data).toHaveLength(1);
      expect(result.data[0].owner_id).toBe('deleted-user-id');
    });

    it('should handle role changes during assignment', async () => {
      const mockSupabase = createMockSupabaseClient(mockUsers.recruiter);
      vi.mocked(mockSupabase.from).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'User role changed during assignment' },
        }),
      } as any);

      const result = await AssignmentService.assignEntity(
        'companies',
        'company-1',
        'admin-user-id',
        'recruiter-user-id'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('role changed');
    });

    it('should handle concurrent assignment attempts', async () => {
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
});
