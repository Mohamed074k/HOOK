// import { User, MapPin, Mail, Phone, LogOut, LogIn } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// import toast from "react-hot-toast";

// const ProfilePage = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully. See you soon!");
//     navigate("/login", { replace: true });
//   };

//   // Derive initials from name
//   const initials = user?.name
//     ? user.name
//         .split(" ")
//         .slice(0, 2)
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//     : "?";

//   // Guest state
//   if (!user) {
//     return (
//       <div className="px-6 md:px-12 py-24 max-w-screen-lg mx-auto flex flex-col items-center justify-center gap-6 text-center">
//         <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center">
//           <User className="text-sky-400" size={36} />
//         </div>
//         <h1 className="text-3xl font-black text-[#cee5ff]">You're not signed in</h1>
//         <p className="text-[#a3cbf2]/60 max-w-sm">
//           Sign in to view your profile, track your trips, and connect with the community.
//         </p>
//         <Link
//           to="/login"
//           className="flex items-center gap-2 bg-sky-400 text-[#003353] px-8 py-3 rounded-xl font-bold text-sm hover:bg-sky-300 transition-colors"
//         >
//           <LogIn size={16} />
//           Sign In
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="px-6 md:px-12 py-12 max-w-screen-lg mx-auto">
//       {/* Profile Card */}
//       <div className="bg-[#002238] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start mb-8">
//         {/* Avatar */}
//         <div className="w-24 h-24 rounded-2xl bg-sky-500/20 border border-sky-400/20 flex items-center justify-center text-sky-300 text-4xl font-black shrink-0">
//           {initials}
//         </div>

//         {/* Info */}
//         <div className="flex-1">
//           <h1 className="text-3xl font-black text-[#cee5ff]">{user.name ?? "User"}</h1>
//           <p className="text-[#a3cbf2]/60 mt-1 capitalize">
//             {user.role ?? "Member"} · Member since {new Date().getFullYear()}
//           </p>
//           <div className="flex flex-wrap gap-4 mt-4 text-sm text-[#a3cbf2]/60">
//             {user.email && (
//               <span className="flex items-center gap-1">
//                 <Mail size={14} />
//                 {user.email}
//               </span>
//             )}
//             {user.phone && (
//               <span className="flex items-center gap-1">
//                 <Phone size={14} />
//                 {user.phone}
//               </span>
//             )}
//             {user.location && (
//               <span className="flex items-center gap-1">
//                 <MapPin size={14} />
//                 {user.location}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-col gap-3 shrink-0">
//           <button className="border border-sky-400/30 text-sky-400 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-sky-400/10 transition-colors">
//             Edit Profile
//           </button>
//           <button
//             onClick={handleLogout}
//             className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-400/20 px-5 py-2 rounded-xl font-semibold text-sm hover:bg-red-500/20 hover:text-red-300 transition-all"
//           >
//             <LogOut size={15} />
//             Sign Out
//           </button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {[
//           { label: "Trips Booked",    value: "14" },
//           { label: "Catches Logged",  value: "87" },
//           { label: "Community Posts", value: "32" },
//         ].map(({ label, value }) => (
//           <div key={label} className="bg-[#002238] border border-white/5 rounded-2xl p-6 text-center">
//             <p className="text-4xl font-black text-[#cee5ff]">{value}</p>
//             <p className="text-[#a3cbf2]/60 text-sm mt-1">{label}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Mail, Pencil, Calendar, Ship, Star, X, ChevronRight,
  Package, RotateCcw, Compass, Camera, Check, ShoppingBag, Anchor,
} from "lucide-react";
import gsap from "gsap";

// ─── Mock data ────────────────────────────────────────────────────────────────
const PROFILE = {
  fullName: "Lina Marwan",
  email: "lina.marwan@horizon.sea",
  location: "Alexandria, Egypt",
  joinedAt: "March 2024",
};

