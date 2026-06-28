import { Calendar, MapPin, Star, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient"; 
import toast from "react-hot-toast";

// Locked Static Top Cards Blueprint - Will be updated with live data
const cardsTemplate = [
  {
    label: "Upcoming Bookings",
    icon: Calendar,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    ring: "hover:ring-sky-400/20",
    glow: "hover:shadow-sky-400/5",
    trend: "+2 this week",
  },
  {
    label: "Active Trips",
    icon: MapPin,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    ring: "hover:ring-teal-400/20",
    glow: "hover:shadow-teal-400/5",
    trend: "1 starting today",
  },
  {
    label: "Avg. Rating",
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    ring: "hover:ring-yellow-400/20",
    glow: "hover:shadow-yellow-400/5",
    trend: "48 reviews total",
  },
  {
    label: "Earnings (MTD)",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    ring: "hover:ring-emerald-400/20",
    glow: "hover:shadow-emerald-400/5",
    trend: "+18% vs last month",
  },
];

const statusStyles = {
  Confirmed: "bg-sky-400/10 text-sky-400",
  Pending: "bg-yellow-400/10 text-yellow-400",
  Completed: "bg-emerald-400/10 text-emerald-400",
};

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return isoString;
  }
};

const GuideDashboard = () => {
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);

  // Live Connected States
  const [bookings, setBookings] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  
  // Statistics State
  const [statistics, setStatistics] = useState({
    upcomingBookings: 0,
    activeTrips: 0,
    avgRating: 0,
    earnings: 0
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchGuideData();
  }, []);

  const fetchGuideData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, tripsRes, statsRes] = await Promise.all([
        apiClient.get("/api/boat-owner/dashboard/upcoming-bookings"),
        apiClient.get("/api/boat-owner/dashboard/active-trips"),
        apiClient.get("/api/boat-owner/dashboard/statistics"),
      ]);

      // Process Bookings
      if (bookingsRes.data && Array.isArray(bookingsRes.data)) {
        const parsedBookings = bookingsRes.data.map((item) => ({
          bookingId: item.bookingId,
          client: item.clientName || "Guest Client", 
          trip: item.tripTitle || "Charter Trip",
          date: formatDate(item.startDate),
          participants: item.numberOfParticipants || 1,
          status: item.status || "Pending",
        }));
        setBookings(parsedBookings);
      }

      // Process Active Trips
      if (tripsRes.data && Array.isArray(tripsRes.data)) {
        setActiveTrips(tripsRes.data);
      }

      // Process Statistics
      if (statsRes.data) {
        setStatistics({
          upcomingBookings: statsRes.data.upcomingBookings || 0,
          activeTrips: statsRes.data.activeTrips || 0,
          avgRating: statsRes.data.avgRating || 0,
          earnings: statsRes.data.earnings || 0
        });
      }

      setTimeout(() => setAnimate(true), 50);
    } catch (err) {
      console.error("Guide Dashboard Sync Error:", err);
      toast.error("Failed to load live dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Build cards with live data from statistics
  const cards = [
    {
      ...cardsTemplate[0],
      value: statistics.upcomingBookings.toString(),
      trend: `${statistics.upcomingBookings} upcoming bookings`,
    },
    {
      ...cardsTemplate[1],
      value: statistics.activeTrips.toString(),
      trend: `${statistics.activeTrips} active trips`,
    },
    {
      ...cardsTemplate[2],
      value: statistics.avgRating.toFixed(1),
      trend: `${statistics.avgRating > 0 ? '★'.repeat(Math.round(statistics.avgRating)) : 'No ratings yet'}`,
    },
    {
      ...cardsTemplate[3],
      value: `$${statistics.earnings.toLocaleString()}`,
      trend: `$${statistics.earnings.toLocaleString()} MTD earnings`,
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
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Guide Dashboard</h1>
            <p className="text-[#a3cbf2]/50 mt-1 text-sm sm:text-base">
              Welcome back, Captain. Here's your day at a glance.
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
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
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={color} size={21} />
              </div>
              <ArrowUpRight size={16} className="text-[#a3cbf2]/20 group-hover:text-[#a3cbf2]/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <p className="text-2xl sm:text-3xl font-black text-[#cee5ff] tracking-tight">
              {loading ? (
                <Loader2 size={24} className={`${color} animate-spin inline`} />
              ) : (
                value
              )}
            </p>
            <p className="text-[#a3cbf2]/50 text-xs sm:text-sm mt-0.5 sm:mt-1">{label}</p>

            <p className={`text-[10px] sm:text-xs mt-2 sm:mt-3 font-medium ${color} opacity-70`}>
              {loading ? "Loading..." : trend}
            </p>
          </div>
        ))}
      </div>

      {/* SECTION 1: Upcoming Bookings */}
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

        {/* Bookings Desktop */}
        <div className="hidden sm:block divide-y divide-white/5">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 size={24} className="text-sky-400 animate-spin" /></div>
          ) : bookings.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#a3cbf2]/30">No upcoming scheduled excursions found.</div>
          ) : (
            bookings.map((b, idx) => (
              <div
                key={b.bookingId || idx}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors duration-200 group"
                style={{
                  animation: animate ? `slideIn 0.5s ease-out ${idx * 0.1}s forwards` : "none",
                  opacity: 0,
                  transform: "translateX(-20px)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 text-xs font-bold shrink-0 uppercase">
                    {b.client ? b.client[0] : "C"}
                  </div>
                  <div>
                    <p className="text-[#cee5ff] font-medium text-sm">{b.trip}</p>
                    <p className="text-[#a3cbf2]/40 text-xs mt-0.5">
                      {b.client} · {b.participants} participants
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[b.status] ?? "bg-white/5 text-[#a3cbf2]/60"}`}>
                    {b.status}
                  </span>
                  <span className="text-sky-400 text-sm font-semibold">{b.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bookings Mobile */}
        <div className="sm:hidden divide-y divide-white/5">
          {loading ? (
            <div className="py-8 flex justify-center"><Loader2 size={20} className="text-sky-400 animate-spin" /></div>
          ) : bookings.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#a3cbf2]/30">No active bookings.</div>
          ) : (
            bookings.map((b, idx) => (
              <div 
                key={b.bookingId || idx} 
                className="p-4 hover:bg-white/[0.03] transition-colors"
                style={{
                  animation: animate ? `slideIn 0.5s ease-out ${idx * 0.1}s forwards` : "none",
                  opacity: 0,
                  transform: "translateX(-20px)",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[#cee5ff] font-semibold text-sm">{b.trip}</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[b.status] ?? "bg-white/5 text-[#a3cbf2]/60"}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-[#a3cbf2]/50 text-xs">{b.client} · {b.participants} participants</p>
                <p className="text-sky-400 text-xs font-semibold mt-1.5">{b.date}</p>
              </div>
            ))
          )}
        </div>
      </div>


      {/* SECTION 2: Active Trips Catalog */}
      <div
        className={`bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 delay-400 ease-out ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-bold text-[#cee5ff]">Active Trips</h2>
          <button 
            onClick={() => window.location.href = '/boat-owner/trips'}
            className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium flex items-center gap-1"
          >
            View all <ArrowUpRight size={12} />
          </button>
        </div>

        {/* Trips Desktop */}
        <div className="hidden sm:block divide-y divide-white/5">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 size={24} className="text-teal-400 animate-spin" /></div>
          ) : activeTrips.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#a3cbf2]/30">No published charter packages listed.</div>
          ) : (
            activeTrips.map((trip, idx) => (
              <div
                key={trip.tripId || idx}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors duration-200 group"
                style={{
                  animation: animate ? `slideIn 0.5s ease-out ${idx * 0.1}s forwards` : "none",
                  opacity: 0,
                  transform: "translateX(-20px)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[#cee5ff] font-medium text-sm">{trip.title || "Untitled Charter"}</p>
                    <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{trip.locationName || "Open Waters"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[#a3cbf2]/60 text-xs">
                    {trip.availableDatesCount || 0} {trip.availableDatesCount === 1 ? 'date' : 'dates'} available
                  </span>
                  <span className="text-teal-400 text-sm font-bold">
                    ${trip.pricePerPerson?.toLocaleString() || "0"} <span className="text-[10px] font-normal text-[#a3cbf2]/40">/person</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Trips Mobile */}
        <div className="sm:hidden divide-y divide-white/5">
          {loading ? (
            <div className="py-8 flex justify-center"><Loader2 size={20} className="text-teal-400 animate-spin" /></div>
          ) : activeTrips.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#a3cbf2]/30">No active trips.</div>
          ) : (
            activeTrips.map((trip, idx) => (
              <div 
                key={trip.tripId || idx} 
                className="p-4 hover:bg-white/[0.03] transition-colors"
                style={{
                  animation: animate ? `slideIn 0.5s ease-out ${idx * 0.1}s forwards` : "none",
                  opacity: 0,
                  transform: "translateX(-20px)",
                }}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <p className="text-[#cee5ff] font-semibold text-sm">{trip.title || "Charter Package"}</p>
                  <span className="text-teal-400 text-xs font-bold">
                    ${trip.pricePerPerson}<span className="text-[9px] font-normal text-[#a3cbf2]/40">/p</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#a3cbf2]/50">
                  <span className="truncate pr-2">{trip.locationName || "Open Waters"}</span>
                  <span className="shrink-0">{trip.availableDatesCount} dates open</span>
                </div>
              </div>
            ))
          )}
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

export default GuideDashboard;