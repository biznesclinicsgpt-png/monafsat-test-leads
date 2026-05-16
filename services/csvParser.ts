import Papa from 'papaparse';

export interface ParseResult {
    data: any[];
    errors: any[];
    meta: any;
}

export const parseCSV = (file: File): Promise<ParseResult> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results as ParseResult);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};

export const normalizeColumnName = (name: string): string => {
    return name.toLowerCase().trim().replace(/[\s\W]+/g, '_');
};
