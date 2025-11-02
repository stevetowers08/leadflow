/**
 * Test Setup Configuration
 *
 * This file configures the testing environment for Vitest
 * and provides utilities for testing React components
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables (Next.js style - process.env)
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.NEXT_PUBLIC_BYPASS_AUTH = 'true';
process.env.NODE_ENV = 'test';

// Also mock for any Vite-style imports that might exist
vi.mock('import.meta.env', () => ({
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-anon-key',
  VITE_BYPASS_AUTH: 'true',
  NODE_ENV: 'test',
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        gte: vi.fn(() => Promise.resolve({ data: [], error: null })),
        lte: vi.fn(() => Promise.resolve({ data: [], error: null })),
        not: vi.fn(() => Promise.resolve({ data: [], error: null })),
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({ data: { user: null }, error: null })
      ),
      signInWithOAuth: vi.fn(() =>
        Promise.resolve({ data: null, error: null })
      ),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
      })),
    })),
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
  },
}));

// Mock React Router (legacy - some components may still use it)
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/test' }),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  })),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Suppress console.error and console.warn during tests unless explicitly needed
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
export const testUtils = {
  // Mock data generators
  createMockUser: () => ({
    id: 'test-user-id',
    email: 'test@example.com',
    full_name: 'Test User',
    role: 'recruiter',
  }),

  createMockPerson: () => ({
    id: 'test-person-id',
    name: 'John Doe',
    email_address: 'john@example.com',
    company_id: 'test-company-id',
    stage: 'new',
    created_at: new Date().toISOString(),
  }),

  createMockCompany: () => ({
    id: 'test-company-id',
    name: 'Test Company',
    website: 'https://test.com',
    industry: 'Technology',
    created_at: new Date().toISOString(),
  }),

  createMockJob: () => ({
    id: 'test-job-id',
    title: 'Software Engineer',
    company_id: 'test-company-id',
    location: 'Remote',
    qualification_status: 'new',
    created_at: new Date().toISOString(),
  }),

  // Wait for async operations
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock API responses
  mockApiResponse: (data: Record<string, unknown>, error: unknown = null) => ({
    data,
    error,
    count: Array.isArray(data) ? data.length : null,
  }),
};
