import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, Users, MessageSquare, Calendar, 
  Loader2, Check, X, Image as ImageIcon, Trash2,
  Search
} from "lucide-react";
import apiClient from "../../api/apiClient";
import { toast } from 'react-hot-toast';

// Helper function to resolve absolute image URLs
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

// Custom Confirm Modal Component
const ConfirmModal = ({ isOpen, title, text, onConfirm, onCancel, confirmText = "Confirm", isDanger = false }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-sm bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <h3 className="text-lg font-bold text-[#cee5ff] mb-2">{title}</h3>
          <p className="text-sm text-[#a3cbf2]/70 mb-6">{text}</p>
          <div className="flex gap-3">
            <motion.button 
              onClick={onCancel} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button 
              onClick={onConfirm} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${isDanger ? 'bg-rose-400/15 text-rose-300 hover:bg-rose-400/25 border border-rose-400/30' : 'bg-sky-400 text-[#001526] hover:bg-sky-300'}`}
            >
              {confirmText}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Booking status mapping
const getStatusText = (status) => {
  const statusMap = {
    1: "Pending",
    2: "Confirmed",
    3: "Cancelled",
    4: "Rejected",
    5: "Completed",
  };
  return statusMap[status] || "Unknown";
};

const getStatusStyle = (status) => {
  const styleMap = {
    1: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    2: "bg-sky-400/10 text-sky-400 border-sky-400/20",
    3: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50 border-white/10",
    4: "bg-red-400/10 text-red-400 border-red-400/20",
    5: "bg-teal-400/10 text-teal-400 border-teal-400/20",
  };
  return styleMap[status] || "bg-white/10 text-white/50";
};

// Payment Status mapping with styles
const getPaymentStatusText = (status) => {
  const statusMap = {
    1: "Pending",
    2: "Completed",
    3: "Failed",
    4: "Refunded",
    5: "Rejected"
  };
  return statusMap[status] || "Unknown";
};

const getPaymentStatusStyle = (status) => {
  const styleMap = {
    1: "bg-yellow-400/10 text-yellow-400",      // Pending
    2: "bg-teal-400/10 text-teal-400",          // Completed
    3: "bg-red-400/10 text-red-400",            // Failed
    4: "bg-purple-400/10 text-purple-400",      // Refunded
    5: "bg-rose-400/10 text-rose-400"           // Rejected
  };
  return styleMap[status] || "bg-white/10 text-white/50";
};

const getPaymentMethodText = (method) => {
  const methodMap = {
    1: "Cash On Arrival",
    2: "Instapay",
  };
  return methodMap[method] || "Unknown";
};

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tripFilter, setTripFilter] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0
  });
  
  // Modal states
  const [receiptModal, setReceiptModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    bookingId: null,
    bookingTitle: "",
  });

  // Get unique trips and statuses for filters
  const allTrips = ["All", ...new Set(bookings.map(b => b.tripTitle).filter(Boolean))];
  const allStatuses = ["All", "Pending", "Confirmed", "Cancelled", "Rejected", "Completed"];

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchBookings();
    return () => clearTimeout(timer);
  }, []);

  // Apply filters whenever bookings, searchQuery, statusFilter, or tripFilter changes
  useEffect(() => {
    applyFilters();
  }, [bookings, searchQuery, statusFilter, tripFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/Bookings/admin/GetAll");
      setBookings(data);
      
      // Calculate stats
      const total = data.length;
      const pending = data.filter(b => b.status === 1).length;
      const confirmed = data.filter(b => b.status === 2).length;
      const revenue = data.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      
      setStats({
        totalBookings: total,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        totalRevenue: revenue
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.userFullName?.toLowerCase().includes(query) ||
        booking.tripTitle?.toLowerCase().includes(query) ||
        booking.userEmail?.toLowerCase().includes(query) ||
        booking.id?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "All") {
      const statusMap = {
        "Pending": 1,
        "Confirmed": 2,
        "Cancelled": 3,
        "Rejected": 4,
        "Completed": 5,
      };
      const statusCode = statusMap[statusFilter];
      if (statusCode) {
        filtered = filtered.filter(booking => booking.status === statusCode);
      }
    }
    
    // Apply trip filter
    if (tripFilter !== "All") {
      filtered = filtered.filter(booking => booking.tripTitle === tripFilter);
    }
    
    setFilteredBookings(filtered);
  };

  const handleDeleteBooking = async () => {
    const { bookingId } = confirmModal;
    setDeletingId(bookingId);
    
    try {
      await apiClient.delete(`/api/Bookings/admin/hard-delete/${bookingId}`);
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    } finally {
      setDeletingId(null);
      setConfirmModal({ isOpen: false, bookingId: null, bookingTitle: "" });
      setExpandedId(null);
    }
  };

  const openDeleteConfirm = (booking) => {
    setConfirmModal({
      isOpen: true,
      bookingId: booking.id,
      bookingTitle: booking.tripTitle,
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
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
      value: stats.totalBookings, 
      color: "text-sky-400",
      hoverBorder: "hover:border-sky-400/30",
      hoverShadow: "hover:shadow-sky-400/10"
    },
    { 
      label: "Pending", 
      value: stats.pendingBookings, 
      color: "text-yellow-400",
      hoverBorder: "hover:border-yellow-400/30",
      hoverShadow: "hover:shadow-yellow-400/10"
    },
    { 
      label: "Confirmed", 
      value: stats.confirmedBookings, 
      color: "text-sky-400",
      hoverBorder: "hover:border-sky-400/30",
      hoverShadow: "hover:shadow-sky-400/10"
    },
    { 
      label: "Total Revenue", 
      value: formatPrice(stats.totalRevenue), 
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
          <p className="text-[#a3cbf2]/50">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full space-y-6 pb-12 px-2 sm:px-0">
      {/* Header & Filters */}
      <div className={`relative z-40 transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <div className="w-full sm:w-auto min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff] truncate">Bookings Management</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">{filteredBookings.length} bookings found</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#002238] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 transition-colors"
              placeholder="Search by user, trip, email..."
            />
          </div>
        </div>
        
        {/* Filter Row */}
        <div className="flex flex-row gap-2 sm:gap-3 mt-4 w-full">
          {/* Trip Filter */}
          <div className={`relative group flex-1 sm:flex-none sm:w-48 ${openDropdown === 'trip' ? 'z-50' : 'z-10'}`}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'trip' ? null : 'trip')}
              onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
              className="w-full bg-[#002238] border border-white/5 hover:border-sky-400/30 rounded-xl pl-3 pr-8 py-2 text-[#a3cbf2]/70 hover:text-[#cee5ff] text-xs sm:text-sm focus:outline-none focus:border-sky-400/50 transition-all duration-300 text-left relative z-10"
            >
              <span className="block truncate">{tripFilter === "All" ? "All Trips" : tripFilter}</span>
              <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/30 group-hover:text-sky-400 transition-all duration-300 ${openDropdown === 'trip' ? 'rotate-180 text-sky-400' : ''}`} />
            </button>
            <div className={`absolute top-full left-0 mt-2 min-w-full w-max max-w-[85vw] sm:max-w-xs bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${openDropdown === 'trip' ? 'opacity-100 scale-y-100 translate-y-0 visible' : 'opacity-0 scale-y-95 -translate-y-2 invisible'}`}>
              <div className="max-h-60 overflow-y-auto py-1">
                {allTrips.map(trip => (
                  <button 
                    key={trip} 
                    onClick={() => { setTripFilter(trip); setOpenDropdown(null); }} 
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors duration-200 ${tripFilter === trip ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'}`}
                  >
                    {trip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className={`relative group flex-1 sm:flex-none sm:w-36 ${openDropdown === 'status' ? 'z-50' : 'z-10'}`}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
              onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
              className="w-full bg-[#002238] border border-white/5 hover:border-sky-400/30 rounded-xl pl-3 pr-8 py-2 text-[#a3cbf2]/70 hover:text-[#cee5ff] text-xs sm:text-sm focus:outline-none focus:border-sky-400/50 transition-all duration-300 text-left relative z-10"
            >
              <span className="block truncate">{statusFilter}</span>
              <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/30 group-hover:text-sky-400 transition-all duration-300 ${openDropdown === 'status' ? 'rotate-180 text-sky-400' : ''}`} />
            </button>
            <div className={`absolute top-full left-0 mt-2 min-w-full w-max bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${openDropdown === 'status' ? 'opacity-100 scale-y-100 translate-y-0 visible' : 'opacity-0 scale-y-95 -translate-y-2 invisible'}`}>
              <div className="py-1">
                {allStatuses.map(status => (
                  <button 
                    key={status} 
                    onClick={() => { setStatusFilter(status); setOpenDropdown(null); }} 
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors duration-200 ${statusFilter === status ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'}`}
                  >
                    {status}
                  </button>
                ))}
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
      <div className="relative z-10 space-y-2 sm:space-y-3 w-full">
        {filteredBookings.length === 0 && (
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-8 sm:p-12 text-center">
            <p className="text-[#a3cbf2]/30 text-sm">No bookings match the selected filters.</p>
          </div>
        )}

        {filteredBookings.map((booking, idx) => {
          const isExpanded = expandedId === booking.id;
          const statusText = getStatusText(booking.status);
          const statusStyle = getStatusStyle(booking.status);
          
          return (
            <div
              key={booking.id}
              className={`w-full bg-[#002238] border rounded-xl sm:rounded-2xl overflow-hidden transform transition-all duration-500 ease-out ${
                isExpanded ? "border-sky-400/30 shadow-lg shadow-sky-400/5" : "border-white/5 hover:border-white/10"
              }`}
              style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(30px)", transitionDelay: `${(idx + 2) * 100}ms` }}
            >
              {/* Main Row */}
              <div className={`w-full text-left px-3 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 transition-colors duration-300 ${isExpanded ? "bg-sky-400/5" : "hover:bg-white/[0.02]"}`}>
                <button className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1" onClick={() => toggleExpand(booking.id)}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shrink-0 transition-colors duration-300 ${isExpanded ? "bg-sky-500/20 text-sky-400" : "bg-sky-500/10 text-sky-400/70"}`}>
                    {booking.userFullName?.[0] || "G"}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <p className="text-[#cee5ff] font-semibold text-[13px] sm:text-sm truncate max-w-[100px] min-[375px]:max-w-[130px] sm:max-w-none">{booking.userFullName || "Guest"}</p>
                      <span className={`px-1.5 py-[1px] sm:px-2 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap shrink-0 ${statusStyle}`}>{statusText}</span>
                      {booking.specialRequests && (
                        <span className="hidden sm:flex items-center gap-1 text-yellow-400/60 text-[10px] sm:text-xs shrink-0">
                          <MessageSquare size={11} /> Note
                        </span>
                      )}
                      {booking.payment?.receiptImageUrl && (
                        <span className="flex items-center gap-0.5 text-emerald-400/80 text-[10px] sm:text-xs shrink-0">
                          <ImageIcon size={10} /> Receipt
                        </span>
                      )}
                    </div>
                    <p className="text-[#a3cbf2]/40 text-[11px] sm:text-xs mt-0.5 sm:mt-1 truncate w-full">
                      {booking.tripTitle} <span className="hidden sm:inline">·</span>
                      <span className="sm:hidden block h-0.5"></span> 
                      <span className="inline-flex items-center gap-1 shrink-0">
                        <Calendar size={10} /> {formatDate(booking.startDate)}
                      </span>
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sky-400 font-bold text-sm">{formatPrice(booking.totalPrice)}</p>
                    <p className="text-[#a3cbf2]/40 text-xs flex items-center gap-1 justify-end">
                      <Users size={10} /> {booking.numberOfParticipants} {booking.numberOfParticipants === 1 ? 'person' : 'persons'}
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); openDeleteConfirm(booking); }}
                    disabled={deletingId === booking.id}
                    className="p-1.5 sm:p-2 rounded-lg bg-rose-400/10 text-rose-400 hover:bg-rose-400/20 transition-all duration-200 disabled:opacity-50 shrink-0"
                    title="Delete Booking"
                  >
                    {deletingId === booking.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                  
                  <button onClick={() => toggleExpand(booking.id)} className="p-1 sm:p-0 shrink-0">
                    <ChevronDown size={18} className={`transition-all duration-300 w-4 h-4 sm:w-[18px] sm:h-[18px] ${isExpanded ? "rotate-180 text-sky-400" : "text-[#a3cbf2]/30"}`} />
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
                        <p className="text-[#a3cbf2]/40 text-[10px] flex items-center gap-1">
                          <Users size={10} /> {booking.numberOfParticipants} {booking.numberOfParticipants === 1 ? 'person' : 'persons'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {/* Customer Details */}
                      <div className="bg-[#001526]/60 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3">Customer Details</p>
                        <div className="space-y-2 sm:space-y-2.5">
                          <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                            <span className="text-[#a3cbf2]/40 shrink-0">Name</span>
                            <span className="text-[#cee5ff] font-medium text-right break-words">{booking.userFullName || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                            <span className="text-[#a3cbf2]/40 shrink-0">Email</span>
                            <span className="text-[#cee5ff] font-medium break-all text-right">{booking.userEmail || "N/A"}</span>
                          </div>
                          {booking.userPhoneNumber && (
                            <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                              <span className="text-[#a3cbf2]/40 shrink-0">Phone</span>
                              <span className="text-[#cee5ff] font-medium text-right break-words">{booking.userPhoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div className="bg-[#001526]/60 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3">Trip Details</p>
                        <div className="space-y-2 sm:space-y-2.5">
                          <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                            <span className="text-[#a3cbf2]/40 shrink-0">Trip</span>
                            <span className="text-[#cee5ff] font-medium text-right break-words">{booking.tripTitle}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                            <span className="text-[#a3cbf2]/40 shrink-0">Boat</span>
                            <span className="text-[#cee5ff] font-medium text-right break-words">{booking.boatName || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                            <span className="text-[#a3cbf2]/40 shrink-0">Start Date</span>
                            <span className="text-[#cee5ff] font-medium text-right">{formatDate(booking.startDate)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                            <span className="text-[#a3cbf2]/40 shrink-0">End Date</span>
                            <span className="text-[#cee5ff] font-medium text-right">{formatDate(booking.endDate)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                            <span className="text-[#a3cbf2]/40 shrink-0">Participants</span>
                            <span className="text-[#cee5ff] font-medium text-right">{booking.numberOfParticipants} persons</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                            <span className="text-[#a3cbf2]/40 shrink-0">Total Amount</span>
                            <span className="text-sky-400 font-bold text-right">{formatPrice(booking.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    {booking.payment && (
                      <div className="bg-[#001526]/60 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Payment Details</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shrink-0 ${getPaymentStatusStyle(booking.payment.status)}`}>
                            {getPaymentStatusText(booking.payment.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div>
                            <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs">Amount</p>
                            <p className="text-[#cee5ff] font-medium text-xs sm:text-sm">{formatPrice(booking.payment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs">Payment Method</p>
                            <p className="text-[#cee5ff] font-medium text-xs sm:text-sm">{getPaymentMethodText(booking.payment.method)}</p>
                          </div>

                          {/* Show Receipt Button if has image */}
                          {booking.payment.receiptImageUrl && (
                            <div className="col-span-full mt-1 sm:mt-2">
                              <button
                                onClick={() => setReceiptModal(getImageUrl(booking.payment.receiptImageUrl))}
                                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-400/10 text-sky-400 border border-sky-400/20 hover:bg-sky-400/20 transition-all text-xs sm:text-sm font-medium"
                              >
                                <ImageIcon size={14} className="shrink-0" /> 
                                <span className="truncate">View Payment Receipt</span>
                              </button>
                            </div>
                          )}

                          {booking.payment.transactionId && (
                            <div className="col-span-full mt-1 sm:mt-2">
                              <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs">Transaction ID</p>
                              <p className="text-[#cee5ff] font-mono text-[10px] sm:text-xs break-all">{booking.payment.transactionId}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-xl p-3 sm:p-4">
                        <p className="text-yellow-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center gap-1.5">
                          <MessageSquare size={12} /> Special Requests
                        </p>
                        <p className="text-[#cee5ff]/80 text-xs sm:text-sm leading-relaxed break-words">"{booking.specialRequests}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Receipt Image Modal */}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Booking"
        text={`Are you sure you want to delete booking for "${confirmModal.bookingTitle}"? This action cannot be undone.`}
        onConfirm={handleDeleteBooking}
        onCancel={() => setConfirmModal({ isOpen: false, bookingId: null, bookingTitle: "" })}
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
};

export default BookingsManagement;