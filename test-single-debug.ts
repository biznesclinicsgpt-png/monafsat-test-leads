/**
 * Debug single profile enrichment
 */

const LEMLIST_API_KEY = '07d63aa0d49dcdb1b9a30fb7dd9cad84';
const LEMLIST_API_BASE = 'https://api.lemlist.com/api';

function getAuthHeader(): string {
  const credentials = Buffer.from(`:${LEMLIST_API_KEY}`).toString('base64');
  return `Basic ${credentials}`;
}

async function main() {
  // Check credits first
  console.log('🔌 Checking credits...');
  const creditsRes = await fetch(`${LEMLIST_API_BASE}/team/credits`, {
    method: 'GET',
    headers: { Authorization: getAuthHeader() },
  });
  const credits = await creditsRes.json();
  console.log('Credits:', JSON.stringify(credits, null, 2));

  // Try one profile
  const linkedinUrl = 'https://www.linkedin.com/in/nesma-al-dakrouri-8ab351110/';

  console.log('\n🔍 Testing single profile:', linkedinUrl);

  const params = new URLSearchParams({
    linkedinUrl,
    findEmail: 'true',
    findPhone: 'true',
    linkedinEnrichment: 'true',
  });

  console.log('Request URL:', `${LEMLIST_API_BASE}/enrich?${params}`);

  const response = await fetch(`${LEMLIST_API_BASE}/enrich?${params}`, {
    method: 'POST',
    headers: { Authorization: getAuthHeader() },
  });

  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);

  const text = await response.text();
  console.log('Response:', text);

  try {
    const json = JSON.parse(text);
    console.log('Parsed:', JSON.stringify(json, null, 2));
  } catch {
    console.log('Not JSON response');
  }
}

main().catch(console.error);
