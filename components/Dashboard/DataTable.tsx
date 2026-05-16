import React, { useState } from 'react';
import { DashboardTheme } from '../../lib/theme';
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

interface DataTableProps {
    columns: { key: string; label: string; sortable?: boolean }[];
    data: any[];
    title?: string;
    searchable?: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, { bg: string; text: string }> = {
        Active: { bg: '#F0FDFA', text: '#0F766E' }, // Teal
        Pending: { bg: '#FFFBEB', text: '#B45309' }, // Amber
        Inactive: { bg: '#F1F5F9', text: '#64748B' }, // Slate
        Premium: { bg: '#FAF5FF', text: '#7E22CE' }, // Purple
    };

    const style = styles[status] || styles.Inactive;

    return (
        <span
            className="px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: style.bg, color: style.text }}
        >
            {status}
        </span>
    );
};

export const DataTable = ({ columns, data, title, searchable = true }: DataTableProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    // Sorting logic
    const sortedData = React.useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    // Filtering logic
    const filteredData = sortedData.filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div
            className="bg-white rounded-xl border overflow-hidden"
            style={{ borderColor: DashboardTheme.Colors.Neutrals.Border, fontFamily: DashboardTheme.Typography.FontFamily.Sans }}
        >
            {/* Header */}
            <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                {title && (
                    <h2 className="text-lg font-bold" style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>
                        {title}
                    </h2>
                )}

                <div className="flex items-center gap-3">
                    {searchable && (
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-100 transition-all w-full sm:w-64"
                                style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}
                            />
                        </div>
                    )}
                    <button className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                                    style={{ color: DashboardTheme.Colors.Neutrals.TextSecondary }}
                                    onClick={() => col.sortable && requestSort(col.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        {col.sortable && (
                                            <ArrowUpDown size={14} className={`text-gray-400 ${sortConfig?.key === col.key ? 'text-blue-500' : 'opacity-0 group-hover:opacity-100'}`} />
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{ divideColor: DashboardTheme.Colors.Neutrals.Border }}>
                        {filteredData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-4">
                                        {col.key === 'status' ? (
                                            <StatusBadge status={row[col.key]} />
                                        ) : (
                                            <span style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>{row[col.key]}</span>
                                        )}
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1 rounded hover:bg-slate-100 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                <span>Showing {filteredData.length} entries</span>
                <div className="flex items-center gap-2">
                    <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="p-1 rounded hover:bg-slate-100">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
