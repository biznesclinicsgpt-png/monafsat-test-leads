
import React from 'react';
import { useData } from '../../context/DataContext';
import { Contact, LeadSource, PipelineStageLabels } from '../../types';

interface ContactsTableProps {
  contacts: Contact[];
  onView?: (contact: Contact) => void;
  onEdit?: (contact: Contact) => void;
}

const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, onView, onEdit }) => {
  const { scoreContacts, providerICP, discoverLeadEmail } = useData();

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200" dir="rtl">
      {/* Filters Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3 bg-slate-50/50 rounded-t-xl">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="بحث بالاسم أو الشركة..." className="w-full pr-10 pl-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-right" />
        </div>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
          <label className="text-xs font-bold text-slate-500">ملاءمة ICP:</label>
          <button
            onClick={scoreContacts}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-2"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            تحديث النتائج
          </button>
        </div>

        <select className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none text-right">
          <option>المرحلة: الكل</option>
          {Object.entries(PipelineStageLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-right border-collapse">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4">الاسم / الشركة</th>
              <th className="px-6 py-4">مجال العمل</th>
              <th className="px-6 py-4 text-center">مؤشر التوافق</th>
              <th className="px-6 py-4 text-center">بيانات التواصل</th>
              <th className="px-6 py-4">المرحلة</th>
              <th className="px-6 py-4 text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                      {contact.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{contact.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {contact.company_name} {contact.title && `• ${contact.title}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] px-2 py-1 rounded bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
                    {contact.industry_ar || 'غير محدد'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {contact.fitScore !== undefined ? (
                    <div className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-black ${contact.fitScore >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      contact.fitScore >= 40 ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                        'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                      {contact.fitScore}%
                    </div>
                  ) : (
                    <span className="text-slate-300 text-[10px]">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {contact.email ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100" title={contact.email}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                    ) : (
                      <button
                        onClick={() => discoverLeadEmail(contact)}
                        className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-400 p-1.5 rounded-full transition-all"
                        title="البحث عن البريد"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </button>
                    )}
                    {contact.phone && (
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100" title={contact.phone}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                    )}
                    {contact.linkedin_url && (
                      <a href={contact.linkedin_url} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    {PipelineStageLabels[contact.stage]}
                  </span>
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-3">
                    <button
                      onClick={() => onView && onView(contact)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      عرض
                    </button>
                    <button
                      onClick={() => onEdit && onEdit(contact)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactsTable;
