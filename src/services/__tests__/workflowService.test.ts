/**
 * Workflow Service Tests
 * Tests for workflow CRUD operations and automation logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getWorkflowStats,
  shouldPauseWorkflow,
  assignLeadToWorkflow,
  type Workflow,
  type PauseRules,
} from '../workflowService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('workflowService', () => {
  const mockUser = { id: 'test-user-id' };
  const mockWorkflow: Workflow = {
    id: 'workflow-1',
    user_id: 'test-user-id',
    name: 'Test Workflow',
    description: 'Test description',
    status: 'active',
    email_provider: 'gmail',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
  });

  describe('getWorkflows', () => {
    it('should fetch all workflows', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [mockWorkflow],
          error: null,
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await getWorkflows();

      expect(result).toEqual([mockWorkflow]);
    });

    it('should throw error on database failure', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Query failed' },
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      await expect(getWorkflows()).rejects.toThrow('Failed to fetch workflows');
    });
  });

  describe('getWorkflow', () => {
    it('should fetch a workflow by ID', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockWorkflow,
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await getWorkflow('workflow-1');

      expect(result).toEqual(mockWorkflow);
    });

    it('should throw error on database failure', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' },
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      await expect(getWorkflow('workflow-1')).rejects.toThrow(
        'Failed to fetch workflow'
      );
    });
  });

  describe('createWorkflow', () => {
    it('should create a new workflow', async () => {
      const workflowData = {
        name: 'New Workflow',
        status: 'draft' as const,
        email_provider: 'gmail' as const,
      };

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { ...mockWorkflow, ...workflowData },
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await createWorkflow(workflowData);

      expect(result).toMatchObject(workflowData);
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          ...workflowData,
          user_id: mockUser.id,
        })
      );
    });

    it('should throw error if user not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(
        createWorkflow({
          name: 'Test',
          status: 'draft',
          email_provider: 'gmail',
        })
      ).rejects.toThrow('User not authenticated');
    });
  });

  describe('updateWorkflow', () => {
    it('should update an existing workflow', async () => {
      const updates = { name: 'Updated Workflow', status: 'paused' as const };

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { ...mockWorkflow, ...updates },
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await updateWorkflow('workflow-1', updates);

      expect(result).toMatchObject(updates);
    });
  });

  describe('deleteWorkflow', () => {
    it('should delete a workflow', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as unknown as ReturnType<typeof supabase.from>);

      await deleteWorkflow('workflow-1');

      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe('getWorkflowStats', () => {
    it('should calculate workflow statistics', async () => {
      const mockLeads = [
        { id: 'lead-1', status: 'active' },
        { id: 'lead-2', status: 'active' },
        { id: 'lead-3', status: 'responded' },
      ];

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: mockLeads,
          error: null,
        }),
      });

      const mockActivitySelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { timestamp: '2025-01-01T00:00:00Z' },
                error: null,
              }),
            }),
          }),
        }),
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          select: mockSelect,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          select: mockActivitySelect,
        } as unknown as ReturnType<typeof supabase.from>);

      const result = await getWorkflowStats('workflow-1');

      expect(result.activeLeads).toBe(2);
      expect(result.respondedLeads).toBe(1);
      expect(result.responseRate).toBe(50);
    });
  });

  describe('shouldPauseWorkflow', () => {
    it('should return true if onReply is true and hasReplied is true', () => {
      const pauseRules: PauseRules = { onReply: true };
      const activity = { hasReplied: true };

      expect(shouldPauseWorkflow(pauseRules, activity)).toBe(true);
    });

    it('should return true if onClick is true and hasClicked is true', () => {
      const pauseRules: PauseRules = { onReply: false, onClick: true };
      const activity = { hasClicked: true };

      expect(shouldPauseWorkflow(pauseRules, activity)).toBe(true);
    });

    it('should return true if openCount exceeds onOpenCount', () => {
      const pauseRules: PauseRules = { onReply: false, onOpenCount: 3 };
      const activity = { openCount: 5 };

      expect(shouldPauseWorkflow(pauseRules, activity)).toBe(true);
    });

    it('should return false if no pause conditions are met', () => {
      const pauseRules: PauseRules = { onReply: true };
      const activity = { hasReplied: false };

      expect(shouldPauseWorkflow(pauseRules, activity)).toBe(false);
    });

    it('should return false if pauseRules is undefined', () => {
      expect(shouldPauseWorkflow(undefined, { hasReplied: true })).toBe(false);
    });
  });

  describe('assignLeadToWorkflow', () => {
    it('should assign a lead to a workflow', async () => {
      const mockWorkflowSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockWorkflow,
            error: null,
          }),
        }),
      });

      const mockLeadSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'lead-1',
              email: 'test@example.com',
              first_name: 'Test',
              last_name: 'User',
              company: 'Test Corp',
            },
            error: null,
          }),
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          select: mockWorkflowSelect,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          select: mockLeadSelect,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          update: mockUpdate,
        } as unknown as ReturnType<typeof supabase.from>);

      await assignLeadToWorkflow('lead-1', 'workflow-1');

      expect(mockUpdate).toHaveBeenCalled();
    });

    it('should throw error if user not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(
        assignLeadToWorkflow('lead-1', 'workflow-1')
      ).rejects.toThrow('User not authenticated');
    });
  });
});
