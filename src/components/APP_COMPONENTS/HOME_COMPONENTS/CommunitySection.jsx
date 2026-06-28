import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Quote, MessageCircle } from "lucide-react";
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

const getAvatarFallback = (name) => {
  const safeName = encodeURIComponent(name || "Sailor");
  return `https://ui-avatars.com/api/?name=${safeName}&background=0ea5e9&color=fff&rounded=true&bold=true`;
};

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const swiperContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } }
};

const CommunitySection = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchCommunityPosts = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/api/Community/home/posts");
        setPosts(response.data || []);
      } catch (error) {
        console.error("Error fetching community posts:", error);
        toast.error("Failed to load community posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityPosts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-0 md:px-8 py-16 overflow-hidden">
      <motion.div 
        className="flex flex-col items-center text-center mb-8 md:mb-12 px-4 md:px-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={headerVariants}
      >
        <div className="inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-3 py-1 mb-3 md:mb-4 border border-sky-400/20">
          <MessageSquare size={12} className="text-sky-400" />
          <span className="text-[10px] md:text-xs text-sky-300 font-semibold tracking-widest uppercase">Shared Experiences</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-[#cee5ff]">From the Community</h2>
        <p className="text-[#a3cbf2]/50 mt-2 md:mt-3 max-w-xl mx-auto text-[11px] md:text-sm">
          Real sailors, real adventures. See what our community is sharing.
        </p>
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
          spaceBetween={16}
          slidesPerView={1.15}
          breakpoints={{
            640: { slidesPerView: 2.1, spaceBetween: 16 },
            768: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="pb-8 pt-4 !-mt-4"
        >
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <SwiperSlide key={`skeleton-${i}`} className="h-auto">
                <div className="bg-[#002238] border border-white/5 rounded-2xl p-4 h-64 animate-pulse flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#001526]" />
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-24 bg-[#001526] rounded" />
                      <div className="h-2 w-12 bg-[#001526] rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-full bg-[#001526] rounded mb-2" />
                  <div className="h-4 w-5/6 bg-[#001526] rounded" />
                  <div className="mt-auto pt-4 flex gap-4">
                     <div className="h-3 w-16 bg-[#001526] rounded" />
                     <div className="h-3 w-16 bg-[#001526] rounded" />
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <SwiperSlide key={post.id} className="h-auto">
                <motion.div
                  className="group cursor-pointer bg-[#002238] border border-white/5 rounded-2xl overflow-hidden hover:border-sky-400/30 transition-all duration-300 h-full flex flex-col relative"
                  whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                  onClick={() => navigate("/community")}
                >
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-sky-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div 
                    className="p-4 flex items-center gap-3 border-b border-white/5 relative z-10 cursor-pointer group/user"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/community/profile/${post.ownerId}`);
                    }}
                  >
                    <img 
                      src={post.ownerImageUrl ? getImageUrl(post.ownerImageUrl) : getAvatarFallback(post.ownerName)} 
                      alt={post.ownerName} 
                      className="w-10 h-10 rounded-full border border-sky-400/30 object-cover bg-[#001526] group-hover/user:border-sky-400 transition-colors" 
                      onError={(e) => { e.target.src = getAvatarFallback(post.ownerName) }}
                    />
                    <div>
                      <h4 className="text-[#cee5ff] font-bold text-sm line-clamp-1 group-hover/user:text-sky-400 transition-colors">
                        {post.ownerName}
                      </h4>
                      <span className="text-[#a3cbf2]/40 text-xs">{timeAgo(post.date)}</span>
                    </div>
                  </div>

                  {post.postImageUrl && (
                    <div className="relative h-36 overflow-hidden flex-shrink-0">
                      <img 
                        src={getImageUrl(post.postImageUrl)} 
                        alt="Post media" 
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#002238] via-[#002238]/40 to-transparent" />
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1 relative z-10">
                    <div className="flex mb-4">
                      <Quote size={14} className="text-sky-400/50 flex-shrink-0 mt-0.5 mr-1" />
                      <p className="text-[#a3cbf2]/70 text-sm leading-relaxed line-clamp-3 group-hover:text-[#a3cbf2] transition-colors break-words">
                        {post.content}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center gap-4 text-[#a3cbf2]/60 text-xs font-semibold">
                      <div className={`flex items-center gap-1.5 transition-colors ${post.likesCount > 0 ? 'text-rose-400' : 'hover:text-rose-400'}`}>
                        <Heart size={14} className={post.likesCount > 0 ? "fill-rose-400 text-rose-400" : ""} />
                        <span>{post.likesCount}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                        <MessageCircle size={14} />
                        <span>{post.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))
          ) : (
            <div className="w-full py-12 text-center text-[#a3cbf2]/60">
              No recent community feeds.
            </div>
          )}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default CommunitySection;