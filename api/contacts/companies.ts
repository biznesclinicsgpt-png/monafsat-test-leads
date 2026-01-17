import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    if (request.method === 'GET') {
        const { id, search } = request.query;
        try {
            if (id) {
                const business = await prisma.business.findUnique({
                    where: { id: id as string },
                    include: { opportunities: true },
                });
                return response.status(200).json(business);
            }

            const businesses = await prisma.business.findMany({
                where: search ? {
                    name: { contains: search as string, mode: 'insensitive' }
                } : {},
                orderBy: { name: 'asc' },
                take: 100,
            });

            return response.status(200).json(businesses);
        } catch (error) {
            console.error('Error fetching businesses:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    if (request.method === 'POST') {
        try {
            const data = request.body;
            const business = await prisma.business.create({
                data,
            });
            return response.status(201).json(business);
        } catch (error) {
            console.error('Error creating business:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
