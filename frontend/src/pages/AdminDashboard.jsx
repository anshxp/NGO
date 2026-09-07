import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalMembers: 0, totalDonations: 0, activeCampaigns: 0, totalBeneficiaries: 0 });
  const [donationTrend, setDonationTrend] = useState([]);
  useEffect(() => { fetchStats(); }, []);
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();
      setStats(data.stats || {});
      setDonationTrend(data.trend || []);
    } catch (error) { console.error('Error fetching stats:', error); }
  };
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8"><h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1><p className="text-gray-600">Overview of your organization's activities and metrics</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ['👥', 'Total Members', stats.totalMembers, 'Active members', 'text-blue-600'],
            ['💰', 'Total Donations', `₹${(stats.totalDonations / 100000).toFixed(1)}L`, 'All time', 'text-green-600'],
            ['🚀', 'Active Campaigns', stats.activeCampaigns, 'Running campaigns', 'text-orange-600'],
            ['🤝', 'Beneficiaries', stats.totalBeneficiaries, 'People helped', 'text-red-600'],
          ].map(([icon, title, value, subtitle, valueClass]) => (
            <Card key={title} className="border-0 shadow-lg hover:shadow-xl transition-shadow"><CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2"><span className="text-2xl">{icon}</span>{title}</CardTitle></CardHeader><CardContent><div className={`text-4xl font-bold ${valueClass}`}>{value}</div><p className="text-xs text-gray-500 mt-2">{subtitle}</p></CardContent></Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg"><CardHeader className="border-b border-gray-100 pb-4"><CardTitle>Donation Trends</CardTitle><CardDescription>Last 12 months</CardDescription></CardHeader><CardContent className="pt-6"><ResponsiveContainer width="100%" height={300}><LineChart data={donationTrend}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="donations" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 5 }} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="border-0 shadow-lg"><CardHeader className="border-b border-gray-100 pb-4"><CardTitle>Donation Distribution</CardTitle><CardDescription>By type</CardDescription></CardHeader><CardContent className="pt-6"><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={[{ name: 'Online', value: 40 }, { name: 'Cash', value: 30 }, { name: 'Campaign', value: 20 }, { name: 'Other', value: 10 }]} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} (${value}%)`} outerRadius={80} fill="#8884d8" dataKey="value">{[0,1,2,3].map((index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </div>
    </AdminLayout>
  );
}
