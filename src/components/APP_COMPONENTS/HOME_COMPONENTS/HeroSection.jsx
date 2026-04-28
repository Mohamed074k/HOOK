import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Anchor, Compass, ChevronRight, Ship, Waves, ChevronDown } from "lucide-react";
import gsap from "gsap";
import AnimatedBackground from "./AnimatedBackground";

const HeroSection = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: "power2.out" });
      gsap.from(".hero-h1", { opacity: 0, y: 40, duration: 0.8, delay: 0.4, ease: "back.out(0.5)" });
      gsap.from(".hero-sub", { opacity: 0, y: 20, duration: 0.6, delay: 0.7, ease: "power2.out" });
      gsap.from(".hero-ctas", { opacity: 0, y: 20, duration: 0.6, delay: 0.9, ease: "power2.out" });
      gsap.from(".hero-stats", { opacity: 0, y: 20, duration: 0.6, delay: 1.1, ease: "power2.out" });
      gsap.from(".hero-image", { opacity: 0, x: 60, scale: 0.95, duration: 1, delay: 0.5, ease: "power3.out" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      <AnimatedBackground />

      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(83,214,251,0.3) 0, rgba(83,214,251,0.3) 1px, transparent 0, transparent 50%)", backgroundSize: "30px 30px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="hero-eyebrow inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-4 py-1.5 mb-6 border border-sky-400/20">
              <Anchor size={13} className="text-sky-400" />
              <span className="text-xs text-sky-300 font-semibold tracking-widest uppercase">Elevate Your Sea Journey</span>
            </div>

            <h1 className="hero-h1 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
              <span className="text-[#cee5ff]">Experience </span>
              <br />
              <span className="text-[#cee5ff]">the </span>
              <span className="italic bg-gradient-to-r from-sky-300 via-cyan-400 to-sky-500 bg-clip-text text-transparent">Magic</span>
              <br />
              <span className="text-[#cee5ff]">of Sailing</span>
            </h1>

            <p className="hero-sub text-[#a3cbf2]/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              From the calm inshore flats to the turbulent offshore, discover world-class fishing expeditions and sailing adventures that create memories to last a lifetime.
            </p>

            <div className="hero-ctas flex flex-wrap gap-4 mb-12">
              <motion.button
                onClick={() => navigate("/trips")}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(83,214,251,0.3)]"
                whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(83,214,251,0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                <Ship size={16} /> Book Trip
              </motion.button>
              <motion.button
                onClick={() => navigate("/trips")}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/10 text-[#a3cbf2] font-bold text-sm uppercase tracking-wider hover:border-sky-400/40 hover:text-sky-400 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Compass size={16} /> Explore
              </motion.button>
            </div>

            <div className="hero-stats flex flex-wrap gap-6">
              {[
                { val: "342+", label: "Trips Completed" },
                { val: "4.9★", label: "Avg Rating" },
                { val: "1,200+", label: "Happy Sailors" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-2xl font-black text-sky-400">{s.val}</span>
                  <span className="text-xs text-[#a3cbf2]/50 uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-image relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              style={{ height: 500 }}>
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&h=600&fit=crop"
                alt="Sailing"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000d1a]/80 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#000d1a]/30" />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-6 bg-[#002238]/80 backdrop-blur-md border border-sky-400/20 rounded-2xl p-4 max-w-[200px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center">
                    <Waves size={14} className="text-sky-400" />
                  </div>
                  <span className="text-xs text-[#cee5ff] font-semibold">Next Departure</span>
                </div>
                <p className="text-sky-400 font-black text-sm">May 15, 2024</p>
                <p className="text-[#a3cbf2]/50 text-xs mt-0.5">Gulf of Mexico</p>
              </motion.div>

              <motion.button
                onClick={() => navigate("/trips")}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-[#002238]/70 backdrop-blur-sm border border-white/10 text-[#a3cbf2] text-xs font-semibold hover:border-sky-400/40 hover:text-sky-400 transition-all"
              >
                Know More <ChevronRight size={14} />
              </motion.button>
            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-sky-400/10 pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full border border-cyan-400/10 pointer-events-none" />
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#a3cbf2]/30"
      >
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
};

export default HeroSection;