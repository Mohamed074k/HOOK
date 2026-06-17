// src/components/Home/CategorySection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ship, ShoppingBag, Users, BrainCircuit } from "lucide-react";

const categories = [
  { 
    path: "/trips", 
    icon: Ship, 
    label: "Trips", 
    desc: "Book curated maritime experiences with expert captains and premium vessels." 
  },
  { 
    path: "/marketplace", 
    icon: ShoppingBag, 
    label: "Marketplace", 
    desc: "Buy and sell premium fishing gear and maritime equipment globally." 
  },
  { 
    path: "/community", 
    icon: Users, 
    label: "Community", 
    desc: "Connect with a global network of anglers and share your latest trophies." 
  },
  { 
    path: "/", 
    icon: BrainCircuit, 
    label: "Discover", 
    desc: "Leverage AI to find the best fishing spots and weather conditions in real-time." 
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {categories.map(({ path, icon: Icon, label, desc }) => (
          <motion.div
            key={label}
            variants={cardVariants}
            onClick={() => navigate(path)}
             className="group relative cursor-pointer flex flex-col p-6 md:p-8 rounded-2xl bg-[#002238] border border-white/5 overflow-hidden transition-all duration-300"
            whileHover={{
              y: -5,
              borderColor: "rgba(83,214,251,0.3)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.4), 0 0 20px rgba(83,214,251,0.05) inset",
            }}
          >
             <div
              className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "radial-gradient(circle at 10% 10%, rgba(83,214,251,0.12) 0%, transparent 60%)",
              }}
            />

            <div className="mb-5 text-[#53D6FB] transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 origin-left">
              <Icon size={28} strokeWidth={1.5} />
            </div>

             <h3 className="text-[#cee5ff] font-semibold text-sm md:text-base mb-2.5 tracking-wide">
              {label}
            </h3>

             <p className="text-[#a3cbf2]/60 text-[11px] md:text-[13px] leading-relaxed">
              {desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategorySection;