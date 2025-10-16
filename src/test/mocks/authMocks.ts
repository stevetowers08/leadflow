import { vi } from 'vitest';

// Mock user data for different roles
export const mockUsers = {
  owner: {
    id: 'owner-user-id',
    email: 'owner@example.com',
    user_metadata: {
      role: 'owner',
      full_name: 'Owner User',
      avatar_url: 'https://example.com/owner-avatar.jpg',
    },
  },
  admin: {
    id: 'admin-user-id',
    email: 'admin@example.com',
    user_metadata: {
      role: 'admin',
      full_name: 'Admin User',
      avatar_url: 'https://example.com/admin-avatar.jpg',
    },
  },
  recruiter: {
    id: 'recruiter-user-id',
    email: 'recruiter@example.com',
    user_metadata: {
      role: 'recruiter',
      full_name: 'Recruiter User',
      avatar_url: 'https://example.com/recruiter-avatar.jpg',
    },
  },
  viewer: {
    id: 'viewer-user-id',
    email: 'viewer@example.com',
    user_metadata: {
      role: 'viewer',
      full_name: 'Viewer User',
      avatar_url: 'https://example.com/viewer-avatar.jpg',
    },
  },
  deleted: {
    id: 'deleted-user-id',
    email: 'deleted@example.com',
    user_metadata: {
      role: 'recruiter',
      full_name: 'Deleted User',
      avatar_url: 'https://example.com/deleted-avatar.jpg',
    },
  },
};

