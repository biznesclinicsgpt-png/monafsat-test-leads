import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    if (request.method === 'GET') {
        const { id, email, search } = request.query;
        try {
            if (id) {
                const contact = await prisma.contact.findUnique({
                    where: { id: id as string },
                    include: { opportunities: true },
                });
                return response.status(200).json(contact);
            }

            if (email) {
                const contact = await prisma.contact.findUnique({
                    where: { email: email as string },
                    include: { opportunities: true },
                });
                return response.status(200).json(contact);
            }

            const contacts = await prisma.contact.findMany({
                where: search ? {
                    OR: [
                        { name: { contains: search as string, mode: 'insensitive' } },
                        { email: { contains: search as string, mode: 'insensitive' } },
                        { companyName: { contains: search as string, mode: 'insensitive' } },
                    ]
                } : {},
                orderBy: { created_at: 'desc' },
                take: 100,
            });

            return response.status(200).json(contacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
        try {
            const { id, ...data } = request.body;

            if (id || (request.method !== 'POST' && data.email)) {
                const contact = await prisma.contact.upsert({
                    where: id ? { id } : { email: data.email },
                    update: {
                        ...data,
                        updated_at: new Date(),
                    },
                    create: {
                        ...data,
                    },
                });
                return response.status(200).json(contact);
            }

            const contact = await prisma.contact.create({
                data,
            });
            return response.status(201).json(contact);
        } catch (error) {
            console.error('Error saving contact:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
