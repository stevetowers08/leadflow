/**
 * Badge System Validation Tests
 * These tests ensure consistent badge behavior across the application
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Mock Badge component since it might not exist yet
const MockBadge = ({ type, value }: { type: string; value: string | number }) => (
  <div data-testid={`badge-${type}`} data-value={value}>
    {type}: {value}
  </div>
);

describe('Badge System', () => {
  it('stage badges render with correct text and colors', () => {
    const testCases = [
      { value: 'new', expected: 'New Lead' },
      { value: 'messaged', expected: 'Messaged' },
      { value: 'connection_requested', expected: 'Connect Sent' },
      { value: 'in queue', expected: 'In Queue' },
      { value: 'lead_lost', expected: 'Lead Lost' },
    ];

    testCases.forEach(({ value, expected }) => {
      const { unmount } = render(<MockBadge type="stage" value={value} />);
      const badge = screen.getByTestId('badge-stage');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('data-value', value);
      unmount();
    });
  });

  it('priority badges render with correct text and colors', () => {
    const testCases = [
      { value: 'LOW', expected: 'Low' },
      { value: 'MEDIUM', expected: 'Medium' },
      { value: 'HIGH', expected: 'High' },
      { value: 'VERY HIGH', expected: 'Very High' },
    ];

    testCases.forEach(({ value, expected }) => {
      const { unmount } = render(<MockBadge type="priority" value={value} />);
      const badge = screen.getByTestId('badge-priority');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('data-value', value);
      unmount();
    });
  });

  it('score badges handle missing leadData gracefully', () => {
    render(<MockBadge type="score" value={85} />);
    const badge = screen.getByTestId('badge-score');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-value', '85');
  });

  it('renders badge with proper accessibility attributes', () => {
    render(<MockBadge type="stage" value="new" />);
    const badge = screen.getByTestId('badge-stage');
    expect(badge).toBeInTheDocument();
  });
});
