import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  StickyNote, 
  ExternalLink, 
  MapPin, 
  Building2,
  User,
  UserCheck,
  UserX,
  Clock,
  Star
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import type { RecentJob } from "@/services/dashboardService";

interface RecentJobsTabsProps {
  jobs: RecentJob[];
  loading: boolean;
}

export const RecentJobsTabs: React.FC<RecentJobsTabsProps> = ({ jobs, loading }) => {
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();
  const [activeTab, setActiveTab] = useState("unassigned");

  // Filter jobs by assignment status
  const filteredJobs = useMemo(() => {
    const unassigned = jobs.filter(job => !job.assigned_to);
    const assignedToMe = jobs.filter(job => job.assigned_to === user?.id);
    const recentlyAssigned = jobs.filter(job => 
      job.assigned_to && job.assigned_to !== user?.id
    );

    return {
      unassigned,
      assignedToMe,
      recentlyAssigned
    };
  }, [jobs, user?.id]);

  const getPriorityColor = (priority?: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderJobCard = (job: RecentJob) => (
    <div
      key={job.id}
      className="group p-4 bg-white rounded-lg border border-gray-200 hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => openPopup('job', job.id, job.title)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900 truncate">{job.title}</h4>
            {job.notes_count && job.notes_count > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <StickyNote className="h-3 w-3" />
                <span>{job.notes_count}</span>
              </div>
            )}
          </div>
          
          {job.company_name && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              {job.company_logo_url ? (
                <img
                  src={job.company_logo_url}
                  alt={job.company_name}
                  className="w-4 h-4 rounded object-cover"
                />
              ) : (
                <Building2 className="h-4 w-4" />
              )}
              <span className="font-medium truncate">{job.company_name}</span>
            </div>
          )}
          
          {job.location && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{job.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 mb-2">
            {job.employment_type && (
              <Badge variant="outline" className="text-xs">
                {job.employment_type}
              </Badge>
            )}
            {job.seniority_level && (
              <Badge variant="outline" className="text-xs">
                {job.seniority_level}
              </Badge>
            )}
            {job.priority && (
              <Badge className={`text-xs ${getPriorityColor(job.priority)}`}>
                {job.priority}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {job.stage && (
                <Badge variant="outline" className="text-xs">
                  {job.stage}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                openPopup('job', job.id, job.title);
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {job.company_logo_url && (
          <div className="ml-3 flex-shrink-0">
            <img
              src={job.company_logo_url}
              alt={job.company_name || "Company"}
              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderJobsList = (jobsList: RecentJob[], emptyMessage: string) => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      );
    }

    if (jobsList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {jobsList.map(renderJobCard)}
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10">
            <Briefcase className="h-4 w-4 text-secondary" />
          </div>
          Recent Jobs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unassigned" className="flex items-center gap-1">
              <UserX className="h-3 w-3" />
              Unassigned
              {filteredJobs.unassigned.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredJobs.unassigned.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="assignedToMe" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Mine
              {filteredJobs.assignedToMe.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredJobs.assignedToMe.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="recentlyAssigned" className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Assigned
              {filteredJobs.recentlyAssigned.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredJobs.recentlyAssigned.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unassigned" className="mt-4">
            {renderJobsList(
              filteredJobs.unassigned,
              "No unassigned jobs found"
            )}
          </TabsContent>
          
          <TabsContent value="assignedToMe" className="mt-4">
            {renderJobsList(
              filteredJobs.assignedToMe,
              "No jobs assigned to you"
            )}
          </TabsContent>
          
          <TabsContent value="recentlyAssigned" className="mt-4">
            {renderJobsList(
              filteredJobs.recentlyAssigned,
              "No recently assigned jobs"
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
