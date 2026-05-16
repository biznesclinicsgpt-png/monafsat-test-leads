/**
 * ICP Gate Page
 *
 * Stage 3-4: ICP Verify + Scoring
 *
 * Features:
 * - ICP rule configuration
 * - Lead verification status
 * - Scoring breakdown
 * - Tier distribution
 */

import React, { useState } from 'react';
import { Icons } from '@/constants';

interface ICPRule {
  id: string;
  field: string;
  field_ar: string;
  operator: 'equals' | 'contains' | 'in' | 'gte' | 'lte' | 'range';
  value: string | string[] | number[];
  weight: number;
  enabled: boolean;
}

const ICPPage = () => {
  const [activeTab, setActiveTab] = useState<'verify' | 'scoring' | 'rules'>('verify');

  // Mock ICP rules from provider profile
  const icpRules: ICPRule[] = [
    { id: '1', field: 'industry', field_ar: 'القطاع', operator: 'in', value: ['تقنية', 'مقاولات', 'عقارات'], weight: 25, enabled: true },
    { id: '2', field: 'company_size', field_ar: 'حجم الشركة', operator: 'in', value: ['50-200', '200-500', '500+'], weight: 20, enabled: true },
    { id: '3', field: 'seniority_level', field_ar: 'المستوى الوظيفي', operator: 'in', value: ['C-Level', 'VP', 'Director'], weight: 25, enabled: true },
    { id: '4', field: 'country', field_ar: 'الدولة', operator: 'in', value: ['SA', 'AE', 'KW'], weight: 15, enabled: true },
    { id: '5', field: 'has_linkedin', field_ar: 'لينكد إن', operator: 'equals', value: 'true', weight: 15, enabled: true },
  ];

  // Stats
  const stats = {
    total: 12300,
    verified: 10500,
    yes: 8750,
    no: 4200,
    unknown: 2470,
    vip: 1200,
    priority: 2800,
    standard: 3500,
    low: 1250,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-bold">3-4</span>
            بوابة ICP والتقييم
          </h2>
          <p className="text-slate-500 mt-1">التحقق من توافق العملاء مع الملف المثالي وتقييمهم</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-500/20">
            <Icons.Shield className="w-4 h-4" />
            تشغيل التحقق
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 inline-flex">
        {[
          { id: 'verify', label: 'التحقق', icon: Icons.Shield },
          { id: 'scoring', label: 'التقييم', icon: Icons.Star },
          { id: 'rules', label: 'القواعد', icon: Icons.Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${activeTab === tab.id ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'}
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Verify Tab */}
      {activeTab === 'verify' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="إجمالي السجلات" value={stats.total.toLocaleString()} color="bg-slate-500" />
            <StatCard title="متوافق (Yes)" value={stats.yes.toLocaleString()} color="bg-green-500" percentage={Math.round(stats.yes / stats.total * 100)} />
            <StatCard title="غير متوافق (No)" value={stats.no.toLocaleString()} color="bg-red-500" percentage={Math.round(stats.no / stats.total * 100)} />
            <StatCard title="غير محدد (Unknown)" value={stats.unknown.toLocaleString()} color="bg-slate-400" percentage={Math.round(stats.unknown / stats.total * 100)} />
          </div>

          {/* Distribution Visualization */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">توزيع حالة ICP</h3>
            <div className="flex h-12 rounded-xl overflow-hidden">
              <div
                className="bg-green-500 flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${stats.yes / stats.total * 100}%` }}
              >
                Yes {Math.round(stats.yes / stats.total * 100)}%
              </div>
              <div
                className="bg-red-500 flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${stats.no / stats.total * 100}%` }}
              >
                No {Math.round(stats.no / stats.total * 100)}%
              </div>
              <div
                className="bg-slate-400 flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${stats.unknown / stats.total * 100}%` }}
              >
                ? {Math.round(stats.unknown / stats.total * 100)}%
              </div>
            </div>
          </div>

          {/* Recent Verifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">أحدث عمليات التحقق</h3>
              <button className="text-sm text-brand font-medium">عرض الكل</button>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { name: 'محمد العمري', company: 'شركة التقنية', status: 'Yes', score: 92 },
                { name: 'سارة الحربي', company: 'مؤسسة النجاح', status: 'Yes', score: 78 },
                { name: 'أحمد القحطاني', company: 'شركة البناء', status: 'No', score: 35 },
                { name: 'خالد المطيري', company: 'مجموعة الأعمال', status: 'Unknown', score: null },
              ].map((lead, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {lead.score !== null && (
                      <span className="text-sm font-bold text-slate-700">{lead.score}</span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      lead.status === 'Yes' ? 'bg-green-100 text-green-700' :
                      lead.status === 'No' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scoring Tab */}
      {activeTab === 'scoring' && (
        <div className="space-y-6">
          {/* Tier Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <TierCard tier="VIP" range="85+" count={stats.vip} color="bg-purple-500" icon="👑" />
            <TierCard tier="Priority" range="70-84" count={stats.priority} color="bg-blue-500" icon="⭐" />
            <TierCard tier="Standard" range="50-69" count={stats.standard} color="bg-amber-500" icon="📋" />
            <TierCard tier="Low" range="<50" count={stats.low} color="bg-slate-400" icon="📉" />
          </div>

          {/* Score Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">توزيع التقييمات</h3>
            <div className="h-48 flex items-end gap-2">
              {[
                { range: '0-10', count: 50 },
                { range: '11-20', count: 80 },
                { range: '21-30', count: 150 },
                { range: '31-40', count: 280 },
                { range: '41-50', count: 720 },
                { range: '51-60', count: 1200 },
                { range: '61-70', count: 1800 },
                { range: '71-80', count: 2100 },
                { range: '81-90', count: 1500 },
                { range: '91-100', count: 420 },
              ].map((bar, i) => {
                const maxCount = 2100;
                const height = (bar.count / maxCount) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-slate-500">{bar.count}</span>
                    <div
                      className={`w-full rounded-t ${
                        i >= 8 ? 'bg-purple-500' :
                        i >= 6 ? 'bg-blue-500' :
                        i >= 4 ? 'bg-amber-500' :
                        'bg-slate-400'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-slate-500 -rotate-45">{bar.range}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score Breakdown Example */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">مثال على تفاصيل التقييم</h3>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">👑</div>
              <div>
                <p className="font-bold text-slate-900">محمد العمري - CEO</p>
                <p className="text-sm text-slate-500">شركة التقنية • تقنية المعلومات</p>
              </div>
              <div className="mr-auto text-left">
                <p className="text-3xl font-bold text-purple-600">92</p>
                <p className="text-xs text-purple-600 font-bold">VIP</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'القطاع: تقنية المعلومات', score: 25, max: 25 },
                { label: 'المستوى: C-Level', score: 25, max: 25 },
                { label: 'حجم الشركة: 200-500', score: 18, max: 20 },
                { label: 'الدولة: السعودية', score: 15, max: 15 },
                { label: 'لينكد إن: متوفر', score: 9, max: 15 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm text-slate-600 w-40">{item.label}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-16 text-left">{item.score}/{item.max}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">قواعد ICP</h3>
                <p className="text-sm text-slate-500">مستمدة من ملف المزود</p>
              </div>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 flex items-center gap-2">
                <Icons.Edit className="w-4 h-4" />
                تعديل
              </button>
            </div>

            <div className="space-y-3">
              {icpRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 border rounded-lg ${rule.enabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => {}}
                        className="w-5 h-5 rounded border-slate-300 text-brand focus:ring-brand"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{rule.field_ar}</p>
                        <p className="text-sm text-slate-500">
                          {rule.operator === 'in' ? 'يشمل: ' : 'يساوي: '}
                          {Array.isArray(rule.value) ? rule.value.join(', ') : rule.value}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="text-xl font-bold text-brand">{rule.weight}</p>
                        <p className="text-xs text-slate-500">وزن</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Icons.Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-bold text-blue-900">إجمالي الأوزان: 100</p>
                <p className="text-sm text-blue-700">يجب أن يساوي مجموع الأوزان 100 للحصول على تقييم دقيق</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card
const StatCard: React.FC<{ title: string; value: string; color: string; percentage?: number }> = ({
  title,
  value,
  color,
  percentage,
}) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {percentage !== undefined && (
        <span className={`px-2 py-1 rounded text-xs font-bold ${color.replace('bg-', 'bg-opacity-20 text-').replace('-500', '-700')}`}>
          {percentage}%
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
  </div>
);

// Tier Card
const TierCard: React.FC<{ tier: string; range: string; count: number; color: string; icon: string }> = ({
  tier,
  range,
  count,
  color,
  icon,
}) => (
  <div className={`rounded-xl p-5 text-white ${color}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs opacity-80">{range}</span>
    </div>
    <h3 className="text-2xl font-bold">{count.toLocaleString()}</h3>
    <p className="text-sm opacity-80">{tier}</p>
  </div>
);

export default ICPPage;
