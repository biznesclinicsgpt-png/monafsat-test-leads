/**
 * Enrichment Page
 *
 * Stage 2: AI Agents Enrichment
 *
 * Features:
 * - Agent status and configuration
 * - Enrichment queue management
 * - Provider waterfall settings
 * - Cost tracking
 */

import React, { useState } from 'react';
import { Icons } from '@/constants';

interface EnrichmentAgent {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  icon: any;
  status: 'active' | 'idle' | 'disabled';
  providers: string[];
  processed: number;
  pending: number;
  credits_used: number;
}

const EnrichPage = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents: EnrichmentAgent[] = [
    {
      id: 'person',
      name: 'Person Agent',
      name_ar: 'وكيل الشخص',
      description: 'إثراء بيانات الشخص: المسمى، الأقدمية، القسم',
      icon: Icons.User,
      status: 'active',
      providers: ['Apollo', 'Prospeo'],
      processed: 8450,
      pending: 1200,
      credits_used: 450,
    },
    {
      id: 'company',
      name: 'Company Agent',
      name_ar: 'وكيل الشركة',
      description: 'إثراء بيانات الشركة: القطاع، الحجم، الموقع',
      icon: Icons.Building,
      status: 'active',
      providers: ['Apollo'],
      processed: 6200,
      pending: 800,
      credits_used: 320,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Agent',
      name_ar: 'وكيل لينكد إن',
      description: 'التحقق من ملف لينكد إن وإثرائه',
      icon: Icons.Globe,
      status: 'idle',
      providers: ['Prospeo', 'PhantomBuster'],
      processed: 4500,
      pending: 0,
      credits_used: 200,
    },
  ];

  const enrichmentQueue = [
    { id: 1, name: 'دفعة مدراء التسويق', count: 250, status: 'processing', progress: 65 },
    { id: 2, name: 'شركات الرياض', count: 180, status: 'queued', progress: 0 },
    { id: 3, name: 'قائمة VIP', count: 50, status: 'completed', progress: 100 },
  ];

  const providerStats = [
    { name: 'Apollo', credits_used: 520, credits_remaining: 4480, status: 'active' },
    { name: 'Prospeo', credits_used: 280, credits_remaining: 2720, status: 'active' },
    { name: 'Hunter', credits_used: 150, credits_remaining: 850, status: 'low' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm font-bold">2</span>
            إثراء البيانات
          </h2>
          <p className="text-slate-500 mt-1">AI Agents لإثراء بيانات العملاء المحتملين</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/20">
            <Icons.Zap className="w-4 h-4" />
            بدء الإثراء
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="تم إثراؤه"
          value="12,300"
          icon={Icons.Check}
          color="bg-green-500"
        />
        <StatCard
          title="في الانتظار"
          value="2,000"
          icon={Icons.Clock}
          color="bg-blue-500"
        />
        <StatCard
          title="الرصيد المستخدم"
          value="970"
          icon={Icons.Zap}
          color="bg-purple-500"
        />
        <StatCard
          title="معدل النجاح"
          value="94%"
          icon={Icons.Opportunities}
          color="bg-amber-500"
        />
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent.id)}
            className={`
              bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all
              ${selectedAgent === agent.id ? 'border-brand ring-2 ring-brand/20' : 'border-slate-200 hover:border-brand/50'}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                agent.status === 'active' ? 'bg-green-100 text-green-600' :
                agent.status === 'idle' ? 'bg-slate-100 text-slate-500' :
                'bg-red-100 text-red-600'
              }`}>
                <agent.icon className="w-6 h-6" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                agent.status === 'active' ? 'bg-green-100 text-green-700' :
                agent.status === 'idle' ? 'bg-slate-100 text-slate-600' :
                'bg-red-100 text-red-700'
              }`}>
                {agent.status === 'active' ? 'نشط' : agent.status === 'idle' ? 'خامل' : 'معطل'}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 mb-1">{agent.name_ar}</h3>
            <p className="text-sm text-slate-500 mb-4">{agent.description}</p>

            <div className="flex items-center gap-2 mb-4">
              {agent.providers.map((provider) => (
                <span key={provider} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                  {provider}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900">{agent.processed.toLocaleString()}</p>
                <p className="text-xs text-slate-500">تم معالجته</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{agent.pending.toLocaleString()}</p>
                <p className="text-xs text-slate-500">في الانتظار</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{agent.credits_used}</p>
                <p className="text-xs text-slate-500">رصيد</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Queue & Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrichment Queue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">قائمة الإثراء</h3>
          <div className="space-y-4">
            {enrichmentQueue.map((item) => (
              <div key={item.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.count} سجل</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    item.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {item.status === 'processing' ? 'قيد المعالجة' :
                     item.status === 'completed' ? 'مكتمل' : 'في الانتظار'}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 text-left">{item.progress}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Provider Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">حالة المزودين</h3>
          <div className="space-y-4">
            {providerStats.map((provider) => (
              <div key={provider.name} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      provider.status === 'active' ? 'bg-green-500' :
                      provider.status === 'low' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <h4 className="font-bold text-slate-900">{provider.name}</h4>
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {provider.credits_remaining.toLocaleString()} متبقي
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      provider.status === 'low' ? 'bg-yellow-500' : 'bg-brand'
                    }`}
                    style={{ width: `${(provider.credits_remaining / (provider.credits_used + provider.credits_remaining)) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  استخدم {provider.credits_used} من {provider.credits_used + provider.credits_remaining}
                </p>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 p-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
            <Icons.Settings className="w-4 h-4" />
            إعدادات المزودين
          </button>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{ title: string; value: string; icon: any; color: string }> = ({
  title,
  value,
  icon: Icon,
  color,
}) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl text-white ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

export default EnrichPage;
