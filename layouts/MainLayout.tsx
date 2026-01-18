import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Icons } from '../constants';
import { useData } from '../context/DataContext';

const SidebarItem = ({ to, label, icon: Icon, badge }: { to: string, label: string, icon: any, badge?: string }) => {
    const location = useLocation();
    const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

    return (
        <NavLink
            to={to}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right relative ${active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
        >
            <Icon />
            <span className="flex-1">{label}</span>
            {badge && (
                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] rounded font-black">{badge}</span>
            )}
        </NavLink>
    );
};

const MainLayout = () => {
    const { user } = useData();

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900" dir="rtl">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-l border-slate-200 sticky top-0 h-screen overflow-y-auto hidden md:block z-10">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8 justify-start">
                        <img src="/logo_full.png" alt="BiznesClinics" className="h-10 w-auto object-contain" />
                    </div>

                    <nav className="space-y-1">
                        <SidebarItem to="/app" label="لوحة التحكم" icon={Icons.Dashboard} />
                        <SidebarItem to="/app/profile" label="الملف الشخصي" icon={Icons.Profile} />
                        <SidebarItem to="/app/diagnosis" label="🥷 تشخيص النينجا" icon={Icons.Settings} badge="هام" />
                        <SidebarItem to="/app/contacts" label="جهات الاتصال" icon={Icons.Contacts} badge="جديد" />
                        <SidebarItem to="/app/leads" label="العملاء المحتملين" icon={Icons.Opportunities} />
                        <SidebarItem to="/app/opportunities" label="الفرص البيعية" icon={Icons.Opportunities} />
                        <SidebarItem to="/app/projects" label="إدارة المشاريع" icon={Icons.Projects} />
                        <SidebarItem to="/app/messages" label="صندوق المحادثات" icon={Icons.Messages} />
                        <SidebarItem to="/app/financial" label="الحسابات والمالية" icon={Icons.Financial} />
                        <SidebarItem to="/app/reviews" label="تقييمات العملاء" icon={Icons.Reviews} />
                        <hr className="border-slate-100 my-2" />
                        <SidebarItem to="/app/integrations" label="التكاملات" icon={Icons.Settings} badge="جديد" />

                        <button
                            onClick={() => {
                                if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                                    localStorage.removeItem('user');
                                    window.location.href = '/';
                                }
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right text-rose-500 hover:bg-rose-50 mt-4"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            <span className="flex-1 font-bold">تسجيل الخروج</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden flex flex-col">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="text-sm text-slate-500">
                        أهلاً بك، <span className="text-slate-800 font-bold">{user?.name || 'مستخدم'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
