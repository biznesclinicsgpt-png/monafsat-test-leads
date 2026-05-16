export const MockDashboardData = {
    metrics: [
        { label: 'Total Revenue', value: '$124,500', trend: 12.5, trendLabel: 'vs last month' },
        { label: 'New Leads', value: '1,240', trend: 8.2, trendLabel: 'vs last month' },
        { label: 'Conversion Rate', value: '3.2%', trend: -1.1, trendLabel: 'vs last month' },
        { label: 'Active Deals', value: '45', trend: 5.4, trendLabel: 'vs last month' },
    ],
    revenueData: [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
        { name: 'Jul', value: 3490 },
    ],
    leadsData: [
        { name: 'Mon', value: 120 },
        { name: 'Tue', value: 132 },
        { name: 'Wed', value: 101 },
        { name: 'Thu', value: 134 },
        { name: 'Fri', value: 90 },
        { name: 'Sat', value: 230 },
        { name: 'Sun', value: 210 },
    ],
    trafficData: [
        { name: 'Direct', value: 400 },
        { name: 'Organic', value: 300 },
        { name: 'Referral', value: 300 },
        { name: 'Social', value: 200 },
    ],
    recentLeads: [
        { id: 1, name: 'John Doe', company: 'Tech Corp', status: 'Active', value: '$12,000' },
        { id: 2, name: 'Jane Smith', company: 'Design Co', status: 'Pending', value: '$8,500' },
        { id: 3, name: 'Mike Johnson', company: 'Consulting Ltd', status: 'Inactive', value: '$3,200' },
        { id: 4, name: 'Sarah Wilson', company: 'Marketing Agency', status: 'Active', value: '$15,000' },
        { id: 5, name: 'Tom Brown', company: 'Construction Inc', status: 'Premium', value: '$25,000' },
    ]
};
