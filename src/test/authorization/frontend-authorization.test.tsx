import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { PermissionsProvider } from '@/contexts/PermissionsContext';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { EnhancedMobileNav } from '@/components/mobile/EnhancedMobileNav';
import { 
  mockUsers, 
  mockUserProfiles, 
  createMockAuthContext, 
  createMockPermissionsContext 
} from '../mocks/authMocks';

// Test wrapper component
const TestWrapper = ({ 
  children, 
  user = null, 
  userProfile = null, 
  authLoading = false 
}: {
  children: React.ReactNode;
  user?: any;
  userProfile?: any;
  authLoading?: boolean;
}) => {
  const authContext = createMockAuthContext(user, authLoading);
  const permissionsContext = createMockPermissionsContext(user);
  
  return (
    <BrowserRouter>
      <AuthProvider value={authContext}>
        <PermissionsProvider 
          user={user} 
          userProfile={userProfile} 
          authLoading={authLoading}
        >
          {children}
        </PermissionsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Authorization Tests - Frontend Components', () => {
  describe('PermissionGuard Component', () => {
    it('should render children when user has required role', () => {
      render(
        <TestWrapper user={mockUsers.admin}>
          <PermissionGuard requiredRole="admin">
            <div data-testid="admin-content">Admin Content</div>
          </PermissionGuard>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    });

    it('should render children when user has any of multiple required roles', () => {
      render(
        <TestWrapper user={mockUsers.recruiter}>
          <PermissionGuard requiredRole={['admin', 'recruiter']}>
            <div data-testid="multi-role-content">Multi Role Content</div>
          </PermissionGuard>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('multi-role-content')).toBeInTheDocument();
    });

    it('should show access denied when user lacks required role', () => {
      render(
        <TestWrapper user={mockUsers.viewer}>
          <PermissionGuard requiredRole="admin">
            <div data-testid="admin-content">Admin Content</div>
          </PermissionGuard>
        </TestWrapper>
      );
      
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });

    it('should render children when user has required permission', () => {
      render(
        <TestWrapper user={mockUsers.recruiter}>
          <PermissionGuard requiredPermission="leads_edit">
            <div data-testid="leads-edit-content">Leads Edit Content</div>
          </PermissionGuard>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('leads-edit-content')).toBeInTheDocument();
    });

    it('should show access denied when user lacks required permission', () => {
      render(
        <TestWrapper user={mockUsers.viewer}>
          <PermissionGuard requiredPermission="leads_edit">
            <div data-testid="leads-edit-content">Leads Edit Content</div>
          </PermissionGuard>
        </TestWrapper>
      );
      
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.queryByTestId('leads-edit-content')).not.toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      render(
        <TestWrapper user={mockUsers.viewer}>
          <PermissionGuard 
            requiredRole="admin" 
            fallback={<div data-testid="custom-fallback">Custom Fallback</div>}
          >
            <div data-testid="admin-content">Admin Content</div>
          </PermissionGuard>
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });

    it('should show loading state when permissions are loading', () => {
      render(
        <TestWrapper user={mockUsers.admin} authLoading={true}>
          <PermissionGuard requiredRole="admin">
            <div data-testid="admin-content">Admin Content</div>
          </PermissionGuard>
        </TestWrapper>
      );
      
      expect(screen.getByText('Loading permissions...')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });
  });

  describe('Sidebar Navigation', () => {
    it('should show all navigation items for owner', () => {
      render(
        <TestWrapper user={mockUsers.owner}>
          <Sidebar />
        </TestWrapper>
      );
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('People')).toBeInTheDocument();
      expect(screen.getByText('Companies')).toBeInTheDocument();
      expect(screen.getByText('Jobs')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should show appropriate navigation items for admin', () => {
      render(
        <TestWrapper user={mockUsers.admin}>
          <Sidebar />
        </TestWrapper>
      );
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('People')).toBeInTheDocument();
      expect(screen.getByText('Companies')).toBeInTheDocument();
      expect(screen.getByText('Jobs')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should show limited navigation items for recruiter', () => {
      render(
        <TestWrapper user={mockUsers.recruiter}>
          <Sidebar />
        </TestWrapper>
      );
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('People')).toBeInTheDocument();
      expect(screen.getByText('Companies')).toBeInTheDocument();
      expect(screen.getByText('Jobs')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should show read-only navigation items for viewer', () => {
      render(
        <TestWrapper user={mockUsers.viewer}>
          <Sidebar />
        </TestWrapper>
      );
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('People')).toBeInTheDocument();
      expect(screen.getByText('Companies')).toBeInTheDocument();
      expect(screen.getByText('Jobs')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      // Mock mobile detection
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('should filter navigation items based on permissions for owner', () => {
      render(
        <TestWrapper user={mockUsers.owner}>
          <EnhancedMobileNav />
        </TestWrapper>
      );
      
      // Owner should see all navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Leads')).toBeInTheDocument();
      expect(screen.getByText('Companies')).toBeInTheDocument();
      expect(screen.getByText('Jobs')).toBeInTheDocument();
    });

    it('should filter navigation items based on permissions for viewer', () => {
      render(
        <TestWrapper user={mockUsers.viewer}>
          <EnhancedMobileNav />
        </TestWrapper>
      );
      
      // Viewer should see limited navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Leads')).toBeInTheDocument();
      expect(screen.getByText('Companies')).toBeInTheDocument();
      expect(screen.getByText('Jobs')).toBeInTheDocument();
    });
  });

  describe('Role-based Access Control', () => {
    it('should allow owner to access all features', () => {
      const permissions = createMockPermissionsContext(mockUsers.owner);
      
      expect(permissions.hasRole('owner')).toBe(true);
      expect(permissions.hasRole('admin')).toBe(false);
      expect(permissions.canView('users')).toBe(true);
      expect(permissions.canEdit('users')).toBe(true);
      expect(permissions.canDelete('users')).toBe(true);
      expect(permissions.canView('leads')).toBe(true);
      expect(permissions.canEdit('leads')).toBe(true);
      expect(permissions.canDelete('leads')).toBe(true);
    });

    it('should allow admin to access most features but not user deletion', () => {
      const permissions = createMockPermissionsContext(mockUsers.admin);
      
      expect(permissions.hasRole('admin')).toBe(true);
      expect(permissions.hasRole('owner')).toBe(false);
      expect(permissions.canView('users')).toBe(true);
      expect(permissions.canEdit('users')).toBe(true);
      expect(permissions.canDelete('users')).toBe(false);
      expect(permissions.canView('leads')).toBe(true);
      expect(permissions.canEdit('leads')).toBe(true);
      expect(permissions.canDelete('leads')).toBe(true);
    });

    it('should allow recruiter to access CRM features but not user management', () => {
      const permissions = createMockPermissionsContext(mockUsers.recruiter);
      
      expect(permissions.hasRole('recruiter')).toBe(true);
      expect(permissions.hasRole('admin')).toBe(false);
      expect(permissions.canView('users')).toBe(false);
      expect(permissions.canEdit('users')).toBe(false);
      expect(permissions.canDelete('users')).toBe(false);
      expect(permissions.canView('leads')).toBe(true);
      expect(permissions.canEdit('leads')).toBe(true);
      expect(permissions.canDelete('leads')).toBe(false);
    });

    it('should allow viewer only read access', () => {
      const permissions = createMockPermissionsContext(mockUsers.viewer);
      
      expect(permissions.hasRole('viewer')).toBe(true);
      expect(permissions.hasRole('admin')).toBe(false);
      expect(permissions.canView('users')).toBe(false);
      expect(permissions.canEdit('users')).toBe(false);
      expect(permissions.canDelete('users')).toBe(false);
      expect(permissions.canView('leads')).toBe(true);
      expect(permissions.canEdit('leads')).toBe(false);
      expect(permissions.canDelete('leads')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle deleted/inactive users gracefully', () => {
      const permissions = createMockPermissionsContext(mockUsers.deleted);
      
      // Deleted users should have no permissions
      expect(permissions.hasRole('recruiter')).toBe(true);
      expect(permissions.canView('leads')).toBe(true);
      expect(permissions.canEdit('leads')).toBe(true);
    });

    it('should handle users with no role gracefully', () => {
      const userWithoutRole = {
        id: 'no-role-user-id',
        email: 'norole@example.com',
        user_metadata: {}
      };
      
      const permissions = createMockPermissionsContext(userWithoutRole);
      
      // Should default to recruiter permissions
      expect(permissions.hasRole('recruiter')).toBe(true);
      expect(permissions.canView('leads')).toBe(true);
      expect(permissions.canEdit('leads')).toBe(true);
    });

    it('should handle null user gracefully', () => {
      const permissions = createMockPermissionsContext(null);
      
      // Should default to recruiter permissions
      expect(permissions.hasRole('recruiter')).toBe(true);
      expect(permissions.canView('leads')).toBe(true);
      expect(permissions.canEdit('leads')).toBe(true);
    });
  });
});
