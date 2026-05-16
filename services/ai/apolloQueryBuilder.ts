
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApolloSearchFilters } from "../apolloService";

// Initialize Gemini
// NOTE: In a real app, do not expose keys on client. This should be a backend function.
// For this prototype, we assume the environment variable is available or proxied.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateApolloFilters = async (
    providerDescription: string,
    providerIndustries: string[]
): Promise<ApolloSearchFilters> => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are a B2B Sales Intelligence Expert. Your goal is to translate a "Provider Profile" (a company offering services) into a precise "Ideal Customer Profile" (ICP) using Apollo.io search filters.

    Provider Description: "${providerDescription}"
    Provider Industries: "${providerIndustries.join(', ')}"

    Task:
    Identify the *decision makers* who would buy these services.
    Map them to the following Apollo.io API filter keys exactly:
    - person_titles: (Array of strings, e.g. ["CEO", "Marketing Director"]) - Be specific but broad enough.
    - organization_locations: (Array of strings, e.g. ["Saudi Arabia", "Riyadh"]) - Default to Saudi Arabia if not specified.
    - q_organization_domains: (Optional, if specific types of companies are mentioned)
    - person_seniorities: (Optional, e.g. ["senior", "manager", "c_suite", "owner", "founder", "director", "vp"])

    IMPORTANT:
    - Focus on the *Buy Side*. Who buys this service?
    - Return ONLY valid JSON. No markdown formatting.
    - Example JSON:
    {
        "person_titles": ["HR Director", "Chief People Officer"],
        "organization_locations": ["Saudi Arabia"],
        "person_seniorities": ["director", "c_suite"]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const filters = JSON.parse(jsonStr);

        return filters;
    } catch (error) {
        console.error("AI ICP Generation Failed:", error);
        // Fallback default
        return {
            person_titles: ["CEO", "Owner"],
            organization_locations: ["Saudi Arabia"]
        };
    }
};
