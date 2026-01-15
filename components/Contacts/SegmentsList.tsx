
import React from 'react';

interface SegmentCardProps {
  title: string;
  count: number;
  desc: string;
  tags: string[];
  onView: () => void;
  onExport: () => void;
}

const SegmentCard: React.FC<SegmentCardProps> = ({ title, count, desc, tags, onView, onExport }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/50 transition-all group text-right">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      </div>
      <div className="text-2xl font-black text-slate-800">{count.toLocaleString()}</div>
    </div>
    <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-[11px] text-slate-400 mb-4 line-clamp-2">{desc}</p>
    
    <div className="flex flex-wrap flex-row-reverse gap-2 mb-6">
      {tags.map(t => (
        <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">{t}</span>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-2">
      <button 
        onClick={onView}
        className="py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors active:scale-95"
      >
        عرض القائمة
      </button>
      <button 
        onClick={onExport}
        className="py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors active:scale-95"
      >
        تصدير سريع
      </button>
    </div>
  </div>
);

interface SegmentsListProps {
  onViewContacts: () => void;
  onExportCampaign: () => void;
}

const SegmentsList: React.FC<SegmentsListProps> = ({ onViewContacts, onExportCampaign }) => {
  const segments = [
    { title: 'عملاء مثاليون (Top Fit)', count: 820, desc: 'ليدات تطابق ملف العميل المثالي الخاص بك بنسبة مذهلة.', tags: ['ملاءمة > 80%', 'تم التحقق'] },
    { title: 'قطاع الأغذية - الرياض', count: 1450, desc: 'مطاعم وكافيهات في العاصمة الرياض تحتاج حلولك.', tags: ['F&B', 'الرياض', 'متوسطة'] },
    { title: 'يحتاج لإثراء بيانات', count: 312, desc: 'جهات اتصال ينقصها الإيميل أو الجوال وتحتاج تفعيل الواترفول.', tags: ['بيانات ناقصة', 'تحتاج إثراء'] },
    { title: 'تفاعلوا مؤخراً', count: 54, desc: 'ليدات فتحوا إيميلاتك أو زاروا بروفايلك في الـ 24 ساعة الماضية.', tags: ['نشط', 'نقر'] },
  ];

  return (
    <div className="p-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {segments.map((s, i) => (
          <SegmentCard 
            key={i} 
            {...s} 
            onView={onViewContacts} 
            onExport={onExportCampaign} 
          />
        ))}
        
        <button 
          onClick={() => alert('ميزة إنشاء شريحة مخصصة ستكون متاحة قريباً!')}
          className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all gap-2 group active:scale-95"
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-blue-300">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="font-bold text-sm">شريحة ذكية جديدة</span>
        </button>
      </div>
    </div>
  );
};

export default SegmentsList;
