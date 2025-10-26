import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

interface TestJobData {
  title: string;
  company: string;
  description: string;
  location: string;
  salary: string;
}

interface RateLimitStatus {
  requestsRemaining?: number;
  resetTime?: string;
  [key: string]: unknown;
}

interface TestResult {
  success?: boolean;
  data?: unknown;
  error?: string;
  [key: string]: unknown;
}

export const GoogleAIStudioTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitStatus, setRateLimitStatus] =
    useState<RateLimitStatus | null>(null);

  const testJobData: TestJobData = {
    title: 'Senior React Developer',
    company: 'Tech Innovations Inc',
    description: `We are seeking a Senior React Developer to join our dynamic team. 
    
    Responsibilities:
    - Develop and maintain React applications using TypeScript
    - Collaborate with cross-functional teams to deliver high-quality software
    - Implement responsive designs and optimize application performance
    - Mentor junior developers and conduct code reviews
    - Work with modern tools like Next.js, Redux, and GraphQL
    
    Requirements:
    - 5+ years of React development experience
    - Strong TypeScript skills
    - Experience with modern React patterns (hooks, context, etc.)
    - Knowledge of testing frameworks (Jest, React Testing Library)
    - Experience with CI/CD pipelines
    - Strong problem-solving and communication skills
    
    Nice to have:
    - Experience with Node.js backend development
    - Knowledge of cloud platforms (AWS, Azure, GCP)
    - Experience with microservices architecture`,
    location: 'San Francisco, CA (Hybrid)',
    salary: '$130,000 - $160,000',
  };

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Check service availability
      if (!geminiService.isAvailable()) {
        throw new Error(
          'Gemini service not available. Please check your API key configuration.'
        );
      }

      // Get rate limit status
      const rateLimit = geminiService.getRateLimitStatus();
      setRateLimitStatus(rateLimit);

      // Test job summarization
      const summaryResult = await geminiService.generateJobSummary(testJobData);

      if (summaryResult.success) {
        setResult(summaryResult.data);
      } else {
        setError(summaryResult.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceStatus = () => {
    return geminiService.getStatus();
  };

  const status = getServiceStatus();

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          🚀 Google AI Studio Test
        </h2>

        {/* Service Status */}
        <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-semibold mb-2'>Service Status</h3>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='font-medium'>Available:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  status.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {status.available ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div>
              <span className='font-medium'>Model:</span>
              <span className='ml-2 text-gray-600'>{status.model}</span>
            </div>
            <div>
              <span className='font-medium'>Rate Limit:</span>
              <span className='ml-2 text-gray-600'>{status.rateLimit}</span>
            </div>
            <div>
              <span className='font-medium'>Cost:</span>
              <span className='ml-2 text-gray-600'>{status.cost}</span>
            </div>
          </div>
        </div>

        {/* Rate Limit Status */}
        {rateLimitStatus && (
          <div className='mb-6 p-4 bg-blue-50 rounded-lg'>
            <h3 className='text-lg font-semibold mb-2'>Rate Limit Status</h3>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='font-medium'>Current Requests:</span>
                <span className='ml-2 text-gray-600'>
                  {rateLimitStatus.currentRequests}/
                  {rateLimitStatus.maxRequests}
                </span>
              </div>
              <div>
                <span className='font-medium'>Queue Length:</span>
                <span className='ml-2 text-gray-600'>
                  {rateLimitStatus.queueLength}
                </span>
              </div>
              <div>
                <span className='font-medium'>Time Until Reset:</span>
                <span className='ml-2 text-gray-600'>
                  {Math.round(rateLimitStatus.timeUntilReset / 1000)}s
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Test Button */}
        <button
          onClick={handleTest}
          disabled={isLoading || !status.available}
          className={`px-6 py-3 rounded-lg font-medium ${
            isLoading || !status.available
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? '🔄 Testing...' : '🧪 Test Job Summarization'}
        </button>

        {/* Error Display */}
        {error && (
          <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <h4 className='text-red-800 font-semibold mb-2'>❌ Error</h4>
            <p className='text-red-700 text-sm'>{error}</p>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className='mt-6 space-y-4'>
            <h3 className='text-lg font-semibold text-green-800'>
              ✅ Test Results
            </h3>

            <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
              <h4 className='font-semibold text-green-800 mb-2'>Summary</h4>
              <p className='text-green-700 text-sm'>{result.summary}</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-semibold text-gray-800 mb-2'>
                  Key Requirements
                </h4>
                <ul className='text-sm text-gray-700 space-y-1'>
                  {result.key_requirements?.map(
                    (req: string, index: number) => (
                      <li key={index}>• {req}</li>
                    )
                  )}
                </ul>
              </div>

              <div className='p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-semibold text-gray-800 mb-2'>
                  Skills Extracted
                </h4>
                <ul className='text-sm text-gray-700 space-y-1'>
                  {result.skills_extracted?.map(
                    (skill: string, index: number) => (
                      <li key={index}>• {skill}</li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='p-4 bg-blue-50 rounded-lg'>
                <h4 className='font-semibold text-blue-800 mb-2'>
                  Urgency Level
                </h4>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    result.urgency_level === 'high'
                      ? 'bg-red-100 text-red-800'
                      : result.urgency_level === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {result.urgency_level?.toUpperCase()}
                </span>
              </div>

              <div className='p-4 bg-purple-50 rounded-lg'>
                <h4 className='font-semibold text-purple-800 mb-2'>
                  Market Demand
                </h4>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    result.market_demand === 'high'
                      ? 'bg-red-100 text-red-800'
                      : result.market_demand === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {result.market_demand?.toUpperCase()}
                </span>
              </div>

              <div className='p-4 bg-indigo-50 rounded-lg'>
                <h4 className='font-semibold text-indigo-800 mb-2'>
                  Remote Flexibility
                </h4>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    result.remote_flexibility
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {result.remote_flexibility ? 'YES' : 'NO'}
                </span>
              </div>
            </div>

            <div className='p-4 bg-gray-50 rounded-lg'>
              <h4 className='font-semibold text-gray-800 mb-2'>
                Ideal Candidate
              </h4>
              <p className='text-sm text-gray-700'>{result.ideal_candidate}</p>
            </div>

            {result.salary_range && (
              <div className='p-4 bg-yellow-50 rounded-lg'>
                <h4 className='font-semibold text-yellow-800 mb-2'>
                  Salary Range
                </h4>
                <p className='text-sm text-yellow-700'>{result.salary_range}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
