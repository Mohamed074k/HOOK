// src/pages/USER_PAGES/components/TripsTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Ship, Calendar, Users, Star, Anchor, ArrowRight, X, Trash2, Pencil } from "lucide-react";
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
    1: "bg-amber-400/10 text-amber-300 border-amber-400/20",    
    2: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20", 
    3: "bg-slate-400/10 text-slate-300 border-slate-400/20",   
    4: "bg-rose-400/10 text-rose-300 border-rose-400/20",      
    5: "bg-sky-400/10 text-sky-300 border-sky-400/20",           
  };
  
  const text = { 
    1: "Pending", 
    2: "Confirmed", 
    3: "Cancelled", 
    4: "Rejected", 
    5: "Completed" 
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-sm bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-[#cee5ff] mb-2">{title}</h3>
          <p className="text-sm text-[#a3cbf2]/70 mb-6">{text}</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] text-[#a3cbf2] hover:bg-white/[0.08] transition-colors">Cancel</button>
            <button onClick={onConfirm} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${isDanger ? 'bg-rose-400/15 text-rose-300 hover:bg-rose-400/25 border border-rose-400/30' : 'bg-sky-400 text-[#001526] hover:bg-sky-300'}`}>
              {confirmText}
            </button>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#cee5ff]">{existingReview ? "Edit Review" : "Write Review"}</h3>
              <button onClick={onClose} className="text-[#a3cbf2]/40 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#a3cbf2]/60 mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="focus:outline-none hover:scale-110 transition-transform">
                      <Star size={32} className={star <= rating ? "text-amber-400 fill-amber-400" : "text-white/10 fill-white/5"} />
                    </button>
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
                <button onClick={handleDelete} disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-rose-400/10 text-rose-400 hover:bg-rose-400/20 transition-colors">
                  <Trash2 size={18} />
                </button>
              )}
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-sky-400 text-[#001526] hover:bg-sky-300 disabled:opacity-50 transition-colors">
                {isSubmitting ? "Saving..." : "Save Review"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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

    // Make the page always open at the top
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

  const confirmCancel = async () => {
    if(!cancelTarget) return;
    try {
      await apiClient.delete(`/api/Bookings/user/cancel/${cancelTarget}`);
      setBookings(prev => prev.map(b => b.id === cancelTarget ? { ...b, status: 0 } : b));
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
    } finally {
      setCancelTarget(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'upcoming') return b.status === 1 || b.status === 2;
    if (filter === 'past') return b.status === 0 || b.status === 5;
    return true;
  });

  const listVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } }};
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }};

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#cee5ff]">My Trips</h2>
          <p className="text-sm text-[#a3cbf2]/60 mt-1">View and manage your current and past voyages.</p>
        </div>
        <div className="flex bg-[#002238] border border-white/5 rounded-lg p-1 w-fit shadow-lg">
          {['all', 'upcoming', 'past'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === f ? 'bg-sky-400/20 text-sky-400 shadow-sm' : 'text-[#a3cbf2]/60 hover:text-[#cee5ff]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-72 bg-[#002238] rounded-2xl border border-white/5 animate-pulse"></div>)}
        </div>
      ) : (
        <motion.div variants={listVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.length === 0 ? (
            <motion.div variants={itemVariants} className="col-span-full bg-[#002238] border border-dashed border-white/10 rounded-2xl py-16 text-center shadow-lg">
              <Anchor size={48} className="mx-auto text-white/10 mb-4 hover:scale-110 transition-transform duration-500 hover:rotate-12" />
              <p className="text-[#cee5ff] font-semibold text-lg">No trips found</p>
              <p className="text-[#a3cbf2]/60 text-sm mt-1">Ready for a new adventure?</p>
              <Link to="/trips" className="inline-flex items-center gap-2 mt-4 text-sky-400 text-sm hover:underline group">
                Explore Trips <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ) : (
            filteredBookings.map((booking) => (
              <motion.div variants={itemVariants} key={booking.id} className="bg-[#002238] border border-white/5 rounded-2xl flex flex-col overflow-hidden hover:border-sky-400/30 transition-all hover:shadow-xl hover:shadow-sky-400/5 group">
                {/* Image Section - No padding, full width/top */}
                <div className="w-full h-48 bg-[#001526] relative shrink-0 border-b border-white/5">
                  <div className="absolute inset-0 bg-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay pointer-events-none" />
                  {booking.mainImageUrl ? (
                     <img src={getImageUrl(booking.mainImageUrl)} alt={booking.tripTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center">
                       <Ship size={40} className="text-sky-400/30" />
                     </div>
                  )}
                </div>
                
                {/* Content Section - Padding applied here */}
                <div className="flex-1 flex flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-bold text-[#cee5ff] group-hover:text-sky-300 transition-colors line-clamp-1" title={booking.tripTitle}>
                        {booking.tripTitle}
                      </h3>
                      <StatusPill status={booking.status} />
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
                      <span className="flex items-center gap-2 font-semibold text-sky-400 mt-1">
                        <span className="bg-sky-400/10 px-2 py-0.5 rounded-md border border-sky-400/20">
                          ${booking.totalPrice}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-white/5 mt-auto">
                    {(booking.status === 1 || booking.status === 2) && (
                      <button onClick={() => setCancelTarget(booking.id)} className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-rose-400 bg-rose-400/5 border border-transparent hover:border-rose-400/30 hover:bg-rose-400/10 transition-all">
                        Cancel Trip
                      </button>
                    )}

                    {booking.status === 5 && !userReviewsData[booking.id] && (
                      <button onClick={() => setReviewTarget({ open: true, booking, existing: null })} className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 border border-sky-400/20 transition-all flex items-center justify-center gap-1.5">
                        <Star size={14} className="fill-transparent group-hover:fill-sky-400/30 transition-colors" /> Write Review
                      </button>
                    )}
                    
                    {booking.status === 5 && userReviewsData[booking.id] && (
                      <button onClick={() => setReviewTarget({ open: true, booking, existing: userReviewsData[booking.id] })} className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20 transition-all flex items-center justify-center gap-1.5">
                        <Pencil size={14} /> Edit Review
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      <ConfirmModal 
        isOpen={!!cancelTarget} 
        title="Cancel Trip" 
        text="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
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