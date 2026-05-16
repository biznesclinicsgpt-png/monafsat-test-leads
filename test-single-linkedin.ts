/**
 * Test Lemlist Phone Enrichment for a single LinkedIn profile
 */

const LEMLIST_API_KEY = '07d63aa0d49dcdb1b9a30fb7dd9cad84';
const LEMLIST_API_BASE = 'https://api.lemlist.com/api';

const linkedinUrl = 'https://linkedin.com/in/sydmgy';

function getAuthHeader(): string {
  const credentials = Buffer.from(`:${LEMLIST_API_KEY}`).toString('base64');
  return `Basic ${credentials}`;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollForResult(enrichmentId: string): Promise<any> {
  const startTime = Date.now();
  const POLL_TIMEOUT_MS = 60000;
  const POLL_INTERVAL_MS = 3000;

  console.log(`⏳ Polling for result (id: ${enrichmentId})...`);

  while (Date.now() - startTime < POLL_TIMEOUT_MS) {
    await delay(POLL_INTERVAL_MS);

    try {
      const response = await fetch(`${LEMLIST_API_BASE}/enrich/${enrichmentId}`, {
        method: 'GET',
        headers: { Authorization: getAuthHeader() },
      });

      if (!response.ok) {
        console.log(`⚠️ Poll response: ${response.status}`);
        continue;
      }

      const result = await response.json();
      console.log(`📡 Poll status: ${result.type || result.status || 'unknown'}`);

      if (result.type === 'enrichmentDone' || result.status === 'completed') {
        return result;
      }

      if (result.type === 'enrichmentFailed' || result.status === 'failed') {
        console.log(`❌ Enrichment failed:`, result);
        return null;
      }
    } catch (error) {
      console.log(`⚠️ Poll error:`, (error as Error).message);
    }
  }

  console.log(`⏰ Timeout waiting for enrichment result`);
  return null;
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       LEMLIST PHONE ENRICHMENT                             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log();
  console.log(`🔍 LinkedIn URL: ${linkedinUrl}`);
  console.log();

  try {
    // Build request params - requesting phone enrichment
    const params = new URLSearchParams({
      linkedinUrl,
      findPhone: 'true',
      findEmail: 'true',
      linkedinEnrichment: 'true',
    });

    console.log(`📤 Sending enrichment request...`);

    const response = await fetch(`${LEMLIST_API_BASE}/enrich?${params}`, {
      method: 'POST',
      headers: { Authorization: getAuthHeader() },
    });

    console.log(`📥 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log(`✅ Enrichment started with ID: ${data.id}`);

    // Poll for result
    if (data.id) {
      const result = await pollForResult(data.id);

      if (result) {
        console.log(`\n${'='.repeat(60)}`);
        console.log('📋 ENRICHMENT RESULT:');
        console.log('='.repeat(60));

        // Parse the result
        const resultData = result.data?.[0]?.data || result;
        const linkedinData = resultData.linkedin_enrichment || resultData;
        const emailData = resultData.find_email || resultData;
        const phoneData = resultData.find_phone || resultData;

        console.log(`\n👤 Name: ${linkedinData.firstName || ''} ${linkedinData.lastName || ''}`);
        console.log(`📧 Email: ${emailData.email || 'Not found'}`);
        console.log(`📱 Phone: ${phoneData.phone || 'Not found'}`);
        console.log(`💼 Title: ${linkedinData.positionGroups?.[0]?.profilePositions?.[0]?.title || 'Unknown'}`);
        console.log(`🏢 Company: ${linkedinData.positionGroups?.[0]?.company?.name || 'Unknown'}`);
        console.log(`📍 Location: ${linkedinData.locationName || 'Unknown'}`);

        console.log(`\n${'='.repeat(60)}`);
        console.log('📦 Full Response:');
        console.log('='.repeat(60));
        console.log(JSON.stringify(result, null, 2));
      }
    }

  } catch (error) {
    console.log(`❌ Exception:`, (error as Error).message);
  }
}

main().catch(console.error);
