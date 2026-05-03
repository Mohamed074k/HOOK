// src/components/ReviewManagement.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Pencil, Trash2, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const ReviewManagement = ({ review, booking, onReviewUpdated, onReviewDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleUpdate = async () => {
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
      const response = await apiClient.put(`/api/Reviews/user/update/${review.id}`, {
        rating: rating,
        comment: comment.trim()
      });
      
      toast.success("Review updated successfully!");
      onReviewUpdated?.(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error.response?.data?.description || "Failed to update review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.delete(`/api/Reviews/user/delete/${review.id}`);
      toast.success("Review deleted successfully!");
      onReviewDeleted?.(review.id);
      setShowDeleteConfirm(false);
      setIsExpanded(false);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.description || "Failed to delete review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
    return `${baseUrl}${url}`;
  };

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      {/* Header with trip info and expand button */}
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-[#001526]/50 p-2 rounded-lg transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-sky-400/10 border border-sky-400/20 flex items-center justify-center overflow-hidden shrink-0">
            {booking?.mainImageUrl ? (
              <img 
                src={getImageUrl(booking.mainImageUrl)} 
                alt={booking.tripTitle} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-sky-400/20" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-[#cee5ff] text-sm truncate">{booking?.tripTitle}</h4>
            <p className="text-xs text-[#a3cbf2]/60">
              {formatDate(booking?.startDate)} • {booking?.numberOfParticipants} guests
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={star <= (review?.rating || 0) ? "text-amber-400 fill-amber-400" : "text-white/20"}
                />
              ))}
            </div>
          )}
          {isExpanded ? <ChevronUp size={16} className="text-[#a3cbf2]/40" /> : <ChevronDown size={16} className="text-[#a3cbf2]/40" />}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-[#001526] rounded-xl mt-2">
              {isEditing ? (
                // Edit mode
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#a3cbf2]/60 mb-1 block">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={24}
                            className={star <= rating ? "text-amber-400 fill-amber-400" : "text-white/20"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-[#a3cbf2]/60 mb-1 block">Your Review</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="w-full bg-[#002238] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      disabled={isSubmitting}
                      className="flex-1 py-2 rounded-lg bg-sky-400 text-[#001526] text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-lg border border-white/10 text-[#a3cbf2] text-sm hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div>
                  <p className="text-sm text-[#a3cbf2]/80 leading-relaxed">{review?.comment}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                    <span className="text-xs text-[#a3cbf2]/40">
                      Posted on {formatDate(review?.createdOn)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded-lg hover:bg-sky-400/10 text-sky-400 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-1.5 rounded-lg hover:bg-rose-400/10 text-rose-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#002238] border border-white/10 rounded-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-400/10 flex items-center justify-center">
                  <Trash2 size={18} className="text-rose-400" />
                </div>
                <h3 className="text-lg font-bold text-[#cee5ff]">Delete Review</h3>
              </div>
              <p className="text-sm text-[#a3cbf2]/70 mb-5">
                Are you sure you want to delete your review? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] border border-white/5 text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold bg-rose-400/15 border border-rose-400/30 text-rose-300 hover:bg-rose-400/25 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewManagement;