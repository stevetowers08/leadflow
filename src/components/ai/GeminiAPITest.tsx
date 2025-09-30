// Test component to verify Gemini API integration
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { useAI } from '../contexts/AIContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function GeminiAPITest() {
  const { isAvailable, activeProvider } = useAI();
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const testGeminiAPI = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Test with a simple job summary
      const result = await geminiService.generateJobSummary({
        title: "Software Engineer",
        company: "Test Company",
        description: "We are looking for a skilled software engineer to join our team. The ideal candidate should have experience with React, TypeScript, and modern web development practices.",
        location: "Remote",
        salary: "$80,000 - $120,000"
      });

      if (result.success && result.data) {
        setTestResult({
          success: true,
          message: "Gemini API is working correctly!",
          data: result.data
        });
      } else {
        setTestResult({
          success: false,
          message: result.error || "API call failed"
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isAvailable ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          Gemini API Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Status:</strong> {isAvailable ? 'Available' : 'Not Available'}
          </div>
          <div className="text-sm">
            <strong>Active Provider:</strong> {activeProvider}
          </div>
          <div className="text-sm">
            <strong>API Key:</strong> {import.meta.env.VITE_GEMINI_API_KEY ? 'Configured' : 'Not Found'}
          </div>
        </div>

        <Button 
          onClick={testGeminiAPI} 
          disabled={isTesting || !isAvailable}
          className="w-full"
        >
          {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Test Gemini API
        </Button>

        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">{testResult.message}</div>
                {testResult.success && testResult.data && (
                  <div className="text-sm space-y-2">
                    <div><strong>Summary:</strong> {testResult.data.summary}</div>
                    <div><strong>Key Requirements:</strong></div>
                    <ul className="list-disc list-inside ml-4">
                      {testResult.data.key_requirements?.map((req: string, index: number) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                    <div><strong>Urgency:</strong> {testResult.data.urgency_level}</div>
                    <div><strong>Market Demand:</strong> {testResult.data.market_demand}</div>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!isAvailable && (
          <Alert variant="destructive">
            <AlertDescription>
              Gemini API is not available. Please check your API key configuration.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
