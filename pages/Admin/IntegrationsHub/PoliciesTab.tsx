/**
 * Policies Tab - Admin Only
 *
 * Manage compliance rules, workspace policies, and access control.
 */

import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Shield,
  Ban,
  Eye,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Lock,
  Users,
  Building2,
} from 'lucide-react';
import { getAvailableProviders, type Provider } from '@/services/integrationsService';

// Mock policy data
const mockPolicies = [
  {
    id: '1',
    workspaceId: 'ws-1',
    workspaceName: 'Workspace Alpha',
    enabledProviders: ['apollo', 'prospeo'],
    dailyLimit: 500,
    monthlyLimit: 10000,
    overagePolicy: 'stop' as const,
  },
  {
    id: '2',
    workspaceId: 'ws-2',
    workspaceName: 'Workspace Beta',
    enabledProviders: ['apollo', 'lemlist', 'hunter'],
    dailyLimit: 1000,
    monthlyLimit: 25000,
    overagePolicy: 'request_approval' as const,
  },
];

const mockBlacklist = {
  domains: ['competitor.com', 'blocked-domain.org', 'spam.net'],
  emails: ['test@example.com', 'admin@blocked.com'],
};

const PoliciesTab = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'workspace' | 'blacklist' | 'compliance'>('workspace');
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        {[
          { id: 'workspace', label: 'سياسات Workspace', icon: Building2 },
          { id: 'blacklist', label: 'القوائم السوداء', icon: Ban },
          { id: 'compliance', label: 'الامتثال', icon: Shield },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as typeof activeSection)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeSection === section.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <section.icon size={18} />
            {section.label}
          </button>
        ))}
      </div>

      {/* Workspace Policies Section */}
      {activeSection === 'workspace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">سياسات Workspace</h2>
              <p className="text-sm text-slate-500">تحكم في وصول كل workspace للمزودين والحدود</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus size={16} />
              إضافة سياسة
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Workspace</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">المزودين المفعلين</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الحد اليومي</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">الحد الشهري</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">سياسة التجاوز</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                          <Building2 size={16} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-900">{policy.workspaceName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {policy.enabledProviders.map((slug) => {
                          const provider = providers.find((p) => p.slug === slug);
                          return (
                            <span
                              key={slug}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                            >
                              {provider?.name || slug}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {policy.dailyLimit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {policy.monthlyLimit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          policy.overagePolicy === 'stop'
                            ? 'bg-red-100 text-red-700'
                            : policy.overagePolicy === 'request_approval'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {policy.overagePolicy === 'stop'
                          ? 'إيقاف'
                          : policy.overagePolicy === 'request_approval'
                          ? 'طلب موافقة'
                          : 'شحن تلقائي'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blacklist Section */}
      {activeSection === 'blacklist' && (
        <div className="space-y-6">
          {/* Blocked Domains */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">النطاقات المحظورة</h3>
                <p className="text-sm text-slate-500 mt-0.5">النطاقات التي لا يتم إثراؤها</p>
              </div>
              <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center gap-1">
                <Plus size={14} />
                إضافة نطاق
              </button>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {mockBlacklist.domains.map((domain) => (
                  <span
                    key={domain}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm"
                  >
                    <Ban size={14} />
                    {domain}
                    <button className="hover:text-red-900">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Blocked Emails */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">البريد المحظور</h3>
                <p className="text-sm text-slate-500 mt-0.5">عناوين بريد محددة محظورة</p>
              </div>
              <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center gap-1">
                <Plus size={14} />
                إضافة بريد
              </button>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {mockBlacklist.emails.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm"
                  >
                    <Ban size={14} />
                    {email}
                    <button className="hover:text-red-900">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Section */}
      {activeSection === 'compliance' && (
        <div className="space-y-6">
          {/* GDPR Settings */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">إعدادات GDPR</h3>
              <p className="text-sm text-slate-500 mt-0.5">الامتثال للائحة حماية البيانات الأوروبية</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-900">وضع GDPR</p>
                  <p className="text-sm text-slate-500">تفعيل قيود البيانات للاتحاد الأوروبي</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-900">حذف البيانات التلقائي</p>
                  <p className="text-sm text-slate-500">حذف البيانات بعد فترة محددة</p>
                </div>
                <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option value="30">30 يوم</option>
                  <option value="90">90 يوم</option>
                  <option value="180">180 يوم</option>
                  <option value="365">سنة</option>
                  <option value="never">أبداً</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-900">طلب الموافقة</p>
                  <p className="text-sm text-slate-500">طلب موافقة قبل إثراء البيانات</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Audit Settings */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">إعدادات التدقيق</h3>
              <p className="text-sm text-slate-500 mt-0.5">تتبع وتسجيل الأنشطة</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-900">تسجيل كل الطلبات</p>
                  <p className="text-sm text-slate-500">حفظ سجل لكل عملية إثراء</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-900">تسجيل تغييرات Admin</p>
                  <p className="text-sm text-slate-500">تتبع كل تغيير من المسؤولين</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-900">الاحتفاظ بالسجلات</p>
                  <p className="text-sm text-slate-500">مدة الاحتفاظ بسجلات التدقيق</p>
                </div>
                <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option value="90">90 يوم</option>
                  <option value="180">180 يوم</option>
                  <option value="365">سنة</option>
                  <option value="730">سنتين</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">تنبيه أمني</p>
              <p className="text-sm text-amber-700 mt-1">
                تأكد من مراجعة إعدادات الأمان بانتظام والتحقق من سجلات التدقيق للكشف عن أي نشاط مشبوه.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliciesTab;
