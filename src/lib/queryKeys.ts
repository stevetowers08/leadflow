export const queryKeys = {
  // Entity-based keys
  companies: {
    all: ['companies'] as const,
    lists: () => [...queryKeys.companies.all, 'list'] as const,
    list: (filters: CompanyFilters) =>
      [...queryKeys.companies.lists(), filters] as const,
    details: () => [...queryKeys.companies.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.companies.details(), id] as const,
  },
  leads: {
    all: ['leads'] as const,
    lists: () => [...queryKeys.leads.all, 'list'] as const,
    list: (filters: LeadFilters) =>
      [...queryKeys.leads.lists(), filters] as const,
    details: () => [...queryKeys.leads.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.leads.details(), id] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    metrics: () => [...queryKeys.dashboard.all, 'metrics'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
  },
  users: {
    all: ['users'] as const,
    profiles: () => [...queryKeys.users.all, 'profiles'] as const,
    profile: (id: string) => [...queryKeys.users.profiles(), id] as const,
  },
} as const;

// Type definitions for filters
export interface CompanyFilters {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  industryFilter?: string;
  sizeFilter?: string;
}

export interface LeadFilters {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  statusFilter?: string;
  assignedUserFilter?: string;
}
