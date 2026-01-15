import React from 'react';
import { useData } from '../context/DataContext';
import { PipelineStage, PipelineStageLabels } from '../types';
import ContactsTable from '../components/Contacts/ContactsTable';

const LeadsPage = () => {
    const { contacts } = useData();

    // Filter contacts that are considered "Leads" (before conversation)
    const leads = contacts.filter(contact =>
        [
            PipelineStage.NEW,
            PipelineStage.ICP_VERIFIED,
            PipelineStage.HIGH_FIT,
            PipelineStage.READY_TO_OUTREACH
        ].includes(contact.stage)
    );

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">العملاء المحتملين (Leads)</h1>
                    <p className="text-slate-500 text-sm">قائمة العملاء المحتملين الذين لم يتم التواصل معهم بعد.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold">
                    {leads.length} عميل محتمل
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                {leads.length > 0 ? (
                    <ContactsTable contacts={leads} />
                ) : (
                    <div className="p-12 text-center text-slate-400">
                        <div className="text-4xl mb-4">📭</div>
                        <div>لا يوجد عملاء محتملين في الوقت الحالي</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadsPage;
