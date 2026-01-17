import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PipelineStage, Contact } from '../types';
import ContactsTable from '../components/Contacts/ContactsTable';
import LeadModal from '../components/Contacts/LeadModal';
import { CSVImporter } from '../components/Contacts/CSVImporter';

const LeadsPage = () => {
    const { contacts, loading, addContact, addContacts, updateContact } = useData();
    const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('view');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImporterOpen, setIsImporterOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Filter contacts that are considered "Leads"
    const leads = contacts?.filter(contact =>
        [
            PipelineStage.NEW,
            PipelineStage.ICP_VERIFIED,
            PipelineStage.HIGH_FIT,
            PipelineStage.READY_TO_OUTREACH
        ].includes(contact.stage)
    ) || [];

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

    const handleSave = async (contact: Contact) => {
        setSaving(true);
        try {
            if (modalMode === 'add') {
                await addContact(contact);
            } else {
                await updateContact(contact.id, contact);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving contact:', error);
            alert('حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.');
        } finally {
            setSaving(false);
        }
    };

    const handleImport = async (importedContacts: Partial<Contact>[]) => {
        setSaving(true);
        try {
            await addContacts(importedContacts);
            setIsImporterOpen(false);
        } catch (error) {
            console.error('Error importing contacts:', error);
            alert('حدث خطأ أثناء استيراد البيانات.');
        } finally {
            setSaving(false);
        }
    };

    if (loading && contacts.length === 0) {
        return (
            <div className="flex items-center justify-center p-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

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
                        onClick={() => setIsImporterOpen(true)}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
                    >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        استيراد (CSV)
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        إضافة عميل
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {leads.length > 0 ? (
                    <ContactsTable
                        contacts={leads}
                        onView={handleView}
                        onEdit={handleEdit}
                    />
                ) : (
                    <div className="p-24 text-center text-slate-400">
                        <div className="text-6xl mb-6 grayscale opacity-50">📭</div>
                        <div className="text-xl font-bold text-slate-600">لا يوجد عملاء محتملين في الوقت الحالي</div>
                        <p className="mt-2 text-slate-400">ابدأ بإضافة عملاء جدد باستخدام الزر أعلاه.</p>
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

            {isImporterOpen && (
                <CSVImporter
                    onImport={handleImport}
                    onClose={() => setIsImporterOpen(false)}
                />
            )}

            {saving && (
                <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-[60] flex items-center justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 font-bold text-slate-700">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        جاري الحفظ...
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadsPage;
