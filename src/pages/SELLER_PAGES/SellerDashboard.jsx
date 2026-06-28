import { Package, ShoppingCart, Star, DollarSign, ArrowUpRight, Plus, Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";

// Status Mapper
const STATUS_MAP = {
  DeliveredConfirmedByBuyer: { text: "Delivered", style: "bg-sky-400/10 text-sky-400" },
  OutForDelivery: { text: "Shipped", style: "bg-teal-400/10 text-teal-400" },
  Processing: { text: "Processing", style: "bg-yellow-400/10 text-yellow-400" },
  Cancelled: { text: "Cancelled", style: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50" },
};

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);

  //  Live Data States
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchDashboardData();
    return () => clearTimeout(timer);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fires all 3 network calls concurrently for instant loading
      const [statsRes, ordersRes, reviewsRes] = await Promise.all([
        apiClient.get("/api/marketplace/seller/dashboard/statistics"),
        apiClient.get("/api/marketplace/seller/dashboard/recent-orders?count=5"),
        apiClient.get("/api/marketplace/seller/dashboard/recent-reviews?count=5"),
      ]);

      if (statsRes.data) {
        setStats({
          totalProducts: statsRes.data.totalProducts || 0,
          activeProducts: statsRes.data.activeProducts || 0,
          totalOrders: statsRes.data.totalOrders || 0,
          monthlyRevenue: statsRes.data.monthlyRevenue || 0,
        });
      }

      setRecentOrders(ordersRes.data || []);
      setRecentReviews(reviewsRes.data || []);
    } catch (err) {
      console.error("Dashboard Sync Failed:", err);
      toast.error("Failed to sync live dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Stat Cards Blueprint
  const cards = [
    {
      label: "Total Products",
      value: loading ? "…" : stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      ring: "hover:ring-sky-400/20",
      glow: "hover:shadow-sky-400/5",
      trend: "Total catalog inventory",
    },
    {
      label: "Active Products",
      value: loading ? "…" : stats.activeProducts.toLocaleString(),
      icon: Package,
      color: "text-teal-400",
      bg: "bg-teal-400/10",
      ring: "hover:ring-teal-400/20",
      glow: "hover:shadow-teal-400/5",
      trend: "Currently visible to buyers",
    },
    {
      label: "Total Orders",
      value: loading ? "…" : stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      ring: "hover:ring-yellow-400/20",
      glow: "hover:shadow-yellow-400/5",
      trend: "Lifetime processed fulfillments",
    },
    {
      label: "Monthly Revenue",
      value: loading ? "…" : `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      ring: "hover:ring-emerald-400/20",
      glow: "hover:shadow-emerald-400/5",
      trend: "Earnings recorded this month",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Dashboard</h1>
            <p className="text-[#a3cbf2]/50 mt-1 text-sm sm:text-base">Overview of your store activity and sales</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`flex gap-3 flex-wrap transform transition-all duration-700 delay-100 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        <button
          onClick={() => navigate("/seller/products/add")}
          className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-400 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus size={16} /> Add Product
        </button>
        <button
          onClick={() => navigate("/seller/orders")}
          className="flex items-center gap-2 bg-[#002238] border border-white/5 text-[#cee5ff] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/5 transition-all duration-200"
        >
          <Eye size={16} /> View Orders
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg, ring, glow, trend }, idx) => (
          <div
            key={label}
            className={`group bg-[#002238] border border-white/5 rounded-2xl p-6 cursor-default transition-all duration-300
              hover:border-white/10 hover:-translate-y-1 hover:shadow-xl ${glow} ring-1 ring-transparent ${ring}
              transform transition-all duration-700 ease-out`}
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(30px)",
              transitionDelay: `${idx * 100}ms`,
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={color} size={21} />
              </div>
              <ArrowUpRight size={16} className="text-[#a3cbf2]/20 group-hover:text-[#a3cbf2]/60 transition-all" />
            </div>
            
            <p className="text-2xl sm:text-3xl font-black text-[#cee5ff] tracking-tight">{value}</p>
            <p className="text-[#a3cbf2]/50 text-xs sm:text-sm mt-0.5 sm:mt-1">{label}</p>

            <p className={`text-[10px] sm:text-xs mt-2 sm:mt-3 font-medium ${color} opacity-70`}>
              {trend}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders & Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders */}
        <div
          className={`bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 delay-200 ease-out ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-base font-bold text-[#cee5ff]">Recent Orders</h2>
            <button onClick={() => navigate("/seller/orders")} className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="py-12 flex justify-center"><Loader2 size={24} className="text-sky-400 animate-spin" /></div>
            ) : recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#a3cbf2]/30">No orders recorded yet.</div>
            ) : (
              recentOrders.map((order, idx) => {
                const uiStatus = STATUS_MAP[order.status] || { text: order.status || "Pending", style: "bg-white/5 text-[#a3cbf2]/60" };
                const shortId = order.orderId ? `#ORD-${order.orderId.slice(0, 6).toUpperCase()}` : "#ORD-????";

                return (
                  <div
                    key={order.orderId || idx}
                    className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors"
                    style={{
                      animation: animate ? `slideIn 0.5s ease-out ${idx * 0.1}s forwards` : "none",
                      opacity: 0,
                      transform: "translateX(-20px)",
                    }}
                  >
                    <div>
                      <p className="text-[#cee5ff] font-medium text-sm">{shortId}</p>
                      <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{order.buyerName || "Guest Buyer"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sky-400 text-sm font-bold">${order.total?.toLocaleString() || "0"}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${uiStatus.style}`}>
                        {uiStatus.text}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div
          className={`bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 delay-300 ease-out ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-base font-bold text-[#cee5ff]">Recent Reviews</h2>
            <button  className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="py-12 flex justify-center"><Loader2 size={24} className="text-sky-400 animate-spin" /></div>
            ) : recentReviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#a3cbf2]/30">No reviews received yet.</div>
            ) : (
              recentReviews.map((review, idx) => {
                const safeRating = Math.min(Math.max(review.rating || 5, 1), 5);

                return (
                  <div
                    key={review.reviewId || idx}
                    className="px-6 py-4 hover:bg-white/[0.03] transition-colors"
                    style={{
                      animation: animate ? `slideIn 0.5s ease-out ${idx * 0.1}s forwards` : "none",
                      opacity: 0,
                      transform: "translateX(-20px)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[#cee5ff] font-medium text-sm truncate max-w-[200px] sm:max-w-[280px]">
                        {review.productTitle || "Marketplace Item"}
                      </p>
                      <span className="text-yellow-400 text-sm tracking-widest shrink-0 ml-2">
                        {"★".repeat(safeRating)}{"☆".repeat(5 - safeRating)}
                      </span>
                    </div>
                    <p className="text-[#a3cbf2]/60 text-xs">{review.buyerName || "Anonymous Angler"}</p>
                    <p className="text-[#a3cbf2]/50 text-xs mt-1 line-clamp-1 italic">
                      "{review.comment || "No written feedback provided."}"
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SellerDashboard;