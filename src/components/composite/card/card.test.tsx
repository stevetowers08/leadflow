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
    render(
      <Card>
        <CardContent>Test content</CardContent>
      </Card>
    );
    const card = screen.getByText('Test content').closest('div');
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card');
  });

  it('renders card with outlined variant', () => {
    render(
      <Card variant='outlined'>
        <CardContent>Test content</CardContent>
      </Card>
    );
    const card = screen.getByText('Test content').closest('div');
    expect(card).toHaveClass('border-2');
  });

  it('renders card with elevated variant', () => {
    render(
      <Card variant='elevated'>
        <CardContent>Test content</CardContent>
      </Card>
    );
    const card = screen.getByText('Test content').closest('div');
    expect(card).toHaveClass('shadow-md');
  });

  it('renders interactive card with proper attributes', () => {
    render(
      <Card interactive>
        <CardContent>Clickable card</CardContent>
      </Card>
    );
    const card = screen.getByText('Clickable card').closest('div');
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
