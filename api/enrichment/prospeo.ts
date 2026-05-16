/**
 * Prospeo Enrichment API Endpoint
 *
 * Provides mobile phone enrichment using Prospeo's Enrich Person API.
 *
 * POST /api/enrichment/prospeo
 *
 * Body:
 * {
 *   "contact": {
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     "company_name": "Acme Inc",
 *     "company_website": "acme.com",
 *     "linkedin_url": "https://linkedin.com/in/johndoe",
 *     "email": "john@acme.com"
 *   },
 *   "options": {
 *     "enrichMobile": true,
 *     "onlyVerifiedEmail": false,
 *     "onlyVerifiedMobile": false
 *   }
 * }
 *
 * Returns enriched person and company data including mobile phone.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
    enrichProspecoPerson,
    transformProspeoToRawJson,
    canEnrichWithProspeo,
    extractProspeoDataFromRaw,
    ProspeoPersonData,
    ProspeoError,
} from '../../services/prospeoService';

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
    const { contact, options } = req.body;

    if (!contact) {
        return res.status(400).json({
            error: 'Contact data is required',
            message: 'Please provide contact data in the request body',
            example: {
                contact: {
                    first_name: 'John',
                    last_name: 'Doe',
                    company_name: 'Acme Inc',
                    company_website: 'acme.com',
                },
                options: {
                    enrichMobile: true,
                },
            },
        });
    }

    // Build Prospeo data from contact
    let prospeoData: ProspeoPersonData;

    // Support both direct Prospeo format and raw JSON format
    if (contact.first_name || contact.last_name || contact.linkedin_url || contact.email) {
        // Direct Prospeo format
        prospeoData = {
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
    } else {
        // Raw JSON format (from staging row)
        prospeoData = extractProspeoDataFromRaw(contact);
    }

    // Validate minimum requirements
    if (!canEnrichWithProspeo(prospeoData as any)) {
        return res.status(400).json({
            error: 'Insufficient data for enrichment',
            message: 'Minimum requirements: linkedin_url OR email OR (name + company identifier)',
            requirements: {
                option1: 'linkedin_url',
                option2: 'email',
                option3: 'first_name + last_name + (company_name OR company_website OR company_linkedin_url)',
                option4: 'full_name + (company_name OR company_website OR company_linkedin_url)',
            },
        });
    }

    try {
        // Call Prospeo API
        const result = await enrichProspecoPerson(apiKey, prospeoData, {
            enrichMobile: options?.enrichMobile ?? true,
            onlyVerifiedEmail: options?.onlyVerifiedEmail ?? false,
            onlyVerifiedMobile: options?.onlyVerifiedMobile ?? false,
        });

        // Transform to raw JSON format
        const enrichedData = transformProspeoToRawJson(result);

        return res.status(200).json({
            success: true,
            freeEnrichment: result.free_enrichment,
            person: result.person,
            company: result.company,
            enrichedData,
            mobile: result.person?.mobile,
            email: result.person?.email,
        });
    } catch (error: any) {
        if (error instanceof ProspeoError) {
            const statusCode =
                error.code === 'INVALID_API_KEY' ? 401 :
                error.code === 'RATE_LIMITED' ? 429 :
                error.code === 'INSUFFICIENT_CREDITS' ? 402 :
                error.code === 'NO_MATCH' ? 404 :
                400;

            return res.status(statusCode).json({
                success: false,
                error: error.code,
                message: error.message,
            });
        }

        console.error('Prospeo API Error:', error);
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_ERROR',
            message: error.message,
        });
    }
}
