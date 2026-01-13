/**
 * People Data Labs API Types
 * Based on PDL Person Enrichment API v5
 */

export interface PDLCompany {
  name: string;
  size?: string;
  id?: string;
  founded?: number;
  industry?: string;
  location?: PDLLocation;
  linkedin_url?: string;
  linkedin_id?: string;
  facebook_url?: string | null;
  twitter_url?: string | null;
  website?: string;
}

export interface PDLLocation {
  name?: string;
  locality?: string;
  region?: string;
  metro?: string | null;
  country?: string;
  continent?: string;
  street_address?: string | null;
  address_line_2?: string | null;
  postal_code?: string;
  geo?: string;
}

export interface PDLTitle {
  name: string;
  class?: string;
  role?: string;
  sub_role?: string | null;
  levels?: string[];
}

export interface PDLExperience {
  company: PDLCompany;
  location_names?: string[];
  end_date?: string | null;
  start_date?: string;
  title: PDLTitle;
  is_primary: boolean;
}

export interface PDLSchool {
  name: string;
  type?: string;
  id?: string;
  location?: PDLLocation | null;
  linkedin_url?: string;
  facebook_url?: string | null;
  twitter_url?: string | null;
  linkedin_id?: string;
  website?: string;
  domain?: string;
}

export interface PDLEducation {
  school: PDLSchool;
  degrees: string[];
  start_date?: string | null;
  end_date?: string | null;
  majors: string[];
  minors: string[];
  gpa?: string | null;
}

export interface PDLProfile {
  network: string;
  id?: string | null;
  url: string;
  username?: string;
}

export interface PDLPersonData {
  id: string;
  full_name: string;
  first_name: string;
  middle_initial?: string | null;
  middle_name?: string | null;
  last_initial?: string;
  last_name: string;
  sex?: string;
  birth_year?: boolean | number;
  birth_date?: boolean | string;
  linkedin_url?: string;
  linkedin_username?: string;
  linkedin_id?: string;
  facebook_url?: string;
  facebook_username?: string;
  facebook_id?: string;
  twitter_url?: string;
  twitter_username?: string;
  github_url?: string | null;
  github_username?: string | null;
  work_email?: boolean | string;
  personal_emails?: boolean | string[];
  recommended_personal_email?: boolean | string;
  mobile_phone?: boolean | string;
  industry?: string;
  job_title?: string;
  job_title_role?: string;
  job_title_sub_role?: string;
  job_title_class?: string;
  job_title_levels?: string[];
  job_company_id?: string;
  job_company_name?: string;
  job_company_website?: string;
  job_company_size?: string;
  job_company_founded?: number;
  job_company_industry?: string;
  job_company_linkedin_url?: string;
  job_company_linkedin_id?: string;
  job_company_facebook_url?: string | null;
  job_company_twitter_url?: string | null;
  job_company_location_name?: string;
  job_company_location_locality?: string;
  job_company_location_metro?: string | null;
  job_company_location_region?: string;
  job_company_location_geo?: string;
  job_company_location_street_address?: string;
  job_company_location_address_line_2?: string | null;
  job_company_location_postal_code?: string;
  job_company_location_country?: string;
  job_company_location_continent?: string;
  job_last_changed?: string;
  job_last_verified?: string;
  job_start_date?: string;
  location_name?: boolean | string;
  location_locality?: boolean | string;
  location_metro?: boolean | string;
  location_region?: boolean | string;
  location_country?: string;
  location_continent?: string;
  location_street_address?: boolean | string;
  location_address_line_2?: string | null;
  location_postal_code?: boolean | string;
  location_geo?: boolean | string;
  location_last_updated?: string;
  phone_numbers?: boolean | string[];
  emails?: boolean | string[];
  interests?: string[];
  skills?: string[];
  location_names?: boolean | string[];
  regions?: boolean | string[];
  countries?: string[];
  street_addresses?: boolean | string[];
  experience?: PDLExperience[];
  education?: PDLEducation[];
  profiles?: PDLProfile[];
  dataset_version?: string;
}

export interface PDLEnrichmentResponse {
  status: number;
  likelihood: number;
  data: PDLPersonData;
}

export interface PDLEnrichmentRequest {
  name?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  location?: string;
  min_likelihood?: number; // Default: 0, Range: 0-10
  required?: string; // Comma-separated fields that must exist
  pretty?: boolean;
  titlecase?: boolean;
}

/**
 * Simplified enrichment data for storage in our database
 */
export interface SimplifiedEnrichmentData {
  pdl_id: string;
  likelihood: number;
  linkedin_url?: string;
  linkedin_username?: string;
  twitter_url?: string;
  github_url?: string;
  mobile_phone?: string;
  work_email?: string;
  personal_emails?: string[];
  job_title?: string;
  job_company?: string;
  job_company_website?: string;
  job_company_size?: string;
  job_company_industry?: string;
  job_company_linkedin_url?: string;
  location?: string;
  skills?: string[];
  experience?: PDLExperience[];
  education?: PDLEducation[];
  enriched_at: string;
}