const UPCOMING_TRIPS = [
  { id: "t1", name: "Sunset Catamaran Cruise", date: "May 14, 2026", location: "Cabo San Lucas", status: "Confirmed" },
  { id: "t2", name: "Coral Reef Snorkel Day", date: "May 22, 2026", location: "Islamorada", status: "Pending" },
  { id: "t3", name: "Fjord Discovery Voyage", date: "Jun 03, 2026", location: "Bergen", status: "Confirmed" },
];

const PAST_TRIPS = [
  { id: "p1", name: "Whale Watching Expedition", date: "Feb 11, 2026", location: "Juneau", myRating: 5 },
  { id: "p2", name: "Aegean Island Hop", date: "Jan 19, 2026", location: "Bodrum" },
  { id: "p3", name: "Pearl Harbor Sail", date: "Dec 02, 2025", location: "Honolulu", myRating: 4 },
];

const ORDERS = [
  { id: "ORD-48201", items: "Apex Carbon Reel", total: 849, status: "Delivered", date: "Apr 02, 2026", myRating: 5 },
  { id: "ORD-48177", items: "HydroScan V3 + Tackle Box", total: 1619, status: "Pending", date: "Apr 18, 2026" },
  { id: "ORD-47990", items: "Nautical One Pro", total: 550, status: "Cancelled", date: "Mar 21, 2026" },
];

// ─── Animated background (matches other pages) ────────────────────────────────
const AnimatedBackground = () => {
  const bgRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".orb-1", { x: 40, y: -30, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-2", { x: -50, y: 20, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-3", { scale: 1.1, opacity: 0.6, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, bgRef);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={bgRef} className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="orb-1 absolute top-20 left-[10%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }} />
      <div className="orb-2 absolute bottom-20 right-[5%] w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }} />
      <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(83,214,251,0.04) 0%, transparent 60%)" }} />
    </div>
  );
};

// ─── Star rating ──────────────────────────────────────────────────────────────
const StarRating = ({ value, onChange, readOnly, size = 16 }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(n)}
            className={`transition-transform ${readOnly ? "cursor-default" : "hover:scale-110 active:scale-95 cursor-pointer"}`}
          >
            <Star
              size={size}
              className={filled ? "text-amber-300" : "text-white/15"}
              fill={filled ? "currentColor" : "none"}
            />
          </button>
        );
      })}
    </div>
  );
};

// ─── Status pill ──────────────────────────────────────────────────────────────
const statusStyles = {
  Confirmed: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  Pending: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  Completed: "bg-sky-400/10 text-sky-300 border-sky-400/20",
  Cancelled: "bg-rose-400/10 text-rose-300 border-rose-400/20",
  Delivered: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
};

