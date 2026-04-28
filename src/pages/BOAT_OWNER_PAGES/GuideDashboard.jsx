import { Calendar, MapPin, Star, TrendingUp, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const cards = [
  {
    label: "Upcoming Bookings",
    value: "8",
    icon: Calendar,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    ring: "hover:ring-sky-400/20",
    glow: "hover:shadow-sky-400/5",
    trend: "+2 this week",
  },
  {
    label: "Active Trips",
    value: "3",
    icon: MapPin,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    ring: "hover:ring-teal-400/20",
    glow: "hover:shadow-teal-400/5",
    trend: "1 starting today",
  },
  {
    label: "Avg. Rating",
    value: "4.9",
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    ring: "hover:ring-yellow-400/20",
    glow: "hover:shadow-yellow-400/5",
    trend: "48 reviews total",
  },
  {
    label: "Earnings (MTD)",
    value: "$6,240",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    ring: "hover:ring-emerald-400/20",
    glow: "hover:shadow-emerald-400/5",
    trend: "+18% vs last month",
  },
];

const bookings = [
  { client: "John Doe", trip: "Deep Sea Adventure", date: "Apr 2, 2025", participants: 4, status: "Confirmed" },
  { client: "Sara Kim", trip: "Coastal Fly Fishing", date: "Apr 5, 2025", participants: 2, status: "Confirmed" },
  { client: "Carlos R.", trip: "Sunset Charter", date: "Apr 8, 2025", participants: 6, status: "Pending" },
];

const statusStyles = {
  Confirmed: "bg-sky-400/10 text-sky-400",
  Pending: "bg-yellow-400/10 text-yellow-400",
  Completed: "bg-emerald-400/10 text-emerald-400",
};

const GuideDashboard = () => {
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
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Guide Dashboard</h1>
            <p className="text-[#a3cbf2]/50 mt-1 text-sm sm:text-base">
              Welcome back, Captain. Here's your day at a glance.
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards - Two per row on mobile, four on desktop */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg, ring, glow, trend }, idx) => (
          <div
            key={label}
            className={`group bg-[#002238] border border-white/5 rounded-2xl p-4 sm:p-6 cursor-default transition-all duration-300
              hover:border-white/10 hover:-translate-y-1 hover:shadow-xl ${glow} ring-1 ring-transparent ${ring}
              transform transition-all duration-700 ease-out`}
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(30px)",
              transitionDelay: `${idx * 100}ms`,
            }}
          >
            {/* Icon row */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className={color} size={21} />
              </div>
              <ArrowUpRight
                size={16}
                className="text-[#a3cbf2]/20 group-hover:text-[#a3cbf2]/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
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

      {/* Upcoming Bookings */}
      <div
        className={`bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 delay-300 ease-out ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-bold text-[#cee5ff]">Upcoming Bookings</h2>
          <button 
            onClick={() => window.location.href = '/boat-owner/bookings'}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium flex items-center gap-1"
          >
            View all <ArrowUpRight size={12} />
          </button>
        </div>

        {/* Desktop list */}
        <div className="hidden sm:block divide-y divide-white/5">
          {bookings.map((b, idx) => (
            <div
              key={b.client}
              className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors duration-200 group"
              style={{
                animation: animate ? `slideIn 0.5s ease-out ${idx * 0.1}s forwards` : "none",
                opacity: 0,
                transform: "translateX(-20px)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 text-xs font-bold shrink-0">
                  {b.client[0]}
                </div>
                <div>
                  <p className="text-[#cee5ff] font-medium text-sm">{b.trip}</p>
                  <p className="text-[#a3cbf2]/40 text-xs mt-0.5">
                    {b.client} · {b.participants} participants
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[b.status] ?? ""}`}>
                  {b.status}
                </span>
                <span className="text-sky-400 text-sm font-semibold">{b.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile card stack */}
        <div className="sm:hidden divide-y divide-white/5">
          {bookings.map((b, idx) => (
            <div 
              key={b.client} 
              className="p-4 hover:bg-white/[0.03] transition-colors"
              style={{
                animation: animate ? `slideIn 0.5s ease-out ${idx * 0.1}s forwards` : "none",
                opacity: 0,
                transform: "translateX(-20px)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-[#cee5ff] font-semibold text-sm">{b.trip}</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[b.status] ?? ""}`}>
                  {b.status}
                </span>
              </div>
              <p className="text-[#a3cbf2]/50 text-xs">{b.client} · {b.participants} participants</p>
              <p className="text-sky-400 text-xs font-semibold mt-1.5">{b.date}</p>
            </div>
          ))}
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

export default GuideDashboard;