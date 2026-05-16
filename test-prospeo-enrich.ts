/**
 * Test Prospeo Enrich Person API
 *
 * Usage:
 *   npx tsx test-prospeo-enrich.ts
 *
 * Make sure to set VITE_PROSPEO_API_KEY in your .env file
 */

import * as dotenv from 'dotenv';
dotenv.config();

import {
    enrichProspecoPerson,
    batchEnrichProspeoPersons,
    transformProspeoToRawJson,
    canEnrichWithProspeo,
    extractProspeoDataFromRaw,
    ProspeoPersonData,
    ProspeoError,
} from './services/prospeoService';

const PROSPEO_API_KEY = process.env.VITE_PROSPEO_API_KEY || '';

// ==========================================
// Test Data - Sample Leads
// ==========================================

const testLeads: ProspeoPersonData[] = [
    // Test 1: Using first_name + last_name + company_website (recommended)
    {
        first_name: 'Eva',
        last_name: 'Kiegler',
        company_name: 'Intercom',
        company_website: 'intercom.com',
        company_linkedin_url: 'https://www.linkedin.com/company/intercom',
    },
    // Test 2: Using LinkedIn URL (most accurate)
    {
        linkedin_url: 'https://www.linkedin.com/in/eoghanmccabe',
    },
    // Test 3: Using full_name + company_name
    {
        full_name: 'Satya Nadella',
        company_name: 'Microsoft',
        company_website: 'microsoft.com',
    },
    // Test 4: Using email
    {
        email: 'test@intercom.com', // Example - may not match
    },
];

// ==========================================
// Test Functions
// ==========================================

async function testSingleEnrichment() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 1: Single Person Enrichment (with Mobile)');
    console.log('='.repeat(60));

    const testPerson: ProspeoPersonData = {
        first_name: 'Eva',
        last_name: 'Kiegler',
        company_name: 'Intercom',
        company_website: 'intercom.com',
    };

    try {
        const result = await enrichProspecoPerson(PROSPEO_API_KEY, testPerson, {
            enrichMobile: true,
            onlyVerifiedEmail: false,
        });

        console.log('\n✅ Enrichment Successful!');
        console.log('\n--- Person Data ---');
        console.log('Person ID:', result.person?.person_id);
        console.log('Full Name:', result.person?.full_name);
        console.log('Job Title:', result.person?.current_job_title);
        console.log('LinkedIn:', result.person?.linkedin_url);
        console.log('Headline:', result.person?.headline);

        console.log('\n--- Mobile Info ---');
        console.log('Mobile Status:', result.person?.mobile?.status);
        console.log('Mobile Revealed:', result.person?.mobile?.revealed);
        console.log('Mobile Number:', result.person?.mobile?.mobile || 'Not revealed');
        console.log('Mobile Country:', result.person?.mobile?.mobile_country);

        console.log('\n--- Email Info ---');
        console.log('Email Status:', result.person?.email?.status);
        console.log('Email Revealed:', result.person?.email?.revealed);
        console.log('Email:', result.person?.email?.email || 'Not revealed');
        console.log('MX Provider:', result.person?.email?.email_mx_provider);

        console.log('\n--- Location ---');
        console.log('City:', result.person?.location?.city);
        console.log('State:', result.person?.location?.state);
        console.log('Country:', result.person?.location?.country);

        console.log('\n--- Company Data ---');
        console.log('Company Name:', result.company?.name);
        console.log('Company Domain:', result.company?.domain);
        console.log('Industry:', result.company?.industry);
        console.log('Employees:', result.company?.employee_count);
        console.log('Employee Range:', result.company?.employee_range);
        console.log('Revenue Range:', result.company?.revenue_range_printed);
        console.log('Founded:', result.company?.founded);
        console.log('Company LinkedIn:', result.company?.linkedin_url);

        if (result.company?.funding) {
            console.log('\n--- Funding ---');
            console.log('Total Funding:', result.company.funding.total_funding_printed);
            console.log('Latest Stage:', result.company.funding.latest_funding_stage);
            console.log('Funding Rounds:', result.company.funding.count);
        }

        if (result.company?.technology) {
            console.log('\n--- Technology ---');
            console.log('Tech Count:', result.company.technology.count);
            console.log('Tech Stack:', result.company.technology.technology_names?.slice(0, 6).join(', '));
        }

        console.log('\n--- Metadata ---');
        console.log('Free Enrichment:', result.free_enrichment);

        // Transform to rawJson format
        console.log('\n--- Transformed to RawJson (sample) ---');
        const rawJson = transformProspeoToRawJson(result);
        const sampleFields = [
            'Full Name', 'Job Title', 'Mobile Phone', 'Mobile Status',
            'Email', 'Company Name', 'Company Industry', 'Company Employees'
        ];
        sampleFields.forEach(field => {
            if (rawJson[field]) {
                console.log(`${field}: ${rawJson[field]}`);
            }
        });

        return result;
    } catch (error) {
        if (error instanceof ProspeoError) {
            console.error('\n❌ Prospeo Error:', error.code, '-', error.message);
        } else {
            console.error('\n❌ Error:', (error as Error).message);
        }
        throw error;
    }
}

async function testLinkedInEnrichment() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 2: Enrichment by LinkedIn URL');
    console.log('='.repeat(60));

    const testPerson: ProspeoPersonData = {
        linkedin_url: 'https://www.linkedin.com/in/eoghanmccabe',
    };

    try {
        const result = await enrichProspecoPerson(PROSPEO_API_KEY, testPerson, {
            enrichMobile: true,
        });

        console.log('\n✅ Enrichment Successful!');
        console.log('Full Name:', result.person?.full_name);
        console.log('Job Title:', result.person?.current_job_title);
        console.log('Company:', result.company?.name);
        console.log('Mobile Status:', result.person?.mobile?.status);
        console.log('Mobile Revealed:', result.person?.mobile?.revealed);
        console.log('Email Status:', result.person?.email?.status);

        return result;
    } catch (error) {
        if (error instanceof ProspeoError) {
            console.error('\n❌ Prospeo Error:', error.code, '-', error.message);
        } else {
            console.error('\n❌ Error:', (error as Error).message);
        }
        return null;
    }
}

