import React from 'react';
import { useData } from '../context/DataContext';

const ProjectsPage = () => {
    const { contacts } = useData();

    // Mock projects derived from contacts for demonstration
    const projects = [
        {
            id: '1',
            title: 'بناء الهوية الرقمية',
            client: 'مطاعم لافندر',
            status: 'active',
            progress: 65,
            dueDate: '2024-04-15',
            budget: '15,000 ريال'
        },
        {
            id: '2',
            title: 'حملة إعلانية - رمضان',
            client: 'شركة التقنية المتقدمة',
            status: 'pending',
            progress: 30,
            dueDate: '2024-03-01',
            budget: '45,000 ريال'
        },
        {
            id: '3',
            title: 'تصميم متجر إلكتروني',
            client: 'مجموعة البناء',
            status: 'completed',
            progress: 100,
            dueDate: '2024-01-20',
            budget: '22,000 ريال'
        }
    ];

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">إدارة المشاريع</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
                    + مشروع جديد
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div key={project.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${project.status === 'active' ? 'bg-blue-50 text-blue-600' :
                                    project.status === 'completed' ? 'bg-green-50 text-green-600' :
                                        'bg-orange-50 text-orange-600'
                                }`}>
                                {project.status === 'active' ? 'نشط' : project.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                            </span>
                            <span className="text-xs text-slate-400">{project.dueDate}</span>
                        </div>

                        <h3 className="font-bold text-slate-800 text-lg mb-1">{project.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">{project.client}</p>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-600">
                                <span>الإنجاز</span>
                                <span>{project.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                                        }`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-sm">
                            <span className="text-slate-500">الميزانية:</span>
                            <span className="font-bold text-slate-800">{project.budget}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;
