
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
                {/* Avatar Container */}
                <div className="w-10 h-10 rounded-full bg-[#00101c] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-sky-400/30 transition-colors overflow-hidden">
                  {product.sellerImageUrl ? (
                    <img 
                      src={getImageUrl(product.sellerImageUrl)} /* <-- Wrapped in getImageUrl here */
                      alt={product.sellerName || "Seller"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-[#a3cbf2]/40 group-hover:text-sky-400/60" />
                  )}
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