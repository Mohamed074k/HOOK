// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   ChevronRight, ShoppingCart, Star, Package, 
//   ShieldCheck, ArrowLeft, User, MessageSquare, Plus, X
// } from "lucide-react";
// import gsap from "gsap";
// import apiClient from "../../api/apiClient";
// import { useCart } from "../../context/CartContext";
// import { toast } from 'react-hot-toast';

// // ─── Enums & Helpers ─────────────────────────────────────────────────────────
// const CATEGORIES = {
//   1: "Fishing Rods", 2: "Fishing Reels", 3: "Fishing Lines", 4: "Hooks & Rigs",
//   5: "Lures & Baits", 6: "Fishing Accessories", 7: "Fishing Clothing", 
//   8: "Snorkeling & Diving", 9: "Boats & Marine Equipment", 10: "Storage & Bags"
// };

// const CONDITIONS = { 1: "New", 2: "Used" };

// const getImageUrl = (url) => {
//   if (!url) return null;
//   if (url.startsWith('http') || url.startsWith('data:')) return url;
//   const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
//   return `${baseUrl}${url}`;
// };

// const formatDate = (dateString) => {
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// // ─── Animated Background ─────────────────────────────────────────────────────
// const AnimatedBackground = () => {
//   const bgRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.to(".m-orb-1", { x: 30, y: -20, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
//       gsap.to(".m-orb-2", { x: -40, y: 30, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
//     }, bgRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={bgRef} className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
//       <div className="m-orb-1 absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.06) 0%, transparent 70%)" }} />
//       <div className="m-orb-2 absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.05) 0%, transparent 70%)" }} />
//     </div>
//   );
// };

// // ─── Skeleton Loader ─────────────────────────────────────────────────────────
// const ProductDetailsSkeleton = () => (
//   <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
//     {/* Breadcrumbs Skeleton */}
//     <div className="w-64 h-4 bg-[#002238] rounded-md mb-8 animate-pulse" />
    
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
//       {/* Left: Image Skeleton */}
//       <div className="flex flex-col gap-4">
//         <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-[#002238] rounded-3xl animate-pulse shadow-lg" />
//         <div className="flex gap-3 overflow-hidden pb-2">
//           {[1, 2, 3].map(i => (
//             <div key={i} className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-[#002238] animate-pulse" />
//           ))}
//         </div>
//       </div>
      
//       {/* Right: Info Skeleton */}
//       <div className="flex flex-col">
//         <div className="mb-6">
//           {/* Categories/Condition Pills */}
//           <div className="flex gap-3 mb-4">
//             <div className="w-24 h-6 bg-[#002238] rounded-md animate-pulse" />
//             <div className="w-16 h-6 bg-[#002238] rounded-md animate-pulse" />
//           </div>
          
//           {/* Title */}
//           <div className="w-full h-12 sm:h-14 lg:h-16 bg-[#002238] rounded-xl mb-4 animate-pulse" />
//           <div className="w-2/3 h-12 sm:h-14 lg:h-16 bg-[#002238] rounded-xl mb-6 animate-pulse" />

//           {/* Description */}
//           <div className="space-y-3 mb-6">
//             <div className="w-full h-4 bg-[#002238] rounded-md animate-pulse" />
//             <div className="w-5/6 h-4 bg-[#002238] rounded-md animate-pulse" />
//             <div className="w-4/5 h-4 bg-[#002238] rounded-md animate-pulse" />
//           </div>

//           {/* Reviews/Stock border row */}
//           <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-6">
//             <div className="w-16 h-6 bg-[#002238] rounded-md animate-pulse" />
//             <div className="w-20 h-6 bg-[#002238] rounded-md animate-pulse" />
//             <div className="w-24 h-6 bg-[#002238] rounded-md animate-pulse" />
//           </div>
//         </div>

