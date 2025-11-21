import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Users, AlertCircle, Truck, MapPin, TrendingUp, Activity, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import SideBar from "../components/SideBar";
import { getDashboardData } from "../../api/adminApi";

export default function AllData() {
  const [activeMenu, setActiveMenu] = React.useState("Dashboard");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: getDashboardData,
  });

  useEffect(() => {
    if (isError) console.log("Error fetching dashboard data:", error);
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
            </div>
            <p className="text-slate-400 text-lg font-medium">Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md backdrop-blur-sm">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 text-center text-lg">Unable to load dashboard data</p>
            <p className="text-slate-500 text-center text-sm mt-2">Please check your connection and try again</p>
          </div>
        </main>
      </div>
    );
  }

  const stats = data?.data?.statistics;
  const recentComplaints = data?.data?.recentActivity?.recentComplaints || [];

  // Prepare data for charts
  const userDistributionData = [
    { name: "Regular Users", value: stats?.users?.regular || 0, color: "#10b981" },
    { name: "Businesses", value: stats?.users?.businesses || 0, color: "#3b82f6" },
    { name: "Admins", value: stats?.users?.admins || 0, color: "#8b5cf6" },
  ];

  const complaintStatusData = [
    { name: "Pending", value: stats?.complaints?.pending || 0, color: "#f59e0b" },
    { name: "Verified", value: stats?.complaints?.verified || 0, color: "#3b82f6" },
    { name: "Resolved", value: stats?.complaints?.resolved || 0, color: "#10b981" },
  ];

  // Calculate complaint trends by ward
  const wardComplaintData = recentComplaints.reduce((acc, c) => {
    const ward = `Ward ${c.user.ward_no}`;
    const existing = acc.find(item => item.ward === ward);
    if (existing) {
      existing.complaints += 1;
    } else {
      acc.push({ ward, complaints: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.complaints - a.complaints).slice(0, 6);

  // Recent activity metrics
  const recentActivityStats = {
    totalRecent: recentComplaints.length,
    pendingRecent: recentComplaints.filter(c => c.status === "pending").length,
    verifiedRecent: recentComplaints.filter(c => c.status === "verified").length,
    resolvedRecent: recentComplaints.filter(c => c.status === "resolved").length,
  };

  const operationsData = [
    { metric: "Trucks", value: stats?.operations?.totalTrucks || 0 },
    { metric: "Routes", value: stats?.operations?.totalRoutes || 0 },
    { metric: "Wards", value: stats?.operations?.wardsCovered || 0 },
  ];

  // Resolution rate calculation
  const resolutionRate = stats?.complaints?.total > 0 
    ? ((stats?.complaints?.resolved / stats?.complaints?.total) * 100).toFixed(1)
    : 0;

  // Efficiency score (mock calculation)
  const efficiencyScore = stats?.operations?.totalTrucks > 0
    ? Math.min(((stats?.operations?.wardsCovered / stats?.operations?.totalTrucks) * 10).toFixed(1), 100)
    : 0;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main className="flex-1 overflow-y-auto">
        {/* Header Section with Gradient */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5"></div>
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Analytics Overview</h1>
                <p className="text-slate-400">Real-time insights and performance metrics</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-xs text-emerald-400 font-medium">LIVE</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-sm mb-1 font-medium">Total Users</p>
                <p className="text-4xl font-bold text-white mb-2">{stats?.users?.total || 0}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400">+12.5%</span>
                  <span className="text-slate-500">vs last month</span>
                </div>
              </div>
            </div>

            {/* Total Complaints */}
            <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                  </div>
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-slate-400 text-sm mb-1 font-medium">Total Complaints</p>
                <p className="text-4xl font-bold text-white mb-2">{stats?.complaints?.total || 0}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-amber-400">{stats?.complaints?.pending || 0} pending</span>
                  <span className="text-slate-500">• Requires action</span>
                </div>
              </div>
            </div>

            {/* Fleet Size */}
            <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <Truck className="w-6 h-6 text-blue-400" />
                  </div>
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-slate-400 text-sm mb-1 font-medium">Active Fleet</p>
                <p className="text-4xl font-bold text-white mb-2">{stats?.operations?.totalTrucks || 0}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-400">{stats?.operations?.totalRoutes || 0} routes</span>
                  <span className="text-slate-500">• Operational</span>
                </div>
              </div>
            </div>

            {/* Pickup Requests */}
            <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800 hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-slate-400 text-sm mb-1 font-medium">Pickup Requests</p>
                <p className="text-4xl font-bold text-white mb-2">{stats?.operations?.totalPickupRequests || 0}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-purple-400">{stats?.operations?.pendingPickupRequests || 0} pending</span>
                  <span className="text-slate-500">• In queue</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm font-medium">Resolution Rate</p>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">{resolutionRate}%</p>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${resolutionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm font-medium">Coverage Efficiency</p>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">{efficiencyScore}%</p>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${efficiencyScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm font-medium">Wards Covered</p>
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">{stats?.operations?.wardsCovered || 0}</p>
              <p className="text-slate-500 text-sm">Active service areas</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Distribution */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-6">User Distribution</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#0f172a"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#fff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {userDistributionData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-400 text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complaint Status */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-6">Complaint Status</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={complaintStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {complaintStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ward Analysis & Operations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ward Complaints */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-6">Top Wards by Activity</h2>
              {wardComplaintData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={wardComplaintData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="ward" type="category" width={80} stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="complaints" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <MapPin className="w-12 h-12 mb-3 opacity-30" />
                  <p>No ward data available</p>
                </div>
              )}
            </div>

            {/* Operations Capacity */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-6">Operations Capacity</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={operationsData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="metric" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#fff'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity Snapshot</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-500">Total</span>
                </div>
                <p className="text-3xl font-bold text-white">{recentActivityStats.totalRecent}</p>
                <p className="text-slate-400 text-sm mt-1">All activities</p>
              </div>
              
              <div className="bg-amber-500/5 rounded-xl p-5 border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span className="text-xs text-amber-500">Pending</span>
                </div>
                <p className="text-3xl font-bold text-amber-400">{recentActivityStats.pendingRecent}</p>
                <p className="text-slate-400 text-sm mt-1">Awaiting review</p>
              </div>
              
              <div className="bg-blue-500/5 rounded-xl p-5 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-blue-500">Verified</span>
                </div>
                <p className="text-3xl font-bold text-blue-400">{recentActivityStats.verifiedRecent}</p>
                <p className="text-slate-400 text-sm mt-1">Under process</p>
              </div>
              
              <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs text-emerald-500">Resolved</span>
                </div>
                <p className="text-3xl font-bold text-emerald-400">{recentActivityStats.resolvedRecent}</p>
                <p className="text-slate-400 text-sm mt-1">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}