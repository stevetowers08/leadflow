import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Target, Users, Clock, Zap, RefreshCw } from "lucide-react";
import { aiService, LeadOptimization } from "@/services/aiService";

interface OptimizationStats {
  totalLeads: number;
  optimizedLeads: number;
  avgResponseRate: number;
  topPerformingActions: string[];
  aiInsights: string[];
}

interface AIOptimizationDashboardProps {
  leads: any[];
  onOptimizationComplete?: (optimizations: LeadOptimization[]) => void;
}

export function AIOptimizationDashboard({ leads, onOptimizationComplete }: AIOptimizationDashboardProps) {
  const [optimizations, setOptimizations] = useState<LeadOptimization[]>([]);
  const [stats, setStats] = useState<OptimizationStats>({
    totalLeads: 0,
    optimizedLeads: 0,
    avgResponseRate: 0,
    topPerformingActions: [],
    aiInsights: []
  });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const processOptimizations = async () => {
    if (!aiService.isAvailable()) {
      return;
    }

    setProcessing(true);
    try {
      const optimizationPromises = leads.slice(0, 10).map(lead => 
        aiService.optimizeLeadOutreach({
          name: lead.name || lead.Name || "Unknown",
          company: lead.company || lead.Company || "Unknown",
          role: lead["Company Role"] || "Unknown",
          industry: lead.Industry,
          previous_interactions: []
        })
      );

      const results = await Promise.all(optimizationPromises);
      setOptimizations(results);
      onOptimizationComplete?.(results);
      
      // Calculate stats
      const avgResponseRate = results.reduce((sum, opt) => sum + opt.estimated_response_rate, 0) / results.length;
      const actionCounts: Record<string, number> = {};
      results.forEach(opt => {
        opt.suggested_actions.forEach(action => {
          actionCounts[action] = (actionCounts[action] || 0) + 1;
        });
      });
      
      const topActions = Object.entries(actionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([action]) => action);

      setStats({
        totalLeads: leads.length,
        optimizedLeads: results.length,
        avgResponseRate: Math.round(avgResponseRate),
        topPerformingActions: topActions,
        aiInsights: [
          `AI optimized ${results.length} leads with ${Math.round(avgResponseRate)}% avg response rate`,
          `Top action: ${topActions[0] || 'Personalized outreach'}`,
          `Priority distribution: ${results.filter(r => r.priority_level === 'high').length} high, ${results.filter(r => r.priority_level === 'medium').length} medium`
        ]
      });
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (leads.length > 0) {
      setStats(prev => ({
        ...prev,
        totalLeads: leads.length
      }));
    }
  }, [leads]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return "bg-red-100 text-red-800 border-red-200";
      case 'medium': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'low': return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'email': return "bg-blue-100 text-blue-800 border-blue-200";
      case 'linkedin': return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case 'phone': return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Optimization Dashboard
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            AI-powered lead optimization and outreach recommendations
          </p>
        </div>
        <Button
          onClick={processOptimizations}
          disabled={processing || !aiService.isAvailable()}
          className="h-8 px-3 text-xs"
        >
          {processing ? (
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Zap className="h-3 w-3 mr-1" />
          )}
          {processing ? 'Processing...' : 'Optimize Leads'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">Available for optimization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Optimized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.optimizedLeads}</div>
            <p className="text-xs text-muted-foreground">AI processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseRate}%</div>
            <Progress value={stats.avgResponseRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              AI Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={aiService.isAvailable() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {aiService.isAvailable() ? "Active" : "Offline"}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {aiService.isAvailable() ? "Ready to optimize" : "API key required"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {stats.aiInsights.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.aiInsights.map((insight, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Actions */}
      {stats.topPerformingActions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Top Performing Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.topPerformingActions.map((action, index) => (
                <StatusBadge status={action} size="sm" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Results */}
      {optimizations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizations.slice(0, 5).map((opt, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <StatusBadge status={opt.priority_level} size="sm" />
                      <StatusBadge status={opt.best_contact_method} size="sm" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {opt.suggested_actions[0]}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{opt.estimated_response_rate}%</div>
                    <div className="text-xs text-muted-foreground">Response Rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
