// import { useState } from "react";
// import {
//   ChevronLeft, ChevronRight, Lock, Unlock, Users, X,
//   CalendarDays, List, LayoutGrid,
// } from "lucide-react";

// // Pre-populated mock availability data (dateKey → { booked, total, closed, trip })
// const buildAvailability = () => {
//   const data = {};
//   const seeds = [
//     ["2025-04-02", 4, 6, false, "Deep Sea Adventure"],
//     ["2025-04-05", 2, 4, false, "Coastal Fly Fishing"],
//     ["2025-04-08", 8, 8, false, "Sunset Charter"],
//     ["2025-04-10", 0, 6, false, "Deep Sea Adventure"],
//     ["2025-04-12", 0, 0, true,  "Deep Sea Adventure"],
//     ["2025-04-15", 6, 6, false, "Coastal Fly Fishing"],
//     ["2025-04-18", 3, 8, false, "Sunset Charter"],
//     ["2025-04-20", 1, 4, false, "Coastal Fly Fishing"],
//     ["2025-04-22", 4, 4, false, "Deep Sea Adventure"],
//     ["2025-04-25", 0, 6, false, "North Shore Expedition"],
//     ["2025-04-28", 2, 6, false, "Sunset Charter"],
//     ["2025-04-30", 5, 8, false, "Deep Sea Adventure"],
//   ];
//   seeds.forEach(([key, booked, total, closed, trip]) => {
//     data[key] = { booked, total, closed, trip };
//   });
//   return data;
// };

// const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
// const getFirstDay  = (y, m) => new Date(y, m, 1).getDay();
// const fmt = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
// const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// const getStatusLabel = (info) => {
//   if (!info)            return { label: "—",         cls: "text-[#a3cbf2]/20" };
//   if (info.closed)      return { label: "Closed",    cls: "text-[#a3cbf2]/40" };
//   if (info.booked >= info.total) return { label: "Full",      cls: "text-sky-400" };
//   if (info.booked > 0)  return { label: "Partial",   cls: "text-yellow-400" };
//   return                       { label: "Available", cls: "text-teal-400" };
// };

// const getCellStyle = (info) => {
//   if (!info)            return "text-[#a3cbf2]/20 hover:bg-white/5 cursor-pointer";
//   if (info.closed)      return "bg-[#a3cbf2]/5 text-[#a3cbf2]/20 cursor-pointer";
//   if (info.booked >= info.total) return "bg-sky-500/20 text-sky-300 cursor-pointer";
//   if (info.booked > 0)  return "bg-yellow-400/10 text-yellow-300 cursor-pointer";
//   return                       "bg-teal-400/10 text-teal-300 cursor-pointer";
// };

// /* ── Date Detail Panel (shared between views) ── */
// const DateDetailPanel = ({ selectedKey, selectedInfo, selected, month, year, setSelected, setAvailability }) => {
//   if (!selectedKey) return (
//     <div className="bg-[#002238] border border-white/5 rounded-2xl p-5 text-center">
//       <CalendarDays className="mx-auto mb-2 text-[#a3cbf2]/20" size={24} />
//       <p className="text-[#a3cbf2]/30 text-sm">Select a date to view or manage availability</p>
//     </div>
//   );

//   const toggleClose = () => {
//     setAvailability(prev => {
//       const existing = prev[selectedKey] || { booked: 0, total: 6, closed: false };
//       return { ...prev, [selectedKey]: { ...existing, closed: !existing.closed } };
//     });
//   };

//   return (
//     <div className="bg-[#002238] border border-sky-400/15 rounded-2xl p-5">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h3 className="text-[#cee5ff] font-bold">
//             {MONTHS[month]} {selected}, {year}
//           </h3>
//           {selectedInfo?.trip && (
//             <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{selectedInfo.trip}</p>
//           )}
//         </div>
//         <button onClick={() => setSelected(null)} className="text-[#a3cbf2]/30 hover:text-white transition-colors">
//           <X size={16} />
//         </button>
//       </div>

