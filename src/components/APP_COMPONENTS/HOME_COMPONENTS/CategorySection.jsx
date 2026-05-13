// src/components/Home/CategorySection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ship, ShoppingBag, Users, Compass  } from "lucide-react";

const categories = [
  { icon: Ship, label: "Trips", desc: "Offshore and inshore fishing adventures await you at the best locations." },
  { icon: ShoppingBag, label: "Marketplace", desc: "Top gear, lures, rods and accessories for every angler's need." },
  { icon: Users, label: "Community", desc: "Connect with fellow anglers, share stories, and join the fleet." },
  { icon: Compass, label: "Discover", desc: "Explore new destinations, read guides, and find your next catch." },
 ];

// --- Staggered Entrance Animation Variants for the whole group ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delays the next item by 0.1s
    },
  },
};

// --- Child Card Entrance Animation Variants ---
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30, // Start slightly below
    scale: 0.95, // Start slightly smaller
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Smooth custom ease
    },
  },
};

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20 relative z-10">
      {/* --- Container with staggered entry --- */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" // Triggers when in view
        viewport={{ once: true, amount: 0.3 }} // Ensures animation runs only once when 30% of item is in view
      >
        {categories.map(({ icon: Icon, label, desc }, index) => (
          <motion.div
            key={label}
            className="cat-card group cursor-pointer p-6 rounded-2xl bg-[#002238] border border-white/5 hover:border-sky-400/30 transition-all duration-300 text-center relative overflow-hidden"
            variants={cardVariants}
            // Passing index directly to `custom` can be useful for individual delays,
            // but the container staggered children is a cleaner solution here.
            // custom={index}
            whileHover={{
              y: -4,
              scale: 1.01,
              // Subtle inner glow on hover using an overlay
              backgroundImage: "radial-gradient(ellipse at top left, rgba(83,214,251,0.08), transparent 70%)",
            }}
            onClick={() => navigate("/trips")}
          >
            {/* --- Stronger icon box on hover (re-styled with deeper blue) --- */}
            <div className="w-14 h-14 rounded-2xl bg-sky-950 flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-900 group-hover:scale-110 transition-transform">
              <Icon size={26} className="text-sky-400" />
            </div>

            {/* --- Title --- */}
            <h3 className="text-[#cee5ff] font-extrabold text-sm mb-1">{label}</h3>

            {/* --- Description --- */}
            <p className="text-[#a3cbf2]/60 text-xs leading-relaxed max-w-[200px] mx-auto">{desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategorySection;