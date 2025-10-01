/**
 * AI Chat Debug Component
 * 
 * This component helps debug the AI chat integration
 * and verify that both MCP and Internal modes work correctly.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertCircle, Database, MessageSquare } from 'lucide-react';
import { dataAwareGeminiChatService } from '@/services/dataAwareGeminiChatService';
import { ChatService } from '@/services/chatService';
import { supabase } from '@/integrations/supabase/client';

interface DebugResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const AIChatDebugComponent: React.FC = () => {
  const [results, setResults] = useState<DebugResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    setResults(prev => [...prev, { test, status, message, details }]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Test 1: Environment Variables
      addResult(
        'Environment Variables',
        import.meta.env.VITE_GEMINI_API_KEY ? 'success' : 'error',
        import.meta.env.VITE_GEMINI_API_KEY 
          ? 'Gemini API key is configured' 
          : 'Gemini API key is missing',
        { hasKey: !!import.meta.env.VITE_GEMINI_API_KEY }
      );

      // Test 2: Supabase Connection
      try {
        const { data, error } = await supabase.from('companies').select('id').limit(1);
        addResult(
          'Supabase Connection',
          error ? 'error' : 'success',
          error ? `Database error: ${error.message}` : 'Database connection successful',
          { error, dataCount: data?.length }
        );
      } catch (err) {
        addResult('Supabase Connection', 'error', `Connection failed: ${err}`, { error: err });
      }

      // Test 3: Data-Aware Service Availability
      const internalAvailable = dataAwareGeminiChatService.isAvailable();
      addResult(
        'Data-Aware Service',
        internalAvailable ? 'success' : 'warning',
        internalAvailable 
          ? 'Data-aware Gemini service is available' 
          : 'Data-aware service not available (check API key)',
        { available: internalAvailable }
      );

      // Test 4: Test Data Query
      if (internalAvailable) {
        try {
          const testQuery = await dataAwareGeminiChatService['queryRelevantData']('test companies');
          addResult(
            'Data Query Test',
            testQuery.data.length > 0 ? 'success' : 'warning',
            testQuery.data.length > 0 
              ? `Found ${testQuery.data.length} companies` 
              : 'No companies found in database',
            { queryType: testQuery.type, dataCount: testQuery.data.length }
          );
        } catch (err) {
          addResult('Data Query Test', 'error', `Query failed: ${err}`, { error: err });
        }
      }

      // Test 5: MCP Service Test
      try {
        const mcpService = new ChatService({
          webhookUrl: 'https://n8n.srv814433.hstgr.cloud/webhook/9c3e515b-f1cf-4649-a4af-5143e3b7668e',
          timeout: 5000
        });
        const mcpConnected = await mcpService.testConnection();
        addResult(
          'MCP Service',
          mcpConnected ? 'success' : 'warning',
          mcpConnected 
            ? 'MCP webhook is responding' 
            : 'MCP webhook not responding',
          { connected: mcpConnected }
        );
      } catch (err) {
        addResult('MCP Service', 'error', `MCP test failed: ${err}`, { error: err });
      }

      // Test 6: Gemini API Test (if available)
      if (internalAvailable) {
        try {
          const testContext = {
            conversationId: 'debug_test',
            messages: []
          };
          const response = await dataAwareGeminiChatService.chatWithData('Hello, this is a test message', testContext);
          addResult(
            'Gemini API Test',
            response.message ? 'success' : 'error',
            response.message 
              ? 'Gemini API is responding correctly' 
              : 'Gemini API not responding',
            { hasResponse: !!response.message, responseLength: response.message?.length }
          );
        } catch (err) {
          addResult('Gemini API Test', 'error', `Gemini API failed: ${err}`, { error: err });
        }
      }

    } catch (error) {
      addResult('Debug Test', 'error', `Unexpected error: ${error}`, { error });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          AI Chat Debug Panel
        </CardTitle>
        <p className="text-sm text-gray-600">
          Test and verify both MCP and Internal AI chat modes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setResults([])}
            disabled={isRunning}
          >
            Clear Results
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <Separator />
            <h3 className="font-semibold text-gray-900">Test Results</h3>
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-medium">{result.test}</div>
                    <div className="text-sm mt-1">{result.message}</div>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer">Details</summary>
                        <pre className="text-xs mt-1 p-2 bg-black/5 rounded overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                  <Badge variant="outline" className={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Quick Test Commands</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>Internal Mode:</strong> Switch to "Internal (Data-Aware)" and ask: "How many companies do we have?"</div>
            <div><strong>MCP Mode:</strong> Switch to "MCP (External)" and ask: "Hello, can you help me?"</div>
            <div><strong>Data Query:</strong> Ask: "Show me all tech companies" or "Find leads with high scores"</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
