// src/components/ReviewModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Ship, ChevronRight } from "lucide-react";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";

// Helper function to get image URL
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

const ReviewModal = ({ open, booking, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        bookingId: booking.id,
        rating: rating,
        comment: comment.trim()
      };

      const response = await apiClient.post("/api/Reviews/user/create", requestData);
      
      toast.success("Review submitted successfully! Thank you for your feedback.");
      onReviewSubmitted?.(response.data);
      onClose();
      
      // Reset form
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      
      // Handle specific error cases
      if (error.response?.data?.code === "Review.AlreadyReviewed") {
        toast.error("You have already reviewed this trip. You can only review each booking once.", {
          duration: 5000,
          icon: '⚠️'
        });
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.description || error.response?.data?.message || "Invalid review data";
        toast.error(message);
      } else if (error.response?.status === 401) {
        toast.error("Please login to submit a review");
      } else if (error.response?.status === 404) {
        toast.error("Booking not found. You can only review trips you've booked.");
      } else {
        toast.error("Failed to submit review. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <AnimatePresence>
      {open && booking && (
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-[#cee5ff]">Write a Review</h3>
              <button onClick={onClose} className="text-[#a3cbf2]/40 hover:text-[#cee5ff] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Booking Info */}
            <div className="mb-5 p-3 rounded-xl bg-[#001526] border border-white/5">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-lg bg-sky-400/10 border border-sky-400/20 flex items-center justify-center overflow-hidden shrink-0">
                  {booking.mainImageUrl ? (
                    <img 
                      src={getImageUrl(booking.mainImageUrl)} 
                      alt={booking.tripTitle} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<svg class="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>';
                      }}
                    />
                  ) : (
                    <Ship size={20} className="text-sky-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#cee5ff] truncate">{booking.tripTitle}</h4>
                  <p className="text-xs text-[#a3cbf2]/60 mt-0.5">
                    {formatDate(booking.startDate)}
                  </p>
                  <p className="text-xs text-[#a3cbf2]/60">
                    {booking.numberOfParticipants} guests • ${booking.totalPrice}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Rating Stars */}
              <div>
                <label className="text-sm text-[#a3cbf2]/60 mb-2 block">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`transition-all ${
                          star <= (hoveredRating || rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-white/20 fill-none hover:text-white/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="text-sm text-[#a3cbf2]/60 mb-2 block">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience with this trip..."
                  className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.04] border border-white/5 text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-500 to-cyan-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Review
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;