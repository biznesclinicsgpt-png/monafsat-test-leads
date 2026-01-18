import { Contact, ProviderICP, PipelineStage, ProviderProfile } from '../types';

export const calculateFitScore = (
    contact: Contact,
    icp: ProviderICP,
    profile?: ProviderProfile | null
): { score: number; status: 'verified' | 'failed' | 'pending' } => {

    // 0. Priority: Profile Strategy
    let profileScore = 0;
    if (profile) {
        // A. Basic Text Match
        const targetText = [
            profile.target_audience,
            profile.value_proposition,
            ...(profile.industries?.map(i => typeof i === 'string' ? i : '') || [])
        ].join(' ').toLowerCase();

        // Bonus for Strategy Text Match
        if (targetText.length > 5 && contact.title && targetText.includes(contact.title.toLowerCase())) profileScore += 10;
        if (targetText.length > 5 && contact.industry_ar && targetText.includes(contact.industry_ar.toLowerCase())) profileScore += 10;

        // B. Visual Strategy Match (Phase 7 Activation)
        if (profile.icp_structured) {
            // 1. Decision Maker Match (+25) - High Priority
            const isDecisionMaker = profile.icp_structured.decision_makers?.some(role =>
                contact.title?.toLowerCase().includes(role.toLowerCase())
            );
            if (isDecisionMaker) profileScore += 25;

            // 2. Company Size Match (+15)
            const isSizeMatch = profile.icp_structured.company_size_ideal?.some(size =>
                contact.employee_count === size || contact.employee_count?.includes(size)
            );
            if (isSizeMatch) profileScore += 15;

            // 3. Pain Point Relevancy (+10) 
            // (If their industry/description hints at the pain point keywords - simpler check)
            const painKeywords = profile.icp_structured.pain_points?.join(' ').toLowerCase();
            if (painKeywords && contact.company_description && painKeywords.split(' ').some(w => w.length > 4 && contact.company_description?.toLowerCase().includes(w))) {
                profileScore += 10;
            }
        }
    }

    if (!icp.isSet && profileScore === 0) {
        return { score: 0, status: 'pending' };
    }

    let score = profileScore;
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
