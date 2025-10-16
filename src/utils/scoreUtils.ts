export const getScoreBadgeClasses = (
  rawScore?: string | number | null
): string => {
  if (rawScore === null || rawScore === undefined || rawScore === '') {
    return 'bg-gray-50 text-gray-500 border border-gray-200';
  }

  const score =
    typeof rawScore === 'string' ? parseInt(rawScore, 10) : rawScore;

  if (Number.isNaN(score)) {
    return 'bg-gray-50 text-gray-500 border border-gray-200';
  }

  if (score >= 85) {
    return 'bg-green-50 text-green-700 border border-green-200';
  }

  if (score >= 70) {
    return 'bg-blue-50 text-blue-700 border border-blue-200';
  }

  if (score >= 50) {
    return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
  }

  return 'bg-red-50 text-red-700 border border-red-200';
};

export const getPriorityBadgeClasses = (priority?: string | null): string => {
  if (!priority) {
    return 'bg-gray-50 text-gray-500 border border-gray-200';
  }

  const normalizedPriority = priority.toUpperCase();

  switch (normalizedPriority) {
    case 'VERY HIGH':
      return 'bg-red-50 text-red-700 border border-red-200';
    case 'HIGH':
      return 'bg-orange-50 text-orange-700 border border-orange-200';
    case 'MEDIUM':
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case 'LOW':
      return 'bg-green-50 text-green-700 border border-green-200';
    default:
      return 'bg-gray-50 text-gray-500 border border-gray-200';
  }
};

export const getTextScoreBadgeClasses = (score?: string | null): string => {
  if (!score) {
    return 'bg-gray-50 text-gray-500 border border-gray-200';
  }

  const normalizedScore = score.toUpperCase();

  switch (normalizedScore) {
    case 'HIGH':
      return 'bg-red-50 text-red-700 border border-red-200';
    case 'MEDIUM':
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case 'LOW':
      return 'bg-green-50 text-green-700 border border-green-200';
    default:
      return 'bg-gray-50 text-gray-500 border border-gray-200';
  }
};
