
// Since this is a client-side prototype first, we'll simulate the API call for now.
// Real implementation would be a Vercel Function.

import { v4 as uuidv4 } from 'uuid';
import { ParseResult } from '@/services/csvParser';
import { ImportJob, StagingRow } from '@/types/data-center';

export const processIngest = async (
    parsedData: ParseResult,
    sourceType: string
): Promise<{ job: ImportJob, rows: StagingRow[] }> => {

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const jobId = uuidv4();
    const timestamp = new Date().toISOString();

    const job: ImportJob = {
        id: jobId,
        status: 'pending',
        rowCountInput: parsedData.data.length,
        rowCountAccepted: parsedData.data.length,
        rowCountRejected: 0,
        rowCountEnriched: 0,
        createdBy: 'user_current',
        createdAt: timestamp
    };

    const rows: StagingRow[] = parsedData.data.map((row: any) => ({
        id: uuidv4(),
        importJobId: jobId,
        rawJson: row,
        rowStatus: 'new',
        createdAt: timestamp,
        updatedAt: timestamp
    }));

    return { job, rows };
};