const StatusPill = ({ status }) => (
  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[status]}`}>
    {status}
  </span>
);

// ─── Profile Header ───────────────────────────────────────────────────────────
const ProfileHeader = ({ profile, onEdit }) => {
  const headerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ph-avatar", { opacity: 0, scale: 0.85, duration: 0.7, ease: "back.out(0.5)" });
      gsap.from(".ph-line", { opacity: 0, y: 18, duration: 0.6, stagger: 0.08, delay: 0.15, ease: "power2.out" });
      gsap.from(".ph-action", { opacity: 0, y: 12, duration: 0.5, delay: 0.45, ease: "back.out(0.4)" });
      gsap.to(glowRef.current, { opacity: 0.6, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  const initials = profile.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div ref={headerRef} className="relative">
      <div ref={glowRef} className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-sky-500/20 via-cyan-500/10 to-sky-500/20 opacity-30 blur-2xl pointer-events-none" />
      <div className="relative bg-[#002238] border border-white/5 rounded-3xl p-6 md:p-8 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.12) 0%, transparent 70%)" }} />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="ph-avatar relative shrink-0 mx-auto md:mx-0">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-sky-400/30 to-cyan-500/20 border border-white/10 flex items-center justify-center text-3xl font-black text-[#cee5ff] shadow-lg shadow-sky-500/10">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                initials
              )}
            </div>
            <button
              aria-label="Change photo"
              className="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-full bg-sky-400 text-[#001526] flex items-center justify-center shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-transform"
            >
              <Camera size={15} />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="ph-line inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-3 py-1 mb-3 border border-sky-400/20">
              <Anchor size={12} className="text-sky-400" />
              <span className="text-[10px] text-sky-300 font-medium tracking-widest uppercase">Member since {profile.joinedAt}</span>
            </div>
            <h1 className="ph-line text-3xl md:text-4xl font-black bg-gradient-to-r from-[#cee5ff] via-sky-200 to-[#53D6FB] bg-clip-text text-transparent">
              {profile.fullName}
            </h1>
            <div className="ph-line mt-3 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-[#a3cbf2]/70">
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-sky-400/80" />{profile.email}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-sky-400/80" />{profile.location}</span>
            </div>
          </div>

          {/* Action */}
          <motion.button
            onClick={onEdit}
            className="ph-action shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-400/10 border border-sky-400/30 text-sky-300 font-semibold text-sm hover:bg-sky-400/20 transition-colors relative overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 35%, rgba(83,214,251,0.18) 50%, transparent 65%)" }} />
            <Pencil size={15} />
            Edit Profile
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// ─── Section heading ──────────────────────────────────────────────────────────
const SectionTitle = ({ icon, title, sub, right }) => (
  <div className="flex items-end justify-between gap-4 mb-5">
    <div>
      <div className="flex items-center gap-2 text-sky-400">
        {icon}
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{sub}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-[#cee5ff] mt-1">{title}</h2>
    </div>
    {right}
  </div>
);

// ─── Trip rows ────────────────────────────────────────────────────────────────
const UpcomingTripRow = ({ trip, onCancel, onOpen }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ y: -2 }}
      onClick={() => onOpen(trip.id)}
      className="group bg-[#002238] border border-white/5 rounded-2xl p-4 md:p-5 hover:border-sky-400/30 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center shrink-0">
          <Ship size={20} className="text-sky-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-[#cee5ff] group-hover:text-white transition-colors truncate">{trip.name}</h3>
            <StatusPill status={trip.status} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#a3cbf2]/60 mt-1.5">
            <span className="flex items-center gap-1"><Calendar size={12} />{trip.date}</span>
            <span className="flex items-center gap-1"><MapPin size={12} />{trip.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {trip.status !== "Cancelled" && (
            <button
              onClick={() => onCancel(trip.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-400/10 text-rose-300 border border-rose-400/20 hover:bg-rose-400/20 transition-colors"
            >
              Cancel
            </button>
          )}
          <ChevronRight size={16} className="text-[#a3cbf2]/40 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </motion.div>
  );
};

const PastTripRow = ({ trip, onRate, onOpen }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    onClick={() => onOpen(trip.id)}
    className="group bg-[#002238] border border-white/5 rounded-2xl p-4 md:p-5 hover:border-sky-400/30 transition-colors cursor-pointer"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0">
        <Compass size={20} className="text-[#a3cbf2]/60" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[#cee5ff] truncate">{trip.name}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#a3cbf2]/60 mt-1.5">
          <span className="flex items-center gap-1"><Calendar size={12} />{trip.date}</span>
          <span className="flex items-center gap-1"><MapPin size={12} />{trip.location}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="text-[10px] uppercase tracking-wider text-[#a3cbf2]/40">
          {trip.myRating ? "Your rating" : "Rate this trip"}
        </span>
        <StarRating
          value={trip.myRating ?? 0}
          onChange={(n) => onRate(trip.id, n)}
        />
      </div>
    </div>
  </motion.div>
);

// ─── Trips Section ────────────────────────────────────────────────────────────
const UserTrips = () => {
  const [tab, setTab] = useState("upcoming");
  const [upcoming, setUpcoming] = useState(UPCOMING_TRIPS);
  const [past, setPast] = useState(PAST_TRIPS);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power2.out" }
    );
  }, [tab]);

  const handleCancel = useCallback((id) => {
    setUpcoming((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Cancelled" } : t)));
    setConfirmCancel(null);
  }, []);

  const handleRate = useCallback((id, rating) => {
    setPast((prev) => prev.map((t) => (t.id === id ? { ...t, myRating: rating } : t)));
  }, []);

  const handleOpenTrip = useCallback((id) => {
    // navigate to /trip/:id in a real app
    console.log("open trip", id);
  }, []);

  const EmptyState = ({ icon, title, sub }) => (
    <div className="bg-[#002238] border border-dashed border-white/10 rounded-2xl py-12 text-center">
      <div className="text-white/15 mb-3 flex justify-center">{icon}</div>
      <p className="text-[#a3cbf2]/70 font-semibold">{title}</p>
      <p className="text-[#a3cbf2]/40 text-sm mt-1">{sub}</p>
    </div>
  );

  return (
    <section>
      <SectionTitle
        icon={<Ship size={14} />}
        sub="Voyages"
        title="Your Trips"
        right={
          <div className="inline-flex items-center bg-[#002238] border border-white/5 rounded-xl p-1">
            {["upcoming", "past"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  tab === t ? "text-[#001526]" : "text-[#a3cbf2]/60 hover:text-[#cee5ff]"
                }`}
              >
                {tab === t && (
                  <motion.span
                    layoutId="trip-tab"
                    className="absolute inset-0 bg-sky-400 rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        }
      />

      <div ref={listRef} className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tab === "upcoming" ? (
            upcoming.length === 0 ? (
              <EmptyState icon={<Ship size={36} />} title="No upcoming trips" sub="Browse the marketplace to find your next voyage." />
            ) : (
              upcoming.map((t) => (
                <UpcomingTripRow
                  key={t.id}
                  trip={t}
                  onCancel={(id) => setConfirmCancel(id)}
                  onOpen={handleOpenTrip}
                />
              ))
            )
          ) : past.length === 0 ? (
            <EmptyState icon={<Compass size={36} />} title="No past trips yet" sub="Your travel history will live here." />
          ) : (
            past.map((t) => <PastTripRow key={t.id} trip={t} onRate={handleRate} onOpen={handleOpenTrip} />)
          )}
        </AnimatePresence>
      </div>

      {/* Cancel confirmation */}
      <ConfirmModal
        open={!!confirmCancel}
        title="Cancel this trip?"
        body="You may forfeit part of your booking deposit depending on the cancellation window."
        confirmLabel="Yes, cancel"
        tone="danger"
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => confirmCancel && handleCancel(confirmCancel)}
      />
    </section>
  );
};

