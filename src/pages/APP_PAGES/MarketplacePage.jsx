import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, X, ChevronDown, SlidersHorizontal, 
  Sparkles, Package, ChevronLeft, ChevronRight, Grid, Square, List
} from "lucide-react";
import gsap from "gsap";
import apiClient from "../../api/apiClient";
import { toast } from 'react-hot-toast';
import ProductCard from "../../components/APP_COMPONENTS/MARKETPLACE_COMPONENTS/ProductCard";
import Breadcrumb from "../../components/APP_COMPONENTS/Breadcrumb"; 

// ─── Enums & Helpers ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, name: "Fishing Rods" },
  { id: 2, name: "Fishing Reels" },
  { id: 3, name: "Fishing Lines" },
  { id: 4, name: "Hooks & Rigs" },
  { id: 5, name: "Lures & Baits" },
  { id: 6, name: "Fishing Accessories" },
  { id: 7, name: "Fishing Clothing" },
  { id: 8, name: "Snorkeling & Diving" },
  { id: 9, name: "Boats & Marine Equipment" },
  { id: 10, name: "Storage & Bags" }
];

const CONDITIONS = [
  { id: 1, name: "New" },
  { id: 2, name: "Used" }
];

// ─── Animated Background ─────────────────────────────────────────────────────
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
    <div ref={bgRef} className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
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

// ─── Skeletons ───────────────────────────────────────────────────────────────
const ProductSkeleton = () => (
  <div className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden">
    <div className="h-48 sm:h-56 bg-[#001526] animate-pulse" />
    <div className="p-4 sm:p-5">
      <div className="h-5 w-3/4 bg-[#001526] rounded animate-pulse mb-3" />
      <div className="h-3 w-full bg-[#001526] rounded animate-pulse mb-1" />
      <div className="h-3 w-2/3 bg-[#001526] rounded animate-pulse mb-6" />
      <div className="flex justify-between items-center mb-5">
        <div className="h-8 w-24 bg-[#001526] rounded animate-pulse" />
        <div className="h-4 w-12 bg-[#001526] rounded animate-pulse" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 w-12 bg-[#001526] rounded-xl animate-pulse" />
        <div className="h-10 flex-1 bg-[#001526] rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);

// ─── Animated Empty State ────────────────────────────────────────────────────
const AnimatedEmptyState = ({ onReset }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="col-span-full bg-gradient-to-br from-[#002238] to-[#001526] border border-dashed border-white/10 rounded-3xl py-20 text-center shadow-xl relative overflow-hidden mt-6"
  >
    <div className="relative mb-6">
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <Package size={64} className="mx-auto text-sky-400/30" />
      </motion.div>
    </div>
    <h3 className="text-[#cee5ff] font-bold text-2xl mb-2">No products found</h3>
    <p className="text-[#a3cbf2]/60 text-sm mb-8 max-w-sm mx-auto">
      We couldn't find any items matching your current filters. Try adjusting your categories or price range.
    </p>
    <button
      onClick={onReset}
      className="px-8 py-3 rounded-xl bg-sky-400 text-[#001526] font-bold text-sm hover:bg-sky-300 transition-colors shadow-lg shadow-sky-400/20 uppercase tracking-widest"
    >
      Clear Filters
    </button>
  </motion.div>
);

// ─── Hero Section with GSAP animation  ───────────────────────────────────
const HeroSection = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", { opacity: 0, y: 30, duration: 0.8, ease: "back.out(0.5)" });
      gsap.from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: "power2.out" });
      gsap.from(".hero-badge", { opacity: 0, scale: 0.8, duration: 0.5, delay: 0.1, ease: "back.out(0.4)" });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="text-center mb-12">
      <div className="hero-badge inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-3 py-1 mb-4 border border-sky-400/20">
        <Sparkles size={16} className="text-sky-400" />
        <span className="text-xs text-sky-300 font-bold tracking-widest uppercase">The Gear Locker</span>
      </div>
      <h1 className="hero-title text-5xl md:text-6xl font-black bg-gradient-to-r from-[#cee5ff] via-sky-300 to-[#53D6FB] bg-clip-text text-transparent mb-3 pb-2">
        Equip the Voyage
      </h1>
      <p className="hero-subtitle text-[#a3cbf2]/60 text-lg max-w-2xl mx-auto">
        Hook the moment, own the adventure
      </p>
    </div>
  );
};

