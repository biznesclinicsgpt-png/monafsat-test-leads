/**
 * Usage Stats Component
 *
 * Display provider usage analytics and statistics.
 */

import { useState, useEffect } from 'react';
import { Icons } from '@/constants';
import { getUsageStats, getRecentLogs } from '@/services/integrationsService';

export const UsageStats = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [stats, setStats] = useState<ReturnType<typeof getUsageStats> | null>(null);
  const [logs, setLogs] = useState<ReturnType<typeof getRecentLogs>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = () => {
    setLoading(true);
    const statsData = getUsageStats(period);
    const logsData = getRecentLogs();
    setStats(statsData);
    setLogs(logsData);
    setLoading(false);
  };

  const periods = [
    { value: 'day', label: 'اليوم' },
    { value: 'week', label: 'الأسبوع' },
    { value: 'month', label: 'الشهر' },
  ] as const;

  const statusLabels: Record<string, { label: string; color: string }> = {
    success: { label: 'نجاح', color: 'text-green-600 bg-green-100' },
    not_found: { label: 'غير موجود', color: 'text-yellow-600 bg-yellow-100' },
    error: { label: 'خطأ', color: 'text-red-600 bg-red-100' },
    rate_limited: { label: 'حد معدل', color: 'text-orange-600 bg-orange-100' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">إحصائيات الاستخدام</h2>
        <div className="flex bg-slate-100 rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === p.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="إجمالي الطلبات"
            value={stats.overall.totalRequests}
            icon={<Icons.Contacts size={20} />}
          />
          <StatCard
            label="الناجحة"
            value={stats.overall.totalSuccess}
            percentage={
              stats.overall.totalRequests > 0
                ? Math.round(
                    (stats.overall.totalSuccess / stats.overall.totalRequests) * 100
                  )
                : 0
            }
            icon={<Icons.Profile size={20} />}
            positive
          />
          <StatCard
            label="الرصيد المستخدم"
            value={stats.overall.totalCredits}
            icon={<Icons.Financial size={20} />}
          />
          <StatCard
            label="المزودين النشطين"
            value={stats.overall.activeProviders}
            icon={<Icons.Settings size={20} />}
          />
        </div>
      )}

      {/* Provider Breakdown */}
      {stats && stats.byProvider.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">حسب المزود</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-right">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                    المزود
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                    الطلبات
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                    نسبة النجاح
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                    الرصيد
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">
                    متوسط الاستجابة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.byProvider.map((provider) => (
                  <tr key={provider.slug} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        {provider.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {provider.totalRequests.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              provider.successRate >= 80
                                ? 'bg-green-500'
                                : provider.successRate >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${provider.successRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600 w-12">
                          {Math.round(provider.successRate)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {provider.totalCredits.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {Math.round(provider.avgResponseTime)}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats && stats.byProvider.length === 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
          <div className="text-slate-400 mb-2">
            <Icons.Financial size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">
            لا توجد إحصائيات بعد
          </h3>
          <p className="text-slate-500 mt-1">
            قم بربط المزودين وتشغيل عمليات الإثراء لرؤية الإحصائيات
          </p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">النشاط الأخير</h3>
          <button
            onClick={loadData}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            تحديث
          </button>
        </div>
        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              لا يوجد نشاط بعد
            </div>
          ) : (
            logs.map((log) => {
              const statusInfo = statusLabels[log.status] || {
                label: log.status,
                color: 'text-slate-600 bg-slate-100',
              };

              return (
                <div
                  key={log.id}
                  className="px-6 py-3 flex items-center justify-between hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {log.provider.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {log.requestType.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-slate-600">
                      {log.creditsUsed} رصيد
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(log.createdAt).toLocaleString('ar-SA')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card
const StatCard = ({
  label,
  value,
  percentage,
  icon,
  positive,
}: {
  label: string;
  value: number;
  percentage?: number;
  icon: React.ReactNode;
  positive?: boolean;
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">{icon}</span>
        {percentage !== undefined && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              positive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {percentage}%
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
};
