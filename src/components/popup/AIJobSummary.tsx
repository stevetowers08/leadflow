// AI Job Summary Component for Jobs Popup
import React, { useState, useCallback } from 'react';
import { useAIJobSummary } from '../../hooks/useAI';
import { useAI } from '../../contexts/AIContext';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Sparkles, TrendingUp, Users, Clock, DollarSign, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface AIJobSummaryProps {
  job: {
    id: string;
    title: string;
    description?: string;
    location?: string;
    salary?: string;
    salary_min?: number;
    salary_max?: number;
    employment_type?: string;
    seniority_level?: string;
    company_name?: string;
  };
  className?: string;
}

export const AIJobSummary: React.FC<AIJobSummaryProps> = ({ job, className }) => {
  const { isAvailable } = useAI();
  const { generateSummary, isLoading, error, lastResult } = useAIJobSummary({
    enableCaching: true,
    enableAutoRetry: true
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Format salary for display
  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
    } else if (job.salary) {
      return job.salary;
    } else if (job.salary_min) {
      return `$${job.salary_min.toLocaleString()}+`;
    } else if (job.salary_max) {
      return `Up to $${job.salary_max.toLocaleString()}`;
    }
    return undefined;
  };

  const handleGenerate = useCallback(async () => {
    if (!job?.description || !job?.title) {
      console.warn('AIJobSummary: Missing required job data', job);
      return;
    }

    setIsGenerating(true);
    try {
      await generateSummary({
        title: job.title || 'Unknown Job',
        company: job.company_name || 'Unknown Company',
        description: job.description,
        location: job.location || '',
        salary: formatSalary()
      });
    } catch (error) {
      console.error('AIJobSummary: Error generating summary', error);
    } finally {
      setIsGenerating(false);
    }
  }, [generateSummary, job]);

  // Don't render if AI is not available
  if (!isAvailable) {
    return null;
  }

  // Don't render if no job or missing required data
  if (!job || !job.description || !job.title) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* AI Summary Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">AI Job Summary</span>
        </div>
        
        {!lastResult && (
          <button
            onClick={handleGenerate}
            disabled={isLoading || isGenerating}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md h-8 px-3"
          >
            {(isLoading || isGenerating) && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Generate
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-xs">
            Failed to generate AI summary: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* AI Summary Content */}
      {lastResult && (
        <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          {/* Summary Text */}
          <div className="text-sm text-blue-900 leading-relaxed">
            {lastResult.summary}
          </div>

          {/* Key Requirements */}
          {lastResult.key_requirements && lastResult.key_requirements.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-blue-700 mb-2">Key Requirements</div>
              <div className="flex flex-wrap gap-1">
                {lastResult.key_requirements.slice(0, 4).map((req, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                    {req}
                  </Badge>
                ))}
                {lastResult.key_requirements.length > 4 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{lastResult.key_requirements.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-sidebar-primary" />
              <span className="text-sidebar-primary font-medium">Urgency:</span>
              <Badge 
                variant={lastResult.urgency_level === 'high' ? 'destructive' : 
                        lastResult.urgency_level === 'medium' ? 'default' : 'secondary'}
                className="text-xs px-1 py-0"
              >
                {lastResult.urgency_level}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-blue-600" />
              <span className="text-blue-700 font-medium">Demand:</span>
              <Badge 
                variant={lastResult.market_demand === 'high' ? 'default' : 
                        lastResult.market_demand === 'medium' ? 'secondary' : 'outline'}
                className="text-xs px-1 py-0"
              >
                {lastResult.market_demand}
              </Badge>
            </div>
          </div>

          {/* Expandable Section */}
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-2 text-blue-600 hover:text-blue-700"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show More
                </>
              )}
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-3 pt-3 border-t border-blue-200">
                {/* Ideal Candidate */}
                {lastResult.ideal_candidate && (
                  <div>
                    <div className="text-xs font-semibold text-blue-700 mb-1">Ideal Candidate</div>
                    <div className="text-xs text-blue-900">{lastResult.ideal_candidate}</div>
                  </div>
                )}

                {/* Skills Extracted */}
                {lastResult.skills_extracted && lastResult.skills_extracted.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-blue-700 mb-2">Skills Required</div>
                    <div className="flex flex-wrap gap-1">
                      {lastResult.skills_extracted.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {lastResult.salary_range && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-700 font-medium">Salary:</span>
                      <span className="text-blue-900">{lastResult.salary_range}</span>
                    </div>
                  )}
                  {lastResult.remote_flexibility !== undefined && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-700 font-medium">Remote:</span>
                      <Badge 
                        variant={lastResult.remote_flexibility ? 'default' : 'secondary'}
                        className="text-xs px-1 py-0"
                      >
                        {lastResult.remote_flexibility ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
