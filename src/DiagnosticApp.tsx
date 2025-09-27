import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const DiagnosticContent = () => {
  const { user, userProfile, loading, session } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Authentication Diagnostic</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Authentication Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-medium">Loading:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${loading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {loading ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="font-medium">User:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user ? 'Authenticated' : 'Not Authenticated'}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="font-medium">Session:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${session ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {session ? 'Active' : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            {user ? (
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2 text-gray-700">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium">ID:</span>
                  <span className="ml-2 text-gray-700 font-mono text-sm">{user.id}</span>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2 text-gray-700">{new Date(user.created_at).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium">Last Sign In:</span>
                  <span className="ml-2 text-gray-700">{new Date(user.last_sign_in_at).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No user data available</p>
            )}
          </div>

          {/* User Profile */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Profile</h2>
            {userProfile ? (
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Full Name:</span>
                  <span className="ml-2 text-gray-700">{userProfile.full_name || 'Not set'}</span>
                </div>
                <div>
                  <span className="font-medium">Role:</span>
                  <span className="ml-2 text-gray-700">{userProfile.role || 'Not set'}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2 text-gray-700">{userProfile.status || 'Not set'}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No profile data available</p>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
              {user && (
                <button
                  onClick={async () => {
                    const { signOut } = useAuth();
                    await signOut();
                    window.location.reload();
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Raw Data */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Raw Data (for debugging)</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({ user, userProfile, session, loading }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

const DiagnosticApp = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <DiagnosticContent />
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default DiagnosticApp;
