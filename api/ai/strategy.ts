
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

    const { company_name, description, website } = request.body;

    if (!company_name && !description) {
        return response.status(400).json({ error: 'Company name or description required' });
    }

    try {
        const prompt = `
        You are a GTM Strategy Consultant for B2B Service Providers in Saudi Arabia.
        Analyze the following company and generate a high-impact Go-To-Market strategy.

        COMPANY INFO:
        Name: ${company_name}
        Description: ${description}
        Website: ${website}

        OUTPUT FORMAT: JSON Object with the following fields:
        1. value_proposition: A single, punchy sentence explaining the core value. (Arabic)
        2. target_audience: A short summary of the Ideal Customer Profile. (Arabic)
        3. unique_selling_points: Array of 3-5 distinct differentiators. (Arabic)
        4. suggested_industries: Array of 3-5 industries they sell to. (English, e.g. "Fintech")
        
        5. icp_structured: Object containing:
           - decision_makers: Array of 3 job titles (Arabic, e.g. "CEO", "Marketing Manager").
           - pain_points: Array of 3 critical problems they solve (Arabic).
           - business_goals: Array of 3 goals the client achieves (Arabic).
           - company_size_ideal: Array of 1-2 size ranges (e.g. "50-200 موظف").

        TONE: Professional, persuasive, result-oriented.
        LANGUAGE: Arabic (except for industries).
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content returned from AI');

        const strategy = JSON.parse(content);
        return response.status(200).json(strategy);

    } catch (error) {
        console.error('Strategy Generation Error:', error);
        return response.status(500).json({ error: 'Failed to generate strategy' });
    }
}
