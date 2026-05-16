import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard as DashboardIcon,
  Crown as NinjaIcon,
  Users as UsersIcon,
  LogOut,
  Link as LinkIcon,
  Wallet,
  ScrollText,
  Building2
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/admin/login', { state: { from: location } });
                return;
            }

            try {
                const user = JSON.parse(userStr);
                if (user.role !== 'admin') {
                    // Not authorized
                    navigate('/'); // Or show unauthorized page
                    return;
                }
                setAuthorized(true);
            } catch (e) {
                console.error("Auth Error", e);
                localStorage.removeItem('user');
                navigate('/admin/login');
            }
        };

        checkAuth();
    }, [navigate, location]);

    if (!authorized) {
        return null; // Don't render anything while checking
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-cairo">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Shield className="text-emerald-500" size={28} />
                    <div>
                        <h1 className="font-bold text-lg">Admin Portal</h1>
                        <p className="text-xs text-slate-400">Super User Access</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <DashboardIcon size={20} />
                        <span>لوحة التحكم</span>
                    </NavLink>

                    <div className="text-xs font-bold text-slate-500 mt-6 mb-2 px-4 uppercase tracking-wider">النظام الأساسي</div>

                    <NavLink
                        to="/admin/integrations"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive || location.pathname.startsWith('/admin/integrations') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <LinkIcon size={20} />
                        <span>مركز التكاملات</span>
                        <span className="mr-auto px-2 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded">Hub</span>
                    </NavLink>

                    <NavLink
                        to="/admin/wallet"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Wallet size={20} />
                        <span>المحفظة والفوترة</span>
                    </NavLink>

                    <NavLink
                        to="/admin/workspaces"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Building2 size={20} />
                        <span>إدارة العملاء</span>
                    </NavLink>

                    <NavLink
                        to="/admin/audit"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <ScrollText size={20} />
                        <span>السجل والأمان</span>
                    </NavLink>

                    <div className="text-xs font-bold text-slate-500 mt-6 mb-2 px-4 uppercase tracking-wider">Growth Engine</div>

                    <NavLink
                        to="/admin/ninja"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <NinjaIcon size={20} />
                        <span>Ninja Control 🥷</span>
                    </NavLink>

                    <NavLink
                        to="/admin/providers"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <UsersIcon size={20} />
                        <span>المزودين</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            navigate('/admin/login');
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-900/20 w-full transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Exit Portal</span>
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
