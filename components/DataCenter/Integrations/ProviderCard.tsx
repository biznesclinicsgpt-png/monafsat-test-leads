/**
 * Provider Card Component
 *
 * Displays provider info, connection status, and configuration.
 */

import { useState } from 'react';
import { Icons } from '@/constants';
import {
  saveProvider,
  disconnectProvider,
  testProviderConnection,
  saveProviderCredentials,
} from '@/services/integrationsService';

interface ProviderCardProps {
  provider: {
    id?: string;
    slug: string;
    name: string;
    logoUrl?: string;
    description?: string;
    capabilities: {
      email: boolean;
      phone: boolean;
      company: boolean;
      linkedin: boolean;
      verify: boolean;
      bulk: boolean;
    };
    status?: string;
    hasCredentials?: boolean;
    lastTestAt?: string;
    lastTestStatus?: string;
    website?: string;
    totalCreditsUsed?: number;
  };
  onUpdate: () => void;
}

export const ProviderCard = ({ provider, onUpdate }: ProviderCardProps) => {
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    creditsRemaining?: number;
  } | null>(null);

  const isConnected = provider.status === 'active' && provider.hasCredentials;

  const handleTestConnection = async () => {
    if (!apiKey.trim()) return;

    setTesting(true);
    setTestResult(null);

    try {
      const result = await testProviderConnection(provider.slug, apiKey);
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'فشل الاتصال',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) return;

    setSaving(true);

    try {
      // Save credentials first
      saveProviderCredentials(provider.slug, apiKey);

      // Then save provider status
      saveProvider({
        slug: provider.slug,
        status: 'active',
        hasCredentials: true,
        lastTestAt: new Date().toISOString(),
        lastTestStatus: 'success',
      });

      console.log(`✅ ${provider.name} connected successfully with API key`);

      setApiKey('');
      setShowConfig(false);
      setTestResult({
        success: true,
        message: `تم ربط ${provider.name} بنجاح! يمكنك الآن استخدامه للإثراء.`,
      });
      onUpdate();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'فشل الحفظ',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('هل تريد فصل هذا المزود؟')) return;

    try {
      disconnectProvider(provider.slug);
      onUpdate();
    } catch (err) {
      console.error('Failed to disconnect:', err);
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
    (c) => provider.capabilities[c.key]
  );

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
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {provider.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-900">{provider.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    isConnected
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isConnected ? 'bg-green-500' : 'bg-slate-400'
                    }`}
                  />
                  {isConnected ? 'متصل' : 'غير متصل'}
                </span>
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
              <Icons.Contacts size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Capabilities */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
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

      {/* Description */}
      {provider.description && (
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-sm text-slate-600 line-clamp-2">
            {provider.description}
          </p>
        </div>
      )}

      {/* Stats (if connected) */}
      {isConnected && (
        <div className="px-4 py-3 border-b border-slate-100 bg-blue-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">إجمالي الاستخدام</span>
            <span className="font-medium text-slate-900">
              {(provider.totalCreditsUsed || 0).toLocaleString()} رصيد
            </span>
          </div>
          {provider.lastTestAt && (
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-500">آخر اختبار</span>
              <span
                className={
                  provider.lastTestStatus === 'success'
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {provider.lastTestStatus === 'success' ? 'نجح' : 'فشل'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Config Panel */}
      {showConfig && (
        <div className="px-4 py-4 border-b border-slate-100 bg-slate-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                مفتاح API
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="أدخل مفتاح API..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  testResult.success
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <p>{testResult.message}</p>
                {testResult.creditsRemaining !== undefined && (
                  <p className="mt-1 font-medium">
                    الرصيد المتبقي: {testResult.creditsRemaining.toLocaleString()}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleTestConnection}
                disabled={!apiKey.trim() || testing}
                className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testing ? 'جاري الاختبار...' : 'اختبار الاتصال'}
              </button>
              <button
                onClick={handleSave}
                disabled={!apiKey.trim() || !testResult?.success || saving}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex gap-2">
        {isConnected ? (
          <>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
            >
              تحديث المفتاح
            </button>
            <button
              onClick={handleDisconnect}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
            >
              فصل
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {showConfig ? 'إلغاء' : 'ربط'}
          </button>
        )}
      </div>
    </div>
  );
};
