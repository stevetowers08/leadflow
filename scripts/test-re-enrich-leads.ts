/**
 * Test Re-Enrichment Script
 *
 * Re-enriches specific leads to test the updated mapping logic
 */

const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8086';

// Test lead IDs (completed leads - Hayley matches the webhook data you showed)
const TEST_LEAD_IDS = [
  '6c47e013-0b60-45df-bbeb-c1b47e6d0b42', // Hayley - Rentokil (matches your webhook example!)
  'f0eb6942-58a1-452a-ad56-8a10045cdabd', // Bhoomi - V-Tac
  '8027e3dd-778f-4999-bc62-7e318690051a', // Vinco - Mizkan Europe
];

async function testReEnrichment() {
  console.log('🔄 Testing Re-Enrichment with Updated Mapping\n');
  console.log(`📋 Re-enriching ${TEST_LEAD_IDS.length} leads...\n`);

  try {
    const response = await fetch(`${API_URL}/api/trigger-enrichment-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lead_ids: TEST_LEAD_IDS,
        forceReEnrich: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    console.log('✅ Re-enrichment triggered successfully!');
    console.log(`   Message: ${result.message}`);
    console.log(`   Triggered: ${result.triggered} leads`);
    if (result.failed > 0) {
      console.log(`   Failed: ${result.failed} leads`);
    }
    console.log(`   Total: ${result.total} leads`);

    console.log('\n📊 Next Steps:');
    console.log(
      '   1. Wait for n8n webhook to process (usually 30-60 seconds)'
    );
    console.log('   2. Check enrichment_status in database');
    console.log('   3. Verify company fields are populated:');
    console.log('      - domain (extracted from website)');
    console.log('      - linkedin_url');
    console.log('      - head_office (location)');
    console.log('      - company_size');
    console.log('      - industry');
    console.log('      - website');
    console.log(
      '\n✨ Check the companies table to verify all fields are mapped correctly!'
    );
  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  }
}

testReEnrichment();
