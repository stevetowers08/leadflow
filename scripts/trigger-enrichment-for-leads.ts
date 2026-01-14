/**
 * Trigger Enrichment for Manually Inserted Leads
 *
 * This script triggers enrichment webhook for leads that were inserted
 * directly via SQL (bypassing the CSV import service that auto-triggers enrichment)
 *
 * Run with: npx tsx scripts/trigger-enrichment-for-leads.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load environment variables from .env.local (preferred) or .env
const envLocalPath = resolve(process.cwd(), '.env.local');
const envPath = resolve(process.cwd(), '.env');

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
} else if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  console.warn('⚠️  No .env.local or .env file found');
}

import { triggerEnrichmentWebhook } from '../src/services/enrichLeadWebhook';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function triggerEnrichmentForPendingLeads() {
  console.log('🔍 Finding leads with pending enrichment...\n');

  // Get all leads with pending enrichment from the CSV data
  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, email, company, first_name, last_name')
    .in('show_name', [
      'GFSI',
      'BETT',
      'Accountex',
      'Cyber UK',
      'Solar & Storage',
      'London Vet Show',
      'InfoSec',
      'IMPA',
      'Smile Train Activation',
      'Energy Innovation Summit',
      'Automechanika',
      'MRO',
      'Luxury Travel Fair',
      'London EV',
      'IAAPA',
      'Sirha Lyon',
      'IATEFL',
    ])
    .eq('enrichment_status', 'pending')
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

  if (error) {
    console.error('❌ Error fetching leads:', error);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log('✅ No leads found with pending enrichment');
    return;
  }

  console.log(`📋 Found ${leads.length} leads to enrich\n`);

  // Trigger enrichment for each lead
  const results = await Promise.allSettled(
    leads.map(async lead => {
      console.log(
        `🔄 Triggering enrichment for: ${lead.first_name} (${lead.email})`
      );

      await triggerEnrichmentWebhook({
        lead_id: lead.id,
        company: lead.company || undefined,
        email: lead.email || undefined,
        first_name: lead.first_name || undefined,
        last_name: lead.last_name || undefined,
        linkedin_url: null,
      });

      return lead.id;
    })
  );

  // Count successes and failures
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`\n✅ Successfully triggered enrichment for ${successful} leads`);
  if (failed > 0) {
    console.log(`❌ Failed to trigger enrichment for ${failed} leads`);
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`  - Lead ${leads[index]?.id}: ${result.reason}`);
      }
    });
  }

  console.log('\n✨ Enrichment triggers complete!');
  console.log('   Note: Enrichment happens asynchronously via n8n webhook');
  console.log('   Check enrichment_status in the database to see progress');
}

// Run the script
triggerEnrichmentForPendingLeads()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
