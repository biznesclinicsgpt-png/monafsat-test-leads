
import React, { useState } from 'react';
import { generateICPDraft, ICPDraft } from '../../services/geminiService';

interface ICPStrategyModalProps {
  onClose: () => void;
}

const ICPStrategyModal: React.FC<ICPStrategyModalProps> = ({ onClose }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<ICPDraft | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const result = await generateICPDraft(description);
      setDraft(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // محاكاة حفظ البيانات في قاعدة البيانات
    alert('تم حفظ استراتيجية ICP وتحديث فلاتر المحرك بنجاح!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            إعداد استراتيجية العميل المثالي (ICP) بالذكاء الاصطناعي
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {!draft ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">صف لنا عملك والخدمات التي تقدمها:</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثال: نحن شركة تسويق رقمي متخصصة في مساعدة المطاعم المتوسطة في السعودية على زيادة مبيعاتها عبر تيك توك..."
                  className="w-full p-4 rounded-xl border border-slate-200 h-40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm leading-relaxed"
                />
                <p className="mt-2 text-[11px] text-slate-400">سيقوم Gemini بتحليل الوصف واستخراج أفضل القطاعات والمسميات الوظيفية المناسبة لك.</p>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !description.trim()}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    جاري التحليل وتجهيز المسودة...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    توليد الاستراتيجية الآن
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  مسودة ICP المقترحة
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{draft.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">القطاعات المستهدفة</h4>
                  <div className="flex flex-wrap gap-2">
                    {draft.industries.map((ind, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">{ind}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">المسميات الوظيفية</h4>
                  <div className="flex flex-wrap gap-2">
                    {draft.titles.map((title, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">{title}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">نطاق الميزانية المقترح</div>
                  <div className="text-lg font-bold text-emerald-900">{draft.budgetHint}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /></svg>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  اعتماد وحفظ الاستراتيجية
                </button>
                <button 
                  onClick={() => setDraft(null)}
                  className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ICPStrategyModal;
