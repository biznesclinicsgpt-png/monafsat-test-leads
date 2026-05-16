/**
 * Prospeo Batch Enrichment API Endpoint
 *
 * Provides batch mobile phone enrichment using Prospeo's Enrich Person API.
 *
 * POST /api/enrichment/prospeo-batch
 *
 * Body:
 * {
 *   "contacts": [
 *     { "first_name": "John", "last_name": "Doe", "company_website": "acme.com" },
 *     { "linkedin_url": "https://linkedin.com/in/janedoe" }
 *   ],
 *   "options": {
 *     "enrichMobile": true,
 *     "onlyVerifiedMobile": false,
 *     "delayMs": 500
 *   }
 * }
 *
 * Returns enriched results for all contacts.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
    batchEnrichProspeoPersons,
    extractProspeoDataFromRaw,
    canEnrichWithProspeo,
    ProspeoPersonData,
} from '../../services/prospeoService';

const MAX_BATCH_SIZE = 50; // Prospeo recommends max 50 per batch

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Get API key from environment
    const apiKey = process.env.VITE_PROSPEO_API_KEY;
    if (!apiKey) {
        return res.status(500).json({
            error: 'Prospeo API key not configured',
            message: 'Please set VITE_PROSPEO_API_KEY in environment variables',
        });
    }

    // Parse request body
    const { contacts, options } = req.body;

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({
            error: 'Contacts array is required',
            message: 'Please provide an array of contacts in the request body',
            example: {
                contacts: [
                    { first_name: 'John', last_name: 'Doe', company_website: 'acme.com' },
                    { linkedin_url: 'https://linkedin.com/in/janedoe' },
                ],
                options: {
                    enrichMobile: true,
                },
            },
        });
    }

    // Validate batch size
    if (contacts.length > MAX_BATCH_SIZE) {
        return res.status(400).json({
            error: 'Batch size exceeded',
            message: `Maximum batch size is ${MAX_BATCH_SIZE} contacts`,
            received: contacts.length,
        });
    }

    // Convert contacts to Prospeo format
    const prospeoContacts: ProspeoPersonData[] = contacts.map((contact: any) => {
        if (contact.first_name || contact.last_name || contact.linkedin_url || contact.email) {
            return {
                first_name: contact.first_name,
                last_name: contact.last_name,
                full_name: contact.full_name,
                linkedin_url: contact.linkedin_url,
                email: contact.email,
                company_name: contact.company_name,
                company_website: contact.company_website || contact.domain,
                company_linkedin_url: contact.company_linkedin_url,
                person_id: contact.person_id,
            };
        }
        return extractProspeoDataFromRaw(contact);
    });

    // Filter out contacts that don't meet minimum requirements
    const validContacts = prospeoContacts.filter((c) => canEnrichWithProspeo(c as any));
    const invalidCount = prospeoContacts.length - validContacts.length;

    if (validContacts.length === 0) {
        return res.status(400).json({
            error: 'No valid contacts',
            message: 'None of the provided contacts meet the minimum requirements for enrichment',
            invalidCount,
        });
    }

    try {
        // Call Prospeo batch API
        const result = await batchEnrichProspeoPersons(apiKey, validContacts, {
            enrichMobile: options?.enrichMobile ?? true,
            onlyVerifiedEmail: options?.onlyVerifiedEmail ?? false,
            onlyVerifiedMobile: options?.onlyVerifiedMobile ?? false,
            delayMs: options?.delayMs ?? 500,
        });

        return res.status(200).json({
            success: true,
            summary: {
                ...result.summary,
                invalidContacts: invalidCount,
            },
            results: result.results.map((r) => ({
                input: r.data,
                success: !!r.result,
                error: r.error,
                person: r.result?.person
                    ? {
                          personId: r.result.person.person_id,
                          fullName: r.result.person.full_name,
                          jobTitle: r.result.person.current_job_title,
                          linkedin: r.result.person.linkedin_url,
                          mobile: r.result.person.mobile,
                          email: r.result.person.email,
                          location: r.result.person.location,
                      }
                    : null,
                company: r.result?.company
                    ? {
                          name: r.result.company.name,
                          domain: r.result.company.domain,
                          industry: r.result.company.industry,
                          employees: r.result.company.employee_count,
                          linkedin: r.result.company.linkedin_url,
                      }
                    : null,
            })),
        });
    } catch (error: any) {
        console.error('Prospeo Batch API Error:', error);
        return res.status(500).json({
            success: false,
            error: 'BATCH_ERROR',
            message: error.message,
        });
    }
}