// ─── Orders Section ───────────────────────────────────────────────────────────
const OrderCard = ({ order, onRate, onRefund, onOpen }) => {
  const refundable = order.status !== "Cancelled";
  const ratable = order.status === "Delivered";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onOpen(order.id)}
      className="group bg-[#002238] border border-white/5 rounded-2xl p-5 hover:border-sky-400/30 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Package size={14} className="text-sky-400" />
            <span className="font-mono text-xs text-[#a3cbf2]/60">{order.id}</span>
          </div>
          <h3 className="font-bold text-[#cee5ff] truncate">{order.items}</h3>
          <p className="text-xs text-[#a3cbf2]/50 mt-0.5">{order.date}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="flex items-end justify-between gap-3 pt-3 border-t border-white/5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#a3cbf2]/40">Total</p>
          <p className="text-2xl font-black text-[#cee5ff] tabular-nums">${order.total.toLocaleString()}</p>
        </div>

        <div className="flex flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>
          {ratable && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-[#a3cbf2]/40">
                {order.myRating ? "Rated" : "Rate"}
              </span>
              <StarRating value={order.myRating ?? 0} onChange={(n) => onRate(order.id, n)} size={14} />
            </div>
          )}
          {refundable && (
            <button
              onClick={() => onRefund(order.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 hover:bg-amber-400/20 transition-colors"
            >
              <RotateCcw size={12} />
              Refund
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState(ORDERS);
  const [confirmRefund, setConfirmRefund] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 14, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.07, ease: "back.out(0.3)" }
    );
  }, []);

  const handleRate = useCallback((id, n) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, myRating: n } : o)));
  }, []);

  const handleRefund = useCallback((id) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o)));
    setConfirmRefund(null);
  }, []);

  const EmptyState = ({ icon, title, sub }) => (
    <div className="col-span-full bg-[#002238] border border-dashed border-white/10 rounded-2xl py-12 text-center">
      <div className="text-white/15 mb-3 flex justify-center">{icon}</div>
      <p className="text-[#a3cbf2]/70 font-semibold">{title}</p>
      <p className="text-[#a3cbf2]/40 text-sm mt-1">{sub}</p>
    </div>
  );

  return (
    <section>
      <SectionTitle icon={<ShoppingBag size={14} />} sub="Gear Locker" title="Your Orders" />
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.length === 0 ? (
          <EmptyState icon={<Package size={36} />} title="No orders yet" sub="When you buy gear it shows up here." />
        ) : (
          orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onRate={handleRate}
              onRefund={(id) => setConfirmRefund(id)}
              onOpen={(id) => console.log("open order", id)}
            />
          ))
        )}
      </div>

      <ConfirmModal
        open={!!confirmRefund}
        title="Request a refund?"
        body="A refund request will be sent to the seller. You'll be notified once it's processed."
        confirmLabel="Request refund"
        tone="warning"
        onClose={() => setConfirmRefund(null)}
        onConfirm={() => confirmRefund && handleRefund(confirmRefund)}
      />
    </section>
  );
};

