
// ==========================================
// DATA CENTER MODULE TYPES
// ==========================================

export type SourceType = 'csv' | 'apollo' | 'salesnav' | 'clay' | 'webhook';
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type RowStatus = 'new' | 'validated' | 'enriched' | 'rejected' | 'synced';

// 1. Definitions / Config
// -----------------------

export interface ICPProfile {
    id: string;
    name: string;

    targetIndustries: number[]; // taxonomy_ids
    companySizeMin?: number;
    companySizeMax?: number;
    geos: string[]; // country/city

    personas?: {
        titles: string[];
        seniority: string[];
        departments: string[];
    };

    exclusions?: {
        industries?: string[];
        titles?: string[];
        domains?: string[];
    };

    signalWeights?: Record<string, number>;
    scoringWeights?: Record<string, number>;

    status: 'active' | 'archived';
    createdAt: string;
    updatedAt: string;
}

export interface SourceConnector {
    id: string;
    type: SourceType;
    name: string;
    authRef?: string;
    rateLimits?: {
        requestsPerMinute: number;
        dailyLimit: number;
    };
    status: 'active' | 'inactive';
}

export interface RecipeStep {
    id: string;
    type: 'validate' | 'dedupe' | 'enrich' | 'verify' | 'score' | 'segment' | 'sync';
    provider?: string;
    config?: Record<string, any>;
}

export interface Recipe {
    id: string;
    name: string;
    type: 'find_people' | 'find_companies' | 'enrich' | 'verify';
    steps: RecipeStep[];
    version: number;
    status: 'active' | 'archived';
}

export interface FieldMapping {
    id: string;
    sourceType: string;
    mappingName: string;
    mappings: Record<string, string>; // "Source Field" -> "canonicalField"
    transforms?: Record<string, string>; // "field" -> "transform_function"
    validations?: Record<string, string>; // "field" -> "rule"
}

// 2. Operational Data
// -------------------

export interface ImportJob {
    id: string;
    sourceConnectorId?: string;
    recipeId?: string;
    icpProfileId?: string;
    providerProfileId?: string;

    status: ImportStatus;
    startedAt?: string;
    finishedAt?: string;

    rowCountInput: number;
    rowCountAccepted: number;
    rowCountRejected: number;
    rowCountEnriched: number;

    createdBy: string;
    createdAt: string;
}

export interface StagingRow {
    id: string;
    importJobId: string;

    rawJson: Record<string, any>;
    normalizedJson?: Record<string, any>;

    dedupeKey?: string;
    rowStatus: RowStatus;
    rejectionReason?: string;

    personId?: string;
    companyId?: string;

    createdAt: string;
    updatedAt: string;
}

// 3. Canonical Entities
// ---------------------

export interface PersonEntity {
    id: string;

    fullName?: string;
    firstName?: string;
    lastName?: string;

    email?: string;
    emails: string[];

    phone?: string;
    phones: string[];

    linkedinUrl?: string;
    linkedinId?: string;

    title?: string;
    seniority?: string;
    department?: string;

    locationCity?: string;
    locationCountry?: string;

    languages: string[];

    verificationStatus?: 'verified' | 'risky' | 'invalid';

    sourceProvider?: string;
    sourceRecordId?: string;

    firstSeenAt: string;
    lastSeenAt: string;
}

export interface CompanyEntity {
    id: string;

    companyName: string;
    domain?: string;
    linkedinUrl?: string;
    linkedinId?: string;

    industryTaxonomyId?: number;
    employeeCountRange?: string;

    locationCity?: string;
    locationCountry?: string;

    techStack?: string[];
    signalsSummary?: Record<string, any>;

    sourceProvider?: string;

    firstSeenAt: string;
    lastSeenAt: string;
}
