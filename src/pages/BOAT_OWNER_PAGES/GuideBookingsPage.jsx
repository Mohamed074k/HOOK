import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Users, MessageSquare, Calendar, ArrowUpRight } from "lucide-react";

const BOOKINGS = [
  {
    id: "BK-001",
    trip: "Deep Sea Adventure",
    date: "Apr 2, 2025",
    seats: 4,
    amount: "$1,800",
    status: "Confirmed",
    passenger: { name: "Ahmed Hassan", email: "ahmed.h@example.com", phone: "+20 100 555 0101" },
    notes: "Two of our group are first-timers. Any beginner tips would be extremely helpful! We're super excited.",
    bookedAt: "Mar 20, 2025",
  },
  {
    id: "BK-002",
    trip: "Coastal Fly Fishing",
    date: "Apr 5, 2025",
    seats: 2,
    amount: "$440",
    status: "Confirmed",
    passenger: { name: "Yasmine Mahmoud", email: "yasmine.m@example.com", phone: "+20 100 555 0202" },
    notes: "",
    bookedAt: "Mar 22, 2025",
  },
  {
    id: "BK-003",
    trip: "Sunset Charter",
    date: "Apr 8, 2025",
    seats: 6,
    amount: "$1,080",
    status: "Pending",
    passenger: { name: "Mahmoud Tariq", email: "mahmoud.t@example.com", phone: "+20 100 555 0303" },
    notes: "It's my wife's birthday — any chance of a small surprise? Also, one guest has a shellfish allergy.",
    bookedAt: "Mar 25, 2025",
  },
  {
    id: "BK-004",
    trip: "Deep Sea Adventure",
    date: "Apr 12, 2025",
    seats: 3,
    amount: "$1,350",
    status: "Confirmed",
    passenger: { name: "Fatima Ali", email: "fatima.a@example.com", phone: "+20 100 555 0404" },
    notes: "",
    bookedAt: "Mar 28, 2025",
  },
  {
    id: "BK-005",
    trip: "Sunset Charter",
    date: "Mar 20, 2025",
    seats: 4,
    amount: "$720",
    status: "Completed",
    passenger: { name: "Omar Farouk", email: "omar.f@example.com", phone: "+20 100 555 0505" },
    notes: "Looking forward to a repeat trip!",
    bookedAt: "Mar 5, 2025",
  },
];

const statusStyles = {
  Confirmed: "bg-sky-400/10 text-sky-400",
  Pending: "bg-yellow-400/10 text-yellow-400",
  Completed: "bg-teal-400/10 text-teal-400",
  Cancelled: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
};

const ALL_TRIPS = ["All Trips", ...new Set(BOOKINGS.map(b => b.trip))];
const ALL_STATUSES = ["All Statuses", "Confirmed", "Pending", "Completed"];

