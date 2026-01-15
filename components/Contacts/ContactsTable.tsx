
import React from 'react';
import { Contact, LeadSource, PipelineStageLabels } from '../../types';

interface ContactsTableProps {
  contacts: Contact[];
}

const ContactsTable: React.FC<ContactsTableProps> = ({ contacts }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200" dir="rtl">
      {/* Filters Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3 bg-slate-50/50 rounded-t-xl">
        <div className="relative flex-1 min-w-[200px]">
           <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           <input type="text" placeholder="بحث بالاسم أو الشركة..." className="w-full pr-10 pl-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-right" />
        </div>
        
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
           <label className="text-xs font-bold text-slate-500">المطابقة:</label>
           <button className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors">
              المتحقق منهم فقط
           </button>
        </div>

        <select className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none text-right">
           <option>المصدر: الكل</option>
           <option>قاعدة البيانات</option>
           <option>رفع ملف</option>
        </select>
        
        <select className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none text-right">
           <option>المرحلة: الكل</option>
           {Object.values(PipelineStageLabels).map(label => (
             <option key={label}>{label}</option>
           ))}
        </select>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white">
           <span className="text-xs font-bold text-slate-400">ملاءمة &ge;</span>
           <input type="range" min="0" max="100" defaultValue="50" className="w-24 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
           <span className="text-xs font-bold text-blue-600">50%</span>
        </div>
      </div>
      
      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-right">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4">الاسم / الشركة</th>
              <th className="px-6 py-4">المصدر</th>
              <th className="px-6 py-4 text-center">مطابقة ICP</th>
              <th className="px-6 py-4 text-center">نسبة الملاءمة</th>
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
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{contact.name}</div>
                      <div className="text-[11px] text-slate-400">{contact.company} • {contact.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-500 font-bold border border-slate-200">
                      {contact.source === LeadSource.INBOUND_MARKETPLACE ? 'وارد (Inbound)' : 'صادر (Outbound)'}
                   </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {contact.icpStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      نعم
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-300 font-bold">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`text-xs font-bold ${contact.fitScore >= 70 ? 'text-green-600' : 'text-slate-500'}`}>{contact.fitScore}%</span>
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${contact.fitScore >= 70 ? 'bg-green-500' : 'bg-slate-300'}`} style={{ width: `${contact.fitScore}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                     <div className={`w-6 h-6 rounded flex items-center justify-center border ${contact.email.status === 'valid' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-300'}`} title="البريد الإلكتروني متاح">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                     </div>
                     <div className={`w-6 h-6 rounded flex items-center justify-center border ${contact.phone.status === 'valid' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-300'}`} title="رقم الهاتف متاح">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                     </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      {PipelineStageLabels[contact.stage]}
                   </span>
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-2">
                    <button className="text-xs font-bold text-blue-600 hover:underline">عرض</button>
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
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
