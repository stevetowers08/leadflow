import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PopupModal } from '../PopupModal';

describe('PopupModal', () => {
  const mockOnClose = jest.fn();
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

  it('handles backdrop click', () => {
    render(<PopupModal {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
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
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<PopupModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

