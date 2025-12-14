/**
 * Supabase Mock for Testing
 * Provides mock implementations of Supabase client methods
 */

import { vi } from 'vitest';
import type { Database } from '@/integrations/supabase/types';

export interface MockSupabaseQuery {
  select: (columns?: string) => MockSupabaseQuery;
  insert: (values: unknown) => MockSupabaseQuery;
  update: (values: unknown) => MockSupabaseQuery;
  delete: () => MockSupabaseQuery;
  eq: (column: string, value: unknown) => MockSupabaseQuery;
  neq: (column: string, value: unknown) => MockSupabaseQuery;
  or: (filter: string) => MockSupabaseQuery;
  gt: (column: string, value: unknown) => MockSupabaseQuery;
  lt: (column: string, value: unknown) => MockSupabaseQuery;
  gte: (column: string, value: unknown) => MockSupabaseQuery;
  lte: (column: string, value: unknown) => MockSupabaseQuery;
  like: (column: string, pattern: string) => MockSupabaseQuery;
  ilike: (column: string, pattern: string) => MockSupabaseQuery;
  is: (column: string, value: unknown) => MockSupabaseQuery;
  in: (column: string, values: unknown[]) => MockSupabaseQuery;
  contains: (column: string, value: unknown) => MockSupabaseQuery;
  order: (
    column: string,
    options?: { ascending?: boolean }
  ) => MockSupabaseQuery;
  limit: (count: number) => MockSupabaseQuery;
  range: (from: number, to: number) => MockSupabaseQuery;
  single: () => Promise<{ data: unknown | null; error: unknown | null }>;
  maybeSingle: () => Promise<{ data: unknown | null; error: unknown | null }>;
  then: <T>(
    onResolve: (value: { data: T[] | null; error: unknown | null }) => T
  ) => Promise<T>;
  catch: <T>(onReject: (reason?: unknown) => T) => Promise<T>;
}

export interface MockSupabaseClient {
  from: (table: string) => MockSupabaseQuery;
  auth: {
    getUser: () => Promise<{
      data: { user: { id: string } | null };
      error: unknown | null;
    }>;
    getSession: () => Promise<{
      data: { session: unknown | null };
      error: unknown | null;
    }>;
    signIn: (
      credentials: unknown
    ) => Promise<{ data: unknown; error: unknown | null }>;
    signOut: () => Promise<{ error: unknown | null }>;
    onAuthStateChange: (callback: unknown) => {
      data: { subscription: { unsubscribe: () => void } };
    };
  };
}

export function createMockSupabaseClient(): MockSupabaseClient {
  const mockQuery: MockSupabaseQuery = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn().mockResolvedValue({ data: [], error: null }),
    catch: vi.fn().mockResolvedValue({ data: [], error: null }),
  };

  return {
    from: vi.fn().mockReturnValue(mockQuery),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null,
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signIn: vi.fn().mockResolvedValue({ data: null, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  } as unknown as MockSupabaseClient;
}

export const mockSupabase = createMockSupabaseClient();
