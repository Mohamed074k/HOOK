import { NavLink, Link } from "react-router-dom";
import { Anchor, ShoppingCart, Menu, X, User, LayoutDashboard, Trash2, Package } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext"; 

// Helper for images
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  const baseUrl = import.meta.env.VITE_API_URL || "https://hook.runasp.net";
  return `${baseUrl}${url}`;
};

const NAV_LINKS = [
  { to: "/",         label: "Home" },
  { to: "/trips",      label: "Trips" },
  { to: "/marketplace",label: "Marketplace" },
  { to: "/community",  label: "Community" },
];

const getDashboardLink = (role) => {
  switch (role) {
    case "Admin":
      return { to: "/super-admin", label: "Dashboard", icon: LayoutDashboard };
    case "Seller":
      return { to: "/seller", label: "Dashboard", icon: LayoutDashboard };
    case "BoatOwner":
      return { to: "/boat-owner", label: "Dashboard", icon: LayoutDashboard };
    default:
      return { to: "/profile", label: "Profile", icon: User };
  }
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { user } = useAuth();
  const { cartItems, cartCount, cartTotal, removeFromCart } = useCart(); 

  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);

  const primaryRole = user?.role ? (Array.isArray(user.role) ? user.role[0] : user.role) : null;
  const dashboardLink = user ? getDashboardLink(primaryRole) : null;
  const isSpecialRole = primaryRole && ["Admin", "Seller", "BoatOwner"].includes(primaryRole);

  const getInitials = () => {
    if (!user?.name) return <User size={16} />;
    return user.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const itemVariants = {
    initial: { y: 0, opacity: 1 },
    animate: { y: 0, opacity: 1 }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const mobileItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <>
      <motion.nav
        ref={navbarRef}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-[#001526]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
            : "bg-[#001526]/70 backdrop-blur-md border-b border-white/5"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-screen-2xl mx-auto">
          {/* Logo */}
          <motion.div
            ref={logoRef}
            variants={itemVariants}
            initial="initial"
            animate="animate"
            whileHover={!isMobile ? { scale: 1.05 } : {}}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.5 }}>
                <Anchor className="text-sky-400" size={24} />
              </motion.div>
              <span className="bg-gradient-to-r from-[#cee5ff] to-sky-300 bg-clip-text text-transparent">
                HOOK
              </span>
            </Link>
          </motion.div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map(({ to, label }, index) => (
              <motion.div
                key={to}
                ref={el => linksRef.current[index] = el}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                whileHover={!isMobile ? { y: -2 } : {}}
              >
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `relative px-1 py-2 transition-colors duration-300 ${
                      isActive ? "text-sky-300" : "text-[#a3cbf2]/60 hover:text-[#cee5ff]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5">
            {/* Shopping Cart - Only for regular users */}
            {!isSpecialRole && (
              <motion.div
                variants={itemVariants}
                initial="initial"
                animate="animate"
                className="relative"
                onMouseEnter={() => !isMobile && setCartOpen(true)}
                onMouseLeave={() => !isMobile && setCartOpen(false)}
              >
                <Link 
                  to="/cart"
                  className="flex items-center justify-center p-2 cursor-pointer text-[#a3cbf2]/60 hover:text-sky-400 transition-colors relative"
                  onClick={() => setCartOpen(false)}
                >
                  <ShoppingCart size={20} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 border border-[#001526] rounded-full text-[10px] flex items-center justify-center text-white font-bold"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {/* Dropdown Container */}
                <AnimatePresence>
                  {cartOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-[#002238] border border-sky-400/30 rounded-xl p-4 shadow-2xl cursor-default z-50 overflow-hidden"
                    >
                      {cartCount === 0 ? (
                        <div className="text-center py-6">
                          <ShoppingCart size={32} className="mx-auto text-white/10 mb-3" />
                          <p className="text-sm font-medium text-[#cee5ff]">Your cart is empty</p>
                          <p className="text-xs text-[#a3cbf2]/50 mt-1">Add items to get started</p>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <h3 className="text-xs font-bold text-sky-400 tracking-wider uppercase mb-3 border-b border-white/5 pb-2">
                            Recent Items
                          </h3>
                          
                          <div className="max-h-60 overflow-y-auto pr-1 space-y-3 mb-4 custom-scrollbar">
                            {cartItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 bg-[#001526] p-2 rounded-xl border border-white/5 group">
                                <div className="w-12 h-12 bg-[#002238] rounded-lg overflow-hidden border border-white/5 shrink-0 flex items-center justify-center">
                                  {item.mainImageUrl || item.imageUrls?.[0] ? (
                                    <img 
                                      src={getImageUrl(item.mainImageUrl || item.imageUrls[0])} 
                                      alt={item.title || item.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package size={20} className="text-white/20" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-[#cee5ff] truncate">{item.title || item.name}</p>
                                  <p className="text-xs font-medium text-[#a3cbf2]/60 mt-0.5">
                                    {item.quantity} × <span className="text-sky-300">${item.price?.toFixed(2)}</span>
                                  </p>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    e.preventDefault();
                                    removeFromCart(item.id);
                                  }}
                                  className="p-1.5 text-rose-400/50 hover:text-rose-400 hover:bg-rose-400/10 rounded transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-white/10 pt-3 flex flex-col gap-3">
                            <div className="flex justify-between items-center text-sm font-bold">
                              <span className="text-[#a3cbf2]/60">Subtotal:</span>
                              <span className="text-sky-400 tabular-nums">${cartTotal?.toFixed(2)}</span>
                            </div>
                            <Link 
                              to="/cart" 
                              onClick={() => setCartOpen(false)}
                              className="w-full py-2.5 flex justify-center rounded-lg bg-sky-400 text-[#001526] font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(83,214,251,0.2)] hover:shadow-[0_0_25px_rgba(83,214,251,0.4)] transition-all"
                            >
                              Open Cart
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* User Avatar / Dashboard */}
            <motion.div
              variants={itemVariants}
              initial="initial"
              animate="animate"
              whileHover={!isMobile ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              {user ? (
                <Link
                  to={dashboardLink.to}
                  title={dashboardLink.label}
                  className={`flex items-center gap-2 rounded-lg font-bold text-sm transition-all ${
                    isSpecialRole
                      ? "bg-gradient-to-r from-sky-400 to-cyan-500 text-[#003353] px-4 py-2 hover:shadow-lg hover:shadow-sky-500/25"
                      : "w-9 h-9 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 hover:bg-sky-500/30 hover:border-sky-400/60"
                  }`}
                >
                  {isSpecialRole ? (
                    <>
                      <LayoutDashboard size={16} />
                      <span className="hidden sm:inline">{dashboardLink.label}</span>
                    </>
                  ) : (
                    <motion.span
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {initials}
                    </motion.span>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-sky-400 to-cyan-500 text-[#003353] px-5 py-2 rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all"
                >
                  Sign In
                </Link>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <motion.button
            className="md:hidden text-[#a3cbf2]/60 hover:text-sky-100 relative w-10 h-10 flex items-center justify-center"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
              className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-[73px] left-0 right-0 bg-[#001526]/95 backdrop-blur-xl border-t border-white/10 z-40 md:hidden overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4 text-sm font-medium">
                {NAV_LINKS.map(({ to, label }) => (
                  <motion.div
                    key={to}
                    variants={mobileItemVariants}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink
                      to={to}
                      end={to === "/"}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block py-2 transition-all duration-300 ${
                          isActive 
                            ? "text-sky-300 border-l-2 border-sky-400 pl-3" 
                            : "text-[#a3cbf2]/60 hover:text-[#cee5ff] hover:pl-3"
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  </motion.div>
                ))}

                {/* Shopping Cart in Mobile Menu */}
                {!isSpecialRole && (
                  <motion.div 
                    variants={mobileItemVariants}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/cart"
                      onClick={() => setMenuOpen(false)}
                      className="flex justify-between items-center text-[#a3cbf2]/60 hover:text-[#cee5ff] py-2 pr-2"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCart size={18} />
                        Cart
                      </div>
                      {cartCount > 0 && (
                        <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                )}

                <motion.div 
                  variants={mobileItemVariants} 
                  className="border-t border-white/10 pt-3"
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {user ? (
                    <Link
                      to={dashboardLink.to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 font-bold py-2 text-sky-400`}
                    >
                      {isSpecialRole ? (
                        <>
                          <LayoutDashboard size={18} />
                          {dashboardLink.label}
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-400/30 flex items-center justify-center text-sm font-bold">
                            {initials}
                          </div>
                          My Profile
                        </>
                      )}
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 text-sky-400 font-bold"
                    >
                      Sign In
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 34, 56, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(83, 214, 251, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(83, 214, 251, 0.5);
        }
      `}} />
    </>
  );
};

export default Navbar;