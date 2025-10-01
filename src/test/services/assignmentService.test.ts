import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AssignmentService, AssignmentResult, BulkAssignmentResult, TeamMember } from '@/services/assignmentService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn()
        })),
        is: vi.fn(() => ({
          count: vi.fn()
        })),
        count: vi.fn()
      })),
      update: vi.fn(() => ({
        eq: vi.fn()
      })),
      insert: vi.fn(() => ({
        select: vi.fn()
      }))
    })),
    rpc: vi.fn()
  }
}));

describe('AssignmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('validateUser', () => {
    it('should return true for valid active user', async () => {
      const mockUser = { id: 'user-1', is_active: true };
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockUser, error: null })
      };
      
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await AssignmentService.validateUser('user-1');
      
      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('user_profiles');
      expect(mockQuery.select).toHaveBeenCalledWith('id, is_active');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'user-1');
      expect(mockQuery.eq).toHaveBeenCalledWith('is_active', true);
    });

    it('should return false for inactive user', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
      };
      
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await AssignmentService.validateUser('user-1');
      
      expect(result).toBe(false);
    });

    it('should return false when database error occurs', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockRejectedValue(new Error('Database error'))
      };
      
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await AssignmentService.validateUser('user-1');
      
      expect(result).toBe(false);
    });
  });

  describe('getTeamMembers', () => {
    it('should return team members successfully', async () => {
      const mockMembers: TeamMember[] = [
        {
          id: 'user-1',
          full_name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          is_active: true,
          avatar_url: 'avatar1.jpg'
        },
        {
          id: 'user-2',
          full_name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'user',
          is_active: true
        }
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockMembers, error: null })
      };
      
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await AssignmentService.getTeamMembers();
      
      expect(result).toEqual(mockMembers);
      expect(supabase.from).toHaveBeenCalledWith('user_profiles');
      expect(mockQuery.select).toHaveBeenCalledWith('id, full_name, email, role, is_active, avatar_url');
      expect(mockQuery.eq).toHaveBeenCalledWith('is_active', true);
      expect(mockQuery.order).toHaveBeenCalledWith('full_name');
    });

    it('should throw error when database query fails', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })
      };
      
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(AssignmentService.getTeamMembers()).rejects.toThrow('Failed to fetch team members: Database error');
    });

    it('should return empty array when no data', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: null })
      };
      
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await AssignmentService.getTeamMembers();
      
      expect(result).toEqual([]);
    });
  });

  describe('assignEntity', () => {
    it('should successfully assign entity to user', async () => {
      const mockEntity = { id: 'entity-1', name: 'Test Entity' };
      const mockOwner = { full_name: 'John Doe' };
      
      // Mock validateUser
      const validateUserSpy = vi.spyOn(AssignmentService, 'validateUser').mockResolvedValue(true);
      
      // Mock entity query
      const mockEntityQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockEntity, error: null })
      };
      
      // Mock update query
      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null })
      };
      
      // Mock owner query
      const mockOwnerQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockOwner, error: null })
      };
      
      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockEntityQuery as any)
        .mockReturnValueOnce(mockUpdateQuery as any)
        .mockReturnValueOnce(mockOwnerQuery as any);

      const result = await AssignmentService.assignEntity('people', 'entity-1', 'user-1', 'admin-1');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Test Entity assigned to John Doe');
      expect(result.data).toEqual({
        entityId: 'entity-1',
        newOwnerId: 'user-1',
        ownerName: 'John Doe'
      });
      
      validateUserSpy.mockRestore();
    });

    it('should successfully unassign entity', async () => {
      const mockEntity = { id: 'entity-1', name: 'Test Entity' };
      
      // Mock entity query
      const mockEntityQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockEntity, error: null })
      };
      
      // Mock update query
      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null })
      };
      
      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockEntityQuery as any)
        .mockReturnValueOnce(mockUpdateQuery as any);

      const result = await AssignmentService.assignEntity('people', 'entity-1', null, 'admin-1');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Test Entity unassigned');
      expect(result.data).toEqual({
        entityId: 'entity-1',
        newOwnerId: null,
        ownerName: null
      });
    });

    it('should fail when user validation fails', async () => {
      const validateUserSpy = vi.spyOn(AssignmentService, 'validateUser').mockResolvedValue(false);

      const result = await AssignmentService.assignEntity('people', 'entity-1', 'invalid-user', 'admin-1');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Cannot assign to user');
      expect(result.error).toBe('Target user does not exist or is not active');
      
      validateUserSpy.mockRestore();
    });

    it('should fail when entity does not exist', async () => {
      const validateUserSpy = vi.spyOn(AssignmentService, 'validateUser').mockResolvedValue(true);
      
      const mockEntityQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
      };
      
      vi.mocked(supabase.from).mockReturnValue(mockEntityQuery as any);

      const result = await AssignmentService.assignEntity('people', 'nonexistent-entity', 'user-1', 'admin-1');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Assignment failed');
      expect(result.error).toBe('person not found');
      
      validateUserSpy.mockRestore();
    });

    it('should fail when update operation fails', async () => {
      const validateUserSpy = vi.spyOn(AssignmentService, 'validateUser').mockResolvedValue(true);
      
      const mockEntity = { id: 'entity-1', name: 'Test Entity' };
      const mockEntityQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockEntity, error: null })
      };
      
      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: { message: 'Update failed' } })
      };
      
      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockEntityQuery as any)
        .mockReturnValueOnce(mockUpdateQuery as any);

      const result = await AssignmentService.assignEntity('people', 'entity-1', 'user-1', 'admin-1');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Assignment failed');
      expect(result.error).toBe('Update failed');
      
      validateUserSpy.mockRestore();
    });
  });

  describe('bulkAssignEntities', () => {
    it('should successfully perform bulk assignment', async () => {
      const mockRpcResult = {
        success: true,
        updated_count: 3,
        total_requested: 3,
        invalid_entities: [],
        error: null
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockRpcResult, error: null });

      const result = await AssignmentService.bulkAssignEntities(
        ['entity-1', 'entity-2', 'entity-3'],
        'people',
        'user-1',
        'admin-1'
      );
      
      expect(result.success).toBe(true);
      expect(result.updated_count).toBe(3);
      expect(result.total_requested).toBe(3);
      expect(result.invalid_entities).toEqual([]);
      expect(supabase.rpc).toHaveBeenCalledWith('bulk_assign_entities', {
        entity_ids: ['entity-1', 'entity-2', 'entity-3'],
        entity_type: 'people',
        new_owner_id: 'user-1',
        assigned_by: 'admin-1'
      });
    });

    it('should handle partial bulk assignment success', async () => {
      const mockRpcResult = {
        success: true,
        updated_count: 2,
        total_requested: 3,
        invalid_entities: ['entity-3'],
        error: null
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockRpcResult, error: null });

      const result = await AssignmentService.bulkAssignEntities(
        ['entity-1', 'entity-2', 'entity-3'],
        'people',
        'user-1',
        'admin-1'
      );
      
      expect(result.success).toBe(true);
      expect(result.updated_count).toBe(2);
      expect(result.total_requested).toBe(3);
      expect(result.invalid_entities).toEqual(['entity-3']);
    });

    it('should fail when no entities provided', async () => {
      const result = await AssignmentService.bulkAssignEntities(
        [],
        'people',
        'user-1',
        'admin-1'
      );
      
      expect(result.success).toBe(false);
      expect(result.updated_count).toBe(0);
      expect(result.total_requested).toBe(0);
      expect(result.errors).toContain('No entities provided for assignment');
    });

    it('should fail when new owner ID is missing', async () => {
      const result = await AssignmentService.bulkAssignEntities(
        ['entity-1', 'entity-2'],
        'people',
        '',
        'admin-1'
      );
      
      expect(result.success).toBe(false);
      expect(result.updated_count).toBe(0);
      expect(result.total_requested).toBe(2);
      expect(result.errors).toContain('New owner ID is required');
    });

    it('should handle RPC error', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: null, 
        error: { message: 'RPC function failed' } 
      });

      const result = await AssignmentService.bulkAssignEntities(
        ['entity-1', 'entity-2'],
        'people',
        'user-1',
        'admin-1'
      );
      
      expect(result.success).toBe(false);
      expect(result.updated_count).toBe(0);
      expect(result.total_requested).toBe(2);
      expect(result.errors).toContain('RPC function failed');
    });
  });

  describe('reassignOrphanedRecords', () => {
    it('should successfully reassign orphaned records', async () => {
      const mockRpcResult = {
        total_records: 5,
        success: true
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockRpcResult, error: null });

      const result = await AssignmentService.reassignOrphanedRecords('deleted-user-1', 'new-user-1');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Successfully reassigned 5 records');
      expect(result.data).toEqual(mockRpcResult);
      expect(supabase.rpc).toHaveBeenCalledWith('reassign_orphaned_records', {
        deleted_user_id: 'deleted-user-1',
        new_owner_id: 'new-user-1'
      });
    });

    it('should handle RPC error in reassignment', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: null, 
        error: { message: 'Reassignment failed' } 
      });

      const result = await AssignmentService.reassignOrphanedRecords('deleted-user-1', 'new-user-1');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to reassign orphaned records');
      expect(result.error).toBe('Reassignment failed');
    });
  });

  describe('getAssignmentHistory', () => {
    it('should return assignment history successfully', async () => {
      const mockHistory = [
        {
          id: 'log-1',
          old_owner_id: 'user-1',
          new_owner_id: 'user-2',
          assigned_by: 'admin-1',
          assigned_at: '2024-01-01T00:00:00Z',
          notes: 'Reassigned due to workload',
          old_owner: { full_name: 'John Doe' },
          new_owner: { full_name: 'Jane Smith' },
          assigned_by_user: { full_name: 'Admin User' }
        }
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockHistory, error: null })
      };
      
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await AssignmentService.getAssignmentHistory('people', 'entity-1');
      
      expect(result).toEqual(mockHistory);
      expect(supabase.from).toHaveBeenCalledWith('assignment_logs');
      expect(mockQuery.eq).toHaveBeenCalledWith('entity_type', 'people');
      expect(mockQuery.eq).toHaveBeenCalledWith('entity_id', 'entity-1');
      expect(mockQuery.order).toHaveBeenCalledWith('assigned_at', { ascending: false });
    });

    it('should throw error when query fails', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Query failed' } })
      };
      
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(AssignmentService.getAssignmentHistory('people', 'entity-1'))
        .rejects.toThrow('Failed to fetch assignment history: Query failed');
    });
  });

  describe('getAssignmentStats', () => {
    it('should return assignment statistics successfully', async () => {
      const mockPeopleStats = { count: 10 };
      const mockCompaniesStats = { count: 5 };
      const mockJobsStats = { count: 3 };
      
      const mockUnassignedPeople = { count: 2 };
      const mockUnassignedCompanies = { count: 1 };
      const mockUnassignedJobs = { count: 0 };
      
      const mockUserStats = [
        {
          id: 'user-1',
          full_name: 'John Doe',
          people: [{ count: 5 }],
          companies: [{ count: 2 }],
          jobs: [{ count: 1 }]
        },
        {
          id: 'user-2',
          full_name: 'Jane Smith',
          people: [{ count: 5 }],
          companies: [{ count: 3 }],
          jobs: [{ count: 2 }]
        }
      ];

      // Mock all the queries
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        count: vi.fn().mockResolvedValue({ count: mockPeopleStats.count, error: null })
      };
      
      const mockUnassignedQuery = {
        select: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        count: vi.fn().mockResolvedValue({ count: mockUnassignedPeople.count, error: null })
      };
      
      const mockUserQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockUserStats, error: null })
      };
      
      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockQuery as any) // people stats
        .mockReturnValueOnce(mockQuery as any) // companies stats
        .mockReturnValueOnce(mockQuery as any) // jobs stats
        .mockReturnValueOnce(mockUnassignedQuery as any) // unassigned people
        .mockReturnValueOnce(mockUnassignedQuery as any) // unassigned companies
        .mockReturnValueOnce(mockUnassignedQuery as any) // unassigned jobs
        .mockReturnValueOnce(mockUserQuery as any); // user stats

      const result = await AssignmentService.getAssignmentStats();
      
      expect(result.totalAssigned).toBe(18); // 10 + 5 + 3
      expect(result.unassigned).toBe(3); // 2 + 1 + 0
      expect(result.byUser).toHaveLength(2);
      expect(result.byUser[0]).toEqual({
        userId: 'user-2',
        userName: 'Jane Smith',
        count: 10 // 5 + 3 + 2
      });
      expect(result.byUser[1]).toEqual({
        userId: 'user-1',
        userName: 'John Doe',
        count: 8 // 5 + 2 + 1
      });
    });

    it('should handle missing counts gracefully', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        count: vi.fn().mockResolvedValue({ count: null, error: null })
      };
      
      const mockUserQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [], error: null })
      };
      
      vi.mocked(supabase.from)
        .mockReturnValue(mockQuery as any)
        .mockReturnValue(mockUserQuery as any);

      const result = await AssignmentService.getAssignmentStats();
      
      expect(result.totalAssigned).toBe(0);
      expect(result.unassigned).toBe(0);
      expect(result.byUser).toEqual([]);
    });
  });
});
