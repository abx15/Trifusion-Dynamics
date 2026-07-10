'use client';

import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/dashboard');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
  });

  if (isLoading) return <div className="p-6 text-white">Loading analytics...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading dashboard</div>;

  const { revenueTrend, clientGrowth, topPerformers } = data;

  const revenueData = revenueTrend?.map((item: any) => ({
    date: new Date(item.periodDate).toLocaleDateString(),
    revenue: Number(item.totalRevenue),
  })) || [];

  const clientData = clientGrowth?.map((item: any) => ({
    date: new Date(item.periodDate).toLocaleDateString(),
    clients: item.totalClients,
  })) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Analytics Overview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Revenue Trend (30 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Growth */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Client Growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Line type="monotone" dataKey="clients" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Top Performers</h2>
        {topPerformers?.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="pb-2">Employee ID</th>
                <th className="pb-2">Tasks Completed</th>
                <th className="pb-2">Tickets Resolved</th>
                <th className="pb-2">Hours Logged</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((p: any, i: number) => (
                <tr key={i} className="border-b border-gray-700/50">
                  <td className="py-3 text-white">{p.employeeId}</td>
                  <td className="py-3 text-white">{p.tasksCompleted}</td>
                  <td className="py-3 text-white">{p.ticketsResolved}</td>
                  <td className="py-3 text-white">{p.hoursLogged}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400">No performance data available.</div>
        )}
      </div>
    </div>
  );
}
