import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PopupModal } from '../PopupModal';

describe('PopupModal', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    icon: <div data-testid="test-icon">Icon</div>,
    children: <div data-testid="test-content">Content</div>,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders with accessibility attributes', () => {
    render(<PopupModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'popup-title');
    expect(modal).toHaveAttribute('aria-describedby', 'popup-description');
  });

  it('renders title and subtitle with proper IDs', () => {
    render(<PopupModal {...defaultProps} />);
    
    const title = screen.getByText('Test Title');
    expect(title).toHaveAttribute('id', 'popup-title');
    
    const subtitle = screen.getByText('Test Subtitle');
    expect(subtitle).toHaveAttribute('id', 'popup-description');
  });

  it('handles escape key', () => {
    render(<PopupModal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles backdrop click', async () => {
    render(<PopupModal {...defaultProps} />);
    
    // Get the backdrop element (the outer div with role="dialog")
    const backdrop = screen.getByRole('dialog');
    // Simulate clicking on the backdrop itself (not the modal content)
    fireEvent.click(backdrop, { target: backdrop });
    
    // Wait for the animation delay (200ms) before checking
    await new Promise(resolve => setTimeout(resolve, 250));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<PopupModal {...defaultProps} isLoading={true} />);
    
    // Should show skeleton elements
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error state', () => {
    const error = new Error('Test error');
    render(<PopupModal {...defaultProps} error={error} />);
    
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    // LoadingState shows errorText, not the actual error message
  });

  it('does not render when isOpen is false', () => {
    render(<PopupModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

