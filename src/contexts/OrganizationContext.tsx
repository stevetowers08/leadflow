import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Client } from '@/types/database';

type OrganizationWithMetadata = Client & {
  userRole: string;
  isPrimary: boolean;
};

interface OrganizationContextType {
  currentOrganization: OrganizationWithMetadata | null;
  organizations: OrganizationWithMetadata[];
  isLoading: boolean;
  switchOrganization: (organizationId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider'
    );
  }
  return context;
};

interface OrganizationProviderProps {
  children: React.ReactNode;
}

const ORGANIZATION_STORAGE_KEY = 'current_organization_id';

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentOrganizationId, setCurrentOrganizationId] = useState<
    string | null
  >(null);

  // Fetch all organizations for the user (optimized query)
  const { data: organizations = [], isLoading: orgsLoading } = useQuery<
    OrganizationWithMetadata[]
  >({
    queryKey: ['organizations', user?.id],
    queryFn: async (): Promise<OrganizationWithMetadata[]> => {
      if (!user?.id) return [];

      // Multi-tenant removed - not in PDR. Return empty array.
      // All users manage their own data via RLS policies.
      return [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });

  // Load saved organization ID from localStorage on mount
  useEffect(() => {
    if (organizations.length > 0 && !currentOrganizationId) {
      const savedOrgId = localStorage.getItem(ORGANIZATION_STORAGE_KEY);

      // Validate saved org ID is still accessible
      if (
        savedOrgId &&
        organizations.some(
          (org: OrganizationWithMetadata) =>
            org !== null && org.id === savedOrgId
        )
      ) {
        setCurrentOrganizationId(savedOrgId);
      } else {
        // Use first organization (primary contact first due to ordering)
        const defaultOrg = organizations[0]?.id || null;
        if (defaultOrg) {
          setCurrentOrganizationId(defaultOrg);
          // Save default to localStorage
          localStorage.setItem(ORGANIZATION_STORAGE_KEY, defaultOrg);
        }
      }
    }
  }, [organizations, currentOrganizationId]);

  // Get current organization
  const currentOrganization =
    organizations.find(
      (org): org is OrganizationWithMetadata =>
        org !== null && org.id === currentOrganizationId
    ) || null;

  // Switch organization
  const switchOrganizationMutation = useMutation({
    mutationFn: async (organizationId: string) => {
      // Verify user has access to this organization
      const hasAccess = organizations.some(org => org.id === organizationId);
      if (!hasAccess) {
        throw new Error('You do not have access to this organization');
      }

      // Save to localStorage
      localStorage.setItem(ORGANIZATION_STORAGE_KEY, organizationId);
      setCurrentOrganizationId(organizationId);

      // Invalidate all queries that depend on organization
      queryClient.invalidateQueries({ queryKey: ['client-id'] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });

      // Invalidate data queries
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const switchOrganization = useCallback(
    async (organizationId: string) => {
      await switchOrganizationMutation.mutateAsync(organizationId);
    },
    [switchOrganizationMutation]
  );

  const refreshOrganizations = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['organizations', user?.id],
    });
  }, [queryClient, user?.id]);

  // Update user profile default_client_id when organization changes
  useEffect(() => {
    if (currentOrganizationId && user?.id) {
      // Multi-tenant removed - default_client_id no longer exists
      // supabase
      //   .from('user_profiles')
      //   .update({ default_client_id: currentOrganizationId })
      //   .eq('id', user.id)
      //   .then(({ error }) => {
      //     if (error) {
      //       console.error('Error updating default_client_id:', error);
      //     }
      //   });
    }
  }, [currentOrganizationId, user?.id]);

  const value: OrganizationContextType = {
    currentOrganization,
    organizations,
    isLoading: orgsLoading,
    switchOrganization,
    refreshOrganizations,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};
