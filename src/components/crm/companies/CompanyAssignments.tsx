import React from 'react';
import { InfoCard } from '@/components/shared/InfoCard';
import { Users, UserCheck, UserX } from 'lucide-react';

interface AssignmentData {
  lead_name: string;
  company_role: string;
  owner_id: string | null;
  assigned_to: string | null;
  assigned_email: string | null;
}

interface CompanyAssignmentsProps {
  assignments: AssignmentData[];
  isLoading?: boolean;
}

export const CompanyAssignments: React.FC<CompanyAssignmentsProps> = ({ 
  assignments, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <InfoCard title="Lead Assignments" contentSpacing="space-y-6 pt-1.5">
        <div className="text-center py-4">
          <div className="text-sm text-muted-foreground">Loading assignments...</div>
        </div>
      </InfoCard>
    );
  }

  // Group assignments by assigned user
  const assignmentsByUser = assignments.reduce((acc, assignment) => {
    const key = assignment.assigned_to || 'Unassigned';
    if (!acc[key]) {
      acc[key] = {
        user: assignment.assigned_to,
        email: assignment.assigned_email,
        leads: []
      };
    }
    acc[key].leads.push(assignment);
    return acc;
  }, {} as Record<string, { user: string | null; email: string | null; leads: AssignmentData[] }>);

  const assignedCount = assignments.filter(activity => activity.owner_id).length;
  const unassignedCount = assignments.filter(assignment => !assignment.owner_id).length;

  return (
    <InfoCard title="Outreach Assignments" contentSpacing="space-y-6 pt-1.5">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <UserCheck className="h-4 w-4 text-green-600" />
          <div>
            <div className="text-sm font-semibold text-green-800">{assignedCount}</div>
            <div className="text-xs text-green-600">Assigned</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <UserX className="h-4 w-4 text-orange-600" />
          <div>
            <div className="text-sm font-semibold text-orange-800">{unassignedCount}</div>
            <div className="text-xs text-orange-600">Need Assignment</div>
          </div>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="space-y-4">
        {Object.entries(assignmentsByUser).map(([userKey, userData]) => (
          <div key={userKey} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              {userData.user ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {userData.user.split($1).map(namePart => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{userData.user}</div>
                    {userData.email && (
                      <div className="text-xs text-gray-500">{userData.email}</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-orange-300 flex items-center justify-center">
                    <UserX className="h-3 w-3 text-orange-600" />
                  </div>
                  <div className="text-sm font-semibold text-orange-900">Needs Assignment</div>
                </>
              )}
              <div className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {userData.leads.length} lead{userData.leads.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Lead List */}
            <div className="space-y-2">
              {userData.leads.map((lead, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <span className="font-medium text-gray-900">{lead.lead_name}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{lead.company_role}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No leads found for this company</p>
        </div>
      )}
    </InfoCard>
  );
};
