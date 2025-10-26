import { PeopleReplySummary } from '@/components/analytics/PersonReplyAnalytics';
import { ReplyAnalyticsDashboard } from '@/components/analytics/ReplyAnalyticsDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AnalyticsTestPage() {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Reply Analytics Test Page
        </h1>
        <p className='text-gray-600'>
          Testing the new reply analytics and reporting features
        </p>
      </div>

      {/* Main Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Reply Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ReplyAnalyticsDashboard />
        </CardContent>
      </Card>

      {/* Test with sample data */}
      <Card>
        <CardHeader>
          <CardTitle>People Reply Summary Test</CardTitle>
        </CardHeader>
        <CardContent>
          <PeopleReplySummary people={[]} showStageBreakdown={true} />
        </CardContent>
      </Card>
    </div>
  );
}
