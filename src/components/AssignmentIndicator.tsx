import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AssignmentIndicatorProps {
  entityId: string;
  entityType: 'lead' | 'company';
  className?: string;
}

export const AssignmentIndicator = ({
  entityId,
  entityType,
  className,
}: AssignmentIndicatorProps) => {
  const [isAssigned, setIsAssigned] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !entityId) {
      setLoading(false);
      return;
    }

    const checkAssignment = async () => {
      // Assignment feature removed - owner_id no longer exists
      // Using client_id for multi-tenant architecture instead
      setLoading(false);
      setIsAssigned(false);
    };

    checkAssignment();
  }, [user, entityId, entityType]);

  if (loading) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <div className='w-4 h-4 rounded-full bg-muted animate-pulse' />
      </div>
    );
  }

  if (!isAssigned) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className='w-4 h-4 rounded-full bg-success/100 flex items-center justify-center'>
        <User className='w-2.5 h-2.5 text-white' />
      </div>
      <Badge variant='secondary' className='text-xs px-2 py-0.5'>
        Assigned to Me
      </Badge>
    </div>
  );
};
