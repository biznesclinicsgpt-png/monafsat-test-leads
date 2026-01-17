import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    const { userId, id } = request.query;

    if (request.method === 'GET') {
        try {
            if (!userId && !id) {
                return response.status(400).json({ error: 'userId or id is required' });
            }

            const profile = await prisma.buyerProfile.findFirst({
                where: userId ? { userId: userId as string } : { id: id as string },
                include: {
                    user: true,
                    projects: true,
                },
            });

            if (!profile) {
                return response.status(404).json({ error: 'Profile not found' });
            }

            return response.status(200).json(profile);
        } catch (error) {
            console.error('Error fetching buyer profile:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    if (request.method === 'POST' || request.method === 'PATCH' || request.method === 'PUT') {
        try {
            const data = request.body;
            const { userId: reqUserId } = data;

            if (!reqUserId) {
                return response.status(400).json({ error: 'userId is required' });
            }

            const profile = await prisma.buyerProfile.upsert({
                where: { userId: reqUserId },
                update: {
                    ...data,
                    updatedAt: new Date(),
                },
                create: {
                    ...data,
                },
            });

            return response.status(200).json(profile);
        } catch (error) {
            console.error('Error saving buyer profile:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
