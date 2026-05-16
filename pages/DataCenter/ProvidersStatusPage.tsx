/**
 * Providers Status Page - Client View (Read-Only)
 *
 * Shows providers availability and usage limits without exposing API keys.
 * Clients can see what's available and request activation.
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Phone,
  Mail,
  Building2,
  Linkedin,
  Shield,
  HelpCircle,
  RefreshCw,
  MessageCircle,
  CreditCard,
} from 'lucide-react';
import { AdminContactAlert } from '../../components/AdminContactAlert';

// Types for client view (no sensitive data)
interface ProviderStatusView {
  slug: string;
  name: string;
  logoUrl?: string;
  status: 'connected' | 'limited' | 'disabled';
  coverage: {
    email: boolean;
    phone: boolean;
    company: boolean;
    linkedin: boolean;
  };
  limits?: {
    daily: number | null;
    monthly: number | null;
    usedToday: number;
    usedThisMonth: number;
  };
  sla?: string;
}

// Mock data - In production, fetched from API based on workspace policy
const mockProviderStatus: ProviderStatusView[] = [
  {
    slug: 'apollo',
    name: 'Apollo',
    logoUrl: 'https://logo.clearbit.com/apollo.io',
    status: 'connected',
    coverage: { email: true, phone: true, company: true, linkedin: true },
    limits: { daily: 500, monthly: 10000, usedToday: 150, usedThisMonth: 3200 },
    sla: '99.5%',
  },
  {
    slug: 'prospeo',
    name: 'Prospeo',
    logoUrl: 'https://logo.clearbit.com/prospeo.io',
    status: 'connected',
    coverage: { email: true, phone: true, company: false, linkedin: true },
    limits: { daily: 300, monthly: 5000, usedToday: 80, usedThisMonth: 1500 },
  },
  {
    slug: 'lemlist',
    name: 'Lemlist',
    status: 'limited',
    coverage: { email: true, phone: false, company: false, linkedin: true },
    limits: { daily: 100, monthly: 2000, usedToday: 95, usedThisMonth: 1800 },
  },
  {
    slug: 'hunter',
    name: 'Hunter',
    logoUrl: 'https://logo.clearbit.com/hunter.io',
    status: 'disabled',
    coverage: { email: true, phone: false, company: false, linkedin: false },
  },
  {
    slug: 'clearbit',
    name: 'Clearbit',
    logoUrl: 'https://logo.clearbit.com/clearbit.com',
    status: 'disabled',
    coverage: { email: true, phone: false, company: true, linkedin: false },
  },
];

const ProvidersStatusPage = () => {
  const [providers, setProviders] = useState<ProviderStatusView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviderStatus();
  }, []);

  const loadProviderStatus = async () => {
    setLoading(true);
    // In production: fetch from API with workspace context
    // const response = await fetch('/api/providers/status');
    // const data = await response.json();
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProviders(mockProviderStatus);
    setLoading(false);
  };

  const connectedCount = providers.filter((p) => p.status === 'connected').length;
  const limitedCount = providers.filter((p) => p.status === 'limited').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">حالة المزودين</h1>
          <p className="text-slate-600 mt-1">
            عرض المزودين المتاحين وحدود الاستخدام
          </p>
        </div>
        <button
          onClick={loadProviderStatus}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          تحديث
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{connectedCount}</p>
              <p className="text-sm text-slate-500">مزود متصل</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{limitedCount}</p>
              <p className="text-sm text-slate-500">محدود الاستخدام</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{providers.length}</p>
              <p className="text-sm text-slate-500">إجمالي المزودين</p>
            </div>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <ProviderStatusCard
            key={provider.slug}
            provider={provider}
          />
        ))}
      </div>

      {/* Wallet Status Alert */}
      <WalletStatusAlert />

      {/* Info Note with WhatsApp Contact */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-blue-900 text-lg">حول المزودين والتكاملات</p>
            <p className="text-sm text-blue-700 mt-2">
              يتم إدارة المزودين والتكاملات من قبل الإدارة. إذا كنت بحاجة إلى:
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside mr-2">
              <li>تفعيل مزود جديد</li>
              <li>رفع حدود الاستخدام</li>
              <li>إعادة شحن الرصيد</li>
              <li>حل مشكلة في الاتصال</li>
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/966545670325?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%A7%D9%84%D9%85%D8%B2%D9%88%D8%AF%D9%8A%D9%86"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={18} />
                تواصل عبر الواتساب
              </a>
              <span className="text-sm text-blue-600 font-medium">
                +966 54 567 0325
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wallet Status Alert Component
const WalletStatusAlert = () => {
  // In production, fetch from API
  const [walletStatus, setWalletStatus] = useState<{
    credits: number;
    used: number;
    status: 'active' | 'low' | 'exhausted';
  } | null>(null);

  useEffect(() => {
    // Mock wallet data - replace with actual API call
    const mockWallet = {
      credits: 100,
      used: 85,
      status: 'low' as const,
    };
    setWalletStatus(mockWallet);
  }, []);

  if (!walletStatus) return null;

  const remaining = walletStatus.credits - walletStatus.used;
  const percentUsed = (walletStatus.used / walletStatus.credits) * 100;

  if (walletStatus.status === 'exhausted' || remaining <= 0) {
    return (
      <AdminContactAlert
        type="credits_exhausted"
        details={`الرصيد المتبقي: ${remaining} كريدت`}
      />
    );
  }

  if (walletStatus.status === 'low' || percentUsed >= 80) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-800">الرصيد على وشك النفاد</h3>
            <p className="text-sm text-amber-700 mt-1">
              لديك {remaining} كريدت متبقي من أصل {walletStatus.credits}
            </p>
            <div className="mt-3 h-2 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <div className="mt-3">
              <a
                href="https://wa.me/966545670325?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A5%D8%B9%D8%A7%D8%AF%D8%A9%20%D8%B4%D8%AD%D9%86%20%D8%A7%D9%84%D8%B1%D8%B5%D9%8A%D8%AF"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                <MessageCircle size={16} />
                اطلب إعادة شحن الرصيد
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Provider Status Card Component
const ProviderStatusCard = ({
  provider,
}: {
  provider: ProviderStatusView;
}) => {
  const statusConfig = {
    connected: {
      label: 'متصل',
      color: 'bg-emerald-100 text-emerald-700',
      icon: CheckCircle,
    },
    limited: {
      label: 'محدود',
      color: 'bg-amber-100 text-amber-700',
      icon: AlertCircle,
    },
    disabled: {
      label: 'غير مفعل',
      color: 'bg-slate-100 text-slate-500',
      icon: XCircle,
    },
  };

  const status = statusConfig[provider.status];
  const StatusIcon = status.icon;

  const coverageItems = [
    { key: 'email', label: 'بريد', icon: Mail, enabled: provider.coverage.email },
    { key: 'phone', label: 'هاتف', icon: Phone, enabled: provider.coverage.phone },
    { key: 'company', label: 'شركة', icon: Building2, enabled: provider.coverage.company },
    { key: 'linkedin', label: 'لينكدإن', icon: Linkedin, enabled: provider.coverage.linkedin },
  ];

  const usagePercent = provider.limits
    ? (provider.limits.usedThisMonth / (provider.limits.monthly || 1)) * 100
    : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {provider.logoUrl ? (
              <img
                src={provider.logoUrl}
                alt={provider.name}
                className="w-10 h-10 rounded-lg object-contain bg-slate-50 p-1"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold">
                {provider.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-900">{provider.name}</h3>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                <StatusIcon size={12} />
                {status.label}
              </span>
            </div>
          </div>
          {provider.sla && (
            <div className="text-left">
              <p className="text-xs text-slate-500">SLA</p>
              <p className="text-sm font-medium text-slate-900">{provider.sla}</p>
            </div>
          )}
        </div>
      </div>

      {/* Coverage */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
        <p className="text-xs text-slate-500 mb-2">التغطية</p>
        <div className="flex gap-2">
          {coverageItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                  item.enabled
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon size={12} />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage (if available) */}
      {provider.limits && provider.status !== 'disabled' && (
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-500">الاستخدام الشهري</span>
            <span className="font-medium text-slate-900">
              {provider.limits.usedThisMonth.toLocaleString()} / {provider.limits.monthly?.toLocaleString() || '∞'}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                usagePercent >= 90
                  ? 'bg-red-500'
                  : usagePercent >= 70
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>اليوم: {provider.limits.usedToday} / {provider.limits.daily || '∞'}</span>
            <span>{usagePercent.toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3">
        {provider.status === 'disabled' ? (
          <a
            href={`https://wa.me/966545670325?text=${encodeURIComponent(`مرحباً، أريد تفعيل مزود ${provider.name} لحسابي`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            طلب تفعيل عبر الواتساب
          </a>
        ) : provider.status === 'limited' ? (
          <a
            href={`https://wa.me/966545670325?text=${encodeURIComponent(`مرحباً، أريد رفع حد الاستخدام لمزود ${provider.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            طلب رفع الحد
          </a>
        ) : (
          <div className="text-center py-2 text-sm text-emerald-600 flex items-center justify-center gap-2">
            <Shield size={16} />
            مفعل ويعمل بشكل طبيعي
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvidersStatusPage;