//       {selectedInfo ? (
//         <>
//           {selectedInfo.closed ? (
//             <div className="text-center py-6">
//               <Lock className="mx-auto mb-2 text-[#a3cbf2]/30" size={28} />
//               <p className="text-[#a3cbf2]/50 text-sm">This date is closed to bookings</p>
//             </div>
//           ) : (
//             <>
//               <p className="text-[#a3cbf2]/50 text-xs mb-2">Seats booked</p>
//               <div className="h-2.5 bg-[#001526] rounded-full overflow-hidden mb-1">
//                 <div
//                   className={`h-full rounded-full transition-all duration-500 ${
//                     selectedInfo.booked >= selectedInfo.total ? "bg-sky-400" : "bg-teal-400"
//                   }`}
//                   style={{ width: `${(selectedInfo.booked / selectedInfo.total) * 100}%` }}
//                 />
//               </div>
//               <div className="flex justify-between text-xs text-[#a3cbf2]/40 mb-5">
//                 <span className="flex items-center gap-1"><Users size={11} /> {selectedInfo.booked} booked</span>
//                 <span>{selectedInfo.total - selectedInfo.booked} remaining</span>
//               </div>
//               {selectedInfo.booked >= selectedInfo.total && (
//                 <div className="bg-sky-400/10 border border-sky-400/20 rounded-xl px-4 py-2.5 text-xs text-sky-400 font-medium mb-4 text-center">
//                   🎉 Fully Booked
//                 </div>
//               )}
//             </>
//           )}
//           <button
//             onClick={toggleClose}
//             className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
//               selectedInfo.closed
//                 ? "bg-teal-400/10 text-teal-400 border border-teal-400/20 hover:bg-teal-400/20"
//                 : "bg-[#a3cbf2]/5 text-[#a3cbf2]/60 border border-white/5 hover:bg-white/5 hover:text-white"
//             }`}
//           >
//             {selectedInfo.closed ? <><Unlock size={14} /> Open Date</> : <><Lock size={14} /> Close Date</>}
//           </button>
//         </>
//       ) : (
//         <>
//           <p className="text-[#a3cbf2]/50 text-sm mb-4">No trip scheduled for this date.</p>
//           <button
//             onClick={() =>
//               setAvailability(prev => ({
//                 ...prev,
//                 [selectedKey]: { booked: 0, total: 6, closed: false },
//               }))
//             }
//             className="w-full py-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20 hover:bg-sky-500/20 text-sm font-medium transition-all duration-200"
//           >
//             Open for Bookings
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// /* ── Main Component ── */
// const GuideSchedulePage = () => {
//   const [year, setYear]             = useState(2025);
//   const [month, setMonth]           = useState(3); // April
//   const [availability, setAvailability] = useState(buildAvailability());
//   const [selected, setSelected]     = useState(null);
//   const [viewMode, setViewMode]     = useState("calendar"); // "calendar" | "list"

//   const prevMonth = () => {
//     if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
//     setSelected(null);
//   };
//   const nextMonth = () => {
//     if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
//     setSelected(null);
//   };

//   const daysInMonth = getDaysInMonth(year, month);
//   const firstDay    = getFirstDay(year, month);
//   const cells = Array.from({ length: firstDay }, () => null).concat(
//     Array.from({ length: daysInMonth }, (_, i) => i + 1)
//   );

//   const selectedKey  = selected ? fmt(year, month, selected) : null;
//   const selectedInfo = selectedKey ? availability[selectedKey] : undefined;

//   // All dates for list view (sorted)
//   const allDates = Object.entries(availability).sort(([a], [b]) => a.localeCompare(b));

//   // This month's dates for list view
//   const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
//   const monthDates = allDates.filter(([k]) => k.startsWith(monthPrefix));

//   return (
//     <div className="space-y-6">
//       {/* ── Header ── */}
//       <div className="flex items-start justify-between flex-wrap gap-3">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Schedule & Availability</h1>
//           <p className="text-[#a3cbf2]/50 text-sm mt-1">Manage your trip calendar and booking slots</p>
//         </div>

