/**
 * Test script for Lemlist enrichment
 * Run with: npx tsx test-lemlist-enrich.ts
 */

const LEMLIST_API_KEY = '5ac7fc38e28af47b7bd5b929d4f02314';
const LEMLIST_API_BASE = 'https://api.lemlist.com/api';

// First, let's verify the API key works by checking team info
async function verifyApiKey(): Promise<boolean> {
    console.log('\n--- Verifying API Key ---');
    try {
        const response = await fetch(`${LEMLIST_API_BASE}/team`, {
            method: 'GET',
            headers: {
                'Authorization': createAuthHeader(LEMLIST_API_KEY),
            },
        });

        const data = await response.json();
        console.log('Team API Response:', response.status, JSON.stringify(data, null, 2));
        return response.ok;
    } catch (error) {
        console.error('API Key verification failed:', error);
        return false;
    }
}

// Check enrichment credits/balance
async function checkEnrichmentCredits(): Promise<{ canEnrich: boolean; total: number }> {
    console.log('\n--- Checking Credits ---');
    try {
        const response = await fetch(`${LEMLIST_API_BASE}/team/credits`, {
            method: 'GET',
            headers: {
                'Authorization': createAuthHeader(LEMLIST_API_KEY),
            },
        });

        if (response.ok) {
            const data = await response.json();
            const remaining = data.details?.remaining || {};
            console.log('Credits:', JSON.stringify(remaining, null, 2));
            console.log(`  Total: ${remaining.total || 0}`);
            console.log(`  Subscription: ${remaining.subscription || 0}`);
            console.log(`  Paid: ${remaining.paid || 0}`);
            console.log(`  Gifted: ${remaining.gifted || 0}`);
            console.log(`  Freemium: ${remaining.freemium || 0}`);

            // Enrichment requires subscription or paid credits
            const canEnrich = (remaining.subscription || 0) > 0 || (remaining.paid || 0) > 0;
            if (!canEnrich) {
                console.log('\n  ⚠️  WARNING: Only gifted/freemium credits available.');
                console.log('  ⚠️  Enrichment (findEmail/findPhone) requires a PAID Lemlist plan.');
                console.log('  ⚠️  Gifted credits are for People Database search only.');
            }
            return { canEnrich, total: remaining.total || 0 };
        }
    } catch (error) {
        console.error('Credit check failed:', error);
    }
    return { canEnrich: false, total: 0 };
}

// Create Basic Auth header
const createAuthHeader = (apiKey: string): string => {
    const credentials = Buffer.from(`:${apiKey}`).toString('base64');
    return `Basic ${credentials}`;
};

// Helper to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface EnrichmentParams {
    findEmail?: boolean;
    verifyEmail?: boolean;
    linkedinEnrichment?: boolean;
    findPhone?: boolean;
    email?: string;
    linkedinUrl?: string;
    firstName?: string;
    lastName?: string;
    companyDomain?: string;
    companyName?: string;
}

// Start enrichment
async function startEnrichment(params: EnrichmentParams): Promise<{ id: string }> {
    const queryParams = new URLSearchParams();

    if (params.findEmail) queryParams.append('findEmail', 'true');
    if (params.verifyEmail) queryParams.append('verifyEmail', 'true');
    if (params.linkedinEnrichment) queryParams.append('linkedinEnrichment', 'true');
    if (params.findPhone) queryParams.append('findPhone', 'true');
    if (params.email) queryParams.append('email', params.email);
    if (params.linkedinUrl) queryParams.append('linkedinUrl', params.linkedinUrl);
    if (params.firstName) queryParams.append('firstName', params.firstName);
    if (params.lastName) queryParams.append('lastName', params.lastName);
    if (params.companyDomain) queryParams.append('companyDomain', params.companyDomain);
    if (params.companyName) queryParams.append('companyName', params.companyName);

    console.log('\n--- Starting Enrichment ---');
    console.log('URL:', `${LEMLIST_API_BASE}/enrich?${queryParams.toString()}`);

    const response = await fetch(`${LEMLIST_API_BASE}/enrich?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
            'Authorization': createAuthHeader(LEMLIST_API_KEY),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to start enrichment: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Enrichment started:', data);
    return data;
}

// Get enrichment result
async function getEnrichmentResult(enrichmentId: string): Promise<any> {
    const response = await fetch(`${LEMLIST_API_BASE}/enrich/${enrichmentId}`, {
        method: 'GET',
        headers: {
            'Authorization': createAuthHeader(LEMLIST_API_KEY),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get enrichment: ${response.status} - ${errorText}`);
    }

    return response.json();
}

