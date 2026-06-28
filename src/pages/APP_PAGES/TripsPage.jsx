import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  MapPin, Clock, Users, Search, X, ChevronRight, Compass, 
  Waves, Ship, SlidersHorizontal, DollarSign, TrendingUp,
  ChevronDown
} from "lucide-react";
import gsap from "gsap";
import apiClient from "../../api/apiClient";
import { toast } from 'react-hot-toast';
import Breadcrumb from "../../components/APP_COMPONENTS/Breadcrumb"; 

const ease = [0.25, 0.46, 0.45, 0.94];

const TripCardSkeleton = () => (
  <div className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden">
    <div className="h-40 bg-[#001526] animate-pulse" />
    <div className="p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-[#001526] rounded-lg animate-pulse" />
          <div className="h-3 w-24 bg-[#001526] rounded-lg animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-[#001526] rounded-lg animate-pulse" />
      </div>
      <div className="flex gap-4 mb-4">
        <div className="h-4 w-20 bg-[#001526] rounded-lg animate-pulse" />
        <div className="h-4 w-20 bg-[#001526] rounded-lg animate-pulse" />
      </div>
      <div className="h-10 w-full bg-[#001526] rounded-xl animate-pulse" />
    </div>
  </div>
);

const AnimatedBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".orb-1", { x: 40, y: -30, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-2", { x: -50, y: 20, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-3", { scale: 1.1, opacity: 0.6, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, bgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="orb-1 absolute top-20 left-[10%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }} />
      <div className="orb-2 absolute bottom-20 right-[5%] w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }} />
      <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(83,214,251,0.04) 0%, transparent 60%)" }} />
      
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-sky-400/20"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );
};

