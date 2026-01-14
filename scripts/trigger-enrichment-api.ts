/**
 * Trigger Enrichment via API Endpoint
 *
 * Calls the /api/trigger-enrichment-batch endpoint to trigger enrichment webhook
 */

const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8086';

async function triggerEnrichment() {
  console.log('🔄 Triggering enrichment via API...\n');

  try {
    const response = await fetch(`${API_URL}/api/trigger-enrichment-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    console.log('✅ Enrichment triggered successfully!');
    console.log(`   Message: ${result.message}`);
    console.log(`   Triggered: ${result.triggered} leads`);
    if (result.failed > 0) {
      console.log(`   Failed: ${result.failed} leads`);
    }
    console.log(`   Total: ${result.total} leads`);

    console.log('\n✨ Enrichment webhooks sent!');
    console.log('   Note: Enrichment happens asynchronously via n8n');
    console.log('   Check enrichment_status in database to see progress');
  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  }
}

triggerEnrichment();
