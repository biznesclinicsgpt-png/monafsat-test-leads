/**
 * Wallet Tab - Admin Only
 *
 * Manage credits, billing, and per-provider cost tracking.
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  RefreshCw,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Settings,
} from 'lucide-react';
import { getAvailableProviders, getUsageStats, type Provider } from '@/services/integrationsService';

// Mock wallet data - In production, this would come from the backend
const mockWalletData = {
  creditBalance: 50000,
  reservedCredits: 500,
  usedThisMonth: 12340,
  monthlyLimit: 100000,
  billingCycle: 'monthly',
  status: 'active' as const,
};

// Cost matrix per provider per action
const COST_MATRIX: Record<string, Record<string, number>> = {
  apollo: { email_enrich: 1, phone_enrich: 1, company_enrich: 0.5, linkedin_enrich: 1, verify: 0.2 },
  prospeo: { email_enrich: 1, phone_enrich: 1.5, linkedin_enrich: 1, verify: 0.3 },
  lemlist: { email_enrich: 0.8, phone_enrich: 1, linkedin_enrich: 0.8, verify: 0.2 },
  hunter: { email_enrich: 1, verify: 0.5 },
  clearbit: { email_enrich: 5, company_enrich: 3 },
};

const WalletTab = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [showLimits, setShowLimits] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const allProviders = getAvailableProviders();
    const activeProviders = allProviders.filter((p) => p.status === 'active');
    setProviders(activeProviders);
    setLoading(false);
  };

  const availableCredits = mockWalletData.creditBalance - mockWalletData.reservedCredits;
  const usagePercentage = (mockWalletData.usedThisMonth / mockWalletData.monthlyLimit) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <CreditCard className="w-6 h-6 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">متاح</span>
          </div>
          <p className="text-3xl font-bold">{availableCredits.toLocaleString()}</p>
          <p className="text-sm opacity-80 mt-1">رصيد متاح</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-6 h-6 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">الشهر الحالي</span>
          </div>
          <p className="text-3xl font-bold">{mockWalletData.usedThisMonth.toLocaleString()}</p>
          <p className="text-sm opacity-80 mt-1">رصيد مستخدم</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-6 h-6 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">محجوز</span>
          </div>
          <p className="text-3xl font-bold">{mockWalletData.reservedCredits.toLocaleString()}</p>
          <p className="text-sm opacity-80 mt-1">عمليات جارية</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <Calendar className="w-6 h-6 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">الحد الشهري</span>
          </div>
          <p className="text-3xl font-bold">{mockWalletData.monthlyLimit.toLocaleString()}</p>
          <div className="mt-2">
            <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs mt-1 opacity-80">{usagePercentage.toFixed(1)}% مستخدم</p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">إدارة الرصيد</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddCredits(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
          >
            <Plus size={16} />
            إضافة رصيد
          </button>
          <button
            onClick={() => setShowLimits(true)}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2"
          >
            <Settings size={16} />
            الحدود
          </button>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2">
            <Download size={16} />
            تصدير
          </button>
        </div>
      </div>

      {/* Cost Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">تكلفة الإثراء لكل مزود</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">رصيد / عملية</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">المزود</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">📧 بريد</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">📱 هاتف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">🏢 شركة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">💼 لينكدإن</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">✓ تحقق</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الاستخدام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providers.map((provider) => {
                const costs = COST_MATRIX[provider.slug] || {};
                return (
                  <tr key={provider.slug} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {provider.logoUrl ? (
                          <img
                            src={provider.logoUrl}
                            alt={provider.name}
                            className="w-8 h-8 rounded object-contain bg-slate-50 p-0.5"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold">
                            {provider.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-slate-900">{provider.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {costs.email_enrich ? `${costs.email_enrich} رصيد` : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {costs.phone_enrich ? `${costs.phone_enrich} رصيد` : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {costs.company_enrich ? `${costs.company_enrich} رصيد` : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {costs.linkedin_enrich ? `${costs.linkedin_enrich} رصيد` : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {costs.verify ? `${costs.verify} رصيد` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900 font-medium">
                        {(provider.totalCreditsUsed || 0).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">سجل المعاملات</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Filter size={14} />
            تصفية
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {/* Mock transactions */}
          {[
            { id: 1, type: 'credit_use', amount: -150, provider: 'Apollo', action: 'إثراء بريد (150 سجل)', date: 'منذ ساعة' },
            { id: 2, type: 'credit_use', amount: -80, provider: 'Prospeo', action: 'إثراء هاتف (53 سجل)', date: 'منذ 3 ساعات' },
            { id: 3, type: 'credit_add', amount: 5000, provider: null, action: 'إضافة رصيد', date: 'منذ يوم' },
            { id: 4, type: 'credit_use', amount: -320, provider: 'Apollo', action: 'إثراء شامل (200 سجل)', date: 'منذ يومين' },
            { id: 5, type: 'refund', amount: 50, provider: 'Lemlist', action: 'استرداد - فشل API', date: 'منذ 3 أيام' },
          ].map((tx) => (
            <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.amount > 0
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {tx.amount > 0 ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{tx.action}</p>
                  <p className="text-sm text-slate-500">
                    {tx.provider && <span className="text-blue-600">{tx.provider} • </span>}
                    {tx.date}
                  </p>
                </div>
              </div>
              <span
                className={`font-bold ${
                  tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} رصيد
              </span>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
          <button className="text-sm text-blue-600 hover:text-blue-700 w-full text-center">
            عرض كل المعاملات
          </button>
        </div>
      </div>

      {/* Add Credits Modal */}
      {showAddCredits && (
        <AddCreditsModal onClose={() => setShowAddCredits(false)} />
      )}

      {/* Set Limits Modal */}
      {showLimits && (
        <SetLimitsModal
          currentLimits={{
            monthly: mockWalletData.monthlyLimit,
            daily: 5000,
          }}
          onClose={() => setShowLimits(false)}
        />
      )}
    </div>
  );
};

// Add Credits Modal
const AddCreditsModal = ({ onClose }: { onClose: () => void }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const presets = [1000, 5000, 10000, 25000, 50000];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">إضافة رصيد</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              الكمية
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    amount === preset.toString()
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {preset.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أو أدخل كمية مخصصة..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ملاحظة (اختياري)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: شحن شهري"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            إلغاء
          </button>
          <button
            disabled={!amount || Number(amount) <= 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            إضافة {amount ? Number(amount).toLocaleString() : 0} رصيد
          </button>
        </div>
      </div>
    </div>
  );
};

// Set Limits Modal
const SetLimitsModal = ({
  currentLimits,
  onClose,
}: {
  currentLimits: { monthly: number; daily: number };
  onClose: () => void;
}) => {
  const [monthly, setMonthly] = useState(currentLimits.monthly.toString());
  const [daily, setDaily] = useState(currentLimits.daily.toString());

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">إعدادات الحدود</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              الحد الشهري
            </label>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-1">
              الحد الأقصى للاستخدام الشهري
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              الحد اليومي
            </label>
            <input
              type="number"
              value={daily}
              onChange={(e) => setDaily(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-1">
              الحد الأقصى للاستخدام اليومي
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            إلغاء
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            حفظ الحدود
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletTab;
