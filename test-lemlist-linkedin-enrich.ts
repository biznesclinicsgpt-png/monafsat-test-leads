/**
 * Test Lemlist LinkedIn Enrichment
 *
 * Tests phone enrichment for LinkedIn profiles using Lemlist API.
 */

const LEMLIST_API_KEY = '07d63aa0d49dcdb1b9a30fb7dd9cad84';
const LEMLIST_API_BASE = 'https://api.lemlist.com/api';

const linkedinProfiles = [
  'https://www.linkedin.com/in/hatem-yasser-374740304/',
  'https://www.linkedin.com/in/omar-gamal-a69263144/',
  'https://www.linkedin.com/in/hend-harb-087353183/',
  'https://www.linkedin.com/in/ahmed-hosny-eid-060871110/',
];

function getAuthHeader(): string {
  const credentials = Buffer.from(`:${LEMLIST_API_KEY}`).toString('base64');
  return `Basic ${credentials}`;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollForResult(enrichmentId: string): Promise<any> {
  const startTime = Date.now();
  const POLL_TIMEOUT_MS = 60000; // 60 seconds
  const POLL_INTERVAL_MS = 3000; // 3 seconds

  console.log(`  ⏳ Polling for result (id: ${enrichmentId})...`);

  while (Date.now() - startTime < POLL_TIMEOUT_MS) {
    await delay(POLL_INTERVAL_MS);

    try {
      const response = await fetch(`${LEMLIST_API_BASE}/enrich/${enrichmentId}`, {
        method: 'GET',
        headers: { Authorization: getAuthHeader() },
      });

      if (!response.ok) {
        console.log(`  ⚠️ Poll response: ${response.status}`);
        continue;
      }

      const result = await response.json();
      console.log(`  📡 Poll status: ${result.type || result.status || 'unknown'}`);

      if (result.type === 'enrichmentDone' || result.status === 'completed') {
        return result;
      }

      if (result.type === 'enrichmentFailed' || result.status === 'failed') {
        console.log(`  ❌ Enrichment failed:`, result);
        return null;
      }
    } catch (error) {
      console.log(`  ⚠️ Poll error:`, (error as Error).message);
    }
  }

  console.log(`  ⏰ Timeout waiting for enrichment result`);
  return null;
}

async function enrichLinkedInProfile(linkedinUrl: string): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 Enriching: ${linkedinUrl}`);
  console.log('='.repeat(60));

  try {
    // Build request params
    const params = new URLSearchParams({
      linkedinUrl,
      findEmail: 'true',
      findPhone: 'true',
      linkedinEnrichment: 'true',
    });

    console.log(`  📤 Sending enrichment request...`);

    const response = await fetch(`${LEMLIST_API_BASE}/enrich?${params}`, {
      method: 'POST',
      headers: { Authorization: getAuthHeader() },
    });

    console.log(`  📥 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`  ❌ Error: ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log(`  ✅ Enrichment started:`, JSON.stringify(data, null, 2));

    // Poll for result
    if (data.id) {
      const result = await pollForResult(data.id);

      if (result) {
        console.log(`\n  📋 ENRICHMENT RESULT:`);
        console.log('  ' + '-'.repeat(50));

        // Parse the result
        const resultData = result.data?.[0]?.data || result;
        const linkedinData = resultData.linkedin_enrichment || resultData;
        const emailData = resultData.find_email || resultData;
        const phoneData = resultData.find_phone || resultData;

        console.log(`  👤 Name: ${linkedinData.firstName || ''} ${linkedinData.lastName || ''}`);
        console.log(`  📧 Email: ${emailData.email || 'Not found'}`);
        console.log(`  📱 Phone: ${phoneData.phone || 'Not found'}`);
        console.log(`  💼 Title: ${linkedinData.positionGroups?.[0]?.profilePositions?.[0]?.title || 'Unknown'}`);
        console.log(`  🏢 Company: ${linkedinData.positionGroups?.[0]?.company?.name || 'Unknown'}`);
        console.log(`  📍 Location: ${linkedinData.locationName || 'Unknown'}`);

        console.log(`\n  📦 Raw Response:`);
        console.log(JSON.stringify(result, null, 2));
      }
    }

  } catch (error) {
    console.log(`  ❌ Exception:`, (error as Error).message);
  }
}

async function testConnection(): Promise<boolean> {
  console.log('🔌 Testing Lemlist connection...');

  try {
    const response = await fetch(`${LEMLIST_API_BASE}/team/credits`, {
      method: 'GET',
      headers: { Authorization: getAuthHeader() },
    });

    if (!response.ok) {
      console.log(`❌ Connection failed: ${response.status}`);
      const text = await response.text();
      console.log(`   Error: ${text}`);
      return false;
    }

    const data = await response.json();
    console.log(`✅ Connected to Lemlist!`);
    console.log(`   Credits:`, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.log(`❌ Connection error:`, (error as Error).message);
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       LEMLIST LINKEDIN PHONE ENRICHMENT TEST               ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log();

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.log('\n⛔ Cannot proceed without valid connection.');
    return;
  }

  // Enrich each profile
  for (const profile of linkedinProfiles) {
    await enrichLinkedInProfile(profile);
    // Add delay between requests to avoid rate limiting
    await delay(2000);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test completed!');
  console.log('='.repeat(60));
}

main().catch(console.error);
