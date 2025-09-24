import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Users, UserCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeadAssignmentProps {
  leadId: string;
  currentOwner?: string | null;
  leadName?: string;
  onAssignmentChange?: (newOwner: string | null) => void;
}

interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
}

// Mock team members - In a real app, this would come from a team/users table
const TEAM_MEMBERS: TeamMember[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@company.com", role: "Senior Sales Rep" },
  { id: "2", name: "Mike Chen", email: "mike@company.com", role: "Sales Rep" },
  { id: "3", name: "Emily Davis", email: "emily@company.com", role: "BDR Manager" },
  { id: "4", name: "Alex Rodriguez", email: "alex@company.com", role: "Sales Rep" },
  { id: "5", name: "Lisa Wang", email: "lisa@company.com", role: "Senior BDR" },
];

export const LeadAssignment = ({ leadId, currentOwner, leadName, onAssignmentChange }: LeadAssignmentProps) => {
  const [selectedOwner, setSelectedOwner] = useState<string | null>(currentOwner || null);
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const handleAssignment = async (newOwnerId: string | null) => {
    setIsAssigning(true);
    try {
      const ownerName = newOwnerId ? TEAM_MEMBERS.find(m => m.id === newOwnerId)?.name : null;

      const { error } = await supabase
        .from("People")
        .update({ Owner: ownerName })
        .eq("id", leadId);

      if (error) throw error;

      setSelectedOwner(newOwnerId);
      onAssignmentChange?.(ownerName);

      toast({
        title: "Assignment Updated",
        description: newOwnerId 
          ? `${leadName || "Lead"} assigned to ${ownerName}`
          : `${leadName || "Lead"} unassigned`,
      });
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Failed to update lead assignment",
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
    return TEAM_MEMBERS.find(m => m.name === currentOwner) || {
      id: "unknown",
      name: currentOwner,
      role: "Unknown"
    };
  };

  const currentOwnerInfo = getCurrentOwnerInfo();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Lead Assignment</span>
      </div>

      {/* Current Assignment Display */}
      {currentOwnerInfo ? (
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {currentOwnerInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-sm">{currentOwnerInfo.name}</div>
              {currentOwnerInfo.role && (
                <div className="text-xs text-muted-foreground">{currentOwnerInfo.role}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <UserCheck className="w-3 h-3 mr-1" />
              Assigned
            </Badge>
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
            <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Unassigned</div>
            <div className="text-xs">This lead is not assigned to anyone</div>
          </div>
        </div>
      )}

      {/* Assignment Selector */}
      <div className="space-y-2">
        <Select
          value={selectedOwner || ""}
          onValueChange={(value) => handleAssignment(value || null)}
          disabled={isAssigning}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Assign to team member..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4 text-muted-foreground" />
                <span>Unassign</span>
              </div>
            </SelectItem>
            {TEAM_MEMBERS.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{member.name}</span>
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
        <div className="grid grid-cols-3 gap-2">
          {TEAM_MEMBERS.slice(0, 6).map((member) => {
            const isAssigned = currentOwnerInfo?.name === member.name;
            return (
              <div
                key={member.id}
                className={`flex items-center gap-2 p-2 rounded border transition-colors cursor-pointer hover:bg-muted/50 ${
                  isAssigned ? 'bg-primary/10 border-primary/30' : ''
                }`}
                onClick={() => handleAssignment(member.id)}
              >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                  isAssigned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="text-xs truncate">{member.name.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};