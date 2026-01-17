import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    if (request.method === 'GET') {
        const { buyerProfileId, id } = request.query;
        try {
            if (id) {
                const project = await prisma.project.findUnique({
                    where: { id: id as string },
                    include: {
                        buyerProfile: true,
                        responses: true,
                    },
                });
                return response.status(200).json(project);
            }

            const projects = await prisma.project.findMany({
                where: buyerProfileId ? { buyerProfileId: buyerProfileId as string } : {},
                orderBy: { createdAt: 'desc' },
            });
            return response.status(200).json(projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    if (request.method === 'POST') {
        try {
            const data = request.body;
            const project = await prisma.project.create({
                data: {
                    ...data,
                    attachments: data.attachments || [],
                },
            });
            return response.status(201).json(project);
        } catch (error) {
            console.error('Error creating project:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
