/**
 * Data Center Overview Page
 *
 * Pipeline dashboard showing:
 * - Stage-by-stage progress
 * - Key metrics
 * - Recent activity
 * - Quick actions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/constants';
import { PipelineStages, StageStats } from '@/components/DataCenter/PipelineStages';

const DataCenterPage = () => {
  const navigate = useNavigate();

  // Mock pipeline stats - in real app, fetch from API
  const pipelineStats: StageStats[] = [
    { stage: 0, name: 'Sources', name_ar: 'المصادر', count: 15420, status: 'completed', percentage: 100 },
    { stage: 1, name: 'Normalize', name_ar: 'التطبيع', count: 14850, status: 'completed', percentage: 96 },
    { stage: 2, name: 'Enrich', name_ar: 'الإثراء', count: 12300, status: 'completed', percentage: 83 },
    { stage: 3, name: 'ICP Gate', name_ar: 'بوابة ICP', count: 8750, status: 'in_progress', percentage: 71 },
    { stage: 4, name: 'Scoring', name_ar: 'التقييم', count: 8200, status: 'completed', percentage: 94 },
    { stage: 5, name: 'Contact', name_ar: 'التواصل', count: 5400, status: 'in_progress', percentage: 66 },
    { stage: 6, name: 'Campaign', name_ar: 'الحملات', count: 3100, status: 'pending', percentage: 57 },
  ];

  // Summary stats
  const summaryStats = [
    {
      title: 'إجمالي السجلات',
      value: '15,420',
      icon: Icons.Database,
      color: 'bg-blue-500',
      change: '+12%',
      changeUp: true,
    },
    {
      title: 'ICP متوافق (Yes)',
      value: '8,750',
      icon: Icons.Shield,
      color: 'bg-green-500',
      change: '+8%',
      changeUp: true,
    },
    {
      title: 'جاهز للحملات',
      value: '3,100',
      icon: Icons.Send,
      color: 'bg-purple-500',
      change: '+15%',
      changeUp: true,
    },
    {
      title: 'معدل التحويل',
      value: '20%',
      icon: Icons.Opportunities,
      color: 'bg-amber-500',
      change: '+3%',
      changeUp: true,
    },
  ];

  // Recent imports
  const recentImports = [
    { id: 1, name: 'مدراء التنفيذ - قطاع المقاولات', source: 'Sales Navigator', count: 450, status: 'completed', time: 'منذ ساعتين' },
    { id: 2, name: 'شركات تقنية - الرياض', source: 'Apollo API', count: 1200, status: 'processing', time: 'منذ 5 ساعات' },
    { id: 3, name: 'قائمة العملاء المحتملين', source: 'CSV Upload', count: 320, status: 'completed', time: 'أمس' },
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'استيراد جديد',
      desc: 'CSV, Apollo, SalesNav',
      icon: Icons.Folder,
      path: '/app/data-center/import',
      color: 'bg-blue-500',
    },
    {
      title: 'إثراء البيانات',
      desc: 'AI Agents',
      icon: Icons.Zap,
      path: '/app/data-center/enrich',
      color: 'bg-purple-500',
    },
    {
      title: 'تحقق ICP',
      desc: 'بوابة التوافق',
      icon: Icons.Shield,
      path: '/app/data-center/icp',
      color: 'bg-green-500',
    },
    {
      title: 'تصدير للحملة',
      desc: 'Smartlead, Lemlist',
      icon: Icons.Send,
      path: '/app/data-center/campaign',
      color: 'bg-amber-500',
    },
  ];

  const handleStageClick = (stage: number) => {
    const stageRoutes: Record<number, string> = {
      0: '/app/data-center/import',
      1: '/app/data-center/import',
      2: '/app/data-center/enrich',
      3: '/app/data-center/icp',
      4: '/app/data-center/icp',
      5: '/app/data-center/contactability',
      6: '/app/data-center/campaign',
    };
    navigate(stageRoutes[stage] || '/app/data-center');
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">خط أنابيب GTM</h2>
            <p className="text-sm text-slate-500">تتبع تقدم البيانات عبر المراحل</p>
          </div>
          <button className="text-sm text-brand font-medium hover:underline flex items-center gap-1">
            <Icons.Eye className="w-4 h-4" />
            عرض التفاصيل
          </button>
        </div>

        <PipelineStages
          stats={pipelineStats}
          onStageClick={handleStageClick}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start justify-between"
          >
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${stat.changeUp ? 'text-green-600' : 'text-red-500'}`}>
                <span>{stat.change}</span>
                <span className="text-slate-400 font-normal">مقارنة بالأسبوع الماضي</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl text-white ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">إجراءات سريعة</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-brand hover:bg-brand-50/50 transition-all text-right group"
              >
                <div className={`p-3 rounded-xl text-white ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{action.title}</h4>
                  <p className="text-xs text-slate-500">{action.desc}</p>
                </div>
                <Icons.ChevronLeft className="w-5 h-5 text-slate-300 mr-auto group-hover:text-brand transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Imports */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">أحدث عمليات الاستيراد</h3>
            <button
              onClick={() => navigate('/app/data-center/import')}
              className="text-sm text-brand font-medium hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-3">
            {recentImports.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.source}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-700">{item.count.toLocaleString()} سجل</p>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Import CTA */}
          <button
            onClick={() => navigate('/app/data-center/import')}
            className="w-full mt-4 p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-brand hover:text-brand hover:bg-brand-50/50 transition-all flex items-center justify-center gap-2"
          >
            <Icons.Folder className="w-5 h-5" />
            <span className="font-medium">استيراد ملف جديد</span>
          </button>
        </div>
      </div>

      {/* ICP Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ICP Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">توزيع حالة ICP</h3>
          <div className="space-y-4">
            <ICPBar label="متوافق (Yes)" count={8750} total={15420} color="bg-green-500" />
            <ICPBar label="غير متوافق (No)" count={4200} total={15420} color="bg-red-500" />
            <ICPBar label="غير محدد (Unknown)" count={2470} total={15420} color="bg-slate-400" />
          </div>
        </div>

        {/* ICP Tier Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">توزيع تصنيف العملاء</h3>
          <div className="space-y-4">
            <ICPBar label="VIP (85+)" count={1200} total={8750} color="bg-purple-500" />
            <ICPBar label="Priority (70-84)" count={2800} total={8750} color="bg-blue-500" />
            <ICPBar label="Standard (50-69)" count={3500} total={8750} color="bg-amber-500" />
            <ICPBar label="Low (<50)" count={1250} total={8750} color="bg-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ICP Bar Component
const ICPBar: React.FC<{ label: string; count: number; total: number; color: string }> = ({
  label,
  count,
  total,
  color,
}) => {
  const percentage = Math.round((count / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">{count.toLocaleString()}</span>
          <span className="text-xs text-slate-500">({percentage}%)</span>
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default DataCenterPage;
