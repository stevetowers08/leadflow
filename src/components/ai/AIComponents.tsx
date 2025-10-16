// AI Components for UI integration
import React, { useState, useCallback } from 'react';
import {
  useAIJobSummary,
  useAISupabaseJobSummary,
  useAILeadScoring,
  useAILeadOptimization,
} from '../hooks/useAI';
import { useAI } from '../contexts/AIContext';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import {
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  MapPin,
} from 'lucide-react';

// Job Summary Generation Component
export interface JobSummaryGeneratorProps {
  jobData: {
    id?: string;
    title: string;
    company: string;
    description: string;
    location?: string;
    salary?: string;
  };
  onSummaryGenerated?: (summary: any) => void;
  className?: string;
}

export function JobSummaryGenerator({
  jobData,
  onSummaryGenerated,
  className,
}: JobSummaryGeneratorProps) {
  const { generateSummary, isLoading, error, lastResult } = useAIJobSummary({
    enableCaching: true,
    enableAutoRetry: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const summary = await generateSummary(jobData);
      if (summary && onSummaryGenerated) {
        onSummaryGenerated(summary);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [generateSummary, jobData, onSummaryGenerated]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Sparkles className='h-5 w-5' />
          AI Job Summary
        </CardTitle>
        <CardDescription>
          Generate an intelligent summary for this job posting
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='space-y-2'>
          <div className='text-sm font-medium'>Job Details:</div>
          <div className='text-sm text-gray-600'>
            <div>
              <strong>Title:</strong> {jobData.title}
            </div>
            <div>
              <strong>Company:</strong> {jobData.company}
            </div>
            {jobData.location && (
              <div>
                <strong>Location:</strong> {jobData.location}
              </div>
            )}
            {jobData.salary && (
              <div>
                <strong>Salary:</strong> {jobData.salary}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading || isGenerating}
          className='w-full'
        >
          {(isLoading || isGenerating) && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          Generate AI Summary
        </Button>

        {lastResult && (
          <div className='space-y-3 pt-4 border-t'>
            <div className='text-sm font-medium'>Generated Summary:</div>
            <div className='text-sm text-gray-700'>{lastResult.summary}</div>

            <div>
              <div className='text-sm font-medium mb-2'>Key Requirements:</div>
              <div className='flex flex-wrap gap-1'>
                {lastResult.key_requirements.map((req, index) => (
                  <Badge key={index} variant='secondary' className='text-xs'>
                    {req}
                  </Badge>
                ))}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <div className='font-medium'>Urgency Level:</div>
                <Badge
                  variant={
                    lastResult.urgency_level === 'high'
                      ? 'destructive'
                      : lastResult.urgency_level === 'medium'
                        ? 'default'
                        : 'secondary'
                  }
                >
                  {lastResult.urgency_level}
                </Badge>
              </div>
              <div>
                <div className='font-medium'>Market Demand:</div>
                <Badge
                  variant={
                    lastResult.market_demand === 'high'
                      ? 'default'
                      : lastResult.market_demand === 'medium'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {lastResult.market_demand}
                </Badge>
              </div>
            </div>

            <div>
              <div className='text-sm font-medium'>Ideal Candidate:</div>
              <div className='text-sm text-gray-700'>
                {lastResult.ideal_candidate}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Batch Job Summarization Component
export interface BatchJobSummarizationProps {
  onComplete?: (results: any[]) => void;
  className?: string;
}

export function BatchJobSummarization({
  onComplete,
  className,
}: BatchJobSummarizationProps) {
  const {
    processWorkflow,
    getJobsNeedingSummarization,
    isLoading,
    error,
    progress,
  } = useAISupabaseJobSummary();

  const [isProcessing, setIsProcessing] = useState(false);
  const [jobsNeedingSummarization, setJobsNeedingSummarization] = useState<
    any[]
  >([]);
  const [workflowResults, setWorkflowResults] = useState<{
    processed: number;
    updated: number;
    errors: string[];
  } | null>(null);

  const handleGetJobs = useCallback(async () => {
    const jobs = await getJobsNeedingSummarization(50);
    setJobsNeedingSummarization(jobs);
  }, [getJobsNeedingSummarization]);

  const handleProcessWorkflow = useCallback(async () => {
    setIsProcessing(true);
    try {
      const results = await processWorkflow(10);
      setWorkflowResults(results);
      if (onComplete) {
        onComplete([results]);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [processWorkflow, onComplete]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Users className='h-5 w-5' />
          Batch Job Summarization
        </CardTitle>
        <CardDescription>
          Process multiple jobs for AI summarization
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='space-y-3'>
          <Button
            onClick={handleGetJobs}
            disabled={isLoading}
            variant='outline'
            className='w-full'
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Get Jobs Needing Summarization
          </Button>

          {jobsNeedingSummarization.length > 0 && (
            <div className='text-sm text-gray-600'>
              Found {jobsNeedingSummarization.length} jobs needing summarization
            </div>
          )}

          <Button
            onClick={handleProcessWorkflow}
            disabled={
              isLoading || isProcessing || jobsNeedingSummarization.length === 0
            }
            className='w-full'
          >
            {(isLoading || isProcessing) && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Process Workflow (10 jobs)
          </Button>
        </div>

        {progress.total > 0 && (
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Progress</span>
              <span>
                {progress.current}/{progress.total} ({progress.percentage}%)
              </span>
            </div>
            <Progress value={progress.percentage} className='h-2' />
          </div>
        )}

        {workflowResults && (
          <div className='space-y-2 pt-4 border-t'>
            <div className='text-sm font-medium'>Workflow Results:</div>
            <div className='grid grid-cols-3 gap-4 text-sm'>
              <div className='text-center'>
                <div className='font-medium text-green-600'>
                  {workflowResults.processed}
                </div>
                <div className='text-gray-500'>Processed</div>
              </div>
              <div className='text-center'>
                <div className='font-medium text-blue-600'>
                  {workflowResults.updated}
                </div>
                <div className='text-gray-500'>Updated</div>
              </div>
              <div className='text-center'>
                <div className='font-medium text-red-600'>
                  {workflowResults.errors.length}
                </div>
                <div className='text-gray-500'>Errors</div>
              </div>
            </div>

            {workflowResults.errors.length > 0 && (
              <div className='text-sm text-red-600'>
                <div className='font-medium'>Errors:</div>
                <ul className='list-disc list-inside'>
                  {workflowResults.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Lead Scoring Component
export interface LeadScoringProps {
  leadData: {
    name: string;
    company: string;
    role: string;
    location: string;
    experience?: string;
    industry?: string;
    company_size?: string;
  };
  onScoreGenerated?: (score: any) => void;
  className?: string;
}

export function LeadScoring({
  leadData,
  onScoreGenerated,
  className,
}: LeadScoringProps) {
  const { calculateScore, isLoading, error, lastScore } = useAILeadScoring({
    enableCaching: true,
  });

  const [isScoring, setIsScoring] = useState(false);

  const handleScore = useCallback(async () => {
    setIsScoring(true);
    try {
      const score = await calculateScore(leadData);
      if (score && onScoreGenerated) {
        onScoreGenerated(score);
      }
    } finally {
      setIsScoring(false);
    }
  }, [calculateScore, leadData, onScoreGenerated]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <TrendingUp className='h-5 w-5' />
          AI Lead Scoring
        </CardTitle>
        <CardDescription>
          Calculate AI-powered lead score for this prospect
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='space-y-2'>
          <div className='text-sm font-medium'>Lead Details:</div>
          <div className='text-sm text-gray-600'>
            <div>
              <strong>Name:</strong> {leadData.name}
            </div>
            <div>
              <strong>Company:</strong> {leadData.company}
            </div>
            <div>
              <strong>Role:</strong> {leadData.role}
            </div>
            <div>
              <strong>Location:</strong> {leadData.location}
            </div>
            {leadData.experience && (
              <div>
                <strong>Experience:</strong> {leadData.experience}
              </div>
            )}
            {leadData.industry && (
              <div>
                <strong>Industry:</strong> {leadData.industry}
              </div>
            )}
            {leadData.company_size && (
              <div>
                <strong>Company Size:</strong> {leadData.company_size}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleScore}
          disabled={isLoading || isScoring}
          className='w-full'
        >
          {(isLoading || isScoring) && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          Calculate AI Score
        </Button>

        {lastScore && (
          <div className='space-y-3 pt-4 border-t'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600'>
                {lastScore.score}
              </div>
              <div className='text-sm text-gray-500'>Lead Score (0-100)</div>
            </div>

            <div className='text-sm'>
              <div className='font-medium mb-2'>AI Analysis:</div>
              <div className='text-gray-700'>{lastScore.reason}</div>
            </div>

            <div className='text-sm'>
              <div className='font-medium mb-2'>
                Confidence: {Math.round(lastScore.confidence * 100)}%
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full'
                  style={{ width: `${lastScore.confidence * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className='text-sm font-medium mb-2'>Scoring Factors:</div>
              <div className='grid grid-cols-2 gap-2 text-xs'>
                <div className='flex justify-between'>
                  <span>Company Size:</span>
                  <span>
                    {Math.round(lastScore.factors.company_size * 100)}%
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Industry Match:</span>
                  <span>
                    {Math.round(lastScore.factors.industry_match * 100)}%
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Role Seniority:</span>
                  <span>
                    {Math.round(lastScore.factors.role_seniority * 100)}%
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Location Match:</span>
                  <span>
                    {Math.round(lastScore.factors.location_match * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Lead Optimization Component
export interface LeadOptimizationProps {
  leadData: {
    name: string;
    company: string;
    role: string;
    industry?: string;
    previous_interactions?: string[];
  };
  onOptimizationGenerated?: (optimization: any) => void;
  className?: string;
}

export function LeadOptimization({
  leadData,
  onOptimizationGenerated,
  className,
}: LeadOptimizationProps) {
  const { optimizeOutreach, isLoading, error, lastOptimization } =
    useAILeadOptimization({
      enableCaching: true,
    });

  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = useCallback(async () => {
    setIsOptimizing(true);
    try {
      const optimization = await optimizeOutreach(leadData);
      if (optimization && onOptimizationGenerated) {
        onOptimizationGenerated(optimization);
      }
    } finally {
      setIsOptimizing(false);
    }
  }, [optimizeOutreach, leadData, onOptimizationGenerated]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-5 w-5' />
          AI Lead Optimization
        </CardTitle>
        <CardDescription>
          Get AI-powered outreach recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='space-y-2'>
          <div className='text-sm font-medium'>Lead Details:</div>
          <div className='text-sm text-gray-600'>
            <div>
              <strong>Name:</strong> {leadData.name}
            </div>
            <div>
              <strong>Company:</strong> {leadData.company}
            </div>
            <div>
              <strong>Role:</strong> {leadData.role}
            </div>
            {leadData.industry && (
              <div>
                <strong>Industry:</strong> {leadData.industry}
              </div>
            )}
            {leadData.previous_interactions &&
              leadData.previous_interactions.length > 0 && (
                <div>
                  <strong>Previous Interactions:</strong>{' '}
                  {leadData.previous_interactions.join(', ')}
                </div>
              )}
          </div>
        </div>

        <Button
          onClick={handleOptimize}
          disabled={isLoading || isOptimizing}
          className='w-full'
        >
          {(isLoading || isOptimizing) && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          Optimize Outreach
        </Button>

        {lastOptimization && (
          <div className='space-y-3 pt-4 border-t'>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <div className='font-medium'>Priority Level:</div>
                <Badge
                  variant={
                    lastOptimization.priority_level === 'high'
                      ? 'destructive'
                      : lastOptimization.priority_level === 'medium'
                        ? 'default'
                        : 'secondary'
                  }
                >
                  {lastOptimization.priority_level}
                </Badge>
              </div>
              <div>
                <div className='font-medium'>Response Rate:</div>
                <div className='text-blue-600 font-medium'>
                  {lastOptimization.estimated_response_rate}%
                </div>
              </div>
            </div>

            <div>
              <div className='text-sm font-medium mb-2'>
                Best Contact Method:
              </div>
              <Badge variant='outline' className='capitalize'>
                {lastOptimization.best_contact_method}
              </Badge>
            </div>

            <div>
              <div className='text-sm font-medium mb-2'>Optimal Timing:</div>
              <div className='text-sm text-gray-700'>
                {lastOptimization.optimal_timing}
              </div>
            </div>

            <div>
              <div className='text-sm font-medium mb-2'>Suggested Actions:</div>
              <ul className='text-sm text-gray-700 space-y-1'>
                {lastOptimization.suggested_actions.map((action, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='text-blue-500 mt-1'>•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
