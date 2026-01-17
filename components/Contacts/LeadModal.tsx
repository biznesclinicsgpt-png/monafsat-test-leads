import React, { useState, useEffect } from 'react';
import { Contact, LeadSource, PipelineStage, PipelineStageLabels } from '../../types';

interface LeadModalProps {
    mode: 'add' | 'edit' | 'view';
    contact?: Contact;
    onClose: () => void;
    onSave: (contact: Contact) => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ mode, contact, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Contact>>({
        name: '',
        company: '',
        title: '',
        email: { address: '', status: 'none' },
        phone: { number: '', status: 'none' },
        stage: PipelineStage.NEW,
        source: LeadSource.OUTBOUND_CONTACTS,
        fitScore: 0,
        icpStatus: 'pending',
        tags: []
    });

    useEffect(() => {
        if (contact && (mode === 'edit' || mode === 'view')) {
            setFormData(contact);
        }
    }, [contact, mode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'view') {
            onClose();
            return;
        }

        // Basic validation could go here
        const savedContact = {
            ...formData,
            id: contact?.id || Math.random().toString(36).substr(2, 9), // Simple ID generation
        } as Contact;

        onSave(savedContact);
    };

    const isViewMode = mode === 'view';

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]" dir="rtl">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">
                        {mode === 'add' ? 'إضافة عميل محتمل جديد' : mode === 'edit' ? 'تعديل بيانات العميل' : 'تفاصيل العميل'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <form id="leadForm" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Basic Info */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">البيانات الأساسية</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم العميل</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleChange}
                                            disabled={isViewMode}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">المنصب</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title || ''}
                                            onChange={handleChange}
                                            disabled={isViewMode}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">الشركة</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company || ''}
                                            onChange={handleChange}
                                            disabled={isViewMode}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">بيانات التواصل</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            name="email.address"
                                            value={formData.email?.address || ''}
                                            onChange={handleChange}
                                            disabled={isViewMode}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                            dir="ltr"
                                            style={{ textAlign: 'right' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">الهاتف</label>
                                        <input
                                            type="text"
                                            name="phone.number"
                                            value={formData.phone?.number || ''}
                                            onChange={handleChange}
                                            disabled={isViewMode}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                            dir="ltr"
                                            style={{ textAlign: 'right' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pipeline Info */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">المسار والملاءمة</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">المرحلة</label>
                                        <select
                                            name="stage"
                                            value={formData.stage}
                                            onChange={handleChange}
                                            disabled={isViewMode}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                        >
                                            {Object.entries(PipelineStageLabels).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">درجة الملاءمة (Fit Score)</label>
                                        <input
                                            type="number"
                                            name="fitScore"
                                            value={formData.fitScore || 0}
                                            onChange={handleChange}
                                            disabled={isViewMode}
                                            min="0"
                                            max="100"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-white transition-colors"
                    >
                        {isViewMode ? 'إغلاق' : 'إلغاء'}
                    </button>
                    {!isViewMode && (
                        <button
                            type="submit"
                            form="leadForm"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                        >
                            حفظ التغييرات
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadModal;