// ─── Filter Sidebar Component ────────────────────────────────────────────────
const FilterContent = ({ filters, setFilters, categories, conditions }) => {
  const [openSections, setOpenSections] = useState({ category: true, condition: true, price: true });
  const toggleSection = (sec) => setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));

  return (
    <div className="space-y-2">
      {/* Categories */}
      <div className="border-b border-white/5 py-4">
        <button onClick={() => toggleSection('category')} className="flex items-center justify-between w-full text-sm font-bold text-[#a3cbf2] uppercase tracking-widest hover:text-sky-400 transition-colors">
          <span>Category</span>
          <ChevronDown size={18} className={`transition-transform duration-300 ${openSections.category ? 'rotate-180' : ''}`} />
        </button>
        <div className={`grid transition-all duration-300 ${openSections.category ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
          <div className="overflow-hidden flex flex-col space-y-1">
            <button
              onClick={() => setFilters(prev => ({ ...prev, category: null }))}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${!filters.category ? 'text-sky-400 bg-sky-400/10 border border-sky-400/20' : 'text-[#a3cbf2]/70 hover:bg-[#001526] hover:text-[#cee5ff] border border-transparent'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filters.category === cat.id ? 'text-sky-400 bg-sky-400/10 border border-sky-400/20' : 'text-[#a3cbf2]/70 hover:bg-[#001526] hover:text-[#cee5ff] border border-transparent'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="border-b border-white/5 py-4">
        <button onClick={() => toggleSection('condition')} className="flex items-center justify-between w-full text-sm font-bold text-[#a3cbf2] uppercase tracking-widest hover:text-sky-400 transition-colors">
          <span>Condition</span>
          <ChevronDown size={18} className={`transition-transform duration-300 ${openSections.condition ? 'rotate-180' : ''}`} />
        </button>
        <div className={`grid transition-all duration-300 ${openSections.condition ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
          <div className="overflow-hidden flex flex-col space-y-1">
            <button
              onClick={() => setFilters(prev => ({ ...prev, condition: null }))}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${!filters.condition ? 'text-sky-400 bg-sky-400/10 border border-sky-400/20' : 'text-[#a3cbf2]/70 hover:bg-[#001526] hover:text-[#cee5ff] border border-transparent'}`}
            >
              Any Condition
            </button>
            {conditions.map(c => (
              <button
                key={c.id}
                onClick={() => setFilters(prev => ({ ...prev, condition: c.id }))}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filters.condition === c.id ? 'text-sky-400 bg-sky-400/10 border border-sky-400/20' : 'text-[#a3cbf2]/70 hover:bg-[#001526] hover:text-[#cee5ff] border border-transparent'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price Range (Min & Max) */}
      <div className="py-4">
        <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full text-sm font-bold text-[#a3cbf2] uppercase tracking-widest hover:text-sky-400 transition-colors">
          <span>Price Range</span>
          <ChevronDown size={18} className={`transition-transform duration-300 ${openSections.price ? 'rotate-180' : ''}`} />
        </button>
        <div className={`grid transition-all duration-300 ${openSections.price ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
          <div className="overflow-hidden space-y-4 px-2 py-1">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <span className="text-[10px] text-[#a3cbf2]/60 uppercase tracking-wider block mb-1">Min Price</span>
                <input
                  type="range" min="0" max="10000" step="50"
                  value={filters.minPrice || 0}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[#001526] accent-sky-400"
                />
                <div className="text-xs font-bold text-sky-400 mt-2">${filters.minPrice || 0}</div>
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-[#a3cbf2]/60 uppercase tracking-wider block mb-1">Max Price</span>
                <input
                  type="range" min="0" max="10000" step="50"
                  value={filters.maxPrice || 10000}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[#001526] accent-sky-400"
                />
                <div className="text-xs font-bold text-sky-400 mt-2">${filters.maxPrice || 10000}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Animated Search Bar Component  ─────────────────────────────────────
const AnimatedSearchBar = ({ value, onChange, onClear }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocused) {
      gsap.to(inputRef.current, {
        boxShadow: "0 0 0 2px rgba(83,214,251,0.2)",
        borderColor: "#53D6FB",
        duration: 0.3
      });
    } else {
      gsap.to(inputRef.current, {
        boxShadow: "none",
        borderColor: "rgba(255, 255, 255, 0.05)",
        duration: 0.3
      });
    }
  }, [isFocused]);

  return (
    <motion.div 
      className="relative w-full max-w-2xl mx-auto mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "back.out(0.4)" }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search deep sea reels, sonar, tackle..."
        className="w-full bg-[#002238] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm text-[#cee5ff] focus:outline-none transition-all duration-300 shadow-xl"
      />
      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400/50" />
      {value && (
        <button onClick={onClear} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 hover:text-sky-400 transition-colors">
          <X size={18} />
        </button>
      )}
    </motion.div>
  );
};

// ─── Main Page Component ─────────────────────────────────────────────────────
const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Mobile Layout View Toggle ('grid-2', 'grid-1', 'list')
  // Default to 'grid-2' (two columns) on mobile, with list as third option
  const [mobileLayout, setMobileLayout] = useState('grid-2');
  
  const searchTimeoutRef = useRef(null);

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    category: null,
    condition: null,
    minPrice: 0,
    maxPrice: 10000
  });

  // Fetch API
  const fetchProducts = useCallback(async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const params = {
        PageNumber: pageNum,
        PageSize: 12
      };
      
      if (filters.query) params.Query = filters.query;
      if (filters.category) params.Category = filters.category;
      if (filters.condition) params.Condition = filters.condition;
      if (filters.minPrice > 0) params.MinPrice = filters.minPrice;
      if (filters.maxPrice < 10000) params.MaxPrice = filters.maxPrice;

      const response = await apiClient.get("/api/marketplace/products/allroles/search", { params });
      const newData = response.data || [];
      
      setProducts(newData);
      setHasNextPage(newData.length === 12);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load marketplace products.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Trigger fetch on filter changes
  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [filters.category, filters.condition, filters.minPrice, filters.maxPrice]);

  // Debounced Search
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFilters(prev => ({ ...prev, query: val }));
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchProducts(1);
    }, 500);
  };

  const handleClearSearch = () => {
    setFilters(prev => ({ ...prev, query: "" }));
    fetchProducts(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchProducts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters({ query: "", category: null, condition: null, minPrice: 0, maxPrice: 10000 });
    setIsMobileFilterOpen(false);
  };

  // Get grid classes based on layout
  const getGridClasses = () => {
    if (mobileLayout === 'list') {
      return 'grid-cols-1';
    }
    if (mobileLayout === 'grid-1') {
      return 'grid-cols-1';
    }
    // grid-2 is default
    return 'grid-cols-2';
  };

    // Scroll to top on page load
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    
  return (
    <div className="min-h-screen bg-[#001526] text-[#cee5ff] relative overflow-hidden">
      <AnimatedBackground />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        
        {/* Breadcrumb - Added here */}
        <div className="mb-6">
          <Breadcrumb />
        </div>

        {/* Hero Section with GSAP Animation */}
        <HeroSection />

        {/* Animated Search Bar */}
        <AnimatedSearchBar 
          value={filters.query}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
        />

        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-[#002238] border border-white/5 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 text-[#cee5ff]">
                <SlidersHorizontal size={20} className="text-sky-400" />
                <h2 className="text-lg font-black">Filters</h2>
              </div>
              <FilterContent filters={filters} setFilters={setFilters} categories={CATEGORIES} conditions={CONDITIONS} />
              
              <button 
                onClick={resetFilters}
                className="w-full mt-6 py-3 rounded-xl border border-white/10 text-xs font-bold text-[#a3cbf2]/60 hover:text-sky-400 hover:border-sky-400/30 transition-all hover:bg-sky-400/5 uppercase tracking-widest"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Product Feed */}
          <div className="flex-1">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-transparent">
              
              {/* Mobile Controls (Filters + View Toggles) - List icon is the third option */}
              <div className="lg:hidden flex items-center justify-between w-full">
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-white/10 rounded-xl font-bold text-sm text-sky-400 hover:bg-white/5 transition-colors"
                >
                  <SlidersHorizontal size={16} /> Filters
                </button>

                <div className="flex bg-[#001526] border border-white/10 rounded-xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setMobileLayout('grid-2')}
                    className={`p-2 transition-colors ${mobileLayout === 'grid-2' ? 'bg-sky-400/20 text-sky-400' : 'text-[#a3cbf2]/60 hover:bg-white/5'}`}
                    title="2 Columns"
                  >
                    <Grid size={16} />
                  </button>
                  <button 
                    onClick={() => setMobileLayout('grid-1')}
                    className={`p-2 transition-colors border-x border-white/10 ${mobileLayout === 'grid-1' ? 'bg-sky-400/20 text-sky-400' : 'text-[#a3cbf2]/60 hover:bg-white/5'}`}
                    title="1 Column"
                  >
                    <Square size={16} />
                  </button>
                  <button 
                    onClick={() => setMobileLayout('list')}
                    className={`p-2 transition-colors ${mobileLayout === 'list' ? 'bg-sky-400/20 text-sky-400' : 'text-[#a3cbf2]/60 hover:bg-white/5'}`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* Desktop Result Count */}
              <div className="hidden lg:block text-sm font-bold text-[#a3cbf2]/60 w-full text-left">
                {products.length} Products Found
              </div>
            </div>

            {/* Grid & Pagination Container */}
            {isLoading && page === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={page}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`grid gap-4 sm:gap-6
                      ${getGridClasses()}
                      sm:grid-cols-2 xl:grid-cols-3
                    `}
                  >
                    {products.map((product, idx) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        index={idx} 
                        layout={mobileLayout === 'list' ? 'list' : 'grid'} 
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
                
                {/* Animated Pagination */}
                {(products.length === 12 || page > 1) && (
                  <div className="mt-12 flex items-center justify-center gap-3">
                    <motion.button
                      whileHover={page > 1 ? { scale: 1.05 } : {}}
                      whileTap={page > 1 ? { scale: 0.95 } : {}}
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1 || isLoading}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#002238] border border-white/5 text-[#a3cbf2] hover:border-sky-400/30 hover:text-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </motion.button>
                    
                    <motion.div 
                      key={page}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-sky-400 text-[#001526] font-bold shadow-lg shadow-sky-400/20"
                    >
                      {page}
                    </motion.div>

                    <motion.button
                      whileHover={hasNextPage ? { scale: 1.05 } : {}}
                      whileTap={hasNextPage ? { scale: 0.95 } : {}}
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!hasNextPage || isLoading}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#002238] border border-white/5 text-[#a3cbf2] hover:border-sky-400/30 hover:text-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <AnimatedEmptyState onReset={resetFilters} />
            )}

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-[#001526] border-t border-white/10 rounded-t-3xl z-[101] h-[85vh] flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-lg font-black text-[#cee5ff]">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <FilterContent filters={filters} setFilters={setFilters} categories={CATEGORIES} conditions={CONDITIONS} />
              </div>
              <div className="p-6 border-t border-white/5 bg-transparent">
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-4 rounded-xl bg-sky-400 text-[#001526] font-bold text-sm tracking-widest uppercase hover:bg-sky-300 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketplacePage;