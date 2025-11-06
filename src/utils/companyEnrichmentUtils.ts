import { Company } from '@/types/database';

/**
 * Checks if a company has been enriched with AI data
 */
export function isCompanyEnriched(company: Company): boolean {
  // Check for any AI-enriched fields
  const hasAiInfo = company.ai_info && Object.keys(company.ai_info).length > 0;
  const hasKeyInfoRaw =
    company.key_info_raw && Object.keys(company.key_info_raw).length > 0;
  const hasLeadScore = !!company.lead_score;
  const hasScoreReason = !!company.score_reason;
  const hasConfidenceLevel = !!company.confidence_level;

  // Company is considered enriched if any AI field is populated
  return (
    hasAiInfo ||
    hasKeyInfoRaw ||
    hasLeadScore ||
    hasScoreReason ||
    hasConfidenceLevel
  );
}
