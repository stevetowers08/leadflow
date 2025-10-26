// supabase/functions/test-job-filters/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async req => {
  try {
    const { filterConfig } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

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
      .gte(
        'created_at',
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      )
      .limit(20);

    if (error) throw error;

    // Apply filters to test jobs
    const filteredJobs =
      testJobs?.filter(job => {
        return applyJobFilters(job, filterConfig);
      }) || [];

    // Calculate match scores
    const jobsWithScores = filteredJobs.map(job => ({
      id: job.id,
      title: job.title,
      company_name: job.companies?.name || 'Unknown',
      location: job.location,
      salary: job.salary,
      match_score: calculateMatchScore(job, filterConfig),
      filter_reason: generateFilterReason(job, filterConfig),
    }));

    return new Response(
      JSON.stringify({
        success: true,
        total_jobs: testJobs?.length || 0,
        filtered_jobs: jobsWithScores.length,
        match_rate: testJobs?.length
          ? (jobsWithScores.length / testJobs.length) * 100
          : 0,
        results: jobsWithScores,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

function applyJobFilters(
  job: Record<string, unknown>,
  config: Record<string, unknown>
): boolean {
  // Location filtering
  if (
    config.primary_location &&
    !checkLocationMatch(
      job.location,
      config.primary_location,
      config.search_radius
    )
  ) {
    return false;
  }

  // Job title filtering
  if (config.target_job_titles && config.target_job_titles.length > 0) {
    const titleMatch = config.target_job_titles.some((title: string) =>
      job.title.toLowerCase().includes(title.toLowerCase())
    );
    if (!titleMatch) return false;
  }

  // Excluded titles
  if (config.excluded_job_titles && config.excluded_job_titles.length > 0) {
    const excludedMatch = config.excluded_job_titles.some((title: string) =>
      job.title.toLowerCase().includes(title.toLowerCase())
    );
    if (excludedMatch) return false;
  }

  // Salary filtering
  if (config.min_salary && job.salary) {
    const salary = parseInt(job.salary.replace(/[^0-9]/g, ''));
    if (salary < config.min_salary) return false;
  }

  // Keyword filtering
  if (config.required_keywords && config.required_keywords.length > 0) {
    const keywordMatch = config.required_keywords.every((keyword: string) =>
      job.description.toLowerCase().includes(keyword.toLowerCase())
    );
    if (!keywordMatch) return false;
  }

  // Excluded keywords
  if (config.excluded_keywords && config.excluded_keywords.length > 0) {
    const excludedKeywordMatch = config.excluded_keywords.some(
      (keyword: string) =>
        job.description.toLowerCase().includes(keyword.toLowerCase())
    );
    if (excludedKeywordMatch) return false;
  }

  // Excluded industries
  if (config.excluded_industries && config.excluded_industries.length > 0) {
    const excludedIndustryMatch = config.excluded_industries.some(
      (industry: string) =>
        job.description.toLowerCase().includes(industry.toLowerCase())
    );
    if (excludedIndustryMatch) return false;
  }

  return true;
}

function calculateMatchScore(
  job: Record<string, unknown>,
  config: Record<string, unknown>
): number {
  let score = 0;
  let totalChecks = 0;

  // Location match (30% weight)
  if (config.primary_location) {
    totalChecks += 30;
    if (
      checkLocationMatch(
        job.location,
        config.primary_location,
        config.search_radius
      )
    ) {
      score += 30;
    }
  }

  // Title match (25% weight)
  if (config.target_job_titles && config.target_job_titles.length > 0) {
    totalChecks += 25;
    const titleMatch = config.target_job_titles.some((title: string) =>
      job.title.toLowerCase().includes(title.toLowerCase())
    );
    if (titleMatch) score += 25;
  }

  // Salary match (20% weight)
  if (config.min_salary && job.salary) {
    totalChecks += 20;
    const salary = parseInt(job.salary.replace(/[^0-9]/g, ''));
    if (salary >= config.min_salary) {
      score += 20;
    }
  }

  // Keyword match (25% weight)
  if (config.required_keywords && config.required_keywords.length > 0) {
    totalChecks += 25;
    const keywordMatch = config.required_keywords.every((keyword: string) =>
      job.description.toLowerCase().includes(keyword.toLowerCase())
    );
    if (keywordMatch) score += 25;
  }

  return totalChecks > 0 ? score / totalChecks : 0;
}

function checkLocationMatch(
  jobLocation: string,
  targetLocation: string,
  radius: number
): boolean {
  // Simple location matching - in a real implementation, you'd use geocoding
  const jobCity = jobLocation.toLowerCase().split(',')[0].trim();
  const targetCity = targetLocation.toLowerCase().split(',')[0].trim();

  return jobCity.includes(targetCity) || targetCity.includes(jobCity);
}

function generateFilterReason(
  job: Record<string, unknown>,
  config: Record<string, unknown>
): string {
  const reasons = [];

  if (
    config.primary_location &&
    checkLocationMatch(
      job.location,
      config.primary_location,
      config.search_radius
    )
  ) {
    reasons.push('Location match');
  }

  if (config.target_job_titles && config.target_job_titles.length > 0) {
    const matchingTitle = config.target_job_titles.find((title: string) =>
      job.title.toLowerCase().includes(title.toLowerCase())
    );
    if (matchingTitle) {
      reasons.push(`Title contains "${matchingTitle}"`);
    }
  }

  if (config.required_keywords && config.required_keywords.length > 0) {
    const matchingKeywords = config.required_keywords.filter(
      (keyword: string) =>
        job.description.toLowerCase().includes(keyword.toLowerCase())
    );
    if (matchingKeywords.length > 0) {
      reasons.push(`Contains keywords: ${matchingKeywords.join(', ')}`);
    }
  }

  return reasons.join('; ') || 'Basic match';
}
