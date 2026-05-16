/**
 * Database Page
 *
 * Master database browser for all leads
 *
 * Features:
 * - Search and filter
 * - Lead details view
 * - Bulk actions
 * - Export functionality
 */

import React, { useState } from 'react';
import { Icons } from '@/constants';
import { LeadTable, LeadRow } from '@/components/DataCenter/LeadTable';

const DatabasePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);

  // Filters state
  const [filters, setFilters] = useState({
    icp_status: [] as string[],
    icp_tier: [] as string[],
    pipeline_stage: [] as number[],
    has_email: false,
    has_phone: false,
  });

  // Mock data
  const mockLeads: LeadRow[] = [
    {
      id: '1',
      first_name: 'محمد',
      last_name: 'العمري',
      full_name: 'محمد العمري',
      email: 'mohammed@example.com',
      email_status: 'valid',
      phone: '+966 5XX XXX XX01',
      linkedin_url: 'linkedin.com/in/mohammed',
      company_name: 'شركة التقنية',
      title_normalized: 'CEO',
      industry: 'تقنية المعلومات',
      country: 'SA',
      icp_status: 'Yes',
      icp_fit_score: 92,
      icp_tier: 'VIP',
      pipeline_stage: 5,
    },
    {
      id: '2',
      first_name: 'سارة',
      last_name: 'الحربي',
      full_name: 'سارة الحربي',
      email: 'sara@example.com',
      email_status: 'valid',
      phone: null,
      linkedin_url: 'linkedin.com/in/sara',
      company_name: 'مؤسسة النجاح',
      title_normalized: 'Marketing Director',
      industry: 'التسويق',
      country: 'SA',
      icp_status: 'Yes',
      icp_fit_score: 78,
      icp_tier: 'Priority',
      pipeline_stage: 4,
    },
    {
      id: '3',
      first_name: 'أحمد',
      last_name: 'القحطاني',
      full_name: 'أحمد القحطاني',
      email: 'ahmed@example.com',
      email_status: 'risky',
      phone: '+966 5XX XXX XX03',
      linkedin_url: null,
      company_name: 'شركة البناء',
      title_normalized: 'Project Manager',
      industry: 'المقاولات',
      country: 'SA',
      icp_status: 'No',
      icp_fit_score: 35,
      icp_tier: 'Low',
      pipeline_stage: 3,
    },
    {
      id: '4',
      first_name: 'خالد',
      last_name: 'المطيري',
      full_name: 'خالد المطيري',
      email: null,
      email_status: null,
      phone: null,
      linkedin_url: 'linkedin.com/in/khaled',
      company_name: 'مجموعة الأعمال',
      title_normalized: 'Sales Manager',
      industry: 'التجارة',
      country: 'SA',
      icp_status: 'Unknown',
      icp_fit_score: null,
      icp_tier: null,
      pipeline_stage: 1,
    },
  ];

  // Stats
  const stats = {
    total: 15420,
    icp_yes: 8750,
    has_email: 5400,
    has_phone: 980,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">قاعدة البيانات</h2>
          <p className="text-slate-500 mt-1">جميع السجلات المخزنة في مركز البيانات</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 flex items-center gap-2">
            <Icons.Filter className="w-4 h-4" />
            تصدير
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatMini label="إجمالي السجلات" value={stats.total.toLocaleString()} />
        <StatMini label="ICP متوافق" value={stats.icp_yes.toLocaleString()} color="text-green-600" />
        <StatMini label="لديهم بريد" value={stats.has_email.toLocaleString()} color="text-blue-600" />
        <StatMini label="لديهم هاتف" value={stats.has_phone.toLocaleString()} color="text-purple-600" />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Icons.Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم، البريد، الشركة..."
              className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              filterOpen ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Icons.Filter className="w-4 h-4" />
            الفلاتر
          </button>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-4 gap-4">
            {/* ICP Status */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">حالة ICP</label>
              <div className="space-y-2">
                {['Yes', 'No', 'Unknown'].map((status) => (
                  <label key={status} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-slate-600">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ICP Tier */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">التصنيف</label>
              <div className="space-y-2">
                {['VIP', 'Priority', 'Standard', 'Low'].map((tier) => (
                  <label key={tier} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-slate-600">{tier}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pipeline Stage */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">المرحلة</label>
              <div className="space-y-2">
                {[
                  { stage: 1, label: 'تطبيع' },
                  { stage: 2, label: 'إثراء' },
                  { stage: 3, label: 'ICP' },
                  { stage: 5, label: 'تواصل' },
                  { stage: 6, label: 'حملة' },
                ].map(({ stage, label }) => (
                  <label key={stage} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-slate-600">{stage} - {label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">معلومات التواصل</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span className="text-sm text-slate-600">لديه بريد</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span className="text-sm text-slate-600">لديه هاتف</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span className="text-sm text-slate-600">لديه لينكد إن</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-brand-50 border border-brand rounded-xl p-4 flex items-center justify-between">
          <span className="font-bold text-brand">
            {selectedIds.length} سجل محدد
          </span>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white text-brand rounded-lg font-medium border border-brand hover:bg-brand hover:text-white transition-colors">
              تصدير المحدد
            </button>
            <button className="px-4 py-2 bg-white text-brand rounded-lg font-medium border border-brand hover:bg-brand hover:text-white transition-colors">
              إثراء المحدد
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 text-slate-600 hover:text-slate-900"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <LeadTable
        leads={mockLeads}
        onSelect={setSelectedIds}
        selectedIds={selectedIds}
        onRowClick={(lead) => setSelectedLead(lead)}
      />

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">تفاصيل السجل</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Lead Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-2xl font-bold text-brand">
                  {selectedLead.first_name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{selectedLead.full_name}</h4>
                  <p className="text-slate-500">{selectedLead.title_normalized} @ {selectedLead.company_name}</p>
                </div>
                <div className="mr-auto flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    selectedLead.icp_status === 'Yes' ? 'bg-green-100 text-green-700' :
                    selectedLead.icp_status === 'No' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    ICP: {selectedLead.icp_status}
                  </span>
                  {selectedLead.icp_fit_score && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                      {selectedLead.icp_fit_score}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">البريد الإلكتروني</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    {selectedLead.email || '-'}
                    {selectedLead.email_status && (
                      <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                        selectedLead.email_status === 'valid' ? 'bg-green-100 text-green-700' :
                        selectedLead.email_status === 'risky' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {selectedLead.email_status}
                      </span>
                    )}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">الهاتف</p>
                  <p className="font-medium text-slate-900">{selectedLead.phone || '-'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">لينكد إن</p>
                  <p className="font-medium text-slate-900">{selectedLead.linkedin_url || '-'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">الدولة</p>
                  <p className="font-medium text-slate-900">{selectedLead.country || '-'}</p>
                </div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">الشركة</p>
                  <p className="font-medium text-slate-900">{selectedLead.company_name || '-'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">القطاع</p>
                  <p className="font-medium text-slate-900">{selectedLead.industry || '-'}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">
                تعديل
              </button>
              <button className="px-4 py-2 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark">
                إثراء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mini Stat
const StatMini: React.FC<{ label: string; value: string; color?: string }> = ({
  label,
  value,
  color = 'text-slate-900',
}) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

export default DatabasePage;
