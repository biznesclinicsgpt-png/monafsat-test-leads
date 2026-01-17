
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Contact } from '../../types';

interface CSVImporterProps {
    onImport: (contacts: Partial<Contact>[]) => void;
    onClose: () => void;
}

const AVAILABLE_FIELDS: { key: keyof Contact; label: string }[] = [
    { key: 'name', label: 'Full Name' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company_name', label: 'Company Name' },
    { key: 'title', label: 'Job Title' },
    { key: 'linkedin_url', label: 'LinkedIn URL' },
    { key: 'website', label: 'Website' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'industry_2', label: 'Industry' },
    { key: 'company_linkedin_url', label: 'Company LinkedIn' },
];

export const CSVImporter: React.FC<CSVImporterProps> = ({ onImport, onClose }) => {
    const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [excludeFirstRow, setExcludeFirstRow] = useState(true);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [columnMapping, setColumnMapping] = useState<Record<string, keyof Contact | ''>>({});

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            Papa.parse(file, {
                preview: 6, // Preview first 5 rows + header
                complete: (results) => {
                    if (results.data && results.data.length > 0) {
                        const requestData = results.data as string[][];
                        setCsvHeaders(requestData[0]);
                        setCsvData(requestData.slice(1));
                        setStep('map');

                        // Auto-guess mapping
                        const initialMap: Record<string, keyof Contact | ''> = {};
                        requestData[0].forEach((header) => {
                            const lowerHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
                            const match = AVAILABLE_FIELDS.find(f =>
                                f.label.toLowerCase().replace(/[^a-z0-9]/g, '') === lowerHeader ||
                                f.key.toLowerCase().replace(/_/g, '') === lowerHeader
                            );
                            if (match) {
                                initialMap[header] = match.key;
                            } else {
                                initialMap[header] = '';
                            }
                        });
                        setColumnMapping(initialMap);
                    }
                }
            });
        }
    };

    const handleImport = () => {
        if (!file) return;

        Papa.parse(file, {
            header: true, // Parse with headers for ease
            skipEmptyLines: true,
            complete: (results) => {
                const mappedContacts: Partial<Contact>[] = results.data.map((row: any) => {
                    const contact: Partial<Contact> = {};

                    Object.entries(columnMapping).forEach(([csvHeader, targetField]) => {
                        if (targetField && row[csvHeader]) {
                            // @ts-ignore - dynamic assignment
                            contact[targetField] = row[csvHeader];
                        }
                    });

                    // Basic validation/fallback
                    if (!contact.name && contact.first_name && contact.last_name) {
                        contact.name = `${contact.first_name} ${contact.last_name}`;
                    } else if (!contact.name && contact.first_name) {
                        contact.name = contact.first_name;
                    }

                    return contact;
                }).filter(c => c.email || c.name); // Filter empty rows

                onImport(mappedContacts);
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">
                        {step === 'upload' ? 'Upload Contacts CSV' : 'Map Columns'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {step === 'upload' && (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                            <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                                <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-sm font-medium text-slate-600">Click to upload CSV</span>
                                <span className="text-xs text-slate-400 mt-1">or drag and drop</span>
                                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                            </label>
                        </div>
                    )}

                    {step === 'map' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm">
                                Map your CSV columns to the CRM fields. Unmapped columns will be ignored.
                            </div>

                            <div className="space-y-3">
                                {csvHeaders.map((header) => (
                                    <div key={header} className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg">
                                        <div className="w-1/3">
                                            <div className="text-sm font-bold text-slate-700 truncate" title={header}>{header}</div>
                                            <div className="text-xs text-slate-400 truncate">Example: {csvData[0]?.[csvHeaders.indexOf(header)] || '-'}</div>
                                        </div>

                                        <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>

                                        <div className="flex-1">
                                            <select
                                                className="w-full p-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={columnMapping[header] || ''}
                                                onChange={(e) => setColumnMapping(prev => ({ ...prev, [header]: e.target.value as any }))}
                                            >
                                                <option value="">Do not import</option>
                                                {AVAILABLE_FIELDS.map(field => (
                                                    <option key={field.key} value={field.key}>{field.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">
                        Cancel
                    </button>
                    {step === 'map' && (
                        <button
                            onClick={handleImport}
                            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
                        >
                            Import Leads
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