//         <div className="flex items-center gap-3 flex-wrap">
//           {/* Legend */}
//           <div className="flex items-center gap-3 text-xs text-[#a3cbf2]/50">
//             <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-400/60" />Available</span>
//             <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400/60" />Partial</span>
//             <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400/60" />Full</span>
//             <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/10" />Closed</span>
//           </div>

//           {/* View toggle */}
//           <div className="flex bg-[#002238] border border-white/5 rounded-xl p-1 gap-1">
//             <button
//               onClick={() => setViewMode("calendar")}
//               title="Calendar view"
//               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
//                 viewMode === "calendar"
//                   ? "bg-sky-500/15 text-sky-400"
//                   : "text-[#a3cbf2]/40 hover:text-[#cee5ff]"
//               }`}
//             >
//               <CalendarDays size={14} /> Calendar
//             </button>
//             <button
//               onClick={() => setViewMode("list")}
//               title="List view"
//               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
//                 viewMode === "list"
//                   ? "bg-sky-500/15 text-sky-400"
//                   : "text-[#a3cbf2]/40 hover:text-[#cee5ff]"
//               }`}
//             >
//               <List size={14} /> List
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Month navigator (shared) ── */}
//       <div className="flex items-center justify-between bg-[#002238] border border-white/5 rounded-2xl px-5 py-3">
//         <button onClick={prevMonth} className="p-2 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all">
//           <ChevronLeft size={18} />
//         </button>
//         <h2 className="text-[#cee5ff] font-bold">{MONTHS[month]} {year}</h2>
//         <button onClick={nextMonth} className="p-2 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all">
//           <ChevronRight size={18} />
//         </button>
//       </div>

//       {/* ════════ CALENDAR VIEW ════════ */}
//       {viewMode === "calendar" && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//           {/* Calendar grid */}
//           <div className="lg:col-span-2 bg-[#002238] border border-white/5 rounded-2xl p-5">
//             <div className="grid grid-cols-7 mb-2">
//               {DAYS.map(d => (
//                 <div key={d} className="text-center text-[#a3cbf2]/30 text-xs font-medium py-1">{d}</div>
//               ))}
//             </div>
//             <div className="grid grid-cols-7 gap-1">
//               {cells.map((day, i) => {
//                 if (!day) return <div key={`empty-${i}`} />;
//                 const key  = fmt(year, month, day);
//                 const info = availability[key];
//                 const isSel = selected === day;
//                 return (
//                   <button
//                     key={key}
//                     onClick={() => setSelected(isSel ? null : day)}
//                     className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs font-semibold transition-all duration-200
//                       ${isSel ? "ring-2 ring-sky-400" : ""}
//                       ${getCellStyle(info)}`}
//                   >
//                     <span>{day}</span>
//                     {info && !info.closed && (
//                       <span className="text-[9px] opacity-60">{info.booked}/{info.total}</span>
//                     )}
//                     {info?.closed && <Lock size={8} className="opacity-50" />}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Detail panel */}
//           <div className="space-y-4">
//             <DateDetailPanel
//               selectedKey={selectedKey}
//               selectedInfo={selectedInfo}
//               selected={selected}
//               month={month}
//               year={year}
//               setSelected={setSelected}
//               setAvailability={setAvailability}
//             />

