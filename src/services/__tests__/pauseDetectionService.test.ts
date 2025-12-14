/**
 * Pause Detection Service Tests
 * Tests for workflow pause detection logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkAndPauseWorkflow,
  resumeLeadWorkflow,
  processEmailWebhook,
} from '../pauseDetectionService';
import { supabase } from '@/integrations/supabase/client';
import type { PauseRules } from '../workflowService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('pauseDetectionService', () => {
  const mockLeadId = 'lead-1';
  const mockWorkflowId = 'workflow-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkAndPauseWorkflow', () => {
    it('should return false if no pause rules', async () => {
      const result = await checkAndPauseWorkflow(mockLeadId, undefined);
      expect(result).toBe(false);
    });

    it('should pause workflow on reply', async () => {
      const pauseRules: PauseRules = { onReply: true };

      const mockActivities = [
        { activity_type: 'email_replied', timestamp: '2025-01-01T00:00:00Z' },
      ];

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockActivities,
            error: null,
          }),
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      });

      const mockInsert = vi.fn().mockResolvedValue({
        error: null,
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          select: mockSelect,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          update: mockUpdate,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          insert: mockInsert,
        } as unknown as ReturnType<typeof supabase.from>);

      const result = await checkAndPauseWorkflow(mockLeadId, pauseRules);

      expect(result).toBe(true);
      expect(mockUpdate).toHaveBeenCalled();
    });

    it('should pause workflow on click', async () => {
      const pauseRules: PauseRules = { onReply: false, onClick: true };

      const mockActivities = [
        { activity_type: 'email_clicked', timestamp: '2025-01-01T00:00:00Z' },
      ];

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockActivities,
            error: null,
          }),
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      });

      const mockInsert = vi.fn().mockResolvedValue({
        error: null,
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          select: mockSelect,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          update: mockUpdate,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          insert: mockInsert,
        } as unknown as ReturnType<typeof supabase.from>);

      const result = await checkAndPauseWorkflow(mockLeadId, pauseRules);

      expect(result).toBe(true);
    });

    it('should pause workflow on multiple opens', async () => {
      const pauseRules: PauseRules = { onReply: false, onOpenCount: 3 };

      const mockActivities = [
        { activity_type: 'email_opened', timestamp: '2025-01-01T00:00:00Z' },
        { activity_type: 'email_opened', timestamp: '2025-01-02T00:00:00Z' },
        { activity_type: 'email_opened', timestamp: '2025-01-03T00:00:00Z' },
        { activity_type: 'email_opened', timestamp: '2025-01-04T00:00:00Z' },
      ];

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockActivities,
            error: null,
          }),
        }),
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      });

      const mockInsert = vi.fn().mockResolvedValue({
        error: null,
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          select: mockSelect,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          update: mockUpdate,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          insert: mockInsert,
        } as unknown as ReturnType<typeof supabase.from>);

      const result = await checkAndPauseWorkflow(mockLeadId, pauseRules);

      expect(result).toBe(true);
    });

    it('should return false if no pause conditions met', async () => {
      const pauseRules: PauseRules = { onReply: true };

      const mockActivities = [
        { activity_type: 'email_opened', timestamp: '2025-01-01T00:00:00Z' },
      ];

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockActivities,
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await checkAndPauseWorkflow(mockLeadId, pauseRules);

      expect(result).toBe(false);
    });
  });

  describe('resumeLeadWorkflow', () => {
    it('should resume a paused workflow', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      });

      const mockInsert = vi.fn().mockResolvedValue({
        error: null,
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          update: mockUpdate,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          insert: mockInsert,
        } as unknown as ReturnType<typeof supabase.from>);

      await resumeLeadWorkflow(mockLeadId);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          workflow_status: 'active',
        })
      );
    });
  });

  describe('processEmailWebhook', () => {
    it('should process email opened event', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              workflow_id: mockWorkflowId,
              workflow_status: 'active',
            },
            error: null,
          }),
        }),
      });

      const mockWorkflowSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              pause_rules: { onOpenCount: 5 },
            },
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          insert: mockInsert,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          select: mockSelect,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          select: mockWorkflowSelect,
        } as unknown as ReturnType<typeof supabase.from>);

      await processEmailWebhook(mockLeadId, 'email_opened');

      expect(mockInsert).toHaveBeenCalled();
    });

    it('should not process if workflow already paused', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              workflow_id: mockWorkflowId,
              workflow_status: 'paused',
            },
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          insert: mockInsert,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          select: mockSelect,
        } as unknown as ReturnType<typeof supabase.from>);

      await processEmailWebhook(mockLeadId, 'email_opened');

      expect(mockInsert).toHaveBeenCalled();
      // Should not check pause rules if already paused
    });

    it('should not process if no workflow assigned', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              workflow_id: null,
              workflow_status: null,
            },
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce({
          insert: mockInsert,
        } as unknown as ReturnType<typeof supabase.from>)
        .mockReturnValueOnce({
          select: mockSelect,
        } as unknown as ReturnType<typeof supabase.from>);

      await processEmailWebhook(mockLeadId, 'email_replied');

      expect(mockInsert).toHaveBeenCalled();
    });
  });
});
