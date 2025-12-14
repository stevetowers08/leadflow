/**
 * Lemlist Service Tests
 * Tests for Lemlist API integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LemlistService } from '../lemlistService';

// Mock fetch globally
global.fetch = vi.fn();

describe('LemlistService', () => {
  const mockApiKey = 'test-api-key';
  const mockEmail = 'test@example.com';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(global.fetch).mockClear();
  });

  describe('constructor and configuration', () => {
    it('should initialize with API key', () => {
      const service = new LemlistService(mockApiKey, mockEmail);

      expect(service.isConnected()).toBe(true);
      expect(service.getEmail()).toBe(mockEmail);
    });

    it('should initialize without API key', () => {
      const service = new LemlistService();

      expect(service.isConnected()).toBe(false);
    });

    it('should set API key', () => {
      const service = new LemlistService();
      service.setApiKey(mockApiKey);

      expect(service.isConnected()).toBe(true);
    });

    it('should set email', () => {
      const service = new LemlistService();
      service.setEmail(mockEmail);

      expect(service.getEmail()).toBe(mockEmail);
    });

    it('should set user ID', () => {
      const service = new LemlistService();
      service.setUserId('user-123');

      // User ID is used internally for API route calls
      expect(service).toBeDefined();
    });
  });

  describe('getCampaigns', () => {
    it('should fetch campaigns successfully', async () => {
      const mockCampaigns = [
        {
          _id: 'campaign-1',
          name: 'Test Campaign',
          status: 'active',
          createdAt: '2025-01-01T00:00:00Z',
        },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCampaigns }),
      } as Response);

      const service = new LemlistService(mockApiKey);
      const campaigns = await service.getCampaigns();

      expect(campaigns).toHaveLength(1);
      expect(campaigns[0].id).toBe('campaign-1');
      expect(campaigns[0].name).toBe('Test Campaign');
    });

    it('should throw error if API key not configured', async () => {
      const service = new LemlistService();

      await expect(service.getCampaigns()).rejects.toThrow(
        'Lemlist API key not configured'
      );
    });

    it('should handle API errors', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Unauthorized' }),
      } as Response);

      const service = new LemlistService(mockApiKey);

      await expect(service.getCampaigns()).rejects.toThrow();
    });
  });

  describe('addLeadToCampaign', () => {
    it('should add lead to campaign successfully', async () => {
      const mockResponse = {
        _id: 'lead-1',
        email: 'test@example.com',
        campaignId: 'campaign-1',
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const service = new LemlistService(mockApiKey);
      const result = await service.addLeadToCampaign('campaign-1', {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme Corp',
      });

      expect(result).toBeDefined();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw error if API key not configured', async () => {
      const service = new LemlistService();

      await expect(
        service.addLeadToCampaign('campaign-1', {
          email: 'test@example.com',
        })
      ).rejects.toThrow('Lemlist API key not configured');
    });
  });

  describe('getCampaignStats', () => {
    it('should fetch campaign statistics', async () => {
      const mockStats = {
        total_sent: 100,
        total_opened: 50,
        total_clicked: 25,
        total_replied: 10,
        total_bounced: 5,
        total_positive_replies: 8,
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockStats }),
      } as Response);

      const service = new LemlistService(mockApiKey);
      const stats = await service.getCampaignStats('campaign-1');

      expect(stats.total_sent).toBe(100);
      expect(stats.total_opened).toBe(50);
      expect(stats.total_replied).toBe(10);
    });
  });

  describe('pauseLead', () => {
    it('should pause a lead in campaign', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const service = new LemlistService(mockApiKey);
      await service.pauseLead('campaign-1', 'lead-1');

      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
