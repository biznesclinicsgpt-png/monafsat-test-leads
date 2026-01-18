
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

interface ProviderWizardProps {
    onClose: () => void;
}

const ProviderWizard: React.FC<ProviderWizardProps> = ({ onClose }) => {
    const { providerProfile, updateProviderProfile } = useData();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1 Data
    const [myInfo, setMyInfo] = useState({
        website: providerProfile?.website || '',
        description: providerProfile?.description || ''
    });

    // Step 2 Data
    const [competitors, setCompetitors] = useState([{ url: '', description: '' }]);

    // Step 3 Results
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            // 1. Analyze Self (Strategy)
            const strategyRes = await fetch('/api/ai/strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: providerProfile?.company_name || 'My Company',
                    description: myInfo.description,
                    website: myInfo.website
                })
            });
            const strategyData = await strategyRes.json();

            // 2. Analyze Competitors
            const compRes = await fetch('/api/ai/analyze-competitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    my_info: myInfo.description,
                    competitors: competitors.filter(c => c.url)
                })
            });
            const compData = await compRes.json();

            setAnalysisResult({
                strategy: strategyData,
                competitive: compData
            });
            setStep(3);

        } catch (error) {
            alert('حدث خطأ أثناء التحليل. تأكد من البيانات.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!analysisResult) return;

        // Merge AI findings into Profile
        const updatedProfile = {
            ...providerProfile,
            description: myInfo.description,
            website: myInfo.website,
            value_proposition: analysisResult.strategy.value_proposition,
            target_audience: analysisResult.strategy.target_audience,
            unique_selling_points: [
                ...(analysisResult.strategy.unique_selling_points || []),
                ...(analysisResult.competitive.suggested_usps || [])
            ],
            // Merge Structured ICP
            icp_structured: {
                decision_makers: analysisResult.strategy.icp_structured?.decision_makers || [],
                pain_points: analysisResult.strategy.icp_structured?.pain_points || [],
                business_goals: analysisResult.strategy.icp_structured?.business_goals || [],
                company_size_ideal: analysisResult.strategy.icp_structured?.company_size_ideal || []
            }
        };

        updateProviderProfile(updatedProfile);
        alert('تم تطبيق الاستراتيجية بنجاح! 🚀');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            🧙‍♂️ المعالج الذكي (Genius Wizard)
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">دع الذكاء الاصطناعي يبني استراتيجيتك في ثوانٍ.</p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto flex-1" dir="rtl">

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                        <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-slate-800">1. عن شركتك (Analyze Me)</h3>
                            <div>
                                <label className="block font-bold text-slate-700 mb-2">رابط الموقع (Website)</label>
                                <input
                                    type="text"
                                    value={myInfo.website}
                                    onChange={e => setMyInfo(prev => ({ ...prev, website: e.target.value }))}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-left"
                                    dir="ltr"
                                    placeholder="https://mycompany.com"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-2">وصف الشركة أو المحتوى (Profile Content)</label>
                                <textarea
                                    rows={6}
                                    value={myInfo.description}
                                    onChange={e => setMyInfo(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                    placeholder="الصق هنا النص الموجود في الملف التعريفي للشركة..."
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-slate-800">2. المنافسين (The Competition)</h3>
                            <p className="text-slate-500 text-sm">أضف روابط المنافسين لنقوم بتحليل نقاط ضعفهم واستغلالها.</p>

                            {competitors.map((comp, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={comp.url}
                                        onChange={e => {
                                            const newComp = [...competitors];
                                            newComp[idx].url = e.target.value;
                                            setCompetitors(newComp);
                                        }}
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-left"
                                        dir="ltr"
                                        placeholder={`Competitor URL ${idx + 1}`}
                                    />
                                    {idx === competitors.length - 1 && (
                                        <button onClick={() => setCompetitors([...competitors, { url: '', description: '' }])} className="px-3 bg-slate-100 rounded-lg font-bold text-slate-600">+</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 3 && analysisResult && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                                <h3 className="text-lg font-bold text-emerald-900 mb-2">🎯 الميزة التنافسية (Your Edge)</h3>
                                <p className="text-emerald-800 text-sm leading-relaxed">{analysisResult.competitive.competitive_advantage}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-800 mb-2">فجوة السوق (Gap)</h4>
                                    <p className="text-sm text-slate-600">{analysisResult.competitive.market_gap}</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h4 className="font-bold text-blue-900 mb-2">استراتيجية مقترحة</h4>
                                    <p className="text-sm text-blue-800">{analysisResult.strategy.value_proposition}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-800 mb-3">نقاط التميز المستخلصة:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                                    {analysisResult.competitive.suggested_usps?.map((u: string, i: number) => <li key={i}>{u}</li>)}
                                    {analysisResult.strategy.unique_selling_points?.map((u: string, i: number) => <li key={i + 10}>{u}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 font-medium animate-pulse">جاري تحليل السوق واستخراج البيانات... 🧠</p>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center" dir="rtl">
                    {step > 1 && !loading && (
                        <button onClick={() => setStep(step - 1)} className="text-slate-500 font-bold hover:text-slate-700">السابق</button>
                    )}

                    <div className="flex gap-3 mr-auto">
                        <button onClick={onClose} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-200 rounded-lg">إلغاء</button>

                        {step < 3 ? (
                            <button
                                onClick={() => {
                                    if (step === 1) setStep(2);
                                    else if (step === 2) handleAnalyze();
                                }}
                                disabled={loading || (step === 1 && !myInfo.description)}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {loading ? 'يرجى الانتظار...' : step === 1 ? 'التالي ⬅️' : 'بدء التحليل 🧠'}
                            </button>
                        ) : (
                            <button
                                onClick={handleApply}
                                className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-700 transition-all animate-pulse"
                            >
                                اعتماد الاستراتيجية ✅
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProviderWizard;
