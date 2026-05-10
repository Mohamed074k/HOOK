// src/pages/USER_PAGES/components/TripsTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Ship, Calendar, Users, Star, Anchor, ArrowRight, X, Trash2, Pencil, Filter, Waves, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

const StatusPill = ({ status }) => {
  const styles = {
    1: "bg-amber-400/10 text-amber-300 border-amber-400/20",    // Pending
    2: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20", // Confirmed
    3: "bg-slate-400/10 text-slate-300 border-slate-400/20",     // Cancelled
    4: "bg-rose-400/10 text-rose-300 border-rose-400/20",        // Rejected
    5: "bg-sky-400/10 text-sky-300 border-sky-400/20",           // Completed
    6: "bg-orange-400/10 text-orange-300 border-orange-400/20",  // CancellationRequested
  };
  
  const text = { 
    1: "Pending", 
    2: "Confirmed", 
    3: "Cancelled", 
    4: "Rejected", 
    5: "Completed",
    6: "Cancel Requested"
  };
  
  const defaultStyle = "bg-gray-400/10 text-gray-300 border-gray-400/20";
  
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles[status] || defaultStyle}`}>
      {text[status] || "Unknown"}
    </span>
  );
};

 
  
 
  
 
 
 

// Custom Confirm Modal
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

// Review Manage Modal
const ReviewModal = ({ isOpen, booking, existingReview, onClose, onSuccess }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(existingReview?.rating || 0);
      setComment(existingReview?.comment || "");
    }
  }, [isOpen, existingReview]);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please write a comment");
    
    setIsSubmitting(true);
    try {
      if (existingReview) {
        await apiClient.put(`/api/Reviews/user/update/${existingReview.id}`, { rating, comment: comment.trim() });
        toast.success("Review updated!");
      } else {
        await apiClient.post("/api/Reviews/user/create", { bookingId: booking.id, rating, comment: comment.trim() });
        toast.success("Review submitted!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.description || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.delete(`/api/Reviews/user/delete/${existingReview.id}`);
      toast.success("Review deleted");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#cee5ff]">{existingReview ? "Edit Review" : "Write Review"}</h3>
              <motion.button 
                onClick={onClose} 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-[#a3cbf2]/40 hover:text-white"
              >
                <X size={20} />
              </motion.button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#a3cbf2]/60 mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button 
                      key={star} 
                      onClick={() => setRating(star)} 
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="focus:outline-none"
                    >
                      <Star size={32} className={star <= rating ? "text-amber-400 fill-amber-400" : "text-white/10 fill-white/5"} />
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-[#a3cbf2]/60 mb-2 block">Comment</label>
                <textarea 
                  value={comment} onChange={(e) => setComment(e.target.value)} rows={4}
                  className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              {existingReview && (
                <motion.button 
                  onClick={handleDelete} 
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-xl bg-rose-400/10 text-rose-400 hover:bg-rose-400/20 transition-colors"
                >
                  <Trash2 size={18} />
                </motion.button>
              )}
              <motion.button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-sky-400 text-[#001526] hover:bg-sky-300 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Saving..." : "Save Review"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Animated Filter Button Component
const AnimatedFilterButton = ({ label, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
        isActive ? 'text-sky-400' : 'text-[#a3cbf2]/60 hover:text-[#cee5ff]'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {isActive && (
        <motion.div
          layoutId="activeFilter"
          className="absolute inset-0 bg-sky-400/20 rounded-md"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
};

// Animated Empty State Component
const AnimatedEmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="col-span-full bg-gradient-to-br from-[#002238] to-[#001a30] border border-dashed border-white/10 rounded-2xl py-16 text-center shadow-xl relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-sky-400/20"
            animate={{
              y: [0, -100, 0],
              x: [0, (Math.random() - 0.5) * 50, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative mb-6">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Anchor size={64} className="mx-auto text-sky-400/30" />
        </motion.div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-[#cee5ff] font-semibold text-xl mb-2"
      >
        No trips found
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-[#a3cbf2]/60 text-sm"
      >
        Ready for a new adventure?
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Link to="/trips">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 rounded-xl bg-sky-400/10 text-sky-400 text-sm font-semibold hover:bg-sky-400/20 transition-all border border-sky-400/20 group"
          >
            <span>Explore Trips</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

const TripsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReviewsData, setUserReviewsData] = useState({});
  const [filter, setFilter] = useState('all');

  // Modals state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState({ open: false, booking: null, existing: null });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const { data: bookingsData } = await apiClient.get("/api/Bookings/user/my-bookings");
      setBookings(bookingsData);
      
      const response = await apiClient.get("/api/Reviews/allroles/my-reviews/GetAll");
      const reviewsMap = {};
      response.data.forEach(review => { reviewsMap[review.bookingId] = review; });
      setUserReviewsData(reviewsMap);
    } catch (error) {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Handle cancel
  const confirmCancel = async () => {
    if (!cancelTarget) return;
    
    const booking = bookings.find(b => b.id === cancelTarget);
    
    try {
      await apiClient.delete(`/api/Bookings/user/cancel/${cancelTarget}`);
      
      if (booking?.payment?.method === 1) {
        // Cash on Arrival: direct cancel, status becomes 3
        setBookings(prev => prev.map(b => b.id === cancelTarget ? { ...b, status: 3 } : b));
        toast.success("Booking cancelled successfully");
      } else if (booking?.payment?.method === 2) {
        // InstaPay: cancellation request, status becomes 6
        setBookings(prev => prev.map(b => b.id === cancelTarget ? { ...b, status: 6 } : b));
        toast.success("Cancellation request submitted. Waiting for owner approval.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelTarget(null);
    }
  };

  // Determine if booking can be cancelled and what text to show
  const getCancelInfo = (booking) => {
    // Already cancelled (status 3) or cancellation requested (status 6) - hide cancel button
    if (booking.status === 3 || booking.status === 6) {
      return null;
    }
    
    // Already rejected (status 4) or completed (status 5) - hide cancel button
    if (booking.status === 4 || booking.status === 5) {
      return null;
    }
    
    // Cash on Arrival (method 1) - can cancel regardless of booking status or payment status
    if (booking.payment?.method === 1) {
      return {
        text: "Cancel Trip",
        confirmTitle: "Cancel Trip",
        confirmText: "Are you sure you want to cancel this booking? This action cannot be undone.",
        confirmButtonText: "Yes, Cancel"
      };
    }
    
    // InstaPay (method 2) - booking status 2 AND payment status 2
    if (booking.payment?.method === 2 && booking.status === 2 && booking.payment?.status === 2) {
      return {
        text: "Request Cancellation",
        confirmTitle: "Request Cancellation",
        confirmText: "This booking was paid via InstaPay. A cancellation request will be sent to the boat owner for approval. The refund will be processed upon owner's acceptance.",
        confirmButtonText: "Send Request"
      };
    }
    
    // InstaPay (method 2) - payment pending or booking not confirmed - cannot cancel
    return null;
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'upcoming') return b.status === 1 || b.status === 2 || b.status === 6;
    if (filter === 'past') return b.status === 3 || b.status === 4 || b.status === 5;
    return true;
  });

  const listVariants = { 
    hidden: { opacity: 0 }, 
    show: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = { 
    hidden: { opacity: 0, y: 30 }, 
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#cee5ff]">My Trips</h2>
          <p className="text-sm text-[#a3cbf2]/60 mt-1">View and manage your current and past voyages.</p>
        </div>
        
        <motion.div 
          className="flex bg-[#002238] border border-white/5 rounded-lg p-1 w-fit shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-sky-400/5 to-sky-400/0"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {['all', 'upcoming', 'past'].map(f => (
            <AnimatedFilterButton
              key={f}
              label={f}
              isActive={filter === f}
              onClick={() => setFilter(f)}
            />
          ))}
        </motion.div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i} 
              className="h-72 bg-[#002238] rounded-2xl border border-white/5"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredBookings.length === 0 ? (
              <AnimatedEmptyState />
            ) : (
              <motion.div 
                variants={listVariants} 
                initial="hidden" 
                animate="show" 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredBookings.map((booking) => {
                  const cancelInfo = getCancelInfo(booking);
                  
                  return (
                    <motion.div 
                      variants={itemVariants} 
                      key={booking.id} 
                      className="bg-[#002238] border border-white/5 rounded-2xl flex flex-col overflow-hidden hover:border-sky-400/30 transition-all hover:shadow-xl hover:shadow-sky-400/5 group"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Image Section */}
                      <div className="w-full h-48 bg-[#001526] relative shrink-0 border-b border-white/5 overflow-hidden">
                        <div className="absolute inset-0 bg-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay pointer-events-none" />
                        {booking.mainImageUrl ? (
                          <motion.img 
                            src={getImageUrl(booking.mainImageUrl)} 
                            alt={booking.tripTitle} 
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Ship size={40} className="text-sky-400/30" />
                          </div>
                        )}
                      </div>
                      
{/* Content Section */}
<div className="flex-1 flex flex-col justify-between p-5">
  <div>
    <div className="flex items-start justify-between gap-2 mb-3">
      <h3 className="text-lg font-bold text-[#cee5ff] group-hover:text-sky-300 transition-colors line-clamp-1" title={booking.tripTitle}>
        {booking.tripTitle}
      </h3>
    </div>
    
    <div className="flex flex-col gap-2 text-sm text-[#a3cbf2]/70 mb-4">
      <span className="flex items-center gap-2">
        <Calendar size={14} className="text-sky-400/50 shrink-0" /> 
        {new Date(booking.startDate).toLocaleDateString()}
      </span>
      <span className="flex items-center gap-2">
        <Users size={14} className="text-sky-400/50 shrink-0" /> 
        {booking.numberOfParticipants} Guests
      </span>
      
      {/* Price and Status Pill in same row */}
      <div className="flex items-center justify-between mt-1">
        <span className="flex items-center gap-2 font-semibold text-sky-400">
          <span className="bg-sky-400/10 px-2 py-0.5 rounded-md border border-sky-400/20">
            ${booking.totalPrice}
          </span>
        </span>
        <StatusPill status={booking.status} />
      </div>
    </div>
  </div>

  <div className="flex flex-col gap-3 pt-4 border-t border-white/5 mt-auto">
    
    {/* Cancel button for eligible bookings */}
    {cancelInfo && (
      <motion.button 
        onClick={() => setCancelTarget(booking.id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-rose-400 bg-rose-400/5 border border-transparent hover:border-rose-400/30 hover:bg-rose-400/10 transition-all"
      >
        {cancelInfo.text}
      </motion.button>
    )}

    {/* Info: InstaPay payment pending - cannot cancel */}
    {booking.payment?.method === 2 && booking.payment?.status === 1 && booking.status === 2 && (
      <p className="text-[10px] text-amber-400/60 text-center">
        Payment pending — cancellation available after approval
      </p>
    )}

    {/* Info: Cancellation requested */}
    {booking.status === 6 && (
      <p className="text-xs text-orange-400/60 text-center">
        Cancellation request pending owner approval
      </p>
    )}

    {/* Cancelled status */}
    {booking.status === 3 && (
      <p className="text-xs text-slate-400/40 text-center">
        This booking has been cancelled
      </p>
    )}

    {/* Review for completed bookings */}
    {booking.status === 5 && !userReviewsData[booking.id] && (
      <motion.button 
        onClick={() => setReviewTarget({ open: true, booking, existing: null })}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 border border-sky-400/20 transition-all flex items-center justify-center gap-1.5 group"
      >
        <Star size={14} className="group-hover:fill-sky-400/30 transition-colors" /> Write Review
      </motion.button>
    )}
    
    {booking.status === 5 && userReviewsData[booking.id] && (
      <motion.button 
        onClick={() => setReviewTarget({ open: true, booking, existing: userReviewsData[booking.id] })}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20 transition-all flex items-center justify-center gap-1.5"
      >
        <Pencil size={14} /> Edit Review
      </motion.button>
    )}
  </div>
</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Single Cancel Modal */}
      <ConfirmModal 
        isOpen={!!cancelTarget} 
        title={cancelTarget ? (getCancelInfo(bookings.find(b => b.id === cancelTarget))?.confirmTitle || "Cancel Trip") : "Cancel Trip"}
        text={cancelTarget ? (getCancelInfo(bookings.find(b => b.id === cancelTarget))?.confirmText || "Are you sure?") : ""}
        confirmText={cancelTarget ? (getCancelInfo(bookings.find(b => b.id === cancelTarget))?.confirmButtonText || "Confirm") : "Confirm"}
        isDanger={true}
        onConfirm={confirmCancel} 
        onCancel={() => setCancelTarget(null)} 
      />

      <ReviewModal 
        isOpen={reviewTarget.open} 
        booking={reviewTarget.booking} 
        existingReview={reviewTarget.existing} 
        onClose={() => setReviewTarget({ open: false, booking: null, existing: null })} 
        onSuccess={fetchBookings}
      />
    </div>
  );
};

export default TripsTab;