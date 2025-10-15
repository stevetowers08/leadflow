import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BulkAssignmentDialog } from '@/components/shared/BulkAssignmentDialog';
import { AssignmentManagementPanel } from '@/components/admin/AssignmentManagementPanel';
import { LeadAssignment } from '@/components/forms/LeadAssignment';
import { CompanyAssignment } from '@/components/forms/CompanyAssignment';
import { AssignmentService } from '@/services/assignmentService';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
vi.mock('@/services/assignmentService');
vi.mock('@/contexts/AuthContext');
vi.mock('@/contexts/PermissionsContext');
vi.mock('@/hooks/use-toast');
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
        order: vi.fn(),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  },
}));

const mockAssignmentService = vi.mocked(AssignmentService);
const mockUseAuth = vi.mocked(useAuth);
const mockUsePermissions = vi.mocked(usePermissions);
const mockUseToast = vi.mocked(useToast);

describe('Assignment UI Components', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    user_metadata: { full_name: 'Test User' },
  };

  const mockTeamMembers = [
    {
      id: 'user-1',
      full_name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      is_active: true,
      avatar_url: 'avatar1.jpg',
    },
    {
      id: 'user-2',
      full_name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      is_active: true,
    },
  ];

  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: mockUser,
      signOut: vi.fn(),
      loading: false,
    } as any);

    mockUsePermissions.mockReturnValue({
      hasRole: vi.fn().mockReturnValue(true),
      canAccess: vi.fn().mockReturnValue(true),
      permissions: [],
    } as any);

    mockUseToast.mockReturnValue({
      toast: mockToast,
    } as any);

    mockAssignmentService.getTeamMembers.mockResolvedValue(mockTeamMembers);
    mockAssignmentService.assignEntity.mockResolvedValue({
      success: true,
      message: 'Assignment successful',
      data: {
        entityId: 'entity-1',
        newOwnerId: 'user-1',
        ownerName: 'John Doe',
      },
    });
    mockAssignmentService.bulkAssignEntities.mockResolvedValue({
      success: true,
      updated_count: 2,
      total_requested: 2,
      invalid_entities: [],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('BulkAssignmentDialog', () => {
    const defaultProps = {
      isOpen: true,
      onClose: vi.fn(),
      entityType: 'people' as const,
      entityIds: ['entity-1', 'entity-2'],
      entityNames: ['Test Lead 1', 'Test Lead 2'],
      onAssignmentComplete: vi.fn(),
    };

    it('should render dialog with entity information', async () => {
      render(<BulkAssignmentDialog {...defaultProps} />);

      expect(screen.getByText('Bulk Assignment')).toBeInTheDocument();
      expect(
        screen.getByText('Assign 2 leads to a team member')
      ).toBeInTheDocument();
      expect(screen.getByText('Test Lead 1')).toBeInTheDocument();
      expect(screen.getByText('Test Lead 2')).toBeInTheDocument();
      expect(screen.getByText('2 leads')).toBeInTheDocument();
    });

    it('should load team members on open', async () => {
      render(<BulkAssignmentDialog {...defaultProps} />);

      await waitFor(() => {
        expect(mockAssignmentService.getTeamMembers).toHaveBeenCalled();
      });

      expect(screen.getByText('Select team member...')).toBeInTheDocument();
    });

    it('should display team members in select dropdown', async () => {
      render(<BulkAssignmentDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Select team member...')).toBeInTheDocument();
      });

      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should perform bulk assignment when user is selected', async () => {
      render(<BulkAssignmentDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Select team member...')).toBeInTheDocument();
      });

      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('John Doe'));

      const assignButton = screen.getByText('Assign 2 leads');
      await userEvent.click(assignButton);

      await waitFor(() => {
        expect(mockAssignmentService.bulkAssignEntities).toHaveBeenCalledWith(
          ['entity-1', 'entity-2'],
          'people',
          'user-1',
          'user-1'
        );
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Assignment Complete',
        description: 'Successfully assigned 2 of 2 leads',
      });
    });

    it('should handle assignment failure', async () => {
      mockAssignmentService.bulkAssignEntities.mockResolvedValue({
        success: false,
        updated_count: 0,
        total_requested: 2,
        invalid_entities: ['entity-1'],
        errors: ['Assignment failed'],
      });

      render(<BulkAssignmentDialog {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Select team member...')).toBeInTheDocument();
      });

      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('John Doe'));

      const assignButton = screen.getByText('Assign 2 leads');
      await userEvent.click(assignButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Assignment Failed',
          description: 'Assignment failed',
          variant: 'destructive',
        });
      });
    });

    it('should show warning for large batches', () => {
      const largeProps = {
        ...defaultProps,
        entityIds: Array.from({ length: 100 }, (_, i) => `entity-${i}`),
        entityNames: Array.from({ length: 100 }, (_, i) => `Test Lead ${i}`),
      };

      render(<BulkAssignmentDialog {...largeProps} />);

      expect(
        screen.getByText(/You are assigning a large number of leads/)
      ).toBeInTheDocument();
    });

    it('should close dialog on cancel', async () => {
      const onClose = vi.fn();
      render(<BulkAssignmentDialog {...defaultProps} onClose={onClose} />);

      const cancelButton = screen.getByText('Cancel');
      await userEvent.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('should disable assign button when no user selected', async () => {
      render(<BulkAssignmentDialog {...defaultProps} />);

      const assignButton = screen.getByText('Assign 2 leads');
      expect(assignButton).toBeDisabled();
    });
  });

  describe('LeadAssignment', () => {
    const defaultProps = {
      leadId: 'lead-1',
      currentOwner: null,
      leadName: 'Test Lead',
      onAssignmentChange: vi.fn(),
    };

    it('should render lead assignment component', async () => {
      render(<LeadAssignment {...defaultProps} />);

      expect(screen.getByText('Assign Lead')).toBeInTheDocument();
      expect(screen.getByText('Test Lead')).toBeInTheDocument();
    });

    it('should show current owner when assigned', async () => {
      const propsWithOwner = {
        ...defaultProps,
        currentOwner: 'John Doe',
      };

      render(<LeadAssignment {...propsWithOwner} />);

      expect(screen.getByText('Current Owner: John Doe')).toBeInTheDocument();
    });

    it('should show unassigned state', () => {
      render(<LeadAssignment {...defaultProps} />);

      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });

    it('should assign lead to selected user', async () => {
      render(<LeadAssignment {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Select team member...')).toBeInTheDocument();
      });

      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('John Doe'));

      await waitFor(() => {
        expect(mockAssignmentService.assignEntity).toHaveBeenCalledWith(
          'people',
          'lead-1',
          'user-1',
          'user-1'
        );
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Assignment Updated',
        description: 'Assignment successful',
      });
    });

    it('should unassign lead', async () => {
      const propsWithOwner = {
        ...defaultProps,
        currentOwner: 'John Doe',
      };

      render(<LeadAssignment {...propsWithOwner} />);

      const unassignButton = screen.getByText('Unassign');
      await userEvent.click(unassignButton);

      await waitFor(() => {
        expect(mockAssignmentService.assignEntity).toHaveBeenCalledWith(
          'people',
          'lead-1',
          null,
          'user-1'
        );
      });
    });

    it('should handle assignment failure', async () => {
      mockAssignmentService.assignEntity.mockResolvedValue({
        success: false,
        message: 'Assignment failed',
        error: 'User not found',
      });

      render(<LeadAssignment {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Select team member...')).toBeInTheDocument();
      });

      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('John Doe'));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Assignment Failed',
          description: 'User not found',
          variant: 'destructive',
        });
      });
    });
  });

  describe('CompanyAssignment', () => {
    const defaultProps = {
      companyId: 'company-1',
      currentOwner: null,
      companyName: 'Test Company',
      onAssignmentChange: vi.fn(),
    };

    it('should render company assignment component', async () => {
      render(<CompanyAssignment {...defaultProps} />);

      expect(screen.getByText('Assign Company')).toBeInTheDocument();
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });

    it('should show current owner when assigned', async () => {
      const propsWithOwner = {
        ...defaultProps,
        currentOwner: 'John Doe',
      };

      render(<CompanyAssignment {...propsWithOwner} />);

      expect(screen.getByText('Current Owner: John Doe')).toBeInTheDocument();
    });

    it('should assign company to selected user', async () => {
      render(<CompanyAssignment {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Select team member...')).toBeInTheDocument();
      });

      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('John Doe'));

      await waitFor(() => {
        expect(mockAssignmentService.assignEntity).toHaveBeenCalledWith(
          'companies',
          'company-1',
          'user-1',
          'user-1'
        );
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Company Assignment Updated',
        description: 'Assignment successful',
      });
    });

    it('should check admin permissions for company assignment', () => {
      mockUsePermissions.mockReturnValue({
        hasRole: vi.fn().mockReturnValue(false),
        canAccess: vi.fn().mockReturnValue(false),
        permissions: [],
      } as any);

      render(<CompanyAssignment {...defaultProps} />);

      expect(
        screen.getByText('Only administrators can assign company ownership')
      ).toBeInTheDocument();
    });
  });

  describe('AssignmentManagementPanel', () => {
    const mockStats = {
      totalAssigned: 10,
      unassigned: 5,
      byUser: [
        { userId: 'user-1', userName: 'John Doe', count: 5 },
        { userId: 'user-2', userName: 'Jane Smith', count: 3 },
      ],
    };

    beforeEach(() => {
      mockAssignmentService.getAssignmentStats.mockResolvedValue(mockStats);
    });

    it('should render assignment management panel', async () => {
      render(<AssignmentManagementPanel />);

      expect(screen.getByText('Assignment Management')).toBeInTheDocument();
      expect(
        screen.getByText('Manage user assignments and handle orphaned records')
      ).toBeInTheDocument();
    });

    it('should display assignment statistics', async () => {
      render(<AssignmentManagementPanel />);

      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument(); // Total assigned
        expect(screen.getByText('5')).toBeInTheDocument(); // Unassigned
        expect(screen.getByText('2')).toBeInTheDocument(); // Team members
      });
    });

    it('should display assignments by user table', async () => {
      render(<AssignmentManagementPanel />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // John's count
        expect(screen.getByText('3')).toBeInTheDocument(); // Jane's count
      });
    });

    it('should show reassignment dialog when reassign button clicked', async () => {
      render(<AssignmentManagementPanel />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const reassignButtons = screen.getAllByText('Reassign');
      await userEvent.click(reassignButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Reassign User Records')).toBeInTheDocument();
        expect(
          screen.getByText('Transfer all assignments from one user to another')
        ).toBeInTheDocument();
      });
    });

    it('should perform reassignment when confirmed', async () => {
      mockAssignmentService.reassignOrphanedRecords.mockResolvedValue({
        success: true,
        message: 'Successfully reassigned 5 records',
        data: { total_records: 5 },
      });

      render(<AssignmentManagementPanel />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const reassignButtons = screen.getAllByText('Reassign');
      await userEvent.click(reassignButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Reassign User Records')).toBeInTheDocument();
      });

      const newOwnerSelect = screen.getByText('Select new owner...');
      await userEvent.click(newOwnerSelect);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('Jane Smith'));

      const confirmButton = screen.getByText('Reassign Records');
      await userEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          mockAssignmentService.reassignOrphanedRecords
        ).toHaveBeenCalledWith('user-1', 'user-2');
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Reassignment Complete',
        description: 'Successfully reassigned 5 records',
      });
    });

    it('should show permission denied for non-admin users', () => {
      mockUsePermissions.mockReturnValue({
        hasRole: vi.fn().mockReturnValue(false),
        canAccess: vi.fn().mockReturnValue(false),
        permissions: [],
      } as any);

      render(<AssignmentManagementPanel />);

      expect(
        screen.getByText(/You don't have permission to manage assignments/)
      ).toBeInTheDocument();
    });

    it('should refresh data when refresh button clicked', async () => {
      render(<AssignmentManagementPanel />);

      await waitFor(() => {
        expect(screen.getByText('Assignment Management')).toBeInTheDocument();
      });

      const refreshButton = screen.getByText('Refresh');
      await userEvent.click(refreshButton);

      expect(mockAssignmentService.getAssignmentStats).toHaveBeenCalledTimes(2);
      expect(mockAssignmentService.getTeamMembers).toHaveBeenCalledTimes(2);
    });
  });

  describe('User Selection UI Interactions', () => {
    it('should filter team members by search', async () => {
      render(
        <BulkAssignmentDialog
          {...{
            isOpen: true,
            onClose: vi.fn(),
            entityType: 'people' as const,
            entityIds: ['entity-1'],
            entityNames: ['Test Lead 1'],
            onAssignmentComplete: vi.fn(),
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Select team member...')).toBeInTheDocument();
      });

      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      // Type to search
      await userEvent.type(selectTrigger, 'John');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });

    it('should show user avatars and roles in dropdown', async () => {
      render(
        <BulkAssignmentDialog
          {...{
            isOpen: true,
            onClose: vi.fn(),
            entityType: 'people' as const,
            entityIds: ['entity-1'],
            entityNames: ['Test Lead 1'],
            onAssignmentComplete: vi.fn(),
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Select team member...')).toBeInTheDocument();
      });

      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      await waitFor(() => {
        expect(screen.getByText('admin')).toBeInTheDocument();
        expect(screen.getByText('user')).toBeInTheDocument();
      });
    });

    it('should handle loading states', async () => {
      mockAssignmentService.getTeamMembers.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve(mockTeamMembers), 1000)
          )
      );

      render(
        <BulkAssignmentDialog
          {...{
            isOpen: true,
            onClose: vi.fn(),
            entityType: 'people' as const,
            entityIds: ['entity-1'],
            entityNames: ['Test Lead 1'],
            onAssignmentComplete: vi.fn(),
          }}
        />
      );

      expect(screen.getByText('Loading team members...')).toBeInTheDocument();
    });

    it('should handle empty team members list', async () => {
      mockAssignmentService.getTeamMembers.mockResolvedValue([]);

      render(
        <BulkAssignmentDialog
          {...{
            isOpen: true,
            onClose: vi.fn(),
            entityType: 'people' as const,
            entityIds: ['entity-1'],
            entityNames: ['Test Lead 1'],
            onAssignmentComplete: vi.fn(),
          }}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText('No team members available')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling in UI', () => {
    it('should handle service errors gracefully', async () => {
      mockAssignmentService.getTeamMembers.mockRejectedValue(
        new Error('Service unavailable')
      );

      render(
        <BulkAssignmentDialog
          {...{
            isOpen: true,
            onClose: vi.fn(),
            entityType: 'people' as const,
            entityIds: ['entity-1'],
            entityNames: ['Test Lead 1'],
            onAssignmentComplete: vi.fn(),
          }}
        />
      );

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to load team members',
          variant: 'destructive',
        });
      });
    });

    it('should show error state when assignment fails', async () => {
      mockAssignmentService.assignEntity.mockResolvedValue({
        success: false,
        message: 'Assignment failed',
        error: 'Database connection failed',
      });

      render(
        <LeadAssignment
          {...{
            leadId: 'lead-1',
            currentOwner: null,
            leadName: 'Test Lead',
            onAssignmentChange: vi.fn(),
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Select team member...')).toBeInTheDocument();
      });

      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('John Doe'));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Assignment Failed',
          description: 'Database connection failed',
          variant: 'destructive',
        });
      });
    });
  });
});
