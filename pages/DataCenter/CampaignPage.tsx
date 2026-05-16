/**
 * Campaign Prep Page
 *
 * Stage 6: Campaign Prep & Export
 *
 * Features:
 * - Template management
 * - Personalization preview
 * - Export to channels (Smartlead, Lemlist, etc.)
 * - Export history
 */

import React, { useState } from 'react';
import { Icons } from '@/constants';

interface Template {
  id: string;
  name: string;
  channel: 'email' | 'linkedin' | 'whatsapp';
  language: 'ar' | 'en';
  subject?: string;
  preview: string;
}

const CampaignPage = () => {
  const [activeTab, setActiveTab] = useState<'export' | 'templates' | 'history'>('export');
  const [selectedChannel, setSelectedChannel] = useState<string>('email');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Export destinations
  const exportDestinations = [
    { id: 'smartlead', name: 'Smartlead', icon: '📧', color: 'bg-blue-500', description: 'حملات بريد إلكتروني' },
    { id: 'lemlist', name: 'Lemlist', icon: '💌', color: 'bg-purple-500', description: 'تخصيص متقدم' },
    { id: 'instantly', name: 'Instantly', icon: '⚡', color: 'bg-amber-500', description: 'إرسال سريع' },
    { id: 'csv', name: 'CSV', icon: '📁', color: 'bg-slate-500', description: 'ملف محلي' },
  ];

  // Available channels
  const channels = [
    { id: 'email', name: 'البريد الإلكتروني', icon: Icons.Email, ready: 4800, color: 'bg-blue-500' },
    { id: 'linkedin', name: 'لينكد إن', icon: Icons.Globe, ready: 6200, color: 'bg-indigo-500' },
    { id: 'whatsapp', name: 'واتساب', icon: Icons.WhatsApp, ready: 980, color: 'bg-green-500' },
  ];

  // Templates
  const templates: Template[] = [
    {
      id: '1',
      name: 'تواصل بارد - تعريف',
      channel: 'email',
      language: 'ar',
      subject: 'فرصة تعاون مع {{company}}',
      preview: 'مرحباً {{first_name}}، لاحظت دورك المتميز في {{company}}...',
    },
    {
      id: '2',
      name: 'Cold Outreach - Introduction',
      channel: 'email',
      language: 'en',
      subject: 'Quick question for {{first_name}}',
      preview: 'Hi {{first_name}}, I noticed your role at {{company}}...',
    },
    {
      id: '3',
      name: 'طلب اتصال لينكد إن',
      channel: 'linkedin',
      language: 'ar',
      preview: 'مرحباً {{first_name}}، يسعدني التواصل معك...',
    },
  ];

  // Export history
  const exportHistory = [
    { id: 1, name: 'قائمة VIP - Email', destination: 'Smartlead', count: 450, date: 'منذ ساعتين', status: 'completed' },
    { id: 2, name: 'مدراء التسويق', destination: 'Lemlist', count: 320, date: 'أمس', status: 'completed' },
    { id: 3, name: 'شركات الرياض', destination: 'CSV', count: 1200, date: 'منذ 3 أيام', status: 'completed' },
  ];

  // Personalization tokens
  const tokens = [
    { token: '{{first_name}}', label: 'الاسم الأول', example: 'محمد' },
    { token: '{{company}}', label: 'الشركة', example: 'شركة التقنية' },
    { token: '{{title}}', label: 'المسمى', example: 'مدير التسويق' },
    { token: '{{industry}}', label: 'القطاع', example: 'تقنية المعلومات' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-sm font-bold">6</span>
            إعداد الحملات والتصدير
          </h2>
          <p className="text-slate-500 mt-1">تجهيز البيانات للحملات التسويقية</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20">
            <Icons.Send className="w-4 h-4" />
            تصدير جديد
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 inline-flex">
        {[
          { id: 'export', label: 'التصدير', icon: Icons.Send },
          { id: 'templates', label: 'القوالب', icon: Icons.File },
          { id: 'history', label: 'السجل', icon: Icons.Clock },
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

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Config */}
          <div className="lg:col-span-2 space-y-6">
            {/* Channel Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">اختر القناة</h3>
              <div className="grid grid-cols-3 gap-4">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`
                      p-4 rounded-xl border-2 transition-all text-center
                      ${selectedChannel === channel.id
                        ? 'border-brand bg-brand-50'
                        : 'border-slate-200 hover:border-brand/50'}
                    `}
                  >
                    <div className={`w-12 h-12 rounded-xl ${channel.color} text-white flex items-center justify-center mx-auto mb-2`}>
                      <channel.icon className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-slate-900">{channel.name}</p>
                    <p className="text-sm text-slate-500">{channel.ready.toLocaleString()} جاهز</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">اختر القالب (اختياري)</h3>
              <div className="space-y-3">
                {templates.filter(t => t.channel === selectedChannel).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`
                      w-full p-4 rounded-lg border-2 text-right transition-all
                      ${selectedTemplate === template.id
                        ? 'border-brand bg-brand-50'
                        : 'border-slate-200 hover:border-brand/50'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900">{template.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        template.language === 'ar' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {template.language === 'ar' ? 'عربي' : 'English'}
                      </span>
                    </div>
                    {template.subject && (
                      <p className="text-sm text-slate-600 mb-1">الموضوع: {template.subject}</p>
                    )}
                    <p className="text-sm text-slate-500">{template.preview}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Destination */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">وجهة التصدير</h3>
              <div className="grid grid-cols-4 gap-4">
                {exportDestinations.map((dest) => (
                  <button
                    key={dest.id}
                    className="p-4 border border-slate-200 rounded-xl hover:border-brand hover:bg-brand-50/50 transition-all text-center group"
                  >
                    <span className="text-3xl block mb-2">{dest.icon}</span>
                    <p className="font-bold text-slate-900">{dest.name}</p>
                    <p className="text-xs text-slate-500">{dest.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {/* Export Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">ملخص التصدير</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">القناة</span>
                  <span className="font-bold text-slate-900">
                    {channels.find(c => c.id === selectedChannel)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">السجلات الجاهزة</span>
                  <span className="font-bold text-slate-900">
                    {channels.find(c => c.id === selectedChannel)?.ready.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">القالب</span>
                  <span className="font-bold text-slate-900">
                    {selectedTemplate
                      ? templates.find(t => t.id === selectedTemplate)?.name
                      : 'بدون قالب'}
                  </span>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-3 bg-brand text-white rounded-lg font-bold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2">
                <Icons.Send className="w-4 h-4" />
                بدء التصدير
              </button>
            </div>

            {/* Personalization Tokens */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">رموز التخصيص</h3>
              <div className="space-y-2">
                {tokens.map((token) => (
                  <div key={token.token} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <code className="text-sm text-brand font-mono">{token.token}</code>
                    <span className="text-xs text-slate-500">{token.example}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">قوالب الحملات</h3>
            <button className="px-4 py-2 bg-brand text-white rounded-lg font-bold hover:bg-brand-dark flex items-center gap-2">
              <Icons.Edit className="w-4 h-4" />
              قالب جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    template.channel === 'email' ? 'bg-blue-100 text-blue-700' :
                    template.channel === 'linkedin' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {template.channel === 'email' ? 'بريد' :
                     template.channel === 'linkedin' ? 'لينكد إن' : 'واتساب'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    template.language === 'ar' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {template.language === 'ar' ? 'عربي' : 'EN'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{template.name}</h4>
                {template.subject && (
                  <p className="text-sm text-slate-600 mb-2">📨 {template.subject}</p>
                )}
                <p className="text-sm text-slate-500 line-clamp-2">{template.preview}</p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button className="flex-1 px-3 py-2 text-sm text-brand font-medium hover:bg-brand-50 rounded-lg">
                    تعديل
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-lg">
                    نسخ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">سجل التصدير</h3>
            <button className="text-sm text-brand font-medium">تحميل الكل</button>
          </div>
          <div className="divide-y divide-slate-100">
            {exportHistory.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded">
                    <Icons.Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.destination} • {item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-700">{item.count.toLocaleString()} سجل</span>
                  <button className="p-2 text-slate-400 hover:text-brand">
                    <Icons.ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignPage;
