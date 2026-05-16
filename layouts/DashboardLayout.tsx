import React, { useState } from 'react';
import { DashboardTheme } from '../lib/theme';
import { Home, BarChart2, Users, Settings, Bell, Search, Menu, X, ChevronRight } from 'lucide-react';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, collapsed }: { icon: any, label: string, active?: boolean, collapsed?: boolean }) => {
    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group
        ${active
                    ? `bg-[${DashboardTheme.Colors.Brand.Surface}] text-[${DashboardTheme.Colors.Brand.Dark}]`
                    : `text-[${DashboardTheme.Colors.Neutrals.TextSecondary}] hover:bg-[${DashboardTheme.Colors.Neutrals.Bg}] hover:text-[${DashboardTheme.Colors.Brand.Dark}]`
                }
      `}
            style={{
                backgroundColor: active ? DashboardTheme.Colors.Brand.Surface : undefined,
                color: active ? DashboardTheme.Colors.Brand.Dark : undefined,
            }}
        >
            <Icon size={20} strokeWidth={2} />
            {!collapsed && <span className="font-medium text-sm whitespace-nowrap">{label}</span>}
            {!collapsed && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />}
        </div>
    );
};

const Sidebar = ({ isOpen, setIsOpen, collapsed, setCollapsed }: any) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r transition-all duration-300 flex flex-col
          ${collapsed ? 'w-20' : 'w-[280px]'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
                style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}
            >
                {/* Logo Area */}
                <div className="h-[72px] flex items-center px-6 border-b" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: DashboardTheme.Colors.Brand.Primary }}>
                            <span className="text-white font-bold text-xl">B</span>
                        </div>
                        {!collapsed && (
                            <span className="font-bold text-lg tracking-tight" style={{ color: DashboardTheme.Colors.Brand.Dark }}>
                                BiznesClinics
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
                    <SidebarItem icon={Home} label="Dashboard" active collapsed={collapsed} />
                    <SidebarItem icon={Users} label="Leads & CRM" collapsed={collapsed} />
                    <SidebarItem icon={BarChart2} label="Analytics" collapsed={collapsed} />
                    <div className="my-4 border-t" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }} />
                    <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} />
                </div>

                {/* Collapse Toggle (Desktop) */}
                <div className="p-4 border-t hidden lg:flex justify-end" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <div className="rotate-180"><ChevronRight size={20} /></div>}
                    </button>
                </div>
            </aside>
        </>
    );
};

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
    return (
        <header
            className="sticky top-0 z-30 flex items-center justify-between h-[72px] px-6 bg-white/80 backdrop-blur-md border-b"
            style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}
        >
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-gray-500">
                    <Menu size={24} />
                </button>

                {/* Search */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border transition-all focus-within:ring-2 ring-offset-2 ring-blue-100 w-[300px]"
                    style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search leads, campaigns..."
                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-gray-50 transition-colors text-gray-500">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold" style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>
                            Sarah Connor
                        </div>
                        <div className="text-xs" style={{ color: DashboardTheme.Colors.Neutrals.TextSecondary }}>
                            Admin
                        </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-sm">
                        <img src="https://ui-avatars.com/api/?name=Sarah+Connor&background=random" alt="User" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans" style={{ fontFamily: DashboardTheme.Typography.FontFamily.Sans }}>
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
