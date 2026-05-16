/**
 * Wallet Page - Admin Only
 *
 * Global wallet management and billing overview across all workspaces.
 */

import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

// Mock data for demonstration
const mockWorkspaces = [
  {
    id: 'ws-1',
    name: 'Workspace Alpha',
    balance: 15000,
    usedThisMonth: 3500,
    monthlyLimit: 10000,
    status: 'active',
  },
  {
    id: 'ws-2',
    name: 'Workspace Beta',
    balance: 8500,
    usedThisMonth: 7200,
    monthlyLimit: 25000,
    status: 'active',
  },
  {
    id: 'ws-3',
    name: 'Workspace Gamma',
    balance: 150,
    usedThisMonth: 4850,
    monthlyLimit: 5000,
    status: 'low',
  },
  {
    id: 'ws-4',
    name: 'Workspace Delta',
    balance: 0,
    usedThisMonth: 10000,
    monthlyLimit: 10000,
    status: 'exhausted',
  },
];

const mockRecentActivity = [
  { id: 1, workspace: 'Workspace Alpha', type: 'credit_use', amount: -250, action: 'إثراء بريد', date: 'منذ 10 دقائق' },
  { id: 2, workspace: 'Workspace Beta', type: 'credit_add', amount: 5000, action: 'شحن رصيد', date: 'منذ ساعة' },
  { id: 3, workspace: 'Workspace Gamma', type: 'credit_use', amount: -480, action: 'إثراء هاتف', date: 'منذ 2 ساعة' },
  { id: 4, workspace: 'Workspace Delta', type: 'limit_reached', amount: 0, action: 'تم الوصول للحد', date: 'منذ 3 ساعات' },
  { id: 5, workspace: 'Workspace Alpha', type: 'refund', amount: 50, action: 'استرداد', date: 'منذ 5 ساعات' },
];

const WalletPage = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  const totalBalance = mockWorkspaces.reduce((sum, ws) => sum + ws.balance, 0);
  const totalUsed = mockWorkspaces.reduce((sum, ws) => sum + ws.usedThisMonth, 0);
  const lowBalanceCount = mockWorkspaces.filter((ws) => ws.status === 'low' || ws.status === 'exhausted').length;

  return (
    <div className="p-6 min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">المحفظة والفوترة</h1>
              <p className="text-slate-500">إدارة الرصيد لجميع Workspaces</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2">
              <Download size={16} />
              تصدير التقرير
            </button>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center gap-2">
              <CreditCard size={16} />
              شحن رصيد جماعي
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <CreditCard className="w-6 h-6 text-emerald-500" />
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">إجمالي</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalBalance.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">إجمالي الرصيد</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">الشهر</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalUsed.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">الاستخدام الشهري</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Building2 className="w-6 h-6 text-purple-500" />
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">نشط</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{mockWorkspaces.length}</p>
          <p className="text-sm text-slate-500 mt-1">Workspaces</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">تنبيه</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{lowBalanceCount}</p>
          <p className="text-sm text-slate-500 mt-1">رصيد منخفض</p>
        </div>
      </div>

      {/* Workspaces Table */}
      <div className="bg-white rounded-xl border border-slate-200 mb-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">رصيد Workspaces</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Filter size={14} />
            تصفية
          </button>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Workspace</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الرصيد الحالي</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الاستخدام الشهري</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الحد الشهري</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الحالة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockWorkspaces.map((workspace) => {
              const usagePercent = (workspace.usedThisMonth / workspace.monthlyLimit) * 100;
              return (
                <tr key={workspace.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Building2 size={18} className="text-slate-600" />
                      </div>
                      <span className="font-medium text-slate-900">{workspace.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${workspace.balance < 1000 ? 'text-red-600' : 'text-slate-900'}`}>
                      {workspace.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className="text-slate-600">{workspace.usedThisMonth.toLocaleString()}</span>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {workspace.monthlyLimit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workspace.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : workspace.status === 'low'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {workspace.status === 'active'
                        ? 'نشط'
                        : workspace.status === 'low'
                        ? 'منخفض'
                        : 'نفد'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                      شحن
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">النشاط الأخير</h2>
          <div className="flex items-center gap-2 text-sm">
            {(['day', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg ${
                  timeRange === range
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {range === 'day' ? 'اليوم' : range === 'week' ? 'الأسبوع' : 'الشهر'}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {mockRecentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'credit_add' || activity.type === 'refund'
                      ? 'bg-emerald-100 text-emerald-600'
                      : activity.type === 'limit_reached'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {activity.type === 'credit_add' || activity.type === 'refund' ? (
                    <ArrowDownLeft size={18} />
                  ) : activity.type === 'limit_reached' ? (
                    <AlertTriangle size={18} />
                  ) : (
                    <ArrowUpRight size={18} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-500">
                    <span className="text-blue-600">{activity.workspace}</span> • {activity.date}
                  </p>
                </div>
              </div>
              {activity.amount !== 0 && (
                <span
                  className={`font-bold ${
                    activity.amount > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {activity.amount > 0 ? '+' : ''}{activity.amount.toLocaleString()}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
          <button className="text-sm text-blue-600 hover:text-blue-700 w-full text-center">
            عرض كل النشاط
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