const GuideBookingsPage = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [tripFilter, setTripFilter] = useState("All Trips");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [animate, setAnimate] = useState(false);
  
  // Tracks which custom dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState(null); // 'trip' | 'status' | null

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const filtered = BOOKINGS.filter(b =>
    (tripFilter === "All Trips" || b.trip === tripFilter) &&
    (statusFilter === "All Statuses" || b.status === statusFilter)
  );

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="space-y-6 pb-12">
      {/* Header - ADDED 'relative z-50' HERE TO FIX THE STACKING CONTEXT */}
      <div className={`relative z-50 transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Incoming Bookings</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">{filtered.length} reservations found</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            
            {/* Animated Trip Filter */}
            <div className={`relative group ${openDropdown === 'trip' ? 'z-50' : 'z-10'}`}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'trip' ? null : 'trip')}
                onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                className="bg-[#002238] border border-white/5 hover:border-sky-400/30 rounded-xl pl-4 pr-10 py-2.5 text-[#a3cbf2]/70 hover:text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 w-44 text-left relative z-10 shadow-sm hover:shadow-sky-400/5"
              >
                <span className="block truncate">{tripFilter}</span>
                <ChevronDown 
                  size={14} 
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/30 group-hover:text-sky-400 transition-all duration-300 pointer-events-none ${
                    openDropdown === 'trip' ? 'rotate-180 text-sky-400' : ''
                  }`} 
                />
              </button>

              {/* Custom Animated Menu */}
              <div 
                className={`absolute top-full left-0 mt-2 w-full bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${
                  openDropdown === 'trip' 
                    ? 'opacity-100 scale-y-100 translate-y-0 visible' 
                    : 'opacity-0 scale-y-95 -translate-y-2 invisible'
                }`}
              >
                <div className="max-h-60 overflow-y-auto py-1">
                  {ALL_TRIPS.map(t => (
                    <button
                      key={t}
                      onClick={() => { setTripFilter(t); setOpenDropdown(null); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                        tripFilter === t 
                          ? 'bg-sky-500/20 text-sky-400 font-medium' 
                          : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Animated Status Filter */}
            <div className={`relative group ${openDropdown === 'status' ? 'z-50' : 'z-10'}`}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                className="bg-[#002238] border border-white/5 hover:border-sky-400/30 rounded-xl pl-4 pr-10 py-2.5 text-[#a3cbf2]/70 hover:text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 w-36 text-left relative z-10 shadow-sm hover:shadow-sky-400/5"
              >
                <span className="block truncate">{statusFilter}</span>
                <ChevronDown 
                  size={14} 
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/30 group-hover:text-sky-400 transition-all duration-300 pointer-events-none ${
                    openDropdown === 'status' ? 'rotate-180 text-sky-400' : ''
                  }`} 
                />
              </button>

              {/* Custom Animated Menu */}
              <div 
                className={`absolute top-full left-0 mt-2 w-full bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${
                  openDropdown === 'status' 
                    ? 'opacity-100 scale-y-100 translate-y-0 visible' 
                    : 'opacity-0 scale-y-95 -translate-y-2 invisible'
                }`}
              >
                <div className="py-1">
                  {ALL_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setOpenDropdown(null); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                        statusFilter === s 
                          ? 'bg-sky-500/20 text-sky-400 font-medium' 
                          : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Summary Strip - Rendered below header, will no longer overlap menus */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Reservations", value: BOOKINGS.length, color: "text-sky-400", hoverBorder: "hover:border-sky-400/30", hoverShadow: "hover:shadow-sky-400/10" },
          { label: "Confirmed", value: BOOKINGS.filter(b => b.status === "Confirmed").length, color: "text-sky-400", hoverBorder: "hover:border-sky-400/30", hoverShadow: "hover:shadow-sky-400/10" },
          { label: "Pending Review", value: BOOKINGS.filter(b => b.status === "Pending").length, color: "text-yellow-400", hoverBorder: "hover:border-yellow-400/30", hoverShadow: "hover:shadow-yellow-400/10" },
          { label: "Total Seats", value: BOOKINGS.reduce((s, b) => s + b.seats, 0), color: "text-teal-400", hoverBorder: "hover:border-teal-400/30", hoverShadow: "hover:shadow-teal-400/10" },
        ].map(({ label, value, color, hoverBorder, hoverShadow }, idx) => (
          <div 
            key={label} 
            className={`bg-[#002238] border border-white/5 rounded-xl p-4 transform transition-all duration-500 ease-out cursor-default group hover:-translate-y-1 hover:shadow-lg ${hoverBorder} ${hoverShadow}`}
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${idx * 100}ms`,
            }}
          >
            <p className="text-[#a3cbf2]/40 text-xs mb-1 group-hover:text-[#a3cbf2]/60 transition-colors duration-300">{label}</p>
            <p className={`text-2xl font-black ${color} group-hover:scale-105 origin-left transition-transform duration-300`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="relative z-10 space-y-3">
        {filtered.length === 0 && (
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-12 text-center transform transition-all duration-700 ease-out">
            <p className="text-[#a3cbf2]/30 text-sm">No bookings match the selected filters.</p>
          </div>
        )}

        {filtered.map((b, idx) => {
          const isExpanded = expandedId === b.id;
          return (
            <div
              key={b.id}
              className={`bg-[#002238] border rounded-2xl overflow-hidden transform transition-all duration-500 ease-out ${
                isExpanded ? "border-sky-400/30 shadow-lg shadow-sky-400/5" : "border-white/5 hover:border-white/10"
              }`}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${(idx + 2) * 100}ms`,
              }}
            >
              {/* Main row */}
              <button
                className={`w-full text-left px-5 py-4 flex items-center justify-between gap-4 transition-colors duration-300 ${
                  isExpanded ? "bg-sky-400/5" : "hover:bg-white/[0.02]"
                }`}
                onClick={() => toggle(b.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 transition-colors duration-300 ${
                    isExpanded ? "bg-sky-500/20 text-sky-400" : "bg-sky-500/10 text-sky-400/70"
                  }`}>
                    {b.passenger.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[#cee5ff] font-semibold text-sm">{b.passenger.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusStyles[b.status] ?? ""}`}>
                        {b.status}
                      </span>
                      {b.notes && (
                        <span className="flex items-center gap-1 text-yellow-400/60 text-xs">
                          <MessageSquare size={11} /> Note
                        </span>
                      )}
                    </div>
                    <p className="text-[#a3cbf2]/40 text-xs mt-0.5 truncate">
                      {b.trip} · <span className="inline-flex items-center gap-1"><Calendar size={10} /> {b.date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sky-400 font-bold text-sm">{b.amount}</p>
                    <p className="text-[#a3cbf2]/40 text-xs flex items-center gap-1 justify-end">
                      <Users size={10} /> {b.seats} seats
                    </p>
                  </div>
                  <ChevronDown 
                    size={18} 
                    className={`shrink-0 transition-all duration-300 ${
                      isExpanded ? "rotate-180 text-sky-400" : "text-[#a3cbf2]/30"
                    }`} 
                  />
                </div>
              </button>

              {/* Expanded Passenger Manifest - Smooth Accordion */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-2 space-y-4">
                    <div className="h-px bg-white/5" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Passenger Details */}
                      <div className="bg-[#001526]/60 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <p className="text-[#a3cbf2]/40 text-xs font-medium uppercase tracking-wider mb-3">Passenger Details</p>
                        <div className="space-y-2.5">
                          {[
                            { label: "Name", value: b.passenger.name },
                            { label: "Email", value: b.passenger.email },
                            { label: "Phone", value: b.passenger.phone },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between items-center text-sm">
                              <span className="text-[#a3cbf2]/40">{label}</span>
                              <span className="text-[#cee5ff] font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="bg-[#001526]/60 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <p className="text-[#a3cbf2]/40 text-xs font-medium uppercase tracking-wider mb-3">Booking Details</p>
                        <div className="space-y-2.5">
                          {[
                            { label: "Booking ID", value: b.id },
                            { label: "Seats Reserved", value: `${b.seats} persons` },
                            { label: "Total Amount", value: b.amount },
                            { label: "Booked On", value: b.bookedAt },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between items-center text-sm">
                              <span className="text-[#a3cbf2]/40">{label}</span>
                              <span className="text-[#cee5ff] font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {b.notes && (
                      <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-xl p-4">
                        <p className="text-yellow-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <MessageSquare size={12} /> Special Notes from Passenger
                        </p>
                        <p className="text-[#cee5ff]/80 text-sm leading-relaxed">"{b.notes}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuideBookingsPage;