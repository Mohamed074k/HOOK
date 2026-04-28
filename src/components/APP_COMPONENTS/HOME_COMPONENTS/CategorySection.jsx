import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ship, ShoppingBag, Users, Compass } from "lucide-react";
import gsap from "gsap";

const CategorySection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const categories = [
    { icon: Ship, label: "Trips", desc: "Offshore and inshore fishing adventures await you at the best locations." },
    { icon: ShoppingBag, label: "Marketplace", desc: "Top gear, lures, rods and accessories for every angler's need." },
    { icon: Users, label: "Community", desc: "Connect with fellow anglers, share stories, and join the fleet." },
    { icon: Compass, label: "Discover", desc: "Explore new destinations, read guides, and find your next catch." },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.from(".cat-card", {
            opacity: 0, y: 30, scale: 0.97,
            duration: 0.5, stagger: 0.1, ease: "back.out(0.4)"
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(({ icon: Icon, label, desc }) => (
          <motion.div
            key={label}
            className="cat-card group cursor-pointer p-5 rounded-2xl bg-[#002238] border border-white/5 hover:border-sky-400/30 transition-all duration-300 text-center"
            whileHover={{ y: -4 }}
            onClick={() => navigate("/trips")}
          >
            <div className="w-12 h-12 rounded-xl bg-sky-400/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-400/20 transition-colors">
              <Icon size={22} className="text-sky-400" />
            </div>
            <h3 className="text-[#cee5ff] font-bold text-sm mb-1">{label}</h3>
            <p className="text-[#a3cbf2]/50 text-xs leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;