// Example AI Integration Component for Jobs Page
import React, { useState } from 'react';
import {
  JobSummaryGenerator,
  BatchJobSummarization,
  AIStatusIndicator,
} from '../components/ai/AIComponents';
import { useAI } from '../contexts/AIContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Users, TrendingUp } from 'lucide-react';

export interface AIJobIntegrationProps {
  jobData?: {
    id?: string;
    title: string;
    company: string;
    description: string;
    location?: string;
    salary?: string;
  };
  className?: string;
}

/**
 * Example component showing how to integrate AI features into your Jobs page
 * This demonstrates the complete AI workflow for job processing
 */
export function AIJobIntegration({
  jobData,
  className,
}: AIJobIntegrationProps) {
  const { isAvailable, activeProvider } = useAI();
  const [showBatchProcessing, setShowBatchProcessing] = useState(false);

  if (!isAvailable) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5' />
            AI Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <div className='text-gray-500 mb-4'>
              <Sparkles className='h-12 w-12 mx-auto mb-2 opacity-50' />
              <p>AI features are not available</p>
              <p className='text-sm'>Please configure your Gemini API key</p>
            </div>
            <Button variant='outline' disabled>
              Configure AI
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* AI Status Indicator */}
      <div className='mb-4'>
        <AIStatusIndicator />
      </div>

      {/* Individual Job Summary */}
      {jobData && (
        <div className='mb-6'>
          <JobSummaryGenerator
            jobData={jobData}
            onSummaryGenerated={summary => {
              console.log('Job summary generated:', summary);
              // Here you would typically update your database
              // await updateJobSummary(jobData.id, summary);
            }}
          />
        </div>
      )}

      {/* Batch Processing Toggle */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Batch Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600 mb-2'>
                Process multiple jobs for AI summarization
              </p>
              <div className='flex items-center gap-2'>
                <Badge variant='secondary'>Provider: {activeProvider}</Badge>
                <Badge variant='outline'>Free Tier</Badge>
              </div>
            </div>
            <Button
              variant='outline'
              onClick={() => setShowBatchProcessing(!showBatchProcessing)}
            >
              {showBatchProcessing ? 'Hide' : 'Show'} Batch Tools
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Batch Processing Component */}
      {showBatchProcessing && (
        <BatchJobSummarization
          onComplete={results => {
            console.log('Batch processing complete:', results);
            // Handle batch completion
          }}
        />
      )}

      {/* AI Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            Available AI Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center p-4 border rounded-lg'>
              <Sparkles className='h-8 w-8 mx-auto mb-2 text-blue-500' />
              <h3 className='font-medium mb-1'>Job Summarization</h3>
              <p className='text-sm text-gray-600'>
                Generate intelligent summaries of job postings
              </p>
            </div>

            <div className='text-center p-4 border rounded-lg'>
              <Users className='h-8 w-8 mx-auto mb-2 text-green-500' />
              <h3 className='font-medium mb-1'>Batch Processing</h3>
              <p className='text-sm text-gray-600'>
                Process multiple jobs simultaneously
              </p>
            </div>

            <div className='text-center p-4 border rounded-lg'>
              <TrendingUp className='h-8 w-8 mx-auto mb-2 text-purple-500' />
              <h3 className='font-medium mb-1'>Lead Scoring</h3>
              <p className='text-sm text-gray-600'>
                AI-powered lead quality assessment
              </p>
            </div>
          </div>

          <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
            <div className='text-sm text-blue-800'>
              <strong>Free Tier Benefits:</strong> 60 requests per minute, no
              cost for basic usage, automatic fallback to OpenAI if needed.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Example of how to add AI features to your existing Jobs page
 */
export function JobsPageWithAI() {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className='space-y-6'>
      {/* Your existing Jobs page content */}
      <div>
        <h1 className='text-2xl font-bold'>Jobs</h1>
        <p className='text-gray-600'>
          Manage your job postings with AI assistance
        </p>
      </div>

      {/* Your existing job list/table */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          {/* Your existing job list component */}
          <div className='space-y-4'>
            {/* Example job items */}
            {[1, 2, 3].map(i => (
              <div key={i} className='p-4 border rounded-lg'>
                <h3 className='font-medium'>Job {i}</h3>
                <p className='text-sm text-gray-600'>Company {i}</p>
                <Button
                  size='sm'
                  onClick={() =>
                    setSelectedJob({
                      id: i.toString(),
                      title: `Job ${i}`,
                      company: `Company ${i}`,
                      description: `Description for job ${i}`,
                      location: 'Remote',
                    })
                  }
                >
                  Generate AI Summary
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className='lg:col-span-1'>
          {/* AI Integration Panel */}
          <AIJobIntegration jobData={selectedJob} />
        </div>
      </div>
    </div>
  );
}
