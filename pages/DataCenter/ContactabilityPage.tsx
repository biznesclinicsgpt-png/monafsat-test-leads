/**
 * Contactability Page
 *
 * Stage 5: Email & Phone Enrichment
 *
 * Features:
 * - Email finder (gated: ICP Yes + Score >= 60)
 * - Email verifier
 * - Phone finder (VIP only: Score >= 85)
 * - Channel readiness overview
 */

import React, { useState } from 'react';
import { Icons } from '@/constants';

const ContactabilityPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'email' | 'phone' | 'channels'>('overview');

  // Stats
  const stats = {
    total_icp_yes: 8750,
    email_eligible: 7200,
    phone_eligible: 1200,
    has_email: 5400,
    email_verified: 4800,
    has_phone: 980,
    credits_used: 1250,
  };

  // Email enrichment queue
  const emailQueue = [
    { id: 1, name: 'قائمة VIP', count: 150, found: 142, verified: 138, status: 'completed' },
    { id: 2, name: 'مدراء التسويق', count: 320, found: 280, verified: 245, status: 'processing' },
    { id: 3, name: 'شركات الرياض', count: 450, found: 0, verified: 0, status: 'queued' },
  ];

  // Channel readiness
  const channelStats = [
    { channel: 'email', channel_ar: 'البريد الإلكتروني', icon: Icons.Email, ready: 4800, total: 8750, color: 'bg-blue-500' },
    { channel: 'linkedin', channel_ar: 'لينكد إن', icon: Icons.Globe, ready: 6200, total: 8750, color: 'bg-indigo-500' },
    { channel: 'whatsapp', channel_ar: 'واتساب', icon: Icons.WhatsApp, ready: 980, total: 8750, color: 'bg-green-500' },
    { channel: 'phone', channel_ar: 'الهاتف', icon: Icons.Phone, ready: 980, total: 8750, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-bold">5</span>
            طبقة التواصل
          </h2>
          <p className="text-slate-500 mt-1">إثراء البريد الإلكتروني والهاتف للعملاء المؤهلين</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <Icons.Email className="w-4 h-4" />
            بدء الإثراء
          </button>
        </div>
      </div>

      {/* Gating Rules Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
        <Icons.Shield className="w-8 h-8 text-blue-600" />
        <div>
          <p className="font-bold text-slate-900">قواعد البوابة (Gating)</p>
          <p className="text-sm text-slate-600">
            <span className="font-medium">البريد:</span> ICP = Yes + Score ≥ 60 |
            <span className="font-medium mr-3">الهاتف:</span> ICP = Yes + Score ≥ 85 (VIP فقط)
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 inline-flex">
        {[
          { id: 'overview', label: 'نظرة عامة', icon: Icons.Dashboard },
          { id: 'email', label: 'البريد', icon: Icons.Email },
          { id: 'phone', label: 'الهاتف', icon: Icons.Phone },
          { id: 'channels', label: 'القنوات', icon: Icons.Layers },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${activeTab === tab.id ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'}
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="مؤهل للبريد"
              value={stats.email_eligible.toLocaleString()}
              subtitle="Score ≥ 60"
              icon={Icons.Email}
              color="bg-blue-500"
            />
            <StatCard
              title="تم إيجاد البريد"
              value={stats.has_email.toLocaleString()}
              subtitle={`${Math.round(stats.has_email / stats.email_eligible * 100)}% من المؤهلين`}
              icon={Icons.Check}
              color="bg-green-500"
            />
            <StatCard
              title="مؤهل للهاتف (VIP)"
              value={stats.phone_eligible.toLocaleString()}
              subtitle="Score ≥ 85"
              icon={Icons.Phone}
              color="bg-purple-500"
            />
            <StatCard
              title="الرصيد المستخدم"
              value={stats.credits_used.toLocaleString()}
              subtitle="credits"
              icon={Icons.Zap}
              color="bg-amber-500"
            />
          </div>

          {/* Enrichment Funnel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">قمع الإثراء</h3>
            <div className="flex items-center justify-between">
              <FunnelStep
                label="ICP = Yes"
                count={stats.total_icp_yes}
                color="bg-green-500"
                percentage={100}
              />
              <Icons.ChevronLeft className="w-6 h-6 text-slate-300 rotate-180" />
              <FunnelStep
                label="مؤهل للبريد"
                count={stats.email_eligible}
                color="bg-blue-500"
                percentage={Math.round(stats.email_eligible / stats.total_icp_yes * 100)}
              />
              <Icons.ChevronLeft className="w-6 h-6 text-slate-300 rotate-180" />
              <FunnelStep
                label="تم إيجاد البريد"
                count={stats.has_email}
                color="bg-indigo-500"
                percentage={Math.round(stats.has_email / stats.email_eligible * 100)}
              />
              <Icons.ChevronLeft className="w-6 h-6 text-slate-300 rotate-180" />
              <FunnelStep
                label="بريد مُحقق"
                count={stats.email_verified}
                color="bg-purple-500"
                percentage={Math.round(stats.email_verified / stats.has_email * 100)}
              />
            </div>
          </div>

          {/* Channel Readiness */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">جاهزية القنوات</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {channelStats.map((channel) => (
                <div key={channel.channel} className="p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg text-white ${channel.color}`}>
                      <channel.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900">{channel.channel_ar}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{channel.ready.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${channel.color} rounded-full`}
                        style={{ width: `${(channel.ready / channel.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{Math.round(channel.ready / channel.total * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Email Tab */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          {/* Email Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="تم إيجاده"
              value={stats.has_email.toLocaleString()}
              icon={Icons.Email}
              color="bg-blue-500"
            />
            <StatCard
              title="تم التحقق"
              value={stats.email_verified.toLocaleString()}
              icon={Icons.Shield}
              color="bg-green-500"
            />
            <StatCard
              title="معدل النجاح"
              value={`${Math.round(stats.has_email / stats.email_eligible * 100)}%`}
              icon={Icons.Opportunities}
              color="bg-purple-500"
            />
          </div>

          {/* Email Queue */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">قائمة إثراء البريد</h3>
            <div className="space-y-4">
              {emailQueue.map((item) => (
                <div key={item.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <p className="text-sm text-slate-500">{item.count} سجل</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.status === 'completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status === 'completed' ? 'مكتمل' :
                       item.status === 'processing' ? 'قيد المعالجة' : 'في الانتظار'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{item.found}</p>
                      <p className="text-xs text-slate-500">تم إيجاده</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{item.verified}</p>
                      <p className="text-xs text-slate-500">تم التحقق</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-600">{item.count - item.found}</p>
                      <p className="text-xs text-slate-500">لم يُعثر عليه</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Provider Waterfall */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">ترتيب المزودين (Waterfall)</h3>
            <div className="flex items-center gap-4">
              {['Hunter', 'Prospeo', 'Apollo'].map((provider, i) => (
                <React.Fragment key={provider}>
                  <div className="flex-1 p-4 border border-slate-200 rounded-lg text-center">
                    <p className="font-bold text-slate-900">{provider}</p>
                    <p className="text-xs text-slate-500">1 credit/email</p>
                  </div>
                  {i < 2 && <Icons.ChevronLeft className="w-5 h-5 text-slate-300 rotate-180" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phone Tab */}
      {activeTab === 'phone' && (
        <div className="space-y-6">
          {/* VIP Gate Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-4">
            <span className="text-3xl">👑</span>
            <div>
              <p className="font-bold text-purple-900">VIP فقط</p>
              <p className="text-sm text-purple-700">إثراء الهاتف متاح فقط للعملاء بتقييم 85+ (10 credits لكل رقم)</p>
            </div>
          </div>

          {/* Phone Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="مؤهل VIP"
              value={stats.phone_eligible.toLocaleString()}
              icon={Icons.Star}
              color="bg-purple-500"
            />
            <StatCard
              title="تم إيجاد الهاتف"
              value={stats.has_phone.toLocaleString()}
              icon={Icons.Phone}
              color="bg-green-500"
            />
            <StatCard
              title="معدل النجاح"
              value={`${Math.round(stats.has_phone / stats.phone_eligible * 100)}%`}
              icon={Icons.Opportunities}
              color="bg-amber-500"
            />
          </div>

          {/* Phone List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">أرقام VIP</h3>
              <button className="text-sm text-brand font-medium">تصدير</button>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { name: 'محمد العمري', phone: '+966 5XX XXX XX01', type: 'Mobile', score: 95 },
                { name: 'سارة الحربي', phone: '+966 5XX XXX XX02', type: 'Mobile', score: 92 },
                { name: 'خالد المطيري', phone: '+966 5XX XXX XX03', type: 'Direct', score: 88 },
              ].map((lead, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-lg">👑</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-500">{lead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{lead.type}</span>
                    <span className="font-bold text-purple-600">{lead.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Channels Tab */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channelStats.map((channel) => (
              <div key={channel.channel} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl text-white ${channel.color}`}>
                    <channel.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{channel.channel_ar}</h3>
                    <p className="text-sm text-slate-500">
                      {channel.ready.toLocaleString()} جاهز من {channel.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${channel.color} rounded-full`}
                    style={{ width: `${(channel.ready / channel.total) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">معدل الجاهزية</span>
                  <span className="font-bold text-slate-900">{Math.round(channel.ready / channel.total * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card
const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  color: string;
}> = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
    <div className={`p-3 rounded-xl text-white ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

// Funnel Step
const FunnelStep: React.FC<{
  label: string;
  count: number;
  color: string;
  percentage: number;
}> = ({ label, count, color, percentage }) => (
  <div className="text-center flex-1">
    <div className={`${color} text-white py-4 rounded-xl mb-2`}>
      <p className="text-2xl font-bold">{count.toLocaleString()}</p>
    </div>
    <p className="text-sm font-medium text-slate-700">{label}</p>
    <p className="text-xs text-slate-500">{percentage}%</p>
  </div>
);

export default ContactabilityPage;
