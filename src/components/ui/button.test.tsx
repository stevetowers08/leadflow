/**
 * Button Component Tests
 * Example test file demonstrating testing patterns for design system components
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders with correct variant styles', () => {
    render(<Button variant='default'>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders with correct size styles', () => {
    render(<Button size='lg'>Large Button</Button>);
    const button = screen.getByRole('button', { name: /large button/i });
    expect(button).toHaveClass('h-11');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard accessible', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    // Test Space key
    button.focus();
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Test Enter key
    handleClick.mockClear();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('renders with asChild prop', () => {
    render(
      <Button asChild>
        <a href='/test'>Link Button</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies custom className', () => {
    render(<Button className='custom-class'>Custom</Button>);
    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('custom-class');
  });

  it('has proper ARIA attributes when provided', () => {
    render(
      <Button aria-label='Delete item' aria-describedby='delete-description'>
        Delete
      </Button>
    );
    const button = screen.getByRole('button', { name: /delete item/i });
    expect(button).toHaveAttribute('aria-label', 'Delete item');
    expect(button).toHaveAttribute('aria-describedby', 'delete-description');
  });
});
