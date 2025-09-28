import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Database, Settings } from 'lucide-react';

const AdminSettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Admin Settings</h2>
        <Badge variant="secondary">Admin Only</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Management
            </CardTitle>
            <CardDescription>
              Database administration and maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Database Tools
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>
              Configure system-wide settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              System Config
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Security and access control settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Security Config
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>
            Quick access to administrative functions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="destructive" className="w-full">
            Reset Database
          </Button>
          <Button variant="outline" className="w-full">
            Export Data
          </Button>
          <Button variant="outline" className="w-full">
            Import Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsTab;
