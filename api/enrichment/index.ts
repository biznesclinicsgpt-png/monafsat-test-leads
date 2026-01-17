
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enrichContact } from '../../services/enrichmentService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { contact } = req.body;

    if (!contact) {
        return res.status(400).json({ error: 'Contact data is required' });
    }

    try {
        const enrichedData = await enrichContact(contact);
        return res.status(200).json(enrichedData);
    } catch (error: any) {
        console.error('Enrichment API Error:', error);
        return res.status(500).json({ error: 'Failed to enrich contact', details: error.message });
    }
}
