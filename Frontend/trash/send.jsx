import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Users, AlertCircle, Truck, MapPin, TrendingUp, Activity, CheckCircle2, Clock, AlertTriangle, BarChart3, Calendar } from "lucide-react";
import SideBar from "../components/SideBar";
import { getDashboardData } from "../../api/adminApi";

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl">
        <p className="text-slate-300 font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-400 text-sm">{entry.name}:</span>
            <span className="text-white font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
      <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
              {/* Spinning gradient ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-400 animate-spin"></div>
              {/* Inner pulsing dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-slate-300 text-xl font-semibold">Loading Analytics</p>
              <p className="text-slate-500 text-sm">Fetching real-time data...</p>
            </div>
            {/* Loading bars animation */}
            <div className="flex items-end justify-center gap-2 mt-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-emerald-500/50 rounded-full animate-pulse"
                  style={{
                    height: `${20 + i * 8}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="relative bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 rounded-3xl p-10 max-w-md backdrop-blur-xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent rounded-3xl"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <p className="text-red-400 text-center text-xl font-semibold mb-2">Unable to Load Dashboard</p>
              <p className="text-slate-400 text-center text-sm">Please check your connection and try again</p>
              <button className="w-full mt-6 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl transition-all duration-300 font-medium">
                Retry Connection
              </button>
            </div>
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main className="flex-1 overflow-y-auto">
        {/* Enhanced Header Section */}
        <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 border-b border-slate-700/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-blue-500/10"></div>
          <div className="absolute inset-0 bg-grid-slate-700/[0.05] bg-[size:32px_32px]"></div>
          <div className="relative px-8 py-10">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                    <BarChart3 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      Analytics Overview
                    </h1>
                  </div>
                </div>
                <p className="text-slate-400 text-base ml-1">Real-time insights and performance metrics</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-5 py-2.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <p className="text-sm text-emerald-400 font-semibold">LIVE</p>
                  </div>
                </div>
                <div className="px-5 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <p className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Enhanced Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl p-7 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 overflow-hidden backdrop-blur-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors duration-300">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-2 font-semibold uppercase tracking-wider">Total Users</p>
                <p className="text-5xl font-bold text-white mb-3 tracking-tight">
                  <AnimatedCounter value={stats?.users?.total || 0} />
                </p>
                <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-700/50">
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg font-semibold">+12.5%</span>
                  <span className="text-slate-500">vs last month</span>
                </div>
              </div>
            </div>

            {/* Total Complaints */}
            <div className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl p-7 border border-slate-700/50 hover:border-amber-500/50 transition-all duration-500 overflow-hidden backdrop-blur-sm hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-2xl border border-amber-500/30 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/20">
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors duration-300">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-2 font-semibold uppercase tracking-wider">Total Complaints</p>
                <p className="text-5xl font-bold text-white mb-3 tracking-tight">
                  <AnimatedCounter value={stats?.complaints?.total || 0} />
                </p>
                <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-700/50">
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg font-semibold">{stats?.complaints?.pending || 0} pending</span>
                  <span className="text-slate-500">• Requires action</span>
                </div>
              </div>
            </div>

            {/* Fleet Size */}
            <div className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl p-7 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 overflow-hidden backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl border border-blue-500/30 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                    <Truck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors duration-300">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-2 font-semibold uppercase tracking-wider">Active Fleet</p>
                <p className="text-5xl font-bold text-white mb-3 tracking-tight">
                  <AnimatedCounter value={stats?.operations?.totalTrucks || 0} />
                </p>
                <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-700/50">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-semibold">{stats?.operations?.totalRoutes || 0} routes</span>
                  <span className="text-slate-500">• Operational</span>
                </div>
              </div>
            </div>

            {/* Pickup Requests */}
            <div className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl p-7 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 overflow-hidden backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/20">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors duration-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-2 font-semibold uppercase tracking-wider">Pickup Requests</p>
                <p className="text-5xl font-bold text-white mb-3 tracking-tight">
                  <AnimatedCounter value={stats?.operations?.totalPickupRequests || 0} />
                </p>
                <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-700/50">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg font-semibold">{stats?.operations?.pendingPickupRequests || 0} pending</span>
                  <span className="text-slate-500">• In queue</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl p-7 border border-slate-700/50 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Resolution Rate</p>
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-4">{resolutionRate}%</p>
                <div className="relative w-full bg-slate-700/30 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-emerald-500/50 relative overflow-hidden"
                    style={{ width: `${resolutionRate}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mt-3">Complaints successfully resolved</p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl p-7 border border-slate-700/50 backdrop-blur-sm overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Coverage Efficiency</p>
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-4">{efficiencyScore}%</p>
                <div className="relative w-full bg-slate-700/30 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/50 relative overflow-hidden"
                    style={{ width: `${efficiencyScore}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mt-3">Operational efficiency score</p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl p-7 border border-slate-700/50 backdrop-blur-sm overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Wards Covered</p>
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-4">
                  <AnimatedCounter value={stats?.operations?.wardsCovered || 0} />
                </p>
                <p className="text-slate-400 text-sm mt-1">Active service areas</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-700/30 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                  </div>
                  <span className="text-slate-500 text-xs">75%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Distribution */}
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl p-8 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 opacity-50"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></div>
                  User Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <defs>
                      <filter id="shadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                      </filter>
                    </defs>
                    <Pie
                      data={userDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}