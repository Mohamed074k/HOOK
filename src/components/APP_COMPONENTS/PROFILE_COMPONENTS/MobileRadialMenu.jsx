import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Anchor, Package, LogOut, Menu, X } from 'lucide-react';

const MobileRadialMenu = ({ activeTab, setActiveTab, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close the modal when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

   const navItems = [
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-sky-400', bg: 'bg-[#002238]', border: 'border-sky-400/40', angle: 90 }, // فوق
    { id: 'trips', label: 'My Trips', icon: Anchor, color: 'text-emerald-400', bg: 'bg-[#002238]', border: 'border-emerald-400/40', angle: 60 },
    { id: 'orders', label: 'Orders', icon: Package, color: 'text-amber-400', bg: 'bg-[#002238]', border: 'border-amber-400/40', angle: 30 },
    { id: 'logout', label: 'Logout', icon: LogOut, color: 'text-rose-400', bg: 'bg-[#002238]', border: 'border-rose-400/40', angle: 0, isAction: true } // يمين
  ];

   const RADIUS = 105;
  const getPosition = (angle) => {
    const radians = angle * (Math.PI / 180);
    return {
      x: Math.round(RADIUS * Math.cos(radians)),
      y: Math.round(-RADIUS * Math.sin(radians)) 
    };
  };

  const handleItemClick = (item) => {
    if (item.isAction) {
      onLogout();
    } else {
      setActiveTab(item.id);
    }
    setIsOpen(false);
  };

  if (!isMobile) return null;

  return (
    <>
      <style>
        {`
          @keyframes menu-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
            50% { box-shadow: 0 0 0 15px rgba(56, 189, 248, 0); }
          }
          .animate-menu-pulse { animation: menu-pulse 2s infinite; }
        `}
      </style>

       <div ref={containerRef} className="fixed bottom-6 left-6 z-[99999]">
        
         <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm -z-10"
              style={{ width: '100vw', height: '100vh', top: 0, left: 0 }} 
            />
          )}
        </AnimatePresence>

        {/*  (Radial Items) */}
        <AnimatePresence>
          {isOpen && navItems.map((item, index) => {
            const pos = getPosition(item.angle);
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, x: pos.x, y: pos.y, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: 0, y: 0, scale: 0.5, rotate: 45 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20, 
                  delay: (navItems.length - index) * 0.05 
                }}
                onClick={() => handleItemClick(item)}
                className={`absolute left-0 top-0 w-12 h-12 -ml-0 -mt-0 rounded-full flex items-center justify-center border-2 shadow-xl backdrop-blur-xl group transition-colors duration-300
                  ${item.bg} ${item.border} hover:bg-white/10
                  ${isActive ? `shadow-[0_0_15px_rgba(56,189,248,0.4)] border-${item.color.split('-')[1]}-400` : ''}
                `}
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <Icon size={20} className={item.color} />
                
              {/* Tooltip للاسم */}
               <span className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-[#001526]/95 border border-white/10 text-[#cee5ff] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
               {item.label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#001526] rotate-45 border-r border-b border-white/10"></div>
               </span>
                
                {isActive && (
                   <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-${item.color.split('-')[1]}-400`} />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>

         <motion.div
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          className="relative z-50"
        >
          {!isOpen && (
             <div className="absolute -inset-4 rounded-full border-2 border-sky-400/40 animate-menu-pulse pointer-events-none"></div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-2xl ${
              isOpen 
                ? 'bg-gradient-to-br from-sky-500 to-sky-600 border-sky-400/60 shadow-sky-500/50 rotate-90' 
                : 'bg-gradient-to-br from-sky-500 to-sky-600 border-sky-400/60 shadow-sky-500/50'
            }`}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </motion.div>

      </div>
    </>
  );
};

export default MobileRadialMenu;