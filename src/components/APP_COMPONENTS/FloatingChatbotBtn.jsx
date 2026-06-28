import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

const FloatingChatbotBtn = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Strict route exclusion logic
  const hiddenRoutes = ["/chatbot", "/login", "/register"];
  const isExcluded = hiddenRoutes.includes(pathname) || pathname.startsWith("/profile");

  return (
    <AnimatePresence>
      {!isExcluded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <motion.button
            onClick={() => navigate("/chatbot")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center justify-center gap-2.5 bg-[#002238]/90 hover:bg-[#002e4d] backdrop-blur-md text-white p-3.5 sm:px-5 sm:py-3.5 rounded-2xl sm:rounded-full border border-sky-400/30 shadow-[0_8px_32px_rgba(0,15,26,0.7)] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Ambient internal hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Pinging "AI Active" */}
            <span className="hidden sm:flex relative h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400"></span>
            </span>

            {/* Bot Icon */}
            <Bot size={22} className="text-sky-400 group-hover:rotate-12 transition-transform duration-300 shrink-0" />

            {/* Text (HIDDEN ON MOBILE) */}
            <span className="hidden sm:inline-block text-[13.5px] font-bold tracking-wide bg-gradient-to-r from-white via-[#cee5ff] to-sky-200 bg-clip-text text-transparent whitespace-nowrap">
              Fish Guard AI
            </span>

          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingChatbotBtn;