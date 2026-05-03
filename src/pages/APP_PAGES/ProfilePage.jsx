// // src/pages/USER_PAGES/ProfilePage.jsx
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MapPin, Mail, Pencil, Calendar, Ship, Star, X, ChevronRight,
//   Package, RotateCcw, Compass, Camera, Check, ShoppingBag, Anchor,
//   User, Phone, FileText, Lock, Eye, EyeOff, LogOut, Users, ChevronDown, ChevronUp,
//   Trash2
// } from "lucide-react";
// import gsap from "gsap";
// import { useProfile } from "../../context/ProfileContext";
// import { useAuth } from "../../context/AuthContext";
// import { toast } from 'react-hot-toast';
// import { useNavigate } from "react-router-dom";
// import apiClient from "../../api/apiClient";

// // Helper function to get image URL
// const getImageUrl = (url) => {
//   if (!url) return null;
//   if (url.startsWith('http') || url.startsWith('data:')) return url;
//   const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
//   return `${baseUrl}${url}`;
// };

// // ─── Animated background ────────────────────────────────────────────────
// const AnimatedBackground = () => {
//   const bgRef = useRef(null);
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.to(".orb-1", { x: 40, y: -30, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
//       gsap.to(".orb-2", { x: -50, y: 20, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
//       gsap.to(".orb-3", { scale: 1.1, opacity: 0.6, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
//     }, bgRef);
//     return () => ctx.revert();
//   }, []);
//   return (
//     <div ref={bgRef} className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
//       <div className="orb-1 absolute top-20 left-[10%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }} />
//       <div className="orb-2 absolute bottom-20 right-[5%] w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }} />
//       <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(83,214,251,0.04) 0%, transparent 60%)" }} />
//     </div>
//   );
// };

// // ─── Status pill ──────────────────────────────────────────────────────────────
// const statusStyles = {
//   0: "bg-rose-400/10 text-rose-300 border-rose-400/20",
//   1: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
//   2: "bg-amber-400/10 text-amber-300 border-amber-400/20",
//   5: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
// };

// const paymentStatusStyles = {
//   0: "bg-rose-400/10 text-rose-300 border-rose-400/20",
//   1: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
//   2: "bg-amber-400/10 text-amber-300 border-amber-400/20",
// };

// const StatusPill = ({ status, type = "booking" }) => {
//   let statusText = "";
//   if (type === "booking") {
//     if (status === 0) statusText = "Cancelled";
//     else if (status === 1) statusText = "Confirmed";
//     else if (status === 2) statusText = "Pending";
//     else if (status === 5) statusText = "Completed";
//   } else if (type === "payment") {
//     if (status === 0) statusText = "Failed";
//     else if (status === 1) statusText = "Paid";
//     else if (status === 2) statusText = "Pending";
//   }
  
//   return (
//     <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${type === "booking" ? statusStyles[status] : paymentStatusStyles[status]}`}>
//       {statusText}
//     </span>
//   );
// };

// // ─── Review Management Component ──────────────────────────────────────────────
// const ReviewManagement = ({ review, booking, onReviewUpdated, onReviewDeleted }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [rating, setRating] = useState(review?.rating || 0);
//   const [hoveredRating, setHoveredRating] = useState(0);
//   const [comment, setComment] = useState(review?.comment || "");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const formatDate = (dateString) => {
//     if (!dateString) return "TBD";
//     return new Date(dateString).toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   const handleUpdate = async () => {
//     if (rating === 0) {
//       toast.error("Please select a rating");
//       return;
//     }
//     if (!comment.trim()) {
//       toast.error("Please write a review comment");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const response = await apiClient.put(`/api/Reviews/user/update/${review.id}`, {
//         rating: rating,
//         comment: comment.trim()
//       });
      
//       toast.success("Review updated successfully!");
//       onReviewUpdated?.(response.data);
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error updating review:", error);
//       toast.error(error.response?.data?.description || "Failed to update review");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async () => {
//     setIsSubmitting(true);
//     try {
//       await apiClient.delete(`/api/Reviews/user/delete/${review.id}`);
//       toast.success("Review deleted successfully!");
//       onReviewDeleted?.(review.id);
//       setShowDeleteConfirm(false);
//     } catch (error) {
//       console.error("Error deleting review:", error);
//       toast.error(error.response?.data?.description || "Failed to delete review");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-3 bg-[#001526] rounded-xl">
//       {isEditing ? (
//         // Edit mode
//         <div className="space-y-3">
//           <div>
//             <label className="text-xs text-[#a3cbf2]/60 mb-1 block">Rating</label>
//             <div className="flex gap-1">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   onClick={() => setRating(star)}
//                   onMouseEnter={() => setHoveredRating(star)}
//                   onMouseLeave={() => setHoveredRating(0)}
//                   className="focus:outline-none transition-transform hover:scale-110"
//                 >
//                   <Star
//                     size={24}
//                     className={star <= (hoveredRating || rating) ? "text-amber-400 fill-amber-400" : "text-white/20"}
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           <div>
//             <label className="text-xs text-[#a3cbf2]/60 mb-1 block">Your Review</label>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               rows={3}
//               className="w-full bg-[#002238] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all resize-none"
//             />
//           </div>
          
//           <div className="flex gap-2">
//             <button
//               onClick={handleUpdate}
//               disabled={isSubmitting}
//               className="flex-1 py-2 rounded-lg bg-sky-400 text-[#001526] text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {isSubmitting ? "Saving..." : "Save Changes"}
//             </button>
//             <button
//               onClick={() => setIsEditing(false)}
//               className="px-4 py-2 rounded-lg border border-white/10 text-[#a3cbf2] text-sm hover:bg-white/5 transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ) : (
//         // View mode
//         <div>
//           <div className="flex gap-0.5 mb-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <Star
//                 key={star}
//                 size={14}
//                 className={star <= (review?.rating || 0) ? "text-amber-400 fill-amber-400" : "text-white/20"}
//               />
//             ))}
//           </div>
//           <p className="text-sm text-[#a3cbf2]/80 leading-relaxed">{review?.comment}</p>
          
//           <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
//             <span className="text-xs text-[#a3cbf2]/40">
//               Posted on {formatDate(review?.createdOn)}
//             </span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="p-1.5 rounded-lg hover:bg-sky-400/10 text-sky-400 transition-colors"
//               >
//                 <Pencil size={14} />
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(true)}
//                 className="p-1.5 rounded-lg hover:bg-rose-400/10 text-rose-400 transition-colors"
//               >
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete confirmation modal */}
//       <AnimatePresence>
//         {showDeleteConfirm && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
//             onClick={() => setShowDeleteConfirm(false)}
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 20, scale: 0.96 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: 10, scale: 0.97 }}
//               onClick={(e) => e.stopPropagation()}
//               className="w-full max-w-sm bg-[#002238] border border-white/10 rounded-2xl p-5 shadow-2xl"
//             >
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 rounded-xl bg-rose-400/10 flex items-center justify-center">
//                   <Trash2 size={18} className="text-rose-400" />
//                 </div>
//                 <h3 className="text-lg font-bold text-[#cee5ff]">Delete Review</h3>
//               </div>
//               <p className="text-sm text-[#a3cbf2]/70 mb-5">
//                 Are you sure you want to delete your review? This action cannot be undone.
//               </p>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setShowDeleteConfirm(false)}
//                   className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] border border-white/5 text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   disabled={isSubmitting}
//                   className="flex-1 py-2 rounded-xl text-sm font-semibold bg-rose-400/15 border border-rose-400/30 text-rose-300 hover:bg-rose-400/25 transition-colors disabled:opacity-50"
//                 >
//                   {isSubmitting ? "Deleting..." : "Delete"}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ─── Review Modal Component ───────────────────────────────────────────────────
// const ReviewModal = ({ open, booking, onClose, onReviewSubmitted }) => {
//   const [rating, setRating] = useState(0);
//   const [hoveredRating, setHoveredRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     if (rating === 0) {
//       toast.error("Please select a rating");
//       return;
//     }
//     if (!comment.trim()) {
//       toast.error("Please write a review comment");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const requestData = {
//         bookingId: booking.id,
//         rating: rating,
//         comment: comment.trim()
//       };

