// src/components/APP_COMPONENTS/HOME_COMPONENTS/HowItWorksSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Anchor } from "lucide-react";

const steps = [
  {
    num: "1",
    title: "Select Trip",
    desc: "Browse our handpicked maritime routes and choose your ideal destination and experience.",
  },
  {
    num: "2",
    title: "Book Dates",
    desc: "Reserve your trip easily with flexible booking options and secure your spot in advance.",
  },
  {
    num: "3",
    title: "Set Sail",
    desc: "Head to the marina, meet your crew, and get ready to explore Egypt's stunning waters.",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const HowItWorksSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative z-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="relative bg-[#002238] border border-white/5 rounded-[2rem] p-8 md:p-16 overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(160deg, rgba(0,34,56,0.9) 0%, rgba(0,21,38,0.9) 100%)",
        }}
      >
        {/* --- Background Watermark --- */}
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none transform -rotate-12">
          <Anchor size={400} />
        </div>

        {/* --- Title Section --- */}
        <motion.div variants={itemVariants} className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-[#cee5ff]">
            Your Journey Starts Here
          </h2>
          <div className="w-12 h-1 bg-[#53D6FB] mx-auto rounded-full mt-5 opacity-80" />
        </motion.div>

        {/* --- Steps Container --- */}
        <div className="relative z-10">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((step, index) => (
              <motion.div 
                key={step.num} 
                variants={itemVariants}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Circle */}
                <div className="w-16 h-16 rounded-full bg-[#001526] border border-[#243649] flex items-center justify-center mb-6 relative z-10 group-hover:border-sky-400/50 group-hover:shadow-[0_0_20px_rgba(83,214,251,0.15)] transition-all duration-300">
                  <span className="text-[#cee5ff] font-black text-xl group-hover:text-[#53D6FB] transition-colors">
                    {step.num}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-[#cee5ff] font-bold text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-[#a3cbf2]/60 text-sm leading-relaxed max-w-[260px]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;