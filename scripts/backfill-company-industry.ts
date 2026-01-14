/**
 * Backfill Company Industry from Lead Enrichment Data
 *
 * Updates companies table with industry data from leads.enrichment_data
 * Only updates companies where industry is currently null/empty
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function backfillCompanyIndustry() {
  console.log('🔄 Backfilling company industry from enrichment data...\n');

  try {
    // Get leads with enrichment data that has company industry
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, company, enrichment_data')
      .not('enrichment_data->job_company_industry', 'is', null)
      .gte(
        'created_at',
        new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      );

    if (leadsError) {
      throw new Error(`Failed to fetch leads: ${leadsError.message}`);
    }

    if (!leads || leads.length === 0) {
      console.log('✅ No leads with company industry data found');
      return;
    }

    console.log(`Found ${leads.length} leads with company industry data\n`);

    // Group by company name and get the most recent industry
    const companyIndustryMap = new Map<string, string>();

    for (const lead of leads) {
      if (!lead.company) continue;

      const enrichmentData = lead.enrichment_data as Record<string, unknown>;
      const industry = enrichmentData.job_company_industry as
        | string
        | undefined;

      if (industry && industry.trim()) {
        const companyName = lead.company.trim();
        // Use the most recent industry (last one wins)
        companyIndustryMap.set(companyName, industry);
      }
    }

    console.log(
      `Found ${companyIndustryMap.size} unique companies with industry data\n`
    );

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    // Update companies
    for (const [companyName, industry] of companyIndustryMap.entries()) {
      try {
        // Find company by name (case-insensitive)
        const { data: companies, error: findError } = await supabase
          .from('companies')
          .select('id, industry')
          .ilike('name', companyName)
          .limit(1);

        if (findError) {
          console.error(
            `Error finding company "${companyName}":`,
            findError.message
          );
          errors++;
          continue;
        }

        if (!companies || companies.length === 0) {
          console.log(
            `⚠️  Company "${companyName}" not found in companies table`
          );
          skipped++;
          continue;
        }

        const company = companies[0];

        // Only update if industry is missing or empty
        if (company.industry && company.industry.trim() !== '') {
          console.log(
            `⏭️  Skipping "${companyName}" - already has industry: "${company.industry}"`
          );
          skipped++;
          continue;
        }

        // Update company with industry
        const { error: updateError } = await supabase
          .from('companies')
          .update({
            industry: industry,
            updated_at: new Date().toISOString(),
          })
          .eq('id', company.id);

        if (updateError) {
          console.error(
            `Error updating company "${companyName}":`,
            updateError.message
          );
          errors++;
        } else {
          console.log(
            `✅ Updated "${companyName}" with industry: "${industry}"`
          );
          updated++;
        }
      } catch (error) {
        console.error(`Error processing company "${companyName}":`, error);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updated} companies`);
    console.log(`   ⏭️  Skipped: ${skipped} companies`);
    console.log(`   ❌ Errors: ${errors} companies`);
    console.log(`\n✨ Backfill complete!`);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

backfillCompanyIndustry();
