import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, ChevronRight, ChevronDown, ShoppingCart, SlidersHorizontal,
  TrendingUp, DollarSign, Anchor, Package, Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { useCart } from "./../../context/CartContext";

// ─── Mock data with real images ───────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Apex Carbon Reel", price: 849, type: "New Release", desc: "Precision engineered for deep-sea saltwater expeditions.", image: "https://images.unsplash.com/photo-1583626270633-2af4134c5c1f?w=600&h=400&fit=crop", rating: 4.8, seller: "Nautilus Co.", inStock: 12 },
  { id: 2, name: "HydroScan V3", price: 1299, type: "Electronic", desc: "Real-time topographic sonar with depth-track tech.", image: "https://images.unsplash.com/photo-1505228395891-9a51e7c86b3b?w=600&h=400&fit=crop", rating: 4.9, seller: "DeepWave", inStock: 5 },
  { id: 3, name: "Deep Bait Master", price: 145, type: "Essentials", desc: "12 bioluminescent lures for night expeditions.", image: "https://images.unsplash.com/photo-1548601220-7fb15c81b142?w=600&h=400&fit=crop", rating: 4.6, seller: "Reef & Reel", inStock: 47 },
  { id: 4, name: "Nautical One Pro", price: 550, type: "Wearable", desc: "Tide-tracking GPS with 100m depth resistance.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop", rating: 4.7, seller: "TideTech", inStock: 22 },
  { id: 5, name: "Offshore Tackle Box", price: 320, type: "Essentials", desc: "Waterproof case with 24 modular compartments.", image: "https://images.unsplash.com/photo-1563780988679-b0d3c1df9e04?w=600&h=400&fit=crop", rating: 4.5, seller: "Reef & Reel", inStock: 18 },
  { id: 6, name: "CarbonFlex Rod 9ft", price: 720, type: "New Release", desc: "Ultra-light carbon fiber for precision casting.", image: "https://images.unsplash.com/photo-1552023611-884b182b9f2d?w=600&h=400&fit=crop", rating: 4.8, seller: "Nautilus Co.", inStock: 9 },
  { id: 7, name: "AquaVision Goggles", price: 240, type: "Wearable", desc: "Anti-fog optics for crystal underwater clarity.", image: "https://images.unsplash.com/photo-1573062553703-526893dc2e1e?w=600&h=400&fit=crop", rating: 4.4, seller: "DeepWave", inStock: 31 },
  { id: 8, name: "Storm Anchor 25kg", price: 410, type: "Essentials", desc: "Galvanized steel grip for heavy weather holds.", image: "https://images.unsplash.com/photo-1571624436279-b272aff752d5?w=600&h=400&fit=crop", rating: 4.9, seller: "HarborWorks", inStock: 14 },
  { id: 9, name: "Tempest Wind Meter", price: 189, type: "Electronic", desc: "Pocket anemometer with bluetooth telemetry.", image: "https://images.unsplash.com/photo-1581244276028-9df7d4aadcd9?w=600&h=400&fit=crop", rating: 4.3, seller: "TideTech", inStock: 26 },
];

const TYPES = ["All", "New Release", "Electronic", "Wearable", "Essentials"];

// ─── Skeleton with reduced image height ──────────────────────────────────────
const ProductSkeleton = () => (
  <div className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden">
    <div className="h-40 bg-[#001526] animate-pulse" />
    <div className="p-5">
      <div className="h-3 w-20 bg-[#001526] rounded animate-pulse mb-2" />
      <div className="h-5 w-32 bg-[#001526] rounded animate-pulse mb-2" />
      <div className="h-3 w-full bg-[#001526] rounded animate-pulse mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-6 w-16 bg-[#001526] rounded animate-pulse" />
        <div className="h-9 w-20 bg-[#001526] rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

// ─── Animated Background (unchanged) ─────────────────────────────────────────
const AnimatedBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".m-orb-1", { x: 40, y: -30, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".m-orb-2", { x: -50, y: 20, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".m-orb-3", { scale: 1.1, opacity: 0.6, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, bgRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="m-orb-1 absolute top-20 left-[10%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }} />
      <div className="m-orb-2 absolute bottom-20 right-[5%] w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }} />
      <div className="m-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(83,214,251,0.04) 0%, transparent 60%)" }} />
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-sky-400/20"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
      ))}
    </div>
  );
};

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".m-hero-title", { opacity: 0, y: 30, duration: 0.8, ease: "back.out(0.5)" });
      gsap.from(".m-hero-subtitle", { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: "power2.out" });
      gsap.from(".m-hero-badge", { opacity: 0, scale: 0.8, duration: 0.5, delay: 0.1, ease: "back.out(0.4)" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="text-center mb-12">
      <div className="m-hero-badge inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-3 py-1 mb-4 border border-sky-400/20">
        <Sparkles size={14} className="text-sky-400" />
        <span className="text-xs text-sky-300 font-medium tracking-wide">THE GEAR LOCKER</span>
      </div>
      <h1 className="m-hero-title text-5xl md:text-6xl font-black bg-gradient-to-r from-[#cee5ff] via-sky-300 to-[#53D6FB] bg-clip-text text-transparent mb-3 pb-2 leading-tight">
        Equip the Voyage
      </h1>
      <p className="m-hero-subtitle text-[#a3cbf2]/60 text-lg max-w-2xl mx-auto">
        Premium marine equipment, electronics and essentials from verified sellers
      </p>
    </div>
  );
};

