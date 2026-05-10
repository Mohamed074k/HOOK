import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, ChevronUp, Users, MessageSquare, Calendar, ArrowUpRight, 
  Loader2, Check, X, Clock, AlertCircle, Image as ImageIcon, Trash2, RotateCcw,
  AlertTriangle, CheckCircle 
} from "lucide-react";
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
    refundPayment,
    verifyPayment, 
    getStatusText,
    getStatusStyle,
    uiTripFilter,
    setUiTripFilter,
    uiStatusFilter,
    setUiStatusFilter,
    allTrips,
    allStatuses,
    isAdmin
  } = useBookings();
  
  const [expandedId, setExpandedId] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  
  // Refund Modal States
  const [refundModal, setRefundModal] = useState(null);
  const [processingRefund, setProcessingRefund] = useState(null);
  
  // Verification Modal States
  const [paymentVerifyModal, setPaymentVerifyModal] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [processingVerification, setProcessingVerification] = useState(null);

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

  const handleRefund = async (paymentId, bookingId) => {
    setProcessingRefund(paymentId);
    try {
      await refundPayment(bookingId, paymentId);
      setRefundModal(null); 
    } finally {
      setProcessingRefund(null);
    }
  };

  const handleVerifyPayment = async () => {
    setProcessingVerification(paymentVerifyModal.paymentId);
    try {
      await verifyPayment(
        paymentVerifyModal.bookingId, 
        paymentVerifyModal.paymentId, 
        paymentVerifyModal.isApproved, 
        verificationNotes
      );
      setPaymentVerifyModal(null);
      setVerificationNotes("");
    } finally {
      setProcessingVerification(null);
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

  // 1: Pending, 2: Completed, 3: Failed, 4: Refunded, 5: Rejected
  const getPaymentStatusDetails = (status) => {
    switch(status) {
      case 1: return { text: "Pending", color: "text-yellow-400" };
      case 2: return { text: "Completed", color: "text-teal-400" };
      case 3: return { text: "Failed", color: "text-red-400" };
      case 4: return { text: "Refunded", color: "text-orange-400" };
      case 5: return { text: "Rejected", color: "text-red-500" };
      case 6: return { text: "Cancel Request", color: "text-purple-400" };
      default: return { text: "Cancel Request", color: "text-[#cee5ff]" };
    }
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
    <div className="space-y-6 pb-12 px-2 sm:px-0">
      {/* Header & Filters */}
      <div className={`relative z-40 transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Incoming Bookings</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">{bookings.length} reservations found</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full sm:w-auto sm:flex sm:flex-wrap">
            {/* Trip Filter */}
            <div className={`relative group w-full sm:w-auto ${openDropdown === 'trip' ? 'z-50' : 'z-10'}`}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'trip' ? null : 'trip')}
                onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                className="bg-[#002238] border border-white/5 hover:border-sky-400/30 rounded-xl pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 text-[#a3cbf2]/70 hover:text-[#cee5ff] text-xs sm:text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 w-full sm:w-44 text-left relative z-10 shadow-sm hover:shadow-sky-400/5"
              >
                <span className="block truncate">{uiTripFilter}</span>
                <ChevronDown size={14} className={`absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/30 group-hover:text-sky-400 transition-all duration-300 pointer-events-none ${openDropdown === 'trip' ? 'rotate-180 text-sky-400' : ''}`} />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-full sm:w-48 bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${openDropdown === 'trip' ? 'opacity-100 scale-y-100 translate-y-0 visible' : 'opacity-0 scale-y-95 -translate-y-2 invisible'}`}>
                <div className="max-h-60 overflow-y-auto py-1">
                  {allTrips.map(trip => (
                    <button key={trip} onClick={() => { setUiTripFilter(trip); setOpenDropdown(null); }} className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors duration-200 ${uiTripFilter === trip ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'}`}>
                      {trip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className={`relative group w-full sm:w-auto ${openDropdown === 'status' ? 'z-50' : 'z-10'}`}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                className="bg-[#002238] border border-white/5 hover:border-sky-400/30 rounded-xl pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 text-[#a3cbf2]/70 hover:text-[#cee5ff] text-xs sm:text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 w-full sm:w-36 text-left relative z-10 shadow-sm hover:shadow-sky-400/5"
              >
                <span className="block truncate">{uiStatusFilter}</span>
                <ChevronDown size={14} className={`absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/30 group-hover:text-sky-400 transition-all duration-300 pointer-events-none ${openDropdown === 'status' ? 'rotate-180 text-sky-400' : ''}`} />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-full sm:w-36 bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${openDropdown === 'status' ? 'opacity-100 scale-y-100 translate-y-0 visible' : 'opacity-0 scale-y-95 -translate-y-2 invisible'}`}>
                <div className="py-1">
                  {allStatuses.map(status => (
                    <button key={status} onClick={() => { setUiStatusFilter(status); setOpenDropdown(null); }} className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors duration-200 ${uiStatusFilter === status ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'}`}>
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
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {summaryCards.map(({ label, value, color, hoverBorder, hoverShadow }, idx) => (
          <div 
            key={label} 
            className={`bg-[#002238] border border-white/5 rounded-xl p-3 sm:p-4 transform transition-all duration-500 ease-out cursor-default group hover:-translate-y-1 hover:shadow-lg ${hoverBorder} ${hoverShadow}`}
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: `${idx * 100}ms` }}
          >
            <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs mb-0.5 sm:mb-1 group-hover:text-[#a3cbf2]/60 transition-colors duration-300 truncate">{label}</p>
            <p className={`text-lg sm:text-2xl font-black ${color} group-hover:scale-105 origin-left transition-transform duration-300 truncate`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <div className="relative z-10 space-y-2 sm:space-y-3">
        {bookings.length === 0 && (
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-8 sm:p-12 text-center transform transition-all duration-700 ease-out">
            <p className="text-[#a3cbf2]/30 text-sm">No bookings match the selected filters.</p>
          </div>
        )}

        {bookings.map((booking, idx) => {
          const isExpanded = expandedId === booking.id;
          const statusText = getStatusText(booking.status);
          const statusStyle = getStatusStyle(booking.status);
          const paymentStatus = booking.payment ? getPaymentStatusDetails(booking.payment.status) : null;
          
          return (
            <div
              key={booking.id}
              className={`bg-[#002238] border rounded-xl sm:rounded-2xl overflow-hidden transform transition-all duration-500 ease-out ${
                isExpanded ? "border-sky-400/30 shadow-lg shadow-sky-400/5" : "border-white/5 hover:border-white/10"
              }`}
              style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(30px)", transitionDelay: `${(idx + 2) * 100}ms` }}
            >
              {/* Main Row */}
              <div className={`w-full text-left px-3 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 transition-colors duration-300 ${isExpanded ? "bg-sky-400/5" : "hover:bg-white/[0.02]"}`}>
                <button className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1" onClick={() => toggle(booking.id)}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shrink-0 transition-colors duration-300 ${isExpanded ? "bg-sky-500/20 text-sky-400" : "bg-sky-500/10 text-sky-400/70"}`}>
                    {booking.userFullName?.[0] || "G"}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <p className="text-[#cee5ff] font-semibold text-[13px] sm:text-sm truncate max-w-[130px] sm:max-w-none">{booking.userFullName || "Guest"}</p>
                      <span className={`px-1.5 py-[1px] sm:px-2 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${statusStyle}`}>{statusText}</span>
                      {booking.specialRequests && <span className="hidden sm:flex items-center gap-1 text-yellow-400/60 text-[10px] sm:text-xs"><MessageSquare size={11} /> Note</span>}
                      {booking.payment?.receiptImageUrl && <span className="flex items-center gap-0.5 text-emerald-400/80 text-[10px] sm:text-xs shrink-0"><ImageIcon size={10} /> Receipt</span>}
                    </div>
                    <p className="text-[#a3cbf2]/40 text-[11px] sm:text-xs mt-0.5 sm:mt-1 truncate w-full">
                      {booking.tripTitle} <span className="hidden sm:inline">·</span><span className="sm:hidden block h-0.5"></span> <span className="inline-flex items-center gap-1"><Calendar size={10} /> {formatDate(booking.startDate)}</span>
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  {/* Status Buttons: 1 = Pending */}
                  {booking.status === 1 && (
                    <div className="flex gap-1 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 2, booking.status); }}
                        disabled={updatingStatus === booking.id}
                        className="p-1 sm:p-1.5 rounded-lg bg-teal-400/10 text-teal-400 hover:bg-teal-400/20 transition-all duration-200 disabled:opacity-50"
                        title="Confirm Booking"
                      >
                        {updatingStatus === booking.id ? <Loader2 size={14} className="animate-spin w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Check size={14} className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 4, booking.status); }}
                        disabled={updatingStatus === booking.id}
                        className="p-1 sm:p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all duration-200 disabled:opacity-50"
                        title="Reject Booking"
                      >
                        <X size={14} className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="text-right hidden sm:block">
                    <p className="text-sky-400 font-bold text-sm">{formatPrice(booking.totalPrice)}</p>
                    <p className="text-[#a3cbf2]/40 text-xs flex items-center gap-1 justify-end"><Users size={10} /> {booking.numberOfParticipants} {booking.numberOfParticipants === 1 ? 'person' : 'persons'}</p>
                  </div>
                  
                  <button onClick={() => toggle(booking.id)} className="p-1 sm:p-0">
                    <ChevronDown size={18} className={`shrink-0 transition-all duration-300 w-4 h-4 sm:w-[18px] sm:h-[18px] ${isExpanded ? "rotate-180 text-sky-400" : "text-[#a3cbf2]/30"}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="px-3 sm:px-5 pb-4 sm:pb-5 pt-1 sm:pt-2 space-y-3 sm:space-y-4">
                    <div className="h-px bg-white/5" />

                    <div className="flex justify-between sm:justify-end items-center">
                      <div className="sm:hidden text-left">
                        <p className="text-sky-400 font-bold text-sm">{formatPrice(booking.totalPrice)}</p>
                        <p className="text-[#a3cbf2]/40 text-[10px] flex items-center gap-1"><Users size={10} /> {booking.numberOfParticipants} {booking.numberOfParticipants === 1 ? 'person' : 'persons'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {/* Passenger Details */}
                      <div className="bg-[#001526]/60 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3">Passenger Details</p>
                        <div className="space-y-2 sm:space-y-2.5">
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-[#a3cbf2]/40">Name</span>
                            <span className="text-[#cee5ff] font-medium">{booking.userFullName || "N/A"}</span>
                          </div>
                          {booking.userPhoneNumber && (
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                              <span className="text-[#a3cbf2]/40">Phone</span>
                              <span className="text-[#cee5ff] font-medium">{booking.userPhoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div className="bg-[#001526]/60 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3">Trip Details</p>
                        <div className="space-y-2 sm:space-y-2.5">
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-[#a3cbf2]/40">Trip</span>
                            <span className="text-[#cee5ff] font-medium truncate max-w-[150px] sm:max-w-[200px] text-right">{booking.tripTitle}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-[#a3cbf2]/40">Boat</span>
                            <span className="text-[#cee5ff] font-medium">{booking.boatName || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-[#a3cbf2]/40">Date</span>
                            <span className="text-[#cee5ff] font-medium">{formatDate(booking.startDate)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-[#a3cbf2]/40">Participants</span>
                            <span className="text-[#cee5ff] font-medium">{booking.numberOfParticipants} persons</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-[#a3cbf2]/40">Total Amount</span>
                            <span className="text-sky-400 font-bold">{formatPrice(booking.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    {booking.payment && (
                      <div className="bg-[#001526]/60 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-colors duration-300 relative">
                        <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3">Payment Details</p>
                        
                        {/* Refund Button logic: Show if payment isn't Refunded, Failed, or Rejected */}
                        {booking.payment.status !== 4 && booking.payment.status !== 3 && booking.payment.status !== 5 && (
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                             <button
                               onClick={() => setRefundModal({
                                 bookingId: booking.id,
                                 paymentId: booking.payment.id,
                                 amount: booking.payment.amount,
                                 userName: booking.userFullName || "Guest"
                               })}
                               className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-all text-[10px] sm:text-xs font-medium disabled:opacity-50"
                             >
                               <RotateCcw size={12} />
                               Refund
                             </button>
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <div>
                            <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs">Amount</p>
                            <p className="text-[#cee5ff] font-medium text-xs sm:text-sm">{formatPrice(booking.payment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs">Payment Method</p>
                            <p className="text-[#cee5ff] font-medium text-xs sm:text-sm">
                              {booking.payment.method === 1 ? "Cash" : 
                               booking.payment.method === 2 ? "InstaPay" : "Other"}
                            </p>
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs">Payment Status</p>
                            <p className={`${paymentStatus?.color} font-medium text-xs sm:text-sm`}>
                              {paymentStatus?.text}
                            </p>
                          </div>

                          {/* Show Receipt Button if InstaPay & Has Image */}
                          {booking.payment.receiptImageUrl && (
                            <div className="col-span-full mt-1 sm:mt-2">
                              <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs mb-1.5 sm:mb-2">InstaPay Receipt</p>
                              <button
                                onClick={() => setReceiptModal(getImageUrl(booking.payment.receiptImageUrl))}
                                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl bg-sky-400/10 text-sky-400 border border-sky-400/20 hover:bg-sky-400/20 transition-all text-xs sm:text-sm font-medium"
                              >
                                <ImageIcon size={14} className="sm:w-4 sm:h-4" /> View Transferred Receipt
                              </button>
                            </div>
                          )}

                          {booking.payment.transactionId && (
                            <div className="col-span-full mt-1 sm:mt-2">
                              <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs">Transaction ID</p>
                              <p className="text-[#cee5ff] font-mono text-[10px] sm:text-xs break-all">{booking.payment.transactionId}</p>
                            </div>
                          )}
                          
                          {/* Payment Verification Buttons (InstaPay & Pending) */}
                          {booking.payment.method === 2 && booking.payment.status === 1 && (
                            <div className="col-span-full mt-3 flex items-center gap-2 pt-3 border-t border-white/5">
                              <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs flex-1">Verification Action Required</p>
                              <button
                                onClick={() => setPaymentVerifyModal({ bookingId: booking.id, paymentId: booking.payment.id, isApproved: true })}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20 hover:bg-teal-400/20 transition-all text-[10px] sm:text-xs font-medium"
                              >
                                <Check size={12} /> Approve
                              </button>
                              <button
                                onClick={() => setPaymentVerifyModal({ bookingId: booking.id, paymentId: booking.payment.id, isApproved: false })}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-all text-[10px] sm:text-xs font-medium"
                              >
                                <X size={12} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-xl p-3 sm:p-4 mt-3">
                        <p className="text-yellow-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center gap-1.5">
                          <MessageSquare size={12} /> Special Requests
                        </p>
                        <p className="text-[#cee5ff]/80 text-xs sm:text-sm leading-relaxed">"{booking.specialRequests}"</p>
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
              onClick={(e) => e.stopPropagation()}
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

      {/* Refund Confirmation Modal */}
      <AnimatePresence>
        {refundModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !processingRefund && setRefundModal(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#001526] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-400/10 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-[#cee5ff]">Confirm Refund</h3>
                </div>
                
                <p className="text-[#a3cbf2]/70 text-sm mb-6">
                  Are you sure you want to process a refund of <span className="text-orange-400 font-medium">{formatPrice(refundModal.amount)}</span> to <span className="text-[#cee5ff] font-medium">{refundModal.userName}</span>?
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setRefundModal(null)}
                    disabled={processingRefund === refundModal.paymentId}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-[#a3cbf2]/70 hover:bg-white/10 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRefund(refundModal.paymentId, refundModal.bookingId)}
                    disabled={processingRefund === refundModal.paymentId}
                    className="flex-1 px-4 py-2 rounded-lg bg-orange-400/10 text-orange-400 border border-orange-400/20 hover:bg-orange-400/20 transition-all font-medium text-sm disabled:opacity-50"
                  >
                    {processingRefund === refundModal.paymentId ? (
                      <Loader2 size={16} className="animate-spin mx-auto" />
                    ) : (
                      "Confirm Refund"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Confirmation Modal */}
      <AnimatePresence>
        {paymentVerifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !processingVerification && setPaymentVerifyModal(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#001526] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentVerifyModal.isApproved ? 'bg-teal-400/10' : 'bg-red-400/10'}`}>
                    {paymentVerifyModal.isApproved ? (
                      <CheckCircle size={20} className="text-teal-400" />
                    ) : (
                      <AlertTriangle size={20} className="text-red-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#cee5ff]">
                    {paymentVerifyModal.isApproved ? "Approve Payment" : "Reject Payment"}
                  </h3>
                </div>
                
                <p className="text-[#a3cbf2]/70 text-sm mb-4">
                  Are you sure you want to {paymentVerifyModal.isApproved ? "approve" : "reject"} this InstaPay transfer?
                </p>

                <div className="mb-6">
                  <label className="block text-[#a3cbf2]/40 text-xs mb-2">Notes (Optional)</label>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Enter any relevant notes..."
                    className="w-full bg-[#002238] border border-white/10 rounded-xl p-3 text-sm text-[#cee5ff] placeholder-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 resize-none h-24"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setPaymentVerifyModal(null);
                      setVerificationNotes("");
                    }}
                    disabled={processingVerification === paymentVerifyModal.paymentId}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-[#a3cbf2]/70 hover:bg-white/10 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyPayment}
                    disabled={processingVerification === paymentVerifyModal.paymentId}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-all font-medium text-sm disabled:opacity-50 ${
                      paymentVerifyModal.isApproved 
                        ? 'bg-teal-400/10 text-teal-400 border-teal-400/20 hover:bg-teal-400/20' 
                        : 'bg-red-400/10 text-red-400 border-red-400/20 hover:bg-red-400/20'
                    }`}
                  >
                    {processingVerification === paymentVerifyModal.paymentId ? (
                      <Loader2 size={16} className="animate-spin mx-auto" />
                    ) : (
                      paymentVerifyModal.isApproved ? "Confirm Approval" : "Confirm Rejection"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuideBookingsPage;