import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

const Members = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-green-600" />
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage team member access and roles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Team member management features coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;

