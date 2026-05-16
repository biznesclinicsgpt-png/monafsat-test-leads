/**
 * Test Phone-Only Enrichment with Lemlist
 */

const LEMLIST_API_KEY = '4e74f712803c22838ec0568531a39a40';
const LEMLIST_API_BASE = 'https://api.lemlist.com/api';

const linkedinProfiles = [
  'https://www.linkedin.com/in/%D8%AD%D9%85%D8%AF-%D8%A7%D9%84%D8%B1%D8%A7%D9%83%D8%A7%D9%86-23a02591/',
  'https://www.linkedin.com/in/nesma-al-dakrouri-8ab351110/',
  'https://www.linkedin.com/in/abdelrahman-hazem-labib-a4a4b7198/',
  'https://www.linkedin.com/in/shehab-eldin-tarek-salah-860a0431/',
  'https://www.linkedin.com/in/yasmine-agour-13579b1b6/',
  'https://www.linkedin.com/in/abdelrahman-radwan-ab377076/',
];

function getAuthHeader(): string {
  const credentials = Buffer.from(`:${LEMLIST_API_KEY}`).toString('base64');
  return `Basic ${credentials}`;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollForResult(enrichmentId: string): Promise<any> {
  const TIMEOUT = 120000;
  const startTime = Date.now();

  while (Date.now() - startTime < TIMEOUT) {
    await delay(3000);

    try {
      const response = await fetch(`${LEMLIST_API_BASE}/enrich/${enrichmentId}`, {
        method: 'GET',
        headers: { Authorization: getAuthHeader() },
      });

      if (!response.ok) continue;

      const result = await response.json();

      if (result.enrichmentStatus === 'done' || result.enrichmentStatus === 'completed') {
        return result;
      }

      if (result.enrichmentStatus === 'failed' || result.enrichmentStatus === 'error') {
        return null;
      }

      process.stdout.write('.');
    } catch {
      // Continue polling
    }
  }

  return null;
}

interface Result {
  linkedinUrl: string;
  name: string;
  phone?: string;
  success: boolean;
}

async function enrichPhone(linkedinUrl: string): Promise<Result> {
  const shortUrl = decodeURIComponent(linkedinUrl.split('/in/')[1]?.replace('/', '') || linkedinUrl);
  console.log(`\n📱 ${shortUrl}`);
  process.stdout.write('   ');

  try {
    // PHONE ONLY - no email, no linkedin enrichment
    const params = new URLSearchParams({
      linkedinUrl,
      findPhone: 'true',
    });

    const response = await fetch(`${LEMLIST_API_BASE}/enrich?${params}`, {
      method: 'POST',
      headers: { Authorization: getAuthHeader() },
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`❌ Error: ${response.status} - ${error}`);
      return { linkedinUrl, name: shortUrl, success: false };
    }

    const data = await response.json();

    if (!data.id) {
      console.log(`❌ No enrichment ID`);
      return { linkedinUrl, name: shortUrl, success: false };
    }

    const result = await pollForResult(data.id);

    if (!result) {
      console.log(` ⏰ Timeout`);
      return { linkedinUrl, name: shortUrl, success: false };
    }

    const d = result.data || {};
    const phone = d.phone || {};
    const linkedin = d.linkedin || {};

    const name = linkedin.firstName && linkedin.lastName
      ? `${linkedin.firstName} ${linkedin.lastName}`
      : shortUrl;

    if (phone.phone) {
      console.log(`✅ ${phone.phone}`);
    } else {
      console.log(`❌ Not found`);
    }

    return {
      linkedinUrl,
      name,
      phone: phone.phone,
      success: true,
    };
  } catch (error) {
    console.log(`❌ ${(error as Error).message}`);
    return { linkedinUrl, name: shortUrl, success: false };
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║          📱 LEMLIST PHONE-ONLY ENRICHMENT TEST               ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  // Check credits
  console.log('\n🔌 Checking credits...');
  const creditsRes = await fetch(`${LEMLIST_API_BASE}/team/credits`, {
    method: 'GET',
    headers: { Authorization: getAuthHeader() },
  });

  if (!creditsRes.ok) {
    console.log('❌ Connection failed!');
    return;
  }

  const credits = await creditsRes.json();
  console.log(`✅ Connected! Credits: ${credits.credits}`);
  console.log(`   (Phone enrichment costs 5 credits each)`);

  // Enrich all profiles
  const results: Result[] = [];

  for (const profile of linkedinProfiles) {
    const result = await enrichPhone(profile);
    results.push(result);
    await delay(2000);
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('                    📊 PHONE NUMBERS FOUND');
  console.log('═'.repeat(60));

  const phonesFound = results.filter(r => r.phone);

  if (phonesFound.length > 0) {
    console.log('\n┌─────────────────────────────┬──────────────────┐');
    console.log('│ Name                        │ Phone            │');
    console.log('├─────────────────────────────┼──────────────────┤');

    for (const r of phonesFound) {
      const name = r.name.padEnd(27).slice(0, 27);
      const phone = r.phone!.padEnd(16);
      console.log(`│ ${name} │ ${phone} │`);
    }

    console.log('└─────────────────────────────┴──────────────────┘');
  }

  // Stats
  console.log(`\n📊 Results: ${phonesFound.length}/${results.length} phones found`);

  // Check remaining credits
  const finalCreditsRes = await fetch(`${LEMLIST_API_BASE}/team/credits`, {
    method: 'GET',
    headers: { Authorization: getAuthHeader() },
  });
  const finalCredits = await finalCreditsRes.json();
  console.log(`💳 Remaining Credits: ${finalCredits.credits}`);

  console.log('\n✅ Done!');
}

main().catch(console.error);
