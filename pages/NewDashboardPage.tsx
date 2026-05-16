import React, { useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardTheme } from '../lib/theme';
import { MetricCard } from '../components/Dashboard/MetricCard';
import { DataTable } from '../components/Dashboard/DataTable';
import { RevenueChart, LeadsBarChart, TrafficPieChart } from '../components/Dashboard/Charts';
import { ConfirmModal } from '../components/Dashboard/Modals';
import { MockDashboardData } from '../services/mockDashboardData';
import { DollarSign, Users, TrendingUp, Briefcase } from 'lucide-react';

export const NewDashboardPage = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const metrics = [
        { ...MockDashboardData.metrics[0], icon: DollarSign },
        { ...MockDashboardData.metrics[1], icon: Users },
        { ...MockDashboardData.metrics[2], icon: TrendingUp },
        { ...MockDashboardData.metrics[3], icon: Briefcase },
    ];

    const columns = [
        { key: 'name', label: 'Lead Name', sortable: true },
        { key: 'company', label: 'Company', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'value', label: 'Value', sortable: true },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>
                            Dashboard Overview
                        </h1>
                        <p className="text-sm mt-1" style={{ color: DashboardTheme.Colors.Neutrals.TextSecondary }}>
                            Welcome back, Sarah. Here's what's happening today.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-50 transition-colors font-medium text-sm"
                            style={{ borderColor: DashboardTheme.Colors.Neutrals.Border, color: DashboardTheme.Colors.Neutrals.TextPrimary }}
                        >
                            Export Report
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-shadow shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                            style={{ backgroundColor: DashboardTheme.Colors.Brand.Primary }}
                            onClick={() => setIsDeleteModalOpen(true)} // Demo modal
                        >
                            Create Campaign
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, idx) => (
                        <MetricCard key={idx} {...metric} />
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Revenue Area Chart */}
                    <div className="xl:col-span-2 bg-white rounded-xl p-6 border transition-all hover:shadow-md" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg" style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>Revenue Growth</h3>
                            <select className="text-sm border rounded-md p-1 outline-none text-gray-500">
                                <option>This Year</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <RevenueChart data={MockDashboardData.revenueData} />
                    </div>

                    {/* Traffic Pie Chart */}
                    <div className="bg-white rounded-xl p-6 border transition-all hover:shadow-md" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                        <h3 className="font-bold text-lg mb-6" style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>Traffic Sources</h3>
                        <TrafficPieChart data={MockDashboardData.trafficData} />
                    </div>
                </div>

                {/* Bottom Grid: Leads Bar Chart + Data Table */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Leads Bar Chart */}
                    <div className="xl:col-span-1 bg-white rounded-xl p-6 border transition-all hover:shadow-md" style={{ borderColor: DashboardTheme.Colors.Neutrals.Border }}>
                        <h3 className="font-bold text-lg mb-6" style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>Weekly Leads</h3>
                        <LeadsBarChart data={MockDashboardData.leadsData} />
                    </div>

                    {/* Recent Leads Table */}
                    <div className="xl:col-span-2">
                        <DataTable
                            title="Recent Leads"
                            columns={columns}
                            data={MockDashboardData.recentLeads}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => console.log('Confirmed!')}
                title="Delete Campaign?"
                message="Are you sure you want to delete this campaign? This action cannot be undone and all data associated with it will be lost."
            />
        </DashboardLayout>
    );
};
