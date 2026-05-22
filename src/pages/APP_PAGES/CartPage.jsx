import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, Plus, Minus, ArrowLeft, CreditCard, 
  ShoppingBag, ShieldCheck, Anchor, Package 
} from "lucide-react";
import gsap from "gsap";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

// Helper for images
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  const baseUrl = import.meta.env.VITE_API_URL || "https://hook.runasp.net";
  return `${baseUrl}${url}`;
};

const CATEGORIES = {
  1: "Fishing Rods", 2: "Fishing Reels", 3: "Fishing Lines", 4: "Hooks & Rigs",
  5: "Lures & Baits", 6: "Fishing Accessories", 7: "Fishing Clothing", 
  8: "Snorkeling & Diving", 9: "Boats & Marine Equipment", 10: "Storage & Bags"
};

// ─── Animated Background ────────────────────────────────
const AnimatedBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".m-orb-1", { x: 40, y: -30, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".m-orb-2", { x: -50, y: 20, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".m-orb-3", { scale: 1.1, opacity: 0.6, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, bgRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#001526]">
      <div className="m-orb-1 absolute top-20 left-[10%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }} />
      <div className="m-orb-2 absolute bottom-20 right-[5%] w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }} />
      <div className="m-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(83,214,251,0.04) 0%, transparent 60%)" }} />
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-sky-400/20"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
      ))}
    </div>
  );
};

// ─── Main Cart Page ───────────────────────────────────────────────────────────
const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const pageRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".m-cart-title", { opacity: 0, y: -20, duration: 0.6, ease: "power2.out" });
      if (summaryRef.current) {
        gsap.from(summaryRef.current, { opacity: 0, x: 20, duration: 0.6, delay: 0.2, ease: "back.out(0.5)" });
      }
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleCheckout = () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to proceed to checkout", {
        icon: '🔐',
        duration: 4000,
        position: 'top-center',
      });
      // Redirect to login page with return URL
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    // If logged in, proceed to checkout
    setIsCheckingOut(true);
    
    // Small delay for loading state
    setTimeout(() => {
      navigate("/checkout");
      setIsCheckingOut(false);
    }, 300);
  };

  const shipping = cartTotal > 500 ? 0 : 25;
  const finalTotal = cartTotal + (cartItems.length > 0 ? shipping : 0);

  return (
    <div ref={pageRef} className="relative min-h-screen px-4 md:px-8 py-6 md:py-10 text-[#cee5ff] max-w-7xl mx-auto">
      <AnimatedBackground />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 m-cart-title">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#a3cbf2]/60 hover:text-sky-400 transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Shopping
          </button>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#cee5ff] via-sky-300 to-[#53D6FB] bg-clip-text text-transparent">
            Your Cart
          </h1>
        </div>
        <div className="bg-[#002238] border border-white/5 rounded-2xl px-5 py-3 hidden sm:flex items-center gap-4 shadow-lg shadow-black/20">
          <div className="p-2 bg-sky-400/10 rounded-xl text-sky-400">
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-[#a3cbf2]/50 uppercase tracking-wider mb-0.5">Total Items</div>
            <div className="font-black text-xl leading-none text-[#cee5ff]">{cartCount}</div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {cartItems.length === 0 ? (
          <motion.div 
            key="empty-cart"
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-[#002238] border border-white/5 rounded-3xl p-12 text-center max-w-2xl mx-auto mt-12 shadow-2xl"
          >
            <div className="w-24 h-24 bg-[#001526] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
              <Anchor size={40} className="text-sky-400/50" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-[#cee5ff]">Your cart is empty</h2>
            <p className="text-[#a3cbf2]/60 mb-8 max-w-md mx-auto">Looks like you haven't added any gear for your next voyage yet. Discover premium equipment in our marketplace.</p>
            <button 
              onClick={() => navigate("/marketplace")}
              className="px-8 py-3.5 rounded-xl bg-sky-400 text-[#001526] font-bold hover:bg-sky-300 hover:shadow-lg hover:shadow-sky-400/20 transition-all inline-flex items-center gap-2 tracking-widest uppercase text-sm"
            >
              <ShoppingBag size={18} /> Explore Gear
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="cart-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#002238] border border-white/5 rounded-2xl p-4 flex flex-row items-center gap-4 sm:gap-6 hover:border-white/10 transition-colors group relative overflow-hidden shadow-lg shadow-black/20"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#001526] rounded-xl flex items-center justify-center border border-white/5 shrink-0 relative overflow-hidden">
                      {item.mainImageUrl || item.imageUrls?.[0] ? (
                        <img 
                          src={getImageUrl(item.mainImageUrl || item.imageUrls[0])} 
                          alt={item.title || item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <Package size={32} className="text-white/10" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                        <div className="truncate pr-2 mb-1 sm:mb-0">
                          <span className="text-[10px] font-bold text-sky-400 tracking-widest uppercase bg-sky-400/10 px-2 py-0.5 rounded">
                            {CATEGORIES[item.category] || item.categoryName || "Gear"}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#cee5ff] truncate mt-1.5">
                            {item.title || item.name}
                          </h3>
                        </div>
                        <span className="text-lg sm:text-xl font-black text-sky-400 tabular-nums">${item.price?.toFixed(2)}</span>
                      </div>
                      <p className="text-[#a3cbf2]/50 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-1 font-medium">
                        Listed by: <span className="text-[#a3cbf2]/80">{item.sellerName || item.seller || "Anonymous"}</span>
                      </p>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 sm:gap-2 bg-[#001526] border border-white/5 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 sm:p-1.5 hover:bg-white/5 rounded-md text-[#a3cbf2] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 sm:w-8 text-center font-bold text-sm text-[#cee5ff]">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 sm:p-1.5 hover:bg-white/5 rounded-md text-[#a3cbf2] transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            disabled={item.quantity >= (item.stockQuantity ?? 99)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-rose-400/70 hover:text-rose-400 hover:bg-rose-400/10 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                        >
                          <Trash2 size={16} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div ref={summaryRef} className="bg-[#002238] border border-white/5 rounded-3xl p-6 sticky top-24 shadow-2xl">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2.5 text-[#cee5ff]">
                  <CreditCard className="text-sky-400" size={24} />
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-[#a3cbf2]/80 font-medium">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-bold text-[#cee5ff] tabular-nums">${cartTotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#a3cbf2]/80 font-medium">
                    <span>Shipping Estimate</span>
                    <span className="font-bold tabular-nums">
                      {shipping === 0 ? <span className="text-emerald-400 uppercase text-xs tracking-wider">Free</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
             
                  <div className="clear-both" />
                </div>

                <div className="border-t border-white/10 pt-5 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-[#cee5ff]">Total</span>
                    <span className="text-3xl font-black text-sky-400 tabular-nums leading-none">${finalTotal?.toFixed(2)}</span>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 rounded-xl bg-sky-400 text-[#001526] font-black tracking-widest uppercase text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(83,214,251,0.2)] hover:shadow-[0_0_30px_rgba(83,214,251,0.4)] transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#001526] border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Checkout Now
                    </>
                  )}
                </motion.button>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[#a3cbf2]/40">
                  <ShieldCheck size={16} className="text-emerald-400/50" />
                  Secure encrypted transmission
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;