// ─── Search Bar (unchanged) ──────────────────────────────────────────────────
const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;
    if (isFocused) {
      gsap.to(inputRef.current, { boxShadow: "0 0 0 2px rgba(83,214,251,0.2)", borderColor: "#53D6FB", duration: 0.3 });
    } else {
      gsap.to(inputRef.current, { boxShadow: "none", borderColor: "rgba(255,255,255,0.05)", duration: 0.3 });
    }
  }, [isFocused]);

  return (
    <motion.div className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "backOut" }}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search reels, electronics, wearables..."
          className="w-full bg-[#002238] border border-white/5 rounded-xl py-4 pl-12 pr-12 text-sm text-[#cee5ff] focus:outline-none transition-all duration-300 placeholder:text-[#a3cbf2]/30 shadow-sm"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: isFocused ? "#53D6FB" : "rgba(163,203,242,0.4)" }} />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 hover:text-sky-400 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Filter Panel (unchanged) ────────────────────────────────────────────────
const FilterPanel = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      gsap.fromTo(panelRef.current, { opacity: 0, y: -20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(0.3)" });
    }
  }, [isOpen]);

  const hasActive = filters.type !== "All" || filters.minPrice > 0 || filters.maxPrice < 1500;

  return (
    <div className="relative z-20">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#002238] border border-white/5 text-[#a3cbf2] text-sm font-medium hover:border-white/10 transition-all shadow-sm"
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      >
        <SlidersHorizontal size={16} className="text-sky-400" />
        Filters
        {hasActive && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-sky-400" />}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div ref={panelRef}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 bg-[#002238] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-sm z-30"
          >
            <div className="space-y-5">
              <div>
                <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button key={t}
                      onClick={() => setFilters({ ...filters, type: t })}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        filters.type === t
                          ? "bg-sky-500/20 text-sky-400 border border-sky-400/40"
                          : "bg-[#001526] text-[#94A3B8] border border-white/5 hover:border-white/10"
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider mb-2 block">Price Range</label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <span className="text-[10px] text-[#64748B]">Min</span>
                    <input type="range" min={0} max={1500} step={50} value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#001526] rounded-lg appearance-none cursor-pointer accent-sky-400" />
                    <span className="text-xs text-sky-400">${filters.minPrice}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-[#64748B]">Max</span>
                    <input type="range" min={0} max={1500} step={50} value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#001526] rounded-lg appearance-none cursor-pointer accent-sky-400" />
                    <span className="text-xs text-sky-400">${filters.maxPrice}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setFilters({ type: "All", minPrice: 0, maxPrice: 1500 })}
                className="w-full mt-2 py-2 rounded-lg border border-white/10 text-xs text-[#a3cbf2]/60 hover:text-sky-400 hover:border-sky-400/30 transition-all hover:bg-white/5"
              >Reset All Filters</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sorting Dropdown (unchanged) ────────────────────────────────────────────
const SortingDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: "price_asc", label: "Price: Low to High", icon: DollarSign },
    { value: "price_desc", label: "Price: High to Low", icon: DollarSign },
    { value: "rating", label: "Top Rated", icon: TrendingUp },
  ];

  const selectedLabel = useMemo(() => options.find((o) => o.value === sortBy)?.label || "Sort by", [sortBy]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      gsap.fromTo(dropdownRef.current, { opacity: 0, y: -10, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(0.4)" });
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <motion.button onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#002238] border border-white/5 text-[#a3cbf2] text-sm font-medium hover:border-white/10 transition-all shadow-sm"
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <TrendingUp size={16} className="text-sky-400" />
        {selectedLabel}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-56 bg-[#002238] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30">
            {options.map((opt) => (
              <button key={opt.value}
                onClick={() => { setSortBy(opt.value); setIsOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-all ${
                  sortBy === opt.value ? "bg-sky-500/10 text-sky-400" : "text-[#a3cbf2] hover:bg-[#001526]"
                }`}>
                <opt.icon size={14} className={sortBy === opt.value ? "text-sky-400" : "text-[#64748B]"} />
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Product Card (unchanged) ────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isHovered) {
      gsap.to(cardRef.current, { y: -6, duration: 0.4, ease: "power2.out" });
      gsap.to(imageRef.current, { scale: 1.05, duration: 0.5, ease: "power2.out" });
      gsap.to(glowRef.current, { opacity: 0.5, duration: 0.3 });
    } else {
      gsap.to(cardRef.current, { y: 0, duration: 0.4, ease: "power2.out" });
      gsap.to(imageRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
      gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
    }
  }, [isHovered]);

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 80 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{
        duration: 0.7,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1], // Custom smooth easing
      }}
    >
      <div ref={glowRef} className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-sky-500/30 to-cyan-500/30 opacity-0 blur-xl transition-opacity duration-500" />

      <div className="relative bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10">
        <div className="relative h-40 bg-gradient-to-br from-[#002c49] to-[#001526] overflow-hidden">
          <img
            ref={imageRef}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002238] via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1">
            <Anchor size={12} className="text-sky-400" />
            <span className="text-[10px] text-white/80 font-medium">{product.seller}</span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2 py-1">
            <span className="text-[10px] text-amber-300 font-semibold tabular-nums">★ {product.rating}</span>
          </div>
        </div>

        <div className="p-5">
          <span className="text-[10px] font-bold text-sky-400 tracking-widest uppercase">{product.type}</span>
          <h3 className="text-lg font-bold text-[#cee5ff] group-hover:text-white transition-colors line-clamp-1 mt-1">
            {product.name}
          </h3>
          <p className="text-[#a3cbf2]/60 text-sm mt-1 line-clamp-2 mb-4 pb-3 border-b border-white/5">
            {product.desc}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-[#a3cbf2]/60 mb-4">
            <span className="flex items-center gap-1.5">
              <Package size={13} className="text-sky-400/70" />
              {product.inStock} in stock
            </span>
          </div>

          <div className="flex justify-between items-center gap-3">
            <div>
              <span className="text-sky-400 font-bold text-2xl tabular-nums">${product.price}</span>
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="flex-1 py-2.5 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400 text-sm font-semibold flex items-center justify-center gap-2 overflow-hidden relative group/btn"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 rounded-xl pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 35%, rgba(83,214,251,0.15) 50%, transparent 65%)" }} />
              <ShoppingCart size={14} />
              <span>Add</span>
              <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price_asc");
  const [filters, setFilters] = useState({ type: "All", minPrice: 0, maxPrice: 1500 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.seller.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filters.type === "All" || p.type === filters.type;
      const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
      return matchesSearch && matchesType && matchesPrice;
    });

    if (sortBy === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [searchTerm, filters, sortBy]);

  const hasActiveFilters = filters.type !== "All" || filters.minPrice > 0 || filters.maxPrice < 1500;

  const clearAll = useCallback(() => {
    setSearchTerm("");
    setFilters({ type: "All", minPrice: 0, maxPrice: 1500 });
  }, []);

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style>{`
        /* For Webkit browsers (Chrome, Safari, Edge) */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #001526;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #38bdf8, #22d3ee);
        }
        
        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #0ea5e9 #001526;
        }
      `}</style>
      
      <div className="space-y-6 pb-12 max-w-7xl mx-auto relative pt-8 px-4 md:px-8 min-h-screen bg-[#001526] text-[#cee5ff]">
        <AnimatedBackground />

        <HeroSection />

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex flex-wrap justify-between items-center gap-3 mt-8 mb-6">
          <div className="flex gap-2 flex-1">
            <FilterPanel filters={filters} setFilters={setFilters} />
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-[#a3cbf2]/40 hidden sm:inline">
                {filteredProducts.length} items found
              </span>
              <SortingDropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center sm:hidden mb-4">
          <span className="text-xs text-[#a3cbf2]/40">{filteredProducts.length} items found</span>
        </div>

        {hasActiveFilters && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-6">
            {filters.type !== "All" && (
              <span className="px-2 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-400/20 text-xs flex items-center gap-1">
                Category: {filters.type}
                <button onClick={() => setFilters({ ...filters, type: "All" })}><X size={10} /></button>
              </span>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 1500) && (
              <span className="px-2 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-400/20 text-xs flex items-center gap-1">
                ${filters.minPrice} - ${filters.maxPrice}
                <button onClick={() => setFilters({ ...filters, minPrice: 0, maxPrice: 1500 })}><X size={10} /></button>
              </span>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} />)
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center py-16">
              <Package size={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-[#a3cbf2]/60 text-lg">No items match your search</p>
              <p className="text-[#a3cbf2]/40 text-sm mt-1">Try adjusting your filters or browsing other categories</p>
              <button onClick={clearAll}
                className="mt-4 px-4 py-2 rounded-lg bg-sky-400/10 border border-sky-400/20 text-sky-400 text-sm hover:bg-sky-400/20 transition-colors">
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default MarketplacePage;