export const getScoreBadgeClasses = (
  rawScore?: string | number | null
): string => {
  if (rawScore === null || rawScore === undefined || rawScore === '') {
    return 'bg-muted text-muted-foreground border border-border';
  }

  const score =
    typeof rawScore === 'string' ? parseInt(rawScore, 10) : rawScore;

  if (Number.isNaN(score)) {
    return 'bg-muted text-muted-foreground border border-border';
  }

  if (score >= 85) {
    return 'bg-success/10 text-success border border-success/20';
  }

  if (score >= 70) {
      return 'bg-primary/10 text-primary border border-primary/20';
  }

  if (score >= 50) {
    return 'bg-warning/10 text-warning border border-warning/20';
  }

  return 'bg-destructive/10 text-destructive border border-destructive/20';
};

export const getPriorityBadgeClasses = (priority?: string | null): string => {
  if (!priority) {
    return 'bg-muted text-muted-foreground border border-border';
  }

  const normalizedPriority = priority.toUpperCase();

  switch (normalizedPriority) {
    case 'VERY HIGH':
      return 'bg-destructive/10 text-destructive border border-destructive/20';
    case 'HIGH':
      return 'bg-warning/10 text-warning border border-warning/20';
    case 'MEDIUM':
      return 'bg-warning/10 text-warning border border-warning/20';
    case 'LOW':
      return 'bg-success/10 text-success border border-success/20';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
};

export const getTextScoreBadgeClasses = (score?: string | null): string => {
  if (!score) {
    return 'bg-muted text-muted-foreground border border-border';
  }

  const normalizedScore = score.toUpperCase();

  switch (normalizedScore) {
    case 'HIGH':
      return 'bg-destructive/10 text-destructive border border-destructive/20';
    case 'MEDIUM':
      return 'bg-warning/10 text-warning border border-warning/20';
    case 'LOW':
      return 'bg-success/10 text-success border border-success/20';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
};
