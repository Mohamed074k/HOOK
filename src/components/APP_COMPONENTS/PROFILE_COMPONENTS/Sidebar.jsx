// src/pages/USER_PAGES/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Settings, Anchor, Package, LogOut, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const navItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'trips', label: 'My Trips', icon: Anchor },
    { id: 'orders', label: 'Orders', icon: Package },
  ];

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (isMobile) {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) {
      const timeout = setTimeout(() => {
        setIsHovered(false);
      }, 300);
      setHoverTimeout(timeout);
    }
  };

  // Desktop Sidebar (always visible, full width)
  if (!isMobile) {
    return (
      <div className="fixed left-0 top-0 h-screen w-64 bg-[#001526] border-r border-white/5 flex flex-col z-30 transition-all duration-300">
        <nav className="flex-1 px-4 py-20 space-y-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative overflow-hidden ${
                  isActive 
                    ? "bg-sky-400/10 text-sky-400 border border-sky-400/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]" 
                    : "text-[#a3cbf2]/60 hover:bg-white/[0.04] hover:text-[#cee5ff] border border-transparent"
                }`}
              >
                <Icon size={20} className={isActive ? "text-sky-400" : "text-[#a3cbf2]/50"} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 113, 133, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400/80 bg-rose-400/5 hover:text-rose-400 transition-colors border border-rose-400/10 hover:border-rose-400/30"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    );
  }

  // Mobile Sidebar (appears on hover)
  return (
    <>
      {/* Small visible tab on hover area */}
      <div 
        className="fixed left-0 top-0 h-screen z-40"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Small indicator that shows on the edge */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-sky-400/50 rounded-r-full" />
        
        {/* Menu icon that shows on hover area */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div className="p-2 rounded-lg bg-sky-400/10 border border-sky-400/20">
            <Menu size={20} className="text-sky-400" />
          </div>
        </div>

        {/* Sidebar that slides in on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute left-0 top-0 h-screen w-[280px] bg-[#001526] border-r border-white/5 flex flex-col shadow-2xl"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h2 className="text-lg font-bold text-[#cee5ff]">Menu</h2>
                <div className="w-8" /> {/* Spacer for alignment */}
              </div>

              <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        // Optional: auto-hide after click
                        setTimeout(() => setIsHovered(false), 200);
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-sky-400/10 text-sky-400 border border-sky-400/20" 
                          : "text-[#a3cbf2]/60 hover:bg-white/[0.04] hover:text-[#cee5ff] border border-transparent"
                      }`}
                    >
                      <Icon size={20} className={isActive ? "text-sky-400" : "text-[#a3cbf2]/50"} />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1 h-6 bg-sky-400 rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/5">
                <motion.button
                  onClick={() => {
                    onLogout();
                    setIsHovered(false);
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400/80 bg-rose-400/5 hover:text-rose-400 transition-colors border border-rose-400/10 hover:border-rose-400/30"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Sidebar;