//         {/* Price & Stock */}
//         <div className="flex flex-wrap items-center gap-6 mb-8">
//           <div className="w-40 h-12 sm:h-14 bg-[#002238] rounded-xl animate-pulse" />
//           <div className="w-32 h-10 bg-[#002238] rounded-xl animate-pulse" />
//         </div>

//         {/* Seller Card */}
//         <div className="w-full h-24 bg-[#002238] rounded-2xl mb-8 animate-pulse" />

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 mt-auto">
//           <div className="flex-1 h-14 bg-[#002238] rounded-xl animate-pulse" />
//           <div className="flex-1 h-14 bg-[#002238] rounded-xl animate-pulse" />
//         </div>

//         {/* Guarantees */}
//         <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-[#002238] animate-pulse" />
//             <div className="w-24 h-4 bg-[#002238] rounded-md animate-pulse" />
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-[#002238] animate-pulse" />
//             <div className="w-24 h-4 bg-[#002238] rounded-md animate-pulse" />
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // ─── Review Modal ────────────────────────────────────────────────────────────
// const ReviewModal = ({ isOpen, onClose, productId, onSuccess }) => {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Using a dummy UUID to satisfy backend requirements for the example
//   const dummyOrderId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; 

//   useEffect(() => {
//     if (!isOpen) { setRating(0); setComment(""); }
//   }, [isOpen]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (rating === 0) return toast.error("Please select a rating");
//     if (!comment.trim()) return toast.error("Please write a comment");

//     setIsSubmitting(true);
//     try {
//       await apiClient.post("/api/marketplace/reviews/admin-user/create", {
//         orderId: dummyOrderId, 
//         productId: productId,
//         rating: rating,
//         comment: comment.trim()
//       });
//       toast.success("Review submitted successfully!");
//       onSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       toast.error(error.response?.data?.message || "Failed to submit review");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.95, opacity: 0, y: 20 }}
//             transition={{ type: "spring", damping: 25, stiffness: 300 }}
//             className="w-full max-w-lg bg-[#002238] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
//           >
//             <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#001526]/50">
//               <h3 className="text-xl font-black text-[#cee5ff]">Write a Review</h3>
//               <button onClick={onClose} className="p-2 rounded-full text-[#a3cbf2]/60 hover:text-white hover:bg-white/10 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-6 space-y-6">
//               <div>
//                 <label className="block text-sm font-bold text-[#a3cbf2]/60 uppercase tracking-widest mb-3">
//                   Your Rating
//                 </label>
//                 <div className="flex items-center gap-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <motion.button
//                       type="button" key={star}
//                       whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
//                       onClick={() => setRating(star)} className="focus:outline-none"
//                     >
//                       <Star size={36} className={`transition-colors ${star <= rating ? "fill-sky-400 text-sky-400" : "fill-transparent text-white/20 hover:text-sky-400/50"}`} />
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-[#a3cbf2]/60 uppercase tracking-widest mb-3">
//                   Your Review
//                 </label>
//                 <textarea
//                   value={comment} onChange={(e) => setComment(e.target.value)}
//                   placeholder="Share your experience with this equipment..." rows={4}
//                   className="w-full bg-[#001526] border border-white/10 rounded-2xl p-4 text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 resize-none transition-all"
//                 />
//               </div>

//               <div className="flex gap-4 pt-2">
//                 <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-white/10 text-[#a3cbf2] font-bold tracking-widest text-sm uppercase hover:bg-white/5 transition-colors">
//                   Cancel
//                 </button>
//                 <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 rounded-xl bg-sky-400 text-[#001526] font-bold tracking-widest text-sm uppercase hover:bg-sky-300 transition-colors disabled:opacity-50 shadow-lg shadow-sky-400/20">
//                   {isSubmitting ? "Submitting..." : "Post Review"}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// // ─── Product Reviews Component ───────────────────────────────────────────────
// const ProductReviews = ({ productId, initialReviews = [], averageRating, reviewsCount }) => {
//   const [reviews, setReviews] = useState(initialReviews);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchReviews = async () => {
//     try {
//       setIsLoading(true);
//       const response = await apiClient.get(`/api/marketplace/reviews/allroles/${productId}`);
//       setReviews(response.data || []);
//     } catch (error) {
//       console.error("Failed to refresh reviews:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (initialReviews.length > 0) {
//       setReviews(initialReviews);
//     } else if (productId) {
//       fetchReviews();
//     }
//   }, [productId, initialReviews]);

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-100px" }}
//       transition={{ duration: 0.6 }}
//       className="mt-12 lg:mt-20"
//     >
//       <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
//         <div>
//           <h2 className="text-2xl md:text-3xl font-black text-[#cee5ff] flex items-center gap-3">
//             <MessageSquare className="text-sky-400" size={28} /> Customer Reviews
//           </h2>
//           <div className="flex items-center gap-3 mt-2">
//             <div className="flex gap-1">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} size={16} className={i < Math.round(averageRating || 0) ? "fill-amber-400 text-amber-400" : "fill-transparent text-white/20"} />
//               ))}
//             </div>
//             <span className="text-[#a3cbf2]/80 text-sm font-medium">
//               {averageRating?.toFixed(1) || "0.0"} out of 5 ({reviewsCount || 0} reviews)
//             </span>
//           </div>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-400/10 border border-sky-400/30 text-sky-400 rounded-xl font-bold tracking-widest text-sm uppercase hover:bg-sky-400/20 transition-all"
//         >
//           <Plus size={18} /> Write a Review
//         </motion.button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {isLoading ? (
//           [...Array(2)].map((_, i) => (
//             <div key={i} className="p-6 rounded-2xl bg-[#002238] border border-white/5 animate-pulse">
//               <div className="flex gap-4 mb-4">
//                 <div className="w-12 h-12 bg-[#001526] rounded-full" />
//                 <div className="flex-1"><div className="w-32 h-4 bg-[#001526] rounded mb-2" /><div className="w-20 h-3 bg-[#001526] rounded" /></div>
//               </div>
//               <div className="w-full h-16 bg-[#001526] rounded" />
//             </div>
//           ))
//         ) : reviews.length > 0 ? (
//           reviews.map((review, idx) => (
//             <motion.div
//               key={review.id}
//               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
//               whileHover={{ y: -4 }}
//               className="p-6 rounded-2xl bg-[#002238] border border-white/5 hover:border-sky-400/20 transition-colors shadow-lg group"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-full overflow-hidden bg-[#001526] border border-white/10 flex items-center justify-center shrink-0">
//                     {review.buyerImageUrl ? (
//                       <img src={getImageUrl(review.buyerImageUrl)} alt={review.buyerName} className="w-full h-full object-cover" />
//                     ) : (
//                       <User size={20} className="text-[#a3cbf2]/40" />
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-[#cee5ff] group-hover:text-sky-300 transition-colors">{review.buyerName}</h4>
//                     <p className="text-xs text-[#a3cbf2]/50">{formatDate(review.createdOn)}</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-0.5">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} size={14} className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-white/10"} />
//                   ))}
//                 </div>
//               </div>
//               <p className="text-[#a3cbf2]/80 text-sm leading-relaxed">"{review.comment}"</p>
//             </motion.div>
//           ))
//         ) : (
//           <div className="col-span-full py-16 text-center bg-[#002238] border border-dashed border-white/10 rounded-3xl">
//             <MessageSquare size={48} className="mx-auto text-white/10 mb-4" />
//             <p className="text-[#cee5ff] font-bold text-lg mb-1">No reviews yet</p>
//             <p className="text-[#a3cbf2]/60 text-sm">Be the first to share your experience with this product!</p>
//           </div>
//         )}
//       </div>

//       <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} productId={productId} onSuccess={fetchReviews} />
//     </motion.div>
//   );
// };

// // ─── Main Product Details Page Component ─────────────────────────────────────
// const ProductDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
  
//   const [product, setProduct] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState("");

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const fetchProduct = async () => {
//       try {
//         const response = await apiClient.get(`/api/marketplace/products/allroles/${id}`);
//         const data = response.data;
//         setProduct(data);
//         if (data.imageUrls && data.imageUrls.length > 0) {
//           setActiveImage(data.imageUrls[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching product:", error);
//         toast.error("Failed to load product details.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) fetchProduct();
//   }, [id]);

//   const handleAddToCart = () => {
//     if (product) {
//       addToCart(product);
//       toast.success(`${product.title} added to cart!`);
//     }
//   };

//   const handleBuyNow = () => {
//     if (product) {
//       addToCart(product);
//       navigate('/cart');
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#001526] flex flex-col relative pb-20">
//         <AnimatedBackground />
//         <ProductDetailsSkeleton />
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-[#001526] flex flex-col items-center justify-center text-[#cee5ff]">
//         <Package size={64} className="text-white/10 mb-4" />
//         <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
//         <button onClick={() => navigate('/marketplace')} className="mt-4 px-6 py-2.5 rounded-xl bg-sky-400/10 text-sky-400 font-bold hover:bg-sky-400/20 transition-colors">
//           Back to Marketplace
//         </button>
//       </div>
//     );
//   }

//   const images = product.imageUrls && product.imageUrls.length > 0 
//     ? product.imageUrls 
//     : [product.mainImageUrl].filter(Boolean);

//   return (
//     <div className="min-h-screen bg-[#001526] text-[#cee5ff] pb-20 relative overflow-hidden">
//       <AnimatedBackground />

//       <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        
//         {/* Breadcrumbs */}
//         <motion.div 
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="flex items-center gap-2 text-sm font-bold text-[#a3cbf2]/60 mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar"
//         >
//           <button onClick={() => navigate(-1)} className="hover:text-sky-400 flex items-center gap-1 transition-colors">
//             <ArrowLeft size={16} /> Back
//           </button>
//           <span className="text-white/20">/</span>
//           <button onClick={() => navigate('/marketplace')} className="hover:text-sky-400 transition-colors">
//             Marketplace
//           </button>
//           <span className="text-white/20">/</span>
//           <span className="text-[#cee5ff]">{CATEGORIES[product.category] || "Category"}</span>
//         </motion.div>

//         {/* Product Top Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          
//           {/* Left: Image Gallery */}
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }} 
//             animate={{ opacity: 1, scale: 1 }} 
//             transition={{ duration: 0.5 }}
//             className="flex flex-col gap-4"
//           >
//             {/* Main Image */}
//             <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-[#002238] rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl group">
//               {activeImage ? (
//                 <AnimatePresence mode="wait">
//                   <motion.img
//                     key={activeImage}
//                     initial={{ opacity: 0, scale: 1.05 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.4 }}
//                     src={getImageUrl(activeImage)}
//                     alt={product.title}
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                   />
//                 </AnimatePresence>
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <Package size={80} className="text-white/5" />
//                 </div>
//               )}
//               {product.condition === 1 && (
//                 <div className="absolute top-4 left-4 px-3 py-1.5 bg-sky-500/20 backdrop-blur-md rounded-lg border border-sky-400/30 shadow-lg">
//                   <span className="text-xs font-black text-sky-400 uppercase tracking-widest">New</span>
//                 </div>
//               )}
//             </div>

//             {/* Thumbnails Slider */}
//             {images.length > 1 && (
//               <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
//                 {images.map((img, idx) => (
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     key={idx}
//                     onClick={() => setActiveImage(img)}
//                     className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
//                       activeImage === img ? 'border-sky-400 shadow-lg shadow-sky-400/20' : 'border-transparent opacity-60 hover:opacity-100 hover:border-sky-400/50'
//                     }`}
//                   >
//                     <img src={getImageUrl(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover bg-[#002238]" />
//                   </motion.button>
//                 ))}
//               </div>
//             )}
//           </motion.div>

//           {/* Right: Product Info */}
//           <motion.div 
//             initial={{ opacity: 0, x: 20 }} 
//             animate={{ opacity: 1, x: 0 }} 
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="flex flex-col"
//           >
//             <div className="mb-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="text-xs font-bold text-sky-400/70 uppercase tracking-widest border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 rounded-md">
//                   {CATEGORIES[product.category] || "General"}
//                 </span>
//                 <span className="text-xs font-bold text-[#a3cbf2]/60 uppercase tracking-widest border border-white/10 bg-white/5 px-2.5 py-1 rounded-md">
//                   {CONDITIONS[product.condition] || "Used"}
//                 </span>
//               </div>
              
//               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#cee5ff] leading-tight mb-4">
//                 {product.title}
//               </h1>

//               {/* Description moved right below the title */}
//               <p className="text-[#a3cbf2]/80 text-base leading-relaxed mb-6">
//                 {product.description}
//               </p>

//               <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-6">
//                 <div className="flex items-center gap-1.5">
//                   <Star size={18} className="fill-amber-400 text-amber-400" />
//                   <span className="text-lg font-bold text-amber-400">{product.averageRating || "0.0"}</span>
//                 </div>
//                 <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
//                 <button 
//                   onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
//                   className="text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors underline decoration-sky-400/30 underline-offset-4"
//                 >
//                   {product.reviewsCount || 0} Reviews
//                 </button>
//               </div>
//             </div>

//             {/* Price and Stock Prominently displayed */}
//             <div className="flex flex-wrap items-center gap-6 mb-8">
//               <span className="text-5xl font-black text-sky-400 tabular-nums tracking-tight">
//                 ${product.price.toFixed(2)}
//               </span>
//               <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
//                 product.stockQuantity > 0 
//                   ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" 
//                   : "bg-rose-400/10 border-rose-400/20 text-rose-400"
//               }`}>
//                 <Package size={18} />
//                 <span className="font-bold text-sm tracking-widest uppercase">
//                   {product.stockQuantity > 0 ? `${product.stockQuantity} In Stock` : "Out of Stock"}
//                 </span>
//               </div>
//             </div>

//             {/* Animated Seller Card with Hover Effects */}
//             <motion.div 
//               whileHover={{ y: -4, scale: 1.01 }}
//               className="bg-[#002238] border border-white/5 hover:border-sky-400/30 hover:shadow-xl hover:shadow-sky-400/10 rounded-2xl p-5 mb-8 flex items-center justify-between cursor-pointer transition-all duration-300 group"
//             >
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-full bg-[#001526] border border-white/10 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-sky-400/30 transition-colors">
//                   <User size={24} className="text-[#a3cbf2]/40 group-hover:text-sky-400/60 transition-colors" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold text-[#a3cbf2]/60 uppercase tracking-widest mb-1 group-hover:text-sky-400/70 transition-colors">Listed By</p>
//                   <p className="text-lg font-bold text-[#cee5ff] group-hover:text-white transition-colors">{product.sellerName || "Anonymous Seller"}</p>
//                 </div>
//               </div>
//               <ShieldCheck size={28} className="text-emerald-400/30 group-hover:text-emerald-400 transition-colors" />
//             </motion.div>

//             {/* Actions */}
//             <div className="flex flex-col sm:flex-row gap-4 mt-auto">
//               <motion.button
//                 whileHover={product.stockQuantity > 0 ? { scale: 1.02 } : {}}
//                 whileTap={product.stockQuantity > 0 ? { scale: 0.98 } : {}}
//                 onClick={handleAddToCart}
//                 disabled={product.stockQuantity === 0}
//                 className="flex-1 py-4 rounded-xl border border-sky-400/30 bg-[#001526] text-sky-400 font-bold tracking-widest text-sm uppercase hover:bg-sky-400/10 hover:border-sky-400/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//               >
//                 <ShoppingCart size={18} /> Add to Cart
//               </motion.button>
              
//               <motion.button
//                 whileHover={product.stockQuantity > 0 ? { scale: 1.02, boxShadow: "0 10px 25px -5px rgba(83,214,251,0.3)" } : {}}
//                 whileTap={product.stockQuantity > 0 ? { scale: 0.98 } : {}}
//                 onClick={handleBuyNow}
//                 disabled={product.stockQuantity === 0}
//                 className="flex-1 py-4 rounded-xl bg-sky-400 text-[#001526] font-bold tracking-widest text-sm uppercase hover:bg-sky-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Buy Now <ChevronRight size={18} />
//               </motion.button>
//             </div>
            
//             {/* Guarantees */}
//             <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
//               <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-[#a3cbf2]/60 cursor-default">
//                 <div className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400">
//                   <ShieldCheck size={18} />
//                 </div>
//                 <span className="text-xs font-bold uppercase tracking-wider text-emerald-400/80">Secure Payment</span>
//               </motion.div>
//               <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-[#a3cbf2]/60 cursor-default">
//                 <div className="p-2 rounded-lg bg-sky-400/10 text-sky-400">
//                   <Package size={18} />
//                 </div>
//                 <span className="text-xs font-bold uppercase tracking-wider text-sky-400/80">Fast Shipping</span>
//               </motion.div>
//             </div>

//           </motion.div>
//         </div>

//         <ProductReviews 
//           productId={id} 
//           initialReviews={product.reviews} 
//           averageRating={product.averageRating}
//           reviewsCount={product.reviewsCount}
//         />
        
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsPage;

 import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, ShoppingCart, Star, Package, 
  ShieldCheck, ArrowLeft, User
} from "lucide-react";
import gsap from "gsap";
import apiClient from "../../api/apiClient";
import { useCart } from "../../context/CartContext";
import { toast } from 'react-hot-toast';
import ProductReviews from "./../../components/APP_COMPONENTS/MARKETPLACE_COMPONENTS/ProductReviews";
import Breadcrumb from "../../components/APP_COMPONENTS/Breadcrumb"; // Add this import

// ─── Enums & Helpers ─────────────────────────────────────────────────────────
const CATEGORIES = {
  1: "Fishing Rods", 2: "Fishing Reels", 3: "Fishing Lines", 4: "Hooks & Rigs",
  5: "Lures & Baits", 6: "Fishing Accessories", 7: "Fishing Clothing", 
  8: "Snorkeling & Diving", 9: "Boats & Marine Equipment", 10: "Storage & Bags"
};

const CONDITIONS = { 1: "New", 2: "Used" };

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

// ─── Animations ──────────────────────────────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

// ─── Animated Background ─────────────────────────────────────────────────────
const AnimatedBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".m-orb-1", { x: 30, y: -20, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".m-orb-2", { x: -40, y: 30, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, bgRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="m-orb-1 absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.06) 0%, transparent 70%)" }} />
      <div className="m-orb-2 absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.05) 0%, transparent 70%)" }} />
    </div>
  );
};

