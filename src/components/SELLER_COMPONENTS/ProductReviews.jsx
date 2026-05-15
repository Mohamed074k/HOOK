import { useState, useEffect } from "react";
import { ArrowLeft, Star, Loader2, MessageSquare } from "lucide-react";
import apiClient from "../../api/apiClient";
import { toast } from "react-hot-toast";
import { useProducts } from "../../context/SELLER_CONTEXT/ProductContext";

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

const ProductReviews = ({ product, onBack, animate }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const { getImageUrl: contextGetImageUrl } = useProducts();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setShowAnimation(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Using the API endpoint: /api/marketplace/products/allroles/{id}
        const { data } = await apiClient.get(`/api/marketplace/products/allroles/${product.id}`);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    if (product?.id) {
      fetchReviews();
    }
  }, [product.id]);

  // Calculate ratings
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";

  // Calculate percentage for each star (5, 4, 3, 2, 1)
  const barDataPercentages = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading reviews for {product.title}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className={`transform transition-all duration-700 ease-out ${
        showAnimation ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#a3cbf2] hover:text-white hover:border-white/10 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Product Reviews</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">{product.title}</p>
          </div>
        </div>
      </div>

      {/* Rating Summary */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
        style={{
          opacity: showAnimation ? 1 : 0,
          transform: showAnimation ? "translateY(0)" : "translateY(30px)",
          transitionDelay: "100ms",
        }}
      >
        <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
          {/* Score */}
          <div className="text-center shrink-0 min-w-[100px]">
            <p className="text-6xl font-black text-[#cee5ff]">{avgRating}</p>
            <p className="text-amber-400 text-2xl mt-1 tracking-widest">
              {"★".repeat(Math.round(Number(avgRating)))}
              {"☆".repeat(5 - Math.round(Number(avgRating)))}
            </p>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">{totalReviews} reviews</p>
          </div>

          {/* Bar chart */}
          <div className="flex-1 w-full space-y-2.5">
            {[5, 4, 3, 2, 1].map((star, idx) => {
              const pct = barDataPercentages[idx];
              return (
                <div key={star} className="flex items-center gap-3 text-sm group">
                  <span className="text-[#a3cbf2]/40 w-8 text-right text-xs">{star}★</span>
                  <div className="flex-1 h-2 bg-[#001526] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: showAnimation ? `${pct}%` : "0%",
                        transitionDelay: "300ms"
                      }}
                    />
                  </div>
                  <span className="text-[#a3cbf2]/40 w-8 text-xs">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-12 text-center transform transition-all duration-700 ease-out"
               style={{ opacity: showAnimation ? 1 : 0, transform: showAnimation ? "translateY(0)" : "translateY(30px)" }}>
            <MessageSquare size={32} className="text-[#a3cbf2]/20 mx-auto mb-3" />
            <p className="text-[#a3cbf2]/40 text-sm">No reviews yet for this product.</p>
          </div>
        ) : (
          reviews.map((review, idx) => (
            <div
              key={review.id}
              className="group bg-[#002238] border border-white/5 rounded-2xl p-6 hover:border-amber-400/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-400/5 ring-1 ring-transparent hover:ring-amber-400/10 transform transition-all duration-700 ease-out"
              style={{
                opacity: showAnimation ? 1 : 0,
                transform: showAnimation ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${(idx + 2) * 100}ms`,
              }}
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex items-center gap-3">
                  {review.buyerImageUrl ? (
                    <img 
                      src={getImageUrl(review.buyerImageUrl)} 
                      alt={review.buyerName} 
                      className="w-10 h-10 rounded-full object-cover border border-amber-400/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 font-black text-sm shrink-0">
                      {review.buyerName?.[0] || "G"}
                    </div>
                  )}
                  <div>
                    <p className="text-[#cee5ff] font-semibold group-hover:text-white transition-colors">{review.buyerName || "Guest"}</p>
                    <p className="text-[#a3cbf2]/40 text-xs">{formatDate(review.createdOn)}</p>
                  </div>
                </div>
                <span className="text-amber-400 text-sm tracking-widest shrink-0">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-[#a3cbf2]/70 text-sm leading-relaxed pl-[52px]">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;