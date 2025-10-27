/**
 * Parse location strings to extract structured location data
 */

export interface ParsedLocation {
  country: string | null;
  city: string | null;
  region: string | null;
}

/**
 * Parse location string like "Sydney, NSW" into structured fields
 */
export function parseLocation(
  location: string | null | undefined
): ParsedLocation {
  if (!location) {
    return { country: null, city: null, region: null };
  }

  // Australian state mappings
  const ausStates: Record<string, string> = {
    NSW: 'New South Wales',
    VIC: 'Victoria',
    QLD: 'Queensland',
    WA: 'Western Australia',
    SA: 'South Australia',
    TAS: 'Tasmania',
    ACT: 'Australian Capital Territory',
    NT: 'Northern Territory',
  };

  // Common format: "City, State"
  const parts = location
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  let country: string | null = null;
  let city: string | null = null;
  let region: string | null = null;

  if (parts.length >= 1) {
    city = parts[0];
  }

  if (parts.length >= 2) {
    const secondPart = parts[1].toUpperCase();

    // Check if it's an Australian state code
    if (ausStates[secondPart]) {
      region = parts[1].toUpperCase();
      country = 'AU';
    } else if (secondPart === 'AUSTRALIA') {
      country = 'AU';
      region = null;
    } else {
      // Assume it's a region/state
      region = parts[1];
    }
  }

  // If no country was set but we have a region that's an AU state, set country
  if (!country && region && ausStates[region.toUpperCase()]) {
    country = 'AU';
  }

  // Auto-detect Australia for Australian cities
  if (!country && city) {
    const majorAuCities = [
      'Sydney',
      'Melbourne',
      'Brisbane',
      'Perth',
      'Adelaide',
      'Canberra',
      'Darwin',
      'Hobart',
      'Gold Coast',
      'Newcastle',
    ];

    if (majorAuCities.some(auCity => city?.includes(auCity))) {
      country = 'AU';
    }
  }

  return { country, city, region };
}

/**
 * Parse multiple location strings
 */
export function parseLocations(locations: string[]): ParsedLocation[] {
  return locations.map(parseLocation);
}
