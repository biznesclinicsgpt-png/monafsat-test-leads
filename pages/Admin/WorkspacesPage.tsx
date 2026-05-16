/**
 * Workspaces Page - Admin Only
 *
 * Manage client workspaces, their configurations, and access control.
 */

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  CreditCard,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Edit2,
  Trash2,
  Eye,
  Mail,
} from 'lucide-react';

// Mock workspace data
const mockWorkspaces = [
  {
    id: 'ws-1',
    name: 'Workspace Alpha',
    email: 'contact@alpha.com',
    status: 'active',
    plan: 'enterprise',
    users: 12,
    credits: 15000,
    usageThisMonth: 3500,
    createdAt: '2024-01-15',
    lastActivity: 'منذ 5 دقائق',
  },
  {
    id: 'ws-2',
    name: 'Workspace Beta',
    email: 'admin@beta.io',
    status: 'active',
    plan: 'professional',
    users: 5,
    credits: 8500,
    usageThisMonth: 7200,
    createdAt: '2024-02-20',
    lastActivity: 'منذ ساعة',
  },
  {
    id: 'ws-3',
    name: 'Workspace Gamma',
    email: 'team@gamma.org',
    status: 'suspended',
    plan: 'starter',
    users: 2,
    credits: 150,
    usageThisMonth: 4850,
    createdAt: '2024-03-10',
    lastActivity: 'منذ 3 أيام',
  },
  {
    id: 'ws-4',
    name: 'Workspace Delta',
    email: 'hello@delta.sa',
    status: 'pending',
    plan: 'professional',
    users: 0,
    credits: 5000,
    usageThisMonth: 0,
    createdAt: '2024-06-01',
    lastActivity: 'لم يبدأ',
  },
];

const WorkspacesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  const filteredWorkspaces = mockWorkspaces.filter((ws) => {
    const matchesSearch =
      ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ws.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockWorkspaces.length,
    active: mockWorkspaces.filter((ws) => ws.status === 'active').length,
    suspended: mockWorkspaces.filter((ws) => ws.status === 'suspended').length,
    pending: mockWorkspaces.filter((ws) => ws.status === 'pending').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            <CheckCircle size={12} />
            نشط
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle size={12} />
            معلق
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            <Clock size={12} />
            قيد الانتظار
          </span>
        );
      default:
        return null;
    }
  };

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      enterprise: 'bg-purple-100 text-purple-700',
      professional: 'bg-blue-100 text-blue-700',
      starter: 'bg-slate-100 text-slate-700',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[plan] || colors.starter}`}>
        {plan === 'enterprise' ? 'مؤسسات' : plan === 'professional' ? 'احترافي' : 'أساسي'}
      </span>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">إدارة العملاء</h1>
              <p className="text-slate-500">إدارة Workspaces والوصول والإعدادات</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
            <Plus size={16} />
            Workspace جديد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">إجمالي Workspaces</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">نشط</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">معلق</p>
          <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">قيد الانتظار</p>
          <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن workspace..."
                className="pr-10 pl-4 py-2 border border-slate-300 rounded-lg w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="suspended">معلق</option>
              <option value="pending">قيد الانتظار</option>
            </select>
          </div>
          <div className="text-sm text-slate-500">
            عرض {filteredWorkspaces.length} من {mockWorkspaces.length}
          </div>
        </div>
      </div>

      {/* Workspaces Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Workspace</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الخطة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">المستخدمين</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الرصيد</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الحالة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">آخر نشاط</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredWorkspaces.map((workspace) => (
              <tr key={workspace.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <Building2 size={18} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{workspace.name}</p>
                      <p className="text-sm text-slate-500">{workspace.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getPlanBadge(workspace.plan)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={16} />
                    {workspace.users}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{workspace.credits.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">
                      استخدام: {workspace.usageThisMonth.toLocaleString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(workspace.status)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {workspace.lastActivity}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                      <CreditCard size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredWorkspaces.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد نتائج</h3>
          <p className="text-slate-500">جرب تغيير معايير البحث أو التصفية</p>
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;
