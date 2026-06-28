import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Calendar, Package, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const EarningsPage = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);

  // Live Connected States
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 18,
    totalOrders: 0,
    averageOrderValue: 0,
  });

  const [topProducts, setTopProducts] = useState([]);

  // Hardcoded Static Mock Data
  const monthlyData = [
    { month: "Jan", revenue: 5200, orders: 42 },
    { month: "Feb", revenue: 6100, orders: 48 },
    { month: "Mar", revenue: 8420, orders: 66 },
    { month: "Apr", revenue: 7200, orders: 54 },
    { month: "May", revenue: 8900, orders: 71 },
    { month: "Jun", revenue: 9500, orders: 78 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      // Sales endpoint unhooked
      const [statsRes, topProductsRes] = await Promise.all([
        apiClient.get("/api/marketplace/seller/dashboard/statistics"),
        apiClient.get("/api/marketplace/seller/dashboard/top-products?count=5"),
      ]);

      if (statsRes.data) {
        setStats({
          totalRevenue: statsRes.data.totalRevenue || 0,
          monthlyRevenue: statsRes.data.monthlyRevenue || 0,
          monthlyGrowth: 18, 
          totalOrders: statsRes.data.totalOrders || 0,
          averageOrderValue: Math.round(statsRes.data.averageOrderValue || 0),
        });
      }

      if (topProductsRes.data && Array.isArray(topProductsRes.data)) {
        const parsedProducts = topProductsRes.data.map((prod) => ({
          name: prod.productName || "Unknown Item",
          revenue: prod.profit || 0, 
          sales: prod.quantitySold || 0,
          percentage: prod.revenuePercentage || 0,
        }));
        setTopProducts(parsedProducts);
      }

      setTimeout(() => setAnimate(true), 50);
    } catch (err) {
      console.error("Failed syncing earnings context endpoints:", err);
      toast.error("Failed to load earnings reports.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50 text-sm tracking-wide">Assembling live financial tracking reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Animated Header */}
      <div className={`transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">My Earnings</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">Track your sales performance and revenue</p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards - Staggered Fade Up */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, color: "text-sky-400", bg: "bg-sky-400/10", label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}` },
          { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Monthly Revenue", value: `$${stats.monthlyRevenue.toLocaleString()}`, extra: true }, 
          { icon: Package, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Total Orders", value: stats.totalOrders.toLocaleString() },
          { icon: Calendar, color: "text-teal-400", bg: "bg-teal-400/10", label: "Avg. Order Value", value: `$${stats.averageOrderValue.toLocaleString()}` },
        ].map((card, idx) => (
          <div 
            key={idx} 
            className="bg-[#002238] border border-white/5 rounded-2xl p-6 group hover:-translate-y-1 hover:shadow-lg hover:border-white/10 transition-all duration-500 transform ease-out"
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${idx * 100}ms`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${card.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={card.color} size={20} />
              </div>
            </div>
            <p className="text-[#a3cbf2]/50 text-xs sm:text-sm mt-0.5 sm:mt-1">{card.label}</p>
            <p className="text-2xl sm:text-3xl font-black text-[#cee5ff] mt-1">{card.value}</p>
            {card.extra && (
              <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${stats.monthlyGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {stats.monthlyGrowth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(stats.monthlyGrowth)}% vs last month
              </p>
            )}
          </div>
        ))}
      </div>
      
      {/* Sales Chart - Static Data Array */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "400ms",
        }}
      >
        <h2 className="text-base font-bold text-[#cee5ff] mb-6">Sales Over Time</h2>
        <div className="h-64 flex items-end gap-2">
          {monthlyData.map((data, idx) => {
            const heightValue = maxRevenue > 0 ? (data.revenue / maxRevenue) * 200 : 0;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex justify-center h-full items-end">
                  <div className="absolute -top-10 bg-[#001526] border border-white/10 px-2 py-1 rounded text-xs text-sky-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-xl">
                    ${data.revenue.toLocaleString()}
                  </div>
                  <div
                    className="w-full max-w-[40px] bg-gradient-to-t from-sky-500/80 to-sky-400 rounded-t-lg transition-all duration-1000 ease-out group-hover:from-sky-400 group-hover:to-sky-300"
                    style={{ 
                      height: animate ? `${Math.max(heightValue, 4)}px` : "0px",
                      transitionDelay: `${500 + (idx * 50)}ms` 
                    }}
                  />
                </div>
                <div className="text-center mt-2">
                  <p className="text-[#cee5ff] text-xs font-medium">{data.month}</p>
                  <p className="text-[#a3cbf2]/40 text-[10px] hidden sm:block mt-0.5">{data.orders} orders</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Top Selling Products - Animated Progress Bars */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "500ms",
        }}
      >
        <h2 className="text-base font-bold text-[#cee5ff] mb-6">Top Selling Products</h2>
        {topProducts.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#a3cbf2]/30">
            No sales metrics available for allocation logs.
          </div>
        ) : (
          <div className="space-y-5">
            {topProducts.map((product, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#cee5ff] font-medium group-hover:text-sky-400 transition-colors truncate pr-4">
                    {product.name}
                  </span>
                  <span className="text-sky-400 font-bold shrink-0">${product.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#a3cbf2]/40">{product.sales} units sold</span>
                  <span className="text-[#a3cbf2]/40">{product.percentage}% of revenue</span>
                </div>
                <div className="h-2 bg-[#001526] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: animate ? `${product.percentage}%` : "0%",
                      transitionDelay: `${700 + (idx * 100)}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;