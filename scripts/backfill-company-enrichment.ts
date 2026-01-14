/**
 * Backfill Company Enrichment Data
 *
 * Extracts domain and location from existing enrichment_data in leads table
 * and updates companies that are missing these fields.
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Extract domain from website URL
 */
function extractDomain(website: string | null | undefined): string | null {
  if (!website) return null;
  try {
    const url = website.replace(/^https?:\/\//, '').replace(/^www\./, '');
    const domain = url.split('/')[0].toLowerCase();
    return domain || null;
  } catch {
    return null;
  }
}

/**
 * Build location string from PDL location data
 */
function buildLocationString(location: {
  street_address?: string | null;
  locality?: string | null;
  region?: string | null;
  postal_code?: string | null;
  country?: string | null;
  name?: string | null;
}): string | null {
  if (!location) return null;

  const parts: string[] = [];

  if (location.street_address) parts.push(location.street_address);
  if (location.locality) parts.push(location.locality);
  if (location.region) parts.push(location.region);
  if (location.postal_code) parts.push(location.postal_code);
  if (location.country) parts.push(location.country);

  if (parts.length > 0) {
    return parts.join(', ');
  }

  if (location.name) {
    return location.name;
  }

  return null;
}

async function backfillCompanies() {
  console.log('🔄 Starting company enrichment backfill...\n');

  // Find companies missing domain or location
  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('id, name, website, domain, head_office, updated_at')
    .or('domain.is.null,head_office.is.null')
    .gte(
      'updated_at',
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    )
    .order('updated_at', { ascending: false });

  if (companiesError) {
    console.error('❌ Error fetching companies:', companiesError);
    return;
  }

  if (!companies || companies.length === 0) {
    console.log('✅ No companies need backfilling!');
    return;
  }

  console.log(`📋 Found ${companies.length} companies to backfill\n`);

  let updated = 0;
  let skipped = 0;

  for (const company of companies) {
    // Find a lead with enrichment data for this company
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, enrichment_data, enrichment_status')
      .eq('company', company.name)
      .eq('enrichment_status', 'completed')
      .not('enrichment_data', 'is', null)
      .limit(1);

    if (leadsError || !leads || leads.length === 0) {
      console.log(`⏭️  Skipping ${company.name} - no enrichment data found`);
      skipped++;
      continue;
    }

    const lead = leads[0];
    const enrichmentData = lead.enrichment_data as any;

    // Get company data from primary experience
    const primaryExperience = enrichmentData.experience?.find(
      (exp: any) => exp.is_primary
    );
    const companyData = primaryExperience?.company;

    if (!companyData) {
      console.log(
        `⏭️  Skipping ${company.name} - no company data in experience`
      );
      skipped++;
      continue;
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Extract domain from website if missing
    if (!company.domain && company.website) {
      const domain = extractDomain(company.website);
      if (domain) {
        updates.domain = domain;
        console.log(`  ✅ Extracted domain: ${domain}`);
      }
    }

    // Build location from PDL data if missing
    if (!company.head_office && companyData.location) {
      const location = buildLocationString(companyData.location);
      if (location) {
        updates.head_office = location;
        console.log(`  ✅ Built location: ${location}`);
      }
    }

    // Only update if we have changes
    if (Object.keys(updates).length > 1) {
      const { error: updateError } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', company.id);

      if (updateError) {
        console.error(
          `  ❌ Error updating ${company.name}:`,
          updateError.message
        );
      } else {
        console.log(`✅ Updated ${company.name}`);
        updated++;
      }
    } else {
      console.log(`⏭️  Skipping ${company.name} - no updates needed`);
      skipped++;
    }

    console.log(''); // Empty line for readability
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Updated: ${updated} companies`);
  console.log(`   ⏭️  Skipped: ${skipped} companies`);
  console.log(`   📋 Total: ${companies.length} companies`);
}

backfillCompanies()
  .then(() => {
    console.log('\n✨ Backfill complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Backfill failed:', error);
    process.exit(1);
  });
