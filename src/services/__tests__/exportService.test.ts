/**
 * Export Service Tests
 * Tests for CSV/JSON export functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportLeadsToCSV,
  exportLeadsToJSON,
  downloadExport,
} from '../exportService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('exportService', () => {
  const mockLeads = [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      job_title: 'CEO',
      quality_rank: 'hot',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      company: 'Tech Inc',
      job_title: 'CTO',
      quality_rank: 'warm',
      status: 'active',
      created_at: '2025-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportLeadsToCSV', () => {
    it('should export leads to CSV format', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockLeads,
          error: null,
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const csv = await exportLeadsToCSV({ format: 'csv' });

      expect(csv).toContain('first_name,last_name,email,company');
      expect(csv).toContain('John,Doe,john@example.com,Acme Corp');
    });

    it('should apply filters', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [mockLeads[0]],
          error: null,
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      await exportLeadsToCSV({
        format: 'csv',
        filters: { status: 'active', qualityRank: 'hot' },
      });

      expect(mockSelect).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const csv = await exportLeadsToCSV({ format: 'csv' });

      expect(csv).toBe('No leads to export');
    });
  });

  describe('exportLeadsToJSON', () => {
    it('should export leads to JSON format', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: mockLeads,
          error: null,
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const json = await exportLeadsToJSON({ format: 'json' });
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toMatchObject(mockLeads[0]);
    });

    it('should filter fields when specified', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: mockLeads,
          error: null,
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as unknown as ReturnType<typeof supabase.from>);

      const json = await exportLeadsToJSON({
        format: 'json',
        fields: ['first_name', 'email'],
      });
      const parsed = JSON.parse(json);

      expect(parsed[0]).toHaveProperty('first_name');
      expect(parsed[0]).toHaveProperty('email');
      expect(parsed[0]).not.toHaveProperty('last_name');
    });
  });

  describe('downloadExport', () => {
    it('should create download link and trigger download', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      downloadExport('test data', 'test.csv', 'text/csv');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });
  });
});
