import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface AssignedUserBadgeProps {
  ownerId: string | null;
  automationStatus: string | null;
  className?: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
}

export const AssignedUserBadge: React.FC<AssignedUserBadgeProps> = ({
  ownerId,
  automationStatus,
  className,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if lead is automated (not idle)
  const isAutomated = automationStatus && automationStatus !== 'idle';

  useEffect(() => {
    if (!ownerId || !isAutomated) {
      setUserProfile(null);
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, role')
          .eq('id', ownerId)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [ownerId, isAutomated]);

  // Only show badge if lead is automated and has an assigned user
  if (!isAutomated || !userProfile) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border',
        'bg-primary/10 text-primary border-primary/20',
        className
      )}
    >
      {loading ? 'Loading...' : userProfile.full_name}
    </span>
  );
};
