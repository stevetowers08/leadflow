import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APIErrorHandler } from '@/lib/api-error-handler';

export async function POST(request: NextRequest) {
  try {
    const envCheck = APIErrorHandler.validateEnvVars([
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]);

    if (!envCheck.allPresent) {
      return APIErrorHandler.handleError(
        new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`),
        'test-job-filters'
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await request.json();
    const { filterConfig } = body;

    // Get recent jobs for testing
    const { data: testJobs, error } = await supabase
      .from('jobs')
      .select(
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
      company_name: (job.companies as any)?.name || 'Unknown',
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


