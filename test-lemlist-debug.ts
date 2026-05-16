/**
 * Debug Lemlist API Response
 */

const LEMLIST_API_KEY = '07d63aa0d49dcdb1b9a30fb7dd9cad84';
const LEMLIST_API_BASE = 'https://api.lemlist.com/api';

function getAuthHeader(): string {
  const credentials = Buffer.from(`:${LEMLIST_API_KEY}`).toString('base64');
  return `Basic ${credentials}`;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const linkedinUrl = 'https://www.linkedin.com/in/hatem-yasser-374740304/';

  console.log('🔍 Starting enrichment...');

  // Start enrichment
  const params = new URLSearchParams({
    linkedinUrl,
    findEmail: 'true',
    findPhone: 'true',
    linkedinEnrichment: 'true',
  });

  const response = await fetch(`${LEMLIST_API_BASE}/enrich?${params}`, {
    method: 'POST',
    headers: { Authorization: getAuthHeader() },
  });

  const data = await response.json();
  console.log('📤 Initial response:', JSON.stringify(data, null, 2));

  if (!data.id) {
    console.log('❌ No enrichment ID returned');
    return;
  }

  // Poll until complete (check enrichmentStatus)
  for (let i = 0; i < 40; i++) {
    await delay(3000);
    console.log(`\n📡 Poll attempt ${i + 1}...`);

    try {
      const pollResponse = await fetch(`${LEMLIST_API_BASE}/enrich/${data.id}`, {
        method: 'GET',
        headers: { Authorization: getAuthHeader() },
      });

      console.log(`   Status: ${pollResponse.status}`);

      const pollData = await pollResponse.json();
      console.log(`   enrichmentStatus: ${pollData.enrichmentStatus}`);

      // Check if done - look for enrichmentStatus: "done" or "completed"
      if (pollData.enrichmentStatus === 'done' || pollData.enrichmentStatus === 'completed') {
        console.log('\n✅ Enrichment complete!');
        console.log('📦 Full response:', JSON.stringify(pollData, null, 2));

        // Extract key data
        if (pollData.data) {
          const d = pollData.data;
          console.log('\n📋 EXTRACTED DATA:');
          console.log(`   Email: ${d.email || 'Not found'}`);
          console.log(`   Phone: ${d.phone || 'Not found'}`);
          console.log(`   First Name: ${d.firstName || 'Unknown'}`);
          console.log(`   Last Name: ${d.lastName || 'Unknown'}`);
          console.log(`   Company: ${d.companyName || 'Unknown'}`);
          console.log(`   Title: ${d.position || 'Unknown'}`);
        }
        break;
      }

      if (pollData.enrichmentStatus === 'failed' || pollData.enrichmentStatus === 'error') {
        console.log('\n❌ Enrichment failed!');
        console.log('📦 Response:', JSON.stringify(pollData, null, 2));
        break;
      }

      // Still in progress
      console.log(`   ⏳ Still processing...`);

    } catch (error) {
      console.log(`   Error:`, (error as Error).message);
    }
  }
}

main().catch(console.error);
