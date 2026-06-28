import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  }
};

const AIAssistantSection = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <motion.div 
        className="relative rounded-[2rem] overflow-hidden border border-sky-400/15 bg-[#002238] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #002238 0%, #001526 100%)" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(83,214,251,0.3) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(0,138,167,0.3) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start">
            <span className="text-[10px] md:text-xs text-sky-400 font-bold tracking-widest uppercase mb-4">
              Next-Gen Intelligence
            </span>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Smart Fishing with <br className="hidden md:block"/> AI
            </h2>
            
            <p className="text-[#a3cbf2]/70 text-sm md:text-base leading-relaxed mb-8 max-w-md">
              Ask Fish Guard AI anything. From identifying rare fish species to predicting the best harvest times based on lunar cycles and real-time weather data.
            </p>
            
            <motion.button
              onClick={() => navigate('/chatbot')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-[#001526] font-bold text-sm px-8 py-3.5 rounded-full hover:bg-sky-50 transition-colors shadow-lg cursor-pointer"
            >
              TRY NOW
            </motion.button>
          </div>

          <div className="p-8 md:p-12 lg:p-16 flex items-center justify-center lg:justify-end">
            {/* إزالة الـ backdrop-blur واستبداله بخلفية داكنة معتمة قليلاً */}
            <div className="w-full max-w-md bg-[#001526]/95 border border-white/5 rounded-3xl p-6 shadow-xl relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <span className="text-[11px] font-bold text-[#a3cbf2]/60 tracking-wider uppercase">
                  Fish Guard AI Active
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl rounded-tl-sm">
                  <p className="text-[#a3cbf2]/80 text-sm italic font-medium leading-relaxed">
                    "Where are the best spots for Marlin near the Red Sea tomorrow?"
                  </p>
                </div>
                
                <div className="bg-[#002238]/80 border border-cyan-500/20 p-4 rounded-2xl rounded-tr-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
                  <p className="text-cyan-400 text-sm font-medium leading-relaxed relative z-10">
                    "Current data suggests high activity near the Elphinstone Reef between 5 AM and 9 AM due to a favorable pressure drop..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AIAssistantSection;