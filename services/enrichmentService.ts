
import OpenAI from 'openai';
import { Contact } from '../types';

// Initialize OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

interface EnrichedData {
    company_description?: string;
    industry_ar?: string; // Arabic Industry
    employee_count?: string;
    annual_revenue?: string;
    company_linkedin_url?: string;
    initial_icebreaker?: string;
    city?: string;
    country?: string;
    source?: string;
}

export const enrichContact = async (contact: Partial<Contact>): Promise<EnrichedData> => {
    try {
        const prompt = `
      You are an expert B2B Lead Enrichment Agent. 
      Your task is to research the following company/person and provide missing details.
      
      Input Data:
      Name: ${contact.name || contact.first_name || 'Unknown'}
      Company: ${contact.company_name || 'Unknown'}
      Title: ${contact.title || 'Unknown'}
      Website: ${contact.website || 'Unknown'}
      LinkedIn: ${contact.linkedin_url || 'Unknown'}
      City: ${contact.city || 'Unknown'}

      Output Format: JSON only, no markdown.
      Fields Required:
      - company_description (Short summary, max 200 chars)
      - industry_ar (Industry in Arabic, e.g., "تقنية المعلومات")
      - employee_count (Estimated range, e.g., "50-200")
      - annual_revenue (Estimated range in USD)
      - company_linkedin_url (Best guess URL if not provided)
      - initial_icebreaker (A professional, personalized opening line for a cold email based on their role/company)
      - city (In English)
      - country (In English)
      - source (Set to "AI_Enrichment")

      If you cannot find specific data, make a high-confidence educated guess based on the company name/industry, or leave blank if completely unknown.
    `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;

        if (!content) return {};

        return JSON.parse(content) as EnrichedData;
    } catch (error) {
        console.error('AI Enrichment Error:', error);
        // Return empty enrichment on failure to avoid breaking the UI
        return {};
    }
};
