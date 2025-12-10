"use client"

import * as React from "react"
import { AppSidebar } from "./app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { useDashboardData, useDashboardChartData } from "@/hooks/useDashboardData"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface Dashboard01Props {
  children?: React.ReactNode
}

export function Dashboard01({ children }: Dashboard01Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children || <DashboardContent />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function DashboardContent() {
  const router = useRouter()
  const {
    data: dashboardData,
    isLoading: loading,
    error: dashboardError,
  } = useDashboardData()

  const { data: chartData = [], isLoading: chartLoading } =
    useDashboardChartData(true)

  const jobsToReview = dashboardData?.jobsToReview || []
  const activities = dashboardData?.activities || []
  const newLeadsToday = dashboardData?.newLeadsToday || 0
  const newCompaniesToday = dashboardData?.newCompaniesToday || 0

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {getGreeting()}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s an overview of your recruitment activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jobs to Review
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '…' : jobsToReview.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending qualification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activities
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '…' : activities.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Leads Today
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '…' : newLeadsToday}
            </div>
            <p className="text-xs text-muted-foreground">
              Added today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Companies Today
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '…' : newCompaniesToday}
            </div>
            <p className="text-xs text-muted-foreground">
              Added today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Last 7 days activity trends</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {loading || chartLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : chartData && chartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="jobs"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Jobs"
                    />
                    <Line
                      type="monotone"
                      dataKey="leads"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      name="Leads"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No chart data available
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : activities.length > 0 ? (
                activities.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                    onClick={() => {
                      if (activity.type === 'email_reply' || activity.type === 'email') {
                        router.push(
                          `/conversations${activity.person_id ? `?person=${activity.person_id}` : ''}`
                        )
                      } else if (activity.person_id) {
                        router.push(`/people/${activity.person_id}`)
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{activity.description}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

