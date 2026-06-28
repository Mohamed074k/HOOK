import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle visibility
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      // Calculate scroll percentage
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

   const circumference = 163.36;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[60] group"
          aria-label="Back to top"
        >
          {/* Progress Circle Container */}
          <div className="relative w-14 h-14 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="rgba(56, 189, 248, 0.15)" 
                strokeWidth="3"
              />
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="#38bdf8" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-out"
              />
            </svg>
            
            {/* Inner Button */}
            <div 
              className="absolute inset-2 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/5 bg-[#002238] group-hover:bg-[#001526]"
            >
              <ChevronUp size={24} className="text-sky-400 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </div>
          </div>
          
          {/* Percentage Text */}
          <div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2.5 py-1 rounded-full text-xs font-bold shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 bg-[#002238] text-sky-400 border border-white/10 whitespace-nowrap"
          >
            {Math.round(scrollProgress)}%
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;