/**
 * Status Utils Tests
 * Tests for status mapping and display utilities
 */

import { describe, it, expect } from 'vitest';
import {
  getStatusDisplayText,
  normalizeStatus,
  normalizePeopleStage,
  normalizeCompanyStage,
  getStatusColorClass,
  isValidStatus,
} from '../statusUtils';

describe('statusUtils', () => {
  describe('getStatusDisplayText', () => {
    it('should return display text for people stages', () => {
      expect(getStatusDisplayText('new_lead')).toBe('New Lead');
      expect(getStatusDisplayText('message_sent')).toBe('Message Sent');
      expect(getStatusDisplayText('replied')).toBe('Replied');
    });

    it('should return display text for company stages', () => {
      expect(getStatusDisplayText('closed_won')).toBe('Closed Won');
      expect(getStatusDisplayText('closed_lost')).toBe('Closed Lost');
      expect(getStatusDisplayText('on_hold')).toBe('On Hold');
    });

    it('should convert unknown statuses to title case', () => {
      expect(getStatusDisplayText('custom_status')).toBe('Custom Status');
      expect(getStatusDisplayText('another-status')).toBe('Another Status');
    });

    it('should handle empty status', () => {
      expect(getStatusDisplayText('')).toBe('');
    });
  });

  describe('normalizeStatus', () => {
    it('should normalize legacy statuses', () => {
      expect(normalizeStatus('NEW')).toBe('new');
      expect(normalizeStatus('IN QUEUE')).toBe('qualified');
      expect(normalizeStatus('REPLIED')).toBe('proceed');
      expect(normalizeStatus('LEAD LOST')).toBe('skip');
    });

    it('should return new statuses as-is', () => {
      expect(normalizeStatus('new')).toBe('new');
      expect(normalizeStatus('qualified')).toBe('qualified');
      expect(normalizeStatus('proceed')).toBe('proceed');
      expect(normalizeStatus('skip')).toBe('skip');
    });

    it('should handle null values', () => {
      expect(normalizeStatus(null)).toBe('new');
    });
  });

  describe('normalizePeopleStage', () => {
    it('should normalize people stages', () => {
      expect(normalizePeopleStage('new')).toBe('new_lead');
      expect(normalizePeopleStage('qualified')).toBe('interested');
      expect(normalizePeopleStage('proceed')).toBe('meeting_scheduled');
      expect(normalizePeopleStage('skip')).toBe('not_interested');
    });

    it('should return new stages as-is', () => {
      expect(normalizePeopleStage('new_lead')).toBe('new_lead');
      expect(normalizePeopleStage('message_sent')).toBe('message_sent');
    });

    it('should handle null values', () => {
      expect(normalizePeopleStage(null)).toBe('new_lead');
    });
  });

  describe('normalizeCompanyStage', () => {
    it('should normalize company stages', () => {
      expect(normalizeCompanyStage('new')).toBe('new_lead');
      expect(normalizeCompanyStage('proceed')).toBe('meeting_scheduled');
      expect(normalizeCompanyStage('skip')).toBe('closed_lost');
    });

    it('should return new stages as-is', () => {
      expect(normalizeCompanyStage('new_lead')).toBe('new_lead');
      expect(normalizeCompanyStage('closed_won')).toBe('closed_won');
    });
  });

  describe('getStatusColorClass', () => {
    it('should return success color for positive states', () => {
      const color = getStatusColorClass('qualified');
      expect(color).toContain('success');
    });

    it('should return warning color for neutral states', () => {
      const color = getStatusColorClass('maybe');
      expect(color).toContain('warning');
    });

    it('should return destructive color for negative states', () => {
      const color = getStatusColorClass('not_interested');
      expect(color).toContain('destructive');
    });

    it('should return primary color for default states', () => {
      const color = getStatusColorClass('new_lead');
      expect(color).toContain('primary');
    });
  });

  describe('isValidStatus', () => {
    it('should return true for valid statuses', () => {
      expect(isValidStatus('new')).toBe(true);
      expect(isValidStatus('qualified')).toBe(true);
    });

    it('should return false for null', () => {
      expect(isValidStatus(null)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidStatus('')).toBe(false);
      expect(isValidStatus('   ')).toBe(false);
    });
  });
});