// ─── Confirm Modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ open, title, body, confirmLabel, tone, onClose, onConfirm }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              tone === "danger" ? "bg-rose-400/10 text-rose-300" : "bg-amber-400/10 text-amber-300"
            }`}>
              <RotateCcw size={18} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#cee5ff]">{title}</h3>
              <p className="text-sm text-[#a3cbf2]/60 mt-1">{body}</p>
            </div>
            <button onClick={onClose} className="text-[#a3cbf2]/40 hover:text-[#cee5ff] transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.04] border border-white/5 text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
            >
              Keep
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                tone === "danger"
                  ? "bg-rose-400/15 border-rose-400/30 text-rose-200 hover:bg-rose-400/25"
                  : "bg-amber-400/15 border-amber-400/30 text-amber-200 hover:bg-amber-400/25"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
const EditProfileModal = ({ open, profile, onClose, onSave }) => {
  const [draft, setDraft] = useState(profile);
  useEffect(() => setDraft(profile), [profile, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-[#cee5ff]">Edit Profile</h3>
              <button onClick={onClose} className="text-[#a3cbf2]/40 hover:text-[#cee5ff] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { key: "fullName", label: "Full Name", icon: <Pencil size={14} /> },
                { key: "email", label: "Email", icon: <Mail size={14} /> },
                { key: "location", label: "Location", icon: <MapPin size={14} /> },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3cbf2]/50 flex items-center gap-1.5 mb-1.5">
                    {f.icon}{f.label}
                  </label>
                  <input
                    value={draft[f.key]}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.04] border border-white/5 text-[#a3cbf2] hover:bg-white/[0.08] transition-colors">
                Cancel
              </button>
              <button
                onClick={() => onSave(draft)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-sky-400 text-[#001526] hover:bg-sky-300 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Check size={15} />
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const [profile, setProfile] = useState(PROFILE);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#001526] text-[#cee5ff]">
      <div className="space-y-10 pb-16 max-w-7xl mx-auto relative pt-8 px-4 md:px-8">
        <AnimatedBackground />

        <ProfileHeader profile={profile} onEdit={() => setEditOpen(true)} />
        <UserTrips />
        <UserOrders />

        <EditProfileModal
          open={editOpen}
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSave={(p) => { setProfile(p); setEditOpen(false); }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;