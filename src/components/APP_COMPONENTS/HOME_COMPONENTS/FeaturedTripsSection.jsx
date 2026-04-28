import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Clock, Star, ArrowRight } from "lucide-react";
import gsap from "gsap";

const featuredTrips = [
  {
    id: 1,
    title: "Red Sea Marlin Expedition",
    location: "Hurghada, Egypt",
    price: "$1,200",
    duration: "10 hours",
    rating: 4.9,
    tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Mediterranean Bluefin Chase",
    location: "Bodrum, Turkey",
    price: "$950",
    duration: "8 hours",
    rating: 4.8,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Abyssal Deep-Sea Expedition",
    location: "Nassau, Bahamas",
    price: "$1,500",
    duration: "12 hours",
    rating: 5.0,
    tag: "FEATURED",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
  },
];

const FeaturedTripsSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.from(".trip-card", {
            opacity: 0, y: 40, duration: 0.6, stagger: 0.12, ease: "back.out(0.3)"
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-3 py-1 mb-3 border border-sky-400/20">
            <Sparkles size={12} className="text-sky-400" />
            <span className="text-xs text-sky-300 font-semibold tracking-widest uppercase">Handpicked for You</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#cee5ff]">Featured Trips</h2>
        </div>
        <motion.button
          onClick={() => navigate("/trips")}
          className="hidden sm:flex items-center gap-2 text-sky-400 text-sm font-semibold hover:gap-3 transition-all"
          whileHover={{ x: 3 }}
        >
          View All <ArrowRight size={16} />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredTrips.map((trip) => (
          <motion.div
            key={trip.id}
            className="trip-card group cursor-pointer relative bg-[#002238] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300"
            whileHover={{ y: -6 }}
            onClick={() => navigate(`/trip/${trip.id}`)}
          >
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-sky-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />

            <div className="relative h-52 overflow-hidden">
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001526]/90 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full bg-sky-500/80 text-white uppercase">
                {trip.tag}
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-[#cee5ff] font-bold text-lg mb-1 group-hover:text-white transition-colors">{trip.title}</h3>
              <div className="flex items-center gap-1 text-[#a3cbf2]/60 text-sm mb-3">
                <MapPin size={13} className="text-sky-400" /> {trip.location}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#a3cbf2]/50">
                  <span className="flex items-center gap-1"><Clock size={12} className="text-sky-400/70" /> {trip.duration}</span>
                  <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /> {trip.rating}</span>
                </div>
                <span className="text-sky-400 font-black text-xl">{trip.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex sm:hidden justify-center mt-6">
        <motion.button
          onClick={() => navigate("/trips")}
          className="flex items-center gap-2 text-sky-400 text-sm font-semibold px-5 py-2.5 rounded-xl border border-sky-400/20 bg-sky-400/5"
          whileHover={{ scale: 1.02 }}
        >
          View All Trips <ArrowRight size={16} />
        </motion.button>
      </div>
    </section>
  );
};

export default FeaturedTripsSection;