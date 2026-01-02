/**
 * Text Formatting Utilities
 * Handles Title Case and other text formatting for data normalization
 */

/**
 * Converts a string to Title Case (first letter of each word capitalized)
 * Handles edge cases like:
 * - Multiple spaces
 * - Leading/trailing whitespace
 * - Empty strings
 * - Special characters
 * - Acronyms (optional - can be enhanced later)
 *
 * Examples:
 * - "managing director" → "Managing Director"
 * - "chief executive officer" → "Chief Executive Officer"
 * - "  john   doe  " → "John Doe"
 * - "mcindoe" → "Mcindoe" (note: doesn't handle Mc/Mac prefixes - can enhance if needed)
 */
export function toTitleCase(text: string | null | undefined): string | null {
  if (!text || typeof text !== 'string') {
    return text ?? null;
  }

  // Trim and normalize whitespace
  const trimmed = text.trim().replace(/\s+/g, ' ');

  if (trimmed.length === 0) {
    return null;
  }

  // Split by space, capitalize first letter of each word, lowercase the rest
  return trimmed
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Formats a person's name (first + last) to Title Case
 */
export function formatPersonName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): { first: string | null; last: string | null } {
  return {
    first: toTitleCase(firstName),
    last: toTitleCase(lastName),
  };
}

/**
 * Formats lead data fields that should be Title Case
 */
export function formatLeadTextFields(data: {
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  job_title?: string | null;
}): {
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  job_title?: string | null;
} {
  return {
    first_name: toTitleCase(data.first_name),
    last_name: toTitleCase(data.last_name),
    company: toTitleCase(data.company),
    job_title: toTitleCase(data.job_title),
  };
}

/**
 * Formats company data fields that should be Title Case
 */
export function formatCompanyTextFields(data: {
  name?: string | null;
  head_office?: string | null;
  industry?: string | null;
}): {
  name?: string | null;
  head_office?: string | null;
  industry?: string | null;
} {
  return {
    name: toTitleCase(data.name),
    head_office: toTitleCase(data.head_office),
    industry: toTitleCase(data.industry),
  };
}
