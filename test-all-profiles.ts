/**
 * Test All LinkedIn Profiles with Lemlist
 */

const LEMLIST_API_KEY = '07d63aa0d49dcdb1b9a30fb7dd9cad84';
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
  const TIMEOUT = 120000; // 2 minutes
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

interface EnrichmentResult {
  linkedinUrl: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  title?: string;
  company?: string;
  location?: string;
  success: boolean;
}

async function enrichProfile(linkedinUrl: string): Promise<EnrichmentResult> {
  const shortUrl = decodeURIComponent(linkedinUrl.split('/in/')[1]?.replace('/', '') || linkedinUrl);
  console.log(`\n🔍 ${shortUrl}`);
  process.stdout.write('   Processing');

  try {
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

    if (!response.ok) {
      console.log(` ❌ Failed to start: ${response.status}`);
      return { linkedinUrl, success: false };
    }

    const data = await response.json();

    if (!data.id) {
      console.log(` ❌ No enrichment ID`);
      return { linkedinUrl, success: false };
    }

    const result = await pollForResult(data.id);

    if (!result) {
      console.log(` ⏰ Timeout`);
      return { linkedinUrl, success: false };
    }

    const d = result.data || {};
    const linkedin = d.linkedin || {};
    const phone = d.phone || {};
    const email = d.email || {};

    console.log(` ✅ Done!`);

    return {
      linkedinUrl,
      firstName: linkedin.firstName,
      lastName: linkedin.lastName,
      phone: phone.phone,
      email: email.email,
      title: linkedin.occupation || linkedin.positionGroups?.[0]?.profilePositions?.[0]?.title,
      company: linkedin.companyName || linkedin.positionGroups?.[0]?.company?.name,
      location: linkedin.locationName,
      success: true,
    };
  } catch (error) {
    console.log(` ❌ Error: ${(error as Error).message}`);
    return { linkedinUrl, success: false };
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     LEMLIST LINKEDIN ENRICHMENT - BATCH 2 TEST               ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  // Test connection
  console.log('\n🔌 Testing connection...');
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

  // Enrich all profiles
  const results: EnrichmentResult[] = [];

  for (const profile of linkedinProfiles) {
    const result = await enrichProfile(profile);
    results.push(result);
    // Delay between requests
    await delay(2000);
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('                            📊 RESULTS SUMMARY');
  console.log('═'.repeat(70));

  console.log('\n┌───────────────────────┬──────────────────┬─────────────────────────────────┐');
  console.log('│ Name                  │ Phone            │ Email                           │');
  console.log('├───────────────────────┼──────────────────┼─────────────────────────────────┤');

  for (const r of results) {
    if (r.success) {
      const name = `${r.firstName || ''} ${r.lastName || ''}`.trim().padEnd(21).slice(0, 21);
      const phone = (r.phone || '❌ Not found').padEnd(16).slice(0, 16);
      const email = (r.email || '❌ Not found').padEnd(31).slice(0, 31);
      console.log(`│ ${name} │ ${phone} │ ${email} │`);
    } else {
      const url = decodeURIComponent(r.linkedinUrl.split('/in/')[1]?.replace('/', '') || 'Unknown').padEnd(21).slice(0, 21);
      console.log(`│ ${url} │ ⚠️ Failed        │ ⚠️ Failed                       │`);
    }
  }

  console.log('└───────────────────────┴──────────────────┴─────────────────────────────────┘');

  // Stats
  const successful = results.filter(r => r.success);
  const phonesFound = results.filter(r => r.phone);
  const emailsFound = results.filter(r => r.email);

  console.log(`\n📊 Statistics:`);
  console.log(`   ✅ Successful: ${successful.length}/${results.length}`);
  console.log(`   📱 Phones found: ${phonesFound.length}/${results.length}`);
  console.log(`   📧 Emails found: ${emailsFound.length}/${results.length}`);

  if (phonesFound.length > 0) {
    console.log(`\n📱 Phone Numbers:`);
    for (const r of phonesFound) {
      console.log(`   • ${r.firstName} ${r.lastName}: ${r.phone}`);
    }
  }

  if (emailsFound.length > 0) {
    console.log(`\n📧 Emails:`);
    for (const r of emailsFound) {
      console.log(`   • ${r.firstName} ${r.lastName}: ${r.email}`);
    }
  }

  // Check remaining credits
  const finalCreditsRes = await fetch(`${LEMLIST_API_BASE}/team/credits`, {
    method: 'GET',
    headers: { Authorization: getAuthHeader() },
  });
  const finalCredits = await finalCreditsRes.json();
  console.log(`\n💳 Remaining Credits: ${finalCredits.credits}`);

  console.log('\n✅ Test completed!');
}

main().catch(console.error);
