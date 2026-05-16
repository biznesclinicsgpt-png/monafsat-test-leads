/**
 * Lead Table Component
 *
 * Reusable table for displaying leads with:
 * - Column customization
 * - Sorting and filtering
 * - Selection for bulk actions
 * - ICP status indicators
 */

import React, { useState, useMemo } from 'react';
import { Icons } from '@/constants';

export interface LeadRow {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  email?: string | null;
  email_status?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
  company_name?: string | null;
  title_normalized?: string | null;
  industry?: string | null;
  country?: string | null;
  icp_status?: 'Yes' | 'No' | 'Unknown' | null;
  icp_fit_score?: number | null;
  icp_tier?: string | null;
  pipeline_stage?: number;
  [key: string]: any;
}

interface Column {
  key: string;
  label: string;
  label_ar: string;
  width?: string;
  render?: (value: any, row: LeadRow) => React.ReactNode;
}

interface LeadTableProps {
  leads: LeadRow[];
  columns?: Column[];
  onSelect?: (selected: string[]) => void;
  onRowClick?: (lead: LeadRow) => void;
  selectedIds?: string[];
  loading?: boolean;
  emptyMessage?: string;
}

const DEFAULT_COLUMNS: Column[] = [
  {
    key: 'full_name',
    label: 'Name',
    label_ar: 'الاسم',
    render: (_, row) => (
      <div>
        <p className="font-bold text-slate-900">
          {row.full_name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || '-'}
        </p>
        {row.title_normalized && (
          <p className="text-xs text-slate-500">{row.title_normalized}</p>
        )}
      </div>
    ),
  },
  {
    key: 'company_name',
    label: 'Company',
    label_ar: 'الشركة',
    render: (value, row) => (
      <div>
        <p className="text-slate-800">{value || '-'}</p>
        {row.industry && (
          <p className="text-xs text-slate-500">{row.industry}</p>
        )}
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    label_ar: 'البريد',
    render: (value, row) => (
      <div className="flex items-center gap-2">
        {value ? (
          <>
            <span className="text-sm text-slate-700">{value}</span>
            <StatusBadge status={row.email_status} />
          </>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </div>
    ),
  },
  {
    key: 'icp_status',
    label: 'ICP',
    label_ar: 'التوافق',
    width: '100px',
    render: (value, row) => <ICPBadge status={value} score={row.icp_fit_score} />,
  },
  {
    key: 'pipeline_stage',
    label: 'Stage',
    label_ar: 'المرحلة',
    width: '80px',
    render: (value) => <StageBadge stage={value} />,
  },
];

// Status Badge Component
const StatusBadge: React.FC<{ status?: string | null }> = ({ status }) => {
  const colors: Record<string, string> = {
    valid: 'bg-green-100 text-green-700',
    invalid: 'bg-red-100 text-red-700',
    risky: 'bg-yellow-100 text-yellow-700',
    unknown: 'bg-slate-100 text-slate-500',
    catch_all: 'bg-orange-100 text-orange-700',
  };

  if (!status) return null;

  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${colors[status] || colors.unknown}`}>
      {status}
    </span>
  );
};

// ICP Badge Component
const ICPBadge: React.FC<{ status?: string | null; score?: number | null }> = ({ status, score }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    Yes: { bg: 'bg-green-100', text: 'text-green-700' },
    No: { bg: 'bg-red-100', text: 'text-red-700' },
    Unknown: { bg: 'bg-slate-100', text: 'text-slate-500' },
  };

  const color = colors[status || 'Unknown'] || colors.Unknown;

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${color.bg} ${color.text}`}>
        {status || '-'}
      </span>
      {score !== null && score !== undefined && (
        <span className="text-xs text-slate-500 font-medium">{score}</span>
      )}
    </div>
  );
};

// Stage Badge Component
const StageBadge: React.FC<{ stage?: number }> = ({ stage }) => {
  const stageNames: Record<number, string> = {
    0: 'مصدر',
    1: 'تطبيع',
    2: 'إثراء',
    3: 'بوابة',
    4: 'تقييم',
    5: 'تواصل',
    6: 'حملة',
  };

  if (stage === undefined) return <span className="text-slate-400">-</span>;

  return (
    <div className="flex items-center gap-1">
      <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
        {stage}
      </span>
      <span className="text-xs text-slate-500">{stageNames[stage]}</span>
    </div>
  );
};

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  columns = DEFAULT_COLUMNS,
  onSelect,
  onRowClick,
  selectedIds = [],
  loading = false,
  emptyMessage = 'لا توجد بيانات',
}) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedLeads = useMemo(() => {
    if (!sortKey) return leads;

    return [...leads].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [leads, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      onSelect?.([]);
    } else {
      onSelect?.(leads.map((l) => l.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect?.(selectedIds.filter((s) => s !== id));
    } else {
      onSelect?.([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-500">جاري التحميل...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <Icons.Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {onSelect && (
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === leads.length && leads.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-4 text-right font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                  style={{ width: col.width }}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label_ar}
                    {sortKey === col.key && (
                      <Icons.ChevronDown
                        className={`w-4 h-4 transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedLeads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onRowClick?.(lead)}
                className={`
                  hover:bg-slate-50 transition-colors
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${selectedIds.includes(lead.id) ? 'bg-brand-50' : ''}
                `}
              >
                {onSelect && (
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="p-4">
                    {col.render ? col.render(lead[col.key], lead) : lead[col.key] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
