import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    if (request.method === 'GET') {
        const { id, contactId, pipelineId } = request.query;
        try {
            if (id) {
                const opportunity = await prisma.opportunity.findUnique({
                    where: { id: id as string },
                    include: { contact: true, business: true },
                });
                return response.status(200).json(opportunity);
            }

            const opportunities = await prisma.opportunity.findMany({
                where: {
                    contactId: contactId ? (contactId as string) : undefined,
                    pipelineId: pipelineId ? (pipelineId as string) : undefined,
                },
                orderBy: { createdAt: 'desc' },
            });

            return response.status(200).json(opportunities);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    if (request.method === 'POST' || request.method === 'PATCH') {
        try {
            const { id, ...data } = request.body;

            if (id) {
                const opportunity = await prisma.opportunity.update({
                    where: { id },
                    data: {
                        ...data,
                        updatedAt: new Date(),
                    },
                });
                return response.status(200).json(opportunity);
            }

            const opportunity = await prisma.opportunity.create({
                data,
            });
            return response.status(201).json(opportunity);
        } catch (error) {
            console.error('Error saving opportunity:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
