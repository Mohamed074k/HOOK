import { useState, useEffect } from "react";
import { Users, TrendingUp, Star, Ship, Package, ArrowUpRight } from "lucide-react";

const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const mostActiveUsers = [
    { name: "Mohamed Elsayed", trips: 12, bookings: 8 },
    { name: "Mohamed Elsayed", trips: 9, bookings: 6 },
    { name: "Mohamed Elsayed", trips: 7, bookings: 5 },
    { name: "Mohamed Elsayed", trips: 6, bookings: 4 },
  ];

  const topTrips = [
    { name: "Deep Sea Adventure", bookings: 45, revenue: 20250 },
    { name: "Sunset Charter", bookings: 38, revenue: 6840 },
    { name: "Coastal Fly Fishing", bookings: 32, revenue: 7040 },
    { name: "North Shore Expedition", bookings: 28, revenue: 25200 },
  ];

  const topProducts = [
    { name: "Apex Carbon Reel", sales: 142, revenue: 120558 },
    { name: "HydroScan V3", sales: 89, revenue: 115611 },
    { name: "CarbonFlex Rod", sales: 76, revenue: 54720 },
    { name: "Deep Bait Master", sales: 234, revenue: 33930 },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Analytics</h1>
        <div className="flex gap-2 bg-[#002238] p-1 rounded-xl border border-white/5">
          {["weekly", "monthly", "yearly"].map((tf) => (
             <button 
               key={tf}
               onClick={() => setTimeframe(tf)} 
               className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-300 ${timeframe === tf ? "bg-sky-500/20 text-sky-400 shadow-sm" : "text-[#a3cbf2]/40 hover:text-[#cee5ff] hover:bg-white/5"}`}
             >
               {tf}
             </button>
          ))}
        </div>
      </div>

      {/* Grid wrapper for responsive alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Active Users - Animated Progress Bars */}
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out hover:border-white/10"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
        >
          <h2 className="text-base font-bold text-[#cee5ff] flex items-center gap-2 mb-6">
            <Users size={18} className="text-sky-400" /> Most Active Users
          </h2>
          <div className="space-y-4">
            {mostActiveUsers.map((user, idx) => (
              <div key={user.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
                <div>
                  <p className="text-[#cee5ff] font-medium group-hover:text-sky-400 transition-colors">{user.name}</p>
                  <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{user.trips} trips · {user.bookings} bookings</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-2 bg-[#001526] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sky-400 rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: animate ? `${(user.trips / 12) * 100}%` : "0%",
                        transitionDelay: `${300 + (idx * 100)}ms` 
                      }} 
                    />
                  </div>
                  <span className="text-[#a3cbf2]/40 text-xs font-mono">{user.trips}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Trips */}
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out hover:border-white/10"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
        >
          <h2 className="text-base font-bold text-[#cee5ff] flex items-center gap-2 mb-6">
            <Ship size={18} className="text-yellow-400" /> Top Trips
          </h2>
          <div className="space-y-4">
            {topTrips.map((trip, idx) => (
              <div key={trip.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
                <div>
                  <p className="text-[#cee5ff] font-medium group-hover:text-yellow-400 transition-colors">{trip.name}</p>
                  <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{trip.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-sky-400 font-bold">${trip.revenue.toLocaleString()}</p>
                  <p className="text-[#a3cbf2]/40 text-xs">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-6 lg:col-span-2 transform transition-all duration-700 ease-out hover:border-white/10"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "300ms" }}
        >
          <h2 className="text-base font-bold text-[#cee5ff] flex items-center gap-2 mb-6">
            <Package size={18} className="text-emerald-400" /> Top Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {topProducts.map((product, idx) => (
              <div key={product.name} className="flex items-center justify-between py-2 border-b border-white/5 group">
                <div>
                  <p className="text-[#cee5ff] font-medium group-hover:text-emerald-400 transition-colors">{product.name}</p>
                  <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">${product.revenue.toLocaleString()}</p>
                  <p className="text-[#a3cbf2]/40 text-xs">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;