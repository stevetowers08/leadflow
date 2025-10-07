/**
 * User Profile Hook
 * 
 * Handles user profile loading and management
 * Separated from core authentication for better maintainability
 */

import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useCallback, useState } from 'react';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Consolidated profile creation utility
  const createFallbackProfile = useCallback((user: any): UserProfile => {
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
      role: 'recruiter',
      user_limit: 100,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }, []);

  // Load user profile with proper error handling
  const loadUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log(`🔍 Loading user profile for: ${userId}`);
      setProfileLoading(true);
      setProfileError(null);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log(`ℹ️ No existing profile found for user: ${userId}`);
        return null; // Return null instead of throwing error
      }

      console.log('✅ Profile loaded successfully:', {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role
      });
      
      setProfileError(null);
      return data;
    } catch (error) {
      console.log(`ℹ️ Profile loading failed, will create new profile:`, error);
      setProfileError(`Profile loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null; // Return null instead of throwing error
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Refresh profile function
  const refreshProfile = useCallback(async (userId: string) => {
    try {
      console.log('🔄 Refreshing user profile...');
      setProfileError(null);
      
      const profile = await loadUserProfile(userId);
      setUserProfile(profile);
      
      return profile;
    } catch (error) {
      console.error('❌ Error in refreshProfile:', error);
      setProfileError(`Profile refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }, [loadUserProfile]);

  // Update profile function
  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      if (!userProfile?.id) {
        throw new Error('No user profile to update');
      }

      setProfileLoading(true);
      setProfileError(null);

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setUserProfile(data);
      console.log('✅ Profile updated successfully');
      return data;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setProfileError(`Profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  }, [userProfile?.id]);

  return {
    userProfile,
    profileLoading,
    profileError,
    setUserProfile,
    setProfileLoading,
    setProfileError,
    loadUserProfile,
    refreshProfile,
    updateUserProfile,
    createFallbackProfile
  };
};
