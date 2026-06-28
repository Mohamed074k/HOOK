import { useState, useEffect } from "react";
import { Users, ShoppingBag, Fish, Ship, Package, ShoppingCart, TrendingUp, AlertCircle, ArrowUpRight, BarChart3, Calendar, Loader2 } from "lucide-react";
import apiClient from "../../api/apiClient"; 
import toast from "react-hot-toast";

const alertTypeColors = {
  warning: "bg-yellow-400/10 text-yellow-400",
  danger: "bg-sky-400/10 text-sky-400",
  info: "bg-teal-400/10 text-teal-400",
};

const SuperAdminDashboard = () => {
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);

  // Live Connected State DTO
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTripManagers: 0,
    totalSellers: 0,
    totalTrips: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchGlobalStats();
    return () => clearTimeout(timer);
  }, []);

  const fetchGlobalStats = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/AdminDashboard/stats");
      if (data) {
        setStats({
          totalUsers: data.totalUsers || 0,
          totalTripManagers: data.totalTripManagers || 0,
          totalSellers: data.totalSellers || 0,
          totalTrips: data.totalTrips || 0,
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          totalBookings: data.totalBookings || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch super admin dashboard stats:", error);
      toast.error("Could not sync live platform statistics.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Dynamic 8-Card Blueprint ───────────────────────────────────────────────
  const statsCards = [
    { label: "Total Users", value: loading ? "…" : stats.totalUsers.toLocaleString(), change: "+8.2%", icon: Users, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Total Trip Managers", value: loading ? "…" : stats.totalTripManagers.toLocaleString(), change: "+5.7%", icon: Fish, color: "text-teal-400", bg: "bg-teal-400/10" },
    { label: "Total Sellers", value: loading ? "…" : stats.totalSellers.toLocaleString(), change: "+3.1%", icon: ShoppingBag, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Total Trips", value: loading ? "…" : stats.totalTrips.toLocaleString(), change: "+12.3%", icon: Ship, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Total Products", value: loading ? "…" : stats.totalProducts.toLocaleString(), change: "+9.4%", icon: Package, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Orders", value: loading ? "…" : stats.totalOrders.toLocaleString(), change: "+15.2%", icon: ShoppingCart, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Total Bookings", value: loading ? "…" : stats.totalBookings.toLocaleString(), change: "+18.1%", icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-400/10" }, // <-- Added 8th Card
    { label: "Total Revenue", value: loading ? "…" : `$${stats.totalRevenue.toLocaleString()}`, change: "+12.4%", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div 
        className="flex items-start justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Platform Overview</h1>
          <p className="text-[#a3cbf2]/50 mt-1 text-sm sm:text-base">
            Welcome back, Super Admin. Here's what's happening across the platform.
          </p>
        </div>
      </div>

      {/* Stats Cards - Staggered fade in */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map(({ label, value, change, icon: Icon, color, bg }, idx) => (
          <div
            key={label}
            className="group bg-[#002238] border border-white/5 rounded-2xl p-4 sm:p-6 cursor-default transition-all duration-500 ease-out hover:border-white/10 hover:-translate-y-1 hover:shadow-xl"
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${idx * 75}ms`,
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={color} size={21} />
              </div>
              <ArrowUpRight size={16} className="text-[#a3cbf2]/20 group-hover:text-[#a3cbf2]/60 transition-all" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-[#cee5ff] tracking-tight">{value}</p>
            <p className="text-[#a3cbf2]/50 text-xs sm:text-sm mt-1 truncate">{label}</p>
            <p className={`text-[10px] sm:text-xs mt-2 sm:mt-3 font-medium ${color} opacity-70 truncate`}>{change} this month</p>
          </div>
        ))}
      </div>

      {/* Charts Section - Locked Static */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Users Growth Chart */}
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "400ms" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#cee5ff] flex items-center gap-2">
              <BarChart3 size={18} className="text-sky-400" /> Users Growth
            </h2>
            <select className="bg-[#001526] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-[#a3cbf2]/60 focus:outline-none focus:border-sky-400/40">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="flex items-end gap-3 h-40">
            {[420, 580, 720, 890, 1100, 1350].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div
                  className="w-full bg-gradient-to-t from-sky-500 to-sky-400 rounded-t-lg group-hover:opacity-80 transition-all duration-1000 ease-out"
                  style={{ 
                    height: animate ? `${(h / 1500) * 100}%` : "0%",
                    transitionDelay: `${500 + (i * 50)}ms` 
                  }}
                />
                <p className="text-[#a3cbf2]/40 text-xs">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-xs text-[#a3cbf2]/30">
            <span>+32% growth this quarter</span>
            <span>12,481 total users</span>
          </div>
        </div>

        {/* Revenue Over Time Chart */}
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "500ms" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#cee5ff] flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" /> Revenue Over Time
            </h2>
            <select className="bg-[#001526] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-[#a3cbf2]/60 focus:outline-none focus:border-sky-400/40">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="flex items-end gap-3 h-40">
            {[52, 61, 55, 78, 84, 94].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg group-hover:opacity-80 transition-all duration-1000 ease-out"
                  style={{ 
                    height: animate ? `${h}%` : "0%",
                    transitionDelay: `${600 + (i * 50)}ms` 
                  }}
                />
                <p className="text-[#a3cbf2]/40 text-xs">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-xs text-[#a3cbf2]/30">
            <span>$94.3K MTD</span>
            <span>↑ 12.4% vs last month</span>
          </div>
        </div>
      </div>

      {/* Bookings Trend Chart */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "600ms" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-[#cee5ff] flex items-center gap-2">
            <Calendar size={18} className="text-yellow-400" /> Bookings Trend
          </h2>
          <select className="bg-[#001526] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-[#a3cbf2]/60 focus:outline-none focus:border-sky-400/40">
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
        <div className="flex items-end gap-3 h-32">
          {[234, 278, 312, 398, 456, 524].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div
                className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg group-hover:opacity-80 transition-all duration-1000 ease-out"
                style={{ 
                  height: animate ? `${(h / 600) * 100}%` : "0%",
                  transitionDelay: `${700 + (i * 50)}ms` 
                }}
              />
              <p className="text-[#a3cbf2]/40 text-xs">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-xs text-[#a3cbf2]/30">
          <span>524 bookings this month</span>
          <span>↑ 14.9% vs last month</span>
        </div>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;