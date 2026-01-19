import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Contact } from '../../types';
import ContactsTable from './ContactsTable';
import PipelineKanban from './PipelineKanban';
import SegmentsList from './SegmentsList';
import AddContactsWizard from './AddContactsWizard';
import CampaignExportModal from './CampaignExportModal';
import LeadModal from './LeadModal';

const ContactsManager: React.FC = () => {
  const { contacts, addContact, updateContact } = useData();
  const [activeTab, setActiveTab] = useState<'contacts' | 'segments' | 'pipeline'>('contacts');
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Lead Modal State
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('view');
  const [showLeadModal, setShowLeadModal] = useState(false);

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setModalMode('view');
    setShowLeadModal(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setModalMode('edit');
    setShowLeadModal(true);
  };

  const handleSaveContact = async (contact: Contact) => {
    try {
      if (modalMode === 'add') {
        await addContact(contact);
      } else {
        await updateContact(contact.id, contact);
      }
      setShowLeadModal(false);
    } catch (e) {
      console.error("Failed to save contact", e);
      alert("حدث خطأ أثناء حفظ البيانات");
    }
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
            onClick={() => {
              setSelectedContact(undefined);
              setModalMode('add');
              setShowLeadModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            إضافة ليد يدوي
          </button>
          <button
            onClick={() => setShowAddWizard(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            جلب آلي (Wizard)
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
        {activeTab === 'contacts' && (
          <ContactsTable
            contacts={contacts}
            onView={handleViewContact}
            onEdit={handleEditContact}
          />
        )}
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

      {showLeadModal && (
        <LeadModal
          mode={modalMode}
          contact={selectedContact}
          onClose={() => setShowLeadModal(false)}
          onSave={handleSaveContact}
        />
      )}
    </div>
  );
};

export default ContactsManager;
