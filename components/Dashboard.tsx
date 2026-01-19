
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ICPStrategyModal from './Dashboard/ICPStrategyModal';

const StatCard = ({ title, value, subtext, color, icon }: { title: string, value: string | number, subtext?: string, color: string, icon: any }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm text-right flex items-start justify-between">
    <div>
      <div className="text-sm font-medium text-slate-500 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {subtext && <div className="text-[10px] text-slate-400 mt-1">{subtext}</div>}
    </div>
    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { contacts, providerICP } = useData();
  const [showICPModal, setShowICPModal] = useState(false);

  const isICPSet = providerICP.isSet;

  // Dashboard Logic for Block 1 (Primary Action)
  const getPrimaryActionState = () => {
    if (!isICPSet) return 'SETUP_ICP';
    if (contacts.length === 0) return 'ADD_CONTACTS';
    return 'START_CAMPAIGN';
  };
  const primaryAction = getPrimaryActionState();

  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir="rtl">

      {/* ================= BLOCK 1: Profile Health + ICP + Primary Action ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Profile Health */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-blue-600" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-700 text-lg">85%</div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">حالة الملف التعريفي</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${isICPSet ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm text-slate-500">{isICPSet ? 'استراتيجية ICP: جاهزة' : 'استراتيجية ICP: غير محددة'}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Action Banner */}
          <div className="flex-1 w-full bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            {primaryAction === 'SETUP_ICP' && (
              <>
                <div className="text-right">
                  <h3 className="font-bold text-slate-800">حدد عميلك المثالي أولاً</h3>
                  <p className="text-xs text-slate-500 mt-1">لا يمكننا جلب ليدات دقيقة بدون معرفة من تستهدف.</p>
                </div>
                <button onClick={() => setShowICPModal(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all">إعداد ICP</button>
              </>
            )}
            {primaryAction === 'ADD_CONTACTS' && (
              <>
                <div className="text-right">
                  <h3 className="font-bold text-slate-800">المحرك جاهز للعمل</h3>
                  <p className="text-xs text-slate-500 mt-1">استراتيجيتك ممتازة. ابدأ بجلب ليدات من قاعدة البيانات الآن.</p>
                </div>
                <button onClick={() => navigate('/app/contacts')} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all">إضافة جهات اتصال</button>
              </>
            )}
            {primaryAction === 'START_CAMPAIGN' && (
              <>
                <div className="text-right">
                  <h3 className="font-bold text-slate-800">بياناتك جاهزة للإرسال</h3>
                  <p className="text-xs text-slate-500 mt-1">لديك {contacts.length} ليد مؤهل. حولهم لفرص بيعية الآن.</p>
                </div>
                <button onClick={() => navigate('/app/contacts')} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all">تجهيز حملة</button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ================= BLOCK 2: Inbound Snapshot (Marketplace) ================= */}
      <section>
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-purple-600">⚡️</span>
          نشاط السوق (وارد / Inbound)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="طلبات جديدة"
            value="3"
            subtext="من السوق المفتوح"
            color="text-slate-800"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
          <StatCard
            title="فرص نشطة"
            value="12"
            subtext="قيد التفاوض"
            color="text-blue-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            title="اجتماعات قادمة"
            value="2"
            subtext="هذا الأسبوع"
            color="text-green-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
        </div>
      </section>

      {/* ================= BLOCK 3: Outbound Snapshot (Contact Engine) ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engine Status */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-500 rounded-full"></span>
              محرك البيانات (Outbound Engine)
            </h3>
            <button onClick={() => navigate('/app/contacts')} className="text-xs text-blue-600 font-bold hover:underline">عرض التفاصيل</button>
          </div>

          <div className="space-y-6">
            {/* Progress Bar Visual */}
            <div className="relative pt-6 pb-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                <span>إدخال</span>
                <span>توحيد</span>
                <span>إثراء</span>
                <span>فحص</span>
                <span>جاهز</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="w-[20%] h-full bg-slate-300"></div>
                <div className="w-[20%] h-full bg-blue-300"></div>
                <div className="w-[20%] h-full bg-indigo-400"></div>
                <div className="w-[20%] h-full bg-purple-500"></div>
                <div className="w-[20%] h-full bg-emerald-500"></div>
              </div>
              <div className="flex items-center justify-between mt-2 font-bold text-slate-700">
                <span>12.5k</span>
                <span>12k</span>
                <span>8k</span>
                <span>3.2k</span>
                <span className="text-emerald-600">540</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
              <div className="text-center">
                <div className="text-xs text-slate-400">ملاءمة عالية</div>
                <div className="text-lg font-bold text-indigo-600">820</div>
              </div>
              <div className="text-center border-r border-l border-slate-50">
                <div className="text-xs text-slate-400">جاهز للتواصل</div>
                <div className="text-lg font-bold text-emerald-600">540</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400">تحتاج إثراء</div>
                <div className="text-lg font-bold text-orange-400">310</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center gap-3">
          <h3 className="font-bold text-slate-800 mb-2">إجراءات سريعة</h3>

          <button onClick={() => navigate('/app/contacts')} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all group text-right">
            <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">⚡️ إضافة جهات اتصال</span>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          <button onClick={() => alert('تم تطبيق فلتر ICP على القائمة')} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all group text-right">
            <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-700">🎯 تصفية حسب ICP</span>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          <button onClick={() => navigate('/app/contacts')} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all group text-right">
            <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-700">📤 تجهيز حملة (Export)</span>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </section>

      {showICPModal && <ICPStrategyModal onClose={() => setShowICPModal(false)} />}
    </div>
  );
};

export default Dashboard;
