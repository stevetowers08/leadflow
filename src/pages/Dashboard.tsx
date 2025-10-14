/**
 * Modern Dashboard Page - Lead Generation CRM Morning View
 * 
 * Features:
 * - Personalized welcome message with time-based greeting
 * - Today-focused metrics (new jobs, automated jobs, lead activity)
 * - Quick action cards for daily tasks
 * - Recent leads and companies added today
 * - Clean, actionable morning view design
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import { useReportingData } from "@/hooks/useReportingData";
import { supabase } from "@/integrations/supabase/client";
import {
    Activity,
    Building2,
    Calendar,
    MessageSquare,
    Plus,
    Target,
    TrendingUp,
    Users,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { data, isLoading } = useReportingData();
  const navigate = useNavigate();
  const { openPopup } = usePopupNavigation();
  const [todaysData, setTodaysData] = useState({
    newJobsToday: 0,
    newLeadsToday: 0,
    newCompaniesToday: 0,
    automatedJobs: 0,
    pendingFollowUps: 0
  });
  const [todaysJobs, setTodaysJobs] = useState([]);
  const [todaysCompanies, setTodaysCompanies] = useState([]);
  
  // Get current time for personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Handle clicking on items
  const handleItemClick = (item: any, type: 'job' | 'company' | 'person') => {
    console.log(`Clicked ${type}:`, item);
    
    if (type === 'job') {
      openPopup('job', item.id, item.title);
    } else if (type === 'company') {
      openPopup('company', item.id, item.name);
    } else if (type === 'person') {
      openPopup('person', item.id, item.name);
    }
  };

  // Fetch today's actual data
  useEffect(() => {
    const fetchTodaysData = async () => {
      try {
        // Get today's date in YYYY-MM-DD format (2025-10-08)
        const today = new Date().toISOString().split('T')[0];
        console.log('Fetching data for today:', today);
        
        // Use a simpler approach with date casting
        const [jobsResult, peopleResult, companiesResult, interactionsResult] = await Promise.all([
          supabase
            .from('jobs')
            .select(`
              id, 
              title,
              automation_active, 
              created_at,
              companies!left(
                id,
                name,
                industry
              )
            `)
            .gte('created_at', today)
            .lt('created_at', `${today}T23:59:59.999Z`),
          
          supabase
            .from('people')
            .select('id, automation_started_at, created_at')
            .gte('created_at', today)
            .lt('created_at', `${today}T23:59:59.999Z`),
          
          supabase
            .from('companies')
            .select(`
              id, 
              name,
              industry,
              created_at
            `)
            .gte('created_at', today)
            .lt('created_at', `${today}T23:59:59.999Z`),
          
          supabase
            .from('interactions')
            .select('id, interaction_type, created_at')
            .gte('created_at', today)
            .lt('created_at', `${today}T23:59:59.999Z`)
        ]);

        console.log('Dashboard data results:', {
          jobs: jobsResult.data?.length,
          people: peopleResult.data?.length,
          companies: companiesResult.data?.length,
          interactions: interactionsResult.data?.length,
          today: today,
          jobsError: jobsResult.error,
          peopleError: peopleResult.error,
          jobsData: jobsResult.data
        });

        setTodaysData({
          newJobsToday: jobsResult.data?.length || 0,
          newLeadsToday: peopleResult.data?.length || 0,
          newCompaniesToday: companiesResult.data?.length || 0,
          automatedJobs: jobsResult.data?.filter(job => job.automation_active).length || 0,
          pendingFollowUps: interactionsResult.data?.filter(i => i.interaction_type === 'linkedin_connection_request_sent').length || 0
        });

        // Set the actual jobs and companies data
        setTodaysJobs(jobsResult.data || []);
        setTodaysCompanies(companiesResult.data || []);
      } catch (error) {
        console.error('Error fetching today\'s data:', error);
      }
    };

    fetchTodaysData();
  }, []);

  
  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-8 p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getGreeting()}, Welcome Back!
          </h1>
          <p className="text-gray-600">Here's what's happening with your leads today</p>
        </div>

        {/* Today's Key Metrics */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">New Jobs Today</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{todaysData.newJobsToday}</span>
            </div>
          </Card>
          
          <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Automated Jobs</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{todaysData.automatedJobs}</span>
            </div>
          </Card>
          
          <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">New Leads Today</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{todaysData.newLeadsToday}</span>
            </div>
          </Card>
          
          <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Pending Follow-ups</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{todaysData.pendingFollowUps}</span>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* New Jobs Today */}
          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
                <Target className="h-5 w-5 text-gray-600" />
                New Jobs Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todaysJobs.slice(0, 4).map((job, index) => (
                  <div 
                    key={job.id || index} 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                    onClick={() => handleItemClick(job, 'job')}
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                      {job.companies?.name ? job.companies.name.charAt(0).toUpperCase() : 'J'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">
                        {job.companies?.name || 'Unknown Company'} • {job.companies?.industry || 'Unknown Industry'}
                      </p>
                    </div>
                    <Badge className="text-xs px-2 py-1 bg-green-100 text-green-700 border-green-200">
                      New Job
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('/jobs')}>
                <Plus className="h-4 w-4 mr-2" />
                View All Jobs
              </Button>
            </CardContent>
          </Card>

          {/* New Companies & People Today */}
          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
                <Building2 className="h-5 w-5 text-gray-600" />
                New Companies & People
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todaysCompanies.slice(0, 4).map((company, index) => (
                  <div 
                    key={company.id || index} 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                    onClick={() => handleItemClick(company, 'company')}
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-sm font-semibold text-green-600">
                      {company.name ? company.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{company.name}</p>
                      <p className="text-sm text-gray-500">
                        {company.industry || 'Unknown Industry'}
                      </p>
                    </div>
                    <Badge className="text-xs px-2 py-1 bg-blue-100 text-blue-700 border-blue-200">
                      New Company
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('/companies')}>
                <Plus className="h-4 w-4 mr-2" />
                View All Companies
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Activity Summary */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
              <Activity className="h-5 w-5 text-gray-600" />
              Today's Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Emails Sent</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{data?.automationMetrics?.messagesSent || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Response Rate</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{data?.automationMetrics?.messageResponseRate?.toFixed(1) || 0}%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Meetings Booked</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{data?.automationMetrics?.meetingsBooked || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}