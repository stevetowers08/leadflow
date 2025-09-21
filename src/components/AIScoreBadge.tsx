import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import { aiService, AIScore } from "@/services/aiService";

interface AIScoreBadgeProps {
  leadData: {
    name: string;
    company: string;
    role: string;
    location: string;
    experience?: string;
    industry?: string;
    company_size?: string;
  };
  initialScore?: number;
  showDetails?: boolean;
  onScoreUpdate?: (score: AIScore) => void;
}

export function AIScoreBadge({ 
  leadData, 
  initialScore, 
  showDetails = false, 
  onScoreUpdate 
}: AIScoreBadgeProps) {
  const [score, setScore] = useState<AIScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateScore = async () => {
    if (!aiService.isAvailable()) {
      setError("AI service not available");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const aiScore = await aiService.calculateLeadScore(leadData);
      setScore(aiScore);
      onScoreUpdate?.(aiScore);
    } catch (err) {
      setError("Failed to calculate AI score");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialScore && !score) {
      // Use initial score as fallback
      setScore({
        score: initialScore,
        reason: "AI Score",
        confidence: 0.5,
        factors: {
          company_size: 0.7,
          industry_match: 0.6,
          role_seniority: 0.8,
          location_match: 0.5,
          experience_match: 0.6
        }
      });
    }
  }, [initialScore, score]);

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (scoreValue >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (scoreValue >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-1">
        <Badge variant="secondary" className="w-12 h-6 flex items-center justify-center">
          <span className="font-mono text-xs">
            {initialScore || "-"}
          </span>
        </Badge>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-1">
        <Badge variant="secondary" className="w-12 h-6 flex items-center justify-center">
          <RefreshCw className="h-3 w-3 animate-spin" />
        </Badge>
        <div className="text-xs text-muted-foreground text-center max-w-20 leading-tight">
          Calculating...
        </div>
      </div>
    );
  }

  if (!score) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={calculateScore}
              className="h-6 px-2 text-xs"
            >
              Score
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Click to calculate AI score</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const scoreDisplay = (
    <div className="flex flex-col items-center gap-1">
      <Badge className={`${getScoreColor(score.score)} border w-12 h-6 flex items-center justify-center`}>
        <span className="font-mono text-xs font-semibold">
          {score.score}
        </span>
      </Badge>
    </div>
  );

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {scoreDisplay}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <div className="font-medium text-sm">AI Score: {score.score}/100</div>
              <div className="text-xs">{score.reason}</div>
              <div className="text-xs">
                Confidence: <span className={getConfidenceColor(score.confidence)}>
                  {Math.round(score.confidence * 100)}%
                </span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-2">
      {scoreDisplay}
      
      <Card className="p-3">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm">AI Analysis</div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {score.reason}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Confidence:</span>
              <span className={getConfidenceColor(score.confidence)}>
                {Math.round(score.confidence * 100)}%
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs font-medium">Score Factors:</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex justify-between">
                  <span>Company Size:</span>
                  <span>{Math.round(score.factors.company_size * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Industry Match:</span>
                  <span>{Math.round(score.factors.industry_match * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Role Seniority:</span>
                  <span>{Math.round(score.factors.role_seniority * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Location Match:</span>
                  <span>{Math.round(score.factors.location_match * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span>{Math.round(score.factors.experience_match * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
