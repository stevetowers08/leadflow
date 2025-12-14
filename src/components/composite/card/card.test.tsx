/**
 * Card Component Tests
 * Example test file for compound component pattern
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';

describe('Card', () => {
  it('renders card with default variant', () => {
    const { container } = render(
      <Card data-testid='card'>
        <CardContent>Test content</CardContent>
      </Card>
    );
    const card = container.querySelector('[data-testid="card"]');
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card');
  });

  it('renders card with outlined variant', () => {
    const { container } = render(
      <Card variant='outlined' data-testid='card'>
        <CardContent>Test content</CardContent>
      </Card>
    );
    const card = container.querySelector('[data-testid="card"]');
    expect(card).toHaveClass('border-2');
  });

  it('renders card with elevated variant', () => {
    const { container } = render(
      <Card variant='elevated' data-testid='card'>
        <CardContent>Test content</CardContent>
      </Card>
    );
    const card = container.querySelector('[data-testid="card"]');
    // Elevated variant uses shadowTokens.semantic.elevation.level2 (CSS variable)
    // Verify card renders with base classes
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card');
    expect(card).toBeInTheDocument();
  });

  it('renders interactive card with proper attributes', () => {
    const { container } = render(
      <Card interactive data-testid='card'>
        <CardContent>Clickable card</CardContent>
      </Card>
    );
    const card = container.querySelector('[data-testid="card"]');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('renders compound component structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('renders CardTitle with custom heading level', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle as='h1'>H1 Title</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('H1 Title');
  });
});
