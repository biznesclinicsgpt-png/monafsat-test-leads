
import React, { useState } from 'react';

interface AddContactsWizardProps {
  onClose: () => void;
}

const AddContactsWizard: React.FC<AddContactsWizardProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const sources = [
    { id: 'master', title: 'قاعدة بيانات منافذ (Master DB)', desc: 'تصفية والبحث في ملايين الشركات النشطة محلياً.', icon: '🏢' },
    { id: 'upload', title: 'رفع ملف (CSV / Excel)', desc: 'استيراد القائمة الخاصة بك بضغطة زر.', icon: '📄' },
    { id: 'api', title: 'ربط API (Apollo / Phantombuster)', desc: 'مزامنة تلقائية مع أدواتك الخارجية.', icon: '⚡' },
  ];

  const handleRun = () => {
    setIsProcessing(true);
    // Simulation
    setTimeout(() => {
      setIsProcessing(false);
      setResult({
        total: 1250,
        verified: 890,
        highFit: 420,
        needsEnrichment: 150
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 min-h-[500px]" dir="rtl">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">إضافة جهات اتصال جديدة</h2>
            <p className="text-sm text-slate-400">
               {result ? 'تمت العملية بنجاح' : `خطوة ${step} من 2: ${step === 1 ? 'اختر المصدر' : 'الإعداد السريع'}`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 flex-1 flex flex-col">
          {!result ? (
            <>
              {step === 1 ? (
                <div className="grid grid-cols-1 gap-4">
                  {sources.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setSource(s.id)}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-right ${
                        source === s.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="text-3xl bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-sm border border-slate-100">{s.icon}</div>
                      <div>
                        <div className="font-bold text-slate-800">{s.title}</div>
                        <div className="text-xs text-slate-400 mt-1">{s.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 flex-1">
                   <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                      <div className="text-blue-500 mt-1">ℹ️</div>
                      <div className="text-sm text-blue-800">سيقوم النظام تلقائياً بتنظيف وتوحيد البيانات (Normalize) ومحاولة إزالة التكرار.</div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
                         <div>
                            <div className="font-bold text-slate-800">تطبيق التحقق من الـ ICP</div>
                            <div className="text-xs text-slate-400">التحقق مما إذا كانت الجهات تطابق معاييرك</div>
                         </div>
                         <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
                         <div>
                            <div className="font-bold text-slate-800">تشغيل الإثراء (Enrichment)</div>
                            <div className="text-xs text-slate-400">محاولة جلب إيميلات وأرقام هواتف ناقصة</div>
                         </div>
                         <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                         <div className="flex justify-between mb-2">
                            <label className="font-bold text-slate-800 text-sm">حد الملاءمة الأدنى (Fit Threshold)</label>
                            <span className="font-bold text-blue-600 text-sm">70%</span>
                         </div>
                         <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" defaultValue="70" />
                         <div className="text-xs text-slate-400 mt-2">سنقوم بتمييز الجهات التي تزيد عن 70% كـ "ملاءمة عالية".</div>
                      </div>
                   </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center animate-in zoom-in duration-300">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
               </div>
               <h3 className="text-2xl font-bold text-slate-800 mb-2">تمت العملية بنجاح!</h3>
               <p className="text-slate-500 mb-8">إليك ملخص سريع لما تم استيراده ومعالجته.</p>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <div className="text-2xl font-bold text-slate-800">{result.total}</div>
                     <div className="text-xs text-slate-400 font-bold uppercase">إجمالي</div>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                     <div className="text-2xl font-bold text-indigo-600">{result.verified}</div>
                     <div className="text-xs text-indigo-400 font-bold uppercase">تم التحقق</div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                     <div className="text-2xl font-bold text-emerald-600">{result.highFit}</div>
                     <div className="text-xs text-emerald-400 font-bold uppercase">ملاءمة عالية</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                     <div className="text-2xl font-bold text-orange-600">{result.needsEnrichment}</div>
                     <div className="text-xs text-orange-400 font-bold uppercase">يحتاج معلومات</div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          {!result ? (
            <>
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white"
                  disabled={isProcessing}
                >
                  السابق
                </button>
              )}
              <button 
                disabled={!source || isProcessing}
                onClick={() => step === 1 ? setStep(2) : handleRun()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex justify-center"
              >
                {isProcessing ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  step === 1 ? 'المتابعة' : 'تشغيل المحرك (Run)'
                )}
              </button>
            </>
          ) : (
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900"
            >
              الذهاب للنتائج
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContactsWizard;