//       const response = await apiClient.post("/api/Reviews/user/create", requestData);
      
//       toast.success("Review submitted successfully! Thank you for your feedback.");
//       onReviewSubmitted?.(response.data);
//       onClose();
      
//       setRating(0);
//       setComment("");
//     } catch (error) {
//       console.error("Error submitting review:", error);
      
//       if (error.response?.data?.code === "Review.AlreadyReviewed") {
//         toast.error("You have already reviewed this trip. You can only review each booking once.", {
//           duration: 5000,
//           icon: '⚠️'
//         });
//       } else if (error.response?.status === 400) {
//         const message = error.response?.data?.description || error.response?.data?.message || "Invalid review data";
//         toast.error(message);
//       } else if (error.response?.status === 401) {
//         toast.error("Please login to submit a review");
//       } else if (error.response?.status === 404) {
//         toast.error("Booking not found. You can only review trips you've booked.");
//       } else {
//         toast.error("Failed to submit review. Please try again later.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "TBD";
//     return new Date(dateString).toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   return (
//     <AnimatePresence>
//       {open && booking && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//           className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 20, scale: 0.96 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 10, scale: 0.97 }}
//             transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//             onClick={(e) => e.stopPropagation()}
//             className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
//           >
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-xl font-black text-[#cee5ff]">Write a Review</h3>
//               <button onClick={onClose} className="text-[#a3cbf2]/40 hover:text-[#cee5ff] transition-colors">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="mb-5 p-3 rounded-xl bg-[#001526] border border-white/5">
//               <div className="flex gap-3">
//                 <div className="w-12 h-12 rounded-lg bg-sky-400/10 border border-sky-400/20 flex items-center justify-center overflow-hidden shrink-0">
//                   {booking.mainImageUrl ? (
//                     <img 
//                       src={getImageUrl(booking.mainImageUrl)} 
//                       alt={booking.tripTitle} 
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.style.display = 'none';
//                         e.target.parentElement.innerHTML = '<svg class="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>';
//                       }}
//                     />
//                   ) : (
//                     <Ship size={20} className="text-sky-400" />
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h4 className="font-bold text-[#cee5ff] truncate">{booking.tripTitle}</h4>
//                   <p className="text-xs text-[#a3cbf2]/60 mt-0.5">
//                     {formatDate(booking.startDate)}
//                   </p>
//                   <p className="text-xs text-[#a3cbf2]/60">
//                     {booking.numberOfParticipants} guests • ${booking.totalPrice}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm text-[#a3cbf2]/60 mb-2 block">Your Rating</label>
//                 <div className="flex gap-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       type="button"
//                       onClick={() => setRating(star)}
//                       onMouseEnter={() => setHoveredRating(star)}
//                       onMouseLeave={() => setHoveredRating(0)}
//                       className="focus:outline-none transition-transform hover:scale-110"
//                     >
//                       <Star
//                         size={32}
//                         className={`transition-all ${
//                           star <= (hoveredRating || rating)
//                             ? "text-amber-400 fill-amber-400"
//                             : "text-white/20 fill-none hover:text-white/30"
//                         }`}
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm text-[#a3cbf2]/60 mb-2 block">Your Review</label>
//                 <textarea
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   rows={4}
//                   placeholder="Share your experience with this trip..."
//                   className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all resize-none"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-2 mt-6">
//               <button
//                 onClick={onClose}
//                 className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.04] border border-white/5 text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-500 to-cyan-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     Submit Review
//                     <ChevronRight size={14} />
//                   </>
//                 )}
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// // ─── Profile Header ───────────────────────────────────────────────────────────
// const ProfileHeader = ({ profile, onEdit }) => {
//   const headerRef = useRef(null);
//   const glowRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.from(".ph-avatar", { opacity: 0, scale: 0.85, duration: 0.7, ease: "back.out(0.5)" });
//       gsap.from(".ph-line", { opacity: 0, y: 18, duration: 0.6, stagger: 0.08, delay: 0.15, ease: "power2.out" });
//       gsap.from(".ph-action", { opacity: 0, y: 12, duration: 0.5, delay: 0.45, ease: "back.out(0.4)" });
//       gsap.to(glowRef.current, { opacity: 0.6, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
//     }, headerRef);
//     return () => ctx.revert();
//   }, []);

//   const fullName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || "Guest User";
//   const initials = fullName.split(" ").map((n) => n[0]).slice(0, 2).join("");

//   return (
//     <div ref={headerRef} className="relative">
//       <div ref={glowRef} className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-sky-500/20 via-cyan-500/10 to-sky-500/20 opacity-30 blur-2xl pointer-events-none" />
//       <div className="relative bg-[#002238] border border-white/5 rounded-3xl p-6 md:p-8 overflow-hidden">
//         <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.12) 0%, transparent 70%)" }} />

//         <div className="relative flex flex-col md:flex-row md:items-center gap-6">
//           <div className="ph-avatar relative shrink-0 mx-auto md:mx-0">
//             <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-sky-400/30 to-cyan-500/20 border border-white/10 flex items-center justify-center text-3xl font-black text-[#cee5ff] shadow-lg shadow-sky-500/10 overflow-hidden">
//               {profile?.profilePictureUrl ? (
//                 <img src={getImageUrl(profile.profilePictureUrl)} alt={fullName} className="w-full h-full object-cover" />
//               ) : (
//                 initials
//               )}
//             </div>
//           </div>

//           <div className="flex-1 text-center md:text-left">
//             <div className="ph-line inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-3 py-1 mb-3 border border-sky-400/20">
//               <Anchor size={12} className="text-sky-400" />
//               <span className="text-[10px] text-sky-300 font-medium tracking-widest uppercase">Member</span>
//             </div>
//             <h1 className="ph-line text-3xl md:text-4xl font-black bg-gradient-to-r from-[#cee5ff] via-sky-200 to-[#53D6FB] bg-clip-text text-transparent">
//               {fullName}
//             </h1>
//             <div className="ph-line mt-3 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-[#a3cbf2]/70">
//               <span className="flex items-center gap-1.5"><Mail size={14} className="text-sky-400/80" />{profile?.email || "No email"}</span>
//               {profile?.phoneNumber && (
//                 <span className="flex items-center gap-1.5"><Phone size={14} className="text-sky-400/80" />{profile.phoneNumber}</span>
//               )}
//               {profile?.governorate && (
//                 <span className="flex items-center gap-1.5"><MapPin size={14} className="text-sky-400/80" />{profile.governorate}</span>
//               )}
//             </div>
//             {profile?.bio && (
//               <p className="ph-line mt-3 text-sm text-[#a3cbf2]/50 italic">{profile.bio}</p>
//             )}
//           </div>

//           <motion.button
//             onClick={onEdit}
//             className="ph-action shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-400/10 border border-sky-400/30 text-sky-300 font-semibold text-sm hover:bg-sky-400/20 transition-colors relative overflow-hidden"
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//           >
//             <span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 35%, rgba(83,214,251,0.18) 50%, transparent 65%)" }} />
//             <Pencil size={15} />
//             Edit Profile
//           </motion.button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Section heading ──────────────────────────────────────────────────────────
// const SectionTitle = ({ icon, title, sub }) => (
//   <div className="mb-5">
//     <div className="flex items-center gap-2 text-sky-400">
//       {icon}
//       <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{sub}</span>
//     </div>
//     <h2 className="text-2xl md:text-3xl font-black text-[#cee5ff] mt-1">{title}</h2>
//   </div>
// );

// // ─── Booking Card Component ───────────────────────────────────────────────────
// const BookingCard = ({ booking, onCancel, onWriteReview, hasReviewed, userReview, onReviewUpdated, onReviewDeleted }) => {
//   const [isOpen, setIsOpen] = useState(false);
  
//   const formatDate = (dateString) => {
//     if (!dateString) return "TBD";
//     return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//   };

//   const isCancellable = booking.status === 1 || booking.status === 2;
//   const isCompleted = booking.status === 5;
//   const canReview = isCompleted && !hasReviewed;
  
//   return (
//     <div className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-sky-400/30">
//       <div 
//         className="p-4 md:p-5 cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="flex gap-4">
//           <div className="w-16 h-16 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center shrink-0 overflow-hidden">
//             {booking.mainImageUrl ? (
//               <img 
//                 src={getImageUrl(booking.mainImageUrl)} 
//                 alt={booking.tripTitle} 
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.style.display = 'none';
//                   e.target.parentElement.innerHTML = '<svg class="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>';
//                 }}
//               />
//             ) : (
//               <Ship size={24} className="text-sky-400" />
//             )}
//           </div>
          
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 flex-wrap">
//               <h3 className="font-bold text-[#cee5ff] transition-colors truncate">{booking.tripTitle}</h3>
//               <StatusPill status={booking.status} type="booking" />
//             </div>
//             <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#a3cbf2]/60 mt-1.5">
//               <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(booking.startDate)}</span>
//               <span className="flex items-center gap-1"><Ship size={12} />{booking.boatName}</span>
//               <span className="flex items-center gap-1"><Users size={12} />{booking.numberOfParticipants} guests</span>
//             </div>
//             <div className="flex items-center gap-3 mt-2">
//               <span className="text-sky-400 font-bold text-lg">${booking.totalPrice}</span>
//               {booking.payment && <StatusPill status={booking.payment.status} type="payment" />}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
//             {canReview && (
//               <motion.button
//                 onClick={() => onWriteReview(booking)}
//                 className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-400/10 text-sky-400 border border-sky-400/20 hover:bg-sky-400/20 transition-colors flex items-center gap-1"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <Star size={12} />
//                 Write Review
//               </motion.button>
//             )}
            
//             {isCompleted && hasReviewed && (
//               <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 flex items-center gap-1 whitespace-nowrap">
//                 <Check size={12} />
//                 Reviewed
//               </span>
//             )}
            
//             {isCancellable && (
//               <button
//                 onClick={() => onCancel(booking.id)}
//                 className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-400/10 text-rose-300 border border-rose-400/20 hover:bg-rose-400/20 transition-colors"
//               >
//                 Cancel
//               </button>
//             )}
            
//             <ChevronRight size={16} className={`text-[#a3cbf2]/40 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//             className="overflow-hidden"
//           >
//             <div className="px-4 pb-4 md:px-5 md:pb-5 border-t border-white/5">
//               {hasReviewed && userReview ? (
//                 <ReviewManagement
//                   review={userReview}
//                   booking={booking}
//                   onReviewUpdated={onReviewUpdated}
//                   onReviewDeleted={onReviewDeleted}
//                 />
//               ) : isCompleted && !hasReviewed ? (
//                 <div className="text-center py-4 text-[#a3cbf2]/60">
//                   <p className="text-sm">You haven't written a review for this trip yet.</p>
//                   <button
//                     onClick={() => onWriteReview(booking)}
//                     className="mt-2 text-sky-400 text-sm hover:underline"
//                   >
//                     Write a review →
//                   </button>
//                 </div>
//               ) : (
//                 <div className="text-center py-4 text-[#a3cbf2]/40 text-sm">
//                   Review will be available after the trip is completed.
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ─── Bookings Section ─────────────────────────────────────────────────────────
//  const UserBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [confirmCancel, setConfirmCancel] = useState(null);
//   const [reviewModalOpen, setReviewModalOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [userReviews, setUserReviews] = useState({});
//   const [userReviewsData, setUserReviewsData] = useState({});
//   const listRef = useRef(null);

//   // Fetch user's own reviews from the dedicated endpoint
//   const fetchMyReviews = useCallback(async () => {
//     try {
//       const response = await apiClient.get("/api/Reviews/allroles/my-reviews/GetAll");
//       console.log("My reviews response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching my reviews:", error);
//       return [];
//     }
//   }, []);

//   // Fetch all bookings and user's reviews
//   const fetchBookings = useCallback(async () => {
//     try {
//       setLoading(true);
//       // Fetch bookings
//       const { data: bookingsData } = await apiClient.get("/api/Bookings/user/my-bookings");
//       setBookings(bookingsData);
      
//       // Fetch user's own reviews
//       const myReviews = await fetchMyReviews();
      
//       // Create maps for quick lookup
//       const reviewsMap = {};
//       const hasReviewedMap = {};
      
//       myReviews.forEach(review => {
//         reviewsMap[review.bookingId] = review;
//         hasReviewedMap[review.bookingId] = true;
//       });
      
//       setUserReviewsData(reviewsMap);
//       setUserReviews(hasReviewedMap);
      
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       toast.error("Failed to load bookings");
//     } finally {
//       setLoading(false);
//     }
//   }, [fetchMyReviews]);

//   useEffect(() => {
//     fetchBookings();
//   }, [fetchBookings]);

//   useEffect(() => {
//     if (!loading && listRef.current && bookings.length > 0) {
//       gsap.fromTo(
//         listRef.current.children,
//         { opacity: 0, y: 14 },
//         { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power2.out" }
//       );
//     }
//   }, [bookings, loading]);

//   const handleCancel = useCallback(async (id) => {
//     try {
//       await apiClient.put(`/api/Bookings/user/cancel/${id}`);
//       setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 0 } : b)));
//       toast.success("Booking cancelled successfully");
//       setConfirmCancel(null);
//     } catch (error) {
//       console.error("Error cancelling booking:", error);
//       toast.error("Failed to cancel booking");
//     }
//   }, []);

//   const handleWriteReview = useCallback((booking) => {
//     setSelectedBooking(booking);
//     setReviewModalOpen(true);
//   }, []);

//   const handleReviewSubmitted = useCallback(async (newReview) => {
//     if (selectedBooking) {
//       // Refresh reviews after submission
//       const myReviews = await fetchMyReviews();
//       const reviewsMap = { ...userReviewsData };
//       const hasReviewedMap = { ...userReviews };
      
//       myReviews.forEach(review => {
//         reviewsMap[review.bookingId] = review;
//         hasReviewedMap[review.bookingId] = true;
//       });
      
//       setUserReviewsData(reviewsMap);
//       setUserReviews(hasReviewedMap);
//     }
//     toast.success("Thank you for your review!");
//   }, [selectedBooking, userReviewsData, userReviews, fetchMyReviews]);

//   const handleReviewUpdated = useCallback(async (updatedReview) => {
//     // Refresh reviews after update
//     const myReviews = await fetchMyReviews();
//     const reviewsMap = {};
//     const hasReviewedMap = {};
    
//     myReviews.forEach(review => {
//       reviewsMap[review.bookingId] = review;
//       hasReviewedMap[review.bookingId] = true;
//     });
    
//     setUserReviewsData(reviewsMap);
//     setUserReviews(hasReviewedMap);
//   }, [fetchMyReviews]);

//   const handleReviewDeleted = useCallback(async (reviewId) => {
//     // Refresh reviews after deletion
//     const myReviews = await fetchMyReviews();
//     const reviewsMap = {};
//     const hasReviewedMap = {};
    
//     myReviews.forEach(review => {
//       reviewsMap[review.bookingId] = review;
//       hasReviewedMap[review.bookingId] = true;
//     });
    
//     setUserReviewsData(reviewsMap);
//     setUserReviews(hasReviewedMap);
//   }, [fetchMyReviews]);

//   return (
//     <section>
//       <SectionTitle icon={<Ship size={14} />} sub="Voyages" title="Your Trips" />
//       <div ref={listRef} className="space-y-3">
//         {bookings.length === 0 ? (
//           <div className="bg-[#002238] border border-dashed border-white/10 rounded-2xl py-12 text-center">
//             <Ship size={36} className="mx-auto text-white/15 mb-3" />
//             <p className="text-[#a3cbf2]/70 font-semibold">No bookings yet</p>
//             <p className="text-[#a3cbf2]/40 text-sm mt-1">Book your first adventure from the trips page!</p>
//           </div>
//         ) : (
//           bookings.map((booking) => (
//             <BookingCard
//               key={booking.id}
//               booking={booking}
//               hasReviewed={userReviews[booking.id] || false}
//               userReview={userReviewsData[booking.id]}
//               onCancel={(id) => setConfirmCancel(id)}
//               onWriteReview={handleWriteReview}
//               onReviewUpdated={handleReviewUpdated}
//               onReviewDeleted={handleReviewDeleted}
//             />
//           ))
//         )}
//       </div>

//       {/* Cancel confirmation modal */}
//       <AnimatePresence>
//         {confirmCancel && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setConfirmCancel(null)}
//             className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 20, scale: 0.96 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: 10, scale: 0.97 }}
//               onClick={(e) => e.stopPropagation()}
//               className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
//             >
//               <div className="flex items-start gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-rose-400/10 flex items-center justify-center shrink-0">
//                   <RotateCcw size={18} className="text-rose-300" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-bold text-[#cee5ff]">Cancel this booking?</h3>
//                   <p className="text-sm text-[#a3cbf2]/60 mt-1">
//                     You may forfeit part of your booking deposit depending on the cancellation policy.
//                   </p>
//                 </div>
//                 <button onClick={() => setConfirmCancel(null)} className="text-[#a3cbf2]/40 hover:text-[#cee5ff] transition-colors">
//                   <X size={18} />
//                 </button>
//               </div>
//               <div className="flex gap-2 mt-6">
//                 <button
//                   onClick={() => setConfirmCancel(null)}
//                   className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.04] border border-white/5 text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
//                 >
//                   Keep
//                 </button>
//                 <button
//                   onClick={() => handleCancel(confirmCancel)}
//                   className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-rose-400/15 border border-rose-400/30 text-rose-200 hover:bg-rose-400/25 transition-colors"
//                 >
//                   Yes, cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Review Modal */}
//       <ReviewModal
//         open={reviewModalOpen}
//         booking={selectedBooking}
//         onClose={() => {
//           setReviewModalOpen(false);
//           setSelectedBooking(null);
//         }}
//         onReviewSubmitted={handleReviewSubmitted}
//       />
//     </section>
//   );
// };

// // ─── Edit Profile Modal ───────────────────────────────────────────────────────
// const EditProfileModal = ({ open, profile, onClose, onSave }) => {
//   const [draft, setDraft] = useState({
//     firstName: "",
//     lastName: "",
//     phoneNumber: "",
//     governorate: "",
//     bio: "",
//     profilePicture: null,
//     profilePicturePreview: null,
//   });
//   const [showPasswordModal, setShowPasswordModal] = useState(false);

//   useEffect(() => {
//     if (profile && open) {
//       setDraft({
//         firstName: profile.firstName || "",
//         lastName: profile.lastName || "",
//         phoneNumber: profile.phoneNumber || "",
//         governorate: profile.governorate || "",
//         bio: profile.bio || "",
//         profilePicture: null,
//         profilePicturePreview: profile.profilePictureUrl ? getImageUrl(profile.profilePictureUrl) : null,
//       });
//     }
//   }, [profile, open]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setDraft(prev => ({
//           ...prev,
//           profilePicture: file,
//           profilePicturePreview: reader.result,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = () => {
//     onSave(draft);
//   };

//   return (
//     <>
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 20, scale: 0.96 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: 10, scale: 0.97 }}
//               transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//               onClick={(e) => e.stopPropagation()}
//               className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
//             >
//               <div className="flex items-center justify-between mb-5">
//                 <h3 className="text-xl font-black text-[#cee5ff]">Edit Profile</h3>
//                 <button onClick={onClose} className="text-[#a3cbf2]/40 hover:text-[#cee5ff] transition-colors">
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex justify-center">
//                   <div className="relative">
//                     <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-400/30 to-cyan-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
//                       {draft.profilePicturePreview ? (
//                         <img src={draft.profilePicturePreview} alt="Preview" className="w-full h-full object-cover" />
//                       ) : (
//                         <User size={32} className="text-sky-400/60" />
//                       )}
//                     </div>
//                     <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-sky-400 text-[#001526] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
//                       <Camera size={14} />
//                       <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-[10px] uppercase tracking-widest text-[#a3cbf2]/50 flex items-center gap-1.5 mb-1.5">
//                     <User size={14} />First Name
//                   </label>
//                   <input
//                     type="text"
//                     value={draft.firstName}
//                     onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
//                     className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-[10px] uppercase tracking-widest text-[#a3cbf2]/50 flex items-center gap-1.5 mb-1.5">
//                     <User size={14} />Last Name
//                   </label>
//                   <input
//                     type="text"
//                     value={draft.lastName}
//                     onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
//                     className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-[10px] uppercase tracking-widest text-[#a3cbf2]/50 flex items-center gap-1.5 mb-1.5">
//                     <Phone size={14} />Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     value={draft.phoneNumber}
//                     onChange={(e) => setDraft({ ...draft, phoneNumber: e.target.value })}
//                     className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-[10px] uppercase tracking-widest text-[#a3cbf2]/50 flex items-center gap-1.5 mb-1.5">
//                     <MapPin size={14} />Governorate
//                   </label>
//                   <input
//                     type="text"
//                     value={draft.governorate}
//                     onChange={(e) => setDraft({ ...draft, governorate: e.target.value })}
//                     className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-[10px] uppercase tracking-widest text-[#a3cbf2]/50 flex items-center gap-1.5 mb-1.5">
//                     <FileText size={14} />Bio
//                   </label>
//                   <textarea
//                     value={draft.bio}
//                     onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
//                     rows={3}
//                     className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all resize-none"
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-2 mt-6">
//                 <button
//                   onClick={() => setShowPasswordModal(true)}
//                   className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.04] border border-white/5 text-[#a3cbf2] hover:bg-white/[0.08] transition-colors inline-flex items-center justify-center gap-1.5"
//                 >
//                   <Lock size={14} />
//                   Change Password
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-sky-400 text-[#001526] hover:bg-sky-300 transition-colors inline-flex items-center justify-center gap-1.5"
//                 >
//                   <Check size={15} />
//                   Save
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <ChangePasswordModal 
//         open={showPasswordModal} 
//         onClose={() => setShowPasswordModal(false)} 
//       />
//     </>
//   );
// };

// // ─── Change Password Modal ────────────────────────────────────────────────────
// const ChangePasswordModal = ({ open, onClose }) => {
//   const { changePassword } = useProfile();
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (newPassword !== confirmPassword) {
//       toast.error("New passwords do not match");
//       return;
//     }
//     if (newPassword.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       await changePassword(currentPassword, newPassword);
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//       onClose();
//     } catch (error) {
//       // Error handled in context
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//           onClick={onClose}
//           className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 20, scale: 0.96 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 10, scale: 0.97 }}
//             onClick={(e) => e.stopPropagation()}
//             className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
//           >
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-xl font-black text-[#cee5ff]">Change Password</h3>
//               <button onClick={onClose} className="text-[#a3cbf2]/40 hover:text-[#cee5ff] transition-colors">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="text-[10px] uppercase tracking-widest text-[#a3cbf2]/50 flex items-center gap-1.5 mb-1.5">
//                   <Lock size={14} />Current Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showCurrent ? "text" : "password"}
//                     value={currentPassword}
//                     onChange={(e) => setCurrentPassword(e.target.value)}
//                     className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowCurrent(!showCurrent)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 hover:text-sky-400"
//                   >
//                     {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-[10px] uppercase tracking-widest text-[#a3cbf2]/50 flex items-center gap-1.5 mb-1.5">
//                   <Lock size={14} />New Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showNew ? "text" : "password"}
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowNew(!showNew)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 hover:text-sky-400"
//                   >
//                     {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-[10px] uppercase tracking-widest text-[#a3cbf2]/50 flex items-center gap-1.5 mb-1.5">
//                   <Lock size={14} />Confirm New Password
//                 </label>
//                 <input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-2 mt-6">
//               <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.04] border border-white/5 text-[#a3cbf2] hover:bg-white/[0.08] transition-colors">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-sky-400 text-[#001526] hover:bg-sky-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Changing..." : "Change Password"}
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// // ─── Main Profile Page ────────────────────────────────────────────────────────
// const ProfilePage = () => {
//   const { profile, loading, updateProfile, fetchProfile } = useProfile();
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [editOpen, setEditOpen] = useState(false);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const handleUpdateProfile = async (draft) => {
//     try {
//       const formData = {
//         firstName: draft.firstName,
//         lastName: draft.lastName,
//         phoneNumber: draft.phoneNumber,
//         governorate: draft.governorate,
//         bio: draft.bio,
//         profilePicture: draft.profilePicture,
//       };
//       await updateProfile(formData);
//       await fetchProfile();
//       setEditOpen(false);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#001526] flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-3 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-[#a3cbf2]/60">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#001526] text-[#cee5ff]">
//       <div className="space-y-10 pb-16 max-w-7xl mx-auto relative pt-8 px-4 md:px-8">
//         <AnimatedBackground />

//         <ProfileHeader profile={profile} onEdit={() => setEditOpen(true)} />
//         <UserBookings />

//         <EditProfileModal
//           open={editOpen}
//           profile={profile}
//           onClose={() => setEditOpen(false)}
//           onSave={handleUpdateProfile}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
// src/pages/USER_PAGES/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./../../components/APP_COMPONENTS/PROFILE_COMPONENTS/Sidebar";
import MobileRadialMenu from "./../../components/APP_COMPONENTS/PROFILE_COMPONENTS/MobileRadialMenu";
import SettingsTab from "./../../components/APP_COMPONENTS/PROFILE_COMPONENTS/SettingsTab";
import TripsTab from "./../../components/APP_COMPONENTS/PROFILE_COMPONENTS/TripsTab";
import OrdersTab from "./../../components/APP_COMPONENTS/PROFILE_COMPONENTS/OrdersTab";

const ProfilePage = () => {
  const { profile, loading, updateProfile, changePassword } = useProfile();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');
  const [isMobile, setIsMobile] = useState(false);

    // Make the page always open at the top
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001526] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-sky-400/30 border-t-sky-400 rounded-full" 
        />
      </div>
    );
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="min-h-screen bg-[#001526] text-[#cee5ff]">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />
      )}
      
      {/* Mobile Radial Menu */}
      {isMobile && (
        <MobileRadialMenu activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />
      )}

      {/* Main content */}
      <div className={`${!isMobile ? 'ml-64' : ''} p-4 md:p-8 min-h-screen overflow-hidden`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-7xl mx-auto"
          >
            {activeTab === 'settings' && (
              <SettingsTab profile={profile} updateProfile={updateProfile} changePassword={changePassword} />
            )}
            {activeTab === 'trips' && <TripsTab />}
            {activeTab === 'orders' && <OrdersTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;