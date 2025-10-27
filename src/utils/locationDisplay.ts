/**
 * Utility functions for displaying job locations
 */

export interface LocationData {
  country?: string | null;
  city?: string | null;
  region?: string | null;
  location?: string | null; // Fallback old location field
}

/**
 * Format location display string
 * Priority: city, region, country OR old location field
 */
export function formatLocation(loc: LocationData): string {
  // Use structured location fields if available
  if (loc.country || loc.city || loc.region) {
    const parts: string[] = [];

    if (loc.city) parts.push(loc.city);
    if (loc.region) parts.push(loc.region);
    if (loc.country) {
      // Only show country if it's not obvious (e.g., if city is Melbourne, country is probably AU)
      const majorAuCities = [
        'Melbourne',
        'Sydney',
        'Brisbane',
        'Perth',
        'Adelaide',
        'Canberra',
        'Darwin',
      ];
      if (!majorAuCities.some(city => loc.city?.includes(city))) {
        parts.push(loc.country);
      }
    }

    return parts.join(', ');
  }

  // Fallback to old location field
  if (loc.location) return loc.location;

  return 'Location not specified';
}

/**
 * Format location for filters/display
 * Shows: City, State/Region
 * Hides country if it's obvious (e.g., Australian cities)
 */
export function formatLocationShort(loc: LocationData): string {
  if (loc.country || loc.city || loc.region) {
    const parts: string[] = [];

    if (loc.city) parts.push(loc.city);
    if (loc.region) parts.push(loc.region);

    return parts.join(', ') || 'Unknown';
  }

  return loc.location || 'Unknown';
}

/**
 * Check if location matches Australia
 */
export function isAustraliaLocation(loc: LocationData): boolean {
  return (
    loc.country === 'AU' ||
    loc.location?.includes('Australia') ||
    loc.location?.includes('AU')
  );
}

/**
 * Get full location with country
 */
export function formatLocationFull(loc: LocationData): string {
  if (loc.country || loc.city || loc.region) {
    const parts: string[] = [];

    if (loc.city) parts.push(loc.city);
    if (loc.region) parts.push(loc.region);
    if (loc.country) parts.push(loc.country);

    return parts.join(', ');
  }

  return loc.location || 'Location not specified';
}
