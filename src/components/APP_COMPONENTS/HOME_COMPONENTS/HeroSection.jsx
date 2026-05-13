import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Anchor, Compass, ChevronRight, Ship, ChevronDown } from "lucide-react";
import gsap from "gsap";

const HeroSection = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: "power2.out" });
      gsap.from(".hero-h1",      { opacity: 0, y: 40, duration: 0.8, delay: 0.4, ease: "back.out(0.5)" });
      gsap.from(".hero-sub",     { opacity: 0, y: 20, duration: 0.6, delay: 0.7, ease: "power2.out" });
      gsap.from(".hero-ctas",    { opacity: 0, y: 20, duration: 0.6, delay: 0.9, ease: "power2.out" });
      gsap.from(".hero-card",    { opacity: 0, y: 20, duration: 0.6, delay: 1.1, ease: "power2.out" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[65vh] md:min-h-[70vh] lg:min-h-[65vh] flex items-center overflow-hidden"
      style={{ background: "#0a1628" }}
    >
      {/* Full-bleed boat background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Hero.png"
          alt="Boat on calm water"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center center" }}
        />
        {/* Dark overlay — heavier on the left so text is readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,20,40,0.82) 0%, rgba(8,20,40,0.55) 50%, rgba(8,20,40,0.15) 100%)",
          }}
        />
        {/* Subtle bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,20,40,0.6) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(83,214,251,0.3) 0, rgba(83,214,251,0.3) 1px, transparent 0, transparent 50%)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full pt-8 pb-8 md:pt-10 md:pb-8">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <div className="hero-eyebrow inline-flex items-center gap-2 mb-3 md:mb-4">
            <Anchor size={12} className="text-sky-300" />
            <span
              className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "#7dd3fc" }}
            >
              Elevate Your Sea Journey
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-h1 font-black leading-[1.08] mb-3 md:mb-4"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", color: "#ddeeff" }}
          >
            Experience
            <br />
            the{" "}
            <em
              className="not-italic"
              style={{
                fontStyle: "italic",
                background: "linear-gradient(90deg, #7dd3fc, #22d3ee, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Magic
            </em>{" "}
            of
            <br />
            Sailing
          </h1>

          {/* Sub-copy */}
          <p
            className="hero-sub text-xs md:text-sm lg:text-base leading-relaxed mb-5 md:mb-6 max-w-md"
            style={{ color: "rgba(163,203,242,0.75)" }}
          >
            Book unforgettable trips, shop premium fishing gear, connect with passionate
            anglers, and explore the sea with AI-powered insights. Discover new
            destinations, plan your perfect journey, and experience every moment on the
            water like never before.
          </p>

          {/* CTAs - smaller buttons for mobile */}
          <div className="hero-ctas flex flex-wrap gap-3 md:gap-4">
            <motion.button
              onClick={() => navigate("/trips")}
              className="flex items-center gap-2 px-5 md:px-6 py-2 md:py-2.5 rounded-full text-white font-bold text-[11px] md:text-sm uppercase tracking-wider"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                boxShadow: "0 0 24px rgba(14,165,233,0.45)",
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(14,165,233,0.65)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Ship size={14} className="md:w-[15px] md:h-[15px]" /> Book Trip
            </motion.button>

            <motion.button
              onClick={() => navigate("/trips")}
              className="flex items-center gap-2 px-5 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-[11px] md:text-sm tracking-wider transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#a3cbf2",
                backdropFilter: "blur(6px)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore <ChevronRight size={13} className="md:w-[15px] md:h-[15px]" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom-right "Know More" + "Awesome Memories" card cluster - only on desktop */}
      {isDesktop && (
        <div className="absolute bottom-10 right-6 lg:right-10 z-10 flex flex-col items-end gap-3 hero-card">
          {/* Know More pill */}
          <motion.button
            onClick={() => navigate("/trips")}
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
              boxShadow: "0 0 20px rgba(14,165,233,0.4)",
              color: "#fff",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Know More <ChevronRight size={14} />
          </motion.button>

          {/* Awesome Memories card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{
              background: "rgba(0,30,60,0.72)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(14,165,233,0.25)",
              minWidth: 220,
            }}
          >
            {/* Stacked avatar thumbnails */}
            <div className="flex -space-x-3 shrink-0">
              {[
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=80&h=80&fit=crop",
                "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=80&h=80&fit=crop",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=80&h=80&fit=crop",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                  style={{ border: "2px solid rgba(14,165,233,0.4)" }}
                />
              ))}
            </div>
            <div>
              <p className="text-xs font-black" style={{ color: "#ddeeff" }}>
                Awesome Memories
              </p>
              <p className="text-xs" style={{ color: "rgba(163,203,242,0.55)" }}>
                Explore the World, One Adventure<br />at a Time
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ color: "rgba(163,203,242,0.3)" }}
      >
        <ChevronDown size={16} className="md:w-[20px] md:h-[20px]" />
      </motion.div>
    </section>
  );
};

export default HeroSection;