// Mock user profiles
export const mockUserProfiles = {
  owner: {
    id: 'owner-user-id',
    email: 'owner@example.com',
    full_name: 'Owner User',
    role: 'owner',
    user_limit: 1000,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  admin: {
    id: 'admin-user-id',
    email: 'admin@example.com',
    full_name: 'Admin User',
    role: 'admin',
    user_limit: 100,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  recruiter: {
    id: 'recruiter-user-id',
    email: 'recruiter@example.com',
    full_name: 'Recruiter User',
    role: 'recruiter',
    user_limit: 50,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  viewer: {
    id: 'viewer-user-id',
    email: 'viewer@example.com',
    full_name: 'Viewer User',
    role: 'viewer',
    user_limit: 10,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  deleted: {
    id: 'deleted-user-id',
    email: 'deleted@example.com',
    full_name: 'Deleted User',
    role: 'recruiter',
    user_limit: 50,
    is_active: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
};

// Mock CRM data with ownership
export const mockCrmData = {
  companies: [
    {
      id: 'company-1',
      name: 'Acme Corp',
      website: 'https://acme.com',
      industry: 'Technology',
      owner_id: 'recruiter-user-id',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'company-2',
      name: 'Beta Inc',
      website: 'https://beta.com',
      industry: 'Finance',
      owner_id: 'admin-user-id',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'company-3',
      name: 'Gamma LLC',
      website: 'https://gamma.com',
      industry: 'Healthcare',
      owner_id: 'deleted-user-id',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
  people: [
    {
      id: 'person-1',
      name: 'John Doe',
      email_address: 'john@acme.com',
      company_id: 'company-1',
      owner_id: 'recruiter-user-id',
      stage: 'new',
      lead_score: '85',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'person-2',
      name: 'Jane Smith',
      email_address: 'jane@beta.com',
      company_id: 'company-2',
      owner_id: 'admin-user-id',
      stage: 'qualified',
      lead_score: '92',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'person-3',
      name: 'Bob Wilson',
      email_address: 'bob@gamma.com',
      company_id: 'company-3',
      owner_id: 'deleted-user-id',
      stage: 'contacted',
      lead_score: '78',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
  jobs: [
    {
      id: 'job-1',
      title: 'Software Engineer',
      company_id: 'company-1',
      owner_id: 'recruiter-user-id',
      location: 'San Francisco',
      salary_min: 80000,
      salary_max: 120000,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'job-2',
      title: 'Product Manager',
      company_id: 'company-2',
      owner_id: 'admin-user-id',
      location: 'New York',
      salary_min: 100000,
      salary_max: 150000,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
};

// Mock Supabase client with authorization checks
export const createMockSupabaseClient = (currentUser: any = null) => {
  const mockClient = {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: currentUser },
        error: null,
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: currentUser ? { user: currentUser } : null },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation(resolve => {
        // Simulate RLS filtering based on current user
        const tableName =
          mockClient.from.mock.calls[
            mockClient.from.mock.calls.length - 1
          ]?.[0];
        let filteredData = [];

        if (tableName === 'companies') {
          filteredData = mockCrmData.companies.filter(
            item =>
              !currentUser ||
              currentUser.user_metadata?.role === 'owner' ||
              currentUser.user_metadata?.role === 'admin' ||
              item.owner_id === currentUser.id
          );
        } else if (tableName === 'people') {
          filteredData = mockCrmData.people.filter(
            item =>
              !currentUser ||
              currentUser.user_metadata?.role === 'owner' ||
              currentUser.user_metadata?.role === 'admin' ||
              item.owner_id === currentUser.id
          );
        } else if (tableName === 'jobs') {
          filteredData = mockCrmData.jobs.filter(
            item =>
              !currentUser ||
              currentUser.user_metadata?.role === 'owner' ||
              currentUser.user_metadata?.role === 'admin' ||
              item.owner_id === currentUser.id
          );
        } else if (tableName === 'user_profiles') {
          filteredData = Object.values(mockUserProfiles).filter(
            profile =>
              !currentUser ||
              currentUser.user_metadata?.role === 'owner' ||
              currentUser.user_metadata?.role === 'admin' ||
              profile.id === currentUser.id
          );
        }

        resolve({
          data: filteredData,
          error: null,
        });
      }),
    }),
  };

  return mockClient;
};

// Mock authentication context
export const createMockAuthContext = (user: any = null, loading = false) => ({
  user,
  userProfile: user
    ? mockUserProfiles[
        user.user_metadata?.role as keyof typeof mockUserProfiles
      ]
    : null,
  authLoading: loading,
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  refreshUser: vi.fn(),
});

// Mock permissions context
export const createMockPermissionsContext = (user: any = null) => {
  const role = user?.user_metadata?.role || 'recruiter';
  const permissions = getUserPermissions(role);

  return {
    hasRole: vi.fn().mockImplementation((requiredRole: string | string[]) => {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      return roles.includes(role);
    }),
    hasPermission: vi.fn().mockImplementation((permission: string) => {
      return permissions.some(p => p.id === permission);
    }),
    canView: vi.fn().mockImplementation((resource: string) => {
      return permissions.some(
        p => p.resource === resource && p.action === 'view'
      );
    }),
    canEdit: vi.fn().mockImplementation((resource: string) => {
      return permissions.some(
        p => p.resource === resource && p.action === 'edit'
      );
    }),
    canDelete: vi.fn().mockImplementation((resource: string) => {
      return permissions.some(
        p => p.resource === resource && p.action === 'delete'
      );
    }),
    canBulkAction: vi.fn().mockImplementation((resource: string) => {
      return permissions.some(
        p => p.resource === resource && p.action === 'bulk'
      );
    }),
    loading: false,
  };
};

// Helper function to get user permissions based on role
function getUserPermissions(role: string) {
  const permissionMap = {
    owner: [
      { id: 'users_view', resource: 'users', action: 'view' },
      { id: 'users_edit', resource: 'users', action: 'edit' },
      { id: 'users_delete', resource: 'users', action: 'delete' },
      { id: 'leads_view', resource: 'leads', action: 'view' },
      { id: 'leads_edit', resource: 'leads', action: 'edit' },
      { id: 'leads_delete', resource: 'leads', action: 'delete' },
      { id: 'leads_bulk', resource: 'leads', action: 'bulk' },
      { id: 'companies_view', resource: 'companies', action: 'view' },
      { id: 'companies_edit', resource: 'companies', action: 'edit' },
      { id: 'companies_delete', resource: 'companies', action: 'delete' },
      { id: 'companies_bulk', resource: 'companies', action: 'bulk' },
      { id: 'jobs_view', resource: 'jobs', action: 'view' },
      { id: 'jobs_edit', resource: 'jobs', action: 'edit' },
      { id: 'jobs_delete', resource: 'jobs', action: 'delete' },
      { id: 'jobs_bulk', resource: 'jobs', action: 'bulk' },
    ],
    admin: [
      { id: 'users_view', resource: 'users', action: 'view' },
      { id: 'users_edit', resource: 'users', action: 'edit' },
      { id: 'leads_view', resource: 'leads', action: 'view' },
      { id: 'leads_edit', resource: 'leads', action: 'edit' },
      { id: 'leads_delete', resource: 'leads', action: 'delete' },
      { id: 'leads_bulk', resource: 'leads', action: 'bulk' },
      { id: 'companies_view', resource: 'companies', action: 'view' },
      { id: 'companies_edit', resource: 'companies', action: 'edit' },
      { id: 'companies_delete', resource: 'companies', action: 'delete' },
      { id: 'companies_bulk', resource: 'companies', action: 'bulk' },
      { id: 'jobs_view', resource: 'jobs', action: 'view' },
      { id: 'jobs_edit', resource: 'jobs', action: 'edit' },
      { id: 'jobs_delete', resource: 'jobs', action: 'delete' },
      { id: 'jobs_bulk', resource: 'jobs', action: 'bulk' },
    ],
    recruiter: [
      { id: 'leads_view', resource: 'leads', action: 'view' },
      { id: 'leads_edit', resource: 'leads', action: 'edit' },
      { id: 'companies_view', resource: 'companies', action: 'view' },
      { id: 'companies_edit', resource: 'companies', action: 'edit' },
      { id: 'jobs_view', resource: 'jobs', action: 'view' },
      { id: 'jobs_edit', resource: 'jobs', action: 'edit' },
    ],
    viewer: [
      { id: 'leads_view', resource: 'leads', action: 'view' },
      { id: 'companies_view', resource: 'companies', action: 'view' },
      { id: 'jobs_view', resource: 'jobs', action: 'view' },
    ],
  };

  return (
    permissionMap[role as keyof typeof permissionMap] || permissionMap.recruiter
  );
}
