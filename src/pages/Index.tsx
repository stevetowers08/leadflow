import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Briefcase, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalLeads: number;
  totalCompanies: number;
  totalJobs: number;
  recentLeads: number;
}

const Index = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalCompanies: 0,
    totalJobs: 0,
    recentLeads: 0,
  });

  const fetchStats = async () => {
    try {
      const [leadsCount, companiesCount, jobsCount, recentLeadsCount] = await Promise.all([
        supabase.from("People").select("*", { count: "exact", head: true }),
        supabase.from("Companies").select("*", { count: "exact", head: true }),
        supabase.from("Jobs").select("*", { count: "exact", head: true }),
        supabase
          .from("People")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      setStats({
        totalLeads: leadsCount.count || 0,
        totalCompanies: companiesCount.count || 0,
        totalJobs: jobsCount.count || 0,
        recentLeads: recentLeadsCount.count || 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Overview of your recruitment metrics and activities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentLeads}</div>
            <p className="text-xs text-muted-foreground">leads added</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your recruitment pipeline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/leads"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Add New Lead</div>
              <div className="text-sm text-muted-foreground">
                Create a new lead record
              </div>
            </a>
            <a
              href="/companies"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Add Company</div>
              <div className="text-sm text-muted-foreground">
                Register a new company
              </div>
            </a>
            <a
              href="/jobs"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Post New Job</div>
              <div className="text-sm text-muted-foreground">
                Create a job opening
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates in your CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity to display. Start by adding some leads!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