// Poll for results
async function pollForResult(enrichmentId: string, timeoutMs = 60000, intervalMs = 3000): Promise<any> {
    const startTime = Date.now();
    let attempts = 0;

    while (Date.now() - startTime < timeoutMs) {
        attempts++;
        await delay(intervalMs);

        try {
            const result = await getEnrichmentResult(enrichmentId);
            console.log(`Poll attempt ${attempts}:`, result.type || result.status || 'checking...');

            if (result.type === 'enrichmentDone' || result.status === 'completed') {
                return result;
            }

            if (result.type === 'enrichmentFailed' || result.status === 'failed') {
                throw new Error(`Enrichment failed: ${result.error || 'Unknown error'}`);
            }
        } catch (error: any) {
            if (error.message.includes('Enrichment failed')) {
                throw error;
            }
            console.warn(`Poll attempt ${attempts} error:`, error.message);
        }
    }

    throw new Error(`Timeout after ${timeoutMs}ms`);
}

// Helper to display results
function displayResults(result: any) {
    console.log('\n--- ENRICHMENT RESULT ---');
    console.log(JSON.stringify(result, null, 2));

    // Parse and display key info
    if (result.data && result.data.length > 0) {
        const item = result.data[0];
        console.log('\n--- PARSED KEY DATA ---');

        if (item.data?.find_email) {
            console.log('Email:', item.data.find_email.email);
            console.log('Email Status:', item.data.find_email.status);
        }

        if (item.data?.find_phone) {
            console.log('Phone:', item.data.find_phone.phone);
        }

        if (item.data?.linkedin_enrichment) {
            const li = item.data.linkedin_enrichment;
            console.log('Name:', li.firstName, li.lastName);
            console.log('Tagline:', li.tagline);
            console.log('Location:', li.locationName);
            console.log('Current Company:', li.companyName);
            console.log('Current Role:', li.occupation);
            console.log('Skills:', li.skills);
        }
    }
}

