/**
 * Leads Service Tests
 * Tests for lead CRUD operations and business logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createLead,
  updateLead,
  getLead,
  getLeads,
  deleteLead,
  getLeadStats,
  type CreateLeadInput,
  type UpdateLeadInput,
} from '../leadsService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('leadsService', () => {
  const mockUser = { id: 'test-user-id' };
  const mockLead = {
    id: 'lead-1',
    user_id: 'test-user-id',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corp',
    job_title: 'CEO',
    phone: '+1234567890',
    status: 'processing' as const,
    quality_rank: 'hot' as const,
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

  describe('createLead', () => {
    it('should create a new lead with user ID', async () => {
      const input: CreateLeadInput = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        company: 'Acme Corp',
      };

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { ...mockLead, ...input },
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await createLead(input);

      expect(result).toMatchObject(input);
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          ...input,
          user_id: mockUser.id,
          status: 'processing',
        })
      );
    });

    it('should use provided user_id if given', async () => {
      const input: CreateLeadInput = {
        first_name: 'Jane',
        user_id: 'custom-user-id',
      };

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { ...mockLead, ...input, user_id: 'custom-user-id' },
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await createLead(input);

      expect(result.user_id).toBe('custom-user-id');
    });

    it('should throw error on database failure', async () => {
      const input: CreateLeadInput = {
        first_name: 'John',
      };

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as unknown as ReturnType<typeof supabase.from>);

      await expect(createLead(input)).rejects.toThrow('Failed to create lead');
    });
  });

  describe('updateLead', () => {
    it('should update an existing lead', async () => {
      const input: UpdateLeadInput = {
        first_name: 'Jane',
        status: 'active',
      };

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { ...mockLead, ...input },
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await updateLead('lead-1', input);

      expect(result).toMatchObject(input);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          ...input,
          updated_at: expect.any(String),
        })
      );
    });

    it('should throw error on database failure', async () => {
      const input: UpdateLeadInput = { first_name: 'Jane' };

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Update failed' },
            }),
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate,
      } as unknown as ReturnType<typeof supabase.from>);

      await expect(updateLead('lead-1', input)).rejects.toThrow(
        'Failed to update lead'
      );
    });
  });

  describe('getLead', () => {
    it('should fetch a lead by ID', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockLead,
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await getLead('lead-1');

      expect(result).toEqual(mockLead);
      expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('should return null if lead not found', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116', message: 'Not found' },
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await getLead('non-existent');

      expect(result).toBeNull();
    });

    it('should throw error on other database errors', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      await expect(getLead('lead-1')).rejects.toThrow('Failed to get lead');
    });
  });

  describe('getLeads', () => {
    it('should fetch all leads', async () => {
      const mockLeads = [mockLead, { ...mockLead, id: 'lead-2' }];

      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: mockLeads,
          error: null,
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await getLeads();

      expect(result).toEqual(mockLeads);
    });

    it('should filter by quality_rank', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [mockLead],
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await getLeads({ quality_rank: 'hot' });

      expect(result).toHaveLength(1);
    });

    it('should filter by status', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [mockLead],
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await getLeads({ status: 'active' });

      expect(result).toHaveLength(1);
    });

    it('should apply pagination', async () => {
      const mockRange = vi.fn().mockResolvedValue({
        data: [mockLead],
        error: null,
      });
      const mockLimit = vi.fn().mockReturnValue({
        range: mockRange,
      });
      const mockOrder = vi.fn().mockReturnValue({
        limit: mockLimit,
      });
      const mockSelect = vi.fn().mockReturnValue({
        order: mockOrder,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const result = await getLeads({ limit: 10, offset: 0 });

      expect(result).toHaveLength(1);
      expect(mockRange).toHaveBeenCalledWith(0, 9);
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

      await expect(getLeads()).rejects.toThrow('Failed to get leads');
    });
  });

  describe('deleteLead', () => {
    it('should delete a lead', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: [{ id: 'lead-1' }],
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as unknown as ReturnType<typeof supabase.from>);

      await deleteLead('lead-1');

      expect(mockDelete).toHaveBeenCalled();
    });

    it('should throw error if lead not found', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as unknown as ReturnType<typeof supabase.from>);

      await expect(deleteLead('lead-1')).rejects.toThrow(
        'Lead not found or access denied'
      );
    });

    it('should throw error if access denied', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as unknown as ReturnType<typeof supabase.from>);

      await expect(deleteLead('lead-1')).rejects.toThrow(
        'Lead not found or access denied'
      );
    });

    it('should throw error on delete failure', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Delete failed' },
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      } as unknown as ReturnType<typeof supabase.from>);

      await expect(deleteLead('lead-1')).rejects.toThrow(
        'Failed to delete lead'
      );
    });
  });

  describe('getLeadStats', () => {
    it('should fetch lead statistics', async () => {
      // Create separate mock chains for each query
      const createMockQuery = (count: number) => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            count,
            error: null,
          }),
        }),
      });

      // Mock 6 different calls (total, hot, warm, cold, active, processing)
      vi.mocked(supabase.from)
        .mockReturnValueOnce(
          createMockQuery(100) as unknown as ReturnType<typeof supabase.from>
        ) // total
        .mockReturnValueOnce(
          createMockQuery(30) as unknown as ReturnType<typeof supabase.from>
        ) // hot
        .mockReturnValueOnce(
          createMockQuery(40) as unknown as ReturnType<typeof supabase.from>
        ) // warm
        .mockReturnValueOnce(
          createMockQuery(30) as unknown as ReturnType<typeof supabase.from>
        ) // cold
        .mockReturnValueOnce(
          createMockQuery(50) as unknown as ReturnType<typeof supabase.from>
        ) // active
        .mockReturnValueOnce(
          createMockQuery(20) as unknown as ReturnType<typeof supabase.from>
        ); // processing

      const result = await getLeadStats();

      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('hot');
      expect(result).toHaveProperty('warm');
      expect(result).toHaveProperty('cold');
      expect(result).toHaveProperty('active');
      expect(result).toHaveProperty('processing');
      expect(result.total).toBe(100);
      expect(result.hot).toBe(30);
    });

    it('should handle zero counts', async () => {
      const createMockQuery = () => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            count: 0,
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce(
          createMockQuery() as unknown as ReturnType<typeof supabase.from>
        )
        .mockReturnValueOnce(
          createMockQuery() as unknown as ReturnType<typeof supabase.from>
        )
        .mockReturnValueOnce(
          createMockQuery() as unknown as ReturnType<typeof supabase.from>
        )
        .mockReturnValueOnce(
          createMockQuery() as unknown as ReturnType<typeof supabase.from>
        )
        .mockReturnValueOnce(
          createMockQuery() as unknown as ReturnType<typeof supabase.from>
        )
        .mockReturnValueOnce(
          createMockQuery() as unknown as ReturnType<typeof supabase.from>
        );

      const result = await getLeadStats();

      expect(result.total).toBe(0);
      expect(result.hot).toBe(0);
      expect(result.warm).toBe(0);
      expect(result.cold).toBe(0);
    });

    it('should throw error on database failure', async () => {
      const createMockQuery = (hasError: boolean) => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            count: null,
            error: hasError ? { message: 'Query failed' } : null,
          }),
        }),
      });

      vi.mocked(supabase.from)
        .mockReturnValueOnce(
          createMockQuery(true) as unknown as ReturnType<typeof supabase.from>
        ) // total - error
        .mockReturnValueOnce(
          createMockQuery(false) as unknown as ReturnType<typeof supabase.from>
        )
        .mockReturnValueOnce(
          createMockQuery(false) as unknown as ReturnType<typeof supabase.from>
        )
        .mockReturnValueOnce(
          createMockQuery(false) as unknown as ReturnType<typeof supabase.from>
        )
        .mockReturnValueOnce(
          createMockQuery(false) as unknown as ReturnType<typeof supabase.from>
        )
        .mockReturnValueOnce(
          createMockQuery(false) as unknown as ReturnType<typeof supabase.from>
        );

      await expect(getLeadStats()).rejects.toThrow('Failed to get lead stats');
    });
  });
});
