import { Package, ShoppingCart, Star, DollarSign, ArrowUpRight, Plus, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    label: "Total Products",
    value: "42",
    icon: Package,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    ring: "hover:ring-sky-400/20",
    glow: "hover:shadow-sky-400/5",
    trend: "3 added this week",
  },
  {
    label: "Active Products",
    value: "38",
    icon: Package,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    ring: "hover:ring-teal-400/20",
    glow: "hover:shadow-teal-400/5",
    trend: "4 out of stock",
  },
  {
    label: "Total Orders",
    value: "156",
    icon: ShoppingCart,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    ring: "hover:ring-yellow-400/20",
    glow: "hover:shadow-yellow-400/5",
    trend: "+12 this month",
  },
  {
    label: "Monthly Revenue",
    value: "$8,420",
    icon: DollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    ring: "hover:ring-emerald-400/20",
    glow: "hover:shadow-emerald-400/5",
    trend: "+18% vs last month",
  },
];

const recentOrders = [
  { id: "#ORD-1201", user: "Mohamed Elsayed", total: "$849", status: "Shipped" },
  { id: "#ORD-1200", user: "Ahmed Hafez", total: "$1,299", status: "Processing" },
  { id: "#ORD-1199", user: "Mohamed Elsayed", total: "$145", status: "Delivered" },
];

const recentReviews = [
  { product: "Apex Carbon Reel", user: "Mohamed S.", rating: 5, comment: "Best reel ever!" },
  { product: "HydroScan V3", user: "Ahmed H.", rating: 5, comment: "Game-changer!" },
  { product: "Deep Bait Master", user: "Mohamed S.", rating: 4, comment: "Great lures." },
];

const statusStyles = {
  Delivered: "bg-sky-400/10 text-sky-400",
  Shipped: "bg-teal-400/10 text-teal-400",
  Processing: "bg-yellow-400/10 text-yellow-400",
  Cancelled: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
};

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  // Scroll to top and trigger animation on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    // Trigger animation after a tiny delay
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

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
          {/* Value */}
            <p className="text-2xl sm:text-3xl font-black text-[#cee5ff] tracking-tight">{value}</p>
            <p className="text-[#a3cbf2]/50 text-xs sm:text-sm mt-0.5 sm:mt-1">{label}</p>

            {/* Trend */}
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
            {recentOrders.map((order, idx) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors"
                style={{
                  animation: animate ? `slideIn 0.5s ease-out ${idx * 0.1}s forwards` : "none",
                  opacity: 0,
                  transform: "translateX(-20px)",
                }}
              >
                <div>
                  <p className="text-[#cee5ff] font-medium text-sm">{order.id}</p>
                  <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{order.user}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sky-400 text-sm font-bold">{order.total}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[order.status] || ""}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
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
            <button onClick={() => navigate("/seller/reviews")} className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {recentReviews.map((review, idx) => (
              <div
                key={idx}
                className="px-6 py-4 hover:bg-white/[0.03] transition-colors"
                style={{
                  animation: animate ? `slideIn 0.5s ease-out ${idx * 0.1}s forwards` : "none",
                  opacity: 0,
                  transform: "translateX(-20px)",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[#cee5ff] font-medium text-sm">{review.product}</p>
                  <span className="text-yellow-400 text-sm tracking-widest">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-[#a3cbf2]/60 text-xs">{review.user}</p>
                <p className="text-[#a3cbf2]/50 text-xs mt-1 line-clamp-1">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add animation keyframes */}
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