// Main test function - NO LinkedIn login required
// All tests use Name + Company Domain/Name strategy
async function testEnrichment() {
    console.log('='.repeat(60));
    console.log('LEMLIST ENRICHMENT TEST (No LinkedIn Login)');
    console.log('Strategy: firstName + lastName + companyDomain/companyName');
    console.log('='.repeat(60));

    // Verify API access first
    const apiValid = await verifyApiKey();
    const { canEnrich } = await checkEnrichmentCredits();

    if (!apiValid) {
        console.log('\nAPI key verification failed. Please check your Lemlist API key.');
        return;
    }

    if (!canEnrich) {
        console.log('\n⚠️  Account does not have enrichment credits (paid/subscription).');
        console.log('⚠️  The enrichment API will return "Failed to enrich lead" for all requests.');
        console.log('⚠️  To use enrichment, upgrade to a paid Lemlist plan.');
        console.log('⚠️  Running tests anyway to verify API integration...\n');
    }

    // Test contact info
    const contact = {
        firstName: 'Amr',
        lastName: 'Hanafy',
        companyDomain: 'manafeth.com',
        companyName: 'Manafeth',
    };

    console.log('\nTest Contact:');
    console.log('  Name:', contact.firstName, contact.lastName);
    console.log('  Company:', contact.companyName);
    console.log('  Domain:', contact.companyDomain);

    // TEST 1: Name + Company Domain (BEST strategy - no LinkedIn needed)
    console.log('\n' + '-'.repeat(60));
    console.log('TEST 1: Name + Company Domain (findEmail + findPhone)');
    console.log('-'.repeat(60));

    try {
        const enrichResponse = await startEnrichment({
            firstName: contact.firstName,
            lastName: contact.lastName,
            companyDomain: contact.companyDomain,
            findEmail: true,
            findPhone: true,
            linkedinEnrichment: false, // No LinkedIn login needed
        });

        console.log('\nPolling for results...');
        const result = await pollForResult(enrichResponse.id);
        displayResults(result);
    } catch (error: any) {
        console.log('Failed:', error.message);
    }

    // TEST 2: Name + Company Name (fallback when no domain)
    console.log('\n' + '-'.repeat(60));
    console.log('TEST 2: Name + Company Name (no domain)');
    console.log('-'.repeat(60));

    try {
        const enrichResponse = await startEnrichment({
            firstName: contact.firstName,
            lastName: contact.lastName,
            companyName: contact.companyName,
            findEmail: true,
            findPhone: true,
            linkedinEnrichment: false,
        });

        console.log('\nPolling for results...');
        const result = await pollForResult(enrichResponse.id);
        displayResults(result);
    } catch (error: any) {
        console.log('Failed:', error.message);
    }

    // TEST 3: Name + Domain + Company Name (maximum data)
    console.log('\n' + '-'.repeat(60));
    console.log('TEST 3: Full data (Name + Domain + Company Name)');
    console.log('-'.repeat(60));

    try {
        const enrichResponse = await startEnrichment({
            firstName: contact.firstName,
            lastName: contact.lastName,
            companyDomain: contact.companyDomain,
            companyName: contact.companyName,
            findEmail: true,
            findPhone: true,
            linkedinEnrichment: false,
        });

        console.log('\nPolling for results...');
        const result = await pollForResult(enrichResponse.id);
        displayResults(result);
    } catch (error: any) {
        console.log('Failed:', error.message);
    }

    // TEST 4: Email verification only
    console.log('\n' + '-'.repeat(60));
    console.log('TEST 4: Email verification (verify existing email)');
    console.log('-'.repeat(60));

    try {
        const enrichResponse = await startEnrichment({
            email: 'amr@manafeth.com',
            findPhone: true,
            linkedinEnrichment: false,
            verifyEmail: true,
        });

        console.log('\nPolling for results...');
        const result = await pollForResult(enrichResponse.id);
        displayResults(result);
    } catch (error: any) {
        console.log('Failed:', error.message);
    }

    // TEST 5: Different person - well-known domain
    console.log('\n' + '-'.repeat(60));
    console.log('TEST 5: Known person + known domain');
    console.log('-'.repeat(60));

    try {
        const enrichResponse = await startEnrichment({
            firstName: 'Elon',
            lastName: 'Musk',
            companyDomain: 'tesla.com',
            findEmail: true,
            findPhone: true,
            linkedinEnrichment: false,
        });

        console.log('\nPolling for results...');
        const result = await pollForResult(enrichResponse.id);
        displayResults(result);
    } catch (error: any) {
        console.log('Failed:', error.message);
    }

    // TEST 6: LinkedIn URL with findEmail/findPhone only (no linkedinEnrichment)
    console.log('\n' + '-'.repeat(60));
    console.log('TEST 6: LinkedIn URL for email/phone only (no profile enrichment)');
    console.log('-'.repeat(60));

    try {
        const enrichResponse = await startEnrichment({
            linkedinUrl: 'https://www.linkedin.com/in/amrhanafy/',
            firstName: contact.firstName,
            lastName: contact.lastName,
            findEmail: true,
            findPhone: true,
            linkedinEnrichment: false, // Key: don't request LinkedIn profile data
        });

        console.log('\nPolling for results...');
        const result = await pollForResult(enrichResponse.id);
        displayResults(result);
    } catch (error: any) {
        console.log('Failed:', error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('TEST COMPLETE');
    console.log('='.repeat(60));
    console.log('\nSummary:');
    console.log('- All tests use findEmail + findPhone without LinkedIn login');
    console.log('- Best strategy: firstName + lastName + companyDomain');
    console.log('- linkedinEnrichment=false avoids the LinkedIn account requirement');
}

// Run the test
testEnrichment();
