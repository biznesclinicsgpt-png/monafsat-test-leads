import { PersonEntity, CompanyEntity, FieldMapping } from '@/types/data-center';

// Canonical Field Definitions
export const CANONICAL_FIELDS = {
    person: [
        { key: 'fullName', label: 'Full Name', aliases: ['name', 'full name', 'person name'] },
        { key: 'email', label: 'Email', aliases: ['email', 'email address', 'contact email'] },
        { key: 'phone', label: 'Phone', aliases: ['phone', 'mobile', 'cell', 'phone number'] },
        { key: 'title', label: 'Job Title', aliases: ['title', 'job title', 'position', 'role'] },
        { key: 'companyName', label: 'Company', aliases: ['company', 'company name', 'organization'] },
        { key: 'linkedinUrl', label: 'LinkedIn', aliases: ['linkedin', 'linkedin url', 'profile url'] },
        { key: 'location', label: 'Location', aliases: ['location', 'city', 'country', 'region'] }
    ]
};

export const suggestMapping = (headers: string[]): Record<string, string> => {
    const mapping: Record<string, string> = {};

    headers.forEach(header => {
        const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Find best match
        const match = CANONICAL_FIELDS.person.find(field => {
            return field.aliases.some(alias => {
                const normalizedAlias = alias.replace(/[^a-z0-9]/g, '');
                return normalized === normalizedAlias || normalized.includes(normalizedAlias);
            });
        });

        if (match) {
            mapping[header] = match.key;
        }
    });

    return mapping;
};

export const applyMapping = (row: any, mapping: Record<string, string>): Partial<PersonEntity & { companyName?: string }> => {
    const entity: any = {};

    Object.entries(mapping).forEach(([sourceKey, targetKey]) => {
        const value = row[sourceKey];
        if (value) {
            entity[targetKey] = value;
        }
    });

    return entity;
};
