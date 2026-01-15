import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PipelineStage, PipelineStageLabels } from '../../types';

interface PipelineKanbanProps {
  onAddCard: () => void;
}

const PipelineKanban: React.FC<PipelineKanbanProps> = ({ onAddCard }) => {
  const { contacts, updateContact } = useData();
  const stages = Object.values(PipelineStage);
  const [movingId, setMovingId] = useState<string | null>(null);

  const moveContact = (contactId: string, newStage: PipelineStage) => {
    updateContact(contactId, { stage: newStage });
    setMovingId(null);

    // محاكاة تحويل إلى فرصة حقيقية
    if (newStage === PipelineStage.OPPORTUNITY) {
      alert('تم تحويل هذا الـ Lead إلى صفحة "الفرص البيعية" بنجاح!');
    }
  };

  return (
    <div className="flex gap-4 p-4 overflow-x-auto h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-slate-200" dir="rtl">
      {stages.map((stage) => {
        const stageContacts = contacts.filter(c => c.stage === stage);
        return (
          <div key={stage} className="flex-shrink-0 w-72 bg-slate-50 rounded-xl flex flex-col border border-slate-200 h-full max-h-full">
            <div className="p-3 flex items-center justify-between border-b border-slate-100 bg-white rounded-t-xl sticky top-0 z-10">
              <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-wider truncate max-w-[180px]" title={PipelineStageLabels[stage]}>
                {PipelineStageLabels[stage]}
              </h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold">{stageContacts.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {stageContacts.map((contact) => (
                <div key={contact.id} className="group bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase border ${contact.fitScore >= 70 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                      ملاءمة {contact.fitScore}%
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => setMovingId(movingId === contact.id ? null : contact.id)}
                        className="text-slate-300 hover:text-blue-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                      </button>

                      {movingId === contact.id && (
                        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 shadow-xl rounded-xl z-20 py-1 animate-in fade-in slide-in-from-top-2">
                          <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-50 mb-1 text-right">نقل إلى:</div>
                          {stages.filter(s => s !== stage).map(s => (
                            <button
                              key={s}
                              onClick={() => moveContact(contact.id, s)}
                              className="w-full text-right px-4 py-2 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              {PipelineStageLabels[s]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-sm font-bold text-slate-800 mb-0.5 text-right">{contact.name}</div>
                  <div className="text-[10px] text-slate-400 mb-2 text-right">{contact.company}</div>

                  {/* Contact Readiness Icons in Card */}
                  <div className="flex items-center gap-2 mb-3">
                    {contact.email.status === 'valid' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="بريد إلكتروني متاح"></span>}
                    {contact.phone.status === 'valid' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="رقم هاتف متاح"></span>}
                  </div>

                  {/* Contextual Actions based on Stage */}
                  {stage === PipelineStage.MEETING_BOOKED && (
                    <button className="w-full py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded mb-2 hover:bg-blue-100">
                      📅 حجز اجتماع
                    </button>
                  )}

                  <div className="flex items-center justify-between text-[9px] text-slate-300 pt-2 border-t border-slate-50">
                    <span>منذ يومين</span>
                    {contact.icpStatus === 'verified' && <span className="text-indigo-400 font-bold">ICP مطابق</span>}
                  </div>
                </div>
              ))}

              <button
                onClick={onAddCard}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-bold hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all opacity-60 hover:opacity-100"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineKanban;
