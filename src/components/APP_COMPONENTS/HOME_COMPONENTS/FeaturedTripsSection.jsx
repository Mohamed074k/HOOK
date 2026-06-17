// src/components/APP_COMPONENTS/HOME_COMPONENTS/FeaturedTripsSection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, MapPin, ArrowRight, Anchor } from "lucide-react";
// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import { toast } from 'react-hot-toast';
import apiClient from "../../../api/apiClient";

import 'swiper/css';
import 'swiper/css/free-mode';

// Helper function to format image URLs
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  const baseUrl = import.meta.env.VITE_API_URL || "https://hook.runasp.net";
  return `${baseUrl}${url}`;
};

// --- Animation Variants ---
const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const swiperContainerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      delay: 0.2,
      ease: "easeOut" 
    }
  }
};

const FeaturedTripsSection = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch trips from API
  useEffect(() => {
    const fetchFeaturedTrips = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/api/Community/home/trips");
        setTrips(response.data || []);
      } catch (error) {
        console.error("Error fetching featured trips:", error);
        toast.error("Failed to load featured trips.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedTrips();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-0 md:px-8 py-16 overflow-hidden">
      {/* --- Header --- */}
      <motion.div 
        className="flex items-end justify-between mb-8 px-4 md:px-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={headerVariants}
      >
        <div>
          <div className="inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-3 py-1 mb-2 md:mb-3 border border-sky-400/20">
            <Sparkles size={12} className="text-sky-400" />
            <span className="text-[10px] md:text-xs text-sky-300 font-semibold tracking-widest uppercase">Handpicked for You</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-[#cee5ff]">Featured Trips</h2>
        </div>
        
        {/* View All Button */}
        <motion.button
          onClick={() => navigate("/trips")}
          className="flex items-center gap-1.5 md:gap-2 text-sky-400 text-xs md:text-sm font-semibold hover:gap-2 md:hover:gap-3 transition-all pb-1 md:pb-0"
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.95 }}
        >
          View All <ArrowRight size={14} className="md:w-4 md:h-4" />
        </motion.button>
      </motion.div>

      {/* --- Swiper Carousel --- */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={swiperContainerVariants}
        className="pl-4 md:pl-0 pr-4 md:pr-0" 
      >
        <Swiper
          modules={[FreeMode, Mousewheel]}
          freeMode={true}
          mousewheel={{ forceToAxis: true }}
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            768: { slidesPerView: 2.5, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 3.2, spaceBetween: 28 },
          }}
          className="pb-8 pt-4 !-mt-4"
        >
          {isLoading ? (
            /* Loading Skeletons matching the new design */
            [...Array(4)].map((_, i) => (
              <SwiperSlide key={`skeleton-${i}`} className="h-auto">
                <div className="flex flex-col gap-4 animate-pulse">
                  {/* Adjusted skeleton height for desktop */}
                  <div className="w-full aspect-[4/5] lg:aspect-[4/4.6] bg-[#002238] rounded-3xl" />
                  <div className="px-2">
                    <div className="h-3 w-1/3 bg-[#002238] rounded mb-2" />
                    <div className="h-6 w-3/4 bg-[#002238] rounded" />
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : trips.length > 0 ? (
            /* Trip Slides */
            trips.map((trip) => (
              <SwiperSlide key={trip.id} className="h-auto">
                <motion.div
                  className="group cursor-pointer flex flex-col gap-4 h-full"
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/trip/${trip.id}`)}
                >
                  {/* Image Container - Slightly reduced height on lg screens */}
                  <div className="relative w-full aspect-[4/5] lg:aspect-[4/4.6] rounded-3xl overflow-hidden shadow-lg shadow-black/20">
                    {trip.imageUrl ? (
                      <img
                        src={getImageUrl(trip.imageUrl)}
                        alt={trip.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#002238] flex items-center justify-center">
                        <Anchor size={48} className="text-sky-400/20" />
                      </div>
                    )}
                    
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* New Price Tag Styles (Top Right) */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 z-10 shadow-lg shadow-black/20 group-hover:bg-white/10 transition-colors">
                      <span className="text-sm font-black text-white tabular-nums tracking-tight">
                        ${typeof trip.price === 'number' ? trip.price.toFixed(0) : trip.price}
                      </span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex flex-col px-1">
                    <div className="flex items-center gap-1.5 text-sky-400 mb-1.5">
                      <MapPin size={12} className="shrink-0" /> 
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest line-clamp-1">
                        {trip.locationName}
                      </span>
                    </div>
                    
                    <h3 className="text-[#cee5ff] font-bold text-xl md:text-2xl line-clamp-2 leading-tight group-hover:text-white transition-colors">
                      {trip.title}
                    </h3>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))
          ) : (
            /* Empty State */
            <div className="w-full py-12 text-center text-[#a3cbf2]/60">
              No featured trips available at the moment.
            </div>
          )}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default FeaturedTripsSection;