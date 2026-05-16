/**
 * Test Prospeo Enrichment for LinkedIn Profiles
 */

import * as dotenv from 'dotenv';
dotenv.config();

import {
    enrichProspecoPerson,
    ProspeoPersonData,
    ProspeoError,
} from './services/prospeoService';

const PROSPEO_API_KEY = process.env.VITE_PROSPEO_API_KEY || '';

const linkedInProfiles: ProspeoPersonData[] = [
    { linkedin_url: 'https://www.linkedin.com/in/coldemailchris/' },
    { linkedin_url: 'https://www.linkedin.com/in/mariam-yasser-3350b0234/' },
    { linkedin_url: 'https://www.linkedin.com/in/eslam-mohamed-mohamed/' },
    { linkedin_url: 'https://www.linkedin.com/in/mahmoud-abdulrahmanh/' },
    { linkedin_url: 'https://www.linkedin.com/in/amrhanafy/' },
];

async function enrichLinkedInProfiles() {
    console.log('\n' + '='.repeat(70));
    console.log('  PROSPEO LINKEDIN PROFILE ENRICHMENT - MOBILE REVEAL');
    console.log('='.repeat(70));

    if (!PROSPEO_API_KEY || PROSPEO_API_KEY === 'your_prospeo_api_key_here') {
        console.error('\n❌ ERROR: VITE_PROSPEO_API_KEY not set!');
        return;
    }

    console.log('✅ API Key found:', PROSPEO_API_KEY.substring(0, 10) + '...');
    console.log(`\n📋 Enriching ${linkedInProfiles.length} LinkedIn profiles...\n`);

    const results: any[] = [];

    for (let i = 0; i < linkedInProfiles.length; i++) {
        const profile = linkedInProfiles[i];
        console.log(`\n[${i + 1}/${linkedInProfiles.length}] ${profile.linkedin_url}`);
        console.log('-'.repeat(60));

        try {
            const result = await enrichProspecoPerson(PROSPEO_API_KEY, profile, {
                enrichMobile: true,
                onlyVerifiedEmail: false,
                onlyVerifiedMobile: false,
            });

            const person = result.person;
            const company = result.company;

            console.log('✅ ENRICHED SUCCESSFULLY');
            console.log('');
            console.log('👤 PERSON:');
            console.log(`   Name: ${person?.full_name || 'N/A'}`);
            console.log(`   Title: ${person?.current_job_title || 'N/A'}`);
            console.log(`   Headline: ${person?.headline || 'N/A'}`);
            console.log(`   Location: ${person?.location?.city || ''}, ${person?.location?.country || 'N/A'}`);
            console.log('');
            console.log('📱 MOBILE:');
            console.log(`   Status: ${person?.mobile?.status || 'N/A'}`);
            console.log(`   Revealed: ${person?.mobile?.revealed ? 'YES ✅' : 'NO ❌'}`);
            if (person?.mobile?.revealed && person?.mobile?.mobile) {
                console.log(`   📞 MOBILE NUMBER: ${person.mobile.mobile}`);
                console.log(`   📞 International: ${person.mobile.mobile_international}`);
                console.log(`   📞 National: ${person.mobile.mobile_national}`);
                console.log(`   🌍 Country: ${person.mobile.mobile_country} (${person.mobile.mobile_country_code})`);
            } else if (person?.mobile?.mobile) {
                console.log(`   Masked: ${person.mobile.mobile}`);
            }
            console.log('');
            console.log('📧 EMAIL:');
            console.log(`   Status: ${person?.email?.status || 'N/A'}`);
            console.log(`   Revealed: ${person?.email?.revealed ? 'YES ✅' : 'NO ❌'}`);
            if (person?.email?.revealed && person?.email?.email) {
                console.log(`   ✉️  EMAIL: ${person.email.email}`);
            } else if (person?.email?.email) {
                console.log(`   Masked: ${person.email.email}`);
            }
            console.log('');
            console.log('🏢 COMPANY:');
            console.log(`   Name: ${company?.name || 'N/A'}`);
            console.log(`   Domain: ${company?.domain || 'N/A'}`);
            console.log(`   Industry: ${company?.industry || 'N/A'}`);
            console.log(`   Employees: ${company?.employee_count || 'N/A'} (${company?.employee_range || 'N/A'})`);
            console.log(`   LinkedIn: ${company?.linkedin_url || 'N/A'}`);
            console.log('');
            console.log(`💰 Free Enrichment: ${result.free_enrichment ? 'YES (no credits used)' : 'NO (credits used)'}`);

            results.push({
                linkedin: profile.linkedin_url,
                success: true,
                name: person?.full_name,
                title: person?.current_job_title,
                mobile: person?.mobile?.revealed ? person.mobile.mobile : null,
                mobileStatus: person?.mobile?.status,
                email: person?.email?.revealed ? person.email.email : null,
                emailStatus: person?.email?.status,
                company: company?.name,
                freeEnrichment: result.free_enrichment,
            });

        } catch (error: any) {
            if (error instanceof ProspeoError) {
                console.log(`❌ Error: ${error.code} - ${error.message}`);
                results.push({
                    linkedin: profile.linkedin_url,
                    success: false,
                    error: error.code,
                });
            } else {
                console.log(`❌ Error: ${error.message}`);
                results.push({
                    linkedin: profile.linkedin_url,
                    success: false,
                    error: error.message,
                });
            }
        }

        // Delay between requests to avoid rate limiting
        if (i < linkedInProfiles.length - 1) {
            console.log('\n⏳ Waiting 2 seconds before next request...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('  SUMMARY');
    console.log('='.repeat(70));

    const successful = results.filter(r => r.success);
    const withMobile = results.filter(r => r.mobile);
    const withEmail = results.filter(r => r.email);

    console.log(`\nTotal Profiles: ${results.length}`);
    console.log(`Enriched: ${successful.length}`);
    console.log(`With Mobile Revealed: ${withMobile.length}`);
    console.log(`With Email Revealed: ${withEmail.length}`);

    console.log('\n📱 MOBILE NUMBERS REVEALED:');
    console.log('-'.repeat(50));
    withMobile.forEach(r => {
        console.log(`${r.name} @ ${r.company}: ${r.mobile}`);
    });

    console.log('\n📧 EMAILS REVEALED:');
    console.log('-'.repeat(50));
    withEmail.forEach(r => {
        console.log(`${r.name} @ ${r.company}: ${r.email}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('  COMPLETE');
    console.log('='.repeat(70) + '\n');

    return results;
}

// Run
enrichLinkedInProfiles().catch(console.error);
