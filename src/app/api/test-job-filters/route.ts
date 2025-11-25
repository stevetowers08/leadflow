import { NextRequest, NextResponse } from 'next/server';
import { APIErrorHandler } from '@/lib/api-error-handler';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Tables } from '@/integrations/supabase/types';

type JobWithCompany = Pick<
  Tables<'jobs'>,
  'id' | 'title' | 'location' | 'salary' | 'description' | 'created_at'
> & {
  companies: Pick<Tables<'companies'>, 'name'> | null;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const body = await request.json();
    const { filterConfig } = body;

    // Get recent jobs for testing
    const { data: testJobs, error } = await supabase
      .from('jobs')
      .select<JobWithCompany>(
        `
        id,
        title,
        location,
        salary,
        description,
        created_at,
        companies!inner(name)
      `
      )
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .limit(20);

    if (error) {
      throw error;
    }

    // Apply filters (simplified)
    const filteredJobs =
      testJobs?.filter(job => {
        if (filterConfig?.primary_location && job.location) {
          return job.location
            .toLowerCase()
            .includes(filterConfig.primary_location.toLowerCase());
        }
        return true;
      }) || [];

    // Calculate match scores (simplified)
    const jobsWithScores = filteredJobs.map(job => ({
      id: job.id,
      title: job.title,
      company_name: job.companies?.name || 'Unknown',
      location: job.location,
      salary: job.salary,
      match_score: 0.85, // Simplified
      filter_reason: 'Location match',
    }));

    return NextResponse.json(
      {
        success: true,
        total_jobs: testJobs?.length || 0,
        filtered_jobs: jobsWithScores.length,
        match_rate:
          testJobs?.length
            ? (jobsWithScores.length / testJobs.length) * 100
            : 0,
        results: jobsWithScores,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Test job filters error:', error);
    return APIErrorHandler.handleError(error, 'test-job-filters');
  }
}