//             {/* Mini upcoming list */}
//             <div className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden">
//               <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
//                 <h3 className="text-[#cee5ff] text-sm font-bold">Upcoming Dates</h3>
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className="text-sky-400 text-xs hover:text-sky-300 transition-colors"
//                 >
//                   See all →
//                 </button>
//               </div>
//               <div className="divide-y divide-white/5">
//                 {allDates
//                   .filter(([k]) => k >= fmt(year, month, 1))
//                   .slice(0, 6)
//                   .map(([key, info]) => {
//                     const [y, m, d] = key.split("-");
//                     return (
//                       <button
//                         key={key}
//                         onClick={() => { setMonth(parseInt(m) - 1); setYear(parseInt(y)); setSelected(parseInt(d)); }}
//                         className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] transition-colors text-left"
//                       >
//                         <span className="text-[#a3cbf2]/60 text-xs">{MONTHS[parseInt(m) - 1].slice(0, 3)} {d}</span>
//                         {info.closed ? (
//                           <span className="text-[#a3cbf2]/30 text-xs flex items-center gap-1"><Lock size={10} /> Closed</span>
//                         ) : (
//                           <span className={`text-xs font-medium ${info.booked >= info.total ? "text-sky-400" : info.booked > 0 ? "text-yellow-400" : "text-teal-400"}`}>
//                             {info.booked}/{info.total} seats
//                           </span>
//                         )}
//                       </button>
//                     );
//                   })}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ════════ LIST VIEW ════════ */}
//       {viewMode === "list" && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//           {/* Date list */}
//           <div className="lg:col-span-2 bg-[#002238] border border-white/5 rounded-2xl overflow-hidden">
//             <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
//               <h2 className="text-[#cee5ff] text-sm font-bold">
//                 {monthDates.length > 0
//                   ? `${monthDates.length} scheduled dates in ${MONTHS[month]}`
//                   : `No dates scheduled in ${MONTHS[month]}`}
//               </h2>
//             </div>

//             {monthDates.length === 0 ? (
//               <div className="py-16 text-center">
//                 <CalendarDays className="mx-auto mb-3 text-[#a3cbf2]/20" size={32} />
//                 <p className="text-[#a3cbf2]/30 text-sm">No scheduled dates this month</p>
//               </div>
//             ) : (
//               <div className="divide-y divide-white/5">
//                 {monthDates.map(([key, info]) => {
//                   const [, , d] = key.split("-");
//                   const { label, cls } = getStatusLabel(info);
//                   const isSel = selectedKey === key;
//                   return (
//                     <button
//                       key={key}
//                       onClick={() => setSelected(isSel ? null : parseInt(d))}
//                       className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-colors duration-200 ${
//                         isSel ? "bg-sky-500/5" : "hover:bg-white/[0.03]"
//                       }`}
//                     >
//                       {/* Date badge */}
//                       <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${
//                         info.closed ? "bg-white/5" : info.booked >= info.total ? "bg-sky-500/15" : info.booked > 0 ? "bg-yellow-400/10" : "bg-teal-400/10"
//                       }`}>
//                         <span className="text-[#a3cbf2]/40 text-[9px] uppercase">{MONTHS[month].slice(0, 3)}</span>
//                         <span className="text-[#cee5ff] font-black text-lg leading-none">{parseInt(d)}</span>
//                       </div>

//                       {/* Trip + status */}
//                       <div className="flex-1 min-w-0">
//                         <p className="text-[#cee5ff] font-medium text-sm truncate">
//                           {info.trip || "Open Date"}
//                         </p>
//                         <p className="text-[#a3cbf2]/40 text-xs mt-0.5">
//                           {info.closed ? "Closed to bookings" : `${info.booked} of ${info.total} seats booked`}
//                         </p>
//                       </div>

//                       {/* Seat bar */}
//                       {!info.closed && (
//                         <div className="w-24 shrink-0 hidden sm:block">
//                           <div className="h-1.5 bg-[#001526] rounded-full overflow-hidden">
//                             <div
//                               className={`h-full rounded-full ${info.booked >= info.total ? "bg-sky-400" : info.booked > 0 ? "bg-yellow-400" : "bg-teal-400"}`}
//                               style={{ width: `${info.total ? (info.booked / info.total) * 100 : 0}%` }}
//                             />
//                           </div>
//                         </div>
//                       )}

//                       {/* Status pill */}
//                       <span className={`shrink-0 text-xs font-semibold ${cls}`}>
//                         {label}
//                         {info.closed && <Lock size={10} className="inline ml-1 opacity-60" />}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Detail panel */}
//           <div>
//             <DateDetailPanel
//               selectedKey={selectedKey}
//               selectedInfo={selectedInfo}
//               selected={selected}
//               month={month}
//               year={year}
//               setSelected={setSelected}
//               setAvailability={setAvailability}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GuideSchedulePage;
