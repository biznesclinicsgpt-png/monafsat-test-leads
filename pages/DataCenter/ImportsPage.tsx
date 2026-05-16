import React, { useState } from 'react';
import { Icons } from '@/constants';
import { parseCSV } from '@/services/csvParser';
import { processIngest } from '@/services/ingestService';
import { useNavigate } from 'react-router-dom';

const ImportsPage = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploading(true);

        try {
            // 1. Parse
            console.log('Parsing file:', file.name);
            const parsed = await parseCSV(file);
            console.log('Parsed rows:', parsed.data.length);

            // 2. Ingest
            const { job } = await processIngest(parsed, 'csv');

            // 3. Redirect to Staging
            // In a real app, we'd persist the job ID to Context or DB
            // asking the user to review it.
            // For now, let's pass state via navigation or just mock it
            navigate('/app/data-center/staging', { state: { importId: job.id, rows: parsed.data } });

        } catch (error) {
            console.error('Import failed', error);
            alert('Import failed. Check console.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">استيراد البيانات</h2>
                <button className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2 font-bold shadow-lg shadow-brand/20">
                    <Icons.Projects className="w-5 h-5" />
                    استيراد جديد
                </button>
            </div>

            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all
                    ${isDragging ? 'border-brand bg-brand-light' : 'border-slate-300 hover:border-brand hover:bg-slate-50'}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileUpload(e.dataTransfer.files);
                }}
            >
                <div className="w-16 h-16 bg-blue-50 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.Attachment className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">قم بسحب وإفلات ملف CSV, XLS, أو JSON هنا</h3>
                <p className="text-slate-500 mb-6">ندعم الامتدادات الخاصة بـ Apollo, Sales Nav, Clay والمزيد.</p>

                <label className="cursor-pointer">
                    <input
                        type="file"
                        accept=".csv,.json"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        disabled={uploading}
                    />
                    <span className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 shadow-sm inline-block">
                        {uploading ? 'جاري المعالجة...' : 'استعراض الملفات'}
                    </span>
                </label>
            </div>

            {/* Recent Imports List */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex justify-between">
                    <span>آخر عمليات الاستيراد</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {/* Mock Data */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-100 text-green-600 rounded">
                                    <Icons.Check className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">بيانات_أساسية_{i}.csv</h4>
                                    <p className="text-xs text-slate-500">تم الرفع بواسطة المستخدم • منذ {i} أيام</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">مكتمل</span>
                                <p className="text-xs text-slate-400 mt-1">450 صف</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImportsPage;
