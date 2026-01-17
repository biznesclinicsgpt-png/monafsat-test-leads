import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PipelineStage, Contact } from '../types';
import ContactsTable from '../components/Contacts/ContactsTable';
import LeadModal from '../components/Contacts/LeadModal';

const LeadsPage = () => {
    const { contacts, addContact, updateContact } = useData();
    const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('view');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter contacts that are considered "Leads" (before conversation)
    const leads = contacts.filter(contact =>
        [
            PipelineStage.NEW,
            PipelineStage.ICP_VERIFIED,
            PipelineStage.HIGH_FIT,
            PipelineStage.READY_TO_OUTREACH
        ].includes(contact.stage)
    );

    const handleAdd = () => {
        setSelectedContact(undefined);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleEdit = (contact: Contact) => {
        setSelectedContact(contact);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleView = (contact: Contact) => {
        setSelectedContact(contact);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleSave = (contact: Contact) => {
        if (modalMode === 'add') {
            addContact(contact);
        } else {
            updateContact(contact.id, contact);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">العملاء المحتملين (Leads)</h1>
                    <p className="text-slate-500 text-sm">قائمة العملاء المحتملين الذين لم يتم التواصل معهم بعد.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold">
                        {leads.length} عميل محتمل
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        إضافة عميل
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                {leads.length > 0 ? (
                    <ContactsTable
                        contacts={leads}
                        onView={handleView}
                        onEdit={handleEdit}
                    />
                ) : (
                    <div className="p-12 text-center text-slate-400">
                        <div className="text-4xl mb-4">📭</div>
                        <div>لا يوجد عملاء محتملين في الوقت الحالي</div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <LeadModal
                    mode={modalMode}
                    contact={selectedContact}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default LeadsPage;
