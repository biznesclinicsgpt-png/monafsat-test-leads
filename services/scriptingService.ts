import OpenAI from 'openai';
import { Contact, ProviderProfile } from '../types';

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true
});

interface CampaignScripts {
    welcome_message: string;
    follow_up_1: string;
    follow_up_2: string;
    follow_up_3: string;
    follow_up_4: string;
}

export const generateCampaignScripts = async (
    contact: Contact,
    senderName: string = 'Account Manager',
    senderCompany: string = 'Manafeth',
    profile?: ProviderProfile | null
): Promise<CampaignScripts> => {
    try {
        const strategyContext = profile ? `
        PROVIDER STRATEGY:
        Value Proposition: ${profile.value_proposition || 'We help companies grow.'}
        Target Audience: ${profile.target_audience || 'B2B Companies'}
        Unique Selling Points: ${profile.unique_selling_points?.join(', ') || 'Quality, Speed, Reliability'}
        
        VISUAL ICP INSIGHTS (Use these to personalize deeply):
        - PAIN POINTS (Agitate these): ${profile.icp_structured?.pain_points?.join(', ') || 'Inefficiency, High Costs'}
        - DESIRED GOALS (Promise these): ${profile.icp_structured?.business_goals?.join(', ') || 'Growth, Automation'}
        - TARGET ROLES (Write for them): ${profile.icp_structured?.decision_makers?.join(', ') || 'Decision Makers'}

        Case Studies: ${profile.clients?.map(c => `Client: ${c.company_name} -> Result: ${c.results}`).join('; ') || 'N/A'}
        ` : '';

        const prompt = `
      You are an expert B2B Sales Copywriter.
      Write a 5-step email sequence for the following lead.
      
      ${strategyContext}

      LEAD CONTEXT:
      Name: ${contact.first_name || contact.name}
      Company: ${contact.company_name}
      Title: ${contact.title}
      Industry: ${contact.industry_ar || contact.industry_2 || 'Unknown'}
      Icebreaker Fact: ${contact.initial_icebreaker || contact.company_description}
      
      SENDER CONTEXT:
      Name: ${senderName}
      Company: ${senderCompany}
      Value Prop: We help companies find the best service providers in Saudi Arabia.

      REQUIREMENTS:
      - Tone: Professional, conversational, concise.
      - Language: Arabic (Professional Business Arabic).
      - Output: JSON format ONLY.
      
      KEYS REQUIRED:
      1. welcome_message: The first email. Must use the Icebreaker. Pitch the value prop. Ask for a meeting.
      2. follow_up_1: A quick bump (2-3 days later). "Did you see my last email?".
      3. follow_up_2: Value add / Case study. "We recently helped a company in [Industry]...".
      4. follow_up_3: Call booking attempt. "Are you free next Tuesday?".
      5. follow_up_4: Breakup email. "I assume this isn't a priority...".

      Ensure the JSON is valid.
    `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content generated');

        return JSON.parse(content) as CampaignScripts;

    } catch (error) {
        console.error('Script Generation Error:', error);
        throw error;
    }
};
