
import { Contact, ProviderICP, PipelineStage } from '../types';

export const calculateFitScore = (contact: Contact, icp: ProviderICP): { score: number; status: 'verified' | 'failed' | 'pending' } => {
    if (!icp.isSet) {
        return { score: 0, status: 'pending' };
    }

    let score = 0;
    const maxScore = 100;

    // 1. Industry Match (40 points)
    // Check against english or arabic industry fields
    const industryMatch = icp.industries.some(ind => {
        const target = ind.toLowerCase();
        return (
            contact.industry_ar?.toLowerCase().includes(target) ||
            contact.industry_2?.toLowerCase().includes(target) ||
            contact.company_description?.toLowerCase().includes(target)
        );
    });

    if (industryMatch) score += 40;

    // 2. Title Match (30 points)
    const titleMatch = icp.titles.some(title => {
        const target = title.toLowerCase();
        return (
            contact.title?.toLowerCase().includes(target) ||
            contact.title_description?.toLowerCase().includes(target)
        );
    });

    if (titleMatch) score += 30;

    // 3. Size/Revenue Match (20 points)
    // This is harder to parse from string ranges, so we do a basic check if data exists
    if (contact.employee_count || contact.annual_revenue) {
        score += 10;
        // Bonus for higher employee counts (assuming B2B target)
        if (contact.employee_count && !contact.employee_count.startsWith('1-10')) {
            score += 10;
        }
    }

    // 4. Data Completeness (10 points)
    if (contact.email) score += 5;
    if (contact.linkedin_url) score += 5;

    // Determine Status based on score
    let status: 'verified' | 'failed' | 'pending' = 'pending';
    if (score >= 70) status = 'verified';
    else if (score < 30) status = 'failed';
    else status = 'pending'; // 30-69 is explicitly pending/medium fit in this simple logic

    return { score, status };
};
