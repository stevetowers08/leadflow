"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  Briefcase,
  Building2,
  Users,
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

export function DashboardContent() {
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
    <>
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your recruitment activity.
          </p>
        </div>
      </div>

      <SectionCards
        jobsToReview={jobsToReview.length}
        activities={activities.length}
        newLeadsToday={newLeadsToday}
        newCompaniesToday={newCompaniesToday}
        loading={loading}
      />

      <div className="px-4 lg:px-6">
        <Card>
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
      </div>
    </>
  )
}

function SectionCards({
  jobsToReview,
  activities,
  newLeadsToday,
  newCompaniesToday,
  loading,
}: {
  jobsToReview: number
  activities: number
  newLeadsToday: number
  newCompaniesToday: number
  loading: boolean
}) {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card" data-slot="card">
        <CardHeader className="relative">
          <CardDescription>Jobs to Review</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {loading ? '…' : jobsToReview}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Pending qualification
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card" data-slot="card">
        <CardHeader className="relative">
          <CardDescription>Recent Activities</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {loading ? '…' : activities}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Last 24 hours
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card" data-slot="card">
        <CardHeader className="relative">
          <CardDescription>New Leads Today</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {loading ? '…' : newLeadsToday}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Added today
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card" data-slot="card">
        <CardHeader className="relative">
          <CardDescription>New Companies Today</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {loading ? '…' : newCompaniesToday}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Added today
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

