
import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { my_info, competitors } = request.body;
    // competitors: Array of { url: string, description?: string }

    if (!my_info || !competitors || !Array.isArray(competitors)) {
        return response.status(400).json({ error: 'Missing my_info or competitors array' });
    }

    try {
        const competitorsText = competitors.map((c, i) =>
            `Competitor ${i + 1}: ${c.url} - ${c.description || 'No description provided'}`
        ).join('\n');

        const prompt = `
        You are a Strategic Business Consultant.
        Compare the following "My Company" against the "Competitors".
        Identify where "My Company" can win (Market Gaps) and suggest new Unique Selling Points (USPs).

        MY COMPANY:
        ${my_info}

        COMPETITORS:
        ${competitorsText}

        OUTPUT FORMAT: JSON Object with:
        1. competitive_advantage: A paragraph explaining why I am better or different. (Arabic)
        2. suggested_usps: Array of 3 specific USPs I should highlight to beat them. (Arabic)
        3. market_gap: What are the competitors missing that I can fill? (Arabic)
        
        TONE: Strategic, Encouraging.
        LANGUAGE: Arabic.
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content returned from AI');

        const analysis = JSON.parse(content);
        return response.status(200).json(analysis);

    } catch (error) {
        console.error('Competitor Analysis Error:', error);
        return response.status(500).json({ error: 'Failed to analyze competitors' });
    }
}
