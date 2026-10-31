import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  Activity, 
  Calendar,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const COLORS = [
  '#a855f7', // Purple
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAnalytics();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load real-time analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Rendering visual analytics from database records...</p>
      </div>
    );
  }

  const {
    startupsByCategory = [],
    meetingRequestsByStatus = [],
    registrationsOverTime = [],
    monthlyPlatformActivity = []
  } = data || {};

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-[#0e0828] border border-purple-500/30 text-xs shadow-xl backdrop-blur-md">
          <p className="font-bold text-white mb-1.5">{label || payload[0]?.name}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="flex items-center gap-2" style={{ color: entry.color || entry.fill }}>
              <span className="font-semibold">{entry.name}:</span>
              <span className="text-white font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Platform Analytics & Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time visualizations computed dynamically from actual MySQL database records.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchAnalytics}
          className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-600/30 transition-all flex items-center gap-2 self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Grid of Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Startups by Business Category (Donut/Pie Chart) */}
        <div className="p-6 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Startups by Category</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Vertical Breakdown</span>
          </div>

          <div className="h-72 w-full pt-4">
            {startupsByCategory.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No category data recorded yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} 
                  />
                  <Pie
                    data={startupsByCategory}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    stroke="#0d0824"
                    strokeWidth={2}
                  >
                    {startupsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Meeting Requests by Status (Bar Chart) */}
        <div className="p-6 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Meeting Proposals by Status</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Deal Conversion</span>
          </div>

          <div className="h-72 w-full pt-4">
            {meetingRequestsByStatus.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No meeting proposals logged
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={meetingRequestsByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#25164d" vertical={false} />
                  <XAxis dataKey="status" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Proposals" radius={[8, 8, 0, 0]}>
                    {meetingRequestsByStatus.map((entry, index) => {
                      const fill = entry.status === 'Accepted' || entry.status === 'ACCEPTED'
                        ? '#10b981'
                        : entry.status === 'Rejected' || entry.status === 'REJECTED'
                        ? '#f43f5e'
                        : '#f59e0b';
                      return <Cell key={`bar-${index}`} fill={fill} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. Registrations Over Time (Area Chart) */}
        <div className="p-6 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Registrations Over Time</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">User Onboarding Growth</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStartups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInvestors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#25164d" vertical={false} />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="startups" 
                  name="Startups Registered" 
                  stroke="#a855f7" 
                  fillOpacity={1} 
                  fill="url(#colorStartups)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="investors" 
                  name="Investors Registered" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorInvestors)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Monthly Platform Activity (Bar Chart) */}
        <div className="p-6 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">Monthly Platform Activity</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Cross-Module Actions</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPlatformActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#25164d" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} 
                />
                <Bar dataKey="startups" name="Startups" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="investors" name="Investors" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meetings" name="Meetings" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminAnalytics;
