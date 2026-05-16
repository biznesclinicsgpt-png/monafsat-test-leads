/**
 * Data Center Layout
 *
 * Pipeline-based navigation for the GTM Data Center
 * Stages 0-6: Sources → Normalize → Enrich → ICP → Score → Contact → Campaign
 */

import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '../constants';

const DataCenterLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Pipeline stages as tabs
  const pipelineTabs = [
    {
      id: 'overview',
      label: 'نظرة عامة',
      path: '/app/data-center',
      exact: true,
      icon: Icons.Dashboard,
      stage: null,
    },
    {
      id: 'import',
      label: 'مصادر البيانات',
      path: '/app/data-center/import',
      icon: Icons.Layers,
      stage: '0-1',
      description: 'Find • Import • Signals',
    },
    {
      id: 'enrich',
      label: 'الإثراء',
      path: '/app/data-center/enrich',
      icon: Icons.Zap,
      stage: '2',
      description: 'AI Agents',
    },
    {
      id: 'icp',
      label: 'بوابة ICP',
      path: '/app/data-center/icp',
      icon: Icons.Shield,
      stage: '3-4',
      description: 'التحقق والتقييم',
    },
    {
      id: 'contactability',
      label: 'التواصل',
      path: '/app/data-center/contactability',
      icon: Icons.Email,
      stage: '5',
      description: 'البريد والهاتف',
    },
    {
      id: 'campaign',
      label: 'الحملات',
      path: '/app/data-center/campaign',
      icon: Icons.Send,
      stage: '6',
      description: 'الإعداد والتصدير',
    },
  ];

  // Settings/utility tabs
  const utilityTabs = [
    {
      id: 'database',
      label: 'قاعدة البيانات',
      path: '/app/data-center/database',
      icon: Icons.Database,
    },
    {
      id: 'providers-status',
      label: 'حالة المزودين',
      path: '/app/data-center/providers-status',
      icon: Icons.Zap,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-6 pb-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white">
                <Icons.Database className="w-5 h-5" />
              </span>
              مركز البيانات
            </h1>
            <p className="text-slate-500 mt-1 mr-13">
              خط أنابيب GTM الكامل - من المصادر إلى الحملات
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/app/data-center/import')}
              className="px-4 py-2 bg-brand text-white rounded-lg font-bold transition-colors flex items-center gap-2 hover:bg-brand-dark shadow-lg shadow-brand/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              مصدر جديد
            </button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Icons.Settings className="w-4 h-4" />
              الإعدادات
            </button>
          </div>
        </div>

        {/* Pipeline Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0">
          {/* Pipeline Tabs */}
          {pipelineTabs.map((tab, index) => {
            const isActive = tab.exact
              ? location.pathname === tab.path
              : location.pathname.startsWith(tab.path);

            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                end={tab.exact}
                className={`
                  relative flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap group
                  ${isActive
                    ? 'border-brand text-brand bg-brand-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                `}
              >
                {/* Stage indicator */}
                {tab.stage && (
                  <span className={`
                    text-[10px] font-bold px-1.5 py-0.5 rounded
                    ${isActive ? 'bg-brand text-white' : 'bg-slate-200 text-slate-600'}
                  `}>
                    {tab.stage}
                  </span>
                )}
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>

                {/* Arrow connector for pipeline stages */}
                {index > 0 && index < pipelineTabs.length && tab.stage && (
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-l-2 border-slate-200 transform rotate-[135deg]" />
                )}
              </NavLink>
            );
          })}

          {/* Separator */}
          <div className="w-px h-8 bg-slate-200 mx-2" />

          {/* Utility Tabs */}
          {utilityTabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);

            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap
                  ${isActive
                    ? 'border-brand text-brand'
                    : 'border-transparent text-slate-500 hover:text-slate-700'}
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DataCenterLayout;
