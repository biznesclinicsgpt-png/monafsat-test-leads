
import { GoogleGenAI, Type } from "@google/genai";

// Use the process.env.API_KEY exclusively for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ICPDraft {
  industries: string[];
  titles: string[];
  description: string;
  budgetHint: string;
}

export const generateICPDraft = async (providerDescription: string): Promise<ICPDraft> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this provider's business description: "${providerDescription}", generate an Ideal Customer Profile (ICP). 
      Format the output as JSON with specific target industries, job titles, a brief strategy description, and budget hints. 
      IMPORTANT: All generated text MUST be in Arabic language.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            industries: { type: Type.ARRAY, items: { type: Type.STRING } },
            titles: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            budgetHint: { type: Type.STRING }
          },
          required: ["industries", "titles", "description", "budgetHint"]
        }
      }
    });

    // Access .text property directly from GenerateContentResponse
    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating ICP draft:", error);
    return {
      industries: ["تقنية المعلومات", "التسويق الرقمي", "البيع بالتجزئة"],
      titles: ["الرئيس التنفيذي (CEO)", "مدير التسويق", "مدير المبيعات"],
      description: "بناءً على المعلومات المتاحة، عميلك المثالي هو الشركات التي تبحث عن تحسين تواجدها الرقمي وزيادة المبيعات عبر القنوات الحديثة.",
      budgetHint: "10,000 ريال سعودي+"
    };
  }
};
