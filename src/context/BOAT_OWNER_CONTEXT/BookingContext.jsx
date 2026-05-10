import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as bookingService from "../../services/BoatOwnerService.jsx/bookings.service";
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';

const BookingContext = createContext();

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: null,
    location: '',
    date: null
  });
  
  // Role check
  const userRoles = Array.isArray(user?.role) 
    ? user.role.map(r => r?.toLowerCase()) 
    : [user?.role?.toLowerCase()];
  const isBoatOwner = userRoles.includes("boatowner") || userRoles.includes("admin");
  
  // Status mapping helper (Booking Status)
  const getStatusText = (statusCode) => {
    const statusMap = {
      1: "Pending",
      2: "Confirmed",
      3: "Cancelled",
      4: "Rejected",
      5: "Completed",
      6: "Cancel Request"
    };
    return statusMap[statusCode] || "Unknown";
  };
  
  const getStatusStyle = (statusCode) => {
    const styleMap = {
      1: "bg-yellow-400/10 text-yellow-400", // Pending
      2: "bg-sky-400/10 text-sky-400",       // Confirmed
      3: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",// Cancelled
      4: "bg-red-400/10 text-red-400",       // Rejected
      5: "bg-teal-400/10 text-teal-400",      // Completed
      6: "bg-purple-400/10 text-purple-400"      // Cancel Request
    };
    return styleMap[statusCode] || "bg-white/10 text-white/50";
  };
  
  const fetchBookings = useCallback(async () => {
    if (!isBoatOwner) {
      setLoading(false);
      setBookings([]);
      return;
    }
    
    setLoading(true);
    try {
      const data = await bookingService.getBoatOwnerBookings(filters);
      setBookings(data || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [isBoatOwner, filters]);
  
  const fetchStats = useCallback(async () => {
    if (!isBoatOwner) return;
    
    try {
      const data = await bookingService.getBookingStats();
      setStats(data);
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  }, [isBoatOwner]);
  
  const updateStatus = useCallback(async (id, statusCode) => {
    if (!isBoatOwner) {
      toast.error("Only Boat Owners can update booking status");
      return;
    }
    
    try {
      const updatedBooking = await bookingService.updateBookingStatus(id, statusCode);
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status: statusCode } : booking
      ));
      
      // Refresh stats
      await fetchStats();
      
      toast.success(`Booking ${getStatusText(statusCode).toLowerCase()} successfully`);
      return updatedBooking;
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(err.response?.data?.message || "Failed to update booking status");
      throw err;
    }
  }, [isBoatOwner, fetchStats]);

  // Handle Payment Refund
  const refundPayment = useCallback(async (bookingId, paymentId) => {
    if (!isBoatOwner) return;

    try {
      await bookingService.refundPayment(paymentId);
      
      // Update the local state: Change payment status to 4 (Refunded)
      setBookings(prev => prev.map(booking => {
        if (booking.id === bookingId && booking.payment?.id === paymentId) {
          return {
            ...booking,
            payment: { ...booking.payment, status: 4 }
          };
        }
        return booking;
      }));

      toast.success("Payment refunded successfully");
    } catch (err) {
      console.error("Refund error:", err);
      toast.error(err.response?.data?.message || "Failed to refund payment");
      throw err;
    }
  }, [isBoatOwner]);

  // Handle Payment Verification (InstaPay)
  const verifyPayment = useCallback(async (bookingId, paymentId, isApproved, notes = "") => {
    if (!isBoatOwner) return;

    try {
      await bookingService.verifyPayment(paymentId, isApproved, notes);

      // Update local state: Change payment status to 2 (Completed) or 5 (Rejected)
      const newPaymentStatus = isApproved ? 2 : 5;
      
      setBookings(prev => prev.map(booking => {
        if (booking.id === bookingId && booking.payment?.id === paymentId) {
          return {
            ...booking,
            // FIX: If payment is approved, automatically update the booking status to 2 (Confirmed)
            status: isApproved ? 2 : booking.status,
            payment: { ...booking.payment, status: newPaymentStatus }
          };
        }
        return booking;
      }));

      // Refresh stats to immediately show the new Confirmed revenue/booking count
      fetchStats();

      toast.success(`Payment ${isApproved ? 'approved' : 'rejected'} successfully`);
    } catch (err) {
      console.error("Verify payment error:", err);
      toast.error(err.response?.data?.message || "Failed to verify payment");
      throw err;
    }
  }, [isBoatOwner, fetchStats]);
  
  // Update filters and refetch
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  // Derived data for display
  const allTrips = React.useMemo(() => {
    const tripSet = new Set(bookings.map(b => b.tripTitle));
    return ["All Trips", ...Array.from(tripSet)];
  }, [bookings]);
  
  const allStatuses = React.useMemo(() => {
    return ["All Statuses", "Pending", "Confirmed", "Cancelled", "Rejected", "Completed"];
  }, []);
  
  // Filtered bookings based on UI filters
  const [uiTripFilter, setUiTripFilter] = useState("All Trips");
  const [uiStatusFilter, setUiStatusFilter] = useState("All Statuses");
  
  const filteredBookings = React.useMemo(() => {
    let filtered = bookings;
    
    if (uiTripFilter !== "All Trips") {
      filtered = filtered.filter(b => b.tripTitle === uiTripFilter);
    }
    
    if (uiStatusFilter !== "All Statuses") {
      const statusCodeMap = {
        "Pending": 1,
        "Confirmed": 2,
        "Cancelled": 3,
        "Rejected": 4,
        "Completed": 5
      };
      const statusCode = statusCodeMap[uiStatusFilter];
      if (statusCode) {
        filtered = filtered.filter(b => b.status === statusCode);
      }
    }
    
    return filtered;
  }, [bookings, uiTripFilter, uiStatusFilter]);
  
  // Initial load
  useEffect(() => {
    if (!authLoading && isBoatOwner) {
      fetchBookings();
      fetchStats();
    }
  }, [authLoading, isBoatOwner, fetchBookings, fetchStats]);
  
  const value = React.useMemo(() => ({
    bookings: filteredBookings,
    allBookings: bookings,
    loading: loading || authLoading,
    stats,
    filters,
    updateFilters,
    fetchBookings,
    fetchStats,
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
    isBoatOwner
  }), [
    filteredBookings, bookings, loading, authLoading, stats, filters,
    updateFilters, fetchBookings, fetchStats, updateStatus, refundPayment, verifyPayment,
    uiTripFilter, uiStatusFilter, allTrips, allStatuses, isBoatOwner
  ]);
  
  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};