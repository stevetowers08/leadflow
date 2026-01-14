/**
 * Database query optimization utilities
 * Replaces SELECT * with specific column selections for better performance
 */

// Common column selections for different tables
// Updated to match actual database schema (owner_id removed, using client_id)
export const TABLE_COLUMNS = {
  companies: [
    'id',
    'name',
    'website',
    'linkedin_url',
    'head_office',
    'industry',
    'company_size',
    'priority',
    'logo_url',
    'created_at',
    'updated_at',
    'client_id',
    'is_favourite',
    'confidence_level',
    'lead_score',
    'score_reason',
  ],

  people: [
    'id',
    'name',
    'company_id',
    'email_address',
    'linkedin_url',
    'employee_location',
    'company_role',
    'score',
    'people_stage',
    'confidence_level',
    'created_at',
    'updated_at',
    'client_id',
  ],

  jobs: [
    'id',
    'title',
    'company_id',
    'job_url',
    'posted_date',
    'location',
    'description',
    'summary',
    'employment_type',
    'seniority_level',
    'priority',
    'created_at',
    'updated_at',
    'client_id',
  ],

  // Note: interactions table doesn't exist - use activity_log instead
  activity_log: [
    'id',
    'lead_id',
    'timestamp',
    'activity_type',
    'metadata',
    'created_at',
  ],

  user_profiles: [
    'id',
    'email',
    'full_name',
    'role',
    'user_limit',
    'is_active',
    'created_at',
    'updated_at',
  ],
} as const;

// Optimized query builders
export class QueryOptimizer {
  /**
   * Get optimized column selection for a table
   */
  static getColumns(tableName: keyof typeof TABLE_COLUMNS): string {
    return TABLE_COLUMNS[tableName].join(', ');
  }

  /**
   * Get columns with count for pagination
   */
  static getColumnsWithCount(tableName: keyof typeof TABLE_COLUMNS): string {
    return `${this.getColumns(tableName)}, count(*) OVER() as total_count`;
  }

  /**
   * Get essential columns only (for lists/overviews)
   */
  static getEssentialColumns(tableName: keyof typeof TABLE_COLUMNS): string {
    const essentialMap = {
      companies:
        'id, name, website, industry, head_office, company_size, priority, logo_url, lead_score, client_id, is_favourite, confidence_level, score_reason, created_at',
      people:
        'id, name, company_id, email_address, company_role, people_stage, score, client_id',
      activity_log: 'id, lead_id, timestamp, activity_type, metadata',
      user_profiles: 'id, email, full_name, role, is_active',
    };

    return essentialMap[tableName] || this.getColumns(tableName);
  }

  /**
   * Get columns for detail views (includes all relevant fields)
   */
  static getDetailColumns(tableName: keyof typeof TABLE_COLUMNS): string {
    return this.getColumns(tableName);
  }

  /**
   * Get columns for search/filter operations
   */
  static getSearchColumns(tableName: keyof typeof TABLE_COLUMNS): string {
    const searchMap = {
      companies: 'id, name, industry, company_size, head_office',
      people: 'id, name, email_address, company_role, employee_location',
      jobs: 'id, title, location, employment_type, seniority_level',
      activity_log: 'id, lead_id, timestamp, activity_type',
      user_profiles: 'id, email, full_name, role',
    };

    return searchMap[tableName] || this.getEssentialColumns(tableName);
  }
}

// Query performance monitoring
export class QueryPerformanceMonitor {
  private static queries: Map<string, number> = new Map();

  static startQuery(queryId: string): void {
    this.queries.set(queryId, performance.now());
  }

  static endQuery(queryId: string): number {
    const startTime = this.queries.get(queryId);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.queries.delete(queryId);

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.warn(
        `Slow query detected: ${queryId} took ${duration.toFixed(2)}ms`
      );
    }

    return duration;
  }

  static measureQuery<T>(
    queryId: string,
    queryFn: () => Promise<T>
  ): Promise<T> {
    this.startQuery(queryId);
    return queryFn().finally(() => {
      this.endQuery(queryId);
    });
  }
}

// Common optimized queries
export const OPTIMIZED_QUERIES = {
  // Get company list with essential data
  getCompaniesList: () => QueryOptimizer.getEssentialColumns('companies'),

  // Get company details
  getCompanyDetails: () => QueryOptimizer.getDetailColumns('companies'),

  // Get people list with essential data
  getPeopleList: () => QueryOptimizer.getEssentialColumns('people'),

  // Get people details
  getPeopleDetails: () => QueryOptimizer.getDetailColumns('people'),

  // Get activity log list (interactions table doesn't exist)
  getActivityLogList: () => QueryOptimizer.getEssentialColumns('activity_log'),

  // Get user profiles
  getUserProfiles: () => QueryOptimizer.getDetailColumns('user_profiles'),

  // Search queries
  searchCompanies: () => QueryOptimizer.getSearchColumns('companies'),
  searchPeople: () => QueryOptimizer.getSearchColumns('people'),
  searchActivityLog: () => QueryOptimizer.getSearchColumns('activity_log'),
} as const;
