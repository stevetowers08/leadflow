import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, UserCheck, UserX } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { AssignmentService, TeamMember } from "@/services/assignmentService";
import { AssignmentErrorBoundary } from "@/components/shared/ErrorBoundary";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";

interface CompanyAssignmentProps {
  companyId: string;
  currentOwner?: string | null;
  companyName?: string;
  onAssignmentChange?: (newOwner: string | null) => void;
}


const CompanyAssignmentComponent = ({ companyId, currentOwner, companyName, onAssignmentChange }: CompanyAssignmentProps) => {
  const [selectedOwner, setSelectedOwner] = useState<string | null>(currentOwner || null);
  const { startTiming, endTiming } = usePerformanceMonitoring('CompanyAssignment');
  const [isAssigning, setIsAssigning] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasRole } = usePermissions();

  // Check if user is admin or owner
  const canAssignCompany = hasRole('admin') || hasRole('owner');

  // Fetch team members from user_profiles table
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await AssignmentService.getTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
        toast({
          title: "Error",
          description: "Failed to load team members",
          variant: "destructive",
        });
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchTeamMembers();
  }, [toast]);

  const handleAssignment = async (newOwnerId: string | null) => {
    if (!canAssignCompany) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can assign company ownership",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to assign companies",
        variant: "destructive",
      });
      return;
    }

    setIsAssigning(true);
    try {
      const result = await AssignmentService.assignEntity(
        'companies',
        companyId,
        newOwnerId,
        user.id
      );

      if (result.success) {
        setSelectedOwner(newOwnerId);
        onAssignmentChange?.(result.data?.ownerName || null);
        toast({
          title: "Company Assignment Updated",
          description: result.message,
        });
      } else {
        toast({
          title: "Assignment Failed",
          description: result.error || "Failed to update company assignment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error assigning company:', error);
      toast({
        title: "Assignment Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = () => {
    handleAssignment(null);
  };

  const getCurrentOwnerInfo = () => {
    if (!currentOwner) return null;
    return teamMembers.find(member => member.full_name === currentOwner) || {
      id: "unknown",
      full_name: currentOwner,
      role: "Unknown"
    };
  };

  const currentOwnerInfo = getCurrentOwnerInfo();

  if (!canAssignCompany) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Company Assignment</span>
        </div>

        {/* Read-only display */}
        {currentOwnerInfo ? (
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium">
                {currentOwnerInfo.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-sm">{currentOwnerInfo.full_name}</div>
                {currentOwnerInfo.role && (
                  <div className="text-xs text-muted-foreground">{currentOwnerInfo.role}</div>
                )}
              </div>
            </div>
            <StatusBadge status="Assigned" size="sm" />
          </div>
        ) : (
          <div className="flex items-center justify-center p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
            <div className="text-center text-muted-foreground">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">Unassigned</div>
              <div className="text-xs">This company is not assigned to anyone</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Company Assignment</span>
      </div>

      {/* Current Assignment Display */}
      {currentOwnerInfo ? (
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium">
              {currentOwnerInfo.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-sm">{currentOwnerInfo.full_name}</div>
              {currentOwnerInfo.role && (
                <div className="text-xs text-muted-foreground">{currentOwnerInfo.role}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="Assigned" size="sm" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUnassign}
              disabled={isAssigning}
              className="text-muted-foreground hover:text-destructive"
            >
              <UserX className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          <div className="text-center text-muted-foreground">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Unassigned</div>
            <div className="text-xs">This company is not assigned to anyone</div>
          </div>
        </div>
      )}

      {/* Assignment Selector */}
      <div className="space-y-2">
        <Select
          value={selectedOwner || undefined}
          onValueChange={(value) => handleAssignment(value === "unassign" ? null : value)}
          disabled={isAssigning || loadingMembers}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loadingMembers ? "Loading team members..." : "Assign to team member..."} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassign">
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4 text-muted-foreground" />
                <span>Unassign</span>
              </div>
            </SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium">
                    {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{member.full_name}</span>
                    <span className="text-xs text-muted-foreground">{member.role}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Overview */}
      <div className="pt-2 border-t">
        <div className="text-xs font-medium text-muted-foreground mb-2">Team Members</div>
        {loadingMembers ? (
          <div className="text-center text-muted-foreground text-sm py-4">
            Loading team members...
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {teamMembers.slice(0, 6).map((member) => {
              const isAssigned = currentOwnerInfo?.full_name === member.full_name;
              return (
                <div
                  key={member.id}
                  className={`flex items-center gap-2 p-2 rounded border transition-colors cursor-pointer hover:bg-muted/50 ${
                    isAssigned ? 'bg-sidebar-primary/10' : ''
                  }`}
                  onClick={() => handleAssignment(member.id)}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                    isAssigned ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="text-xs truncate">{member.full_name.split(' ')[0]}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Export with error boundary wrapper
export const CompanyAssignment = (props: CompanyAssignmentProps) => {
  return (
    <AssignmentErrorBoundary>
      <CompanyAssignmentComponent {...props} />
    </AssignmentErrorBoundary>
  );
};

