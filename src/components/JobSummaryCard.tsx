import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Brain, RefreshCw, FileText, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { aiService, JobSummary } from "@/services/aiService";

interface JobSummaryCardProps {
  jobData: {
    title: string;
    company: string;
    description: string;
    requirements: string;
    location: string;
    salary?: string;
  };
  onSummaryUpdate?: (summary: JobSummary) => void;
}

export function JobSummaryCard({ jobData, onSummaryUpdate }: JobSummaryCardProps) {
  const [summary, setSummary] = useState<JobSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    if (!aiService.isAvailable()) {
      setError("AI service not available");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const aiSummary = await aiService.generateJobSummary(jobData);
      setSummary(aiSummary);
      onSummaryUpdate?.(aiSummary);
    } catch (err) {
      setError("Failed to generate job summary");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return "bg-red-100 text-red-800 border-red-200";
      case 'medium': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'low': return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return "bg-green-100 text-green-800 border-green-200";
      case 'medium': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'low': return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-red-500" />
            Job Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600 mb-3">{error}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummary}
            className="h-8 px-3 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4 animate-pulse" />
            Generating Summary...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4" />
            Job Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-3">
            Generate an AI-powered summary of this job posting
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummary}
            className="h-8 px-3 text-xs"
          >
            <Brain className="h-3 w-3 mr-1" />
            Generate Summary
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Job Summary
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummary}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div>
          <div className="text-sm font-medium mb-1">Summary</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {summary.summary}
          </div>
        </div>

        {/* Key Requirements */}
        <div>
          <div className="text-sm font-medium mb-2">Key Requirements</div>
          <div className="space-y-1">
            {summary.key_requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-2 text-xs">
                <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ideal Candidate */}
        <div>
          <div className="text-sm font-medium mb-1">Ideal Candidate</div>
          <div className="text-xs text-muted-foreground">
            {summary.ideal_candidate}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`${getUrgencyColor(summary.urgency_level)} border text-xs`}>
                  <Clock className="h-3 w-3 mr-1" />
                  {summary.urgency_level.toUpperCase()}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Urgency Level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`${getDemandColor(summary.market_demand)} border text-xs`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {summary.market_demand.toUpperCase()} DEMAND
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Market Demand</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
