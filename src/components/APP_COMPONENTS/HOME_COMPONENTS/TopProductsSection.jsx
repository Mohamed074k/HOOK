import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import gsap from "gsap";

const products = [
  {
    id: 1,
    name: "Titanium S-1 Reel",
    price: "$249.99",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    rating: 4.8,
  },
  {
    id: 2,
    name: "DeepScan G3 Device",
    price: "$189.00",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Elite Lure Master Kit",
    price: "$79.50",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=300&h=300&fit=crop",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Oceanic Storm Jacket",
    price: "$325.00",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop",
    rating: 4.6,
  },
];

const TopProductsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.from(".prod-card", {
            opacity: 0, y: 30, scale: 0.95,
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
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-[#cee5ff]">Top Products</h2>
        <motion.button
          className="hidden sm:flex items-center gap-2 text-sky-400 text-sm font-semibold border border-sky-400/20 px-4 py-2 rounded-xl hover:bg-sky-400/5 transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          Browse Marketplace <ArrowRight size={14} />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="prod-card group cursor-pointer bg-[#002238] border border-white/5 rounded-2xl overflow-hidden hover:border-sky-400/20 transition-all duration-300"
            whileHover={{ y: -4 }}
          >
            <div className="relative h-40 overflow-hidden bg-[#001526]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001526]/50 to-transparent" />
            </div>
            <div className="p-4">
              <h4 className="text-[#cee5ff] font-bold text-sm mb-1 line-clamp-1">{product.name}</h4>
              <div className="flex items-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-white/20"} />
                ))}
              </div>
              <span className="text-sky-400 font-black text-base">{product.price}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TopProductsSection;