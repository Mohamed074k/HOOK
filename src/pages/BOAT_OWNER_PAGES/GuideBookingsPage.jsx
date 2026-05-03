import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Users, MessageSquare, Calendar, ArrowUpRight, Loader2, Check, X, Clock, AlertCircle, Image as ImageIcon } from "lucide-react";
import { useBookings } from "../../context/BOAT_OWNER_CONTEXT/BookingContext";

// Helper function to resolve absolute image URLs
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

const GuideBookingsPage = () => {
  const { 
    bookings, 
    loading, 
    stats, 
    updateStatus,
    getStatusText,
    getStatusStyle,
    uiTripFilter,
    setUiTripFilter,
    uiStatusFilter,
    setUiStatusFilter,
    allTrips,
    allStatuses
  } = useBookings();
  
  const [expandedId, setExpandedId] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  
  // State for Image Receipt Modal
  const [receiptModal, setReceiptModal] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);
  
  const handleStatusUpdate = async (bookingId, newStatus, currentStatus) => {
    if (currentStatus === newStatus) return;
    
    setUpdatingStatus(bookingId);
    try {
      await updateStatus(bookingId, newStatus);
    } finally {
      setUpdatingStatus(null);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatPrice = (price) => {
    return `$${price?.toLocaleString() || 0}`;
  };
  
  const summaryCards = [
    { 
      label: "Total Bookings", 
      value: stats?.totalBookings || 0, 
      color: "text-sky-400",
      hoverBorder: "hover:border-sky-400/30",
      hoverShadow: "hover:shadow-sky-400/10"
    },
    { 
      label: "Pending Review", 
      value: stats?.pendingBookings || 0, 
      color: "text-yellow-400",
      hoverBorder: "hover:border-yellow-400/30",
      hoverShadow: "hover:shadow-yellow-400/10"
    },
    { 
      label: "Confirmed", 
      value: stats?.approvedBookings || 0, 
      color: "text-sky-400",
      hoverBorder: "hover:border-sky-400/30",
      hoverShadow: "hover:shadow-sky-400/10"
    },
    { 
      label: "Total Revenue", 
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`, 
      color: "text-teal-400",
      hoverBorder: "hover:border-teal-400/30",
      hoverShadow: "hover:shadow-teal-400/10"
    },
  ];

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filters */}
      <div className={`relative z-40 transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Incoming Bookings</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">{bookings.length} reservations found</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            
            {/* Trip Filter */}
            <div className={`relative group ${openDropdown === 'trip' ? 'z-50' : 'z-10'}`}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'trip' ? null : 'trip')}
                onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                className="bg-[#002238] border border-white/5 hover:border-sky-400/30 rounded-xl pl-4 pr-10 py-2.5 text-[#a3cbf2]/70 hover:text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 w-44 text-left relative z-10 shadow-sm hover:shadow-sky-400/5"
              >
                <span className="block truncate">{uiTripFilter}</span>
                <ChevronDown size={14} className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/30 group-hover:text-sky-400 transition-all duration-300 pointer-events-none ${openDropdown === 'trip' ? 'rotate-180 text-sky-400' : ''}`} />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-full bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${openDropdown === 'trip' ? 'opacity-100 scale-y-100 translate-y-0 visible' : 'opacity-0 scale-y-95 -translate-y-2 invisible'}`}>
                <div className="max-h-60 overflow-y-auto py-1">
                  {allTrips.map(trip => (
                    <button key={trip} onClick={() => { setUiTripFilter(trip); setOpenDropdown(null); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${uiTripFilter === trip ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'}`}>
                      {trip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className={`relative group ${openDropdown === 'status' ? 'z-50' : 'z-10'}`}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                className="bg-[#002238] border border-white/5 hover:border-sky-400/30 rounded-xl pl-4 pr-10 py-2.5 text-[#a3cbf2]/70 hover:text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 w-36 text-left relative z-10 shadow-sm hover:shadow-sky-400/5"
              >
                <span className="block truncate">{uiStatusFilter}</span>
                <ChevronDown size={14} className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/30 group-hover:text-sky-400 transition-all duration-300 pointer-events-none ${openDropdown === 'status' ? 'rotate-180 text-sky-400' : ''}`} />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-full bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${openDropdown === 'status' ? 'opacity-100 scale-y-100 translate-y-0 visible' : 'opacity-0 scale-y-95 -translate-y-2 invisible'}`}>
                <div className="py-1">
                  {allStatuses.map(status => (
                    <button key={status} onClick={() => { setUiStatusFilter(status); setOpenDropdown(null); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${uiStatusFilter === status ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'}`}>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map(({ label, value, color, hoverBorder, hoverShadow }, idx) => (
          <div 
            key={label} 
            className={`bg-[#002238] border border-white/5 rounded-xl p-4 transform transition-all duration-500 ease-out cursor-default group hover:-translate-y-1 hover:shadow-lg ${hoverBorder} ${hoverShadow}`}
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: `${idx * 100}ms` }}
          >
            <p className="text-[#a3cbf2]/40 text-xs mb-1 group-hover:text-[#a3cbf2]/60 transition-colors duration-300">{label}</p>
            <p className={`text-2xl font-black ${color} group-hover:scale-105 origin-left transition-transform duration-300`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <div className="relative z-10 space-y-3">
        {bookings.length === 0 && (
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-12 text-center transform transition-all duration-700 ease-out">
            <p className="text-[#a3cbf2]/30 text-sm">No bookings match the selected filters.</p>
          </div>
        )}

        {bookings.map((booking, idx) => {
          const isExpanded = expandedId === booking.id;
          const statusText = getStatusText(booking.status);
          const statusStyle = getStatusStyle(booking.status);
          
          return (
            <div
              key={booking.id}
              className={`bg-[#002238] border rounded-2xl overflow-hidden transform transition-all duration-500 ease-out ${
                isExpanded ? "border-sky-400/30 shadow-lg shadow-sky-400/5" : "border-white/5 hover:border-white/10"
              }`}
              style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(30px)", transitionDelay: `${(idx + 2) * 100}ms` }}
            >
              {/* Main Row */}
              <div className={`w-full text-left px-5 py-4 flex items-center justify-between gap-4 transition-colors duration-300 ${isExpanded ? "bg-sky-400/5" : "hover:bg-white/[0.02]"}`}>
                <button className="flex items-center gap-4 min-w-0 flex-1" onClick={() => toggle(booking.id)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 transition-colors duration-300 ${isExpanded ? "bg-sky-500/20 text-sky-400" : "bg-sky-500/10 text-sky-400/70"}`}>
                    {booking.userFullName?.[0] || "G"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[#cee5ff] font-semibold text-sm">{booking.userFullName || "Guest"}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusStyle}`}>{statusText}</span>
                      {booking.specialRequests && <span className="flex items-center gap-1 text-yellow-400/60 text-xs"><MessageSquare size={11} /> Note</span>}
                      {booking.payment?.receiptImageUrl && <span className="flex items-center gap-1 text-emerald-400/80 text-xs ml-1"><ImageIcon size={11} /> Receipt</span>}
                    </div>
                    <p className="text-[#a3cbf2]/40 text-xs mt-0.5 truncate">
                      {booking.tripTitle} · <span className="inline-flex items-center gap-1"><Calendar size={10} /> {formatDate(booking.startDate)}</span>
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Buttons: 2 = Confirmed, 4 = Rejected */}
                  {booking.status === 1 && (
                    <div className="flex gap-1 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 2, booking.status); }}
                        disabled={updatingStatus === booking.id}
                        className="p-1.5 rounded-lg bg-teal-400/10 text-teal-400 hover:bg-teal-400/20 transition-all duration-200 disabled:opacity-50"
                        title="Confirm Booking"
                      >
                        {updatingStatus === booking.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 4, booking.status); }}
                        disabled={updatingStatus === booking.id}
                        className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all duration-200 disabled:opacity-50"
                        title="Reject Booking"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  <div className="text-right hidden sm:block">
                    <p className="text-sky-400 font-bold text-sm">{formatPrice(booking.totalPrice)}</p>
                    <p className="text-[#a3cbf2]/40 text-xs flex items-center gap-1 justify-end"><Users size={10} /> {booking.numberOfParticipants} {booking.numberOfParticipants === 1 ? 'person' : 'persons'}</p>
                  </div>
                  
                  <button onClick={() => toggle(booking.id)}>
                    <ChevronDown size={18} className={`shrink-0 transition-all duration-300 ${isExpanded ? "rotate-180 text-sky-400" : "text-[#a3cbf2]/30"}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-2 space-y-4">
                    <div className="h-px bg-white/5" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Passenger Details */}
                      <div className="bg-[#001526]/60 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <p className="text-[#a3cbf2]/40 text-xs font-medium uppercase tracking-wider mb-3">Passenger Details</p>
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#a3cbf2]/40">Name</span>
                            <span className="text-[#cee5ff] font-medium">{booking.userFullName || "N/A"}</span>
                          </div>
                          {booking.userPhoneNumber && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-[#a3cbf2]/40">Phone</span>
                              <span className="text-[#cee5ff] font-medium">{booking.userPhoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div className="bg-[#001526]/60 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <p className="text-[#a3cbf2]/40 text-xs font-medium uppercase tracking-wider mb-3">Trip Details</p>
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#a3cbf2]/40">Trip</span>
                            <span className="text-[#cee5ff] font-medium">{booking.tripTitle}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#a3cbf2]/40">Boat</span>
                            <span className="text-[#cee5ff] font-medium">{booking.boatName || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#a3cbf2]/40">Date</span>
                            <span className="text-[#cee5ff] font-medium">{formatDate(booking.startDate)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#a3cbf2]/40">Participants</span>
                            <span className="text-[#cee5ff] font-medium">{booking.numberOfParticipants} persons</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#a3cbf2]/40">Total Amount</span>
                            <span className="text-sky-400 font-bold">{formatPrice(booking.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    {booking.payment && (
                      <div className="bg-[#001526]/60 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <p className="text-[#a3cbf2]/40 text-xs font-medium uppercase tracking-wider mb-3">Payment Details</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div>
                            <p className="text-[#a3cbf2]/40 text-xs">Amount</p>
                            <p className="text-[#cee5ff] font-medium text-sm">{formatPrice(booking.payment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-[#a3cbf2]/40 text-xs">Payment Method</p>
                            <p className="text-[#cee5ff] font-medium text-sm">
                              {booking.payment.method === 1 ? "Cash" : 
                               booking.payment.method === 2 ? "InstaPay" : "Other"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#a3cbf2]/40 text-xs">Payment Status</p>
                            <p className="text-teal-400 font-medium text-sm">
                              {booking.payment.status === 1 ? "Paid / Verified" : 
                               booking.payment.status === 2 ? "Pending" : "Failed"}
                            </p>
                          </div>

                          {/* Show Receipt Button if InstaPay & Has Image */}
                          {booking.payment.receiptImageUrl && (
                            <div className="col-span-full mt-2">
                              <p className="text-[#a3cbf2]/40 text-xs mb-2">InstaPay Receipt</p>
                              <button
                                onClick={() => setReceiptModal(getImageUrl(booking.payment.receiptImageUrl))}
                                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-400/10 text-sky-400 border border-sky-400/20 hover:bg-sky-400/20 transition-all text-sm font-medium"
                              >
                                <ImageIcon size={16} /> View Transferred Receipt
                              </button>
                            </div>
                          )}

                          {booking.payment.transactionId && (
                            <div className="col-span-full mt-2">
                              <p className="text-[#a3cbf2]/40 text-xs">Transaction ID</p>
                              <p className="text-[#cee5ff] font-mono text-xs">{booking.payment.transactionId}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-xl p-4">
                        <p className="text-yellow-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <MessageSquare size={12} /> Special Requests
                        </p>
                        <p className="text-[#cee5ff]/80 text-sm leading-relaxed">"{booking.specialRequests}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Receipt Image Modal (Fullscreen) */}
      <AnimatePresence>
        {receiptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReceiptModal(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // يمنع إغلاق الصورة عند الضغط عليها نفسها
              className="relative w-full max-w-3xl max-h-[85vh] flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setReceiptModal(null)}
                className="absolute -top-12 right-0 sm:-right-12 p-2 bg-white/10 hover:bg-red-500 rounded-full text-white transition-all backdrop-blur-md"
              >
                <X size={24} />
              </button>
              <img
                src={receiptModal}
                alt="Payment Receipt"
                className="w-full h-full object-contain rounded-2xl shadow-2xl bg-[#001526]/50"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuideBookingsPage;