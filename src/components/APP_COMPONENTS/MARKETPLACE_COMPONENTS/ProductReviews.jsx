import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, X, MessageSquare, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "../../../api/apiClient";

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  const baseUrl = import.meta.env.VITE_API_URL || "https://hook.runasp.net";
  return `${baseUrl}${url}`;
};

const ReviewModal = ({ isOpen, onClose, productId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setComment("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please write a comment");

    setIsSubmitting(true);
    try {
      // Fetch the user's purchase history to find the real order ID
      const ordersResponse = await apiClient.get("/api/marketplace/orders/admin-user/my-purchases");
      const userOrders = ordersResponse.data || [];

      // Find an eligible order: Status must be 3 (Delivered) AND contain the productId
      const eligibleOrder = userOrders.find(order => 
        order.status === 3 && 
        order.items?.some(item => item.productId === productId || item.id === productId)
      );

      if (!eligibleOrder) {
        toast.error("You must purchase and receive this product before you can review it.");
        setIsSubmitting(false);
        return;
      }

      // Submit the review with the verified orderId
      await apiClient.post("/api/marketplace/reviews/admin-user/create", {
        orderId: eligibleOrder.id, 
        productId: productId,
        rating: rating,
        comment: comment.trim()
      });

      toast.success("Review submitted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      
       const errorDesc = error.response?.data?.description;
      const errorMsg = error.response?.data?.message;
      
      toast.error(errorDesc || errorMsg || "Failed to submit review");
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#001526]/50">
              <h3 className="text-lg font-black text-[#cee5ff]">Write a Review</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#a3cbf2]/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#a3cbf2]/60 uppercase tracking-widest mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      type="button"
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-transparent text-white/20 hover:text-amber-400/50"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#a3cbf2]/60 uppercase tracking-widest mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full bg-[#001526] border border-white/10 rounded-xl p-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 resize-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-[#a3cbf2] font-bold tracking-widest text-xs uppercase hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-sky-400 text-[#001526] font-bold tracking-widest text-xs uppercase hover:bg-sky-300 transition-colors disabled:opacity-80 disabled:cursor-not-allowed shadow-md shadow-sky-400/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-[#001526]/30 border-t-[#001526] rounded-full"
                    />
                  )}
                  {isSubmitting ? "Submitting..." : "Post Review"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProductReviews = ({ productId, initialReviews = [], averageRating, reviewsCount }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [hasFetched, setHasFetched] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/api/marketplace/reviews/allroles/${productId}`);
      setReviews(response.data || []);
      setHasFetched(true); 
    } catch (error) {
      console.error("Failed to refresh reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched && initialReviews.length > 0) {
      setReviews(initialReviews);
    } else if (!hasFetched && productId && initialReviews.length === 0) {
      fetchReviews();
    }
  }, [productId, initialReviews, hasFetched]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mt-10 lg:mt-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#cee5ff] flex items-center gap-2.5">
            <MessageSquare className="text-sky-400" size={24} />
            Customer Reviews
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(averageRating || 0) ? "fill-amber-400 text-amber-400" : "fill-transparent text-white/20"}
                />
              ))}
            </div>
            <span className="text-[#a3cbf2]/80 text-xs font-medium">
              {averageRating?.toFixed(1) || "0.0"} out of 5 ({hasFetched ? reviews.length : (reviewsCount || 0)} reviews)
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-400/10 border border-sky-400/30 text-sky-400 rounded-xl font-bold tracking-widest text-xs uppercase hover:bg-sky-400/20 transition-all"
        >
          <Plus size={16} /> Write Review
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#002238] border border-white/5 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-[#001526] rounded-full" />
                <div className="flex-1">
                  <div className="w-24 h-3 bg-[#001526] rounded mb-2" />
                  <div className="w-16 h-2 bg-[#001526] rounded" />
                </div>
              </div>
              <div className="w-full h-12 bg-[#001526] rounded" />
            </div>
          ))
        ) : reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 rounded-2xl bg-[#002238] border border-white/5 hover:border-white/10 transition-colors shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#001526] border border-white/10 flex items-center justify-center shrink-0">
                    {review.buyerImageUrl ? (
                      <img
                        src={getImageUrl(review.buyerImageUrl)}
                        alt={review.buyerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={18} className="text-[#a3cbf2]/40" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#cee5ff]">{review.buyerName}</h4>
                    <p className="text-[10px] text-[#a3cbf2]/50 mt-0.5">{formatDate(review.createdOn)}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-white/10"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[#a3cbf2]/80 text-xs leading-relaxed">
                "{review.comment}"
              </p>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-[#002238] border border-dashed border-white/10 rounded-2xl">
            <MessageSquare size={40} className="mx-auto text-white/10 mb-3" />
            <p className="text-[#cee5ff] font-bold text-base mb-1">No reviews yet</p>
            <p className="text-[#a3cbf2]/60 text-xs">Be the first to share your experience with this product!</p>
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        onSuccess={fetchReviews}
      />
    </div>
  );
};

export default ProductReviews;