import { ProviderProfile } from '@/types';
import { ICPProfile } from '@/types/data-center';

// Taxonomy Mappings (Mock - in real app, fetch from DB)
const INDUSTRY_MAPPING: Record<string, number> = {
    'Technology': 101,
    'Construction': 102,
    'Marketing': 103,
    'Finance': 104,
    'Consulting': 105,
};

const TITLE_MAPPING: Record<string, string[]> = {
    'Software Development': ['CTO', 'VP Engineering', 'Product Manager'],
    'Marketing Services': ['CMO', 'Marketing Director', 'Brand Manager'],
    'Legal Services': ['General Counsel', 'Legal Director'],
    'HR Services': ['CHRO', 'HR Director', 'Talent Acquisition Manager'],
};

export const generateICPFromProvider = (provider: ProviderProfile): ICPProfile => {
    // 1. Map Industries
    const targetIndustries: number[] = [];
    provider.industries.forEach(ind => {
        // Simple fuzzy match or lookup
        // In reality, use the ID directly if it matches the centralized taxonomy
        const mappedId = INDUSTRY_MAPPING[ind.name] || 999; // 999 = Other
        if (!targetIndustries.includes(mappedId)) {
            targetIndustries.push(mappedId);
        }
    });

    // 2. Map Titles based on Service Lines
    let targetTitles: string[] = [];
    provider.service_lines.forEach(service => {
        const titles = TITLE_MAPPING[service.name] || ['CEO', 'Owner']; // Default to decision makers
        targetTitles = [...new Set([...targetTitles, ...titles])];
    });

    // 3. Map Company Size (from simple logic or ideal_client_description)
    // For now, default to SMB/Mid-Market unless specified
    const sizeMin = provider.min_project_size && provider.min_project_size > 50000 ? 50 : 10;
    const sizeMax = provider.max_project_size && provider.max_project_size > 500000 ? 1000 : 200;

    // 4. Construct ICP Profile
    const icpProfile: ICPProfile = {
        id: `icp_${provider.id}`, // Temporary ID
        name: `Pack for ${provider.company_name}`,
        targetIndustries,
        companySizeMin: sizeMin,
        companySizeMax: sizeMax,
        geos: provider.service_locations || ['Saudi Arabia'], // Default
        personas: {
            titles: targetTitles,
            seniority: ['Director', 'VP', 'C-Level'],
            departments: []
        },
        exclusions: {
            industries: [],
            titles: ['Student', 'Intern', 'Freelancer'],
            domains: ['gmail.com', 'yahoo.com', 'hotmail.com']
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return icpProfile;
};
