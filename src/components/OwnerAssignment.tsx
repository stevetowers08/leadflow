import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, User } from 'lucide-react';

export function OwnerAssignment() {
  const { user } = useAuth();
  const { hasRole } = usePermissions();
  const [isOwner, setIsOwner] = useState(false);

  const makeMeOwner = () => {
    // This is a temporary solution - in production, this should be done via database
    localStorage.setItem('temp_owner_role', 'true');
    setIsOwner(true);
    // Force a page refresh to update permissions
    window.location.reload();
  };

  const removeOwnerRole = () => {
    localStorage.removeItem('temp_owner_role');
    setIsOwner(false);
    window.location.reload();
  };

  if (!user) return null;

  const isCurrentlyOwner = hasRole('Owner') || localStorage.getItem('temp_owner_role') === 'true';

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Crown className="h-4 w-4 text-orange-600" />
          Owner Role Assignment (Temporary)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <strong>Current Status:</strong> 
          {isCurrentlyOwner ? (
            <Badge className="ml-2 bg-orange-100 text-orange-800">
              <Crown className="h-3 w-3 mr-1" />
              Owner
            </Badge>
          ) : (
            <Badge className="ml-2 bg-blue-100 text-blue-800">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Email: {user.email}
        </div>

        {!isCurrentlyOwner ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              To test Owner functionality, click below to temporarily assign yourself Owner role:
            </p>
            <Button onClick={makeMeOwner} size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Crown className="h-3 w-3 mr-1" />
              Make Me Owner (Temporary)
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-green-700">
              ✅ You are currently set as Owner! You can now access Owner features.
            </p>
            <Button onClick={removeOwnerRole} size="sm" variant="outline">
              <User className="h-3 w-3 mr-1" />
              Remove Owner Role
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <strong>Note:</strong> This is a temporary solution for testing. In production, 
          Owner roles should be set in the database via Supabase Dashboard.
        </div>
      </CardContent>
    </Card>
  );
}

