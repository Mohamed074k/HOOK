import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Package } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { toast } from "react-hot-toast";

// Category mapping based on enum values
const CATEGORY_NAMES = {
  1: "Fishing Rods",
  2: "Fishing Reels",
  3: "Fishing Lines",
  4: "Hooks & Rigs",
  5: "Lures & Baits",
  6: "Fishing Accessories",
  7: "Fishing Clothing",
  8: "Snorkeling & Diving",
  9: "Boats & Marine Equipment",
  10: "Storage & Bags"
};

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  const baseUrl = import.meta.env.VITE_API_URL || "https://hook.runasp.net";
  return `${baseUrl}${url}`;
};

const getCategoryName = (categoryId) => {
  return CATEGORY_NAMES[categoryId] || "Accessories";
};

const ProductCard = ({ product, index, layout = "grid" }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer for scroll fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to cart");
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    navigate(`/marketplace/product/${product.id}`);
  };

  // ─── LIST LAYOUT (Horizontal) ────────────────────────────────────────────────
  if (layout === "list") {
    return (
      <div
        ref={cardRef}
        onClick={handleNavigate}
        className={`group bg-[#002238] rounded-2xl border border-white/5 hover:border-sky-400/20 shadow-sm hover:shadow-lg hover:shadow-sky-400/5 transition-all duration-500 overflow-hidden flex items-center p-3 gap-4 cursor-pointer ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="relative w-28 h-32 bg-[#001526] rounded-xl overflow-hidden flex-shrink-0">
          {product.mainImageUrl ? (
            <img
              src={getImageUrl(product.mainImageUrl)}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={24} className="text-sky-400/30" />
            </div>
          )}
          {product.condition === 1 && (
            <span className="absolute top-2 left-2 bg-sky-500/20 backdrop-blur-md text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-sky-400/30">
              NEW
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col py-1">
          <p className="text-[10px] font-bold text-sky-400/70 uppercase tracking-wider mb-1">
            {getCategoryName(product.category)}
          </p>
          <h3 className="font-bold text-[#cee5ff] text-sm mb-1 line-clamp-2 group-hover:text-sky-400 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">4.9</span>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <span className="font-black text-lg text-sky-400">
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full flex items-center justify-center text-sky-400 bg-[#001526] border border-sky-400/30 transition-transform hover:scale-110 hover:bg-sky-400/10 active:scale-95"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── GRID LAYOUT (Vertical Stack) ────────────────────────────────────────────
  return (
    <div
      ref={cardRef}
      className={`bg-[#002238] rounded-2xl overflow-hidden border border-white/5 hover:border-sky-400/20 transition-all duration-500 group flex flex-col shadow-sm ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div
        className="relative h-48 sm:h-56 overflow-hidden bg-[#001526] cursor-pointer"
        onClick={handleNavigate}
      >
        {product.mainImageUrl ? (
          <img
            src={getImageUrl(product.mainImageUrl)}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="text-sky-400/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002238] via-transparent to-transparent opacity-80" />
        {product.condition === 1 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-sky-500/20 backdrop-blur-md rounded-md border border-sky-400/30">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
              New
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <p className="text-[10px] font-bold text-sky-400/70 uppercase tracking-wider mb-1">
          {getCategoryName(product.category)}
        </p>
        <h3
          onClick={handleNavigate}
          className="text-base sm:text-lg font-bold text-[#cee5ff] hover:text-sky-400 transition-colors line-clamp-1 cursor-pointer"
        >
          {product.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#a3cbf2]/60 mt-1 line-clamp-2 leading-relaxed flex-1">
          {product.description || "Premium marine equipment built for endurance and high performance on the open water."}
        </p>

        <div className="flex justify-between items-center mt-4 mb-4">
          <span className="text-xl sm:text-2xl font-bold text-sky-400 tabular-nums">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">4.9</span>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="p-2 sm:p-2.5 rounded-xl border border-sky-400/30 bg-[#001526] hover:bg-sky-400/10 transition-colors flex items-center justify-center"
          >
            <ShoppingCart size={18} className="text-sky-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNavigate}
            className="flex-1 rounded-xl bg-[#001526] border border-sky-400/30 text-sky-400 hover:bg-sky-400/10 font-bold tracking-widest text-xs sm:text-sm transition-colors uppercase"
          >
            Buy Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;