async function testBatchEnrichment() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 3: Batch Enrichment (3 persons)');
    console.log('='.repeat(60));

    const batchPersons: ProspeoPersonData[] = [
        {
            first_name: 'Eva',
            last_name: 'Kiegler',
            company_website: 'intercom.com',
        },
        {
            linkedin_url: 'https://www.linkedin.com/in/eoghanmccabe',
        },
        {
            full_name: 'John Doe',
            company_name: 'Unknown Company That Does Not Exist XYZ123',
        },
    ];

    try {
        const result = await batchEnrichProspeoPersons(PROSPEO_API_KEY, batchPersons, {
            enrichMobile: true,
            delayMs: 1000,
            onProgress: (current, total, response) => {
                const status = response ? '✅' : '❌';
                console.log(`Progress: ${current}/${total} ${status}`);
            },
        });

        console.log('\n--- Batch Summary ---');
        console.log('Total:', result.summary.total);
        console.log('Enriched:', result.summary.enriched);
        console.log('With Mobile:', result.summary.withMobile);
        console.log('With Email:', result.summary.withEmail);
        console.log('Failed:', result.summary.failed);
        console.log('Free Enrichments:', result.summary.freeEnrichments);

        console.log('\n--- Individual Results ---');
        result.results.forEach((r, i) => {
            const name = r.data.full_name || `${r.data.first_name} ${r.data.last_name}` || r.data.linkedin_url || r.data.email;
            if (r.result) {
                console.log(`${i + 1}. ${name}: ✅ ${r.result.person?.full_name || 'Enriched'}`);
            } else {
                console.log(`${i + 1}. ${name}: ❌ ${r.error}`);
            }
        });

        return result;
    } catch (error) {
        console.error('\n❌ Batch Error:', (error as Error).message);
        return null;
    }
}

async function testCanEnrichValidation() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 4: Validation - canEnrichWithProspeo()');
    console.log('='.repeat(60));

    const testCases = [
        {
            name: 'With LinkedIn URL',
            data: { 'LinkedIn URL': 'https://linkedin.com/in/test' },
            expected: true,
        },
        {
            name: 'With Email',
            data: { email: 'test@example.com' },
            expected: true,
        },
        {
            name: 'With Name + Company',
            data: { 'First Name': 'John', 'Last Name': 'Doe', 'Company Name': 'Acme Inc' },
            expected: true,
        },
        {
            name: 'With Full Name + Company Website',
            data: { fullName: 'Jane Smith', 'Company Domain': 'acme.com' },
            expected: true,
        },
        {
            name: 'Only Name (no company) - INVALID',
            data: { 'First Name': 'John', 'Last Name': 'Doe' },
            expected: false,
        },
        {
            name: 'Only Company (no name) - INVALID',
            data: { 'Company Name': 'Acme Inc' },
            expected: false,
        },
        {
            name: 'Empty data - INVALID',
            data: {},
            expected: false,
        },
    ];

    testCases.forEach(tc => {
        const result = canEnrichWithProspeo(tc.data);
        const status = result === tc.expected ? '✅' : '❌';
        console.log(`${status} ${tc.name}: ${result} (expected: ${tc.expected})`);
    });
}

async function testExtractData() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 5: Extract ProspeoPersonData from RawJson');
    console.log('='.repeat(60));

    const sampleRaw = {
        'First Name': 'John',
        'Last Name': 'Smith',
        'Company Name': 'Tech Corp',
        'Company Domain': 'techcorp.com',
        'LinkedIn URL': 'https://linkedin.com/in/johnsmith',
        'Email': 'john@techcorp.com',
        'Some Other Field': 'ignored',
    };

    const extracted = extractProspeoDataFromRaw(sampleRaw);

    console.log('Input RawJson:', JSON.stringify(sampleRaw, null, 2));
    console.log('\nExtracted ProspeoPersonData:', JSON.stringify(extracted, null, 2));
}

// ==========================================
// Main Runner
// ==========================================

async function runTests() {
    console.log('\n' + '🚀'.repeat(30));
    console.log('\n  PROSPEO ENRICH PERSON API - TEST SUITE\n');
    console.log('🚀'.repeat(30));

    // Check API key
    if (!PROSPEO_API_KEY || PROSPEO_API_KEY === 'your_prospeo_api_key_here') {
        console.error('\n❌ ERROR: VITE_PROSPEO_API_KEY not set in .env file!');
        console.error('Please add your Prospeo API key to the .env file:');
        console.error('VITE_PROSPEO_API_KEY=your_actual_api_key\n');

        console.log('\n--- Running validation tests only ---\n');
        await testCanEnrichValidation();
        await testExtractData();
        return;
    }

    console.log('✅ API Key found:', PROSPEO_API_KEY.substring(0, 8) + '...');

    // Run tests
    try {
        await testSingleEnrichment();
    } catch (e) {
        // Continue even if single test fails
    }

    try {
        await testLinkedInEnrichment();
    } catch (e) {
        // Continue
    }

    try {
        await testBatchEnrichment();
    } catch (e) {
        // Continue
    }

    // These don't require API
    await testCanEnrichValidation();
    await testExtractData();

    console.log('\n' + '='.repeat(60));
    console.log('TEST SUITE COMPLETED');
    console.log('='.repeat(60) + '\n');
}

// Run
runTests().catch(console.error);
