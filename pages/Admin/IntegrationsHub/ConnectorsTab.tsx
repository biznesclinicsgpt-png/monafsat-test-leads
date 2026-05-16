/**
 * Connectors Tab - Admin Only
 *
 * Manage provider connections, API keys, and health status.
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  Eye,
  EyeOff,
  TestTube,
} from 'lucide-react';
import {
  getAvailableProviders,
  saveProvider,
  disconnectProvider,
  testProviderConnection,
  saveProviderCredentials,
  type Provider,
} from '@/services/integrationsService';

const ConnectorsTab = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState<string | null>(null);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = () => {
    setLoading(true);
    const allProviders = getAvailableProviders();
    setProviders(allProviders);
    setLoading(false);
  };

  const connectedCount = providers.filter((p) => p.status === 'active').length;
  const emailProviders = providers.filter((p) => p.capabilities.email).length;
  const phoneProviders = providers.filter((p) => p.capabilities.phone).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="مزودين متصلين"
          value={connectedCount}
          total={providers.length}
          color="emerald"
        />
        <StatCard
          label="يدعم البريد"
          value={emailProviders}
          icon="📧"
          color="blue"
        />
        <StatCard
          label="يدعم الهاتف"
          value={phoneProviders}
          icon="📱"
          color="purple"
        />
        <StatCard
          label="إجمالي الاستخدام"
          value={providers.reduce((sum, p) => sum + (p.totalCreditsUsed || 0), 0)}
          unit="رصيد"
          color="amber"
        />
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">قائمة المزودين</h2>
        <div className="flex gap-2">
          <button
            onClick={loadProviders}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={16} />
            تحديث
          </button>
        </div>
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.slug}
            provider={provider}
            isConfiguring={configuring === provider.slug}
            isTesting={testingProvider === provider.slug}
            onConfigure={() => setConfiguring(configuring === provider.slug ? null : provider.slug)}
            onTest={async (apiKey) => {
              setTestingProvider(provider.slug);
              try {
                const result = await testProviderConnection(provider.slug, apiKey);
                return result;
              } finally {
                setTestingProvider(null);
              }
            }}
            onSave={(apiKey) => {
              saveProviderCredentials(provider.slug, apiKey);
              saveProvider({
                slug: provider.slug,
                status: 'active',
                hasCredentials: true,
                lastTestAt: new Date().toISOString(),
                lastTestStatus: 'success',
              });
              setConfiguring(null);
              loadProviders();
            }}
            onDisconnect={() => {
              if (confirm('هل تريد فصل هذا المزود؟')) {
                disconnectProvider(provider.slug);
                loadProviders();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Provider Card Component
const ProviderCard = ({
  provider,
  isConfiguring,
  isTesting,
  onConfigure,
  onTest,
  onSave,
  onDisconnect,
}: {
  provider: Provider;
  isConfiguring: boolean;
  isTesting: boolean;
  onConfigure: () => void;
  onTest: (apiKey: string) => Promise<{ success: boolean; message: string; creditsRemaining?: number }>;
  onSave: (apiKey: string) => void;
  onDisconnect: () => void;
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    creditsRemaining?: number;
  } | null>(null);

  const isConnected = provider.status === 'active' && provider.hasCredentials;

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTestResult(null);
    const result = await onTest(apiKey);
    setTestResult(result);
  };

  const handleSave = () => {
    if (apiKey.trim() && testResult?.success) {
      onSave(apiKey);
      setApiKey('');
      setTestResult(null);
    }
  };

  const capabilities = [
    { key: 'email', label: 'بريد', icon: '📧' },
    { key: 'phone', label: 'هاتف', icon: '📱' },
    { key: 'company', label: 'شركة', icon: '🏢' },
    { key: 'linkedin', label: 'لينكدإن', icon: '💼' },
    { key: 'verify', label: 'تحقق', icon: '✓' },
  ] as const;

  const activeCapabilities = capabilities.filter(
    (c) => provider.capabilities[c.key as keyof typeof provider.capabilities]
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {provider.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-900">{provider.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle size={12} />
                    متصل
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <XCircle size={12} />
                    غير متصل
                  </span>
                )}
              </div>
            </div>
          </div>
          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Capabilities */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex flex-wrap gap-2">
          {activeCapabilities.map((cap) => (
            <span
              key={cap.key}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs text-slate-600 border border-slate-200"
            >
              <span>{cap.icon}</span>
              {cap.label}
            </span>
          ))}
        </div>
      </div>

      {/* Stats (if connected) */}
      {isConnected && (
        <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">إجمالي الاستخدام</span>
            <span className="font-medium text-slate-900">
              {(provider.totalCreditsUsed || 0).toLocaleString()} رصيد
            </span>
          </div>
          {provider.lastTestAt && (
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-500">آخر فحص</span>
              <span className={provider.lastTestStatus === 'success' ? 'text-emerald-600' : 'text-red-600'}>
                {provider.lastTestStatus === 'success' ? '✓ نجح' : '✗ فشل'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Configuration Panel */}
      {isConfiguring && (
        <div className="px-4 py-4 border-b border-slate-100 bg-slate-50 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              مفتاح API
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="أدخل مفتاح API..."
                className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {testResult.success ? (
                <CheckCircle size={16} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
              )}
              <div>
                <p>{testResult.message}</p>
                {testResult.creditsRemaining !== undefined && (
                  <p className="mt-1 font-medium">
                    الرصيد المتبقي: {testResult.creditsRemaining.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleTest}
              disabled={!apiKey.trim() || isTesting}
              className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <TestTube size={14} />
              )}
              {isTesting ? 'جاري الاختبار...' : 'اختبار'}
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim() || !testResult?.success}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              حفظ وتفعيل
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex gap-2">
        {isConnected ? (
          <>
            <button
              onClick={onConfigure}
              className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
            >
              {isConfiguring ? 'إلغاء' : 'تحديث المفتاح'}
            </button>
            <button
              onClick={onDisconnect}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={onConfigure}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {isConfiguring ? 'إلغاء' : 'ربط المزود'}
          </button>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  label,
  value,
  total,
  unit,
  icon,
  color,
}: {
  label: string;
  value: number;
  total?: number;
  unit?: string;
  icon?: string;
  color: 'emerald' | 'blue' | 'purple' | 'amber';
}) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 border-emerald-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    amber: 'bg-amber-50 border-amber-200',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">
          {value.toLocaleString()}
        </span>
        {total !== undefined && (
          <span className="text-slate-400">/ {total}</span>
        )}
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>
    </div>
  );
};

export default ConnectorsTab;