// ─── Scaled Skeleton Loader ──────────────────────────────────────────────────
const ProductDetailsSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 w-full">
    {/* Breadcrumbs Skeleton */}
    <div className="w-48 h-4 bg-[#002238] rounded-md mb-6 animate-pulse" />
    
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 xl:gap-12">
      {/* Left: Image Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="w-full aspect-[4/3] lg:aspect-[5/4] bg-[#002238] rounded-2xl animate-pulse shadow-lg border border-white/5" />
        <div className="flex gap-2 overflow-hidden pb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-[#002238] animate-pulse border border-white/5" />
          ))}
        </div>
      </div>
      
      {/* Right: Info Skeleton */}
      <div className="flex flex-col">
        <div className="flex gap-2 mb-3">
          <div className="w-20 h-5 bg-[#002238] rounded-md animate-pulse" />
          <div className="w-12 h-5 bg-[#002238] rounded-md animate-pulse" />
        </div>
        
        {/* Title */}
        <div className="w-full h-10 sm:h-12 bg-[#002238] rounded-xl mb-3 animate-pulse" />
        
        {/* Description */}
        <div className="space-y-2 mb-5">
          <div className="w-full h-3 bg-[#002238] rounded-md animate-pulse" />
          <div className="w-5/6 h-3 bg-[#002238] rounded-md animate-pulse" />
          <div className="w-4/5 h-3 bg-[#002238] rounded-md animate-pulse" />
        </div>

        {/* Reviews Row */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
          <div className="w-12 h-5 bg-[#002238] rounded-md animate-pulse" />
          <div className="w-20 h-5 bg-[#002238] rounded-md animate-pulse" />
        </div>

        {/* Price & Stock */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-32 h-10 bg-[#002238] rounded-xl animate-pulse" />
          <div className="w-24 h-8 bg-[#002238] rounded-xl animate-pulse" />
        </div>

        {/* Seller Card */}
        <div className="w-full h-20 bg-[#002238] rounded-xl mb-6 animate-pulse border border-white/5" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <div className="flex-1 h-12 bg-[#002238] rounded-xl animate-pulse border border-white/5" />
          <div className="flex-1 h-12 bg-[#002238] rounded-xl animate-pulse border border-white/5" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  // Custom breadcrumb items for product page
  const breadcrumbItems = [
    { name: "Marketplace", path: "/marketplace", isLast: false },
    { name: product?.title || "Product", path: "", isLast: true }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/api/marketplace/products/allroles/${id}`);
        const data = response.data;
        setProduct(data);
        if (data.imageUrls && data.imageUrls.length > 0) {
          setActiveImage(data.imageUrls[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`Added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      navigate('/cart'); 
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#001526] flex flex-col relative pb-20">
        <AnimatedBackground />
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#001526] flex flex-col items-center justify-center text-[#cee5ff]">
        <Package size={64} className="text-white/10 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <button onClick={() => navigate('/marketplace')} className="mt-4 px-6 py-2.5 rounded-xl bg-sky-400/10 text-sky-400 font-bold hover:bg-sky-400/20 transition-colors">
          Back to Marketplace
        </button>
      </div>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : [product.mainImageUrl].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#001526] text-[#cee5ff] pb-20 relative overflow-hidden">
      <AnimatedBackground />

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-4">
        
        {/* Breadcrumb - Added here */}
        <div className="mb-6">
          <Breadcrumb customItems={breadcrumbItems} />
        </div>

        {/* Product Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 xl:gap-12">
          
          {/* Left: Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            {/* Main Image - Reduced Aspect Ratio */}
            <div className="w-full aspect-[4/3] lg:aspect-[5/4] bg-[#001a2c] rounded-2xl border border-white/5 overflow-hidden relative shadow-xl group">
              {activeImage ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={getImageUrl(activeImage)}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={60} className="text-white/5" />
                </div>
              )}
              {product.condition === 1 && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-sky-500/20 backdrop-blur-md rounded-lg border border-sky-400/30 shadow-lg">
                  <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">New</span>
                </div>
              )}
            </div>

            {/* Thumbnails Slider - Smaller sizes */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                {images.map((img, idx) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border transition-all duration-300 ${
                      activeImage === img ? 'border-sky-400 shadow-md shadow-sky-400/20' : 'border-transparent opacity-60 hover:opacity-100 hover:border-sky-400/50'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover bg-[#001a2c]" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Info - Tighter spacing and smaller fonts */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col"
          >
            <motion.div variants={fadeUp} className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-sky-400/80 uppercase tracking-widest border border-sky-400/20 bg-sky-400/10 px-2 py-0.5 rounded">
                  {CATEGORIES[product.category] || "General"}
                </span>
                <span className="text-[10px] font-bold text-[#a3cbf2]/70 uppercase tracking-widest border border-white/10 bg-white/5 px-2 py-0.5 rounded">
                  {CONDITIONS[product.condition] || "Used"}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff] leading-tight mb-2.5">
                {product.title}
              </h1>

              <p className="text-[#a3cbf2]/70 text-sm leading-relaxed mb-4 line-clamp-3 hover:line-clamp-none transition-all duration-300">
                {product.description}
              </p>

              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="text-base font-bold text-amber-400">{product.averageRating || "0.0"}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <button 
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors underline decoration-sky-400/30 underline-offset-4"
                >
                  {product.reviewsCount || 0} Reviews
                </button>
              </div>
            </motion.div>

    {/* Price & Stock - Vertical layout */}
            <motion.div variants={fadeUp} className="flex flex-col items-start gap-4.5 mb-5">
              <span className="text-4xl font-black text-sky-400 tabular-nums tracking-tight leading-none">
                ${product.price.toFixed(2)}
              </span>
              
              <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 shadow-sm ${
                product.stockQuantity > 0 
                  ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" 
                  : "bg-rose-400/10 border-rose-400/20 text-rose-400"
              }`}>
                <Package size={14} />
                <span className="font-bold text-xs tracking-wider uppercase">
                  {product.stockQuantity > 0 ? `${product.stockQuantity} Left` : "Out of Stock"}
                </span>
              </div>
            </motion.div>

            {/* Seller Card - Thinner */}
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -2, scale: 1.01 }}
              className="bg-[#001a2c] border border-white/5 hover:border-sky-400/30 rounded-xl p-3.5 mb-6 flex items-center justify-between cursor-pointer transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00101c] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-sky-400/30 transition-colors">
                  <User size={18} className="text-[#a3cbf2]/40 group-hover:text-sky-400/60" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#a3cbf2]/50 uppercase tracking-widest mb-0.5 group-hover:text-sky-400/70 transition-colors">Seller</p>
                  <p className="text-sm font-bold text-[#cee5ff] group-hover:text-white transition-colors">{product.sellerName || "Anonymous Seller"}</p>
                </div>
              </div>
              <ShieldCheck size={20} className="text-emerald-400/30 group-hover:text-emerald-400 transition-colors mr-2" />
            </motion.div>

            {/* Actions - Slightly smaller buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mt-auto">
              <motion.button
                whileHover={product.stockQuantity > 0 ? { scale: 1.02 } : {}}
                whileTap={product.stockQuantity > 0 ? { scale: 0.98 } : {}}
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex-1 py-3 rounded-xl border border-sky-400/30 bg-[#001a2c] text-sky-400 font-bold tracking-widest text-xs uppercase hover:bg-sky-400/10 hover:border-sky-400/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} /> Add to Cart
              </motion.button>
              
              <motion.button
                whileHover={product.stockQuantity > 0 ? { scale: 1.02, boxShadow: "0 8px 20px -5px rgba(83,214,251,0.3)" } : {}}
                whileTap={product.stockQuantity > 0 ? { scale: 0.98 } : {}}
                onClick={handleBuyNow}
                disabled={product.stockQuantity === 0}
                className="flex-1 py-3 rounded-xl bg-sky-400 text-[#001526] font-bold tracking-widest text-xs uppercase hover:bg-sky-300 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now <ChevronRight size={16} />
              </motion.button>
            </motion.div>
            
            {/* Guarantees - Compact */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-[#a3cbf2]/60">
                <div className="p-1.5 rounded-md bg-emerald-400/10 text-emerald-400">
                  <ShieldCheck size={14} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Secure</span>
              </div>
              <div className="flex items-center gap-2 text-[#a3cbf2]/60">
                <div className="p-1.5 rounded-md bg-sky-400/10 text-sky-400">
                  <Package size={14} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400/80">Fast Ship</span>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Separated Reviews Section */}
        <div className="mt-12">
          <ProductReviews 
            productId={id} 
            initialReviews={product.reviews} 
            averageRating={product.averageRating}
            reviewsCount={product.reviewsCount}
          />
        </div>
        
      </div>
    </div>
  );
};

export default ProductDetailsPage;