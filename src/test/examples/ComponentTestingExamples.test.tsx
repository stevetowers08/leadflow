import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Example: Testing a Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
}) => {
  const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2';
  const variantClasses = {
    primary: 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 focus:ring-sidebar-primary',
    secondary: 'bg-muted text-muted-foreground hover:bg-muted/80 focus:ring-muted',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

// Example: Testing a Form Component
interface FormProps {
  onSubmit: (data: { name: string; email: string }) => void;
  initialData?: { name: string; email: string };
}

const Form: React.FC<FormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = React.useState(
    initialData || { name: '', email: '' }
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="form">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <Button type="submit" loading={isSubmitting}>
          Submit
        </Button>
      </div>
    </form>
  );
};

// Test Wrapper Component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('applies correct size classes', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });
});

describe('Form Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<Form onSubmit={vi.fn()} />);
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('updates form data on input change', async () => {
    render(<Form onSubmit={vi.fn()} />);
    
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
  });

  it('calls onSubmit with form data', async () => {
    const handleSubmit = vi.fn();
    render(<Form onSubmit={handleSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
    });
  });

  it('shows loading state during submission', async () => {
    const handleSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<Form onSubmit={handleSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('initializes with provided data', () => {
    const initialData = { name: 'Jane Doe', email: 'jane@example.com' };
    render(<Form onSubmit={vi.fn()} initialData={initialData} />);
    
    expect(screen.getByLabelText('Name')).toHaveValue('Jane Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com');
  });
});

describe('Component Integration Tests', () => {
  it('form submission works with button component', async () => {
    const handleSubmit = vi.fn();
    render(
      <TestWrapper>
        <Form onSubmit={handleSubmit} />
      </TestWrapper>
    );
    
    await userEvent.type(screen.getByLabelText('Name'), 'Test User');
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
    });
  });
});





