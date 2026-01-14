import { Company } from '@/types/database';

/**
 * Checks if a company has been enriched with AI data
 */
export function isCompanyEnriched(company: Company): boolean {
  // Check for enriched fields
  const hasLeadScore = !!company.lead_score;
  const hasScoreReason = !!company.score_reason;
  const hasConfidenceLevel = !!company.confidence_level;
  const hasDescription = !!company.description;
  const hasCategories = !!company.categories && company.categories.length > 0;

  // Company is considered enriched if any enrichment field is populated
  return (
    hasLeadScore ||
    hasScoreReason ||
    hasConfidenceLevel ||
    hasDescription ||
    hasCategories
  );
}
