/**
 * Audit Page - Admin Only
 *
 * Security logs, activity tracking, and system audit.
 */

import React, { useState } from 'react';
import {
  ScrollText,
  Shield,
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  Settings,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Calendar,
} from 'lucide-react';

// Mock audit data
const mockAuditLogs = [
  {
    id: '1',
    timestamp: '2024-06-15 14:32:15',
    user: 'admin@manafeth.com',
    action: 'provider_connected',
    target: 'Apollo',
    targetType: 'provider',
    status: 'success',
    ip: '192.168.1.100',
    details: 'تم ربط مزود Apollo بنجاح',
  },
  {
    id: '2',
    timestamp: '2024-06-15 14:28:03',
    user: 'admin@manafeth.com',
    action: 'policy_updated',
    target: 'Workspace Alpha',
    targetType: 'workspace',
    status: 'success',
    ip: '192.168.1.100',
    details: 'تحديث سياسة الحد اليومي إلى 5000',
  },
  {
    id: '3',
    timestamp: '2024-06-15 13:45:22',
    user: 'system',
    action: 'credits_depleted',
    target: 'Workspace Delta',
    targetType: 'workspace',
    status: 'warning',
    ip: '-',
    details: 'نفاد رصيد Workspace Delta',
  },
  {
    id: '4',
    timestamp: '2024-06-15 12:15:00',
    user: 'admin@manafeth.com',
    action: 'login_attempt',
    target: 'Admin Portal',
    targetType: 'system',
    status: 'success',
    ip: '192.168.1.100',
    details: 'تسجيل دخول ناجح',
  },
  {
    id: '5',
    timestamp: '2024-06-15 11:30:45',
    user: 'unknown',
    action: 'login_attempt',
    target: 'Admin Portal',
    targetType: 'system',
    status: 'failed',
    ip: '203.45.67.89',
    details: 'محاولة تسجيل دخول فاشلة - كلمة مرور خاطئة',
  },
  {
    id: '6',
    timestamp: '2024-06-15 10:22:18',
    user: 'admin@manafeth.com',
    action: 'api_key_rotated',
    target: 'Prospeo',
    targetType: 'provider',
    status: 'success',
    ip: '192.168.1.100',
    details: 'تم تدوير مفتاح API لـ Prospeo',
  },
  {
    id: '7',
    timestamp: '2024-06-15 09:15:33',
    user: 'admin@manafeth.com',
    action: 'workspace_created',
    target: 'Workspace Epsilon',
    targetType: 'workspace',
    status: 'success',
    ip: '192.168.1.100',
    details: 'إنشاء workspace جديد',
  },
  {
    id: '8',
    timestamp: '2024-06-14 23:45:00',
    user: 'system',
    action: 'backup_completed',
    target: 'Database',
    targetType: 'system',
    status: 'success',
    ip: '-',
    details: 'اكتمال النسخ الاحتياطي اليومي',
  },
];

const mockSecurityAlerts = [
  {
    id: '1',
    severity: 'high',
    message: 'محاولات تسجيل دخول فاشلة متعددة من IP: 203.45.67.89',
    timestamp: '2024-06-15 11:30:45',
    status: 'active',
  },
  {
    id: '2',
    severity: 'medium',
    message: 'Workspace Delta تجاوز حد الاستخدام الشهري',
    timestamp: '2024-06-15 13:45:22',
    status: 'resolved',
  },
  {
    id: '3',
    severity: 'low',
    message: 'مزود Hunter لم يُستخدم منذ 30 يوم',
    timestamp: '2024-06-14 10:00:00',
    status: 'active',
  },
];

const AuditPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'logs' | 'alerts'>('logs');

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'provider_connected':
      case 'provider_disconnected':
        return <Key size={16} className="text-blue-500" />;
      case 'policy_updated':
      case 'api_key_rotated':
        return <Settings size={16} className="text-amber-500" />;
      case 'credits_depleted':
      case 'credits_added':
        return <Database size={16} className="text-purple-500" />;
      case 'login_attempt':
        return <User size={16} className="text-slate-500" />;
      case 'workspace_created':
      case 'workspace_deleted':
        return <Shield size={16} className="text-emerald-500" />;
      default:
        return <ScrollText size={16} className="text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">
            <CheckCircle size={12} />
            نجاح
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
            <XCircle size={12} />
            فشل
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
            <AlertTriangle size={12} />
            تحذير
          </span>
        );
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">عالي</span>;
      case 'medium':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">متوسط</span>;
      case 'low':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">منخفض</span>;
      default:
        return null;
    }
  };

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesAction && matchesStatus;
  });

  return (
    <div className="p-6 min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg shadow-slate-500/20">
              <ScrollText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">السجل والأمان</h1>
              <p className="text-slate-500">تتبع الأنشطة وتنبيهات الأمان</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2">
              <Download size={16} />
              تصدير
            </button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2">
              <RefreshCw size={16} />
              تحديث
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'logs'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          سجل الأنشطة
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          تنبيهات الأمان
          {mockSecurityAlerts.filter((a) => a.status === 'active').length > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              {mockSecurityAlerts.filter((a) => a.status === 'active').length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'logs' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث في السجلات..."
                  className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value="all">كل الإجراءات</option>
                <option value="login_attempt">تسجيل دخول</option>
                <option value="provider_connected">ربط مزود</option>
                <option value="policy_updated">تحديث سياسة</option>
                <option value="workspace_created">إنشاء workspace</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value="all">كل الحالات</option>
                <option value="success">نجاح</option>
                <option value="failed">فشل</option>
                <option value="warning">تحذير</option>
              </select>
              <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2">
                <Calendar size={16} />
                نطاق التاريخ
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الوقت</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">المستخدم</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الإجراء</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الهدف</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">{log.user}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="text-sm text-slate-600">{log.details}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{log.target}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-sm text-slate-500 text-center">
              عرض {filteredLogs.length} من {mockAuditLogs.length} سجل
            </div>
          </div>
        </>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {mockSecurityAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-4 flex items-start gap-4 ${
                alert.status === 'active' ? 'border-red-200' : 'border-slate-200'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  alert.severity === 'high'
                    ? 'bg-red-100'
                    : alert.severity === 'medium'
                    ? 'bg-amber-100'
                    : 'bg-blue-100'
                }`}
              >
                <AlertTriangle
                  size={20}
                  className={
                    alert.severity === 'high'
                      ? 'text-red-600'
                      : alert.severity === 'medium'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getSeverityBadge(alert.severity)}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      alert.status === 'active'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {alert.status === 'active' ? 'نشط' : 'تم الحل'}
                  </span>
                </div>
                <p className="text-slate-900 font-medium">{alert.message}</p>
                <p className="text-sm text-slate-500 mt-1">{alert.timestamp}</p>
              </div>
              {alert.status === 'active' && (
                <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200">
                  تم الحل
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditPage;
