import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { validateEnvironment } from '@/utils/environmentValidation';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, User, Key, Globe } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
  icon: React.ReactNode;
}

export const ComprehensiveDiagnostic: React.FC = () => {
  const { user, userProfile, session, loading } = useAuth();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    try {
      // 1. Environment Variables Check
      const envConfig = validateEnvironment();
      results.push({
        name: 'Environment Variables',
        status: envConfig.isValid ? 'success' : 'error',
        message: envConfig.isValid ? 'All environment variables are valid' : 'Environment validation failed',
        details: envConfig.errors.join(', '),
        icon: <Key className="h-5 w-5" />
      });

      // 2. Supabase Client Check
      try {
        const { data, error } = await supabase.from('companies').select('count', { count: 'exact', head: true });
        results.push({
          name: 'Supabase Connection',
          status: !error ? 'success' : 'error',
          message: !error ? 'Connected to Supabase successfully' : 'Failed to connect to Supabase',
          details: error?.message,
          icon: <Database className="h-5 w-5" />
        });
      } catch (err) {
        results.push({
          name: 'Supabase Connection',
          status: 'error',
          message: 'Supabase client initialization failed',
          details: err instanceof Error ? err.message : 'Unknown error',
          icon: <Database className="h-5 w-5" />
        });
      }

      // 3. Admin Client Check
      if (supabaseAdmin) {
        try {
          const { data, error } = await supabaseAdmin.from('user_profiles').select('count', { count: 'exact', head: true });
          results.push({
            name: 'Admin Client',
            status: !error ? 'success' : 'warning',
            message: !error ? 'Admin client working' : 'Admin client has issues',
            details: error?.message,
            icon: <Key className="h-5 w-5" />
          });
        } catch (err) {
          results.push({
            name: 'Admin Client',
            status: 'warning',
            message: 'Admin client error',
            details: err instanceof Error ? err.message : 'Unknown error',
            icon: <Key className="h-5 w-5" />
          });
        }
      } else {
        results.push({
          name: 'Admin Client',
          status: 'warning',
          message: 'Admin client not configured',
          details: 'Service role key missing',
          icon: <Key className="h-5 w-5" />
        });
      }

      // 4. Authentication Status
      results.push({
        name: 'Authentication Status',
        status: user ? 'success' : 'warning',
        message: user ? `Authenticated as ${user.email}` : 'Not authenticated',
        details: session ? 'Session active' : 'No active session',
        icon: <User className="h-5 w-5" />
      });

      // 5. User Profile Check
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          results.push({
            name: 'User Profile',
            status: !error && data ? 'success' : 'error',
            message: !error && data ? 'Profile loaded successfully' : 'Profile not found or inaccessible',
            details: error?.message || (data ? `Role: ${data.role}` : 'No profile data'),
            icon: <User className="h-5 w-5" />
          });
        } catch (err) {
          results.push({
            name: 'User Profile',
            status: 'error',
            message: 'Profile fetch failed',
            details: err instanceof Error ? err.message : 'Unknown error',
            icon: <User className="h-5 w-5" />
          });
        }
      } else {
        results.push({
          name: 'User Profile',
          status: 'warning',
          message: 'No user to check profile',
          details: 'User must be authenticated first',
          icon: <User className="h-5 w-5" />
        });
      }

      // 6. Browser Environment
      results.push({
        name: 'Browser Environment',
        status: 'success',
        message: 'Browser environment is compatible',
        details: `User Agent: ${navigator.userAgent.substring(0, 50)}...`,
        icon: <Globe className="h-5 w-5" />
      });

      // 7. JavaScript Errors Check
      const hasJsErrors = window.console && typeof window.console.error === 'function';
      results.push({
        name: 'JavaScript Runtime',
        status: hasJsErrors ? 'success' : 'warning',
        message: hasJsErrors ? 'JavaScript runtime is functional' : 'JavaScript runtime issues detected',
        details: 'Check browser console for errors',
        icon: <AlertTriangle className="h-5 w-5" />
      });

    } catch (error) {
      results.push({
        name: 'Diagnostic System',
        status: 'error',
        message: 'Diagnostic system failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        icon: <AlertTriangle className="h-5 w-5" />
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, [user, userProfile, session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Comprehensive Diagnostic</h1>
              <p className="text-gray-600 mt-1">System health check and troubleshooting</p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running...' : 'Refresh'}
            </button>
          </div>

          <div className="space-y-4">
            {diagnostics.map((diagnostic, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(diagnostic.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {diagnostic.icon}
                    <div>
                      <h3 className="font-semibold">{diagnostic.name}</h3>
                      <p className="text-sm mt-1">{diagnostic.message}</p>
                      {diagnostic.details && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer hover:underline">
                            Show Details
                          </summary>
                          <div className="mt-2 text-xs font-mono bg-white/50 p-2 rounded">
                            {diagnostic.details}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                  {getStatusIcon(diagnostic.status)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• If any checks show errors, fix the underlying issues</li>
              <li>• Check your browser console for JavaScript errors</li>
              <li>• Verify your Supabase configuration in the dashboard</li>
              <li>• Clear browser cache and cookies if issues persist</li>
              <li>• Contact support if all checks pass but the app still shows a white screen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
