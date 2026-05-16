/**
 * Integrations Hub - Admin Only
 *
 * Central management for all provider integrations, waterfall routing,
 * wallet/credits, and compliance policies.
 */

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plug, GitBranch, Wallet, Shield } from 'lucide-react';
import ConnectorsTab from './ConnectorsTab';
import RoutingTab from './RoutingTab';
import WalletTab from './WalletTab';
import PoliciesTab from './PoliciesTab';

const tabs = [
  {
    id: 'connectors',
    label: 'الموصلات',
    labelEn: 'Connectors',
    icon: Plug,
    description: 'إدارة ربط المزودين',
  },
  {
    id: 'routing',
    label: 'التوجيه',
    labelEn: 'Routing',
    icon: GitBranch,
    description: 'تسلسل Waterfall',
  },
  {
    id: 'wallet',
    label: 'المحفظة',
    labelEn: 'Wallet',
    icon: Wallet,
    description: 'الرصيد والتكلفة',
  },
  {
    id: 'policies',
    label: 'السياسات',
    labelEn: 'Policies',
    icon: Shield,
    description: 'الامتثال والقواعد',
  },
];

const IntegrationsHub = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'connectors';

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'connectors':
        return <ConnectorsTab />;
      case 'routing':
        return <RoutingTab />;
      case 'wallet':
        return <WalletTab />;
      case 'policies':
        return <PoliciesTab />;
      default:
        return <ConnectorsTab />;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Plug className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">مركز التكاملات</h1>
            <p className="text-slate-500">إدارة شاملة للمزودين والتوجيه والرصيد</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center gap-3 px-6 py-4 border-b-2 transition-all whitespace-nowrap flex-1
                  ${isActive
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : ''} />
                <div className="text-right">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs opacity-70">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default IntegrationsHub;
