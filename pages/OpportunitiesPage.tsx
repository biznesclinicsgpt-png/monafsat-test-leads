import React, { useState } from 'react';
import PipelineKanban from '../components/Contacts/PipelineKanban';
import AddContactsWizard from '../components/Contacts/AddContactsWizard';

const OpportunitiesPage = () => {
    const [showAddWizard, setShowAddWizard] = useState(false);

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">الفرص البيعية (Opportunities)</h1>
                    <p className="text-slate-500 text-sm">تتبع تقدم الصفقات ومراحل المفاوضات.</p>
                </div>
                <button
                    onClick={() => setShowAddWizard(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                >
                    + فرصة جديدة
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[600px]">
                <PipelineKanban onAddCard={() => setShowAddWizard(true)} />
            </div>

            {showAddWizard && <AddContactsWizard onClose={() => setShowAddWizard(false)} />}
        </div>
    );
};

export default OpportunitiesPage;
