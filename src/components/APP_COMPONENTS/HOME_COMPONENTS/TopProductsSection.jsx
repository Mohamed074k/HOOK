import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, Package, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import { toast } from 'react-hot-toast';
import apiClient from "../../../api/apiClient";

import 'swiper/css';
import 'swiper/css/free-mode';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  const baseUrl = import.meta.env.VITE_API_URL || "https://hook.runasp.net";
  return `${baseUrl}${url}`;
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const swiperContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } }
};

const TopProductsSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchTopProducts = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/api/Community/home/products");
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching top products:", error);
        toast.error("Failed to load top products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-0 md:px-8 py-16 overflow-hidden">
      <motion.div 
        className="flex items-end justify-between mb-10 px-4 md:px-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={headerVariants}
      >
        <div>
          <div className="inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-4 py-1.5 mb-3 md:mb-4 border border-sky-400/20">
            <Package size={12} className="text-sky-400" />
            <span className="text-[10px] md:text-xs text-sky-300 font-semibold tracking-widest uppercase">Premium Gear</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-[#cee5ff] tracking-tight">Top Products</h2>
        </div>
        
        <motion.button
          onClick={() => navigate("/marketplace")}
          className="flex items-center gap-2 text-sky-400 text-sm font-bold border border-sky-400/20 px-5 py-2.5 rounded-xl hover:bg-sky-400/10 hover:border-sky-400/40 transition-all mb-1 md:mb-0 shadow-lg shadow-sky-400/5"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="hidden sm:inline uppercase tracking-wider">Explore Marketplace</span>
          <span className="sm:hidden uppercase tracking-wider">Explore All</span>
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>

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
            480: { slidesPerView: 1.8, spaceBetween: 20 },
            768: { slidesPerView: 2.5, spaceBetween: 24 },
            1024: { slidesPerView: 3.2, spaceBetween: 28 },
            1280: { slidesPerView: 4, spaceBetween: 32 },
          }}
          className="pb-12 pt-4 !-mt-4"
        >
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <SwiperSlide key={`skeleton-${i}`} className="h-auto">
                <div className="bg-[#002238] border border-white/5 rounded-3xl overflow-hidden h-full min-h-[400px] animate-pulse flex flex-col">
                  <div className="h-52 bg-[#001526]" />
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div className="h-5 w-3/4 bg-[#001526] rounded" />
                    <div className="h-3 w-full bg-[#001526] rounded" />
                    <div className="h-3 w-5/6 bg-[#001526] rounded" />
                    <div className="mt-auto pt-4 flex justify-between items-center border-t border-white/5">
                      <div className="h-6 w-20 bg-[#001526] rounded" />
                      <div className="h-8 w-8 bg-[#001526] rounded-full" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <motion.div
                  className="group cursor-pointer bg-gradient-to-b from-[#002238] to-[#001526] border border-white/5 hover:border-sky-400/30 rounded-3xl overflow-hidden transition-all duration-500 h-full flex flex-col relative shadow-xl shadow-black/20"
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/marketplace/product/${product.id}`)}
                >
                  <div className="relative h-52 overflow-hidden bg-[#001526] flex-shrink-0">
                    {product.imageUrl ? (
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={48} className="text-sky-400/20" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001526] via-[#001526]/20 to-transparent opacity-80" />
                    
                    <div className="absolute top-4 right-4 bg-black/60 border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white">Top Rated</span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-10 -mt-6">
                    <h4 className="text-[#cee5ff] font-black text-lg md:text-xl my-2 line-clamp-2 leading-tight group-hover:text-sky-400 transition-colors" title={product.name}>
                      {product.title}
                    </h4>

                    <p className="text-sm text-[#a3cbf2]/60 line-clamp-2 leading-relaxed mb-6">
                      {product.description || "Premium maritime equipment built for endurance and high performance."}
                    </p>
                    
                    <div className="mt-auto pt-5 border-t border-white/5 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#a3cbf2]/50 uppercase tracking-wider mb-1">Current Price</span>
                        <span className="text-sky-400 font-black text-2xl tabular-nums tracking-tight">
                          ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-400 group-hover:text-[#001526] transition-all duration-300">
                        <Eye size={18} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))
          ) : (
            <div className="w-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-[#002238]/50">
              <Package size={48} className="mx-auto text-sky-400/30 mb-4" />
              <h3 className="text-xl font-bold text-[#cee5ff] mb-2">No Premium Gear Available</h3>
              <p className="text-[#a3cbf2]/60">Check back later for newly added top-tier products.</p>
            </div>
          )}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default TopProductsSection;