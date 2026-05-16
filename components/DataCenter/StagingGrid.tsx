import React, { useState, useEffect } from 'react';
import { Icons } from '@/constants';
import { StagingRow } from '@/types/data-center';
import LeadDetailTables from './LeadDetailTables';

interface StagingGridProps {
    rows: StagingRow[];
    loading?: boolean;
    onEdit?: (row: StagingRow) => void;
    selectedIds?: Set<string>;
    onSelectionChange?: (selectedIds: Set<string>) => void;
}

const StagingGrid: React.FC<StagingGridProps> = ({ rows, loading, onEdit, selectedIds: externalSelectedIds, onSelectionChange }) => {
    const [selectedLead, setSelectedLead] = useState<StagingRow | null>(null);
    const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());

    // استخدام الـ selectedIds من الخارج إذا كانت متوفرة
    const selectedIds = externalSelectedIds || internalSelectedIds;
    const setSelectedIds = onSelectionChange || setInternalSelectedIds;

    // تحديث الاختيار عند تغيير الصفوف
    useEffect(() => {
        // إزالة أي IDs غير موجودة في الصفوف الحالية
        const validIds = new Set(rows.map(r => r.id));
        const newSelected = new Set([...selectedIds].filter(id => validIds.has(id)));
        if (newSelected.size !== selectedIds.size) {
            setSelectedIds(newSelected);
        }
    }, [rows]);

    // تحديد/إلغاء تحديد صف واحد
    const toggleRowSelection = (rowId: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(rowId)) {
            newSelected.delete(rowId);
        } else {
            newSelected.add(rowId);
        }
        setSelectedIds(newSelected);
    };

    // تحديد/إلغاء تحديد الكل
    const toggleSelectAll = () => {
        if (selectedIds.size === rows.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(rows.map(r => r.id)));
        }
    };

    // تحديد حسب الحالة
    const selectByStatus = (status: string) => {
        const filtered = rows.filter(r => r.rowStatus === status);
        setSelectedIds(new Set(filtered.map(r => r.id)));
    };

    if (loading) {
        return <div className="p-10 text-center text-slate-500">جاري تحميل البيانات...</div>;
    }

    if (!rows || rows.length === 0) {
        return (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                <Icons.Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">لا توجد بيانات حالياً. قم باستيراد ملف للبدء.</p>
            </div>
        );
    }

    // Extract headers from the first row's rawJson for dynamic columns
    // Filter out columns that have no data in valid rows AND filter out boolean-only columns
    const allHeaders = Object.keys(rows[0]?.rawJson || {});
    const headers = allHeaders.filter(header => {
        // Check if ANY row has a meaningful (non-boolean, non-empty) value for this header
        return rows.some(row => {
            const val = row.rawJson[header];
            // Exclude null, undefined, empty strings, N/A
            if (val === null || val === undefined || val === '' || val === 'N/A' || val === 'n/a') return false;
            // Exclude boolean values
            if (typeof val === 'boolean') return false;
            // Exclude string "true" or "false"
            if (typeof val === 'string' && (val.toLowerCase() === 'true' || val.toLowerCase() === 'false')) return false;
            return true;
        });
    });

    // Count total fields per row (for showing data richness)
    const countFields = (row: StagingRow): number => {
        let count = 0;
        const allData = { ...row.rawJson, ...row.normalizedJson };
        Object.values(allData).forEach(val => {
            if (val !== null && val !== undefined && val !== '' && val !== 'N/A' && typeof val !== 'boolean') {
                count++;
            }
        });
        return count;
    };

    const isAllSelected = rows.length > 0 && selectedIds.size === rows.length;
    const isSomeSelected = selectedIds.size > 0 && selectedIds.size < rows.length;

    // إحصائيات الحالات
    const statusCounts = rows.reduce((acc, row) => {
        acc[row.rowStatus] = (acc[row.rowStatus] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {/* Summary Bar */}
                <div className="bg-gradient-to-l from-brand-50 to-indigo-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-700">
                            <span className="text-brand font-bold">{rows.length}</span> عميل محتمل
                        </span>
                        {selectedIds.size > 0 && (
                            <>
                                <span className="text-slate-300">|</span>
                                <span className="text-sm font-medium text-indigo-600">
                                    <span className="font-bold">{selectedIds.size}</span> محدد
                                </span>
                            </>
                        )}
                        <span className="text-slate-300">|</span>
                        <span className="text-sm text-slate-500">
                            <span className="font-medium">{headers.length}</span> عمود معروض
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Quick selection buttons */}
                        {statusCounts.new > 0 && (
                            <button
                                onClick={() => selectByStatus('new')}
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                            >
                                الجدد ({statusCounts.new})
                            </button>
                        )}
                        {statusCounts.enriched > 0 && (
                            <button
                                onClick={() => selectByStatus('enriched')}
                                className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                            >
                                المثراة ({statusCounts.enriched})
                            </button>
                        )}
                        {statusCounts.rejected > 0 && (
                            <button
                                onClick={() => selectByStatus('rejected')}
                                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            >
                                المرفوضة ({statusCounts.rejected})
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                                {/* Checkbox Header */}
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        ref={(el) => {
                                            if (el) el.indeterminate = isSomeSelected;
                                        }}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand cursor-pointer"
                                    />
                                </th>
                                <th className="p-4 w-10">#</th>
                                <th className="p-4 w-24">الحالة</th>
                                <th className="p-4 w-20">البيانات</th>
                                {headers.slice(0, 6).map((header) => (
                                    <th key={header} className="p-4 whitespace-nowrap">{header}</th>
                                ))}
                                <th className="p-4 w-48">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.map((row, index) => {
                                const fieldCount = countFields(row);
                                const isSelected = selectedIds.has(row.id);
                                return (
                                    <tr
                                        key={row.id}
                                        className={`hover:bg-slate-50 transition-colors group cursor-pointer ${
                                            isSelected ? 'bg-indigo-50/50' : ''
                                        }`}
                                        onClick={() => toggleRowSelection(row.id)}
                                    >
                                        {/* Checkbox */}
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleRowSelection(row.id)}
                                                className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand cursor-pointer"
                                            />
                                        </td>
                                        <td className="p-4 text-slate-400 text-xs">
                                            {index + 1}
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={row.rowStatus} />
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                fieldCount > 20 ? 'bg-green-100 text-green-700' :
                                                fieldCount > 10 ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {fieldCount} حقل
                                            </span>
                                        </td>
                                        {headers.slice(0, 6).map((header) => (
                                            <td
                                                key={`${row.id}-${header}`}
                                                className="p-4 text-slate-600 truncate max-w-[180px]"
                                                title={String(row.rawJson[header] || '')}
                                            >
                                                {renderCellValue(row.rawJson[header])}
                                            </td>
                                        ))}
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedLead(row)}
                                                    className="text-white bg-brand hover:bg-brand-dark font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs shadow-sm"
                                                >
                                                    <Icons.Eye className="w-3.5 h-3.5" />
                                                    عرض الكل
                                                </button>
                                                <button
                                                    onClick={() => onEdit && onEdit(row)}
                                                    className="text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                                                >
                                                    <Icons.Edit className="w-3.5 h-3.5" />
                                                    تعديل
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer with info */}
                {headers.length > 6 && (
                    <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-xs text-amber-700 flex items-center gap-2">
                        <Icons.AlertCircle className="w-4 h-4" />
                        يوجد {headers.length - 6} عمود إضافي غير معروض. اضغط على "عرض الكل" لمشاهدة جميع البيانات.
                    </div>
                )}
            </div>

            {/* Lead Detail Modal */}
            {selectedLead && (
                <LeadDetailTables
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </>
    );
};

// Helper function to render cell values with proper formatting
const renderCellValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined || value === '' || value === 'N/A') {
        return <span className="text-slate-300">—</span>;
    }

    if (typeof value === 'boolean') {
        return <span className="text-slate-300">—</span>;
    }

    const strValue = String(value);

    // Truncate long values
    if (strValue.length > 40) {
        return strValue.substring(0, 40) + '...';
    }

    // URLs - show as link icon
    if (strValue.startsWith('http')) {
        return (
            <a
                href={strValue}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-dark inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
            >
                <Icons.ExternalLink className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{strValue.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </a>
        );
    }

    return strValue;
};

const StatusBadge = ({ status }: { status: string }) => {
    // Map English DB status to Arabic Label
    const labels: Record<string, string> = {
        new: 'جديد',
        validated: 'تم التحقق',
        enriched: 'تم الإثراء',
        synced: 'تم الربط',
        rejected: 'مرفوض',
    };

    const styles: Record<string, string> = {
        new: 'bg-blue-50 text-blue-700',
        validated: 'bg-purple-50 text-purple-700',
        enriched: 'bg-indigo-50 text-indigo-700',
        synced: 'bg-green-50 text-green-700',
        rejected: 'bg-red-50 text-red-700',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
            {labels[status] || status}
        </span>
    );
};

export default StagingGrid;
