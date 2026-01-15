
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import ContactsTable from './ContactsTable';
import PipelineKanban from './PipelineKanban';
import SegmentsList from './SegmentsList';
import AddContactsWizard from './AddContactsWizard';
import CampaignExportModal from './CampaignExportModal';

const ContactsManager: React.FC = () => {
  const { contacts, addContact, updateContact } = useData();
  const [activeTab, setActiveTab] = useState<'contacts' | 'segments' | 'pipeline'>('contacts');
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Adapters for legacy components needing setContacts
  // Ideally PipelineKanban should be refactored too, but this bridges the gap for now
  const handleUpdateContacts = (newContacts: any) => {
    // This is a bit tricky since setContacts expects the full array
    // We should rely on specific update/add methods, but if child components rewrite the whole array,
    // we need to be careful. For now, assuming PipelineKanban calls a precise update function is better.
    // However, PipelineKanban likely does setContacts(prev => ...).
    // Let's defer deep refactor of PipelineKanban and update it in Phase 2.
    // For now, this component is just consuming context.
    console.warn("setContacts was called but should be handled via context actions");
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-slate-800">إدارة الليدات وجهات الاتصال</h1>
          <p className="text-slate-500 text-sm">قم بتصفية وتأهيل الليدات قبل تحويلها إلى صفقات في البايب لاين.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            تصدير حملة
          </button>
          <button
            onClick={() => setShowAddWizard(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            جلب ليدات جديدة
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'contacts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          جدول جهات الاتصال
        </button>
        <button
          onClick={() => setActiveTab('segments')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'segments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          الشرائح الذكية
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'pipeline' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          مسار التحويل (Pipeline)
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
        {activeTab === 'contacts' && <ContactsTable contacts={contacts} />}
        {activeTab === 'segments' && (
          <SegmentsList
            onViewContacts={() => setActiveTab('contacts')}
            onExportCampaign={() => setShowExportModal(true)}
          />
        )}
        {activeTab === 'pipeline' && (
          <PipelineKanban
            onAddCard={() => setShowAddWizard(true)}
          />
        )}
      </div>

      {/* Modals */}
      {showAddWizard && <AddContactsWizard onClose={() => setShowAddWizard(false)} />}
      {showExportModal && <CampaignExportModal contactCount={contacts.length} onClose={() => setShowExportModal(false)} />}
    </div>
  );
};

export default ContactsManager;
