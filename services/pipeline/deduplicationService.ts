import { PersonEntity } from '@/types/data-center';

// Mock CRM Data (In real app, this queries the DB)
const EXISTING_CONTACTS = [
    'ahmed@construction-sa.com',
    'ceo@competitor.com'
];

export interface DedupeResult {
    isDuplicate: boolean;
    duplicateReason?: string;
}

export const checkDuplicates = async (person: Partial<PersonEntity>): Promise<DedupeResult> => {
    // Simulate DB latency
    await new Promise(resolve => setTimeout(resolve, 50));

    // 1. Check Email
    if (person.email && EXISTING_CONTACTS.includes(person.email.toLowerCase())) {
        return { isDuplicate: true, duplicateReason: 'Email already exists in CRM' };
    }

    // 2. Fuzzy Name Check (Simulated)
    // In reality: Check if Name + Company similar exists

    return { isDuplicate: false };
};
