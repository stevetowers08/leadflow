import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const DebugAuth: React.FC = () => {
  const { user, userProfile, loading, error, session } = useAuth();

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? '✅' : '❌'}</div>
        <div>User: {user ? '✅' : '❌'}</div>
        <div>Profile: {userProfile ? '✅' : '❌'}</div>
        <div>Session: {session ? '✅' : '❌'}</div>
        <div>Error: {error ? '❌' : '✅'}</div>
        {error && <div className="text-red-300">Error: {error}</div>}
        {user && <div>Email: {user.email}</div>}
        {userProfile && <div>Role: {userProfile.role}</div>}
      </div>
    </div>
  );
};