const FilterPanel = ({ searchParams, updateUrl, isOpen, setIsOpen }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(panelRef.current, 
        { opacity: 0, y: -20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(0.3)" }
      );
    }
  }, [isOpen]);

  const locations = ["All", "Hurghada Marina", "Ras Mohammed", "Alexandria Eastern Harbor", "El Gouna Marina"];
  const currentLocation = searchParams.get("locationName") || "All";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 6000;

  const handleLocationChange = (loc) => {
    updateUrl({ locationName: loc === "All" ? null : loc });
  };

  const handleMinPriceChange = (e) => {
    updateUrl({ minPrice: Number(e.target.value) || null });
  };

  const handleMaxPriceChange = (e) => {
    const val = Number(e.target.value);
    updateUrl({ maxPrice: val >= 6000 ? null : val });
  };

  const handleResetFilters = () => {
    updateUrl({ locationName: null, minPrice: null, maxPrice: null });
  };

  const hasActiveFilters = searchParams.get("locationName") || searchParams.get("minPrice") || searchParams.get("maxPrice");

  return (
    <div className="relative z-20">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#002238] border border-white/5 text-[#a3cbf2] text-sm font-medium hover:border-white/10 transition-all shadow-sm cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SlidersHorizontal size={16} className="text-sky-400" />
        Filters
        {hasActiveFilters && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-sky-400" />}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 bg-[#002238] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-sm z-30"
          >
            <div className="space-y-5">
              <div>
                <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider mb-2 block">Location</label>
                <div className="flex flex-wrap gap-2">
                  {locations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => handleLocationChange(loc)}
                      className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                        (loc === "All" && !searchParams.get("locationName")) || currentLocation === loc
                          ? "bg-sky-500/20 text-sky-400 border border-sky-400/40"
                          : "bg-[#001526] text-[#94A3B8] border border-white/5 hover:border-white/10"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider mb-2 block">Price Range</label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <span className="text-[10px] text-[#64748B]">Min ($)</span>
                    <input
                      type="range" min={0} max={6000} step={100} value={minPrice} onChange={handleMinPriceChange}
                      className="w-full h-1 bg-[#001526] rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                    <span className="text-xs text-sky-400">${minPrice}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-[#64748B]">Max ($)</span>
                    <input
                      type="range" min={0} max={6000} step={100} value={maxPrice} onChange={handleMaxPriceChange}
                      className="w-full h-1 bg-[#001526] rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                    <span className="text-xs text-sky-400">${maxPrice}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetFilters}
                className="w-full mt-2 py-2 rounded-lg border border-white/10 text-xs text-[#a3cbf2]/60 hover:text-sky-400 hover:border-sky-400/30 transition-all hover:bg-white/5 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SortingDropdown = ({ searchParams, updateUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentSort = searchParams.get("sortBy") || "none";

  const options = [
    { value: "none", label: "Default Order", icon: TrendingUp },
    { value: "price_asc", label: "Price: Low to High", icon: DollarSign },
    { value: "price_desc", label: "Price: High to Low", icon: DollarSign },
  ];

  const selectedLabel = useMemo(() => 
    options.find(opt => opt.value === currentSort)?.label || "Sort by",
    [currentSort]
  );

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(dropdownRef.current,
        { opacity: 0, y: -10, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(0.4)" }
      );
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#002238] border border-white/5 text-[#a3cbf2] text-sm font-medium hover:border-white/10 transition-all shadow-sm cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <TrendingUp size={16} className="text-sky-400" />
        {selectedLabel}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-56 bg-[#002238] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { updateUrl({ sortBy: opt.value === "none" ? null : opt.value }); setIsOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  currentSort === opt.value ? "bg-sky-500/10 text-sky-400" : "text-[#a3cbf2] hover:bg-[#001526]"
                }`}
              >
                <opt.icon size={14} className={currentSort === opt.value ? "text-sky-400" : "text-[#64748B]"} />
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SearchBar = ({ searchParams, updateUrl }) => {
  const [localQuery, setLocalQuery] = useState(searchParams.get("query") || "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setLocalQuery(searchParams.get("query") || "");
  }, [searchParams]);

  useEffect(() => {
    if (isFocused) {
      gsap.to(inputRef.current, { boxShadow: "0 0 0 2px rgba(83,214,251,0.2)", borderColor: "#53D6FB", duration: 0.3 });
    } else {
      gsap.to(inputRef.current, { boxShadow: "none", borderColor: "rgba(255, 255, 255, 0.05)", duration: 0.3 });
    }
  }, [isFocused]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      updateUrl({ query: val || null });
    }, 450);
  };

  return (
    <motion.div className="relative w-full max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "back.out(0.4)" }}>
      <div className="relative">
        <input
          ref={inputRef} type="text" value={localQuery} onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          placeholder="Search destinations, yachts or experiences..."
          className="w-full bg-[#002238] border border-white/5 rounded-xl py-4 pl-12 pr-12 text-sm text-[#cee5ff] focus:outline-none transition-all duration-300 placeholder:text-[#a3cbf2]/30 shadow-sm"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 transition-colors duration-300" style={{ color: isFocused ? "#53D6FB" : "" }} />
        {localQuery && (
          <button onClick={() => { setLocalQuery(""); updateUrl({ query: null }); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 hover:text-sky-400 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const TripCard = ({ trip, index, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

    if (cardRef.current) observer.observe(cardRef.current);
    return () => { if (cardRef.current) observer.unobserve(cardRef.current); };
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

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `https://hook.runasp.net${url}`;
  };

  if (isLoading) return <TripCardSkeleton />;

  const mainImage = trip.mainImageUrl || trip.images?.[0]?.imageUrl;
  const firstDate = trip.tripDates?.[0];
  const isExpired = firstDate?.remainingTimeText?.toLowerCase().includes("started or ended");

  return (
    <motion.div
      ref={cardRef} className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/trip/${trip.id}`)}
      initial={{ opacity: 0, y: 80 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div ref={glowRef} className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-sky-500/30 to-cyan-500/30 opacity-0 blur-xl transition-opacity duration-500" />
      
      <div className="relative bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10">
        <div className="relative h-48 overflow-hidden">
          {mainImage ? (
            <img ref={imageRef} src={getImageUrl(mainImage)} alt={trip.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center"><Ship size={48} className="text-sky-400/40" /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#002238] via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1">
            <Waves size={12} className="text-sky-400" />
            <span className="text-[10px] text-white/80 font-medium">{trip.boat?.name || trip.boatName}</span>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold text-[#cee5ff] group-hover:text-white transition-colors line-clamp-1">{trip.title}</h3>
              <div className="flex items-center gap-1 text-[#a3cbf2]/60 text-sm mt-1"><MapPin size={13} /> {trip.locationName}</div>
            </div>
            <div className="text-right">
              <span className="text-sky-400 font-bold text-xl">{trip.pricePerPerson} L.E</span>
              <span className="text-xs text-[#a3cbf2]/40 font-normal"> /person</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm text-[#a3cbf2]/60 mb-4 pb-3 border-b border-white/5">
            <span className={`flex items-center gap-1.5 text-xs font-semibold ${isExpired ? 'text-amber-400' : 'text-sky-400'}`}>
              <Clock size={13} /> {firstDate?.remainingTimeText || "Flexible Dates"}
            </span>
            <span className="flex items-center gap-1.5 ml-auto text-xs"><Users size={13} /> Max {trip.maxParticipants}</span>
          </div>
          
          <motion.button className="w-full py-2.5 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400 text-sm font-semibold flex items-center justify-center gap-2 overflow-hidden relative group/btn cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <span>View Trip Details</span>
            <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

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
        <Compass size={14} className="text-sky-400" /> <span className="text-xs text-sky-300 font-medium tracking-wide">EXPLORE THE OCEANS</span>
      </div>
      <h1 className="hero-title text-5xl md:text-6xl font-black bg-gradient-to-r from-[#cee5ff] via-sky-300 to-[#53D6FB] bg-clip-text text-transparent mb-3 pb-2 leading-tight">Chase the Horizon</h1>
      <p className="hero-subtitle text-[#a3cbf2]/60 text-lg max-w-2xl mx-auto">Discover extraordinary trips and create unforgettable memories on the open water</p>
    </div>
  );
};

const TripsPage = () => {
  const [rawTrips, setRawTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeQuery = searchParams.get("query");
  const activeLoc = searchParams.get("locationName");
  const activeMin = searchParams.get("minPrice");
  const activeMax = searchParams.get("maxPrice");
  const activeSort = searchParams.get("sortBy");

  const hasActiveFilters = activeLoc || activeMin || activeMax || activeQuery;

  const lastFetchedQueryRef = useRef(null);

  const updateUrl = useCallback((newKeys) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newKeys).forEach(([key, val]) => {
      if (val === null || val === "" || val === undefined) nextParams.delete(key);
      else nextParams.set(key, String(val));
    });
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const serverParamsString = useMemo(() => {
    const p = new URLSearchParams();
    if (activeQuery) p.set("query", activeQuery);
    if (activeLoc) p.set("locationName", activeLoc);
    if (activeMin) p.set("minPrice", activeMin);
    if (activeMax) p.set("maxPrice", activeMax);
    return p.toString();
  }, [activeQuery, activeLoc, activeMin, activeMax]);

  useEffect(() => {
    if (lastFetchedQueryRef.current === serverParamsString) return;
    lastFetchedQueryRef.current = serverParamsString;

    const fetchFilteredTrips = async () => {
      setIsLoading(true);
      try {
        const params = {
          pageNumber: 1,
          pageSize: 20,
          query: activeQuery || undefined,
          locationName: activeLoc || undefined,
          minPrice: activeMin || undefined,
          maxPrice: activeMax || undefined,
        };

        const { data } = await apiClient.get("/api/Trips/allroles/search", { params });
        setRawTrips(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        toast.error("Could not load trips matching parameters.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredTrips();
  }, [serverParamsString, activeQuery, activeLoc, activeMin, activeMax]); 

  const displayedTrips = useMemo(() => {
    let result = [...rawTrips];
    if (activeSort === "price_asc") {
      result.sort((a, b) => (a.pricePerPerson || 0) - (b.pricePerPerson || 0));
    } else if (activeSort === "price_desc") {
      result.sort((a, b) => (b.pricePerPerson || 0) - (a.pricePerPerson || 0));
    }
    return result;
  }, [rawTrips, activeSort]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto relative pt-8 px-4 md:px-8 min-h-screen bg-[#001526] text-[#cee5ff]">
      <AnimatedBackground />
      <div className="mb-4"><Breadcrumb /></div>
      <HeroSection />
      
      <SearchBar searchParams={searchParams} updateUrl={updateUrl} />
      
      <div className="flex flex-wrap justify-between items-center gap-3 mt-8 mb-6">
        <div className="flex gap-2 flex-1">
          <FilterPanel searchParams={searchParams} updateUrl={updateUrl} isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-[#a3cbf2]/40 hidden sm:inline">{displayedTrips.length} trips found</span>
            <SortingDropdown searchParams={searchParams} updateUrl={updateUrl} />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-6">
          {activeLoc && (
            <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-400/20 text-xs flex items-center gap-1.5 shadow-sm">
              Location: {activeLoc}
              <button onClick={() => updateUrl({ locationName: null })} className="hover:text-white cursor-pointer"><X size={12} /></button>
            </span>
          )}
          {(activeMin || activeMax) && (
            <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-400/20 text-xs flex items-center gap-1.5 shadow-sm">
              Price: ${activeMin || 0} - ${activeMax || 6000}
              <button onClick={() => updateUrl({ minPrice: null, maxPrice: null })} className="hover:text-white cursor-pointer"><X size={12} /></button>
            </span>
          )}
          {activeQuery && (
            <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-400/20 text-xs flex items-center gap-1.5 shadow-sm">
              Search: "{activeQuery}"
              <button onClick={() => updateUrl({ query: null })} className="hover:text-white cursor-pointer"><X size={12} /></button>
            </span>
          )}
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <TripCard key={i} trip={{}} index={i} isLoading={true} />)
        ) : displayedTrips.length > 0 ? (
          displayedTrips.map((trip, idx) => <TripCard key={trip.id} trip={trip} index={idx} isLoading={false} />)
        ) : (
          <div className="col-span-full text-center py-16">
            <Compass size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-[#a3cbf2]/60 text-lg">No trips match your search parameters</p>
            <button onClick={() => updateUrl({ query: null, locationName: null, minPrice: null, maxPrice: null })} className="mt-4 px-4 py-2 rounded-lg bg-sky-400/10 border border-sky-400/20 text-sky-400 text-sm cursor-pointer">
              Clear all parameters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;