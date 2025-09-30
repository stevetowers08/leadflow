import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SimpleSignIn } from '@/components/auth/SimpleSignIn';

// Mock the AuthContext
const mockSignInWithGoogle = vi.fn();
const mockAuthContext = {
  signInWithGoogle: mockSignInWithGoogle,
  user: null,
  loading: false,
  signOut: vi.fn(),
};

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

describe('SimpleSignIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign-in form correctly', () => {
    render(<SimpleSignIn />);
    
    expect(screen.getByText('Welcome to Empowr CRM')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access your CRM dashboard')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeInTheDocument();
  });

  it('shows loading state when signing in', async () => {
    // Mock a delayed response
    mockSignInWithGoogle.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    );
    
    render(<SimpleSignIn />);
    
    const signInButton = screen.getByRole('button', { name: 'Sign in with Google' });
    await userEvent.click(signInButton);
    
    // Should show loading state
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(signInButton).toBeDisabled();
  });

  it('handles successful sign-in', async () => {
    mockSignInWithGoogle.mockResolvedValue({ error: null });
    
    render(<SimpleSignIn />);
    
    const signInButton = screen.getByRole('button', { name: 'Sign in with Google' });
    await userEvent.click(signInButton);
    
    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
    
    // The component doesn't reset loading state on success, so we just verify the call was made
    expect(mockSignInWithGoogle).toHaveBeenCalled();
  });

  it('displays error message on sign-in failure', async () => {
    const errorMessage = 'Sign-in failed. Please try again.';
    mockSignInWithGoogle.mockResolvedValue({ 
      error: { message: errorMessage } 
    });
    
    render(<SimpleSignIn />);
    
    const signInButton = screen.getByRole('button', { name: 'Sign in with Google' });
    await userEvent.click(signInButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    // Button should be enabled again
    expect(signInButton).not.toBeDisabled();
  });

  it('handles unexpected errors gracefully', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('Network error'));
    
    render(<SimpleSignIn />);
    
    const signInButton = screen.getByRole('button', { name: 'Sign in with Google' });
    await userEvent.click(signInButton);
    
    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    });
  });

  it('clears error when retrying sign-in', async () => {
    // First attempt fails
    mockSignInWithGoogle
      .mockResolvedValueOnce({ error: { message: 'First error' } })
      .mockResolvedValueOnce({ error: null });
    
    render(<SimpleSignIn />);
    
    const signInButton = screen.getByRole('button', { name: 'Sign in with Google' });
    
    // First click - should show error
    await userEvent.click(signInButton);
    await waitFor(() => {
      expect(screen.getByText('First error')).toBeInTheDocument();
    });
    
    // Second click - error should be cleared
    await userEvent.click(signInButton);
    
    await waitFor(() => {
      expect(screen.queryByText('First error')).not.toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    render(<SimpleSignIn />);
    
    const signInButton = screen.getByRole('button', { name: 'Sign in with Google' });
    expect(signInButton).toBeInTheDocument();
    
    // Check that the form has proper heading structure
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Welcome to Empowr CRM');
  });
});
