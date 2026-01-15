
import React, { useState, useEffect } from 'react';

interface CampaignExportModalProps {
  onClose: () => void;
  contactCount: number;
}

const CampaignExportModal: React.FC<CampaignExportModalProps> = ({ onClose, contactCount }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: 'تصفية حسب الملاءمة (ICP Fit ≥ 70%)', status: 'done' },
    { label: 'تنظيف وتوحيد الصيغ (Normalization)', status: 'processing' },
    { label: 'التحقق من صحة الإيميلات (Email Waterfall)', status: 'waiting' },
    { label: 'إثراء بيانات أرقام الجوال', status: 'waiting' },
    { label: 'تجهيز ملف Smartlead CSV', status: 'waiting' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep(5);
          return 100;
        }
        const next = prev + 2;
        if (next > 20 && step === 0) setStep(1);
        if (next > 40 && step === 1) setStep(2);
        if (next > 70 && step === 2) setStep(3);
        if (next > 90 && step === 3) setStep(4);
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            تجهيز حملة إرسال ذكية
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-sm text-slate-500 mb-1">عدد جهات الاتصال المختارة</div>
            <div className="text-4xl font-black text-blue-600">{contactCount}</div>
          </div>

          <div className="space-y-4 mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step > i ? 'bg-green-500 text-white' : 
                  step === i ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-100 text-slate-300'
                }`}>
                  {step > i ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  ) : (
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  )}
                </div>
                <div className={`text-xs font-bold ${step === i ? 'text-slate-800' : 'text-slate-400'}`}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            disabled={progress < 100}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            تحميل الملف (CSV)
          </button>
          <button 
            disabled={progress < 100}
            className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            إرسال إلى Smartlead
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignExportModal;
