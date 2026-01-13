/**
 * Test Automatic Enrichment Webhook
 *
 * This script tests the automatic enrichment webhook service
 * Run with: npx tsx scripts/test-enrichment-auto.ts
 */

import { triggerEnrichmentWebhook } from '../src/services/enrichLeadWebhook';

async function main() {
  console.log('🧪 Testing Automatic Enrichment Webhook\n');
  console.log('='.repeat(50));

  // Use existing test lead or create new test data
  const testLead = {
    lead_id: '3a59490f-ea5e-48fd-b9f2-c22dd49bc985', // Existing lead
    company: 'Darling Crackles',
    email: 'craig@darlingcrackles.com.au',
    first_name: 'Craig',
    last_name: 'MacIndoe',
    linkedin_url: undefined,
  };

  console.log('\n📋 Test Lead Data:');
  console.log(JSON.stringify(testLead, null, 2));
  console.log('\n');

  try {
    console.log('📤 Triggering enrichment webhook...');
    console.log('   (This will call n8n and wait for response)\n');

    const startTime = Date.now();
    await triggerEnrichmentWebhook(testLead);
    const duration = Date.now() - startTime;

    console.log(`\n✅ Enrichment completed in ${duration}ms`);
    console.log('\n💡 Next steps:');
    console.log('   1. Check the database:');
    console.log(`      SELECT * FROM leads WHERE id = '${testLead.lead_id}';`);
    console.log('   2. Verify enrichment_status = "completed"');
    console.log('   3. Check enrichment_data JSONB field');
    console.log('   4. Verify enrichment_timestamp is set');
  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  }
}

main();
