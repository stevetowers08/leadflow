/**
 * Reporting Service Tests
 *
 * Comprehensive tests for the reporting service functionality
 */

import { supabase } from '@/integrations/supabase/client';
import { ReportingService } from '@/services/reportingService';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('ReportingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCoreCounts', () => {
    it('should return correct counts when data exists', async () => {
      // Mock the Supabase responses
      const mockFrom = vi.fn();
      vi.mocked(supabase.from).mockReturnValue(mockFrom);

      mockFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            count: 100,
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            count: 50,
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            count: 200,
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              count: 25,
            }),
          }),
        });

      const result = await ReportingService.getReportingData({ period: '30d' });

      expect(result.totalPeople).toBe(100);
      expect(result.totalCompanies).toBe(50);
      expect(result.totalJobs).toBe(200);
      expect(result.qualifiedJobs).toBe(25);
    });

    it('should handle empty data gracefully', async () => {
      const mockFrom = vi.fn();
      vi.mocked(supabase.from).mockReturnValue(mockFrom);

      mockFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            count: 0,
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            count: 0,
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            count: 0,
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              count: 0,
            }),
          }),
        });

      const result = await ReportingService.getReportingData({ period: '30d' });

      expect(result.totalPeople).toBe(0);
      expect(result.totalCompanies).toBe(0);
      expect(result.totalJobs).toBe(0);
      expect(result.qualifiedJobs).toBe(0);
    });
  });

  describe('getPeoplePipeline', () => {
    it('should correctly categorize people by stage', async () => {
      const mockFrom = vi.fn();
      vi.mocked(supabase.from).mockReturnValue(mockFrom);

      const mockData = [
        { people_stage: 'new_lead' },
        { people_stage: 'new_lead' },
        { people_stage: 'message_sent' },
        { people_stage: 'replied' },
        { people_stage: 'not_interested' },
        { people_stage: null }, // Should be ignored
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          not: vi.fn().mockReturnValue({
            data: mockData,
            error: null,
          }),
        }),
      });

      const result = await ReportingService.getReportingData({ period: '30d' });

      expect(result.peoplePipeline.new_lead).toBe(2);
      expect(result.peoplePipeline.message_sent).toBe(1);
      expect(result.peoplePipeline.replied).toBe(1);
      expect(result.peoplePipeline.not_interested).toBe(1);
    });
  });

  describe('getJobQualification', () => {
    it('should correctly categorize jobs by qualification status', async () => {
      const mockFrom = vi.fn();
      vi.mocked(supabase.from).mockReturnValue(mockFrom);

      const mockData = [
        { qualification_status: 'new' },
        { qualification_status: 'new' },
        { qualification_status: 'qualify' },
        { qualification_status: 'skip' },
        { qualification_status: null }, // Should be ignored
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          data: mockData,
          error: null,
        }),
      });

      const result = await ReportingService.getReportingData({ period: '30d' });

      expect(result.jobQualification.new).toBe(2);
      expect(result.jobQualification.qualify).toBe(1);
      expect(result.jobQualification.skip).toBe(1);
    });
  });

  describe('getTopJobFunctions', () => {
    it('should return top job functions sorted by count', async () => {
      const mockFrom = vi.fn();
      vi.mocked(supabase.from).mockReturnValue(mockFrom);

      const mockData = [
        { function: 'Sales' },
        { function: 'Sales' },
        { function: 'Sales' },
        { function: 'Marketing' },
        { function: 'Marketing' },
        { function: 'Engineering' },
        { function: null }, // Should be ignored
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          not: vi.fn().mockReturnValue({
            data: mockData,
            error: null,
          }),
        }),
      });

      const result = await ReportingService.getReportingData({ period: '30d' });

      expect(result.topJobFunctions).toHaveLength(3);
      expect(result.topJobFunctions[0]).toEqual({
        function: 'Sales',
        count: 3,
      });
      expect(result.topJobFunctions[1]).toEqual({
        function: 'Marketing',
        count: 2,
      });
      expect(result.topJobFunctions[2]).toEqual({
        function: 'Engineering',
        count: 1,
      });
    });
  });

  describe('getTopCompaniesByJobs', () => {
    it('should return top companies sorted by job count', async () => {
      const mockFrom = vi.fn();
      vi.mocked(supabase.from).mockReturnValue(mockFrom);

      const mockData = [
        { company_id: '1', companies: { name: 'Company A' } },
        { company_id: '1', companies: { name: 'Company A' } },
        { company_id: '2', companies: { name: 'Company B' } },
        { company_id: '3', companies: { name: 'Company C' } },
        { company_id: '3', companies: { name: 'Company C' } },
        { company_id: '3', companies: { name: 'Company C' } },
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          data: mockData,
          error: null,
        }),
      });

      const result = await ReportingService.getReportingData({ period: '30d' });

      expect(result.topCompaniesByJobs).toHaveLength(3);
      expect(result.topCompaniesByJobs[0]).toEqual({
        companyName: 'Company C',
        jobCount: 3,
      });
      expect(result.topCompaniesByJobs[1]).toEqual({
        companyName: 'Company A',
        jobCount: 2,
      });
      expect(result.topCompaniesByJobs[2]).toEqual({
        companyName: 'Company B',
        jobCount: 1,
      });
    });
  });

  describe('getRecentActivity', () => {
    it('should return recent activity sorted by timestamp', async () => {
      const mockFrom = vi.fn();
      vi.mocked(supabase.from).mockReturnValue(mockFrom);

      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

      const mockJobs = [
        {
          id: '1',
          title: 'Job 1',
          created_at: oneHourAgo.toISOString(),
          companies: { name: 'Company A' },
        },
      ];

      const mockQualifiedJobs = [
        {
          id: '2',
          title: 'Job 2',
          qualified_at: twoHoursAgo.toISOString(),
          companies: { name: 'Company B' },
        },
      ];

      const mockPeople = [
        {
          id: '1',
          name: 'Person 1',
          created_at: now.toISOString(),
          companies: { name: 'Company C' },
        },
      ];

      mockFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              lte: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue({
                    data: mockJobs,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                lte: vi.fn().mockReturnValue({
                  order: vi.fn().mockReturnValue({
                    limit: vi.fn().mockReturnValue({
                      data: mockQualifiedJobs,
                      error: null,
                    }),
                  }),
                }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              lte: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue({
                    data: mockPeople,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        });

      const result = await ReportingService.getReportingData({ period: '30d' });

      expect(result.recentActivity).toHaveLength(3);
      expect(result.recentActivity[0].type).toBe('person_added');
      expect(result.recentActivity[1].type).toBe('job_discovered');
      expect(result.recentActivity[2].type).toBe('job_qualified');
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      const mockFrom = vi.fn();
      vi.mocked(supabase.from).mockReturnValue(mockFrom);

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          count: null,
          error: { message: 'Database error' },
        }),
      });

      await expect(
        ReportingService.getReportingData({ period: '30d' })
      ).rejects.toThrow('Failed to fetch reporting data');
    });
  });
});
